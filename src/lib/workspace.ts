import { mappingAssertions } from '../data/assertions'
import { concepts, domains } from '../data/concepts'
import { controlFamilies, controlObjectives } from '../data/controls'
import { instruments } from '../data/instruments'
import { riskDomains, riskSubdomains } from '../data/mitRiskTaxonomy'
import type { MappingAssertion, MappingBasis } from '../types'

export type AtlasObject = { id:string; name:string; summary:string; kind:string; color:string; group:string; sourceId?:string }
export const objects: AtlasObject[] = [
 ...domains.map(x=>({id:`domain:${x.id}`,name:x.shortName,summary:x.definition,kind:'Theme',color:x.color,group:x.id})),
 ...concepts.map(x=>({id:`concept:${x.id}`,name:x.name,summary:x.definition,kind:'Concept',color:domains.find(d=>d.id===x.domainId)!.color,group:x.domainId})),
 ...instruments.map(x=>({id:`instrument:${x.id}`,name:x.shortTitle,summary:x.summary,kind:'Source',color:'#80b8d1',group:x.region,sourceId:x.id})),
 ...instruments.flatMap(x=>x.provisions.map(p=>({id:`provision:${p.id}`,name:`${p.ref} · ${p.title}`,summary:p.summary,kind:'Provision',color:'#9bbbc7',group:x.shortTitle,sourceId:x.id}))),
 ...riskDomains.map(x=>({id:`risk-domain:${x.id}`,name:x.shortName,summary:x.definition,kind:'Risk theme',color:x.color,group:x.id})),
 ...riskSubdomains.map(x=>({id:`risk-subdomain:${x.id}`,name:`${x.ref} · ${x.name}`,summary:x.definition,kind:'Risk',color:'#e6ab9b',group:x.riskDomainId})),
 ...controlFamilies.map(x=>({id:`control-family:${x.id}`,name:x.shortName,summary:x.definition,kind:'Control family',color:x.color,group:x.id})),
 ...controlObjectives.map(x=>({id:`control-objective:${x.id}`,name:`${x.code} · ${x.shortName}`,summary:x.objective,kind:'Control',color:'#b9d99c',group:x.familyId})),
]
export const objectById = new Map(objects.map(x=>[x.id,x]))
const structural = (id:string,from:string,to:string,rationale:string):MappingAssertion => ({id,sourceNodeId:from,targetNodeId:to,predicate:'contains',rationale,basis:'source-authored',confidence:'high',citations:[],createdBy:'source',verifiedAt:'2026-09-05',status:'active',inferenceDepth:0})
export const assertions: MappingAssertion[] = [
 ...mappingAssertions,
 ...instruments.flatMap(x=>x.provisions.map(p=>({...structural(`structure:${x.id}:${p.id}`,`instrument:${x.id}`,`provision:${p.id}`,'This provision record is an extract synopsis from this instrument. Containment does not establish an interpretation or organisational applicability.'), verifiedAt:p.reviewedAt ?? x.lastVerified,citations:[{sourceTitle:x.title,locator:p.ref,url:p.sourceUrl??x.officialUrl,accessedAt:p.reviewedAt??x.lastVerified}]}))),
 ...riskSubdomains.map(x=>({...structural(`structure:risk:${x.id}`,`risk-domain:${x.riskDomainId}`,`risk-subdomain:${x.id}`,'This risk type is organised in this MIT source taxonomy domain.'), verifiedAt:'2026-08-28',citations:[{sourceTitle:'MIT AI Risk Repository',locator:x.ref,url:'https://airisk.mit.edu/risks',accessedAt:'2026-08-28'}]})),
]
export const assertionById = new Map(assertions.map(x=>[x.id,x]))
export const basisLabel:Record<MappingBasis,string> = {'source-authored':'Source-authored','published-crosswalk':'Published crosswalk','atlas-synthesis':'Atlas interpretation'}
export type BasisFilter = 'all'|'source-authored'|'source-backed'
export function basisMatches(a:MappingAssertion,basis:BasisFilter) {return basis==='all'||(basis==='source-authored'?a.basis==='source-authored':a.basis!=='atlas-synthesis')}
export function connections(id:string,basis:BasisFilter='all') {return assertions.filter(a=>a.status==='active'&&basisMatches(a,basis)&&(a.sourceNodeId===id||a.targetNodeId===id))}
export function otherEnd(a:MappingAssertion,id:string) {return a.sourceNodeId===id?a.targetNodeId:a.sourceNodeId}
export function searchObjects(query:string,kind='All') {const terms=query.toLowerCase().trim().split(/\s+/).filter(Boolean);return objects.filter(x=>(kind==='All'||x.kind===kind)&&terms.every(t=>`${x.name} ${x.summary} ${x.group}`.toLowerCase().includes(t))).sort((a,b)=>Number(b.name.toLowerCase().includes(query.toLowerCase()))-Number(a.name.toLowerCase().includes(query.toLowerCase()))||a.name.localeCompare(b.name))}
export type RecordedPath = {nodeIds:string[];edgeIds:string[]}
// Paths navigate either way; the UI and export retain each assertion's original direction.
export function findPaths(from:string,to:string,basis:BasisFilter='all',maxHops=4):RecordedPath[] {
 if(from===to||!objectById.has(from)||!objectById.has(to))return []
 const adjacent=new Map<string,MappingAssertion[]>()
 for(const a of assertions){if(!basisMatches(a,basis)||a.status!=='active')continue;for(const id of [a.sourceNodeId,a.targetNodeId])adjacent.set(id,[...(adjacent.get(id)??[]),a])}
 const queue:RecordedPath[]=[{nodeIds:[from],edgeIds:[]}];const output:RecordedPath[]=[];let cursor=0
 while(cursor<queue.length&&cursor<12000&&output.length<6){const path=queue[cursor++];const last=path.nodeIds.at(-1)!;if(path.edgeIds.length>=maxHops)continue
  for(const a of adjacent.get(last)??[]){const next=otherEnd(a,last);if(path.nodeIds.includes(next))continue
   // Editorial grouping must never provide a semantic shortcut between unrelated records.
   if(a.predicate==='contains'&&next!==to&&(!next.startsWith('provision:')))continue
   const candidate={nodeIds:[...path.nodeIds,next],edgeIds:[...path.edgeIds,a.id]}
   if(next===to)output.push(candidate);else if(candidate.edgeIds.length<maxHops)queue.push(candidate)
   if(output.length>=6)break
  }
 }
 return output
}
export type Investigation = {id:string;name:string;question:string;notes:string;openQuestions:string;nodeIds:string[];edgeIds:string[];paths:RecordedPath[];updatedAt:string}
export function newInvestigation(name='Untitled investigation'):Investigation{return {id:crypto.randomUUID(),name,question:'',notes:'',openQuestions:'',nodeIds:[],edgeIds:[],paths:[],updatedAt:new Date().toISOString()}}
export function readInvestigations(raw:string|null):Investigation[]{try{const value=JSON.parse(raw??'[]');if(!Array.isArray(value))return [];return value.filter(x=>x&&typeof x.id==='string'&&typeof x.name==='string').map(x=>({...x,question:typeof x.question==='string'?x.question:'',notes:typeof x.notes==='string'?x.notes:'',openQuestions:typeof x.openQuestions==='string'?x.openQuestions:'',updatedAt:typeof x.updatedAt==='string'?x.updatedAt:'',nodeIds:Array.isArray(x.nodeIds)?x.nodeIds.filter((id:unknown)=>typeof id==='string'&&objectById.has(id)):[],edgeIds:Array.isArray(x.edgeIds)?x.edgeIds.filter((id:unknown)=>typeof id==='string'&&assertionById.has(id)):[],paths:Array.isArray(x.paths)?x.paths.filter((p:RecordedPath)=>Array.isArray(p.nodeIds)&&Array.isArray(p.edgeIds)&&p.nodeIds.every(id=>objectById.has(id))&&p.edgeIds.every(id=>assertionById.has(id))&&p.nodeIds.length===p.edgeIds.length+1):[]}))}catch{return []}}
export function exportInvestigation(item:Investigation){const edges=[...new Set([...item.edgeIds,...item.paths.flatMap(p=>p.edgeIds)])].map(id=>assertionById.get(id)!).filter(Boolean);return [`# ${item.name}`,'',`Exported ${new Date().toISOString()}`,'','## Investigation question',item.question||'Not recorded','','## Personal observations',item.notes||'Not recorded','','## Unresolved questions',item.openQuestions||'Not recorded','','## Saved paths',...item.paths.map(p=>p.nodeIds.map(id=>objectById.get(id)?.name).join(' → ')),'','## Saved objects',...item.nodeIds.flatMap(id=>{const x=objectById.get(id)!;return [`### ${x.name}`,x.summary,`https://ai-trust-atlas.vercel.app/#/${id.replace(':','/')}`,'']}),'## Relationship record',...edges.flatMap(a=>[`### ${objectById.get(a.sourceNodeId)?.name} → ${a.predicate} → ${objectById.get(a.targetNodeId)?.name}`,`${basisLabel[a.basis]} · ${a.confidence} mapping confidence · reviewed ${a.verifiedAt}`,a.rationale,...a.citations.map(c=>`- ${c.sourceTitle}, ${c.locator}: ${c.url} (accessed ${c.accessedAt})`),'']),'## Limits','Paths are navigational associations, not causal chains or compliance findings. Atlas interpretations and personal observations are not source statements. Human judgment is required; missing records do not establish missing controls.'].join('\n')}
export function comparisonRows(ids:string[]){const selected=instruments.filter(x=>ids.includes(x.id));return concepts.filter(c=>selected.some(s=>s.conceptIds.includes(c.id)||s.provisions.some(p=>p.conceptIds.includes(c.id)))).map(c=>({concept:c,cells:selected.map(s=>({instrument:s,recorded:s.conceptIds.includes(c.id),provisions:s.provisions.filter(p=>p.conceptIds.includes(c.id))}))}))}
