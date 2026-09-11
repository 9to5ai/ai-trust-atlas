import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { audiences, audienceNames, briefText, MAX_BRIEF_QUESTIONS, questionForDevelopment, type Audience, type Question } from '../data/leadershipQuestions'
import { developments, inDateWindow, type Development } from '../data/developments'
import { concepts, domains } from '../data/concepts'
import { questionsForNode } from '../data/nodeQuestions'
import type { GraphNodeKind } from '../types'

type BriefContext = { audience: Audience; setAudience: (value: Audience) => void; selected: Question[]; toggle: (q: Question) => void; openBrief: () => void; notice: string }
const Context = createContext<BriefContext | null>(null)
const useBrief = () => { const value = useContext(Context); if (!value) throw new Error('Questions require QuestionsProvider'); return value }
const readAudience = (): Audience => { try { const value = localStorage.getItem('atlas-question-audience'); return audiences.includes(value as Audience) ? value as Audience : 'board' } catch { return 'board' } }

export function QuestionsProvider({children}: {children: ReactNode}) {
  const [audience, setAudience] = useState<Audience>(readAudience)
  const [selected, setSelected] = useState<Question[]>([])
  const [open, setOpen] = useState(false)
  const [purpose, setPurpose] = useState('')
  const [notice, setNotice] = useState('')
  const [copyStatus, setCopyStatus] = useState('')
  const [fallback, setFallback] = useState(false)
  const dialog = useRef<HTMLDialogElement>(null)
  const fallbackText = useRef<HTMLTextAreaElement>(null)
  useEffect(() => { try { localStorage.setItem('atlas-question-audience',audience) } catch { /* Browsing still works without storage. */ } },[audience])
  useEffect(() => { if(open) dialog.current?.showModal(); else dialog.current?.close() },[open])
  useEffect(() => { if(fallback) { fallbackText.current?.focus(); fallbackText.current?.select() } },[fallback])
  useEffect(() => { setCopyStatus(''); setFallback(false) },[selected,purpose])
  const toggle = (q: Question) => {
    if(selected.some(item => item.id === q.id)) { setSelected(items => items.filter(item => item.id !== q.id)); setNotice('Question removed from brief.'); return }
    if(selected.length >= MAX_BRIEF_QUESTIONS) { setNotice('Your brief has eight questions. Remove one to make room.'); return }
    setSelected(items => [...items,q]); setNotice('Question added to your meeting brief.')
  }
  const move = (id: string, direction: number) => setSelected(items => { const next = [...items]; const i=next.findIndex(q=>q.id===id); const target=i+direction; if(i<0 || target<0 || target>=next.length)return items; [next[i],next[target]]=[next[target],next[i]]; return next })
  const copy = async () => { try { await navigator.clipboard.writeText(briefText(purpose,selected)); setCopyStatus('Copied with source links.') } catch { setFallback(true); setCopyStatus('Copy the selected text below.') } }
  return <Context.Provider value={{audience,setAudience,selected,toggle,openBrief:()=>setOpen(true),notice}}>
    {children}
    {selected.length > 0 && <button className="brief-launcher" onClick={()=>setOpen(true)} aria-label={`Meeting brief, ${selected.length} ${selected.length === 1 ? 'question' : 'questions'}`}>Meeting brief <span>{selected.length}</span> ↗</button>}
    {createPortal(<dialog ref={dialog} className="meeting-brief" aria-labelledby="meeting-brief-title" onCancel={()=>setOpen(false)} onClick={e=>{if(e.target===e.currentTarget)setOpen(false)}}>
      <header className="brief-heading"><div><span>AI TRUST ATLAS</span><h2 id="meeting-brief-title">Your meeting brief</h2><p>{selected.length} of {MAX_BRIEF_QUESTIONS} questions · ready for discussion</p></div><button autoFocus aria-label="Close meeting brief" onClick={()=>setOpen(false)}>✕</button></header>
      <label className="brief-purpose">Purpose of the discussion<input maxLength={240} value={purpose} placeholder="e.g. Board review of our AI suppliers" onChange={e=>setPurpose(e.target.value)} /></label>
      <p className="brief-purpose-print">{purpose || 'Discussion questions'}</p>
      <p className="questions-note">Atlas-authored, source-informed prompts. Confirm the context and applicable requirements. Supporting material is an input to human assessment.</p>
      <div className="brief-actions"><button disabled={!selected.length} onClick={copy}>Copy brief</button><button disabled={!selected.length} onClick={()=>window.print()}>Print / Save PDF</button></div>
      <p className="brief-status" role="status">{copyStatus}</p>
      {fallback && <textarea ref={fallbackText} className="brief-copy-fallback" aria-label="Brief text to copy" readOnly value={briefText(purpose,selected)} />}
      <ol className="brief-questions">{selected.map(q=><li key={q.id}><div className="question-context">{audienceNames[q.audience]} · {q.context}{q.developmentDate && ` · ${q.developmentDate}`}</div><h3>{q.text}</h3><QuestionDetail question={q} /><div className="brief-item-actions"><button disabled={selected[0].id===q.id} aria-label={`Move up: ${q.text}`} onClick={()=>move(q.id,-1)}>↑</button><button disabled={selected[selected.length-1].id===q.id} aria-label={`Move down: ${q.text}`} onClick={()=>move(q.id,1)}>↓</button><button onClick={()=>toggle(q)} aria-label={`Remove: ${q.text}`}>Remove</button></div></li>)}</ol>
      {!selected.length && <div className="brief-empty"><h3>Make room for a better conversation.</h3><p>Explore a topic, concept or development and choose “Add to brief”. Start with five or six questions.</p><button onClick={()=>setOpen(false)}>Return to Atlas</button></div>}
    </dialog>,document.body)}
  </Context.Provider>
}

export function AudiencePicker() {
  const {audience,setAudience,selected,openBrief} = useBrief()
  return <div className="question-tools"><div className="question-audiences" role="group" aria-label="Question audience">{audiences.map(role=><button key={role} aria-pressed={audience===role} onClick={()=>setAudience(role)}>{audienceNames[role]}</button>)}</div>{selected.length>0 && <button className="questions-view-brief" onClick={openBrief}>Brief · {selected.length}</button>}</div>
}
function QuestionDetail({question:q}: {question:Question}) {
  return <div className="question-detail">{q.basis && <><h4>Connection to this item</h4><p>{q.basis}</p></>}<h4>Why ask?</h4><p>{q.why}</p><h4>What to ask for</h4><p>{q.askFor}</p><h4>If the answer is vague…</h4><p>{q.followUp}</p><h4>Related references</h4><ul>{q.sources.map(s=><li key={s.url}><a href={s.url} target="_blank" rel="noreferrer">{s.title} ↗</a></li>)}</ul></div>
}
function QuestionCard({question:q}: {question:Question}) {
  const {selected,toggle} = useBrief()
  const added=selected.some(item=>item.id===q.id)
  return <article className="leadership-question"><details><summary><span className="question-context">{q.context}</span><span className="question-text">{q.text}</span><span className="question-expand">Why ask · What to ask for <span aria-hidden="true">＋</span></span></summary><QuestionDetail question={q} /></details><button className="question-add" aria-pressed={added} onClick={()=>toggle(q)}>{added?'✓ In brief · remove':'+ Add to brief'}</button></article>
}
export function QuestionsPanel({kind,id}: {kind:GraphNodeKind;id:string}) {
  const {audience,notice} = useBrief()
  const items=questionsForNode(kind,id,audience)
  const domainId=kind==='domain'?id:kind==='concept'?concepts.find(c=>c.id===id)?.domainId:undefined
  const recent=developments.filter(d=>d.topics.includes(domainId??'')&&inDateWindow(d.published,120)).sort((a,b)=>b.published.localeCompare(a.published)).slice(0,2)
  return <section className="leadership-panel" aria-label="Questions to ask"><header><span className="questions-eyebrow">PREPARE YOUR NEXT CONVERSATION</span><h3>Questions to ask</h3></header><AudiencePicker/><p className="questions-note">Atlas-authored prompts for discussion. References provide context; they do not make every question a regulatory requirement.</p><div className="leadership-question-list">{items.map(q=><QuestionCard key={q.id} question={q}/>)}</div><span className="question-notice" role="status">{notice}</span>{recent.length>0 && <details className="questions-recent"><summary>Recent developments in {domains.find(d=>d.id===domainId)?.shortName}</summary>{recent.map(item=><div key={item.id}><a href={item.url} target="_blank" rel="noreferrer">{item.title} ↗</a><small>{item.published}</small><DevelopmentQuestion item={item}/></div>)}</details>}</section>
}
export function DevelopmentQuestion({item}: {item:Development}) {
  const {audience} = useBrief()
  const q=questionForDevelopment(item,audience)
  return q?<div className="development-question"><QuestionCard key={q.id} question={q}/></div>:null
}

export function BriefNotice() { const {notice}=useBrief(); return <span className="question-notice" role="status">{notice}</span> }
