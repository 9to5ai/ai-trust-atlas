import { describe, expect, it } from 'vitest'
import { assessCandidate, assessLedger, type Candidate } from './sourcing'
import template from '../../research/sourcing/candidate-template.json'
const candidate = (): Candidate => ({ ...structuredClone(template), id: 'test', reviewed: '2026-09-10', reviewer: 'Test reviewer', reviewDepth: 'overview', gates: { provenance: true, evidence: true, rights: true, scopeAndStatus: true }, scores: { authority: 4, relevance: 4, impact: 4, contribution: 4 }, decision: 'include' })
describe('source intake', () => {
  it('never lets score or mandatory review bypass evidence gates', () => {
    const item = candidate(); item.gates.evidence = false; item.relevantBindingChange = true
    expect(() => assessCandidate(item)).toThrow(/publication requires/)
    item.decision = 'defer'
    expect(assessCandidate(item)).toMatchObject({ score: 100, ready: false, mandatoryReview: true })
  })
  it('prioritises binding changes without turning priority into admission', () => {
    const urgent = candidate(); urgent.id = 'urgent'; urgent.eventKey = 'urgent'; urgent.relevantBindingChange = true; urgent.scores.contribution = 0
    expect(assessLedger([candidate(), urgent])[0].id).toBe('urgent')
  })
  it('rejects duplicate published events, impossible dates and invalid scores', () => {
    const duplicate = candidate(); duplicate.id = 'duplicate'
    expect(() => assessLedger([candidate(), duplicate])).toThrow(/Consolidate/)
    const item = candidate(); item.publicationDate = '2026-02-31'
    expect(() => assessCandidate(item)).toThrow(/valid YYYY/)
    item.publicationDate = null; item.scores.impact = 5
    expect(() => assessCandidate(item)).toThrow(/0 to 4/)
  })
  it('preserves earlier decisions while allowing an explicit reassessment', () => {
    const previous = candidate(); const next = candidate(); next.id = 'revised'; next.supersedesId = previous.id; next.decision = 'exclude'; next.reason = 'Superseded after new evidence'
    expect(assessLedger([previous, next])).toMatchObject([{ id: 'revised', decision: 'exclude' }])
  })
  it('allows unknown publication dates but requires recorded review for admission', () => {
    const item = candidate(); expect(assessCandidate(item).ready).toBe(true)
    item.reviewDepth = 'unreviewed'
    expect(() => assessCandidate(item)).toThrow(/recorded review/)
  })
})
