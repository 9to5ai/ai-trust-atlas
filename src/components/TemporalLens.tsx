import { incidentQuestion } from '../data/incidents'
import { useCaseQuestion } from '../data/useCases'
import { AudiencePicker, DevelopmentQuestion, BriefNotice, QuestionCard, useBrief } from './LeadershipQuestions'
import { ArrowUpRight, X } from '@phosphor-icons/react'
import { useEffect, useRef, useState } from 'react'
import { domains } from '../data/concepts'
import { briefingAnchor } from '../data/briefingDate'
import { newsFeed, type NewsEntry } from '../lib/newsFeed'
import type { Instrument } from '../types'

type Props = { open: boolean; instruments: Instrument[]; onClose: () => void; onSelect: (id: string) => void }
const dateLabel = (date: string) => new Date(`${date}T00:00:00Z`).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })
function NewsCard({entry,instruments,onSelect,onClose}:{entry:NewsEntry;instruments:Instrument[];onSelect:Props['onSelect'];onClose:Props['onClose']}){
 const {audience}=useBrief()
 const {item}=entry
 const select=(id:string)=>{onSelect(id);onClose()}
 const contextId=entry.kind==='development'?`instrument:${entry.item.sourceId}`:`${entry.kind}:${item.id}`
 return <article className={`news-card ${entry.kind==='incident'?'incident-card':''}`}>
  <div className="news-meta"><span>{entry.kind==='development'?'Development':entry.kind==='incident'?'Incident findings':`Use case · ${entry.item.company}`}</span><time dateTime={entry.date}>{entry.kind==='incident'?'Findings':entry.kind==='development'?entry.item.dateBasis??'Published':'Published'} {dateLabel(entry.date)}</time></div>
  <h3>{item.title}</h3>
  <p className="news-issuer">{entry.kind==='development'?`${entry.item.issuer} · ${entry.item.status}`:entry.kind==='incident'?`${entry.item.classification} · ${entry.item.disclosureLabel}`:`${entry.item.status} · ${entry.item.evidence}`}</p>
  <p>{item.summary}</p>
  <div className="news-meaning"><h4>{entry.kind==='use-case'?'Why examine it':'Why it matters'} <small>Atlas interpretation</small></h4><p>{entry.kind==='use-case'?entry.item.connections[0]?.reason:entry.item.implication}</p></div>
  <details className="news-detail"><summary>Questions and supporting detail</summary>
   <div className="news-tags">{item.topics.map(id=><span key={id}>{domains.find(d=>d.id===id)?.shortName}</span>)}</div>
   {entry.kind==='development'?<DevelopmentQuestion item={entry.item}/>:<>
    <p className="news-limits"><strong>Evidence limits</strong> {entry.item.limitations}</p>
    {entry.kind==='use-case'?<><p><strong>Reported value</strong> {entry.item.value}</p><QuestionCard question={useCaseQuestion(entry.item,audience)}/></>:<><p><strong>Review scope</strong> {entry.item.reviewScope}</p><QuestionCard question={incidentQuestion(entry.item,audience)}/></>}
   </>}
   <footer><button className="news-explore" onClick={()=>select(contextId)}>Read context <ArrowUpRight/></button>{entry.kind==='development'?<a href={entry.item.url} target="_blank" rel="noreferrer">Original source ↗</a>:entry.item.sources.map(s=><a key={s.url} href={s.url} target="_blank" rel="noreferrer">{s.title} ↗</a>)}</footer>
   {entry.kind==='development'&&entry.item.backgroundSourceId&&<button className="news-background" onClick={()=>select(`instrument:${entry.item.backgroundSourceId}`)}>Background: {instruments.find(s=>s.id===entry.item.backgroundSourceId)?.shortTitle} →</button>}
   <small className="news-review">{entry.kind==='incident'&&<>Occurred {entry.item.occurred} · </>}{entry.kind==='development'&&entry.item.updated&&<>Source page updated {dateLabel(entry.item.updated)} · </>}Overview reviewed {dateLabel(item.reviewed)}{entry.kind==='development'&&<> · Briefing added {dateLabel(entry.item.added)}</>}</small>
  </details>
 </article>
}
export function TemporalLens({ open, instruments, onClose, onSelect }: Props) {
 const dialog=useRef<HTMLDialogElement>(null)
 const [days,setDays]=useState<30|90|120>(30)
 const [topic,setTopic]=useState('all')
 const [order,setOrder]=useState<'latest'|'priority'>('latest')
 useEffect(()=>{if(open)dialog.current?.showModal();else dialog.current?.close()},[open])
 const today=briefingAnchor()
 const entries=newsFeed(days,topic,today,order,instruments)
 return <dialog ref={dialog} className="whats-new" aria-labelledby="whats-new-title" onCancel={onClose} onClick={e=>{if(e.target===e.currentTarget)onClose()}}>
  <div className="news-surface">
   <header className="news-heading"><div><span className="news-eyebrow">ATLAS BRIEFING</span><h2 id="whats-new-title">What’s new</h2></div><button autoFocus onClick={onClose} aria-label="Close What’s new"><X/></button></header>
   <div className="news-filters">
    <div className="news-period" aria-label="Time period">{([30,90,120] as const).map(n=><button key={n} aria-pressed={days===n} onClick={()=>setDays(n)}>Last {n} days</button>)}</div>
    <label className="news-topic">Topic<select value={topic} onChange={e=>setTopic(e.target.value)}><option value="all">All topics</option>{domains.map(d=><option value={d.id} key={d.id}>{d.shortName}</option>)}</select></label>
    <div className="news-period" role="group" aria-label="Updates order"><button aria-pressed={order==='latest'} onClick={()=>setOrder('latest')}>Latest</button><button aria-pressed={order==='priority'} onClick={()=>setOrder('priority')}>Priority</button></div>
   </div>
   <p className="news-order-note">{order==='latest'?'Newest publication or findings first across all categories.':'Regulatory-source developments first, then incidents, other developments and use cases; newest first in each group. Editorial order, not an applicability assessment.'}</p>
   <div className="news-question-audience"><span>Questions for your role</span><AudiencePicker/><BriefNotice/></div>
   <div className="news-results" aria-live="polite"><strong>{entries.length} {entries.length===1?'item':'items'}</strong><span>Through {dateLabel(today)} · review dates do not create recency</span></div>
   <div className="news-cards">{entries.map(entry=><NewsCard key={`${entry.kind}:${entry.item.id}`} entry={entry} instruments={instruments} onSelect={onSelect} onClose={onClose}/>)}
    {!entries.length&&<div className="news-empty"><h3>No reviewed items in this selection</h3><p>Try a longer period or another topic. An empty feed does not mean there were no developments.</p><button onClick={()=>{setDays(120);setTopic('all')}}>Show all topics · last 120 days</button></div>}
   </div>
  </div>
 </dialog>
}
