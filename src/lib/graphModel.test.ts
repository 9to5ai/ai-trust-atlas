import { describe, expect, it } from 'vitest'
import { instruments } from '../data/instruments'
import { buildGraphModel, defaultFilters } from './graphModel'

describe('graph model', () => {
  it('renders the ontology and the complete instrument corpus by default', () => {
    const graph = buildGraphModel('ontology', defaultFilters())
    expect(graph.nodes.filter((node) => node.kind === 'domain').length).toBeGreaterThanOrEqual(6)
    expect(graph.nodes.filter((node) => node.kind === 'concept').length).toBeGreaterThanOrEqual(30)
    expect(graph.nodes.filter((node) => node.kind === 'instrument')).toHaveLength(instruments.length)
    expect(graph.edges.some((edge) => edge.id.startsWith('relation:'))).toBe(true)
  })

  it('filters to the Australian regulatory centre', () => {
    const filters = defaultFilters()
    filters.regions.add('Australia')
    const graph = buildGraphModel('ontology', filters)
    const visible = graph.nodes.filter((node) => node.kind === 'instrument')
    expect(visible.length).toBeGreaterThan(10)
    expect(visible.every((node) => node.region === 'Australia')).toBe(true)
  })

  it('searches instrument metadata and expands selected clauses', () => {
    const filters = defaultFilters()
    filters.query = 'prudential'
    const filtered = buildGraphModel('ontology', filters)
    expect(filtered.nodes.some((node) => node.kind === 'instrument' && node.instrumentId === 'apra-cps-230')).toBe(true)

    const expanded = buildGraphModel('ontology', defaultFilters(), 'eu-ai-act')
    expect(expanded.nodes.filter((node) => node.kind === 'clause').length).toBeGreaterThanOrEqual(3)
    expect(expanded.edges.some((edge) => edge.id.startsWith('instrument-clause:'))).toBe(true)
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

  it('keeps the ontology inside a bounded orbital shell', () => {
    const graph = buildGraphModel('ontology', defaultFilters())
    const instrumentNodes = graph.nodes.filter((node) => node.kind === 'instrument')
    const radii = instrumentNodes.map((node) => Math.hypot(node.targetX, node.targetY))

    expect(Math.min(...radii)).toBeGreaterThan(350)
    expect(Math.max(...radii)).toBeLessThan(600)
    expect(graph.nodes.every((node) => Number.isFinite(node.targetZ))).toBe(true)
    expect(instrumentNodes.some((node) => node.targetX < 0 && node.targetY < 0)).toBe(true)
    expect(instrumentNodes.some((node) => node.targetX > 0 && node.targetY > 0)).toBe(true)
  })

  it('uses depth to bring the Australian regulatory centre forward', () => {
    const graph = buildGraphModel('ontology', defaultFilters())
    const instrumentNodes = graph.nodes.filter((node) => node.kind === 'instrument')
    const australian = instrumentNodes.filter((node) => node.region === 'Australia')
    const global = instrumentNodes.filter((node) => node.region === 'Global')
    const averageDepth = (nodes: typeof instrumentNodes) => nodes.reduce((sum, node) => sum + node.targetZ, 0) / nodes.length

    expect(averageDepth(australian)).toBeGreaterThan(averageDepth(global))
  })
})
