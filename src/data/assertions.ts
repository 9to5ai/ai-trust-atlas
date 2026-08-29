import type { InstrumentRelation, MappingAssertion, MappingPredicate, SourceGranularity, SourceProvision } from '../types'
import { conceptById, concepts, domains } from './concepts'
import { controlObjectives } from './controls'
import { instruments } from './instruments'
import { MIT_RISK_SOURCE_URL, MIT_RISK_UPDATED, riskSubdomains } from './mitRiskTaxonomy'
import { relations } from './relations'

export const ASSERTION_MODEL_VERSION = '2026.08'
export const ASSERTION_MODEL_VERIFIED = '2026-08-29'

export const inferProvisionGranularity = (provision: SourceProvision): SourceGranularity => {
  if (provision.granularity) return provision.granularity
  const ref = provision.ref.toLowerCase()
  if (ref.includes('article') || /^art\.?\s/.test(ref)) return 'article'
  if (ref.includes('clause') || /^\d+(\.\d+)+$/.test(ref)) return 'clause'
  if (ref.includes('principle')) return 'principle'
  if (ref.includes('practice') || ref.includes('actions') || ref.includes('controls')) return 'practice'
  if (ref.includes('section') || ref.includes('chapter') || ref.includes('part ') || ref.includes('schedule')) return 'section'
  if (ref.includes('outcome') || ['govern', 'map', 'measure', 'manage'].includes(ref)) return 'outcome'
  return 'summary'
}

const base = (assertion: Omit<MappingAssertion, 'verifiedAt' | 'status'>): MappingAssertion => ({
  ...assertion,
  verifiedAt: ASSERTION_MODEL_VERIFIED,
  status: 'active',
})

const instrumentConceptAssertions = instruments.flatMap((instrument) => instrument.conceptIds.map((conceptId) => base({
  id: `map:instrument:${instrument.id}:concept:${conceptId}`,
  sourceNodeId: `instrument:${instrument.id}`,
  predicate: 'addresses',
  targetNodeId: `concept:${conceptId}`,
  rationale: `${instrument.shortTitle} is associated with ${conceptById.get(conceptId)?.name ?? conceptId} in the Atlas source review.`,
  basis: 'atlas-synthesis',
  confidence: 'high',
  citations: [{ sourceTitle: instrument.title, locator: 'Document-level mapping', url: instrument.officialUrl, accessedAt: instrument.lastVerified, sourceVersion: instrument.effective ?? instrument.published }],
  createdBy: 'AI Trust Atlas',
  inferenceDepth: 1,
})))

const provisionConceptAssertions = instruments.flatMap((instrument) => instrument.provisions.flatMap((provision) => provision.conceptIds.map((conceptId) => base({
  id: `map:provision:${provision.id}:concept:${conceptId}`,
  sourceNodeId: `provision:${provision.id}`,
  predicate: 'addresses',
  targetNodeId: `concept:${conceptId}`,
  rationale: `${provision.ref} “${provision.title}” is associated with ${conceptById.get(conceptId)?.name ?? conceptId}.`,
  basis: 'atlas-synthesis',
  confidence: 'high',
  citations: [{ sourceTitle: instrument.title, locator: provision.ref, url: provision.sourceUrl ?? instrument.officialUrl, accessedAt: instrument.lastVerified, sourceVersion: instrument.effective ?? instrument.published }],
  createdBy: 'AI Trust Atlas',
  inferenceDepth: 1,
}))))

const riskConceptAssertions = riskSubdomains.flatMap((risk) => risk.conceptIds.map((conceptId) => {
  const concept = conceptById.get(conceptId)
  const predicate: MappingPredicate = concept?.role === 'trust-objective' ? 'threatens' : 'relevant-to'
  return base({
    id: `map:risk:${risk.id}:concept:${conceptId}`,
    sourceNodeId: `risk-subdomain:${risk.id}`,
    predicate,
    targetNodeId: `concept:${conceptId}`,
    rationale: predicate === 'threatens'
      ? `${risk.ref} ${risk.name} can undermine the trust objective ${concept?.name ?? conceptId}.`
      : `${concept?.name ?? conceptId} is relevant to identifying, governing, evaluating or responding to ${risk.ref} ${risk.name}.`,
    basis: 'atlas-synthesis',
    confidence: risk.mappingConfidence,
    citations: [{ sourceTitle: 'MIT AI Risk Repository', locator: `${risk.ref} ${risk.name}`, url: MIT_RISK_SOURCE_URL, accessedAt: ASSERTION_MODEL_VERIFIED, sourceVersion: MIT_RISK_UPDATED }],
    createdBy: 'AI Trust Atlas',
    inferenceDepth: 1,
  })
}))

const controlAssertions = controlObjectives.flatMap((control) => [
  base({
    id: `map:family:${control.familyId}:control:${control.id}`,
    sourceNodeId: `control-family:${control.familyId}`,
    predicate: 'contains',
    targetNodeId: `control-objective:${control.id}`,
    rationale: `${control.code} is organised within the ${control.familyId.replaceAll('-', ' ')} control family.`,
    basis: 'atlas-synthesis', confidence: 'high', citations: control.sourceRefs.slice(0, 1).map((source) => ({ sourceTitle: source.sourceTitle, locator: source.locator, url: source.url, accessedAt: ASSERTION_MODEL_VERIFIED })), createdBy: 'AI Trust Atlas', inferenceDepth: 1,
  }),
  ...control.conceptIds.map((conceptId) => base({
    id: `map:control:${control.id}:concept:${conceptId}`,
    sourceNodeId: `control-objective:${control.id}`,
    predicate: 'supports' as const,
    targetNodeId: `concept:${conceptId}`,
    rationale: `${control.code} is intended to support ${conceptById.get(conceptId)?.name ?? conceptId}; adequacy depends on context, design and implementation.`,
    basis: 'atlas-synthesis' as const, confidence: 'high' as const, citations: control.sourceRefs.map((source) => ({ sourceTitle: source.sourceTitle, locator: source.locator, url: source.url, accessedAt: ASSERTION_MODEL_VERIFIED })), createdBy: 'AI Trust Atlas' as const, inferenceDepth: 1 as const,
  })),
  ...control.riskIds.map((riskId) => base({
    id: `map:control:${control.id}:risk:${riskId}`,
    sourceNodeId: `control-objective:${control.id}`,
    predicate: 'may-address' as const,
    targetNodeId: `risk-subdomain:${riskId}`,
    rationale: `${control.code} may help prevent, detect, respond to or recover from this risk. This mapping does not establish implementation or effectiveness.`,
    basis: 'atlas-synthesis' as const, confidence: 'high' as const, citations: control.sourceRefs.map((source) => ({ sourceTitle: source.sourceTitle, locator: source.locator, url: source.url, accessedAt: ASSERTION_MODEL_VERIFIED })), createdBy: 'AI Trust Atlas' as const, inferenceDepth: 1 as const,
  })),
  ...control.sourceRefs.map((source, index) => base({
    id: `map:control:${control.id}:source:${source.instrumentId}:${index}`,
    sourceNodeId: `control-objective:${control.id}`,
    predicate: 'synthesised-from' as const,
    targetNodeId: `instrument:${source.instrumentId}`,
    rationale: `${control.code} is an Atlas-normalised objective informed by ${source.sourceTitle} at ${source.locator}.`,
    basis: source.sourceKind === 'crosswalk' ? 'published-crosswalk' as const : 'atlas-synthesis' as const,
    confidence: 'high' as const,
    citations: [{ sourceTitle: source.sourceTitle, locator: source.locator, url: source.url, accessedAt: ASSERTION_MODEL_VERIFIED }],
    createdBy: 'AI Trust Atlas' as const,
    inferenceDepth: 1 as const,
  })),
]).flat()

const relationPredicate = (relation: InstrumentRelation): MappingPredicate => {
  if (['requires', 'applies-to'].includes(relation.type)) return 'requires'
  if (['operationalises', 'implements', 'guides-implementation-of', 'profiles'].includes(relation.type)) return 'operationalises'
  return 'aligns-with'
}

const instrumentRelationAssertions = relations.map((relation) => {
  const source = instruments.find((instrument) => instrument.id === relation.sourceId)
  const target = instruments.find((instrument) => instrument.id === relation.targetId)
  return base({
    id: `map:relation:${relation.id}`,
    sourceNodeId: `instrument:${relation.sourceId}`,
    predicate: relationPredicate(relation),
    targetNodeId: `instrument:${relation.targetId}`,
    rationale: relation.explanation,
    basis: relation.basis === 'explicit' ? 'source-authored' : 'atlas-synthesis',
    confidence: relation.confidence,
    citations: [source, target].filter((instrument): instrument is NonNullable<typeof instrument> => Boolean(instrument)).map((instrument, index) => ({
      sourceTitle: instrument.title,
      locator: relation.sourceAnchors[index] ?? 'Document-level relationship',
      url: instrument.officialUrl,
      accessedAt: instrument.lastVerified,
      sourceVersion: instrument.effective ?? instrument.published,
    })),
    createdBy: relation.basis === 'explicit' ? 'source' : 'AI Trust Atlas',
    inferenceDepth: relation.basis === 'explicit' ? 0 : 1,
  })
})

const structuralAssertions = [
  ...domains.flatMap((domain) => concepts.filter((concept) => concept.domainId === domain.id).map((concept) => base({
    id: `map:domain:${domain.id}:concept:${concept.id}`,
    sourceNodeId: `domain:${domain.id}`,
    predicate: 'contains' as const,
    targetNodeId: `concept:${concept.id}`,
    rationale: `${concept.name} is placed in ${domain.name} as its primary visual theme; the domain is a navigation facet rather than an exclusive semantic parent.`,
    basis: 'atlas-synthesis' as const,
    confidence: 'high' as const,
    citations: [],
    createdBy: 'AI Trust Atlas' as const,
    inferenceDepth: 1 as const,
  }))),
]

export const mappingAssertions: MappingAssertion[] = [
  ...structuralAssertions,
  ...instrumentConceptAssertions,
  ...provisionConceptAssertions,
  ...riskConceptAssertions,
  ...controlAssertions,
  ...instrumentRelationAssertions,
]

export const mappingAssertionById = new Map(mappingAssertions.map((assertion) => [assertion.id, assertion]))
export const assertionsForNode = (nodeId: string) => mappingAssertions.filter((assertion) => assertion.sourceNodeId === nodeId || assertion.targetNodeId === nodeId)

export type RiskPath = {
  riskId: string
  conceptIds: string[]
  provisionIds: string[]
  score: number
  confidence: 'high' | 'medium'
}

export const riskPathsForInstrument = (instrumentId: string): RiskPath[] => {
  const instrument = instruments.find((candidate) => candidate.id === instrumentId)
  if (!instrument) return []
  return riskSubdomains.map((risk) => {
    const conceptIds = risk.conceptIds.filter((conceptId) => instrument.conceptIds.includes(conceptId))
    const provisionIds = instrument.provisions.filter((provision) => provision.conceptIds.some((conceptId) => conceptIds.includes(conceptId))).map((provision) => provision.id)
    return { riskId: risk.id, conceptIds, provisionIds, score: conceptIds.length * 10 + provisionIds.length * 6 + (risk.mappingConfidence === 'high' ? 2 : 0), confidence: risk.mappingConfidence }
  }).filter((path) => path.conceptIds.length > 0).sort((left, right) => right.score - left.score || left.riskId.localeCompare(right.riskId))
}

export const riskPathsForProvision = (provisionId: string): RiskPath[] => {
  const provision = instruments.flatMap((instrument) => instrument.provisions).find((candidate) => candidate.id === provisionId)
  if (!provision) return []
  return riskSubdomains.map((risk) => {
    const conceptIds = risk.conceptIds.filter((conceptId) => provision.conceptIds.includes(conceptId))
    return { riskId: risk.id, conceptIds, provisionIds: [provision.id], score: conceptIds.length * 10 + (risk.mappingConfidence === 'high' ? 2 : 0), confidence: risk.mappingConfidence }
  }).filter((path) => path.conceptIds.length > 0).sort((left, right) => right.score - left.score || left.riskId.localeCompare(right.riskId))
}
