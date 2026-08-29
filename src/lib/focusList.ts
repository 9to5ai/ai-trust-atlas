import { conceptById, concepts, domainById } from '../data/concepts'
import { controlFamilies, controlObjectives } from '../data/controls'
import { instruments as corpusInstruments } from '../data/instruments'
import { riskDomainById, riskSubdomains } from '../data/mitRiskTaxonomy'
import { authorityOrder } from './labels'
import type { Concept, Instrument, SourceProvision } from '../types'

export type FocusListMode = 'instruments' | 'provisions'

export type FocusInstrumentRow = {
  instrument: Instrument
  sharedConcepts: Concept[]
  score: number
  connectionLabel: string
  relatedRiskCount: number
  relatedControlCount: number
  isSourceFoundation: boolean
}

export type FocusProvisionRow = {
  instrument: Instrument
  provision: SourceProvision
  concepts: Concept[]
}

export type FocusListModel = {
  anchorId: string
  anchorKind: string
  anchorLabel: string
  anchorEyebrow: string
  anchorSummary: string
  defaultMode: FocusListMode
  instruments: FocusInstrumentRow[]
  provisions: FocusProvisionRow[]
}

const unique = <T,>(values: T[]) => [...new Set(values)]

const provisionRecord = (provisionId: string) => {
  for (const instrument of corpusInstruments) {
    const provision = instrument.provisions.find((candidate) => candidate.id === provisionId)
    if (provision) return { instrument, provision }
  }
  return undefined
}

const contextFor = (anchorId: string) => {
  const [kind, id] = anchorId.split(':')

  if (kind === 'concept') {
    const concept = conceptById.get(id)
    return concept ? {
      kind,
      label: concept.name,
      eyebrow: 'Trust concept',
      summary: concept.definition,
      conceptIds: [concept.id],
      directInstrumentIds: [] as string[],
    } : undefined
  }

  if (kind === 'domain') {
    const domain = domainById.get(id)
    return domain ? {
      kind,
      label: domain.name,
      eyebrow: domain.role.replaceAll('-', ' '),
      summary: domain.definition,
      conceptIds: concepts.filter((concept) => concept.domainId === id).map((concept) => concept.id),
      directInstrumentIds: [] as string[],
    } : undefined
  }

  if (kind === 'instrument') {
    const instrument = corpusInstruments.find((candidate) => candidate.id === id)
    return instrument ? {
      kind,
      label: instrument.shortTitle,
      eyebrow: 'Source instrument',
      summary: instrument.summary,
      conceptIds: instrument.conceptIds,
      directInstrumentIds: [instrument.id],
    } : undefined
  }

  if (kind === 'provision') {
    const record = provisionRecord(id)
    return record ? {
      kind,
      label: `${record.provision.ref} · ${record.provision.title}`,
      eyebrow: record.instrument.shortTitle,
      summary: record.provision.summary,
      conceptIds: record.provision.conceptIds,
      directInstrumentIds: [record.instrument.id],
    } : undefined
  }

  if (kind === 'risk-subdomain') {
    const risk = riskSubdomains.find((candidate) => candidate.id === id)
    return risk ? {
      kind,
      label: `${risk.ref} · ${risk.name}`,
      eyebrow: 'MIT risk type',
      summary: risk.definition,
      conceptIds: risk.conceptIds,
      directInstrumentIds: [] as string[],
    } : undefined
  }

  if (kind === 'risk-domain') {
    const domain = riskDomainById.get(id)
    return domain ? {
      kind,
      label: domain.name,
      eyebrow: 'MIT risk domain',
      summary: domain.definition,
      conceptIds: unique(riskSubdomains.filter((risk) => risk.riskDomainId === id).flatMap((risk) => risk.conceptIds)),
      directInstrumentIds: [] as string[],
    } : undefined
  }

  if (kind === 'control-objective') {
    const control = controlObjectives.find((candidate) => candidate.id === id)
    return control ? {
      kind,
      label: `${control.code} · ${control.name}`,
      eyebrow: 'Control objective',
      summary: control.objective,
      conceptIds: control.conceptIds,
      directInstrumentIds: unique(control.sourceRefs.map((source) => source.instrumentId)),
    } : undefined
  }

  if (kind === 'control-family') {
    const family = controlFamilies.find((candidate) => candidate.id === id)
    const familyControls = controlObjectives.filter((control) => control.familyId === id)
    return family ? {
      kind,
      label: family.name,
      eyebrow: 'Control family',
      summary: family.definition,
      conceptIds: unique(familyControls.flatMap((control) => control.conceptIds)),
      directInstrumentIds: unique(familyControls.flatMap((control) => control.sourceRefs.map((source) => source.instrumentId))),
    } : undefined
  }

  return undefined
}

export const buildFocusListModel = (anchorId: string, eligibleInstruments: Instrument[] = corpusInstruments): FocusListModel | undefined => {
  const context = contextFor(anchorId)
  if (!context) return undefined

  const selectedInstrumentId = context.kind === 'instrument' ? anchorId.split(':')[1] : undefined
  const instrumentRows = eligibleInstruments.map((instrument): FocusInstrumentRow | undefined => {
    if (instrument.id === selectedInstrumentId) return undefined
    const sharedConceptIds = context.conceptIds.filter((conceptId) => instrument.conceptIds.includes(conceptId))
    const isSourceFoundation = context.directInstrumentIds.includes(instrument.id)
    if (sharedConceptIds.length === 0 && !isSourceFoundation) return undefined
    const sharedConcepts = sharedConceptIds.map((conceptId) => conceptById.get(conceptId)).filter((concept): concept is Concept => Boolean(concept))
    const relatedRiskCount = riskSubdomains.filter((risk) => risk.conceptIds.some((conceptId) => sharedConceptIds.includes(conceptId))).length
    const relatedControlCount = controlObjectives.filter((control) => control.conceptIds.some((conceptId) => sharedConceptIds.includes(conceptId))).length
    return {
      instrument,
      sharedConcepts,
      score: sharedConceptIds.length * 100 + (isSourceFoundation ? 1000 : 0),
      connectionLabel: isSourceFoundation
        ? `Source foundation${sharedConcepts.length ? ` · ${sharedConcepts.map((concept) => concept.name).slice(0, 2).join(' + ')}` : ''}`
        : `Connected through ${sharedConcepts.map((concept) => concept.name).slice(0, 3).join(' + ')}`,
      relatedRiskCount,
      relatedControlCount,
      isSourceFoundation,
    }
  }).filter((row): row is FocusInstrumentRow => Boolean(row))
    .sort((left, right) => right.score - left.score
      || authorityOrder.indexOf(left.instrument.authorityClass) - authorityOrder.indexOf(right.instrument.authorityClass)
      || left.instrument.shortTitle.localeCompare(right.instrument.shortTitle))

  const provisionOwner = context.kind === 'instrument'
    ? corpusInstruments.find((instrument) => instrument.id === selectedInstrumentId)
    : context.kind === 'provision'
      ? provisionRecord(anchorId.split(':')[1])?.instrument
      : undefined
  const provisions = provisionOwner?.provisions.map((provision) => ({
    instrument: provisionOwner,
    provision,
    concepts: provision.conceptIds.map((conceptId) => conceptById.get(conceptId)).filter((concept): concept is Concept => Boolean(concept)),
  })) ?? []

  return {
    anchorId,
    anchorKind: context.kind,
    anchorLabel: context.label,
    anchorEyebrow: context.eyebrow,
    anchorSummary: context.summary,
    defaultMode: provisions.length > 0 ? 'provisions' : 'instruments',
    instruments: instrumentRows,
    provisions,
  }
}
