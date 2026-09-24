import { describe, expect, it } from 'vitest'
import { instruments } from '../data/instruments'
import { buildGraphModel, defaultFilters } from './graphModel'

describe('graph model', () => {
  it('renders the ontology and the complete instrument corpus by default', () => {
    const graph = buildGraphModel('ontology', defaultFilters())
    expect(graph.nodes.filter((node) => node.kind === 'domain').length).toBeGreaterThanOrEqual(6)
    expect(graph.nodes.filter((node) => node.kind === 'concept').length).toBeGreaterThanOrEqual(30)
    expect(graph.nodes.filter((node) => node.kind === 'instrument')).toHaveLength(instruments.length)
    expect(graph.edges.some((edge) => edge.id.startsWith('map:relation:'))).toBe(true)
  })

  it('filters to the Australian regulatory centre', () => {
    const filters = defaultFilters()
    filters.regions.add('Australia')
    const graph = buildGraphModel('ontology', filters)
    const visible = graph.nodes.filter((node) => node.kind === 'instrument')
    expect(visible.length).toBeGreaterThan(10)
    expect(visible.every((node) => node.region === 'Australia')).toBe(true)
  })

  it('searches instrument metadata and expands selected source provisions', () => {
    const filters = defaultFilters()
    filters.query = 'prudential'
    const filtered = buildGraphModel('ontology', filters)
    expect(filtered.nodes.some((node) => node.kind === 'instrument' && node.instrumentId === 'apra-cps-230')).toBe(true)

    const expanded = buildGraphModel('ontology', defaultFilters(), 'instrument:eu-ai-act')
    expect(expanded.nodes.filter((node) => node.kind === 'provision').length).toBeGreaterThanOrEqual(3)
    expect(expanded.edges.some((edge) => edge.id.startsWith('instrument-provision:'))).toBe(true)
    expect(expanded.edges.some((edge) => edge.id.startsWith('map:provision:eu-ai-act-9:concept:'))).toBe(true)
  })

  it('supports an authority layout distinct from the ontology layout', () => {
    const ontology = buildGraphModel('ontology', defaultFilters())
    const authority = buildGraphModel('authority', defaultFilters())
    const ontologyNode = ontology.nodes.find((node) => node.id === 'instrument:mitre-atlas')
    const authorityNode = authority.nodes.find((node) => node.id === 'instrument:mitre-atlas')
    expect(ontologyNode).toBeDefined()
    expect(authorityNode).toBeDefined()
    expect(authorityNode?.targetX).not.toBe(ontologyNode?.targetX)
  })

  it('renders the MIT taxonomy as a separate progressive risk universe', () => {
    const graph = buildGraphModel('risk', defaultFilters())
    expect(graph.nodes.filter((node) => node.kind === 'risk-domain')).toHaveLength(7)
    expect(graph.nodes.filter((node) => node.kind === 'risk-subdomain')).toHaveLength(24)
    expect(graph.nodes.filter((node) => node.kind === 'instrument')).toHaveLength(0)
    expect(graph.edges.some((edge) => edge.id.startsWith('map:risk:'))).toBe(true)
    expect(graph.edges.filter((edge) => edge.id.startsWith('map:risk:')).every((edge) => edge.basis === 'cross-framework-synthesis')).toBe(true)
  })

  it('applies a causal lens to risk record counts without changing the source taxonomy', () => {
    const all = buildGraphModel('risk', defaultFilters())
    const intentional = buildGraphModel('risk', defaultFilters(), undefined, 'intent:Intentional')
    const allRisk = all.nodes.find((node) => node.id === 'risk-subdomain:mit-risk-4-3')
    const intentionalRisk = intentional.nodes.find((node) => node.id === 'risk-subdomain:mit-risk-4-3')
    expect(allRisk?.recordCount).toBe(77)
    expect(intentionalRisk?.recordCount).toBe(63)
    expect(intentional.nodes.filter((node) => node.kind === 'risk-domain')).toHaveLength(7)
  })

  it('keeps the ontology inside a bounded orbital shell', () => {
    const graph = buildGraphModel('ontology', defaultFilters())
    const instrumentNodes = graph.nodes.filter((node) => node.kind === 'instrument')
    const radii = instrumentNodes.map((node) => Math.hypot(node.targetX, node.targetY, node.targetZ))

    expect(Math.min(...radii)).toBeGreaterThan(350)
    expect(Math.max(...radii)).toBeLessThan(600)
    expect(graph.nodes.every((node) => Number.isFinite(node.targetZ))).toBe(true)
    expect(instrumentNodes.some((node) => node.targetX < 0 && node.targetY < 0)).toBe(true)
    expect(instrumentNodes.some((node) => node.targetX > 0 && node.targetY > 0)).toBe(true)
  })

  it('retains organised topic sectors and brings Australian sources forward', () => {
    const nodes = buildGraphModel('ontology', defaultFilters()).nodes.filter(node => node.kind === 'instrument')
    const averageDepth = (region: string) => {
      const group = nodes.filter(node => node.region === region)
      return group.reduce((sum, node) => sum + node.targetZ, 0) / group.length
    }
    expect(averageDepth('Australia')).toBeGreaterThan(averageDepth('Global'))
    expect(Math.min(...nodes.map(node => Math.hypot(node.targetX, node.targetY)))).toBeGreaterThan(350)
  })

  it('uses uniform risk sizes so source frequency is not encoded as magnitude', () => {
    const graph = buildGraphModel('risk', defaultFilters())
    expect(new Set(graph.nodes.filter((node) => node.kind === 'risk-subdomain').map((node) => node.radius))).toEqual(new Set([8.2]))
  })

  it('renders a bounded control universe with six families and 24 objectives', () => {
    const graph = buildGraphModel('controls', defaultFilters())
    expect(graph.nodes.filter((node) => node.kind === 'control-family')).toHaveLength(6)
    expect(graph.nodes.filter((node) => node.kind === 'control-objective')).toHaveLength(24)
    expect(graph.edges.filter((edge) => edge.semanticFamily === 'control')).toHaveLength(24)
  })

  it('reveals only the immediate candidate controls around a selected risk', () => {
    const graph = buildGraphModel('risk', defaultFilters(), 'risk-subdomain:mit-risk-7-6')
    const controls = graph.nodes.filter((node) => node.kind === 'control-objective')
    expect(controls.length).toBeGreaterThanOrEqual(3)
    expect(controls.length).toBeLessThanOrEqual(8)
    expect(graph.edges.filter((edge) => edge.semanticFamily === 'control').every((edge) => edge.targetId === 'risk-subdomain:mit-risk-7-6')).toBe(true)
  })

  it('reveals control concepts and risks when a control objective is selected', () => {
    const graph = buildGraphModel('controls', defaultFilters(), 'control-objective:agent-runtime-constraints')
    expect(graph.nodes.some((node) => node.kind === 'concept')).toBe(true)
    expect(graph.nodes.some((node) => node.kind === 'risk-subdomain')).toBe(true)
    expect(graph.edges.some((edge) => edge.id === 'map:control:agent-runtime-constraints:risk:mit-risk-7-6')).toBe(true)
  })
})

describe('rationalised source filters', () => {
  it('includes binding prudential standards with laws and excludes supervisory letters', () => {
    const filters = defaultFilters()
    filters.authorityClasses.add('law')
    const ids = buildGraphModel('ontology', filters).nodes.filter(n => n.kind === 'instrument').map(n => n.instrumentId)
    expect(ids).toEqual(expect.arrayContaining(['apra-cps-220', 'apra-cps-230', 'apra-cps-234', 'eu-ai-act']))
    expect(ids).not.toContain('apra-ai-letter-2026')
    expect(ids).not.toContain('iso-42001')
  })
  it('unifies research catalogues and crosswalks and supports combining types', () => {
    const filters = defaultFilters()
    filters.authorityClasses.add('research-database')
    filters.authorityClasses.add('framework')
    const nodes = buildGraphModel('ontology', filters).nodes.filter(n => n.kind === 'instrument')
    expect(nodes.map(n => n.instrumentId)).toEqual(expect.arrayContaining(['mit-ai-risk-mitigations', 'mitre-atlas', 'owasp-genai-crosswalk', 'nist-ai-rmf', 'csa-aicm-1-1']))
    expect(nodes.every(n => filters.authorityClasses.has(n.authorityClass!))).toBe(true)
  })
})

describe('source facet filters', () => {
  it('shows only binding sources for insurers, including instruments tagged for financial services but not purely cross-sector ones', () => {
    const model = buildGraphModel('ontology', { ...defaultFilters(), effects: new Set(['binding-law']), sectors: new Set(['insurance']) })
    const sources = model.nodes.filter((node) => node.kind === 'instrument').map((node) => node.id)
    expect(sources).toContain('instrument:apra-cps-230')
    expect(sources).toContain('instrument:au-insurance-act')
    expect(sources).toContain('instrument:eu-ai-act')
    expect(sources).not.toContain('instrument:iso-42001')
    expect(sources).not.toContain('instrument:nist-ai-rmf')
  })
})
