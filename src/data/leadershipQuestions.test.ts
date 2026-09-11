import { describe, expect, it } from 'vitest'
import { concepts, domains } from './concepts'
import { developments } from './developments'
import { audiences, briefText, conceptPrompts, developmentPrompts, questionForConcept, questionForDevelopment, questionsForContext } from './leadershipQuestions'

describe('curated leadership questions', () => {
  it('covers every concept and development with distinct audience questions and valid references', () => {
    expect(new Set(conceptPrompts.map(p=>p.conceptId))).toEqual(new Set(concepts.map(c=>c.id)))
    for(const concept of concepts) {
      const items=audiences.map(a=>questionForConcept(concept.id,a)!)
      expect(new Set(items.map(q=>q.text)).size).toBe(3)
      for(const q of items) {
        expect(q.sources.length).toBeGreaterThan(0)
        expect(q.sources.every(s=>s.url.startsWith('https://'))).toBe(true)
        expect(q.askFor.length).toBeGreaterThan(25)
        expect(q.followUp).not.toBe(q.text)
      }
    }
    for(const item of developments) {
      expect(developmentPrompts[item.id]).toBeDefined()
      expect(new Set(audiences.map(a=>questionForDevelopment(item,a)!.text)).size).toBe(3)
      expect(questionForDevelopment(item,'board')!.sources[0].url).toBe(item.url)
    }
  })
  it('keeps the selected concept first and provides three questions within its topic', () => {
    for(const domain of domains) for(const audience of audiences) {
      const qs=questionsForContext('domain',domain.id,audience)
      expect(qs).toHaveLength(3)
      expect(new Set(qs.map(q=>q.id)).size).toBe(3)
    }
    for(const concept of concepts) {
      expect(questionsForContext('concept',concept.id,'executive')[0].id).toBe(`concept:${concept.id}:executive`)
    }
    expect(questionsForContext('domain','missing','board')).toEqual([])
  })
  it('exports audience, reasoning, supporting requests, follow-ups and original links', () => {
    const q=questionForConcept('third-party-risk','regulator')!
    const result=briefText('Supplier review',[q])
    for(const value of ['Supplier review','Regulator',q.text,q.why,q.askFor,q.followUp,q.sources[0].url])expect(result).toContain(value)
  })
})
