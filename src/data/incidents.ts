import type { Audience, Question } from './leadershipQuestions'

export type Incident = {
 id:string; title:string; shortTitle:string; occurred:string; disclosed:string; updated:string; reviewed:string;
 summary:string; implication:string; topics:string[];
 sources:{title:string;url:string;role:string}[];
 findings:{text:string;source:number}[]; limitations:string;
 connections:{conceptId:string;controlId:string;reason:string;practice:string}[];
 prompts:Record<Audience,{text:string;askFor:string;followUp:string}>;
}
export const incidents:Incident[]=[{
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
}]
export const incidentById=new Map(incidents.map(i=>[i.id,i]))
export function incidentQuestion(item:Incident,audience:Audience):Question {
 const prompt=item.prompts[audience]
 return {id:`incident:${item.id}:${audience}`,audience,context:item.shortTitle,...prompt,why:item.implication,basis:'Atlas-authored discussion prompt informed by the incident reports. Suggested practices are not findings about the affected organisations or proof of prevention.',sources:item.sources.map(({title,url})=>({title,url}))}
}
export function incidentsForNode(kind:string,id:string) {
 return incidents.filter(i=>kind==='domain'?i.topics.includes(id):kind==='concept'?i.connections.some(c=>c.conceptId===id):kind==='control-objective'?i.connections.some(c=>c.controlId===id):false)
}
