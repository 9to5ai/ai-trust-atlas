import { describe, expect, it } from 'vitest'
import { briefingAnchor, latestReview } from './briefingDate'

describe('briefing anchor date', () => {
  it('uses today while the briefing is current', () => {
    expect(briefingAnchor('2026-09-08')).toBe('2026-09-08')
  })
  it('stops at the latest editorial review so later visits still see the last briefing', () => {
    expect(latestReview >= '2026-09-20').toBe(true)
    expect(briefingAnchor('2027-03-01')).toBe(latestReview)
  })
})
