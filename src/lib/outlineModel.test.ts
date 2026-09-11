import { describe, expect, it } from 'vitest'
import { instruments } from '../data/instruments'
import { buildOutline, flattenOutline, pathToNode } from './outlineModel'

describe('complete universe hierarchy', () => {
  it('retains every source and section through canonical IDs and unique appearance paths', () => {
    const tree = buildOutline('ontology', instruments)
    const all = flattenOutline(tree, new Set(), ' ')
    expect(all.length).toBeLessThan(20)
    for (const source of instruments) {
      expect(pathToNode(tree, `instrument:${source.id}`)).toBeDefined()
      for (const p of source.provisions) expect(pathToNode(tree, `provision:${p.id}`)).toBeDefined()
    }
    const rows = flattenOutline(tree, new Set(), 'CPS 234')
    expect(new Set(rows.map(r => r.key)).size).toBe(rows.length)
    expect(rows.filter(r => r.node.id === 'instrument:apra-cps-234').length).toBeGreaterThan(1)
  })
  it('retains parent context for search and respects source filters', () => {
    const tree = buildOutline('ontology', instruments.filter(s => s.id === 'apra-cps-234'))
    const rows = flattenOutline(tree, new Set(), 'Information Security')
    expect(rows.some(r => r.node.kind === 'domain')).toBe(true)
    expect(rows.some(r => r.node.id === 'instrument:apra-cps-234')).toBe(true)
    expect(pathToNode(tree, 'instrument:nist-ai-rmf')).toBeUndefined()
  })
  it('offers risk and control hierarchies with labelled connections', () => {
    const risks = buildOutline('risk', instruments)
    const controls = buildOutline('controls', instruments)
    expect(risks).toHaveLength(7)
    expect(controls).toHaveLength(6)
    expect(risks.flatMap(n => n.children)).toHaveLength(24)
    expect(controls.flatMap(n => n.children)).toHaveLength(24)
    expect(controls[0].children[0].children.some(n => n.label === 'Supporting sources')).toBe(true)
  })
  it('keeps legal foundation references finite and excludes a false CPS 220 SIS connection', () => {
    const tree = buildOutline('ontology', instruments)
    const rows = flattenOutline(tree, new Set(), 'CPS 220')
    const legalRows = rows.filter(r => r.ancestors.some(a => a.endsWith('/legal:apra-cps-220')))
    expect(legalRows.some(r => r.node.id === 'instrument:au-apra-act')).toBe(true)
    expect(legalRows.some(r => r.node.id === 'instrument:au-sis-act')).toBe(false)
  })
})
