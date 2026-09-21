import { concepts } from '../data/concepts'
import { controlObjectiveById } from '../data/controls'
import { useCaseQuestion, useCaseWorkflows, type UseCase } from '../data/useCases'
import { AudiencePicker, QuestionCard, useBrief } from './LeadershipQuestions'

export function UseCaseDetail({item,onSelect}:{item:UseCase;onSelect:(id:string)=>void}) {
 const {audience}=useBrief()
 return <div className="use-case-detail">
  <div className="inspector-kicker">Use case · {item.company}</div><h2>{item.title}</h2>
  <div className="use-case-badges"><span>{item.status} reported</span><span>{item.evidence}</span></div>
  <p className="inspector-summary">{item.summary}</p><p className="use-case-date">Evidence published: {item.reported}</p>
  <section className="inspector-section"><h3>How the work changes</h3><div className="use-case-workflow"><div><small>The task</small><p>{item.before}</p></div><div><small>AI’s role</small><p>{item.actions}</p></div><div><small>Human role & limits</small><p>{item.human}</p></div></div></section>
  <section className="inspector-section"><h3>Reported value</h3><p>{item.value} <a href={item.sources[0].url} target="_blank" rel="noreferrer">Source ↗</a></p><p className="questions-note">{item.limitations}</p></section>
  <section className="inspector-section"><h3>Questions to ask</h3><AudiencePicker/><QuestionCard question={useCaseQuestion(item,audience)}/></section>
  <details className="inspector-section" open><summary>Practices to examine <small>Atlas interpretation</small></summary>
   <p className="questions-note">Connections help assess a similar deployment. They do not establish which controls this company uses or how well they work.</p>
   {item.connections.map(c=><div className="incident-connection" key={c.conceptId}><button onClick={()=>onSelect(`concept:${c.conceptId}`)}>{concepts.find(x=>x.id===c.conceptId)?.name} →</button><p>{c.reason}</p><button onClick={()=>onSelect(`control-objective:${c.controlId}`)}>{controlObjectiveById.get(c.controlId)?.name} →</button></div>)}
  </details>
  <details className="inspector-section"><summary>Evidence & scope</summary><p>{useCaseWorkflows[item.workflow]} · {item.sector}</p>{item.sources.map(source=><p key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.title} ↗</a></p>)}<p className="questions-note">Public account reviewed {item.reviewed}. This is a snapshot of what was reported on {item.reported}, not a fresh operating-status attestation. No independent performance audit was reviewed.</p></details>
 </div>
}
