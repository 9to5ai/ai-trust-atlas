import { describe, expect, it } from 'vitest'
import { objectById, findPaths } from '../lib/workspace'
import { tours } from './tours'

describe('guided tours', () => {
  it('only point at records that exist and routes that are recorded', () => {
    for (const tour of tours) {
      expect(tour.steps.length, tour.id).toBeGreaterThanOrEqual(3)
      for (const step of tour.steps) {
        if (step.select) expect(objectById.has(step.select), `${tour.id}: ${step.select}`).toBe(true)
        if (step.trace) expect(findPaths(step.trace[0], step.trace[1], 'all', 4).length, `${tour.id}: ${step.trace.join(' → ')}`).toBeGreaterThan(0)
        expect(step.narration.split(/\s+/).length, `${tour.id}: ${step.title}`).toBeLessThanOrEqual(60)
      }
    }
  })
  it('never claims compliance, effectiveness or equivalence', () => {
    const text = tours.flatMap((tour) => [tour.summary, ...tour.steps.map((step) => step.narration)]).join(' ').toLowerCase()
    expect(text).not.toMatch(/\b(is compliant|ensures compliance|proves|guarantees|equivalent to)\b/)
  })
})
