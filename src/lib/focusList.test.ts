import { describe, expect, it } from 'vitest'
import { buildFocusListModel } from './focusList'
import { requirementsForSource } from '../data/requirements'
import { assertionsForNode } from '../data/assertions'

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

  it('carries aligned compare fields with visible review state and evidence counts', () => {
    const model = buildFocusListModel('concept:accountability')
    const source = model?.instruments[0]
    expect(source?.requirementCount).toBe(requirementsForSource(source!.instrument.id).length)
    expect(source?.sourceBasedEvidenceCount).toBe(assertionsForNode(`instrument:${source!.instrument.id}`).filter(item => item.predicate !== 'contains' && (item.basis === 'source-authored' || item.basis === 'published-crosswalk')).length)
    expect(source?.atlasInterpretationCount).toBe(assertionsForNode(`instrument:${source!.instrument.id}`).filter(item => item.predicate !== 'contains' && item.basis === 'atlas-synthesis').length)
    expect(source?.reviewLabel).toMatch(/^(Drafted .*awaiting editorial review|Summary last verified )/)
  })

  it('counts requirements against the exact displayed provision', () => {
    const model = buildFocusListModel('instrument:apra-cps-234')
    const provision = model?.provisions[0]
    expect(provision?.requirementCount).toBe(requirementsForSource('apra-cps-234', provision?.provision.id).length)
  })

  it('respects active instrument filters without breaking the anchor', () => {
    const globalOnly = buildFocusListModel('risk-subdomain:mit-risk-7-1', [])
    expect(globalOnly?.anchorLabel).toContain('7.1')
    expect(globalOnly?.instruments).toEqual([])
  })
})
