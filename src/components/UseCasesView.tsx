import { useState } from 'react'
import { ArrowUpRight, MagnifyingGlass } from '@phosphor-icons/react'
import { filterUseCases, useCaseWorkflows, useCases, useCaseQuestion } from '../data/useCases'
import { audienceNames } from '../data/leadershipQuestions'
import { AudiencePicker, QuestionCard, useBrief } from './LeadershipQuestions'

export function UseCasesView({active,onExplore,onShowUniverse}:{active:boolean;onExplore:(id:string)=>void;onShowUniverse:()=>void}) {
 const [workflow,setWorkflow]=useState('all')
 const [sector,setSector]=useState('all')
 const [query,setQuery]=useState('')
 const {audience,openBrief,selected}=useBrief()
 const items=filterUseCases(workflow,sector,query)
 if(!active)return null
 return <section className="use-cases-workspace" aria-label="Production use cases">
  <header className="use-cases-heading"><div><span className="questions-eyebrow">AI IN PRACTICE</span><h2>See how the work is changing.</h2><p>Production deployments. Practical questions for your next decision.</p></div><button className="use-case-universe" onClick={onShowUniverse}>Show in universe <ArrowUpRight/></button></header>
  <div className="use-case-filters">
   <div className="use-case-workflows" role="group" aria-label="Use case workflow"><button aria-pressed={workflow==='all'} onClick={()=>setWorkflow('all')}>All workflows</button>{Object.entries(useCaseWorkflows).map(([id,label])=><button key={id} aria-pressed={workflow===id} onClick={()=>setWorkflow(id)}>{label}</button>)}</div>
   <div className="use-case-tools"><label className="use-case-search"><MagnifyingGlass/><input aria-label="Search use cases" placeholder="Company or use case" value={query} onChange={e=>setQuery(e.target.value)}/></label><label className="use-case-sector"><span className="sr-only">Sector</span><select aria-label="Use case sector" value={sector} onChange={e=>setSector(e.target.value)}><option value="all">All sectors</option>{[...new Set(useCases.map(i=>i.sector))].sort().map(s=><option key={s}>{s}</option>)}</select></label><AudiencePicker/><button className="use-case-brief" onClick={openBrief}>Your shortlist · {selected.length}</button></div>
  </div>
  <div className="use-case-results"><span role="status">{items.length} documented {items.length===1?'deployment':'deployments'}</span><span>Company accounts · evidence dates shown</span></div>
  <div className="use-case-grid">{items.map(item=><article className="use-case-card" key={item.id}>
   <div className="use-case-card-top"><span>{useCaseWorkflows[item.workflow]}</span><span className="use-case-status"><i/>{item.status} reported</span></div>
   <strong className="use-case-company">{item.company}</strong><h3><button onClick={()=>onExplore(`use-case:${item.id}`)}>{item.title}<ArrowUpRight/></button></h3><p>{item.summary}</p>
   <div className="use-case-value"><small>Reported value</small><p>{item.value}</p></div>
   <div className="use-case-card-foot"><span>{item.evidence} · {item.reported}</span><a href={item.sources[0].url} target="_blank" rel="noreferrer" aria-label={`Read evidence for ${item.company}`}>Source ↗</a></div>
   <details className="use-case-question"><summary>Question for {audienceNames[audience]}</summary><QuestionCard question={useCaseQuestion(item,audience)}/></details>
  </article>)}</div>
  {!items.length&&<div className="news-empty"><h3>No use cases match</h3><p>Try another workflow, sector or company.</p><button onClick={()=>{setWorkflow('all');setSector('all');setQuery('')}}>Clear filters</button></div>}
  <footer className="use-case-coverage">A curated starting collection, not a ranking or endorsement. Production status reflects the dated public account. Reported adoption and benefits are not independently audited.</footer>
 </section>
}
