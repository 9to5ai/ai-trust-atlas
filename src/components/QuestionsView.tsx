import { useMemo, useRef, useState } from 'react'
import { domains } from '../data/concepts'
import { audiences, audienceNames, type Audience } from '../data/leadershipQuestions'
import { filterQuestions, topicNames } from '../lib/questionCatalogue'
import { QuestionCard, useBrief } from './LeadershipQuestions'

export function QuestionsView({onExplore,active=true}:{onExplore:(id:string)=>void;active?:boolean}) {
 const {audience,setAudience,selected,openBrief,notice}=useBrief()
 const [topics,setTopics]=useState<string[]>([])
 const [starters,setStarters]=useState(true)
 const topicPicker=useRef<HTMLDetailsElement>(null)
 const workspace=useRef<HTMLElement>(null)
 const entries=useMemo(()=>filterQuestions(audience,topics,'',0,starters),[audience,topics,starters])
 const toggleTopic=(id:string)=>{setTopics(old=>old.includes(id)?old.filter(x=>x!==id):[...old,id])}
 const showSelection=(suggested:boolean)=>{setStarters(suggested);if(workspace.current)workspace.current.scrollTop=0}
 const topicLabel=topics.length===1?topicNames[topics[0]]:topics.length?`Topics · ${topics.length}`:'All topics'
 if(!active)return null
 return <section className={`questions-workspace questions-compact${selected.length?' has-brief':''}`} aria-label="Questions workspace" ref={workspace}>
  <div className="questions-content">
   <header className="questions-heading"><h1>Questions</h1></header>
   <div className="questions-filters">
    <label className="questions-audience-select"><span className="sr-only">Question audience</span><select value={audience} onChange={e=>setAudience(e.target.value as Audience)}>{audiences.map(role=><option key={role} value={role}>{role==='assurance'?'Assurance':audienceNames[role]}</option>)}</select></label>
    <details className="questions-topic-picker" ref={topicPicker} onKeyDown={e=>{if(e.key==='Escape'){e.currentTarget.open=false;e.currentTarget.querySelector('summary')?.focus()}}}>
     <summary>{topicLabel}<span aria-hidden="true">⌄</span></summary>
     <div className="questions-topic-options" role="group" aria-label="Question topics">
      <button className="questions-all-topics" aria-pressed={!topics.length} onClick={()=>setTopics([])}>All topics</button>
      {domains.map(d=><label key={d.id}><input type="checkbox" checked={topics.includes(d.id)} onChange={()=>toggleTopic(d.id)}/><span>{topicNames[d.id]??d.name}</span></label>)}
      <button className="questions-topic-done" onClick={()=>{if(topicPicker.current){topicPicker.current.open=false;topicPicker.current.querySelector('summary')?.focus()}}}>Done</button>
     </div>
    </details>
   </div>
   <section className="questions-browse" aria-label="Browse questions">
    {!starters&&<button className="questions-catalogue-return" onClick={()=>showSelection(true)}>← Back to suggested questions</button>}
    {entries.map(entry=><QuestionCard key={entry.question.id} question={entry.question} compact onExplore={()=>onExplore(entry.nodeId)}>
     <p className="question-topic-label">{entry.topics.map(t=>topicNames[t]??t).join(' · ')}</p>
     {entry.useCase&&<div className="question-development"><strong>Use case · {entry.useCase.company}</strong><small>{entry.useCase.title} · Reported {entry.useCase.reported}</small></div>}
     {entry.incident&&<div className="question-development"><strong>Incident · {entry.incident.shortTitle}</strong><small>Occurred {entry.incident.occurred} · Findings {entry.incident.updated}</small></div>}
     {entry.development&&<div className="question-development"><a href={entry.development.url} target="_blank" rel="noreferrer">{entry.development.title} ↗</a><small>Published {entry.development.published} · Added to Atlas {entry.development.added}</small></div>}
    </QuestionCard>)}
    {!entries.length&&<div className="questions-no-results"><h2>No questions match this selection</h2><button onClick={()=>setTopics([])}>Show all topics</button></div>}
    <button className="questions-browse-all" hidden={!starters} onClick={()=>showSelection(false)}>Browse all questions <span aria-hidden="true">→</span></button>
    <p className="questions-note">Atlas-authored discussion prompts. References provide context, not findings of compliance or effectiveness.</p>
   </section>
  </div>
  <span className="sr-only" role="status">{notice}</span>
  {selected.length>0&&<button className="questions-review-brief" onClick={openBrief}>Review brief <span>· {selected.length}</span><span aria-hidden="true">↗</span></button>}
 </section>
}
