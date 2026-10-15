import { describe, expect, it } from 'vitest'
import { instruments } from './instruments'
import { developments, filterDevelopments } from './developments'
import { mappingAssertions } from './assertions'
import { timelineEvents } from './timeline'
import { upcomingEvents } from '../lib/horizon'
import { questionForDevelopment, audiences } from './leadershipQuestions'
import { FSB_FINAL_URL } from './fsbFinal'

describe('FSB final report transition', () => {
  it('updates the existing source without promoting voluntary practices into binding duties', () => {
    const source = instruments.find(item => item.id === 'fsb-ai-sound-practices')!
    expect(source.status).toBe('active')
    expect(source.legalEffect).toBe('voluntary')
    expect(source.published).toBe('2026-10-15')
    expect(source.supersedes?.[0].url).toContain('/2026/06/')
    expect(source.provisions.some(item => item.id === 'fsb-proposed-practices')).toBe(true)
    const practices = source.provisions.filter(item => /^fsb-sound-practice-\d+$/.test(item.id))
    expect(practices).toHaveLength(12)
    for (const practice of practices) {
      const assertions = mappingAssertions.filter(item => item.sourceNodeId === `provision:${practice.id}`)
      expect(assertions.length).toBeGreaterThan(0)
      expect(assertions.every(item => item.predicate === 'addresses' && item.basis === 'atlas-synthesis')).toBe(true)
      expect(assertions.every(item => item.citations.every(c => c.url.startsWith(FSB_FINAL_URL) && c.accessedAt === '2026-10-15'))).toBe(true)
    }
    expect(practices.find(item => item.id === 'fsb-sound-practice-8')?.note).toContain('not an authoritative record')
  })

  it('records the final once in the timeline, preserves consultation history and supplies every audience', () => {
    const sourceId = 'fsb-ai-sound-practices'
    expect(upcomingEvents('2026-10-15').filter(item => item.instrumentId === sourceId)).toHaveLength(0)
    expect(timelineEvents.filter(item => item.instrumentId === sourceId && item.date === '2026-10-15')).toHaveLength(1)
    expect(developments.find(item => item.id === 'fsb-ai-practices-consultation')?.published).toBe('2026-06-10')
    const final = developments.find(item => item.id === 'fsb-ai-practices-final')!
    expect(filterDevelopments(30, 'all', '2026-10-14')).not.toContain(final)
    expect(filterDevelopments(30, 'all', '2026-10-15')).toContain(final)
    expect(new Set(audiences.map(audience => questionForDevelopment(final, audience)?.text)).size).toBe(4)
  })
})
