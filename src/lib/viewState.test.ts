import {describe,it,expect} from 'vitest'
import {pathForView,readView,viewUrl,type AtlasView} from './viewState'
import {searchObjects} from './workspace'
describe('shareable views',()=>{
 it('opens the questions workspace directly',()=>{expect(readView(new URL('https://atlas.example/?view=questions'),2026).projection).toBe('questions')})
 it('round trips a filtered list selection',()=>{
 const view:AtlasView={selected:'concept:accountability',layout:'ontology',projection:'list',query:'AI & privacy',authorities:['standard'],regions:['Australia'],year:2026,anchor:'concept:accountability'}
 expect(readView(new URL('https://atlas.example/'+viewUrl(view)),2026)).toEqual(view)
 })
 it('rejects invalid URL filters and selections',()=>{
 const view=readView(new URL('https://atlas.example/?type=bad&region=bad&year=9999&view=focus#/concept/missing'),2026)
 expect(view.authorities).toEqual([]);expect(view.regions).toEqual([]);expect(view.selected).toBeUndefined();expect(view.year).toBe(2026);expect(view.projection).toBe('atlas')
 })
 it('finds accountability from a familiar question and compact source acronyms',()=>{
 expect(searchObjects('Who is accountable?')[0].id).toBe('concept:accountability')
 expect(searchObjects('CPS234').some(x=>x.kind==='Source'&&x.name.includes('234'))).toBe(true)
 expect(searchObjects('a totally nonexistent source xyzabc')).toEqual([])
 })
})
describe('page routes for workspaces',()=>{
 it('reads the questions and use-case workspaces from their own paths',()=>{
  expect(readView(new URL('https://atlas.example/questions'),2026).projection).toBe('questions')
  expect(readView(new URL('https://atlas.example/cases#/use-case/cba-fraud-agent'),2026)).toMatchObject({projection:'use-cases',selected:'use-case:cba-fraud-agent'})
  expect(readView(new URL('https://atlas.example/universe?view=list'),2026).projection).toBe('list')
 })
 it('keeps the workspace in the path rather than the query',()=>{
  const view:AtlasView={layout:'ontology',projection:'questions',query:'',authorities:[],regions:[],year:2026}
  expect(pathForView(view)+viewUrl(view)).toBe('/questions?year=2026')
  expect(pathForView({projection:'list'})).toBe('/universe')
 })
})

describe('retired concept links', () => {
  it('open the concept that absorbed them', () => {
    expect(readView(new URL('https://atlas.example/universe#/concept/intervention'), 2026).selected).toBe('concept:human-oversight')
    expect(readView(new URL('https://atlas.example/universe#/concept/tool-use'), 2026).selected).toBe('concept:agent-authority')
    expect(readView(new URL('https://atlas.example/universe#/concept/adversarial-risk'), 2026).selected).toBe('concept:ai-security')
  })
})

describe('legal effect and sector filters', () => {
  it('round-trip through the URL and ignore unknown values', () => {
    const view = readView(new URL('https://atlas.example/universe?effect=binding-law&effect=bogus&sector=insurance&sector=nope'), 2026)
    expect(view.effects).toEqual(['binding-law'])
    expect(view.sectors).toEqual(['insurance'])
    expect(viewUrl(view)).toContain('effect=binding-law')
    expect(viewUrl(view)).toContain('sector=insurance')
  })
})
