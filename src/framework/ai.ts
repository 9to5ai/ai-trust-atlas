import type { Workspace } from './model.js'
export type DraftSuggestion = { overview: string; assumptions: string[]; openQuestions: string[]; practices: {controlId:string;objective:string;actions:string[];evidence:string[];sourceIds:string[]}[]; policyQuestions:{excerpt:string;question:string}[] }
export function validateSuggestion(raw: unknown, w: Workspace): DraftSuggestion {
  const x=raw as DraftSuggestion
  const text=(s:unknown)=>typeof s==='string'&&s.trim().length>0&&s.length<=5000
  const texts=(s:unknown)=>Array.isArray(s)&&s.length<=24&&s.every(text)
  const active=w.practices.filter(p=>p.included)
  if(!x||!text(x.overview)||!texts(x.assumptions)||!texts(x.openQuestions)||!Array.isArray(x.practices)||!x.practices.length||x.practices.length>24)throw new Error('The draft was incomplete. Your framework has not changed.')
  if(new Set(x.practices.map(p=>p.controlId)).size!==x.practices.length)throw new Error('The draft repeated a practice.')
  for(const p of x.practices)if(!active.some(a=>a.id===p.controlId)||!text(p.objective)||!texts(p.actions)||!p.actions.length||!texts(p.evidence)||!p.evidence.length||!Array.isArray(p.sourceIds)||!p.sourceIds.length||p.sourceIds.some(id=>!w.sourceIds.includes(id)))throw new Error('The draft included an unsupported practice or reference.')
  if(!Array.isArray(x.policyQuestions)||x.policyQuestions.length>10||x.policyQuestions.some(p=>!text(p.excerpt)||!text(p.question)||!w.profile.policies.includes(p.excerpt)))throw new Error('A policy reference could not be matched to your supplied text.')
  return x
}
export function applySuggestion(w: Workspace, s: DraftSuggestion, ids: string[]): Partial<Workspace> {
  return {overview:s.overview,assumptions:s.assumptions.join('\n'),decisions:[...s.openQuestions,...s.policyQuestions.map(p=>`Policy question: ${p.question} (supplied text: “${p.excerpt}”)`)].join('\n'),practices:w.practices.map(p=>{
    const draft=s.practices.find(x=>x.controlId===p.id && ids.includes(p.id))
    return draft ? {...p,objective:draft.objective,actions:draft.actions.join('\n'),evidence:draft.evidence.join('\n'),sourceIds:draft.sourceIds,status:'Proposed' as const,origin:'AI draft' as const} : p
  })}
}
