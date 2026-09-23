import { describe, expect, it } from 'vitest'
import { curatedEvents, timelineEvents } from '../data/timeline'
import { objectById } from './workspace'
import { formatEventDate, horizonRing, recentEvents, upcomingEvents } from './horizon'

describe('regulatory horizon', () => {
  it('uses valid dates and resolvable references', () => {
    for (const event of timelineEvents) {
      expect(event.date, event.id).toMatch(/^\d{4}(-\d{2}){0,2}$/)
      if (event.instrumentId) expect(objectById.has(`instrument:${event.instrumentId}`), event.id).toBe(true)
      for (const provision of event.provisionIds ?? []) expect(objectById.has(`provision:${provision}`), `${event.id}:${provision}`).toBe(true)
    }
    expect(new Set(timelineEvents.map((event) => event.id)).size).toBe(timelineEvents.length)
  })
  it('places events in forward rings from the reference date', () => {
    const annexIII = curatedEvents.find((event) => event.id === 'eu-ai-act-annex-iii')!
    expect(horizonRing(annexIII, '2026-09-24')).toBe('near')
    expect(horizonRing(curatedEvents.find((event) => event.id === 'eu-ai-act-annex-i')!, '2026-09-24')).toBe('far')
    expect(horizonRing(curatedEvents.find((event) => event.id === 'au-privacy-adm')!, '2026-09-24')).toBe('now')
    expect(horizonRing(curatedEvents.find((event) => event.id === 'eu-ai-act-gpai')!, '2026-09-24')).toBe('past')
  })
  it('lists upcoming obligations nearest first and recent history newest first', () => {
    const upcoming = upcomingEvents('2026-09-24')
    expect(upcoming[0].date <= upcoming[upcoming.length - 1].date).toBe(true)
    expect(upcoming.some((event) => event.id === 'eu-ai-act-annex-i')).toBe(true)
    const recent = recentEvents('2026-09-24')
    expect(recent[0].date >= recent[recent.length - 1].date).toBe(true)
  })
  it('formats dates at their recorded precision', () => {
    expect(formatEventDate({ date: '2026-10', precision: 'month' })).toBe('Oct 2026')
    expect(formatEventDate({ date: '2027-12-02', precision: 'day' })).toBe('2 Dec 2027')
  })
})
