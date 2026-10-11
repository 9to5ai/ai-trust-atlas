import { incidentQuestion } from '../data/incidents'
import { useCaseQuestion } from '../data/useCases'
import { DevelopmentQuestion, QuestionCard, useBrief } from './LeadershipQuestions'
import { ArrowUpRight, X } from '@phosphor-icons/react'
import { useEffect, useRef, useState } from 'react'
import { domains } from '../data/concepts'
import { briefingAnchor } from '../data/briefingDate'
import { newsFeed, type NewsEntry } from '../lib/newsFeed'
import type { Instrument } from '../types'
import { audiences, audienceNames, type Audience } from '../data/leadershipQuestions'
import '../styles/updates.css'

type Props = { open: boolean; instruments: Instrument[]; onClose: () => void; onSelect: (id: string) => void }
const dateLabel = (date: string) => new Date(`${date}T00:00:00Z`).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })
function NewsCard({entry,instruments,onSelect,onClose}:{entry:NewsEntry;instruments:Instrument[];onSelect:Props['onSelect'];onClose:Props['onClose']}){
 const {audience,setAudience,selected,openBrief}=useBrief()
 const {item}=entry
 const select=(id:string)=>{onSelect(id);onClose()}
 const contextId=entry.kind==='development'?`instrument:${entry.item.sourceId}`:`${entry.kind}:${item.id}`
 return <article className={`news-card ${entry.kind==='incident'?'incident-card':''}`}>
  <div className="news-meta"><span>{entry.kind==='development'?'Development':entry.kind==='incident'?'Incident findings':`Use case · ${entry.item.company}`}</span><time dateTime={entry.date}>{entry.kind==='incident'?'Findings':entry.kind==='development'?entry.item.dateBasis??'Published':'Published'} {dateLabel(entry.date)}</time></div>
  <h3>{item.title}</h3>
  <p className="news-issuer">{entry.kind==='development'?`${entry.item.issuer} · ${entry.item.status}`:entry.kind==='incident'?`${entry.item.classification} · ${entry.item.disclosureLabel}`:`${entry.item.status} · ${entry.item.evidence}`}</p>
  <p>{item.summary}</p>
  <details className="news-detail"><summary>Questions and supporting detail<span aria-hidden="true">＋</span></summary>
   <div className="news-meaning"><h4>{entry.kind==='use-case'?'Why examine it':'Why it matters'} <small>Atlas interpretation</small></h4><p>{entry.kind==='use-case'?entry.item.connections[0]?.reason:entry.item.implication}</p></div>
   <label className="news-audience">Questions for<select value={audience} onChange={e=>setAudience(e.target.value as Audience)}>{audiences.map(role=><option key={role} value={role}>{role==='assurance'?'Assurance':audienceNames[role]}</option>)}</select></label>
   <div className="news-tags">{item.topics.map(id=><span key={id}>{domains.find(d=>d.id===id)?.shortName}</span>)}</div>
   {entry.kind==='development'?<DevelopmentQuestion item={entry.item}/>:<>
    <p className="news-limits"><strong>Evidence limits</strong> {entry.item.limitations}</p>
    {entry.kind==='use-case'?<><p><strong>Reported value</strong> {entry.item.value}</p><QuestionCard question={useCaseQuestion(entry.item,audience)}/></>:<><p><strong>Review scope</strong> {entry.item.reviewScope}</p><QuestionCard question={incidentQuestion(entry.item,audience)}/></>}
   </>}
   {selected.length>0&&<button className="news-brief" onClick={openBrief}>Review brief · {selected.length}</button>}
   <footer><button className="news-explore" onClick={()=>select(contextId)}>Read context <ArrowUpRight/></button>{entry.kind==='development'?<a href={entry.item.url} target="_blank" rel="noreferrer">Original source ↗</a>:entry.item.sources.map(s=><a key={s.url} href={s.url} target="_blank" rel="noreferrer">{s.title} ↗</a>)}</footer>
   {entry.kind==='development'&&entry.item.backgroundSourceId&&<button className="news-background" onClick={()=>select(`instrument:${entry.item.backgroundSourceId}`)}>Background: {instruments.find(s=>s.id===entry.item.backgroundSourceId)?.shortTitle} →</button>}
   <small className="news-review">{entry.kind==='incident'&&<>Occurred {entry.item.occurred} · </>}{entry.kind==='development'&&entry.item.updated&&<>Source page updated {dateLabel(entry.item.updated)} · </>}Overview reviewed {dateLabel(item.reviewed)}{entry.kind==='development'&&<> · Briefing added {dateLabel(entry.item.added)}</>}</small>
  </details>
 </article>
}
export function TemporalLens({ open, instruments, onClose, onSelect }: Props) {
 const {notice}=useBrief()
 const dialog=useRef<HTMLDialogElement>(null)
 const [days,setDays]=useState<30|90|120>(30)
 const [topic,setTopic]=useState('all')
 const [order,setOrder]=useState<'latest'|'priority'>('latest')
 useEffect(()=>{if(open)dialog.current?.showModal();else dialog.current?.close()},[open])
 const today=briefingAnchor()
 const entries=newsFeed(days,topic,today,order,instruments)
 return <dialog ref={dialog} className="whats-new" aria-labelledby="whats-new-title" onCancel={onClose} onClick={e=>{if(e.target===e.currentTarget)onClose()}}>
  <div className="news-surface">
   <header className="news-heading"><h2 id="whats-new-title">What’s new</h2><button autoFocus onClick={onClose} aria-label="Close What’s new"><X/></button></header>
   <div className="news-filters">
    <label><span className="sr-only">Time period</span><select value={days} onChange={e=>setDays(Number(e.target.value) as 30|90|120)}>{([30,90,120] as const).map(n=><option key={n} value={n}>Last {n} days</option>)}</select></label>
    <label className="news-topic"><span className="sr-only">Topic</span><select value={topic} onChange={e=>setTopic(e.target.value)}><option value="all">All topics</option>{domains.map(d=><option value={d.id} key={d.id}>{d.shortName}</option>)}</select></label>
   </div>
   <div className="news-results"><span aria-live="polite">{entries.length} {entries.length===1?'update':'updates'} · Through {dateLabel(today)}</span><label className="news-order"><span className="sr-only">Updates order</span><select value={order} aria-describedby={order==='priority'?'news-order-note':undefined} onChange={e=>setOrder(e.target.value as 'latest'|'priority')}><option value="latest">Latest first</option><option value="priority">Priority first</option></select></label></div>
   {order==='priority'&&<p className="news-order-note" id="news-order-note">Regulatory-source developments first, then incidents, other developments and use cases; newest first in each group. Editorial order, not an applicability assessment.</p>}
   <div className="news-cards">{entries.map(entry=><NewsCard key={`${entry.kind}:${entry.item.id}`} entry={entry} instruments={instruments} onSelect={onSelect} onClose={onClose}/>)}
    {!entries.length&&<div className="news-empty"><h3>No reviewed items in this selection</h3><p>Try a longer period or another topic. An empty feed does not mean there were no developments.</p><button onClick={()=>{setDays(120);setTopic('all')}}>Show all topics · last 120 days</button></div>}
   </div>
   <details className="news-method"><summary>About this feed<span aria-hidden="true">＋</span></summary><p>Updates are ordered by original publication or findings date. Review dates do not create recency. This feed covers selected Atlas items, not every development.</p><p>Atlas interpretations and discussion prompts support human assessment; they do not establish applicability, compliance or control effectiveness.</p></details>
   <span className="sr-only" role="status">{notice}</span>
  </div>
 </dialog>
}
