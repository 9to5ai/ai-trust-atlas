import { useCases, useCaseQuestion, type UseCase } from '../data/useCases'
import { incidents, incidentQuestion, type Incident } from '../data/incidents'
import { audiences, questionForConcept, questionForDevelopment, type Audience, type Question } from '../data/leadershipQuestions'
import { concepts } from '../data/concepts'
import { developments, inDateWindow } from '../data/developments'
import { questionsForNode } from '../data/nodeQuestions'
import { objects } from './workspace'
import type { GraphNodeKind } from '../types'

export const starterConcepts: Record<Audience,string[]> = {
 board:['accountability','inventory','materiality','human-oversight','third-party-risk'],
 executive:['inventory','decision-rights','risk-treatment','continuous-monitoring','incident-response'],
 regulator:['accountability','impact-assessment','human-oversight','evaluation','auditability'],
 assurance:['assurance','evidence-quality','auditability','traceability','model-risk'],
}
export const topicNames: Record<string,string> = {governance:'Accountability and governance',risk:'Risk and impact',lifecycle:'Lifecycle and change',data:'Data and privacy',transparency:'Transparency and challenge',fairness:'Fairness and human oversight',security:'Security',resilience:'Reliability and resilience','third-party':'AI suppliers',testing:'Testing and evaluation',evidence:'Evidence and assurance',agentic:'AI agents'}
export type CatalogueEntry = { question: Question; topics: string[]; nodeId: string; useCase?: UseCase; incident?: Incident; development?: typeof developments[number] }
export function catalogue(audience:Audience):CatalogueEntry[] {
 return [...useCases.map(item=>({question:useCaseQuestion(item,audience),topics:item.topics,nodeId:`use-case:${item.id}`,useCase:item})),...incidents.map(i=>({question:incidentQuestion(i,audience),topics:i.topics,nodeId:`incident:${i.id}`,incident:i})),...concepts.flatMap(c=>{const question=questionForConcept(c.id,audience);return question?[{question,topics:[c.domainId],nodeId:`concept:${c.id}`}]:[]}),...developments.flatMap(d=>{const question=questionForDevelopment(d,audience);return question?[{question,topics:d.topics,nodeId:`instrument:${d.sourceId}`,development:d}]:[]})]
}
export function filterQuestions(audience:Audience,topics:string[],query:string,days:number,starters:boolean) {
 const terms=query.toLowerCase().trim().split(/\s+/).filter(Boolean)
 const starterIds=starterConcepts[audience].map(id=>`concept:${id}`)
 return catalogue(audience).filter(e=>(!topics.length||e.topics.some(t=>topics.includes(t)))&&(!days||!!e.development&&inDateWindow(e.development.published,days))&&(!starters||starterIds.includes(e.nodeId)&&!e.development)&&terms.every(t=>`${e.question.text} ${e.question.context} ${e.topics.map(id=>topicNames[id]).join(' ')}`.toLowerCase().includes(t))).sort((a,b)=>starters?starterIds.indexOf(a.nodeId)-starterIds.indexOf(b.nodeId):Number(!!a.development)-Number(!!b.development)||(b.development?.published??'').localeCompare(a.development?.published??'')||a.question.context.localeCompare(b.question.context))
}
// Resolve persisted IDs against the current authored corpus. Never load stored question text or links.
const currentQuestions=new Map<string,Question>()
for(const audience of audiences){
 for(const entry of catalogue(audience))currentQuestions.set(entry.question.id,entry.question)
 for(const object of objects){const [kind,id]=object.id.split(':');for(const q of questionsForNode(kind as GraphNodeKind,id,audience))currentQuestions.set(q.id,q)}
}
export const BRIEF_STORAGE_KEY='atlas-meeting-brief-v1'
export function readBrief(raw:string|null):{selected:Question[];purpose:string} {
 try {const value=JSON.parse(raw??'null');if(value?.version!==1||!Array.isArray(value.ids))return {selected:[],purpose:''};return {selected:[...new Set<string>(value.ids.filter((id:unknown)=>typeof id==='string'))].flatMap(id=>{const q=currentQuestions.get(id);return q?[q]:[]}),purpose:typeof value.purpose==='string'?value.purpose.slice(0,240):''}}catch{return {selected:[],purpose:''}}
}
