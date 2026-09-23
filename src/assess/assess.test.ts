import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { beforeEach, describe, expect, it } from 'vitest'
import { assessmentItems, levels } from './content'
import { obligationsForGaps, scoreAssessment } from './score'
import { ASSESSMENT_STORAGE_KEY, createAssessment, createExampleAssessment, importAssessmentJson, parseAssessments, resetAssessmentCache, updateResponse, useAssessments } from './store'
import { renderHook } from '@testing-library/react'

beforeEach(() => { localStorage.clear(); resetAssessmentCache() })

describe('assessment content', () => {
  it('covers every control objective with procedures and evidence requests on a six-level scale', () => {
    expect(assessmentItems).toHaveLength(24)
    expect(levels.map((level) => level.level)).toEqual([0, 1, 2, 3, 4, 5])
    for (const item of assessmentItems) {
      expect(item.designProcedures.length).toBeGreaterThan(0)
      expect(item.operatingProcedures.length).toBeGreaterThan(0)
      expect(item.evidenceRequests.length).toBeGreaterThan(0)
    }
  })
  it('never uses conclusive assurance language', () => {
    const text = assessmentItems.flatMap((item) => [item.lookFor, ...item.designProcedures, ...item.operatingProcedures]).join(' ').toLowerCase()
    expect(text).not.toMatch(/\b(is compliant|certif(y|ies) that|guarantees?|proves)\b/)
  })
  it('keeps self-assessment code out of the public corpus and away from Ask the Atlas', () => {
    const files = (dir: string): string[] => readdirSync(dir, { withFileTypes: true }).flatMap((entry) => entry.isDirectory() ? files(join(dir, entry.name)) : [join(dir, entry.name)])
    for (const file of [...files(join(__dirname, '../data')), ...files(join(__dirname, '../ask')), ...files(join(__dirname, '../../api'))]) {
      expect(readFileSync(file, 'utf8'), file).not.toMatch(/from ['"][./]*(src\/)?assess\//)
    }
  })
})

describe('assessment store and scoring', () => {
  it('saves responses locally, validates imports and scores gaps against obligations', () => {
    const id = createAssessment('Pilot', 'Credit decisioning')
    updateResponse(id, 'impact-risk-assessment', { current: 1, target: 4 })
    updateResponse(id, 'accountable-ownership', { current: 3, target: 3 })
    const { result } = renderHook(() => useAssessments())
    const assessment = result.current.find((item) => item.id === id)!
    const score = scoreAssessment(assessment)
    expect(score.rated).toBe(2)
    expect(score.gaps.map((gap) => gap.item.control.id)).toEqual(['impact-risk-assessment'])
    expect(obligationsForGaps(score.gaps).some((entry) => entry.framework === 'EU AI Act')).toBe(true)
    expect(JSON.parse(localStorage.getItem(ASSESSMENT_STORAGE_KEY)!)[0].responses['impact-risk-assessment'].target).toBe(4)
  })
  it('discards invalid imported values and unknown controls', () => {
    const [parsed] = parseAssessments(JSON.stringify({ id: 'x', name: 'Imported', responses: { 'impact-risk-assessment': { current: 9, target: 2, evidence: 'bogus' }, 'not-a-control': { current: 1 } } }))
    expect(parsed.responses).toEqual({ 'impact-risk-assessment': { current: undefined, target: 2, notes: '', evidence: 'not-requested' } })
    expect(importAssessmentJson('not json')).toBeUndefined()
  })
  it('creates a labelled example for demonstrations', () => {
    const id = createExampleAssessment()
    const { result } = renderHook(() => useAssessments())
    const example = result.current.find((item) => item.id === id)!
    expect(example.example).toBe(true)
    expect(scoreAssessment(example).rated).toBe(24)
  })
})
