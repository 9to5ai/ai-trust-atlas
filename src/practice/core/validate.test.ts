import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { atlasIdSets, loadContent } from '../../../scripts/practice/content'
import { practiceSchema, type Practice } from './schema'
import { qualityGaps, validateCorpus } from './validate'

const fixture = loadContent(join(__dirname, '../../../scripts/practice/fixture'))
const clone = (practice: Practice): Practice => structuredClone(practice)

describe('practice content validation', () => {
  it('loads the synthetic fixture cleanly', () => {
    expect(fixture.errors).toEqual([])
    expect(fixture.practices.map((practice) => practice.id)).toEqual(['GOV-99', 'TM-99'])
    expect(validateCorpus(fixture.practices, fixture.sources, atlasIdSets()).errors).toEqual([])
  })

  it('rejects structural gaps in the schema', () => {
    const [practice] = fixture.practices
    const tooFewTests = { ...practice, evidenceTests: practice.evidenceTests.slice(0, 2) }
    expect(practiceSchema.safeParse(tooFewTests).success).toBe(false)
    const unsourcedStep = clone(practice)
    unsourcedStep.steps.foundations[0].sources = []
    expect(practiceSchema.safeParse(unsourcedStep).success).toBe(false)
    const levelsOutOfOrder = { ...practice, maturity: [...practice.maturity].reverse() }
    expect(practiceSchema.safeParse(levelsOutOfOrder).success).toBe(false)
  })

  it('catches broken citations, Atlas links, checkpoints and cycles', () => {
    const [gov, tm] = fixture.practices.map(clone)
    gov.steps.foundations[0].sources = ['no-such-source']
    gov.atlas.controls = ['no-such-control']
    gov.agent.stopAt = ['C9']
    gov.prerequisites = ['TM-99']
    const messages = validateCorpus([gov, tm], fixture.sources, atlasIdSets()).errors.map((finding) => finding.message)
    expect(messages).toEqual(expect.arrayContaining([
      'unknown source no-such-source',
      'unknown Atlas control no-such-control',
      'agent.stopAt refers to missing checkpoint C9',
      'Prerequisite cycle: GOV-99 → TM-99 → GOV-99',
    ]))
  })

  it('only lets a practice be approved once it meets the quality bar', () => {
    const practice = clone(fixture.practices[0])
    practice.status = 'approved'
    expect(validateCorpus([practice], fixture.sources).errors.length).toBeGreaterThan(0)
    for (const prompt of Object.values(practice.prompts)) prompt.testedIn = [{ tool: 'Claude', date: '2026-09-26' }, { tool: 'Gemini', date: '2026-09-26' }]
    practice.practitionerReview = { by: 'External reviewer', date: '2026-09-26' }
    practice.lastReviewed = '2026-09-26'
    expect(qualityGaps(practice)).toEqual([])
    expect(validateCorpus([practice], fixture.sources).errors).toEqual([])
  })
})
