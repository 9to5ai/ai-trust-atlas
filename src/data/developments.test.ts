import { describe, expect, it } from 'vitest'
import { developments, filterDevelopments, inDateWindow } from './developments'
import { instruments } from './instruments'
import { domains } from './concepts'
describe('briefing dates and references', () => {
  it('uses publication date, excludes future and invalid dates, and handles exact window boundaries', () => {
    expect(inDateWindow('2026-08-10', 30, '2026-09-08')).toBe(true)
    expect(inDateWindow('2026-08-09', 30, '2026-09-08')).toBe(false)
    expect(inDateWindow('2026-09-09', 30, '2026-09-08')).toBe(false)
    expect(inDateWindow('unknown', 30, '2026-09-08')).toBe(false)
    expect(filterDevelopments(30, 'all', '2026-09-08').map(x => x.id)).toContain('apra-frontier-roundtables')
    expect(inDateWindow('2026-04-30', 120, '2026-09-08')).toBe(false)
    expect(filterDevelopments(30, 'all', '2026-09-08').map(x => x.id)).not.toContain('asd-board-guidance')
    expect(filterDevelopments(90, 'all', '2026-09-08').map(x => x.id)).toContain('asd-board-guidance')
    expect(filterDevelopments(90, 'all', '2026-09-08').map(x => x.id)).not.toContain('fsb-ai-practices-consultation')
    expect(filterDevelopments(120, 'all', '2026-09-08').map(x => x.id)).toContain('fsb-ai-practices-consultation')
    expect(filterDevelopments(120, 'all', '2027-09-08')).toHaveLength(0)
  })
  it('filters topics and keeps every card linked to a real source', () => {
    expect(filterDevelopments(90, 'agentic', '2026-09-08').map(x => x.id)).toEqual(['acs-release', 'asd-agent-actions'])
    expect(filterDevelopments(90, 'fairness', '2026-09-08').map(x => x.id)).toEqual(['asd-agent-actions'])
    expect(new Set(developments.map(x => x.id)).size).toBe(developments.length)
    expect(new Set(developments.map(x => x.url)).size).toBe(developments.length)
    for (const item of developments) {
      expect(instruments.some(s => s.id === item.sourceId)).toBe(true)
      expect(item.topics.every(id => domains.some(d => d.id === id))).toBe(true)
      if (item.backgroundSourceId) expect(instruments.some(s => s.id === item.backgroundSourceId)).toBe(true)
      expect(item.url).toMatch(/^https:/)
      expect(item.reviewed >= item.published).toBe(true)
    }
  })
})
