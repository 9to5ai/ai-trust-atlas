import { describe, expect, it } from 'vitest'
import { instruments } from './instruments'
import { requirements } from './requirements'
import { timelineEvents } from './timeline'
import { audiences } from './leadershipQuestions'
import { questionsForNode } from './nodeQuestions'
import { mappingAssertions } from './assertions'
import { csiroOversightSource, csiroTuringRelation } from './csiroScalableOversight'

describe('approved CSIRO bibliography and ENISA citation refinement', () => {
  const csiro = instruments.find(source => source.id === csiroOversightSource.id)!
  const enisa = instruments.find(source => source.id === 'enisa-ai-cyber-framework')!
  const layer = enisa.provisions.find(section => section.id === 'enisa-ai-layers')!

  it('retains research authority, uncertain release day and the approved rights boundary', () => {
    expect(csiro).toMatchObject({issuerType: 'research', authorityClass: 'research-database', legalEffect: 'informational', published: '2026-10', lastVerified: '2026-10-26'})
    expect(csiro.effective).toBeUndefined()
    expect(csiro.applicability).toContain('Exact release day is unresolved')
    expect(csiro.applicability).toContain('not a complete report')
    expect(csiro.applicability).toContain('detailed content reuse is not cleared')
    expect(csiro.provisions).toHaveLength(1)
    expect(requirements.filter(requirement => requirement.instrumentId === csiro.id)).toEqual([])
    expect(timelineEvents.filter(event => event.instrumentId === csiro.id)).toEqual([])
  })

  it('preserves ENISA publication and source verification dates while refining the selected section', () => {
    expect(enisa).toMatchObject({published: '2023-06-07', lastVerified: '2026-08-28', legalEffect: 'voluntary'})
    expect(layer).toMatchObject({reviewedAt: '2026-10-26', granularity: 'section', sourceUrl: expect.stringContaining('#page=7')})
    expect(layer.note).toContain('CC-BY4.0')
    expect(layer.note).toContain('2023 context')
    expect(layer.summary).toBe('Connects established cyber practices to AI threats and sector context.')
  })

  it('provides twelve distinct authored questions with their own source or section citation', () => {
    const prompts: string[] = []
    for (const [kind, id, url] of [['instrument', csiro.id, csiro.officialUrl], ['provision', csiro.provisions[0].id, csiro.provisions[0].sourceUrl!], ['provision', layer.id, layer.sourceUrl!]] as const) {
      for (const audience of audiences) {
        const question = questionsForNode(kind, id, audience)[0]
        expect(question.id).toContain(':focus:')
        expect(question.sources[0].url).toBe(url)
        prompts.push(question.text)
      }
    }
    expect(new Set(prompts).size).toBe(12)
  })

  it('keeps the research relationship an attributed thematic inference', () => {
    const assertion = mappingAssertions.find(item => item.id === `map:relation:${csiroTuringRelation.id}`)!
    expect(assertion).toMatchObject({predicate: 'aligns-with', basis: 'atlas-synthesis', confidence: 'medium', inferenceDepth: 1, verifiedAt: '2026-10-26'})
    expect(assertion.citations).toHaveLength(2)
    expect(assertion.rationale).toContain('No equivalent methods or obligations inferred')
  })
})
