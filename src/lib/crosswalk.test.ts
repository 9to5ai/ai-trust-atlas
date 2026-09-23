import { describe, expect, it } from 'vitest'
import { controlObjectives } from '../data/controls'
import { crosswalkAssertions } from '../data/crosswalk'
import { findPaths } from './workspace'
import { crosswalkCoverage, crosswalkForInstrument, crosswalkMatrix } from './crosswalk'

describe('control crosswalk', () => {
  it('has a row for every control objective and a cell for every framework', () => {
    const rows = crosswalkMatrix()
    expect(rows).toHaveLength(controlObjectives.length)
    expect(rows.every((row) => row.cells.length === 5)).toBe(true)
  })
  it('labels every link as a provisional Atlas interpretation that never claims equivalence', () => {
    for (const assertion of crosswalkAssertions) {
      expect(assertion.basis).toBe('atlas-synthesis')
      expect(assertion.status).toBe('provisional')
      expect(assertion.confidence).not.toBe('high')
      expect(assertion.rationale).toMatch(/does not establish/)
    }
  })
  it('keeps provisional mappings out of recorded path finding', () => {
    expect(findPaths('control-objective:records-traceability', 'provision:eu-ai-act-12', 'all', 1)).toEqual([])
  })
  it('reports coverage honestly, including gaps', () => {
    const coverage = crosswalkCoverage()
    expect(coverage.find((item) => item.framework.id === 'eu-ai-act')!.mapped).toBeGreaterThan(15)
    const provenance = crosswalkMatrix().find((row) => row.control.id === 'data-model-provenance')!
    expect(provenance.cells.find((cell) => cell.framework.id === 'apra')!.links).toEqual([])
    expect(crosswalkForInstrument('eu-ai-act').some((link) => link.provision.id === 'eu-ai-act-12')).toBe(true)
  })
  it('can filter by control family', () => {
    expect(crosswalkMatrix(undefined, 'govern-own').every((row) => row.control.familyId === 'govern-own')).toBe(true)
  })
})
