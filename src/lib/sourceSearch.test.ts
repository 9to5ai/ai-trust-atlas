import { describe, expect, it } from 'vitest'
import { instruments } from '../data/instruments'
import { searchSources } from './sourceSearch'

describe('source search', () => {
  it('returns MAS sources once regardless of their many ontology mappings', () => {
    const results = searchSources(instruments, ' MAS ')
    expect(results.map(r => r.source.id)).toContain('mas-airm-guidelines-cp')
    expect(results).toHaveLength(4)
    expect(new Set(results.map(r => r.source.id)).size).toBe(results.length)
  })
  it('finds a matching section even when its wording is absent from the source summary', () => {
    const source = instruments.find(s => s.id === 'mas-airm-guidelines-cp')!
    const passage = source.provisions.find(p => p.title.includes('Third-party'))!
    expect(searchSources([source], passage.title)[0].passages.map(p => p.id)).toContain(passage.id)
  })
  it('respects the supplied facet-filtered corpus', () => {
    expect(searchSources([], 'MAS')).toEqual([])
    expect(searchSources(instruments, 'xyz-no-such-source')).toEqual([])
  })
})
