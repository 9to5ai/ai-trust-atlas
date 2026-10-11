import { useMemo, useState } from 'react'
import { Link } from '../app/router'
import { domains } from '../data/concepts'
import { audienceNames } from '../data/leadershipQuestions'
import { filterQuestions, topicNames } from '../lib/questionCatalogue'
import { AudiencePicker, QuestionCard, useBrief } from './LeadershipQuestions'

export function QuestionsView({onExplore,active=true}:{onExplore:(id:string)=>void;active?:boolean}) {
 const {audience,selected,toggle,move,clear,openBrief,notice,storageNotice}=useBrief()
 const [topics,setTopics]=useState<string[]>([])
 const [starters,setStarters]=useState(true)
 const entries=useMemo(()=>filterQuestions(audience,topics,'',0,starters),[audience,topics,starters])
 const toggleTopic=(id:string)=>{setTopics(old=>old.includes(id)?old.filter(x=>x!==id):[...old,id])}
 const reset=()=>{setTopics([])}
 if(!active)return null
 return <section className="questions-workspace" aria-label="Questions workspace">
  <header className="questions-heading"><div><span className="questions-eyebrow">PREPARE YOUR NEXT CONVERSATION</span><h1>Questions worth asking</h1><p>Choose your audience and topics. Build a focused discussion, then explore the sources behind the questions.</p></div></header>
  <div className="questions-route-next"><span>Use this route to prepare a meeting. For requirements, return to the <Link to="/universe">Universe</Link>; for examples, see <Link to="/cases">Use cases</Link>.</span></div>
  <div className={`questions-columns${selected.length?' has-brief':''}`}>
   <aside className="questions-topics" aria-label="Question topics"><h3>Topics</h3><button aria-pressed={!topics.length} onClick={()=>{setTopics([])}}>All topics</button>{domains.map(d=><button key={d.id} aria-pressed={topics.includes(d.id)} onClick={()=>toggleTopic(d.id)}><span>{topicNames[d.id]??d.name}</span><span aria-hidden="true">{topics.includes(d.id)?'✓':'+'}</span></button>)}<p>Choose more than one topic.</p></aside>
   <section className="questions-browse" aria-label="Browse questions">
    <div className="questions-audience"><AudiencePicker/></div>
    <div className="questions-selection" role="group" aria-label="Question selection"><button aria-pressed={starters} onClick={()=>setStarters(true)}>Starter selection</button><button aria-pressed={!starters} onClick={()=>setStarters(false)}>Browse all</button></div>
    <div className="questions-selection-note"><h2>{starters?'Start the conversation':'Browse questions'}</h2><p>{starters?`Opening questions for ${audienceNames[audience]}${topics.length?' on your selected topics':''}. Expand a question for evidence and follow-ups.`:'All authored questions for your audience and topics, including incidents, use cases and developments.'}</p></div>
    {entries.map(entry=><div className="question-browse-item" key={entry.question.id}>
     {entry.useCase&&<div className="question-development"><strong>Use case · {entry.useCase.company}</strong><small>{entry.useCase.title} · Reported {entry.useCase.reported}</small></div>}
     {entry.incident&&<div className="question-development"><strong>Incident · {entry.incident.shortTitle}</strong><small>Occurred {entry.incident.occurred} · Findings {entry.incident.updated}</small></div>}
     <div className="question-topic-label">{entry.topics.map(t=>topicNames[t]??t).join(' · ')}</div>
     {entry.development&&<div className="question-development"><a href={entry.development.url} target="_blank" rel="noreferrer">{entry.development.title} ↗</a><small>Published {entry.development.published} · Added to Atlas {entry.development.added}</small></div>}
     <QuestionCard question={entry.question}/><button className="question-explore" onClick={()=>onExplore(entry.nodeId)}>Read context →</button>
    </div>)}
    {!entries.length&&<div className="questions-no-results"><h3>No questions match this selection</h3><p>Try another topic or show all topics.</p><button onClick={reset}>Clear question filters</button></div>}
    <p className="questions-note">Atlas-authored discussion prompts. References provide context, not findings of compliance or effectiveness.</p>
   </section>
   {selected.length>0&&<aside className="questions-shortlist" aria-label="Your brief"><div className="shortlist-heading"><h3>Your brief <span>{selected.length}</span></h3><button onClick={openBrief}>Review / export</button></div><p>{storageNotice}</p>
    <ol>{selected.map((q,index)=><li key={q.id}><small>{audienceNames[q.audience]} · {q.context}</small><p>{q.text}</p><div><button disabled={index===0} onClick={()=>move(q.id,-1)} aria-label={`Move up: ${q.text}`}>↑</button><button disabled={index===selected.length-1} onClick={()=>move(q.id,1)} aria-label={`Move down: ${q.text}`}>↓</button><button onClick={()=>toggle(q)} aria-label={`Remove: ${q.text}`}>Remove</button></div></li>)}</ol>
    <button className="shortlist-clear" onClick={clear}>Clear brief</button>
   </aside>}
  </div>
  <span className="sr-only" role="status">{notice}</span>
  <button className={`questions-mobile-brief${selected.length?'':' brief-is-empty'}`} onClick={openBrief}>Your brief · {selected.length}<span>{selected.length?'Review / export ↗':'Add questions to prepare a meeting'}</span></button>
 </section>
}
