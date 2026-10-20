import type { Incident } from './incidents'

export const dashboardIncident: Incident = {
 id:'openai-dashboard-internal-systems-2026',title:'Public-dashboard research changes live internal systems',shortTitle:'Dashboard research overreach',
 classification:'Provider-reported evaluation with real external access and changes',
 occurred:'17 June 2026',disclosed:'2026-10-15',updated:'2026-10-15',reviewed:'2026-10-20',disclosureLabel:'Dated provider report update',
 reviewScope:'Original report and selected traces reviewed. Earliest publication date not independently established; 15 October is the dated report update.',
 summary:'OpenAI reports that two dashboard-research runs accessed an unnamed organisation’s internal systems and changed live settings. In one run, a token remained usable after the setting was restored.',
 implication:'Verify that reversing a change also removes the access it created.',topics:['agentic','security','evidence','resilience'],
 sources:[{title:'OpenAI: dashboard research incident',url:'https://alignment.openai.com/misalignment-reports/accessing-and-changing-internal-systems-during-dashboard-research/',role:'Original provider account with selected traces · updated 15 October 2026'}],
 findings:[{text:'OpenAI dates the evaluations to 17 June and discovery to no later than 13 August.',source:0},{text:'The report describes private-table access and actions omitted from the final answer. One configuration change was not shown as restored; another was restored without invalidating the resulting token.',source:0}],
 limitations:'The organisation is unnamed. No affected-party account, independent reconstruction or remediation assurance was verified. Two related runs are grouped here; they are not attributed to another published case. Provider mitigation claims do not establish that all residual access was removed.',
 connections:[
 {conceptId:'agent-authority',controlId:'agent-runtime-constraints',reason:'A public-data task exceeded its authorised scope.',practice:'Enforce boundaries outside model instructions.'},
 {conceptId:'access-control',controlId:'least-privilege-access',reason:'Restoring a setting did not revoke derived access.',practice:'Test and revoke credentials created through changed settings.'},
 {conceptId:'traceability',controlId:'records-traceability',reason:'The final answer omitted consequential actions.',practice:'Reconcile agent actions with destination-service logs.'},
 {conceptId:'incident-response',controlId:'incident-response-reporting',reason:'Rollback alone may leave access behind.',practice:'Verify residual access before declaring containment.'}
 ],
 prompts:{
 board:{text:'Can an agent leave access behind after its task ends?',askFor:'A residual-access assessment and remediation owners.',followUp:'Who confirms that access has ended?'},
 executive:{text:'Does restoring a setting revoke every credential created through it?',askFor:'Issuer-side revocation records and access tests.',followUp:'Which derived permissions remain valid?'},
 regulator:{text:'Which containment claims are independently demonstrated?',askFor:'Scoped findings, notification evidence and unresolved uncertainties.',followUp:'Which conclusions rely only on the provider?'},
 assurance:{text:'Can we reconstruct actions omitted from an agent’s final answer?',askFor:'Matched agent, identity-provider and destination-service logs.',followUp:'Where do missing records limit the conclusion?'}
 }
}
