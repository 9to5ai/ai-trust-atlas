import { describe, expect, it } from 'vitest'
import { audiences, briefText } from './leadershipQuestions'
import { instruments } from './instruments'
import { controlObjectives } from './controls'
import { questionNodes, questionsForNode } from './nodeQuestions'
import { questionCoverageIssues } from '../lib/questionCoverage'

describe('questions throughout the Atlas', () => {
  it('covers every real card and audience, with distinct complete questions', () => {
    expect(questionCoverageIssues()).toEqual([])
    for (const kind of ['domain', 'concept', 'instrument', 'provision', 'risk-domain', 'risk-subdomain', 'control-family', 'control-objective'] as const) {
      expect(questionNodes.some(node => node.kind === kind)).toBe(true)
      expect(questionsForNode(kind, 'missing', 'board')).toEqual([])
    }
  })
  it('anchors source and section questions to the selected source, preserving section context in briefs', () => {
    for (const source of instruments) for (const role of audiences) {
      const sourceQs = questionsForNode('instrument', source.id, role)
      expect(sourceQs.every(q => q.context.includes(source.shortTitle))).toBe(true)
      const allowedUrls = [source.officialUrl, ...source.provisions.map(p => p.sourceUrl).filter(Boolean)]
      expect(sourceQs.every(q => q.sources.every(ref => allowedUrls.includes(ref.url)))).toBe(true)
      for (const section of source.provisions) {
        const qs = questionsForNode('provision', section.id, role)
        for (const q of qs) {
          expect(q.context).toContain(section.ref)
          expect(q.context).toContain(source.shortTitle)
          expect(q.basis).toBe(section.summary)
          expect(q.sources[0].url).toBe(section.sourceUrl ?? source.officialUrl)
          expect(q.id).not.toBe(sourceQs[0].id)
        }
        expect(briefText('Review a section', qs)).toContain(section.summary)
      }
    }
  })
  it('uses control-specific evidence and references, and keeps questions saved from a family consistent', () => {
    for (const control of controlObjectives) {
      const qs = questionsForNode('control-objective', control.id, 'executive')
      expect(qs[0].askFor).toContain(control.evidenceExamples[0])
      expect(qs.every(q => q.sources.every(s => control.sourceRefs.some(r => r.url === s.url)))).toBe(true)
      const family = questionsForNode('control-family', control.familyId, 'executive')
      const shared = family.find(q => q.context === control.name)
      if (shared) expect(shared.id).toBe(qs[0].id)
    }
  })
  it('separates risk exposure questions from control operation and keeps the source boundary visible', () => {
    const risk = questionsForNode('risk-subdomain', 'mit-risk-2-1', 'board')
    const control = questionsForNode('control-objective', 'privacy-data-protection', 'board')
    expect(risk[0].text).toContain('reveal sensitive information')
    expect(risk[0].why).toContain('does not establish exposure or severity')
    expect(control[0].text).toContain('restricted')
    expect(control[0].text).not.toBe(risk[0].text)
  })
})
