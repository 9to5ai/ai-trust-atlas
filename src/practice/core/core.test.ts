import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { loadContent } from '../../../scripts/practice/content'
import { getAssessmentQuestions, scoreAssessment } from './assessment'
import { assemblePrompt } from './prompts'
import { buildRoadmap } from './roadmap'
import type { Corpus } from './schema'
import { listChanges, searchPractices } from './search'
import { emptyWorkspace, parseWorkspace, type Answer, type Profile } from './workspace'

const { practices, sources } = loadContent(join(__dirname, '../../../scripts/practice/fixture'))
const corpus: Corpus = { schemaVersion: 1, version: '2026.0.1', generatedAt: '2026-09-26T00:00:00Z', buildId: 'test', includesDrafts: true, practices, sources }
const answer = (level: Answer['level'], answeredBy: Answer['answeredBy'] = 'human', attestedBy?: string): Answer => ({ level, answeredBy, attestedBy, at: '2026-09-26' })
const profile: Profile = { orgName: 'Example Mutual', sector: 'Banking', size: 'large', jurisdictions: ['AU'], regulated: ['apra'], systemTypes: ['genai'], riskAppetite: 'low' }

describe('assessment', () => {
  it('builds questions from maturity levels and honours the quick flag', () => {
    expect(getAssessmentQuestions(corpus).map((question) => question.practiceId)).toEqual(['GOV-99', 'TM-99'])
    const quick = getAssessmentQuestions(corpus, { quick: true })
    expect(quick.map((question) => question.practiceId)).toEqual(['GOV-99'])
    expect(quick[0].options.map((option) => option.name)).toEqual(['Ad hoc', 'Defined', 'Operating', 'Assured'])
  })

  it('caps agent self-ratings at Operating unless a person attests', () => {
    const result = scoreAssessment(corpus, { 'GOV-99': answer(4, 'agent'), 'TM-99': answer(4, 'agent', 'Head of Risk') })
    expect(result.practices['GOV-99']).toMatchObject({ level: 3, capped: true })
    expect(result.practices['TM-99']).toMatchObject({ level: 4, capped: false })
  })

  it('averages rated practices by domain, cell and overall, and reports coverage', () => {
    const result = scoreAssessment(corpus, { 'GOV-99': answer(2) })
    expect(result.domains.governance).toMatchObject({ score: 2, rated: 1, total: 1 })
    expect(result.domains.testing).toMatchObject({ score: undefined, rated: 0, total: 1 })
    expect(result.cells['governance|organisation-wide']).toMatchObject({ score: 2 })
    expect(result.cells['testing|monitor']).toMatchObject({ rated: 0 })
    expect(result.overall).toMatchObject({ score: 2, rated: 1, total: 2 })
  })
})

describe('roadmap', () => {
  const build = (answers: Record<string, Answer>, today = '2026-09-26') => buildRoadmap({ corpus, result: scoreAssessment(corpus, answers), profile, today, capacity: { now: 1, next: 1 } })

  it('schedules prerequisites first and explains every ranking', () => {
    const roadmap = build({ 'TM-99': answer(1) })
    expect(roadmap.map((item) => item.practiceId)).toEqual(['GOV-99', 'TM-99'])
    const tm = roadmap.find((item) => item.practiceId === 'TM-99')!
    expect(tm.prerequisites).toEqual(['GOV-99'])
    expect(roadmap.find((item) => item.practiceId === 'GOV-99')!.reasons).toContain('Foundation for TM-99.')
    for (const item of roadmap) expect(item.reasons.length).toBeGreaterThan(1)
  })

  it('adds deadline points for Australian key dates and skips practices at target', () => {
    const roadmap = build({ 'GOV-99': answer(3) })
    expect(roadmap.map((item) => item.practiceId)).toEqual(['TM-99'])
    expect(roadmap[0].reasons.some((reason) => reason.startsWith('Australian key date in 75 days'))).toBe(true)
    const later = build({ 'GOV-99': answer(3) }, '2025-01-01')
    expect(later[0].priority).toBeLessThan(roadmap[0].priority)
  })

  it('is deterministic', () => {
    expect(build({})).toEqual(build({}))
  })
})

describe('prompt kit', () => {
  it('fills the profile in locally and carries the honesty rules and output structure', () => {
    const prompt = assemblePrompt(practices[0], 'draft', profile)
    expect(prompt.text).toContain('Organisation: Example Mutual')
    expect(prompt.text).toContain('Regulatory status: APRA-regulated')
    expect(prompt.text).toContain('[TO CONFIRM]')
    expect(prompt.text).toContain('Do not invent citations')
    expect(prompt.text).toMatch(/1\. Section one\n2\. Section two\n3\. Assumptions and items to confirm/)
    expect(prompt.checklist.length).toBeGreaterThanOrEqual(5)
    expect(prompt.text).toMatchSnapshot()
  })

  it('asks for context when there is no profile, and adds evidence tests to review prompts', () => {
    const prompt = assemblePrompt(practices[0], 'review')
    expect(prompt.text).toContain('Organisation details not provided')
    expect(prompt.text).toContain('E1: Inspect the fixture record.')
  })
})

describe('search and changes', () => {
  it('ranks an exact ID first and applies filters', () => {
    expect(searchPractices(corpus, 'tm-99')[0].id).toBe('TM-99')
    expect(searchPractices(corpus, 'fixture', { domain: 'governance' }).map((hit) => hit.id)).toEqual(['GOV-99'])
    expect(searchPractices(corpus, 'monitoring', { stage: 'monitor' }).map((hit) => hit.id)).toEqual(['TM-99'])
  })

  it('lists changes since a date or a pinned version', () => {
    expect(listChanges(corpus).length).toBe(2)
    expect(listChanges(corpus, { since: '2026-09-26' })).toEqual([])
    expect(listChanges(corpus, { sinceVersions: { 'GOV-99': '0.1.0' }, practiceIds: ['GOV-99'] })).toEqual([])
  })
})

describe('workspace', () => {
  it('round-trips through JSON export and rejects foreign files', () => {
    const workspace = { ...emptyWorkspace(new Date('2026-09-26T00:00:00Z')), answers: { 'GOV-99': answer(2) } }
    const parsed = parseWorkspace(JSON.parse(JSON.stringify(workspace)))
    expect(parsed).toEqual({ ok: true, workspace })
    expect(parseWorkspace({ hello: 'world' }).ok).toBe(false)
    expect(parseWorkspace({ ...workspace, answers: { 'GOV-99': { level: 7, at: '2026-09-26' } } }).ok).toBe(false)
  })
})

describe('markdown and agent brief', () => {
  it('renders the practice with agent instructions, checkpoints and cited sources', async () => {
    const { agentBrief, agentFetchInstruction, practiceMarkdown } = await import('./markdown')
    const markdown = practiceMarkdown(practices[0], sources)
    expect(markdown).toMatch(/^# GOV-99 Fixture governance practice/)
    expect(markdown).toContain('## Instructions for AI agents')
    expect(markdown).toContain('C1: Approve the fixture output (decided by: Executive)')
    expect(markdown).toContain('[Example source for pipeline tests, s 1](https://example.org/fixture)')
    expect(markdown).toContain('Never rate our work above level 3')
    const brief = agentBrief(practices[0], sources, profile)
    expect(brief).toMatch(/^Please help me put the AI Trust Practice below in place/)
    expect(brief).toContain('Organisation: Example Mutual')
    expect(agentFetchInstruction(practices[0], 'https://atlas.example')).toContain('https://atlas.example/practice/p/GOV-99.md')
  })
})
