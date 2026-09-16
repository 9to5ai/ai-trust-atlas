import {describe,it,expect,vi,afterEach} from 'vitest'
import {audiences,questionForConcept} from '../data/leadershipQuestions'
import {filterQuestions,readBrief} from './questionCatalogue'
afterEach(()=>vi.useRealTimers())
describe('question browsing',()=>{
 it('offers five distinct authored starting questions for each audience',()=>{
 for(const role of audiences){const entries=filterQuestions(role,[],'',0,true);expect(entries).toHaveLength(5);expect(new Set(entries.map(e=>e.question.id)).size).toBe(5);expect(entries.every(e=>e.question.audience===role&&e.question.sources.length>0)).toBe(true)}
 })
 it('combines topics without duplicating development questions and dates by publication',()=>{
 vi.useFakeTimers();vi.setSystemTime(new Date('2026-09-16T00:00:00Z'))
 const entries=filterQuestions('board',['security','governance'],'',30,false)
 expect(entries.length).toBeGreaterThan(0);expect(new Set(entries.map(e=>e.question.id)).size).toBe(entries.length)
 expect(entries.every(e=>e.development&&e.development.published>='2026-08-18')).toBe(true)
 expect(filterQuestions('board',[],'unfindable-zxcv',0,false)).toEqual([])
 })
 it('restores canonical content, discards obsolete IDs, and handles broken storage',()=>{
 const q=questionForConcept('accountability','board')!
 const saved=readBrief(JSON.stringify({version:1,ids:[q.id,q.id,'missing'],purpose:'Board review',text:'untrusted'}))
 expect(saved).toEqual({selected:[q],purpose:'Board review'});expect(readBrief('{')).toEqual({selected:[],purpose:''})
 })
})
