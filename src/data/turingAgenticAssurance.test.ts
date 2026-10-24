import { describe, expect, it } from 'vitest'
import { instruments } from './instruments'
import { requirements } from './requirements'
import { audiences } from './leadershipQuestions'
import { questionsForNode } from './nodeQuestions'
import { TURING_AGENTIC_ID, TURING_AGENTIC_LANDING, TURING_AGENTIC_PDF } from './turingAgenticAssurance'

describe('Turing agentic evaluation research reference', () => {
  const source = instruments.find(item => item.id === TURING_AGENTIC_ID)!
  it('keeps research authority, month precision and rights scope distinct from legal duties', () => {
    expect(source).toMatchObject({issuerType: 'research', legalEffect: 'informational', authorityClass: 'research-database', published: '2026-10', lastVerified: '2026-10-24'})
    expect(source.effective).toBeUndefined()
    expect(requirements.filter(item => item.instrumentId === source.id)).toEqual([])
    expect(source.applicability).toContain('detailed content reuse is not cleared')
    expect(source.provisions).toHaveLength(1)
    expect(source.provisions[0].summary).toContain('original report')
  })
  it('retains original role questions and the correct source and section citations', () => {
    const prompts: string[] = []
    for (const [kind, id, url] of [['instrument', source.id, TURING_AGENTIC_LANDING], ['provision', source.provisions[0].id, `${TURING_AGENTIC_PDF}#page=34`]] as const) {
      for (const role of audiences) {
        const question = questionsForNode(kind, id, role)[0]
        expect(question.id).toContain(':focus:')
        expect(question.sources[0].url).toBe(url)
        prompts.push(question.text)
      }
    }
    expect(new Set(prompts).size).toBe(8)
  })
})
