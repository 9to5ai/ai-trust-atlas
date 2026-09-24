import {describe,it,expect} from 'vitest'
import {useCases,useCaseWorkflows,useCaseQuestion,useCasesForNode,filterUseCases} from './useCases'
import {concepts,domains} from './concepts'
import {controlObjectives} from './controls'
import {readBrief,catalogue} from '../lib/questionCatalogue'
import {buildGraphModel,defaultFilters} from '../lib/graphModel'
import {pathForView,readView,viewUrl} from '../lib/viewState'
import {searchObjects} from '../lib/workspace'
import {inDateWindow} from './developments'

describe('production use case evidence and navigation',()=>{
 it('has sixteen distinct production cases covering six workflows and valid evidence connections',()=>{
  expect(useCases).toHaveLength(16);expect(new Set(useCases.map(i=>i.id)).size).toBe(16)
  expect(new Set(useCases.map(i=>i.workflow)).size).toBe(Object.keys(useCaseWorkflows).length)
  expect(useCases.filter(i=>i.sector==='Financial services')).toHaveLength(9)
  expect(useCases.filter(i=>['Commonwealth Bank','NAB','Suncorp','IAG','Services Australia'].includes(i.company))).toHaveLength(5)
  for(const item of useCases){
   expect(item.status).toBe('Production');expect(item.evidence).toBe('Company-reported')
   expect(item.sources.every(s=>new URL(s.url).protocol==='https:')).toBe(true)
   expect(item.topics.every(t=>domains.some(d=>d.id===t))).toBe(true)
   expect(item.limitations.length).toBeGreaterThan(50)
   for(const c of item.connections){expect(concepts.some(x=>x.id===c.conceptId),c.conceptId).toBe(true);expect(controlObjectives.some(x=>x.id===c.controlId),c.controlId).toBe(true)}
  }
 })
 it('retrieves cases by workflow, sector, company and related concepts',()=>{
  expect(filterUseCases('software').map(x=>x.id)).toEqual(['google-code-assistance'])
  expect(filterUseCases('customers','Financial services').map(x=>x.company).sort()).toEqual(['Bank of America','DBS','IAG','NAB'])
  expect(filterUseCases('all','all','Commonwealth')).toHaveLength(1)
  expect(filterUseCases('software','Financial services')).toHaveLength(0)
  expect(searchObjects('DeepFleet').some(x=>x.id==='use-case:amazon-deepfleet')).toBe(true)
  expect(useCasesForNode('concept','agent-authority').length).toBeGreaterThan(0)
  expect(useCasesForNode('control-objective','decision-rights-approval').map(x=>x.id)).toContain('cba-fraud-agent')
 })
 it('keeps cases hidden by default, adds only the selected case or relevant contextual cases',()=>{
  expect(buildGraphModel('ontology',defaultFilters()).nodes.some(n=>n.kind==='use-case')).toBe(false)
  const selected=buildGraphModel('ontology',defaultFilters(),'use-case:cba-fraud-agent')
  expect(selected.nodes.filter(n=>n.kind==='use-case')).toHaveLength(1)
  expect(selected.edges.filter(e=>e.sourceId==='use-case:cba-fraud-agent')).toHaveLength(2)
  const context=buildGraphModel('ontology',defaultFilters(),'concept:agent-authority','all',false,true)
  expect(context.nodes.filter(n=>n.kind==='use-case').length).toBe(useCasesForNode('concept','agent-authority').length)
  const view=readView(new URL('https://atlas.test/cases?useCases=1#/use-case/cba-fraud-agent'),2026)
  const url=pathForView(view)+viewUrl(view)
  expect(url.startsWith('/cases?')).toBe(true);expect(url).toContain('useCases=1');expect(url).toContain('#/use-case/cba-fraud-agent')
 })
 it('restores all three roles with source references and does not manufacture recent publication dates',()=>{
  for(const item of useCases)for(const role of ['board','executive','regulator'] as const){const q=useCaseQuestion(item,role);expect(catalogue(role).some(e=>e.question.id===q.id)).toBe(true);expect(readBrief(JSON.stringify({version:1,ids:[q.id]})).selected).toEqual([q])}
  expect(useCases.filter(i=>i.published&&inDateWindow(i.published,30,'2026-09-22'))).toHaveLength(0)
  expect(useCases.filter(i=>i.published&&inDateWindow(i.published,90,'2026-09-22')).map(i=>i.id)).toEqual(['bofa-erica'])
  expect(useCases.find(i=>i.id==='cba-fraud-agent')?.published).toBeNull()
 })
})
