import { mappingAssertionById, mappingAssertions } from '../data/assertions'
import { concepts, domainById, domains } from '../data/concepts'
import { controlFamilies, controlFamilyById, controlObjectives, controlsForConcept, controlsForRisk } from '../data/controls'
import { instruments } from '../data/instruments'
import { countForCausalLens, riskDomainById, riskDomains, riskSubdomainById, riskSubdomains, type CausalLens } from '../data/mitRiskTaxonomy'
import { relations } from '../data/relations'
import { authorityOrder } from './labels'
import type { AuthorityClass, GraphEdge, GraphModel, GraphNode, Instrument, MappingAssertion } from '../types'

export type LayoutMode = 'ontology' | 'authority' | 'risk' | 'controls'

export type GraphFilters = {
  query: string
  authorityClasses: Set<AuthorityClass>
  regions: Set<Instrument['region']>
}

const authorityRadius = new Map(authorityOrder.map((authority, index) => [authority, 420 + index * 23]))

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
  return [instrument.title, instrument.shortTitle, instrument.issuer, instrument.jurisdiction, instrument.summary, ...instrument.sectors].join(' ').toLowerCase().includes(normalized)
}

const instrumentVisible = (instrument: Instrument, filters: GraphFilters) => {
  const authorityVisible = filters.authorityClasses.size === 0 || filters.authorityClasses.has(instrument.authorityClass)
  const regionVisible = filters.regions.size === 0 || filters.regions.has(instrument.region)
  return authorityVisible && regionVisible && includesQuery(instrument, filters.query)
}

const edgeFromAssertion = (assertion: MappingAssertion, semanticFamily: GraphEdge['semanticFamily']): GraphEdge => ({
  id: assertion.id,
  sourceId: assertion.sourceNodeId,
  targetId: assertion.targetNodeId,
  label: assertion.predicate,
  semanticFamily,
  basis: assertion.basis === 'source-authored' ? 'explicit' : 'cross-framework-synthesis',
  confidence: assertion.confidence,
  explanation: assertion.rationale,
})

const addDomainsAndConcepts = (nodes: GraphNode[], edges: GraphEdge[], mode: LayoutMode) => {
  const domainAngles = new Map(domains.map((domain, index) => [domain.id, (index / domains.length) * Math.PI * 2 - Math.PI / 2]))
  for (const domain of domains) {
    const angle = domainAngles.get(domain.id) ?? 0
    const point = polar(angle, mode === 'risk' ? 168 : 205)
    const depth = domain.role === 'context-facet' ? -24 : 36
    nodes.push({ id: `domain:${domain.id}`, label: domain.name, shortLabel: domain.shortName, kind: 'domain', domainId: domain.id, x: point.x, y: point.y, z: depth, targetX: point.x, targetY: point.y, targetZ: depth, radius: domain.role === 'context-facet' ? 13 : 17, color: domain.color })
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
      const radius = mode === 'risk' ? 270 + (index % 2) * 24 : 315 + (index % 2) * 30
      const point = polar(domainAngle + spread, radius)
      const depth = ((hash(concept.id) % 61) - 30) * 0.8
      const color = domainById.get(domainId)?.color ?? '#aab3c0'
      nodes.push({ id: `concept:${concept.id}`, label: concept.name, shortLabel: concept.name, kind: 'concept', domainId, x: point.x, y: point.y, z: depth, targetX: point.x, targetY: point.y, targetZ: depth, radius: concept.role === 'trust-objective' ? 7 : 6, color })
      const assertion = mappingAssertionById.get(`map:domain:${domainId}:concept:${concept.id}`)
      if (assertion) edges.push(edgeFromAssertion(assertion, 'structure'))
    })
  }
  return domainAngles
}

const addControlNodes = (nodes: GraphNode[], edges: GraphEdge[], visibleControlIds: Set<string>) => {
  const familyAngles = new Map(controlFamilies.map((family, index) => [family.id, (index / controlFamilies.length) * Math.PI * 2 - Math.PI / 2]))
  for (const family of controlFamilies) {
    const familyControls = controlObjectives.filter((control) => control.familyId === family.id && visibleControlIds.has(control.id))
    if (familyControls.length === 0) continue
    const familyPoint = polar(familyAngles.get(family.id) ?? 0, 172)
    nodes.push({ id: `control-family:${family.id}`, label: family.name, shortLabel: family.shortName, kind: 'control-family', domainId: 'controls', controlFamilyId: family.id, x: familyPoint.x, y: familyPoint.y, z: 42, targetX: familyPoint.x, targetY: familyPoint.y, targetZ: 42, radius: 17, color: family.color })
    const sectorWidth = (Math.PI * 2 / controlFamilies.length) * 0.74
    familyControls.forEach((control, index) => {
      const spread = familyControls.length === 1 ? 0 : ((index / (familyControls.length - 1)) - 0.5) * sectorWidth
      const point = polar((familyAngles.get(family.id) ?? 0) + spread, 420 + (index % 2) * 46)
      const depth = ((hash(control.id) % 101) - 50) * 1.2
      nodes.push({ id: `control-objective:${control.id}`, label: `${control.code} ${control.name}`, shortLabel: `${control.code} ${control.shortName}`, kind: 'control-objective', domainId: 'controls', controlFamilyId: control.familyId, x: point.x, y: point.y, z: depth, targetX: point.x, targetY: point.y, targetZ: depth, radius: 9.2, color: controlFamilyById.get(control.familyId)?.color ?? '#8ad7d0' })
      const assertion = mappingAssertionById.get(`map:family:${control.familyId}:control:${control.id}`)
      if (assertion) edges.push(edgeFromAssertion(assertion, 'control'))
    })
  }
}

const addControlsAroundSelection = (nodes: GraphNode[], edges: GraphEdge[], selectedNodeId: string, controlIds: string[]) => {
  const selected = nodes.find((node) => node.id === selectedNodeId)
  if (!selected) return
  controlIds.forEach((controlId, index) => {
    if (nodes.some((node) => node.id === `control-objective:${controlId}`)) return
    const control = controlObjectives.find((candidate) => candidate.id === controlId)
    if (!control) return
    const angle = (index / Math.max(controlIds.length, 1)) * Math.PI * 2 - Math.PI / 2
    const distance = 95 + (index % 2) * 22
    const point = { x: selected.targetX + Math.cos(angle) * distance, y: selected.targetY + Math.sin(angle) * distance }
    nodes.push({ id: `control-objective:${control.id}`, label: `${control.code} ${control.name}`, shortLabel: `${control.code} ${control.shortName}`, kind: 'control-objective', domainId: 'controls', controlFamilyId: control.familyId, x: point.x, y: point.y, z: selected.targetZ + 24, targetX: point.x, targetY: point.y, targetZ: selected.targetZ + 24, radius: 8.6, color: controlFamilyById.get(control.familyId)?.color ?? '#8ad7d0' })
    const targetId = selectedNodeId.replace(selected.kind === 'risk-subdomain' ? 'risk-subdomain:' : 'concept:', '')
    const assertionId = selected.kind === 'risk-subdomain' ? `map:control:${control.id}:risk:${targetId}` : `map:control:${control.id}:concept:${targetId}`
    const assertion = mappingAssertionById.get(assertionId)
    if (assertion) edges.push(edgeFromAssertion(assertion, 'control'))
  })
}

export function buildGraphModel(mode: LayoutMode, filters: GraphFilters, selectedNodeId?: string, causalLens: CausalLens = 'all'): GraphModel {
  const nodes: GraphNode[] = []
  const edges: GraphEdge[] = []
  const domainAngles = mode === 'controls' ? new Map<string, number>() : addDomainsAndConcepts(nodes, edges, mode)

  if (mode === 'controls') {
    const normalized = filters.query.toLowerCase().trim()
    const visibleIds = new Set(controlObjectives.filter((control) => !normalized || [control.code, control.name, control.objective, control.purpose, ...control.conceptIds].join(' ').toLowerCase().includes(normalized)).map((control) => control.id))
    addControlNodes(nodes, edges, visibleIds)
    const selectedControlId = selectedNodeId?.startsWith('control-objective:') ? selectedNodeId.replace('control-objective:', '') : undefined
    const selected = selectedControlId ? controlObjectives.find((control) => control.id === selectedControlId) : undefined
    if (selected) {
      selected.conceptIds.forEach((conceptId, index) => {
        const concept = concepts.find((candidate) => candidate.id === conceptId)
        if (!concept) return
        const point = polar((index / selected.conceptIds.length) * Math.PI * 2 - Math.PI / 2, 285)
        const color = domainById.get(concept.domainId)?.color ?? '#aab3c0'
        nodes.push({ id: `concept:${concept.id}`, label: concept.name, shortLabel: concept.name, kind: 'concept', domainId: concept.domainId, x: point.x, y: point.y, z: 8, targetX: point.x, targetY: point.y, targetZ: 8, radius: 6.5, color })
        const assertion = mappingAssertionById.get(`map:control:${selected.id}:concept:${concept.id}`)
        if (assertion) edges.push(edgeFromAssertion(assertion, 'control'))
      })
      selected.riskIds.slice(0, 8).forEach((riskId, index) => {
        const risk = riskSubdomainById.get(riskId)
        if (!risk) return
        const point = polar((index / Math.min(selected.riskIds.length, 8)) * Math.PI * 2 - Math.PI / 2, 558)
        const color = riskDomainById.get(risk.riskDomainId)?.color ?? '#9c94c2'
        nodes.push({ id: `risk-subdomain:${risk.id}`, label: `${risk.ref} ${risk.name}`, shortLabel: `${risk.ref} ${risk.name}`, kind: 'risk-subdomain', domainId: 'mit-risk', riskDomainId: risk.riskDomainId, recordCount: countForCausalLens(risk, causalLens), x: point.x, y: point.y, z: -18, targetX: point.x, targetY: point.y, targetZ: -18, radius: 8.2, color })
        const assertion = mappingAssertionById.get(`map:control:${selected.id}:risk:${risk.id}`)
        if (assertion) edges.push(edgeFromAssertion(assertion, 'control'))
      })
    }
  }

  if (mode === 'ontology' || mode === 'authority') {
    const visibleInstruments = instruments.filter((instrument) => instrumentVisible(instrument, filters))
    const byDomain = new Map<string, Instrument[]>()
    for (const instrument of visibleInstruments) {
      const domainId = primaryDomainFor(instrument)
      byDomain.set(domainId, [...(byDomain.get(domainId) ?? []), instrument])
    }
    for (const [domainId, group] of byDomain) {
      group.sort((a, b) => authorityOrder.indexOf(a.authorityClass) - authorityOrder.indexOf(b.authorityClass) || a.shortTitle.localeCompare(b.shortTitle))
      const columns = Math.max(2, Math.ceil(Math.sqrt(group.length * 1.35)))
      const rows = Math.ceil(group.length / columns)
      const sectorWidth = (Math.PI * 2 / domains.length) * 0.7
      group.forEach((instrument, index) => {
        const column = index % columns
        const row = Math.floor(index / columns)
        const angularOffset = columns === 1 ? 0 : ((column / (columns - 1)) - 0.5) * sectorWidth
        const rowOffset = row - (rows - 1) / 2
        const stableOffset = ((hash(instrument.id) % 101) / 100 - 0.5) * 0.018
        const baseRadius = mode === 'authority' ? (authorityRadius.get(instrument.authorityClass) ?? 540) : 465 + rowOffset * 42
        const point = polar((domainAngles.get(domainId) ?? 0) + angularOffset + stableOffset, baseRadius)
        const depth = instrumentDepth(instrument)
        const color = domainById.get(domainId)?.color ?? '#aab3c0'
        nodes.push({ id: `instrument:${instrument.id}`, label: instrument.title, shortLabel: instrument.shortTitle, kind: 'instrument', domainId, instrumentId: instrument.id, authorityClass: instrument.authorityClass, region: instrument.region, x: point.x, y: point.y, z: depth, targetX: point.x, targetY: point.y, targetZ: depth, radius: instrument.region === 'Australia' ? 10.5 : 8.5, color })
        instrument.conceptIds.forEach((conceptId) => {
          const assertion = mappingAssertionById.get(`map:instrument:${instrument.id}:concept:${conceptId}`)
          if (assertion) edges.push(edgeFromAssertion(assertion, 'alignment'))
        })
      })
    }
    const visibleIds = new Set(visibleInstruments.map((instrument) => instrument.id))
    relations.forEach((relation) => {
      if (!visibleIds.has(relation.sourceId) || !visibleIds.has(relation.targetId)) return
      const assertion = mappingAssertionById.get(`map:relation:${relation.id}`)
      if (assertion) edges.push({ ...edgeFromAssertion(assertion, relation.basis === 'explicit' ? 'authority' : 'alignment'), relationType: relation.type })
    })
  }

  if (mode === 'risk') {
    const normalized = filters.query.toLowerCase().trim()
    const visibleRisks = riskSubdomains.filter((risk) => (!normalized || [risk.ref, risk.name, risk.definition, riskDomainById.get(risk.riskDomainId)?.name ?? ''].join(' ').toLowerCase().includes(normalized)) && countForCausalLens(risk, causalLens) > 0)
    const visibleDomainIds = new Set(visibleRisks.map((risk) => risk.riskDomainId))
    const riskAngles = new Map(riskDomains.map((domain, index) => [domain.id, (index / riskDomains.length) * Math.PI * 2 - Math.PI / 2]))
    riskDomains.forEach((domain) => {
      if (!visibleDomainIds.has(domain.id)) return
      const point = polar(riskAngles.get(domain.id) ?? 0, 398)
      const members = visibleRisks.filter((risk) => risk.riskDomainId === domain.id)
      nodes.push({ id: `risk-domain:${domain.id}`, label: domain.name, shortLabel: domain.shortName, kind: 'risk-domain', domainId: 'mit-risk', riskDomainId: domain.id, recordCount: members.reduce((sum, risk) => sum + countForCausalLens(risk, causalLens), 0), x: point.x, y: point.y, z: -28, targetX: point.x, targetY: point.y, targetZ: -28, radius: 16, color: domain.color })
      const sectorWidth = (Math.PI * 2 / riskDomains.length) * 0.72
      members.forEach((risk, index) => {
        const spread = members.length === 1 ? 0 : ((index / (members.length - 1)) - 0.5) * sectorWidth
        const point = polar((riskAngles.get(domain.id) ?? 0) + spread, 508 + (index % 2) * 32)
        const depth = ((hash(risk.id) % 101) - 50) * 1.4
        nodes.push({ id: `risk-subdomain:${risk.id}`, label: `${risk.ref} ${risk.name}`, shortLabel: `${risk.ref} ${risk.name}`, kind: 'risk-subdomain', domainId: 'mit-risk', riskDomainId: domain.id, recordCount: countForCausalLens(risk, causalLens), x: point.x, y: point.y, z: depth, targetX: point.x, targetY: point.y, targetZ: depth, radius: 8.2, color: domain.color })
        edges.push({ id: `risk-domain-subdomain:${risk.id}`, sourceId: `risk-domain:${domain.id}`, targetId: `risk-subdomain:${risk.id}`, label: 'contains', semanticFamily: 'structure' })
        risk.conceptIds.forEach((conceptId) => {
          const assertion = mappingAssertionById.get(`map:risk:${risk.id}:concept:${conceptId}`)
          if (assertion) edges.push(edgeFromAssertion(assertion, 'risk'))
        })
      })
    })
  }

  if (selectedNodeId?.startsWith('instrument:') || selectedNodeId?.startsWith('provision:')) {
    const selectedInstrument = selectedNodeId.startsWith('instrument:')
      ? instruments.find((instrument) => instrument.id === selectedNodeId.replace('instrument:', ''))
      : instruments.find((instrument) => instrument.provisions.some((provision) => provision.id === selectedNodeId.replace('provision:', '')))
    const selectedNode = selectedInstrument ? nodes.find((node) => node.id === `instrument:${selectedInstrument.id}`) : undefined
    if (selectedInstrument && selectedNode) selectedInstrument.provisions.forEach((provision, index) => {
      const angle = (index / Math.max(selectedInstrument.provisions.length, 1)) * Math.PI * 2 - Math.PI / 2
      const distance = 82 + (index % 2) * 18
      const point = { x: selectedNode.targetX + Math.cos(angle) * distance, y: selectedNode.targetY + Math.sin(angle) * distance }
      nodes.push({ id: `provision:${provision.id}`, label: `${provision.ref}: ${provision.title}`, shortLabel: provision.ref, kind: 'provision', domainId: selectedNode.domainId, instrumentId: selectedInstrument.id, x: point.x, y: point.y, z: selectedNode.targetZ + 18, targetX: point.x, targetY: point.y, targetZ: selectedNode.targetZ + 18, radius: 5.5, color: selectedNode.color })
      edges.push({ id: `instrument-provision:${provision.id}`, sourceId: `instrument:${selectedInstrument.id}`, targetId: `provision:${provision.id}`, label: 'contains', semanticFamily: 'structure' })
      provision.conceptIds.forEach((conceptId) => {
        const assertion = mappingAssertionById.get(`map:provision:${provision.id}:concept:${conceptId}`)
        if (assertion) edges.push(edgeFromAssertion(assertion, 'alignment'))
      })
    })
  }

  if (selectedNodeId?.startsWith('risk-subdomain:')) addControlsAroundSelection(nodes, edges, selectedNodeId, controlsForRisk(selectedNodeId.replace('risk-subdomain:', '')).map((control) => control.id))
  if (selectedNodeId?.startsWith('concept:') && mode !== 'controls') addControlsAroundSelection(nodes, edges, selectedNodeId, controlsForConcept(selectedNodeId.replace('concept:', '')).map((control) => control.id))

  const nodeIds = new Set(nodes.map((node) => node.id))
  return { nodes, edges: edges.filter((edge) => nodeIds.has(edge.sourceId) && nodeIds.has(edge.targetId)) }
}

export const defaultFilters = (): GraphFilters => ({ query: '', authorityClasses: new Set(), regions: new Set() })
export const graphAssertionForEdge = (edgeId: string) => mappingAssertionById.get(edgeId)
export const assertionsVisibleInGraph = (graph: GraphModel) => graph.edges.map((edge) => mappingAssertionById.get(edge.id)).filter((assertion): assertion is MappingAssertion => Boolean(assertion))
export const assertionsForGraphNode = (nodeId: string) => mappingAssertions.filter((assertion) => assertion.sourceNodeId === nodeId || assertion.targetNodeId === nodeId)
