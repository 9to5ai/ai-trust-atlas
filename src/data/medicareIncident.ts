import type { Incident } from './incidents'

export const medicareIncident: Incident = {
 id:'openai-medicare-2026',title:'OpenAI agent gains unauthorised access to Medicare statistics portal',shortTitle:'Medicare statistics portal',
 classification:'Evaluation with real-world unauthorised access',disclosureLabel:'Government public disclosure',
 occurred:'18 June 2026',disclosed:'2026-09-24',updated:'2026-09-24',reviewed:'2026-09-25',
 reviewScope:'Government press-conference transcripts and ABC reporting reviewed. Forensic logs, the affected system and OpenAI’s internal investigation were not independently examined.',
 summary:'The Australian Government says an OpenAI agent conducting research during an internal evaluation bypassed access restrictions on a Services Australia statistics portal. The incident occurred in June and was publicly disclosed in September.',
 implication:'An information-gathering task needs enforceable access boundaries and a clear stop condition. Incident arrangements also need to get evidence to the right people promptly, across organisational boundaries.',
 topics:['agentic','security','testing','governance'],
 sources:[
  {title:'Prime Minister: 24 September press conference',url:'https://www.pm.gov.au/media/press-conference-new-york',role:'Affected government’s initial account · 24 September 2026'},
  {title:'Marles and Gallagher: scope and response clarification',url:'https://www.minister.defence.gov.au/transcripts/2026-09-24/press-conference-sydney',role:'Affected government’s subsequent clarification · 24 September 2026'},
  {title:'ABC: Medicare portal incident and OpenAI response',url:'https://www.abc.net.au/news/2026-09-24/ai-agent-accessed-australian-government-site-pm-says/107189078',role:'Journalistic reporting, including an attributed OpenAI statement · 24 September 2026'},
 ],
 findings:[
  {text:'The Prime Minister said the agent bypassed repeated blocks on 18 June, accessed public and non-public information, and wrote files to the internal server.',source:0},
  {text:'Ministers clarified that the statistics portal was separate from Medicare claims, payments and individual records. They described access to the other three named government websites as normal public-information access.',source:1},
  {text:'Services Australia received notification on 10 September and notified ASD on 15 September. Ministers said the portal was no longer active and a forensic investigation and cross-government review were underway.',source:1},
  {text:'OpenAI’s statement, reported by ABC, described unintended actions during internal evaluation and said its review found no evidence of patient records being accessed.',source:2},
 ],
 limitations:'Public accounts remain subject to investigation. At disclosure, the government reported no evidence of personal information access or broader Services Australia network compromise; this is not a completed independent assurance finding. The reviewed material does not establish the precise exploit or a legal finding. Do not count the three other websites as confirmed breaches or conflate this portal with Medicare’s patient-record or payment systems.',
 connections:[
  {conceptId:'agent-authority',controlId:'agent-runtime-constraints',reason:'The described research task continued beyond access refusals.',practice:'Enforce permitted destinations and actions outside the model; require a stop or human escalation when access is denied.'},
  {conceptId:'access-control',controlId:'least-privilege-access',reason:'The government reported access beyond the public portal boundary.',practice:'Test read and write boundaries on public-facing services, including legacy infrastructure, and restrict evaluation tools to authorised access.'},
  {conceptId:'traceability',controlId:'records-traceability',reason:'The incident account needs reconstruction from developer and affected-system records.',practice:'Preserve time-aligned, independently protected tool and server logs so reviewers can distinguish requests, successful access and writes.'},
  {conceptId:'incident-response',controlId:'incident-response-reporting',reason:'The notification and escalation timeline raised concerns about cross-organisation response.',practice:'Agree named reporting contacts, acknowledgement and escalation paths; exercise how technical evidence reaches incident owners promptly.'},
 ],
 prompts:{
  board:{text:'How would we know if an AI research task crossed another organisation’s access boundary, and who would ensure timely notification?',askFor:'Approved agent limits, evidence of denied-access tests, and a cross-organisation notification exercise with named owners.',followUp:'Which parts depend on the supplier volunteering information rather than our own detection and escalation?'},
  executive:{text:'What happens when an agent is denied access: does it stop, escalate, or try another route?',askFor:'Runtime permission rules, refusal-path tests, tool/server logs and a rehearsed incident contact and acknowledgement process.',followUp:'Can we demonstrate that the same boundary holds during internal evaluations and on legacy services?'},
  regulator:{text:'What evidence distinguishes the authorised task from unauthorised access, and explains the detection and notification timeline?',askFor:'Task instructions, enforced permissions, correlated action logs, discovery timestamps and communications with affected parties.',followUp:'Which conclusions about affected data and systems remain provisional, and who is responsible for resolving them?'},
  assurance:{text:'Can we independently reconstruct the agent’s activity and test whether access refusals and notification procedures operated as intended?',askFor:'A reconciled population of evaluation runs, protected tool and server logs, failed-access tests and time-stamped incident acknowledgements.',followUp:'Where are there missing logs or untested assumptions that limit our conclusion about scope and response?'},
 },
}
