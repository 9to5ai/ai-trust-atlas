import { concepts, domainById, domains } from '../data/concepts'
import { instruments } from '../data/instruments'
import { relations } from '../data/relations'
import type { AuthorityClass, GraphEdge, GraphModel, GraphNode, Instrument } from '../types'

export type LayoutMode = 'ontology' | 'authority'

export type GraphFilters = {
  query: string
  authorityClasses: Set<AuthorityClass>
  regions: Set<Instrument['region']>
}

const authorityOrder: AuthorityClass[] = [
  'law',
  'regulatory-expectation',
  'government-guidance',
  'government-policy',
  'international-treaty',
  'financial-sector-guidance',
  'analytical-report',
  'international-standard',
  'risk-framework',
  'testing-framework',
  'threat-knowledge',
]

const authorityRadius = new Map(authorityOrder.map((authority, index) => [authority, 430 + index * 24]))

const hash = (value: string) => {
  let output = 0
  for (let index = 0; index < value.length; index += 1) output = ((output << 5) - output + value.charCodeAt(index)) | 0
  return Math.abs(output)
}

const polar = (angle: number, radius: number) => ({ x: Math.cos(angle) * radius, y: Math.sin(angle) * radius })

const primaryDomainFor = (instrument: Instrument) => {
  const scores = new Map<string, number>()
  for (const conceptId of instrument.conceptIds) {
    const domainId = concepts.find((concept) => concept.id === conceptId)?.domainId
    if (domainId) scores.set(domainId, (scores.get(domainId) ?? 0) + 1)
  }
  const highest = Math.max(...scores.values(), 0)
  const candidates = domains.filter((domain) => scores.get(domain.id) === highest)
  return candidates[hash(instrument.id) % Math.max(candidates.length, 1)]?.id ?? 'governance'
}

const instrumentDepth = (instrument: Instrument) => {
  const authorityDepth = (authorityOrder.indexOf(instrument.authorityClass) - (authorityOrder.length - 1) / 2) * 14
  const regionalDepth = instrument.region === 'Australia' ? 118 : instrument.region === 'Global' ? -62 : -18
  const stableOffset = (hash(instrument.id) % 41) - 20
  return Math.max(-150, Math.min(160, authorityDepth + regionalDepth + stableOffset))
}

const includesQuery = (instrument: Instrument, query: string) => {
  if (!query.trim()) return true
  const normalized = query.toLowerCase().trim()
  return [instrument.title, instrument.shortTitle, instrument.issuer, instrument.jurisdiction, instrument.summary, ...instrument.sectors]
    .join(' ')
    .toLowerCase()
    .includes(normalized)
}

const instrumentVisible = (instrument: Instrument, filters: GraphFilters) => {
  const authorityVisible = filters.authorityClasses.size === 0 || filters.authorityClasses.has(instrument.authorityClass)
  const regionVisible = filters.regions.size === 0 || filters.regions.has(instrument.region)
  return authorityVisible && regionVisible && includesQuery(instrument, filters.query)
}

export function buildGraphModel(
  mode: LayoutMode,
  filters: GraphFilters,
  selectedInstrumentId?: string,
): GraphModel {
  const nodes: GraphNode[] = []
  const edges: GraphEdge[] = []
  const domainAngles = new Map(domains.map((domain, index) => [domain.id, (index / domains.length) * Math.PI * 2 - Math.PI / 2]))

  for (const domain of domains) {
    const angle = domainAngles.get(domain.id) ?? 0
    const point = polar(angle, mode === 'ontology' ? 205 : 192)
    nodes.push({
      id: `domain:${domain.id}`,
      label: domain.name,
      shortLabel: domain.shortName,
      kind: 'domain',
      domainId: domain.id,
      x: point.x,
      y: point.y,
      z: 36,
      targetX: point.x,
      targetY: point.y,
      targetZ: 36,
      radius: 17,
      color: domain.color,
    })
  }

  const conceptsByDomain = new Map<string, typeof concepts>()
  for (const concept of concepts) {
    const group = conceptsByDomain.get(concept.domainId) ?? []
    group.push(concept)
    conceptsByDomain.set(concept.domainId, group)
  }

  for (const [domainId, group] of conceptsByDomain) {
    const domainAngle = domainAngles.get(domainId) ?? 0
    group.forEach((concept, index) => {
      const spread = (index - (group.length - 1) / 2) * 0.048
      const radius = 315 + (index % 2) * 30
      const point = polar(domainAngle + spread, radius)
      const depth = ((hash(concept.id) % 61) - 30) * 0.8
      const color = domainById.get(domainId)?.color ?? '#aab3c0'
      nodes.push({
        id: `concept:${concept.id}`,
        label: concept.name,
        shortLabel: concept.name,
        kind: 'concept',
        domainId,
        x: point.x,
        y: point.y,
        z: depth,
        targetX: point.x,
        targetY: point.y,
        targetZ: depth,
        radius: 6.5,
        color,
      })
      edges.push({ id: `domain-concept:${concept.id}`, sourceId: `domain:${domainId}`, targetId: `concept:${concept.id}`, label: 'contains' })
    })
  }

  const visibleInstruments = instruments.filter((instrument) => instrumentVisible(instrument, filters))
  const instrumentsByPrimaryDomain = new Map<string, Instrument[]>()
  for (const instrument of visibleInstruments) {
    const primaryDomain = primaryDomainFor(instrument)
    const group = instrumentsByPrimaryDomain.get(primaryDomain) ?? []
    group.push(instrument)
    instrumentsByPrimaryDomain.set(primaryDomain, group)
  }

  for (const [domainId, group] of instrumentsByPrimaryDomain) {
    group.sort((a, b) => authorityOrder.indexOf(a.authorityClass) - authorityOrder.indexOf(b.authorityClass) || a.shortTitle.localeCompare(b.shortTitle))
    const columns = Math.max(2, Math.ceil(Math.sqrt(group.length * 1.35)))
    const rows = Math.ceil(group.length / columns)
    const sectorWidth = (Math.PI * 2 / domains.length) * 0.7
    group.forEach((instrument, index) => {
      const domainAngle = domainAngles.get(domainId) ?? 0
      const column = index % columns
      const row = Math.floor(index / columns)
      const angularOffset = columns === 1 ? 0 : ((column / (columns - 1)) - 0.5) * sectorWidth
      const rowOffset = row - (rows - 1) / 2
      const stableOffset = ((hash(instrument.id) % 101) / 100 - 0.5) * 0.018
      const baseRadius = mode === 'authority'
        ? (authorityRadius.get(instrument.authorityClass) ?? 540)
        : 465 + rowOffset * 42
      const point = polar(domainAngle + angularOffset + stableOffset, baseRadius)
      const depth = instrumentDepth(instrument)
      const color = domainById.get(domainId)?.color ?? '#aab3c0'
      nodes.push({
        id: `instrument:${instrument.id}`,
        label: instrument.title,
        shortLabel: instrument.shortTitle,
        kind: 'instrument',
        domainId,
        instrumentId: instrument.id,
        authorityClass: instrument.authorityClass,
        region: instrument.region,
        x: point.x,
        y: point.y,
        z: depth,
        targetX: point.x,
        targetY: point.y,
        targetZ: depth,
        radius: instrument.region === 'Australia' ? 10.5 : 8.5,
        color,
      })

      instrument.conceptIds.forEach((conceptId) => {
        if (!concepts.some((concept) => concept.id === conceptId)) return
        edges.push({
          id: `instrument-concept:${instrument.id}:${conceptId}`,
          sourceId: `instrument:${instrument.id}`,
          targetId: `concept:${conceptId}`,
          label: 'addresses',
        })
      })
    })
  }

  const visibleInstrumentIds = new Set(visibleInstruments.map((instrument) => instrument.id))
  for (const relation of relations) {
    if (!visibleInstrumentIds.has(relation.sourceId) || !visibleInstrumentIds.has(relation.targetId)) continue
    edges.push({
      id: `relation:${relation.id}`,
      sourceId: `instrument:${relation.sourceId}`,
      targetId: `instrument:${relation.targetId}`,
      label: relation.type,
      relationType: relation.type,
      basis: relation.basis,
      confidence: relation.confidence,
      explanation: relation.explanation,
    })
  }

  const selectedInstrument = selectedInstrumentId ? instruments.find((instrument) => instrument.id === selectedInstrumentId) : undefined
  const selectedNode = selectedInstrument ? nodes.find((node) => node.id === `instrument:${selectedInstrument.id}`) : undefined
  if (selectedInstrument && selectedNode) {
    selectedInstrument.clauses.forEach((clause, index) => {
      const angle = (index / Math.max(selectedInstrument.clauses.length, 1)) * Math.PI * 2 - Math.PI / 2
      const radius = 82 + (index % 2) * 18
      const point = { x: selectedNode.targetX + Math.cos(angle) * radius, y: selectedNode.targetY + Math.sin(angle) * radius }
      nodes.push({
        id: `clause:${clause.id}`,
        label: `${clause.ref}: ${clause.title}`,
        shortLabel: clause.ref,
        kind: 'clause',
        domainId: selectedNode.domainId,
        instrumentId: selectedInstrument.id,
        x: point.x,
        y: point.y,
        z: selectedNode.targetZ + 18,
        targetX: point.x,
        targetY: point.y,
        targetZ: selectedNode.targetZ + 18,
        radius: 5.5,
        color: selectedNode.color,
      })
      edges.push({
        id: `instrument-clause:${clause.id}`,
        sourceId: `instrument:${selectedInstrument.id}`,
        targetId: `clause:${clause.id}`,
        label: 'contains clause',
      })
    })
  }

  return { nodes, edges }
}

export const defaultFilters = (): GraphFilters => ({ query: '', authorityClasses: new Set(), regions: new Set() })
