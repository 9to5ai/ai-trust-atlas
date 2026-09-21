import {describe,it,expect} from 'vitest'
import {incidents,incidentQuestion,incidentsForNode} from './incidents'
import {concepts} from './concepts'
import {controlObjectives} from './controls'
import {readBrief,catalogue} from '../lib/questionCatalogue'
import {buildGraphModel} from '../lib/graphModel'
import {readView,viewUrl} from '../lib/viewState'
import {inDateWindow} from './developments'

describe('incident evidence and integration',()=>{
 it('has only approved incidents and resolvable interpretive connections',()=>{
  expect(incidents.map(i=>i.id)).toEqual(['hugging-face-2026','anthropic-evaluation-incidents-2026','hacktron-openai-2026'])
  for(const i of incidents){expect(i.sources.length).toBeGreaterThan(1);expect(i.limitations).toBeTruthy();for(const f of i.findings)expect(i.sources[f.source]).toBeDefined();for(const c of i.connections){expect(concepts.some(x=>x.id===c.conceptId)).toBe(true);expect(controlObjectives.some(x=>x.id===c.controlId)).toBe(true);expect(c.reason).toBeTruthy()}}
 })
 it('keeps incidents optional, with real graph edges and shareable selection',()=>{
  const filters={query:'',authorityClasses:new Set<never>(),regions:new Set<never>()}
  expect(buildGraphModel('ontology',filters).nodes.some(n=>n.kind==='incident')).toBe(false)
  const graph=buildGraphModel('ontology',filters,undefined,'all',true)
  expect(graph.nodes.some(n=>n.id==='incident:hugging-face-2026')).toBe(true)
  expect(graph.edges.filter(e=>e.sourceId==='incident:hugging-face-2026')).toHaveLength(4)
  const view=readView(new URL('https://atlas.test/?incidents=1#/incident/hugging-face-2026'),2026)
  expect(view.selected).toBe('incident:hugging-face-2026');expect(viewUrl(view)).toContain('incidents=1')
 })
 it('restores sourced incident questions for all roles and dates by findings, not ingestion',()=>{
  for(const item of incidents)for(const role of ['board','executive','regulator'] as const){const q=incidentQuestion(item,role);expect(catalogue(role).some(e=>e.question.id===q.id)).toBe(true);expect(readBrief(JSON.stringify({version:1,ids:[q.id]})).selected).toEqual([q])}
  expect(inDateWindow(incidents[0].updated,30,'2026-09-20')).toBe(true)
  expect(inDateWindow(incidents[0].updated,30,'2026-10-20')).toBe(false)
  expect(incidentsForNode('concept','agent-authority')).toHaveLength(3)
 })
})
