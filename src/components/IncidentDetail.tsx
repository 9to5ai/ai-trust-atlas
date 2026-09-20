import { concepts } from '../data/concepts'
import { controlObjectiveById } from '../data/controls'
import { incidentQuestion, type Incident } from '../data/incidents'
import { AudiencePicker, QuestionCard, useBrief } from './LeadershipQuestions'

export function IncidentDetail({item,onSelect}:{item:Incident;onSelect:(id:string)=>void}) {
 const {audience}=useBrief()
 return <div className="incident-detail">
  <span className="inspector-kicker">Incident · evaluation with real-world impact</span><h2>{item.title}</h2>
  <p>{item.summary}</p><div className="incident-dates"><span>Occurred {item.occurred}</span><span>OpenAI disclosure {item.disclosed}</span><span>Findings published {item.updated}</span></div>
  <section className="inspector-section"><h3>What the reports establish</h3>{item.findings.map((f,n)=><p key={n}>{f.text} <a href={item.sources[f.source].url} target="_blank" rel="noreferrer">[{f.source+1}]</a></p>)}</section>
  <section className="inspector-section"><h3>Why it matters <small>Atlas interpretation</small></h3><p>{item.implication}</p></section>
  <section className="inspector-section"><h3>Practices to examine</h3><p className="questions-note">These connections suggest areas to review; they do not establish that a framework would have prevented the incident.</p>
   {item.connections.map(c=><div className="incident-connection" key={c.conceptId}><button onClick={()=>onSelect(`concept:${c.conceptId}`)}>{concepts.find(x=>x.id===c.conceptId)?.name} →</button><p>{c.reason}</p><p>{c.practice}</p><button onClick={()=>onSelect(`control-objective:${c.controlId}`)}>View practice: {controlObjectiveById.get(c.controlId)?.shortName} →</button></div>)}
  </section>
  <section className="inspector-section"><h3>Questions to ask</h3><AudiencePicker/><QuestionCard question={incidentQuestion(item,audience)}/></section>
  <details className="inspector-section"><summary>Sources and limits</summary><p>{item.limitations}</p>{item.sources.map((s,n)=><p key={s.url}><a href={s.url} target="_blank" rel="noreferrer">[{n+1}] {s.title} ↗</a><small className="incident-source-role">{s.role}</small></p>)}<p>Report overviews reviewed {item.reviewed}. The linked technical report was not independently re-audited by the Atlas.</p></details>
 </div>
}
