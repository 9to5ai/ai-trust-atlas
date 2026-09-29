import { describe, expect, it } from 'vitest'
import { developments } from './developments'
import { instruments } from './instruments'
import { questionsForNode } from './nodeQuestions'
import { questionForDevelopment } from './leadershipQuestions'

describe('approved source refresh', () => {
  it('keeps ASIC scope, registration and future commencement distinct', () => {
    const source = instruments.find(item => item.id === 'asic-market-integrity-rules')
    expect(source).toBeDefined()
    expect(source).toMatchObject({
      authorityClass: 'law',
      status: 'future-effective',
      published: '2026-09-17',
      effective: '2028-03-18',
      lastVerified: '2026-09-29',
    })
    expect(source?.applicability).toContain('only to participants and activities covered')
    expect(source?.applicability).toContain('not part of these binding amendments')
    expect(source?.provisions).toHaveLength(2)

    const development = developments.find(item => item.id === 'asic-market-integrity-rules-2026')
    expect(development?.sourceId).toBe(source?.id)
    expect(development?.summary).toContain('A separate CS 63 consultation')
    expect(questionForDevelopment(development!, 'board')?.text).toContain('approval and escalation')
    expect(questionForDevelopment(development!, 'assurance')?.text).toContain('trace')
  })

  it('records the NIST consultation as closed without asserting a successor', () => {
    const source = instruments.find(item => item.id === 'nist-public-ai-documentation')
    const development = developments.find(item => item.id === 'nist-documentation-draft')
    expect(source).toMatchObject({ status: 'closed-consultation', lastVerified: '2026-09-29' })
    expect(source?.summary).toContain('does not confirm a successor publication')
    expect(development?.reviewed).toBe('2026-09-29')
    expect(development?.status).toContain('successor unconfirmed')
    expect(questionsForNode('instrument', source!.id, 'regulator').some(question => question.text.includes('preliminary zero draft'))).toBe(true)
  })

  it('preserves the NIST RMF and Playbook revision and date-provenance limits', () => {
    const framework = instruments.find(item => item.id === 'nist-ai-rmf')
    const playbook = instruments.find(item => item.id === 'nist-ai-rmf-playbook')
    expect(framework).toMatchObject({ status: 'active', lastVerified: '2026-09-29' })
    expect(framework?.summary).toContain('is being revised')
    expect(playbook).toMatchObject({ status: 'living', lastVerified: '2026-09-29' })
    expect(playbook).not.toHaveProperty('effective')
    expect(playbook?.provisions.find(item => item.id === 'nist-playbook-date-provenance')?.note).toContain('does not establish that no later update occurred')
    expect(questionsForNode('instrument', playbook!.id, 'assurance').some(question => question.text.includes('page-update date'))).toBe(true)
  })
})
