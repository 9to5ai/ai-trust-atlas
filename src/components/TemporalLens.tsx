import { AudiencePicker, DevelopmentQuestion, BriefNotice } from './LeadershipQuestions'
import { ArrowCounterClockwise, ArrowUpRight, X } from '@phosphor-icons/react'
import { useEffect, useRef, useState } from 'react'
import { briefingReview, filterDevelopments } from '../data/developments'
import { domains } from '../data/concepts'
import type { Instrument } from '../types'

type Props = {
  open: boolean; cutoff: number; minYear: number; maxYear: number; instruments: Instrument[];
  onChange: (year: number) => void; onClose: () => void; onReset: () => void; onSelect: (id: string) => void;
}
const dateLabel = (date: string) => new Date(`${date}T00:00:00Z`).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })
export function TemporalLens({ open, cutoff, minYear, maxYear, instruments, onChange, onClose, onReset, onSelect }: Props) {
  const dialog = useRef<HTMLDialogElement>(null)
  const [days, setDays] = useState<30 | 90 | 120>(30)
  const [topic, setTopic] = useState('all')
  useEffect(() => { if (open) dialog.current?.showModal(); else dialog.current?.close() }, [open])
  const today = new Date().toISOString().slice(0, 10)
  const items = filterDevelopments(days, topic, today)
  const count = items.length
  const explore = (id: string) => { onSelect(`instrument:${id}`); onClose() }
  return <dialog ref={dialog} className="whats-new" aria-labelledby="whats-new-title" onCancel={onClose} onClick={event => { if (event.target === event.currentTarget) onClose() }}>
    <div className="news-surface">
      <header className="news-heading"><div><span className="news-eyebrow">ATLAS BRIEFING</span><h2 id="whats-new-title">What’s new</h2><p>Developments worth a closer look.</p></div><button autoFocus onClick={onClose} aria-label="Close What’s new"><X /></button></header>
      <div className="news-filters">
        <div className="news-period" aria-label="Time period">{([30,90,120] as const).map(n => <button key={n} aria-pressed={days === n} onClick={() => setDays(n)}>Last {n} days</button>)}</div>
        <label className="news-topic">Topic<select value={topic} onChange={e => setTopic(e.target.value)}><option value="all">All topics</option>{domains.map(d => <option value={d.id} key={d.id}>{d.shortName}</option>)}</select></label>
      </div>
      <div className="news-question-audience"><span>Questions for your role</span><AudiencePicker /><BriefNotice /></div>
      <div className="news-results" aria-live="polite"><strong>{count} {count === 1 ? 'item' : 'items'}</strong><span>By development date · through {dateLabel(today)}</span></div>
      <div className="news-cards">
        {items.map(item => <article className="news-card" key={item.id}>
          <div className="news-meta"><span>{item.status}</span><time dateTime={item.published}>{item.dateBasis ?? 'Published'} {dateLabel(item.published)}</time></div>
          <h3>{item.title}</h3><p className="news-issuer">{item.issuer}</p><p>{item.summary}</p>
          <div className="news-tags">{item.topics.map(id => <button key={id} onClick={() => setTopic(id)}>{domains.find(d => d.id === id)?.shortName}</button>)}</div>
          <div className="news-meaning"><h4>Why it matters <small>Atlas interpretation</small></h4><p>{item.implication}</p></div>
          <DevelopmentQuestion item={item} />
          <footer><button className="news-explore" onClick={() => explore(item.sourceId)}>Explore in Atlas <ArrowUpRight /></button><a href={item.url} target="_blank" rel="noreferrer">Original source ↗</a></footer>
          {item.backgroundSourceId && <button className="news-background" onClick={() => explore(item.backgroundSourceId!)}>Background: {instruments.find(s => s.id === item.backgroundSourceId)?.shortTitle} · {instruments.find(s => s.id === item.backgroundSourceId)?.published} →</button>}
          <small className="news-review">Overview reviewed {dateLabel(item.reviewed)} · Briefing added {dateLabel(item.added)}</small>
        </article>)}
        {count === 0 && <div className="news-empty"><h3>No reviewed items in this selection</h3><p>Try a longer period or another topic. An empty feed does not mean there were no developments.</p><button onClick={() => { setDays(120); setTopic('all') }}>Show all topics · last 120 days</button></div>}
      </div>
      <footer className="news-coverage"><strong>About this briefing</strong><p>Official overviews checked {dateLabel(briefingReview)} across APRA, ASIC, ASD, FSB, NIST, the European Commission, EDPB, DTA, CSA and OWASP. Dates reflect publications, consultation openings or clearly labelled guidance editions—not when we added them. Selected APRA and NIST developments were additionally reviewed on 10 September 2026; each card records its own review date. This curated briefing is not a complete newswire or continuous monitoring.</p></footer>
      <details className="news-publication"><summary>Filter Atlas sources by publication year</summary><p>This filters the Atlas, independently of the briefing period. It does not show which rules applied at that time.</p><label>Published by {cutoff}<input aria-label="Publication year" type="range" min={minYear} max={maxYear} value={cutoff} onChange={e => onChange(Number(e.target.value))} /></label><button onClick={onReset}><ArrowCounterClockwise /> Show all dates</button></details>
    </div>
  </dialog>
}
