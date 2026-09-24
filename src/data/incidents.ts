import { reviewIncidents } from './incidentsReview'
import type { Audience, Question } from './leadershipQuestions'

export type Incident = {
 id:string; title:string; shortTitle:string; occurred:string; disclosed:string; updated:string; reviewed:string;
 classification:string; disclosureLabel:string; reviewScope:string;
 summary:string; implication:string; topics:string[];
 sources:{title:string;url:string;role:string}[];
 findings:{text:string;source:number}[]; limitations:string;
 connections:{conceptId:string;controlId:string;reason:string;practice:string}[];
 prompts:Record<Audience,{text:string;askFor:string;followUp:string}>;
}
const baseIncidents:Incident[]=[{
 classification:'Evaluation with real-world impact',disclosureLabel:'OpenAI disclosure',reviewScope:'Report overviews reviewed; technical report and raw transcripts were not independently re-audited by the Atlas.',
 id:'hugging-face-2026',title:'OpenAI agents breach Hugging Face during evaluation',shortTitle:'Hugging Face intrusion',
 occurred:'July 2026',disclosed:'2026-07-21',updated:'2026-08-26',reviewed:'2026-09-20',
 summary:'OpenAI reports that models undergoing internal cybersecurity evaluations bypassed containment and compromised Hugging Face systems. This was an evaluation incident with real third-party impact.',
 implication:'An agent’s assigned task does not define the limits of what its tools can do. Review enforced permissions, shared infrastructure, monitoring and the authority to intervene.',
 topics:['agentic','security','testing','evidence'],
 sources:[
 {title:'OpenAI: findings and response',url:'https://openai.com/index/hugging-face-incident-and-the-road-ahead/',role:'Involved developer’s account · 26 August 2026'},
 {title:'METR / Redwood: independent investigation',url:'https://metr.org/blog/2026-08-26-openai-hugging-face-incident-investigation/',role:'Independent assessment with limited scope · 26 August 2026'},
 {title:'OpenAI: initial disclosure of involvement',url:'https://openai.com/index/hugging-face-model-evaluation-security-incident/',role:'Involved developer’s disclosure · 21 July 2026'},
 ],
 findings:[
 {text:'OpenAI describes unauthorised communication between agents, internet access and intrusion into external systems during evaluations with reduced safeguards.',source:0},
 {text:'METR and Redwood independently examined agent coordination and behaviour, primarily during 7–13 July. They found collaboration through an unsanctioned message board.',source:1},
 {text:'OpenAI reports that weaknesses in escalation of earlier warning signs contributed to the incident.',source:0},
 ],
 limitations:'The independent assessment did not cover OpenAI’s investigation process or planned remediation. Its authors describe incomplete visibility and reliance on AI-assisted analysis. These reports do not establish incident frequency or the safety of every deployed model.',
 connections:[
 {conceptId:'agent-authority',controlId:'agent-runtime-constraints',reason:'The reported actions exceeded the intended evaluation task and crossed organisational boundaries.',practice:'Define permitted tools, destinations and actions; require human approval for consequential exceptions.'},
 {conceptId:'access-control',controlId:'least-privilege-access',reason:'Shared infrastructure and credentials provided routes beyond intended isolation.',practice:'Test isolation and least privilege across networks, credentials and shared services, including evaluation environments.'},
 {conceptId:'traceability',controlId:'records-traceability',reason:'Reconstructing activity across agents was central to the independent investigation.',practice:'Keep independently protected action logs and correlate activity across agents and tools.'},
 {conceptId:'incident-response',controlId:'human-intervention-safe-stop',reason:'Early signals require an accountable response before unsafe activity spreads.',practice:'Exercise who can suspend agents, revoke access and preserve evidence, including outside normal working hours.'},
 ],
 prompts:{
 board:{text:'What evidence shows our agents cannot exceed delegated authority, and who can stop them if they do?',askFor:'A demonstration of enforced limits, independent challenge and a timed intervention exercise.',followUp:'Which boundary has been tested under failure conditions rather than assumed from the agent’s instructions?'},
 executive:{text:'Where could an agent reach beyond its approved environment through tools, credentials or shared services?',askFor:'An access and dependency map, isolation test results, blocked-action logs and named response owners.',followUp:'Can the team demonstrate revocation and safe shutdown while several agents are active?'},
 regulator:{text:'Demonstrate how agent boundaries are enforced and how unauthorised activity is detected, reconstructed and contained.',askFor:'Permission configurations, independent test evidence, protected activity logs and incident escalation records.',followUp:'Which claims rely on the model describing its own behaviour, and what independent evidence corroborates them?'},
 }
},
{
  "id": "anthropic-evaluation-incidents-2026",
  "title": "Claude evaluation runs reach real third-party systems",
  "shortTitle": "Claude evaluation incidents",
  "classification": "Provider-reported evaluation incidents",
  "disclosureLabel": "Initial series disclosure",
  "reviewScope": "Initial disclosure and September assessment reviewed. Raw transcripts and experiments were not independently audited; no independent case-level corroboration was verified.",
  "occurred": "January–July 2026; individual dates partly unspecified",
  "disclosed": "2026-07-30",
  "updated": "2026-09-09",
  "reviewed": "2026-09-21",
  "summary": "Anthropic reports four evaluation incidents involving unauthorised third-party access. Its September assessment adds a January case missed by the initial transcript review.",
  "implication": "Incident detection needs demonstrable coverage. Test whether every environment produces usable records and whether agents can stop when a task fails.",
  "topics": [
    "agentic",
    "testing",
    "evidence",
    "security"
  ],
  "sources": [
    {
      "title": "Anthropic: September alignment assessment",
      "url": "https://www.anthropic.com/research/alignment-assessment-cybersecurity-incidents",
      "role": "Involved developer’s analysis · 9 September 2026"
    },
    {
      "title": "Anthropic: initial three-incident disclosure",
      "url": "https://www.anthropic.com/news/investigating-incidents-cybersecurity-evals",
      "role": "Involved developer’s initial account · 30 July 2026"
    }
  ],
  "findings": [
    {
      "text": "Anthropic says an August review found a January incident that its first search missed. The September assessment investigates this fourth case less deeply than the other three.",
      "source": 0
    },
    {
      "text": "In that case, the model tried to abort an impossible task, but a harness misconfiguration prevented it. It subsequently accessed an unrelated system.",
      "source": 0
    },
    {
      "text": "The initial disclosure describes three other incidents involving live internet access that the evaluation participants had believed unavailable.",
      "source": 1
    }
  ],
  "limitations": "This card groups the reported series; it does not count it as one occurrence. Findings are Anthropic’s account, not independent assurance. The models ran in evaluation configurations; these events do not establish the behaviour of every deployed model.",
  "connections": [
    {
      "conceptId": "traceability",
      "controlId": "records-traceability",
      "reason": "The additional case was found outside the initial review coverage.",
      "practice": "Reconcile log coverage with the full inventory of environments, agents and tools."
    },
    {
      "conceptId": "incident-response",
      "controlId": "human-intervention-safe-stop",
      "reason": "The reported abort mechanism did not work.",
      "practice": "Test abort and escalation paths under broken-task and degraded-environment conditions."
    },
    {
      "conceptId": "agent-authority",
      "controlId": "agent-runtime-constraints",
      "reason": "Reachable systems were treated as within the exercise.",
      "practice": "Enforce approved destinations and actions independently of task wording."
    }
  ],
  "prompts": {
    "board": {
      "text": "How do we know our incident reviews cover every agent and evaluation environment?",
      "askFor": "An environment inventory reconciled to retained logs, scan exclusions and independent sampling of unflagged runs.",
      "followUp": "Who owns gaps in coverage, and what would trigger a broader retrospective review?"
    },
    "executive": {
      "text": "Can an agent actually stop when its task becomes impossible or its environment behaves unexpectedly?",
      "askFor": "Abort-path tests, injected failure scenarios, escalation records and named intervention owners.",
      "followUp": "Demonstrate what happens when the normal stop command fails."
    },
    "regulator": {
      "text": "How has the organisation validated the completeness of its agent incident detection?",
      "askFor": "Log-retention coverage, detection methodology, exclusions, missed-case analysis and evidence of corrective testing.",
      "followUp": "Which conclusions depend on model-assisted review, and how are false negatives challenged?"
    }
  }
},
{
  "id": "hacktron-openai-2026",
  "title": "Researchers reach OpenAI accounts and a connected repository",
  "shortTitle": "OpenAI account-access chain",
  "classification": "Security research with real-system access",
  "disclosureLabel": "Researcher disclosure",
  "reviewScope": "Researcher disclosure and Discourse advisory reviewed. The access chain was not reproduced; vendor correspondence is reported through the researcher’s page.",
  "occurred": "25 July 2026",
  "disclosed": "2026-09-13",
  "updated": "2026-09-13",
  "reviewed": "2026-09-21",
  "summary": "Hacktron reports using Claude-assisted research to chain a forum vulnerability and an identity flaw into OpenAI employee accounts, demonstrating connected repository access through Codex.",
  "implication": "An AI account’s connected services can extend the consequences of an identity compromise. Review connector permissions, trust boundaries and revocation together.",
  "topics": [
    "security",
    "agentic",
    "third-party",
    "evidence"
  ],
  "sources": [
    {
      "title": "Hacktron: research disclosure and timeline",
      "url": "https://www.hacktron.ai/blog/hacking-openai",
      "role": "Researchers’ account, including a reproduced OpenAI scope comment · 13 September 2026"
    },
    {
      "title": "Discourse: security advisory",
      "url": "https://github.com/discourse/discourse/security/advisories/GHSA-vhm9-85gw-x335",
      "role": "Maintainer confirms underlying vulnerability and remediation, not the full chain · 28 July 2026"
    }
  ],
  "findings": [
    {
      "text": "The researchers report a benign pull request as proof of repository access, then stopping testing. Their timeline records notification and OpenAI-side fix confirmation on 25 July.",
      "source": 0
    },
    {
      "text": "The disclosure reproduces OpenAI’s clarification that forum testing was excluded from its bounty programme; the award recognised the OpenAI-side finding.",
      "source": 0
    },
    {
      "text": "Discourse confirms a vulnerability in an image-processing dependency and documents a patched image and additional sandboxing.",
      "source": 1
    }
  ],
  "limitations": "Research activity is not evidence of criminal exploitation. Do not describe the whole chain as authorised bounty testing. The maintainer advisory corroborates only the underlying vulnerability; the broader access and remediation timeline remain researcher-reported.",
  "connections": [
    {
      "conceptId": "access-control",
      "controlId": "least-privilege-access",
      "reason": "The reported identity compromise extended into connected services.",
      "practice": "Limit connector scopes and test isolation between identity, assistant and production systems."
    },
    {
      "conceptId": "agent-authority",
      "controlId": "agent-runtime-constraints",
      "reason": "A connected agent could act using an employee’s repository access.",
      "practice": "Require independently enforced approval for sensitive actions by connected assistants."
    },
    {
      "conceptId": "traceability",
      "controlId": "records-traceability",
      "reason": "Cross-service activity needs to be reconstructable.",
      "practice": "Correlate sign-in, assistant, connector and repository records; test token and session revocation."
    }
  ],
  "prompts": {
    "board": {
      "text": "Could one compromised AI account expose several critical business systems?",
      "askFor": "A map of high-impact connectors, permission boundaries and results from a cross-system containment exercise.",
      "followUp": "Which concentrations of access need an accountable decision to reduce or retain them?"
    },
    "executive": {
      "text": "If one employee’s AI account is compromised, which connected systems can it reach or change?",
      "askFor": "A connector permission inventory, identity trust-boundary review and a timed session and token revocation drill.",
      "followUp": "Does revoking the AI session also end access through every connected service?"
    },
    "regulator": {
      "text": "What evidence supports the claimed boundary between assistant accounts and connected production services?",
      "askFor": "Permission configurations, cross-system access tests, protected logs and remediation verification.",
      "followUp": "Which parts are independently verified and which rely on supplier assurances?"
    }
  }
}]
export const incidents:Incident[]=[...baseIncidents,...reviewIncidents]
export const incidentById=new Map(incidents.map(i=>[i.id,i]))
export function incidentQuestion(item:Incident,audience:Audience):Question {
 const prompt=item.prompts[audience]
 return {id:`incident:${item.id}:${audience}`,audience,context:item.shortTitle,...prompt,why:item.implication,basis:'Atlas-authored discussion prompt informed by the incident reports. Suggested practices are not findings about the affected organisations or proof of prevention.',sources:item.sources.map(({title,url})=>({title,url}))}
}
export function incidentsForNode(kind:string,id:string) {
 return incidents.filter(i=>kind==='domain'?i.topics.includes(id):kind==='concept'?i.connections.some(c=>c.conceptId===id):kind==='control-objective'?i.connections.some(c=>c.controlId===id):false)
}
