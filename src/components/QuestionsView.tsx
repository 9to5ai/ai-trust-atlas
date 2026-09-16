import { useMemo, useState } from 'react'
import { domains } from '../data/concepts'
import { audienceNames } from '../data/leadershipQuestions'
import { filterQuestions, topicNames } from '../lib/questionCatalogue'
import { AudiencePicker, QuestionCard, useBrief } from './LeadershipQuestions'

export function QuestionsView({onExplore,active=true}:{onExplore:(id:string)=>void;active?:boolean}) {
 const {audience,selected,toggle,move,clear,openBrief,notice,storageNotice}=useBrief()
 const [topics,setTopics]=useState<string[]>([])
 const [query,setQuery]=useState('')
 const [days,setDays]=useState(0)
 const [starters,setStarters]=useState(false)
 const entries=useMemo(()=>filterQuestions(audience,topics,query,days,starters),[audience,topics,query,days,starters])
 const toggleTopic=(id:string)=>{setStarters(false);setTopics(old=>old.includes(id)?old.filter(x=>x!==id):[...old,id])}
 const reset=()=>{setTopics([]);setQuery('');setDays(0);setStarters(false)}
 if(!active)return null
 return <section className="questions-workspace" aria-label="Questions workspace">
  <header className="questions-heading"><div><span className="questions-eyebrow">PREPARE YOUR NEXT CONVERSATION</span><h2>Questions worth asking</h2><p>Choose your audience and topics. Build a focused discussion.</p></div><AudiencePicker/></header>
  <div className="questions-columns">
   <aside className="questions-topics" aria-label="Question topics"><h3>Topics</h3><button aria-pressed={!topics.length} onClick={()=>{setTopics([]);setStarters(false)}}>All topics</button>{domains.map(d=><button key={d.id} aria-pressed={topics.includes(d.id)} onClick={()=>toggleTopic(d.id)}><span>{topicNames[d.id]??d.name}</span><span aria-hidden="true">{topics.includes(d.id)?'✓':'+'}</span></button>)}<p>Choose more than one topic.</p></aside>
   <section className="questions-browse" aria-label="Browse questions">
    <div className="questions-filters"><label>Find a question<input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Try suppliers, accountability or testing"/></label><label>Developments<select value={days} onChange={e=>{setDays(Number(e.target.value));setStarters(false)}}><option value={0}>All questions</option><option value={30}>Published in last 30 days</option><option value={90}>Published in last 90 days</option><option value={120}>Published in last 120 days</option></select></label></div>
    <div className="questions-start"><button aria-pressed={starters} onClick={()=>{setStarters(!starters);setTopics([]);setQuery('');setDays(0)}}>{starters?'Show all questions':'Start with five questions'}</button><span>{starters?'An editorial starting set. Add the questions that fit your discussion.':'Browse freely, or review a starting set for your audience.'}</span></div>
    <div className="questions-result-count" role="status">{entries.length} questions for {audienceNames[audience]}{topics.length?` · ${topics.length} topics`:''}</div>
    {entries.map(entry=><div className="question-browse-item" key={entry.question.id}>
     <div className="question-topic-label">{entry.topics.map(t=>topicNames[t]??t).join(' · ')}</div>
     {entry.development&&<div className="question-development"><a href={entry.development.url} target="_blank" rel="noreferrer">{entry.development.title} ↗</a><small>Published {entry.development.published} · Added to Atlas {entry.development.added}</small></div>}
     <QuestionCard question={entry.question}/><button className="question-explore" onClick={()=>onExplore(entry.nodeId)}>Explore in Atlas →</button>
    </div>)}
    {!entries.length&&<div className="questions-no-results"><h3>No questions match this selection</h3><p>Try another topic, a wider date window or a shorter search.</p><button onClick={reset}>Clear question filters</button></div>}
    <p className="questions-note">Atlas-authored discussion prompts. References provide context, not findings of compliance or effectiveness.</p>
   </section>
   <aside className="questions-shortlist" aria-label="Your shortlist"><div className="shortlist-heading"><h3>Your shortlist <span>{selected.length}</span></h3><button onClick={openBrief}>Review / export</button></div><p>{storageNotice}</p><p>Five to eight questions usually makes a focused discussion.</p>
    {!selected.length&&<div className="shortlist-empty">Add questions as you browse. You can combine topics and audiences.</div>}
    <ol>{selected.map((q,index)=><li key={q.id}><small>{audienceNames[q.audience]} · {q.context}</small><p>{q.text}</p><div><button disabled={index===0} onClick={()=>move(q.id,-1)} aria-label={`Move up: ${q.text}`}>↑</button><button disabled={index===selected.length-1} onClick={()=>move(q.id,1)} aria-label={`Move down: ${q.text}`}>↓</button><button onClick={()=>toggle(q)} aria-label={`Remove: ${q.text}`}>Remove</button></div></li>)}</ol>
    {selected.length>0&&<button className="shortlist-clear" onClick={clear}>Clear shortlist</button>}
   </aside>
  </div>
  <span className="sr-only" role="status">{notice}</span>
  <button className="questions-mobile-brief" onClick={openBrief}>Your shortlist · {selected.length}<span>Review / export ↗</span></button>
 </section>
}
