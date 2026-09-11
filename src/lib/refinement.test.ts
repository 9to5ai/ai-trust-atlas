import { describe, expect, it } from 'vitest'
import { instruments } from '../data/instruments'
import { riskPathsForInstrument } from '../data/assertions'
import { riskSubdomains } from '../data/mitRiskTaxonomy'
import { changeHistory } from '../data/changeHistory'
import { buildSourceDirectory, outlineTrail } from './outlineModel'

describe('reference quality', () => {
  it('keeps security risks while excluding distant CPS 234 associations', () => {
    const refs = riskPathsForInstrument('apra-cps-234').map(p => riskSubdomains.find(r => r.id === p.riskId)?.ref)
    expect(refs).toContain('2.2')
    expect(refs).not.toContain('6.1')
    expect(refs).not.toContain('6.4')
  })
  it('separates CPS 234 commencement from CPS 230 and records the correction', () => {
    const source = instruments.find(s => s.id === 'apra-cps-234')!
    expect(source.effective).toBe('2019-07-01')
    expect(source.applicability).not.toContain('2025')
    expect(source.applicability).not.toContain('1 July 2026')
    expect(changeHistory.find(c => c.id === 'cps234-commencement')?.sourceIds).toContain(source.id)
    for (const change of changeHistory) for (const id of change.sourceIds) expect(instruments.some(s => s.id === id)).toBe(true)
  })
  it('offers a unique filtered source directory and a route to its sections', () => {
    const source = instruments.find(s => s.id === 'apra-cps-234')!
    const tree = buildSourceDirectory([source])
    expect(tree.map(n => n.id)).toEqual(['instrument:apra-cps-234'])
    expect(outlineTrail(tree, `provision:${source.provisions[0].id}`).map(n => n.id)).toEqual(['instrument:apra-cps-234', `provision:${source.provisions[0].id}`])
    expect(new Set(buildSourceDirectory(instruments).map(n => n.id)).size).toBe(instruments.length)
  })
})
