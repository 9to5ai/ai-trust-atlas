import {describe,it,expect} from 'vitest'
import {readView,viewUrl,type AtlasView} from './viewState'
import {searchObjects} from './workspace'
describe('shareable views',()=>{
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
