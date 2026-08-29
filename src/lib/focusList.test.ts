import { describe, expect, it } from 'vitest'
import { buildFocusListModel } from './focusList'

describe('focus list projection', () => {
  it('ranks instruments connected to a selected concept', () => {
    const model = buildFocusListModel('concept:accountability')
    expect(model?.defaultMode).toBe('instruments')
    expect(model?.instruments.length).toBeGreaterThan(10)
    expect(model?.instruments.every((row) => row.sharedConcepts.some((concept) => concept.id === 'accountability'))).toBe(true)
  })

  it('opens an instrument at its source provisions', () => {
    const model = buildFocusListModel('instrument:apra-cps-234')
    expect(model?.defaultMode).toBe('provisions')
    expect(model?.provisions.length).toBeGreaterThan(0)
    expect(model?.provisions.every((row) => row.instrument.id === 'apra-cps-234')).toBe(true)
    expect(model?.instruments.every((row) => row.instrument.id !== 'apra-cps-234')).toBe(true)
  })

  it('places direct control source foundations above concept-only matches', () => {
    const model = buildFocusListModel('control-objective:accountable-ownership')
    expect(model?.instruments.length).toBeGreaterThan(0)
    const firstConceptOnly = model?.instruments.findIndex((row) => !row.isSourceFoundation) ?? -1
    const lastFoundation = model?.instruments.reduce((last, row, index) => row.isSourceFoundation ? index : last, -1) ?? -1
    expect(lastFoundation).toBeGreaterThanOrEqual(0)
    expect(firstConceptOnly).toBeGreaterThan(lastFoundation)
  })

  it('respects active instrument filters without breaking the anchor', () => {
    const globalOnly = buildFocusListModel('risk-subdomain:mit-risk-7-1', [])
    expect(globalOnly?.anchorLabel).toContain('7.1')
    expect(globalOnly?.instruments).toEqual([])
  })
})
