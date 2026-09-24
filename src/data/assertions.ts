import type { InstrumentRelation, MappingAssertion, MappingPredicate, SourceGranularity, SourceProvision } from '../types'
import { conceptById, concepts, domains } from './concepts'
import { controlObjectives } from './controls'
import { instruments } from './instruments'
import { MIT_RISK_SOURCE_URL, MIT_RISK_UPDATED, riskSubdomains } from './mitRiskTaxonomy'
import { relations } from './relations'
import { requirements } from './requirements'
import { crosswalkLinks, publishedCrosswalks } from './crosswalks'

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
  verifiedAt: assertion.citations.reduce((latest, citation) => citation.accessedAt > latest ? citation.accessedAt : latest, ASSERTION_MODEL_VERIFIED),
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

// A section-to-concept link becomes source-authored when a recorded requirement in that section states it.
const requirementFor = (provisionId: string, conceptId: string) => requirements.find((item) => item.provisionId === provisionId && item.conceptIds.includes(conceptId))
const provisionConceptAssertions = instruments.flatMap((instrument) => instrument.provisions.flatMap((provision) => provision.conceptIds.map((conceptId) => {
  const requirement = requirementFor(provision.id, conceptId)
  return base({
    id: `map:provision:${provision.id}:concept:${conceptId}`,
    sourceNodeId: `provision:${provision.id}`,
    predicate: requirement ? 'requires' : 'addresses',
    targetNodeId: `concept:${conceptId}`,
    rationale: requirement ? `${requirement.ref}: ${requirement.summary}` : `${provision.ref} “${provision.title}” is associated with ${conceptById.get(conceptId)?.name ?? conceptId}.`,
    basis: requirement ? 'source-authored' : 'atlas-synthesis',
    confidence: 'high',
    citations: [{ sourceTitle: instrument.title, locator: requirement?.ref ?? provision.ref, url: requirement?.sourceUrl ?? provision.sourceUrl ?? instrument.officialUrl, accessedAt: requirement?.reviewedAt ?? provision.reviewedAt ?? instrument.lastVerified, sourceVersion: instrument.effective ?? instrument.published }],
    createdBy: requirement ? 'source' : 'AI Trust Atlas',
    inferenceDepth: requirement ? 0 : 1,
  })
})))

// Requirements whose concepts are not already on their section (or that have no section) add their own source-authored links.
const requirementConceptAssertions = requirements.flatMap((item) => {
  const instrument = instruments.find((source) => source.id === item.instrumentId)
  const provision = instrument?.provisions.find((section) => section.id === item.provisionId)
  if (!instrument) return []
  return item.conceptIds.filter((conceptId) => !provision?.conceptIds.includes(conceptId)).map((conceptId) => base({
    id: `map:requirement:${item.id}:concept:${conceptId}`,
    sourceNodeId: provision ? `provision:${provision.id}` : `instrument:${instrument.id}`,
    predicate: 'requires',
    targetNodeId: `concept:${conceptId}`,
    rationale: `${item.ref}: ${item.summary}`,
    basis: 'source-authored',
    confidence: 'high',
    citations: [{ sourceTitle: instrument.title, locator: item.ref, url: item.sourceUrl, accessedAt: item.reviewedAt, sourceVersion: instrument.effective ?? instrument.published }],
    createdBy: 'source',
    inferenceDepth: 0,
  }))
})

// Candidate controls for a requirement are Atlas interpretation.
const requirementControlAssertions = requirements.flatMap((item) => {
  const instrument = instruments.find((source) => source.id === item.instrumentId)
  if (!instrument) return []
  const node = item.provisionId && instrument.provisions.some((section) => section.id === item.provisionId) ? `provision:${item.provisionId}` : `instrument:${instrument.id}`
  return item.controlIds.map((controlId) => base({
    id: `map:requirement:${item.id}:control:${controlId}`,
    sourceNodeId: `control-objective:${controlId}`,
    predicate: 'operationalises',
    targetNodeId: node,
    rationale: `A candidate way to meet ${item.ref} (${item.title}). This does not establish that the control is implemented or sufficient.`,
    basis: 'atlas-synthesis',
    confidence: 'medium',
    citations: [{ sourceTitle: instrument.title, locator: item.ref, url: item.sourceUrl, accessedAt: item.reviewedAt, sourceVersion: instrument.effective ?? instrument.published }],
    createdBy: 'AI Trust Atlas',
    inferenceDepth: 1,
  }))
})

// Section-to-section links taken from a published crosswalk.
const crosswalkAssertions = crosswalkLinks.flatMap((link) => {
  const crosswalk = publishedCrosswalks.find((item) => item.id === link.crosswalkId)
  if (!crosswalk) return []
  return [base({
    id: `map:crosswalk:${link.id}`,
    sourceNodeId: `provision:${link.from.provisionId}`,
    predicate: 'aligns-with',
    targetNodeId: `provision:${link.to.provisionId}`,
    rationale: link.note ?? `${crosswalk.publisher} pairs these items in ${crosswalk.title}.`,
    basis: 'published-crosswalk',
    // Community crosswalks hosted without endorsement are useful but not authoritative.
    confidence: 'medium',
    citations: [{ sourceTitle: crosswalk.title, locator: 'Crosswalk table', url: crosswalk.url, accessedAt: '2026-09-25', sourceVersion: crosswalk.published }],
    createdBy: 'source',
    inferenceDepth: 0,
  })]
})

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
  if (relation.type === 'made-under' || relation.type === 'issuer-governed-by') return relation.type
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
    citations: relation.citations ?? [source, target].filter((instrument): instrument is NonNullable<typeof instrument> => Boolean(instrument)).map((instrument, index) => ({
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
  ...requirementConceptAssertions,
  ...requirementControlAssertions,
  ...crosswalkAssertions,
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

// Broad governance concepts alone are insufficient for a useful suggested risk path.
// This is a navigation heuristic, not a source-authored mapping or confidence assessment.
export const specificConceptIds = (ids: string[]) => ids.filter(id => !new Set(['accountability', 'third-party-risk', 'assurance', 'evidence-quality', 'traceability', 'decision-rights', 'competence', 'risk-treatment', 'materiality', 'lifecycle-governance', 'continuous-monitoring', 'inventory']).has(id))

export const riskPathsForInstrument = (instrumentId: string): RiskPath[] => {
  const instrument = instruments.find((candidate) => candidate.id === instrumentId)
  if (!instrument) return []
  return riskSubdomains.map((risk) => {
    const conceptIds = risk.conceptIds.filter((conceptId) => instrument.conceptIds.includes(conceptId))
    const provisionIds = instrument.provisions.filter((provision) => provision.conceptIds.some((conceptId) => specificConceptIds(conceptIds).includes(conceptId))).map((provision) => provision.id)
    return { riskId: risk.id, conceptIds, provisionIds, score: specificConceptIds(conceptIds).length * 20 + conceptIds.length * 2 + provisionIds.length * 6 + (risk.mappingConfidence === 'high' ? 2 : 0), confidence: risk.mappingConfidence }
  }).filter((path) => specificConceptIds(path.conceptIds).length > 0 && path.provisionIds.length > 0).sort((left, right) => right.score - left.score || left.riskId.localeCompare(right.riskId))
}

export const riskPathsForProvision = (provisionId: string): RiskPath[] => {
  const provision = instruments.flatMap((instrument) => instrument.provisions).find((candidate) => candidate.id === provisionId)
  if (!provision) return []
  return riskSubdomains.map((risk) => {
    const conceptIds = risk.conceptIds.filter((conceptId) => provision.conceptIds.includes(conceptId))
    return { riskId: risk.id, conceptIds, provisionIds: [provision.id], score: specificConceptIds(conceptIds).length * 20 + conceptIds.length * 2 + (risk.mappingConfidence === 'high' ? 2 : 0), confidence: risk.mappingConfidence }
  }).filter((path) => specificConceptIds(path.conceptIds).length > 0 && path.provisionIds.length > 0).sort((left, right) => right.score - left.score || left.riskId.localeCompare(right.riskId))
}
