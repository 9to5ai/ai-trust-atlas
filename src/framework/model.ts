import { controlObjectives } from '../data/controls.js'
import { concepts } from '../data/concepts.js'
import { instruments } from '../data/instruments.js'
import { riskSubdomains } from '../data/mitRiskTaxonomy.js'
import { developments, inDateWindow } from '../data/developments.js'

export const useCases = ['Staff productivity', 'Customer interactions', 'Consequential decisions', 'Autonomous agents', 'Critical operations', 'AI products'] as const
export type Profile = { name: string; sector: string; region: string; description: string; uses: string[]; policies: string; appetite: string; sponsor: string }
export type RiskEntry = { id: string; title: string; scenario: string; included: boolean; rationale: string; owner: string }
export type Practice = { id: string; title: string; objective: string; actions: string; evidence: string; owner: string; escalation: string; reviewDate: string; status: 'Proposed' | 'Approved design' | 'Reported operating'; included: boolean; rationale: string; riskIds: string[]; sourceIds: string[]; origin: 'Atlas starting point' | 'AI draft' | 'Organisation' }
export type Approval = { by: string; at: string; revision: number; content: string }
export type Workspace = { schema: 1; profile: Profile; risks: RiskEntry[]; practices: Practice[]; sourceIds: string[]; overview: string; assumptions: string; decisions: string; revision: number; updated: string; approval?: Approval; changes: { id: string; decision: string; note: string; at: string }[] }
export const blankProfile: Profile = { name: '', sector: 'Financial services', region: 'Australia', description: '', uses: [], policies: '', appetite: '', sponsor: '' }
const useRisks: Record<string, string[]> = {
  'Staff productivity': ['mit-risk-3-1','mit-risk-5-1'], 'Customer interactions': ['mit-risk-1-2','mit-risk-5-2','mit-risk-4-3'],
  'Consequential decisions': ['mit-risk-1-1','mit-risk-1-3','mit-risk-7-4'], 'Autonomous agents': ['mit-risk-7-1','mit-risk-7-2','mit-risk-7-6'],
  'Critical operations': ['mit-risk-7-3','mit-risk-6-1'], 'AI products': ['mit-risk-4-1','mit-risk-4-2','mit-risk-6-4'],
}
export function createWorkspace(profile: Profile): Workspace {
  const selected = new Set(['mit-risk-2-1','mit-risk-2-2','mit-risk-6-5','mit-risk-7-3', ...profile.uses.flatMap(u => useRisks[u] ?? [])])
  const risks = riskSubdomains.map(r => ({ id:r.id,title:r.name,scenario:r.definition,included:selected.has(r.id),rationale:selected.has(r.id)?`Starting point for ${profile.uses.filter(u=>useRisks[u]?.includes(r.id)).join(', ') || 'privacy, security, governance or reliability'}. Confirm relevance to your activities.`:'Not selected initially. Review before excluding.',owner:'' }))
  const practices: Practice[] = controlObjectives.map(c => ({id:c.id,title:c.name,objective:c.objective,actions:c.implementationExamples.join('\n'),evidence:c.evidenceExamples.join('\n'),owner:'',escalation:'',reviewDate:'',status:'Proposed',included:c.riskIds.some(id=>selected.has(id)),rationale:c.purpose,riskIds:c.riskIds.filter(id=>selected.has(id)),sourceIds:[...new Set(c.sourceRefs.map(r=>r.instrumentId))],origin:'Atlas starting point'}))
  const candidateIds = ['nist-ai-rmf', ...(profile.region.toLowerCase()==='australia'?['au-ai-adoption-guidance',...(/financial|bank|insur|superannuation/i.test(profile.sector)?['apra-cps-220','apra-cps-230','apra-cps-234']:[])]:[])]
  const localSources = candidateIds.filter(id=>instruments.some(s=>s.id===id))
  return {schema:1,profile,risks,practices,sourceIds:[...new Set([...localSources,...practices.filter(p=>p.included).flatMap(p=>p.sourceIds)])],overview:`This draft sets out how ${profile.name || 'the organisation'} proposes to govern AI use, assess risks and operate safeguards. Scope: ${profile.description || 'to be confirmed'}.`,assumptions:'Initial selections are based on the use cases chosen. Legal applicability, materiality and the adequacy of proposed controls need human review.',decisions:'Confirm scope and risk appetite.\nAssign accountable owners and escalation rights.\nReview excluded risks and proposed safeguards.\nAgree the evidence and review schedule.',revision:1,updated:new Date().toISOString(),changes:[]}
}
export function revise(w: Workspace, patch: Partial<Workspace>): Workspace { return {...w,...patch,schema:1,revision:w.revision+1,updated:new Date().toISOString()} }
export function unresolved(w: Workspace) {
  return [!w.profile.appetite && 'Set risk appetite and decision boundaries',!w.profile.sponsor && 'Name the accountable sponsor', ...w.risks.filter(r=>r.included&&!r.owner.trim()).map(r=>`Assign a risk owner: ${r.title}`), ...w.practices.filter(p=>p.included).flatMap(p=>[!p.owner.trim()&&`Assign a practice owner: ${p.title}`,!p.reviewDate&&`Set a review date: ${p.title}`,!p.escalation.trim()&&`Define escalation: ${p.title}`]), ...w.risks.filter(r=>!r.included && (!r.rationale.trim()||r.rationale.startsWith('Not selected initially'))).map(r=>`Review exclusion: ${r.title}`)].filter((x):x is string=>!!x)
}
export function affectedDevelopments(w: Workspace) {
  const active=w.practices.filter(p=>p.included)
  return developments.filter(d=>inDateWindow(d.published,120)).flatMap(d=> {
    const affected=active.filter(p=>p.sourceIds.includes(d.sourceId) || controlObjectives.find(c=>c.id===p.id)?.conceptIds.some(id=>d.topics.includes(concepts.find(c=>c.id===id)?.domainId??'')))
    return affected.length ? [{development:d,practices:affected,decision:w.changes.find(c=>c.id===d.id)}] : []
  }).sort((a,b)=>b.development.published.localeCompare(a.development.published))
}
const lines = (text: string) => text.split('\n').filter(Boolean).map(t=>`- ${t}`).join('\n')
export function exportFramework(w: Workspace): string {
  const refs=instruments.filter(s=>w.sourceIds.includes(s.id))
  return [`# ${w.profile.name || 'Organisation'} — AI risk management framework`, `Draft revision ${w.revision} · ${w.updated.slice(0,10)}`, w.approval?`Recorded approval: revision ${w.approval.revision}, ${w.approval.by}, ${w.approval.at}. ${w.approval.revision===w.revision?'This revision.':'Subsequent edits are unapproved.'}`:'Approval not recorded.', 'Planning document. Status is reported by the organisation; it is not an assurance conclusion.', '## Purpose and scope',w.overview,`Sector: ${w.profile.sector}\nJurisdiction: ${w.profile.region}\nAI uses: ${w.profile.uses.join(', ')||'To confirm'}\nScope: ${w.profile.description}\nSponsor: ${w.profile.sponsor||'Unassigned'}`, '## Risk appetite and decision boundaries',w.profile.appetite||'To be agreed', '## Assumptions',w.assumptions,'## Decisions and implementation priorities',w.decisions,'## Risk register',...w.risks.map(r=>`### ${r.title} — ${r.included?'Included':'Excluded / pending review'}\n${r.scenario}\nOwner: ${r.owner||'Unassigned'}\nRationale: ${r.rationale}`),'## Practices and controls',...w.practices.map(p=>`### ${p.title} — ${p.included?p.status:'Excluded'}\n${p.objective}\nOrigin: ${p.origin}\nRationale: ${p.rationale}\nOwner: ${p.owner||'Unassigned'}\nEscalation: ${p.escalation||'To agree'}\nReview: ${p.reviewDate||'Not scheduled'}\n#### Actions\n${lines(p.actions)}\n#### Evidence to examine\n${lines(p.evidence)}\nRisks: ${p.riskIds.map(id=>w.risks.find(r=>r.id===id)?.title||id).join('; ')}\nReferences: ${p.sourceIds.map(id=>instruments.find(s=>s.id===id)).filter(Boolean).map(s=>`${s!.shortTitle} (${s!.officialUrl})`).join('; ')}`),'## Open work',lines(unresolved(w).join('\n'))||'No missing ownership or review fields detected. Substantive human review is still needed.','## Reference selection',...refs.map(s=>`- ${s.shortTitle} — ${s.authorityNote} — ${s.officialUrl}`),'## Development decisions',...w.changes.map(c=>`- ${developments.find(d=>d.id===c.id)?.title||c.id}: ${c.decision} (${c.at}) — ${c.note}`)].join('\n\n')
}
export function exportRegister(w: Workspace): string {
  const cell=(value:string)=>'"'+(/^[=+@\-\t\r]/.test(value)?"'"+value:value).replaceAll('"','""')+'"'
  return [['Practice','Included','Status','Objective','Owner','Escalation','Review date','Actions','Evidence','Rationale','Source URLs'],...w.practices.map(p=>[p.title,String(p.included),p.status,p.objective,p.owner,p.escalation,p.reviewDate,p.actions,p.evidence,p.rationale,p.sourceIds.map(id=>instruments.find(s=>s.id===id)?.officialUrl||'').join('; ')])].map(row=>row.map(cell).join(',')).join('\r\n')
}
export function readWorkspace(raw: string): Workspace {
  if(raw.length>800000)throw new Error('Backup is too large.')
  const w=JSON.parse(raw)
  const str=(s:unknown,max=12000)=>typeof s==='string'&&s.length<=max
  const ids=(a:unknown,max=100)=>Array.isArray(a)&&a.length<=max&&a.every(x=>str(x,160))
  const profile=w?.profile
  if(w.schema!==1||!profile||!['name','sector','region','description','policies','appetite','sponsor'].every(k=>str(profile[k]))||!ids(profile.uses,6))throw new Error('Invalid organisation profile.')
  if(!Array.isArray(w.risks)||w.risks.length>80||!w.risks.every((r:any)=>['id','title','scenario','rationale','owner'].every(k=>str(r[k]))&&typeof r.included==='boolean'))throw new Error('Invalid risk register.')
  if(!Array.isArray(w.practices)||w.practices.length>80||!w.practices.every((p:any)=>['id','title','objective','actions','evidence','owner','escalation','reviewDate','rationale'].every(k=>str(p[k]))&&typeof p.included==='boolean'&&['Proposed','Approved design','Reported operating'].includes(p.status)&&['Atlas starting point','AI draft','Organisation'].includes(p.origin)&&ids(p.riskIds)&&p.riskIds.every((id:string)=>w.risks.some((r:any)=>r.id===id))&&ids(p.sourceIds)&&p.sourceIds.every((id:string)=>instruments.some(s=>s.id===id))))throw new Error('Invalid practice register.')
  if(!ids(w.sourceIds)||!w.sourceIds.every((id:string)=>instruments.some(s=>s.id===id))||!['overview','assumptions','decisions','updated'].every(k=>str(w[k]))||!Number.isInteger(w.revision)||w.revision<1)throw new Error('Invalid framework fields.')
  if(new Set(w.risks.map((r:any)=>r.id)).size!==w.risks.length||new Set(w.practices.map((p:any)=>p.id)).size!==w.practices.length)throw new Error('Duplicate register identifiers.')
  if(!Array.isArray(w.changes)||w.changes.length>100||!w.changes.every((c:any)=>['id','decision','note','at'].every(k=>str(c[k]))))throw new Error('Invalid change decisions.')
  if(w.approval && (!str(w.approval.by)||!str(w.approval.at)||!str(w.approval.content,400000)||!Number.isInteger(w.approval.revision)))throw new Error('Invalid approval record.')
  return w as Workspace
}
