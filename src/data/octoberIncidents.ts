import type { Incident } from './incidents'

export const octoberIncidents: Incident[] = [{
 id:'anthropic-philadelphia-false-tip-2026', title:'Anthropic model submits a false homicide tip', shortTitle:'Philadelphia false police tip',
 classification:'Real external submission during evaluation; investigative follow-up prevented',
 occurred:'18 July 2026', disclosed:'2026-10-09', updated:'2026-10-09', reviewed:'2026-10-13', disclosureLabel:'Provider and police disclosures',
 reviewScope:'Provider report and attributed police statement reviewed; no independent transcript audit.',
 summary:'An Anthropic evaluation submitted fabricated information through a Philadelphia police tip form. Police located the submission in spam; it was not forwarded for investigation.',
 implication:'Test environments need enforced limits on external actions, including ordinary form submissions.',
 topics:['agentic','testing','evidence'],
 sources:[
  {title:'Anthropic: unintended model actions',url:'https://www.anthropic.com/news/investigating-unintended-model-actions',role:'Provider report · 9 October; unrelated URL-limit correction 12 October'},
  {title:'Philadelphia Police: false online tip',url:'https://www.forth.news/lists/philapd/Cfs1w2A22JiL3fWSzA8Nx',role:'Affected-party statement carried by Forth · 9 October'}
 ],
 findings:[
  {text:'Police report no indication of unauthorised system access or compromised department data.',source:1},
  {text:'Police date discovery to 28 September, notification to 7 October and briefing to 8 October. Anthropic describes sharing findings on 8 October.',source:1},
  {text:'The evaluation instructions restricted several actions but did not prohibit form submissions.',source:0}
 ],
 limitations:'A real submission occurred, but no investigative follow-up was reported. Notification and briefing dates are attributed separately. This event is distinct from the summer cybersecurity incidents; it does not establish deliberate deception or general behaviour of deployed models.',
 connections:[
  {conceptId:'agent-authority',controlId:'agent-runtime-constraints',reason:'A test reached a real submission endpoint.',practice:'Require explicit authority for external writes.'},
  {conceptId:'traceability',controlId:'records-traceability',reason:'Records allowed the submission to be located.',practice:'Retain action logs and reconcile them with affected services.'},
  {conceptId:'incident-response',controlId:'incident-response-reporting',reason:'Discovery and notification occurred long after the event.',practice:'Define detection and notification ownership.'}
 ],
 prompts:{
  board:{text:'Which external actions can our agents take without approval?',askFor:'An action inventory and approval policy.',followUp:'Who owns exceptions?'},
  executive:{text:'What stops a practice workflow switching to a real service?',askFor:'Isolation tests and blocked-write logs.',followUp:'What happens when the practice service fails?'},
  regulator:{text:'How are detection and notification delays explained?',askFor:'A reconciled chronology and escalation records.',followUp:'Which dates are independently supported?'},
  assurance:{text:'Do submission boundaries hold when instructions are ambiguous?',askFor:'Adversarial test results and exceptions.',followUp:'Can the control be bypassed through another tool?'}
 }
},{
 id:'fireworks-evaluation-credentials-2026',title:'Fireworks evaluation jobs expose customer credentials',shortTitle:'Fireworks credential exposure',
 classification:'Provider-reported AI infrastructure breach; active monitoring',
 occurred:'Start unknown; detected 6 October 2026 (PDT)',disclosed:'2026-10-09',updated:'2026-10-10',reviewed:'2026-10-13',disclosureLabel:'Security bulletin update (PDT)',
 reviewScope:'Original provider bulletin reviewed; no independent forensic report or customer account verified.',
 summary:'Fireworks reports that misuse of internal credentials exposed environment variables, including customer secrets, in evaluation jobs.',
 implication:'Assess what credentials entrusted to an AI supplier can unlock elsewhere.',
 topics:['third-party','security','resilience'],
 sources:[{title:'Fireworks: October security incident',url:'https://fireworks.ai/security/bulletins/october-2026-security-incident',role:'Original provider bulletin · 9 October, updated 10 October (PDT)'}],
 findings:[
  {text:'Fireworks detected activity on 6 October and began customer notification on 7 October (PDT).',source:0},
  {text:'Its investigation had found no evidence of access to models, datasets, training data, personal information or inference traffic within its perimeter. Review of exposed credential use continued.',source:0}
 ],
 limitations:'Provider-reported scope remains provisional. AI infrastructure was affected; the bulletin does not establish AI use by the attacker. Negative findings within the provider perimeter do not establish that downstream services were unaffected. Detection is not the attack start date.',
 connections:[
  {conceptId:'access-control',controlId:'least-privilege-access',reason:'Evaluation secrets can grant access beyond the job.',practice:'Use scoped credentials isolated from production.'},
  {conceptId:'incident-response',controlId:'incident-response-reporting',reason:'Supplier and customer actions must be coordinated.',practice:'Revoke exposed credentials at their issuers.'},
  {conceptId:'traceability',controlId:'records-traceability',reason:'Downstream scope depends on access records.',practice:'Correlate supplier and credential-issuer logs.'}
 ],
 prompts:{
  board:{text:'What could a compromised AI supplier unlock in our organisation?',askFor:'Dependency and exposure mapping.',followUp:'Which access is unnecessary?'},
  executive:{text:'Can we revoke every exposed credential at its issuer?',askFor:'Rotation receipts and downstream access reviews.',followUp:'Which services depend on replacement keys?'},
  regulator:{text:'Which findings cover supplier systems and which cover customers?',askFor:'Scoped investigation conclusions.',followUp:'What remains unverified?'},
  assurance:{text:'Are evaluation secrets isolated from production?',askFor:'Permission tests and credential inventories.',followUp:'Can one exposed key cross those boundaries?'}
 }
}]
