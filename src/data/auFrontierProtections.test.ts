import { describe, expect, it } from 'vitest'
import { instruments } from './instruments'
import { requirements } from './requirements'
import { timelineEvents } from './timeline'
import { audiences, questionForDevelopment } from './leadershipQuestions'
import { questionsForNode } from './nodeQuestions'
import { AU_FRONTIER_ID, AU_FRONTIER_URL, auFrontierDevelopment } from './auFrontierProtections'

describe('Australian frontier-AI legislative proposal', () => {
  const source = instruments.find(item => item.id === AU_FRONTIER_ID)!
  it('keeps proposed protections out of current legal obligations', () => {
    expect(source).toMatchObject({ status: 'not-in-force', legalEffect: 'informational', issuerType: 'government', sectorIds: ['technology-providers'], published: '2026-11-10' })
    expect(source.effective).toBeUndefined()
    expect(requirements.filter(item => item.instrumentId === source.id)).toEqual([])
    expect(source.applicability).toContain('not automatically every AI user')
  })
  it('emits one dated announcement event and preserves four audience prompts at each level', () => {
    expect(timelineEvents.filter(item => item.instrumentId === source.id)).toMatchObject([{ kind: 'published', date: '2026-11-10' }])
    const prompts = audiences.flatMap(role => [
      questionsForNode('instrument', source.id, role)[0],
      questionsForNode('provision', source.provisions[0].id, role)[0],
      questionForDevelopment(auFrontierDevelopment, role)!,
    ])
    expect(new Set(prompts.map(item => item.text)).size).toBe(12)
    for (const item of prompts) expect(item.sources[0].url).toBe(AU_FRONTIER_URL)
  })
})
