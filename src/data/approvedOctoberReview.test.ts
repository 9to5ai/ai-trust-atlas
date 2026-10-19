import {describe,expect,it} from 'vitest'
import {instruments} from './instruments'
import {requirements} from './requirements'
import {developments,filterDevelopments} from './developments'
import {questionsForNode} from './nodeQuestions'
import {audiences,questionForDevelopment} from './leadershipQuestions'
import {timelineEvents} from './timeline'

describe('approved October source corrections',()=>{
 it('keeps the selected literacy synopsis and requirement aligned without changing historical dates',()=>{
  const source=instruments.find(x=>x.id==='eu-ai-act')!
  const section=source.provisions.find(x=>x.id==='eu-ai-act-4')!
  expect(section).toMatchObject({editorialStatus:'reviewed',reviewedAt:'2026-10-19'})
  expect(section.summary).toContain('support the development')
  expect(section.summary).toContain('does not require guaranteeing')
  expect(section.note).toContain('complete Act review remains outstanding')
  const req=requirements.find(x=>x.id==='req-euaia-art4-ai-literacy')!
  expect(req.appliesFrom).toBe('2025-02-02')
  expect(req.summary).toContain('no particular level of literacy has to be guaranteed')
  for(const audience of audiences){const question=questionsForNode('provision',section.id,audience)[0];expect(question.id).toContain(':focus:');expect(question.basis).toBe(section.summary);expect(question.sources[0].url).toBe(req.sourceUrl)}
 })
 it('preserves the profile publication while drawing the development and operating boundary',()=>{
  const source=instruments.find(x=>x.id==='nist-sp-800-218a')!
  expect(source.published).toBe('2024-07');expect(source.lastVerified).toBe('2026-10-19')
  expect(source.applicability).toContain('to be used with SSDF 1.1')
  expect(source.applicability).toContain('Deployment and operation')
  expect(source.applicability).toContain('outside this profile')
  for(const role of audiences)expect(questionsForNode('instrument',source.id,role)[0].text.trim().length).toBeGreaterThan(20)
 })
 it('bounds the OWASP section review and carries its own citation through all role questions',()=>{
  const source=instruments.find(x=>x.id==='owasp-llm-top-10')!
  const section=source.provisions.find(x=>x.id==='owasp-llm-risks')!
  expect(source.published).toBe('2026-08')
  expect(section.conceptIds).toEqual(['ai-security','supply-chain','agent-authority'])
  expect(section.note).toContain('not a complete review')
  expect(section.note).toContain('release-date placeholders')
  const qs=audiences.map(a=>questionsForNode('provision',section.id,a)[0]);expect(new Set(qs.map(q=>q.text)).size).toBe(4)
  for(const q of qs){expect(q.sources[0].url).toContain('#page=46');expect(q.basis).toContain('Hidden Context Exposure')}
 })
 it('dates the Commission report separately from review and makes every audience source-backed',()=>{
  const item=developments.find(x=>x.id==='ec-frontier-panel-response-2026')!
  expect(item).toMatchObject({published:'2026-10-12',reviewed:'2026-10-19',added:'2026-10-19',sourceId:'eu-ai-act',backgroundSourceId:'eu-gpai-code'})
  expect(item.dateBasis).toBe('Report published');expect(item.summary).toContain('9 October meeting')
  expect(item.implication).toContain('do not themselves introduce new legal duties')
  expect(filterDevelopments(30,'all','2026-10-11').some(x=>x.id===item.id)).toBe(false)
  const questions=audiences.map(a=>questionForDevelopment(item,a)!);expect(new Set(questions.map(q=>q.text)).size).toBe(4)
  for(const q of questions){expect(q.developmentDate).toBe('2026-10-12');expect(q.sources[0].url).toBe(item.url)}
  expect(timelineEvents.filter(x=>x.title===item.title)).toHaveLength(1)
 })
})
