import { filterDevelopments, inDateWindow, type Development } from '../data/developments'
import { incidents, type Incident } from '../data/incidents'
import { useCases, type UseCase } from '../data/useCases'
import type { Instrument } from '../types'

export type NewsEntry =
 | { kind:'development'; date:string; item:Development; priority:number }
 | { kind:'incident'; date:string; item:Incident; priority:number }
 | { kind:'use-case'; date:string; item:UseCase; priority:number }
export function newsFeed(days:number,topic:string,today:string,order:'latest'|'priority',instruments:Instrument[]):NewsEntry[]{
 const matches=(topics:string[])=>topic==='all'||topics.includes(topic)
 const entries:NewsEntry[]=[
  ...filterDevelopments(days,topic,today).map(item=>({kind:'development' as const,date:item.published,item,priority:['binding-law','mandatory-policy','supervisory-expectation'].includes(instruments.find(s=>s.id===item.sourceId)?.legalEffect??'')?0:2})),
  ...incidents.filter(i=>inDateWindow(i.updated,days,today)&&matches(i.topics)).map(item=>({kind:'incident' as const,date:item.updated,item,priority:1})),
  ...useCases.filter(i=>i.published&&inDateWindow(i.published,days,today)&&matches(i.topics)).map(item=>({kind:'use-case' as const,date:item.published!,item,priority:3})),
 ]
 return entries.sort((a,b)=>(order==='priority'?a.priority-b.priority:0)||b.date.localeCompare(a.date)||a.item.id.localeCompare(b.item.id))
}
