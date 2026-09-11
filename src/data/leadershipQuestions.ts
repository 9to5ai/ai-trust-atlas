import { concepts } from './concepts'
import { instruments } from './instruments'
import type { Development } from './developments'
export const audiences = ['board', 'executive', 'regulator'] as const
export type Audience = typeof audiences[number]
export const audienceNames: Record<Audience, string> = { board: 'Board', executive: 'Executive', regulator: 'Regulator' }
export type Question = { id: string; audience: Audience; context: string; text: string; why: string; askFor: string; followUp: string; sources: { title: string; url: string }[]; developmentDate?: string; basis?: string }
type ConceptPrompt = { conceptId: string; questions: Record<Audience, string>; why: string; askFor: string; followUp: string }
// Atlas-authored discussion prompts. References provide context, not verbatim questions or findings of compliance.
export const conceptPrompts: ConceptPrompt[] = [
  {
    "conceptId": "accountability",
    "questions": {
      "board": "Who is personally accountable when an AI-supported decision causes harm?",
      "executive": "Who owns each AI outcome, and can they change or stop the system?",
      "regulator": "Show how accountability for AI outcomes works across business, risk and technology teams."
    },
    "why": "Shared delivery can leave nobody able to resolve a harmful outcome.",
    "askFor": "Named owners, decision mandates and a recent escalation record.",
    "followUp": "What did the accountable owner actually do in the last incident?"
  },
  {
    "conceptId": "decision-rights",
    "questions": {
      "board": "Which AI decisions need board oversight, and which must management make immediately?",
      "executive": "Who can approve, restrict or stop an AI system without waiting for a committee?",
      "regulator": "Walk through who approved a recent AI deployment or exception and under what authority."
    },
    "why": "Unclear authority delays action and makes exceptions hard to challenge.",
    "askFor": "Approval thresholds, delegated authorities and a completed decision record.",
    "followUp": "What happens when the decision-maker is unavailable?"
  },
  {
    "conceptId": "inventory",
    "questions": {
      "board": "Do we know where AI affects our customers and critical operations?",
      "executive": "How do we find AI embedded in purchased software and unapproved staff tools?",
      "regulator": "Demonstrate how you reconcile the AI inventory with procurement, production systems and actual use."
    },
    "why": "An incomplete inventory leaves some systems outside oversight.",
    "askFor": "The AI register, discovery records and a sample reconciliation.",
    "followUp": "Which uses were found outside the register, and what changed afterwards?"
  },
  {
    "conceptId": "competence",
    "questions": {
      "board": "Can this board challenge AI proposals independently of vendor presentations?",
      "executive": "Which teams need new skills to operate, challenge and investigate AI safely?",
      "regulator": "Show how you assess the competence of people approving and overseeing AI use."
    },
    "why": "Training attendance does not show that people can recognise and act on a problem.",
    "askFor": "Role-specific competency expectations and practical exercise results.",
    "followUp": "Where has someone challenged an AI proposal and changed the decision?"
  },
  {
    "conceptId": "materiality",
    "questions": {
      "board": "Which AI uses could cause consequences beyond our risk appetite?",
      "executive": "How do we decide which AI uses need stronger oversight and testing?",
      "regulator": "Explain how you determine the significance of an AI use and escalate borderline cases."
    },
    "why": "A low-volume system can still have serious consequences for an individual or critical operation.",
    "askFor": "Use-case assessments, escalation thresholds and borderline decisions.",
    "followUp": "What would make you reassess this use as more significant?"
  },
  {
    "conceptId": "impact-assessment",
    "questions": {
      "board": "Whose interests could be harmed by our AI strategy, and how do we know?",
      "executive": "Who investigates impacts on customers, staff and others before deployment?",
      "regulator": "Show how affected people and foreseeable harms informed an actual deployment decision."
    },
    "why": "Technical performance can obscure impacts on people outside the project team.",
    "askFor": "Impact assessments, stakeholder input and resulting design changes.",
    "followUp": "Which harm did you identify that led you to change or abandon a use?"
  },
  {
    "conceptId": "risk-treatment",
    "questions": {
      "board": "Which AI risks are we accepting, and who has challenged that choice?",
      "executive": "Which actions reduce each material AI risk, and who owns the remaining exposure?",
      "regulator": "Trace a material AI risk from identification through treatment, acceptance and monitoring."
    },
    "why": "A list of controls does not explain the residual exposure or who accepts it.",
    "askFor": "Risk decisions, control owners, testing records and unresolved actions.",
    "followUp": "What would trigger a different treatment or withdrawal of approval?"
  },
  {
    "conceptId": "systemic-risk",
    "questions": {
      "board": "Could common AI dependencies create losses across several parts of our organisation at once?",
      "executive": "Where do common models, data or providers create correlated failure scenarios?",
      "regulator": "How do you assess common AI dependencies and correlated failures across the entities or activities in scope?"
    },
    "why": "Separate business assessments may overlook a shared point of failure.",
    "askFor": "Dependency analysis, concentration scenarios and response exercises.",
    "followUp": "What happens when several supposedly independent safeguards rely on the same provider?"
  },
  {
    "conceptId": "lifecycle-governance",
    "questions": {
      "board": "Does AI oversight continue after the investment and launch decision?",
      "executive": "Which checks apply from intake through retirement, and who owns each transition?",
      "regulator": "Walk through one AI system from initial proposal to current operation and eventual retirement."
    },
    "why": "Oversight can weaken once a project becomes an operational service.",
    "askFor": "Lifecycle gates, ownership handovers and current monitoring records.",
    "followUp": "Which stage has no clear owner or evidence of review?"
  },
  {
    "conceptId": "change-management",
    "questions": {
      "board": "How are we told when a change makes an approved AI use materially different?",
      "executive": "What model, prompt, data or tool changes trigger retesting and approval?",
      "regulator": "Show how a recent AI change was identified, assessed, tested and authorised."
    },
    "why": "Behaviour can change even when the application interface looks the same.",
    "askFor": "Version history, change thresholds, test results and approval records.",
    "followUp": "How would you detect a provider change you did not initiate?"
  },
  {
    "conceptId": "documentation",
    "questions": {
      "board": "Could an independent reviewer understand our significant AI decisions from the records?",
      "executive": "Who keeps system purpose, limitations and operating instructions current?",
      "regulator": "Use the records to reconstruct a significant AI deployment decision and its assumptions."
    },
    "why": "Outdated records make challenge, recovery and handover unreliable.",
    "askFor": "Versioned system documentation, decision records and operating instructions.",
    "followUp": "Which important assumption is no longer true, and where is that recorded?"
  },
  {
    "conceptId": "data-governance",
    "questions": {
      "board": "What gives management confidence that the data is fit for the decisions it supports?",
      "executive": "Who owns data quality, access and corrections across the AI workflow?",
      "regulator": "Show how data ownership and quality controls work from collection to model use."
    },
    "why": "Reliable outputs depend on the information entering the system.",
    "askFor": "Data ownership, quality checks, access reviews and correction records.",
    "followUp": "What happened the last time a data defect affected an output?"
  },
  {
    "conceptId": "privacy",
    "questions": {
      "board": "Do our AI uses change what people reasonably expect us to do with their information?",
      "executive": "Who checks personal-information use, retention and provider access before deployment?",
      "regulator": "Explain the basis and safeguards for personal-information handling in a selected AI use."
    },
    "why": "An existing data holding does not automatically justify every new AI use.",
    "askFor": "The data flow, privacy assessment, retention rules and provider arrangements.",
    "followUp": "Can you demonstrate deletion or restriction across every copy and provider?"
  },
  {
    "conceptId": "provenance",
    "questions": {
      "board": "Can we trace the information behind an important AI-supported decision?",
      "executive": "How do we retain the origin and transformations of data and generated content?",
      "regulator": "Reconstruct the origin and material transformations of information used in a selected output."
    },
    "why": "Without lineage, unreliable or manipulated information can be difficult to identify.",
    "askFor": "Data lineage, source records, content credentials where used and version histories.",
    "followUp": "What parts of the chain cannot currently be reconstructed?"
  },
  {
    "conceptId": "transparency-disclosure",
    "questions": {
      "board": "Would people understand when and how AI affects them?",
      "executive": "Where do we explain AI use and limitations at the moment people need to know?",
      "regulator": "Show the actual notices and disclosures received by affected people in a selected use."
    },
    "why": "A disclosure buried in documentation may not support an informed decision.",
    "askFor": "Live user journeys, notices and comprehension-testing results.",
    "followUp": "What do people misunderstand despite the disclosure?"
  },
  {
    "conceptId": "explainability",
    "questions": {
      "board": "Can management explain significant AI-supported decisions in terms people can challenge?",
      "executive": "Who can provide a useful explanation when an AI output is questioned?",
      "regulator": "Demonstrate an explanation for a selected consequential decision and how it was checked."
    },
    "why": "A plausible explanation may not accurately reflect how a decision was reached.",
    "askFor": "Decision records, explanation methods and checks of their fidelity and usefulness.",
    "followUp": "How do you know the explanation is accurate rather than merely convincing?"
  },
  {
    "conceptId": "contestability",
    "questions": {
      "board": "Can someone obtain meaningful review of an AI-influenced decision?",
      "executive": "Who handles challenges, can reverse outcomes and provides remedies?",
      "regulator": "Walk through a real challenge to an AI-influenced outcome, including response and remedy."
    },
    "why": "A complaints channel is not enough if nobody can change the result.",
    "askFor": "Appeal routes, case records, response times and remedy decisions.",
    "followUp": "What happens when the person cannot provide the information your process requests?"
  },
  {
    "conceptId": "traceability",
    "questions": {
      "board": "Could we reconstruct a consequential AI action after a complaint or incident?",
      "executive": "Which inputs, versions, tool calls and approvals do we retain for investigation?",
      "regulator": "Reconstruct one AI action end to end using the records retained at the time."
    },
    "why": "Missing execution records can make responsibility and root cause impossible to establish.",
    "askFor": "A sample execution trace, version identifiers and retention controls.",
    "followUp": "Which step would remain unknown if the provider could not supply its logs?"
  },
  {
    "conceptId": "fairness-bias",
    "questions": {
      "board": "Which groups could receive worse outcomes, and what difference would we find unacceptable?",
      "executive": "How do we test and monitor differential outcomes for people affected by this system?",
      "regulator": "Show how you selected relevant groups, measured differential outcomes and addressed findings."
    },
    "why": "Average performance can hide harms concentrated in smaller or underrepresented groups.",
    "askFor": "Group-level evaluations, limitations, complaints and remediation decisions.",
    "followUp": "Which groups are missing or too small in the evidence to support a conclusion?"
  },
  {
    "conceptId": "human-rights",
    "questions": {
      "board": "Which uses could undermine people’s rights, dignity or wellbeing?",
      "executive": "Who examines rights and accessibility impacts and changes the design when needed?",
      "regulator": "Explain how rights impacts and affected groups influenced the choice and conditions of an AI use."
    },
    "why": "Business benefits may come with consequences not captured by model accuracy.",
    "askFor": "Impact analysis, accessibility reviews, stakeholder input and alternatives considered.",
    "followUp": "Whose perspective is missing from the assessment?"
  },
  {
    "conceptId": "human-oversight",
    "questions": {
      "board": "Can people meaningfully challenge and stop AI decisions, or are they just approving them?",
      "executive": "Do reviewers have the time, information and authority to override AI recommendations?",
      "regulator": "Demonstrate how human reviewers detect errors, intervene and avoid routine rubber-stamping."
    },
    "why": "A human approval step can be ineffective when reviewers lack capacity or authority.",
    "askFor": "Workload, override records, reviewer training and observed review exercises.",
    "followUp": "When did a reviewer last reject the AI recommendation, and what happened next?"
  },
  {
    "conceptId": "ai-security",
    "questions": {
      "board": "What evidence supports management’s confidence that our AI systems resist attack?",
      "executive": "Who tests AI-specific attack paths and closes the weaknesses found?",
      "regulator": "Show how security assessment covers the model, data, interfaces, tools and supporting infrastructure."
    },
    "why": "Traditional application checks may miss attacks on prompts, models and agent actions.",
    "askFor": "Threat assessments, test scope, findings and verified remediation.",
    "followUp": "Which attack path has not yet been tested?"
  },
  {
    "conceptId": "access-control",
    "questions": {
      "board": "Could an AI system access or change more than its purpose requires?",
      "executive": "How do we enforce least privilege for AI identities, tools and data access?",
      "regulator": "Demonstrate how an AI identity’s permissions are granted, constrained, reviewed and revoked."
    },
    "why": "An agent can turn overly broad permissions into a fast route to consequential actions.",
    "askFor": "Permission inventories, access approvals and denied-action tests.",
    "followUp": "Can an agent use another tool or identity to bypass the intended restriction?"
  },
  {
    "conceptId": "adversarial-risk",
    "questions": {
      "board": "Which credible attacks could cause the most consequential AI failure?",
      "executive": "What adversarial scenarios are we testing, and who owns unresolved weaknesses?",
      "regulator": "Show how threat scenarios are selected and validated against the deployed AI system."
    },
    "why": "Attack testing is most useful when it reflects the actual deployment and attacker opportunities.",
    "askFor": "Threat models, adversarial test cases and remediation records.",
    "followUp": "What happens when an attacker combines weaknesses that were tested separately?"
  },
  {
    "conceptId": "reliability",
    "questions": {
      "board": "In which conditions should we stop relying on this AI system?",
      "executive": "How do we detect when outputs are no longer reliable enough for the task?",
      "regulator": "Show how intended-use performance, limitations and failure thresholds were established and monitored."
    },
    "why": "A good average score can conceal unreliable behaviour in important conditions.",
    "askFor": "Validation by use condition, acceptance criteria and failure-handling records.",
    "followUp": "Which real operating conditions are absent from the evaluation?"
  },
  {
    "conceptId": "operational-resilience",
    "questions": {
      "board": "Which critical operations would be disrupted if an AI service failed?",
      "executive": "When was the fallback last exercised under realistic time and capacity constraints?",
      "regulator": "Demonstrate that critical operations can continue or recover when an AI dependency fails."
    },
    "why": "A documented fallback may not work at the volume and speed an incident requires.",
    "askFor": "Continuity plans, recovery objectives and results of realistic exercises.",
    "followUp": "What failed during the exercise, and which weaknesses remain unresolved?"
  },
  {
    "conceptId": "incident-response",
    "questions": {
      "board": "Would we learn about a consequential AI incident quickly enough to act?",
      "executive": "Who can contain an AI incident, preserve evidence and coordinate recovery?",
      "regulator": "Walk through detection, escalation, containment and learning from a recent AI incident or exercise."
    },
    "why": "Unusual AI behaviour may be dismissed as a model error until consequences spread.",
    "askFor": "Incident criteria, escalation records, exercises and post-incident actions.",
    "followUp": "What would trigger an immediate stop before the root cause is known?"
  },
  {
    "conceptId": "third-party-risk",
    "questions": {
      "board": "Which critical operations depend on an AI provider we could not readily replace?",
      "executive": "Who owns the fallback if our main AI provider becomes unavailable, and when was it tested?",
      "regulator": "Show how you identified material AI dependencies and assessed whether contingency arrangements are workable."
    },
    "why": "A contractual exit right may not translate into a workable operational fallback.",
    "askFor": "The dependency map, provider arrangements and results of fallback exercises.",
    "followUp": "What happens if access is withdrawn tomorrow rather than at contract expiry?"
  },
  {
    "conceptId": "supply-chain",
    "questions": {
      "board": "How far can management see into the AI dependencies behind our services?",
      "executive": "How do we identify and assess upstream models, components and service providers?",
      "regulator": "Trace a selected AI service through its material upstream dependencies and explain the gaps."
    },
    "why": "The direct supplier may rely on other providers that introduce security and continuity risks.",
    "askFor": "Component inventories, upstream dependency disclosures and change notifications.",
    "followUp": "Which dependency cannot be independently checked, and how is that uncertainty managed?"
  },
  {
    "conceptId": "exitability",
    "questions": {
      "board": "Is our ability to leave a critical AI provider credible?",
      "executive": "Who has tested migration, substitution or safe discontinuation of the AI service?",
      "regulator": "Show what evidence supports the feasibility, timing and cost of your AI exit arrangements."
    },
    "why": "An alternative provider may not reproduce performance, data access or operating controls.",
    "askFor": "Exit plans, portability tests, replacement evaluations and cost assumptions.",
    "followUp": "Which part of the service cannot be transferred or reproduced?"
  },
  {
    "conceptId": "evaluation",
    "questions": {
      "board": "Are the tests answering the questions that matter for the decision to deploy?",
      "executive": "Which acceptance criteria and realistic scenarios determine whether this AI is ready?",
      "regulator": "Explain how the evaluation scope, data and thresholds support the claimed use and limitations."
    },
    "why": "Benchmark performance can differ from performance in the intended workflow.",
    "askFor": "Evaluation plans, representative datasets, thresholds and results.",
    "followUp": "Which consequential failure could pass the current test suite?"
  },
  {
    "conceptId": "red-teaming",
    "questions": {
      "board": "What have independent challengers found that routine testing missed?",
      "executive": "Who designs realistic adversarial exercises and verifies fixes afterwards?",
      "regulator": "Show how adversarial testing was scoped, conducted and followed through to remediation."
    },
    "why": "A demonstration attack is useful only if findings inform decisions and fixes are checked.",
    "askFor": "Exercise scope, tester independence, findings and retest results.",
    "followUp": "What remained untested because of access, time or skill constraints?"
  },
  {
    "conceptId": "continuous-monitoring",
    "questions": {
      "board": "How would management know an approved AI system had become unsafe or ineffective?",
      "executive": "Which signals trigger investigation, restrictions or withdrawal of the system?",
      "regulator": "Demonstrate that monitoring identifies material changes and leads to timely action."
    },
    "why": "A dashboard alone does not show that deteriorating behaviour will be detected and addressed.",
    "askFor": "Monitoring thresholds, alert records and resulting interventions.",
    "followUp": "Which important failure would the current monitoring miss?"
  },
  {
    "conceptId": "evidence-quality",
    "questions": {
      "board": "Which assurances rest on evidence too weak or old to justify confidence?",
      "executive": "Who checks evidence relevance, integrity and limitations before making an AI decision?",
      "regulator": "Show how you assessed the provenance, completeness and limits of evidence supporting a material claim."
    },
    "why": "Evidence can look substantial while failing to support the actual claim in scope.",
    "askFor": "The claim, underlying records, collection method and evidence limitations.",
    "followUp": "What conclusion would change if the weakest piece of evidence were removed?"
  },
  {
    "conceptId": "auditability",
    "questions": {
      "board": "Can independent reviewers inspect our significant AI systems without relying only on management summaries?",
      "executive": "What access, records and contractual rights enable independent examination?",
      "regulator": "Demonstrate access to the records and system behaviour needed to investigate a selected claim."
    },
    "why": "Nominal audit rights may be unusable if records or technical access are unavailable.",
    "askFor": "Access arrangements, audit rights and a sample reconstruction exercise.",
    "followUp": "Where must the reviewer rely on a statement they cannot inspect?"
  },
  {
    "conceptId": "assurance",
    "questions": {
      "board": "What exactly has been independently assessed, and what remains outside the conclusion?",
      "executive": "Who is qualified and sufficiently independent to assess the claims we rely on?",
      "regulator": "Explain the scope, independence, methods and limitations of the assurance you are relying on."
    },
    "why": "An assurance label can obscure exclusions or conflicts that matter to the decision.",
    "askFor": "The signed report, scope, criteria, limitations and unresolved findings.",
    "followUp": "Which management claim goes beyond what the assessor actually concluded?"
  },
  {
    "conceptId": "agent-authority",
    "questions": {
      "board": "What consequential actions are we prepared to let AI take without prior human approval?",
      "executive": "Where is each agent’s mandate enforced, and who approves changes to its authority?",
      "regulator": "Demonstrate how agent actions are bounded by an approved purpose and enforceable permissions."
    },
    "why": "A goal stated in a prompt may not constrain the means an agent uses to achieve it.",
    "askFor": "Agent mandates, permission boundaries and prohibited-action tests.",
    "followUp": "Can the agent achieve an allowed goal through an unauthorised action?"
  },
  {
    "conceptId": "tool-use",
    "questions": {
      "board": "Could an agent’s access to business tools create consequences beyond the approved use?",
      "executive": "Who approves tool access, transaction limits and restrictions on external actions?",
      "regulator": "Show how tool permissions and execution limits are enforced for a selected agent."
    },
    "why": "Tool access can turn an incorrect output into a real transaction or system change.",
    "askFor": "Tool inventories, execution policies and approval or denial records.",
    "followUp": "Can several individually permitted actions combine into a prohibited outcome?"
  },
  {
    "conceptId": "runtime-guardrails",
    "questions": {
      "board": "Which consequential AI behaviours can we actually prevent during operation?",
      "executive": "Where are runtime restrictions enforced, and how do we test bypasses?",
      "regulator": "Demonstrate that runtime controls block prohibited behaviour under realistic conditions."
    },
    "why": "Written rules and model instructions can fail without independent enforcement.",
    "askFor": "Enforcement architecture, denied-action logs and bypass-test results.",
    "followUp": "What happens if the policy service fails or a tool bypasses it?"
  },
  {
    "conceptId": "intervention",
    "questions": {
      "board": "Who can stop an AI system immediately, and what happens to work already underway?",
      "executive": "When was the stop, rollback or isolation mechanism last tested end to end?",
      "regulator": "Demonstrate a safe intervention, including in-flight actions and recovery."
    },
    "why": "A stop button may halt new requests while leaving irreversible actions in progress.",
    "askFor": "Stop procedures, authorisations and observed intervention exercises.",
    "followUp": "Which actions cannot be reversed after intervention?"
  }
]
const sourcePreference = ['apra-ai-letter-2026', 'dta-agentic-addendum', 'nist-ai-rmf', 'eu-ai-act', 'csa-aicm-1-1']
export function questionForConcept(id: string, audience: Audience): Question | undefined {
  const prompt = conceptPrompts.find(p => p.conceptId === id)
  const concept = concepts.find(c => c.id === id)
  if (!prompt || !concept) return undefined
  const references = instruments.filter(s => s.conceptIds.includes(id)).sort((a,b) => {
    const rank = (sid: string) => sourcePreference.includes(sid) ? sourcePreference.indexOf(sid) : 99
    return rank(a.id) - rank(b.id) || a.shortTitle.localeCompare(b.shortTitle)
  }).slice(0,2)
  return { id: `concept:${id}:${audience}`, audience, context: concept.name, text: prompt.questions[audience], why: prompt.why, askFor: prompt.askFor, followUp: prompt.followUp, sources: references.map(s => ({title: s.shortTitle, url: s.officialUrl})) }
}
export function questionsForContext(kind: 'concept' | 'domain', id: string, audience: Audience): Question[] {
  const domainId = kind === 'domain' ? id : concepts.find(c => c.id === id)?.domainId
  const siblings = concepts.filter(c => c.domainId === domainId && (kind !== 'concept' || c.id !== id)).map(c => c.id)
  const ids = (kind === 'concept' ? [id, ...siblings] : siblings).slice(0,3)
  return ids.flatMap(cid => { const q = questionForConcept(cid,audience); return q ? [q] : [] })
}

export const developmentPrompts: Record<string, { questions: Record<Audience,string>; askFor: string; followUp: string }> = {

  "apra-super-ceo-september": {
    "questions": {
      "board": "What did the last crisis exercise reveal about our ability to make decisions during simultaneous disruptions?",
      "executive": "Which shared suppliers and escalation delays should our next crisis exercise test together?",
      "regulator": "What evidence shows that trustees have addressed delegation and supplier-dependency weaknesses found in crisis exercises?"
    },
    "askFor": "Exercise findings, delegated authorities, supplier dependency maps and remediation owners.",
    "followUp": "Which unresolved finding could still prevent timely recovery?"
  },
  "nist-agent-security-findings": {
    "questions": {
      "board": "What assurance do we have that security testing covers actions our AI agents can take?",
      "executive": "Which agent permissions and unintended behaviours fall outside our existing security test plan?",
      "regulator": "How have you distinguished reported agent security concerns from independently tested safeguards?"
    },
    "askFor": "Agent threat models, permission boundaries and tests of failure and intervention paths.",
    "followUp": "Which claimed safeguard has not yet been exercised under realistic conditions?"
  }
,
  "apra-frontier-roundtables": {
    "questions": {
      "board": "Can management act and recover at the speed of an AI-enabled incident?",
      "executive": "Which incident decisions can be made immediately, and by whom?",
      "regulator": "Show how the roundtable themes have informed tested changes to your response and recovery arrangements."
    },
    "askFor": "Delegated response authorities, recovery exercise results and unresolved actions.",
    "followUp": "Which approval delay had the greatest impact in your last exercise?"
  },
  "fsb-frontier-letter": {
    "questions": {
      "board": "Could shared AI dependencies turn a local incident into a wider disruption?",
      "executive": "Which common providers create failure scenarios across business units and counterparties?",
      "regulator": "How are common AI dependencies and correlated cyber disruption reflected in your supervisory assessment?"
    },
    "askFor": "Concentration analysis, shared-provider scenarios and coordination arrangements.",
    "followUp": "Which dependencies are outside the organisation’s direct visibility?"
  },
  "asd-agent-actions": {
    "questions": {
      "board": "Could our agents meet their targets by harming customers or breaking business rules?",
      "executive": "Which server-side restrictions prevent agents from bypassing transaction rules?",
      "regulator": "Demonstrate how an agent is prevented from taking unapproved actions affecting other users."
    },
    "askFor": "Business-rule enforcement, negative test cases and execution logs.",
    "followUp": "What happens if the agent finds a different route to the same prohibited action?"
  },
  "nist-tevv-athlon": {
    "questions": {
      "board": "Do our AI evaluations measure the outcomes that matter to the organisation?",
      "executive": "Which real-world objectives should shape the next evaluation plan?",
      "regulator": "Explain how the selected evaluation methods support the claims made about this AI use."
    },
    "askFor": "Evaluation objectives, scenario coverage and the decisions supported by each result.",
    "followUp": "Which important outcome is still not measured?"
  },
  "asd-board-guidance": {
    "questions": {
      "board": "What has changed in our cyber readiness as frontier AI capabilities have advanced?",
      "executive": "Which board-level cyber concerns need a funded action and an accountable owner?",
      "regulator": "Show the evidence underlying the board’s assessment of frontier AI cyber readiness."
    },
    "askFor": "Board papers, capability gaps, provider dependencies and recovery exercises.",
    "followUp": "Which confidence statement in the board paper is least supported by evidence?"
  },
  "nist-documentation-draft": {
    "questions": {
      "board": "Could customers and independent reviewers understand our AI limitations from what we disclose?",
      "executive": "Who will compare our public AI documentation with the issues raised by this draft?",
      "regulator": "Show how public AI documentation accurately represents the system’s purpose and limitations."
    },
    "askFor": "Published documentation, change ownership and checks against deployed behaviour.",
    "followUp": "Where does the public description differ from actual operation?"
  },
  "nist-aite-launch": {
    "questions": {
      "board": "Are the model comparisons we rely on credible for our intended use?",
      "executive": "How do we limit test-data contamination and compare models under consistent conditions?",
      "regulator": "Explain how evaluation data independence and comparability were assessed."
    },
    "askFor": "Dataset provenance, access separation and comparable evaluation results.",
    "followUp": "Which result would be least reliable if the test data had been seen during training?"
  },
  "eu-transparency-guidelines": {
    "questions": {
      "board": "Would affected people understand when and how our services use AI?",
      "executive": "Who has checked the role, scope and timing of applicable transparency obligations?",
      "regulator": "Show how an in-scope provider or deployer has interpreted and implemented its transparency obligations."
    },
    "askFor": "Applicability analysis, live disclosures and implementation decisions.",
    "followUp": "Can a user see and understand the disclosure at the moment it matters?"
  },
  "edpb-anonymisation-consultation": {
    "questions": {
      "board": "What evidence supports management’s claims that AI data is anonymous?",
      "executive": "Who will review anonymisation assumptions in light of the issues under consultation?",
      "regulator": "Explain the technical and contextual evidence supporting an anonymisation claim."
    },
    "askFor": "The anonymisation method, data context and re-identification assessment.",
    "followUp": "Which changes in available data or access would invalidate the claim?"
  },
  "asd-ai-cyber-defence": {
    "questions": {
      "board": "Are our patching and response timelines credible against faster AI-enabled attacks?",
      "executive": "Which exposed services need faster remediation, stronger isolation or retirement?",
      "regulator": "Demonstrate how the organisation verifies controls protecting internet-facing services."
    },
    "askFor": "External asset inventory, remediation times, control tests and incident exercises.",
    "followUp": "Which exposed weakness has remained unresolved the longest, and why?"
  },
  "apra-frontier-speech": {
    "questions": {
      "board": "What happens to critical operations if access to an offshore AI model is withdrawn?",
      "executive": "Who has tested a fallback that does not depend on the same model provider?",
      "regulator": "Show how offshore access and concentration risks are reflected in contingency arrangements."
    },
    "askFor": "Provider dependencies, access assumptions and substitution test results.",
    "followUp": "Can the fallback operate without the unavailable provider’s tools or data?"
  },
  "csa-aicm-11": {
    "questions": {
      "board": "Are AI control responsibilities clear across our organisation and suppliers?",
      "executive": "Which candidate controls need an owner, implementation evidence and testing?",
      "regulator": "Show how framework-derived control choices were tailored and evaluated for the actual use."
    },
    "askFor": "Responsibility allocation, supplier evidence and control test results.",
    "followUp": "Which completed questionnaire answers have not been corroborated?"
  },
  "five-eyes-frontier-statement": {
    "questions": {
      "board": "Have we given cyber leaders enough authority and resources to act on the changing threat?",
      "executive": "Which foundational cyber gaps require accelerated action and funding?",
      "regulator": "Explain how leadership has translated its assessment of AI-enabled threats into action."
    },
    "askFor": "Readiness assessment, funded priorities and delegated authorities.",
    "followUp": "Which critical action is delayed by a resource or authority constraint?"
  },
  "fsb-ai-practices-consultation": {
    "questions": {
      "board": "Where does our AI governance fall short of a coherent organisation-wide approach?",
      "executive": "Which proposed practices expose gaps between our teams and lifecycle stages?",
      "regulator": "How does the organisation demonstrate ownership and oversight across the AI lifecycle?"
    },
    "askFor": "Governance arrangements, lifecycle responsibilities and implementation examples.",
    "followUp": "Where is accountability lost at a handover between teams?"
  },
  "dta-agentic-guidance": {
    "questions": {
      "board": "Are we extending governance to match the actions agents can take?",
      "executive": "How will our agency apply the agentic addendum across design, evaluation and operation?",
      "regulator": "Show how an agency using agentic AI has considered the addendum alongside the technical standard."
    },
    "askFor": "Agent design decisions, lifecycle checks and operational monitoring.",
    "followUp": "Which agentic capability is not covered by the existing review process?"
  },
  "acs-release": {
    "questions": {
      "board": "Which agent actions can our organisation reliably prevent at runtime?",
      "executive": "Where could portable enforcement hooks strengthen agent permissions and intervention?",
      "regulator": "Demonstrate how declared agent policies are enforced in the deployed environment."
    },
    "askFor": "Enforcement design, denied-action logs and bypass-test results.",
    "followUp": "What happens when the enforcement component is unavailable?"
  },
  "crosswalk-release": {
    "questions": {
      "board": "Do our framework mappings support the risk decisions we are making?",
      "executive": "Which mappings need validation before we use them to select controls?",
      "regulator": "Show how a selected mapping was checked against the actual source requirement and use context."
    },
    "askFor": "Original source passages, mapping rationale and resulting control decisions.",
    "followUp": "Where does the mapping leave an important gap or mismatch?"
  },
  "llm-top10-2026": {
    "questions": {
      "board": "Does management’s assessment reflect the threats relevant to our current LLM uses?",
      "executive": "Which threat scenarios and tests should we revisit following the revised guide?",
      "regulator": "Explain how the organisation assessed the relevance of the revised threat guidance."
    },
    "askFor": "Threat assessment revisions, evaluation coverage and unresolved findings.",
    "followUp": "Which newly considered scenario has changed a deployment or control decision?"
  }
}
export function questionForDevelopment(item: Development, audience: Audience): Question | undefined {
  const prompt = developmentPrompts[item.id]
  if (!prompt) return undefined
  return { id: `development:${item.id}:${audience}`, audience, context: item.title, text: prompt.questions[audience], why: item.implication, askFor: prompt.askFor, followUp: prompt.followUp, sources: [{ title: item.issuer + ' — ' + item.title, url: item.url }], developmentDate: item.published }
}
export const MAX_BRIEF_QUESTIONS = 8
export function briefText(purpose: string, questions: Question[]): string {
  return ['AI Trust Atlas — Meeting brief', purpose.trim() || 'Discussion questions', '', 'Atlas-authored, source-informed prompts. Confirm the context and applicable requirements. Supporting material is an input to human assessment.', '', ...questions.flatMap((q,i) => [
    `${i+1}. ${q.text}`, `${audienceNames[q.audience]} · ${q.context}${q.developmentDate ? ' · Development: '+q.developmentDate : ''}`, ...(q.basis ? [`Connection to this item: ${q.basis}`] : []), `Why ask: ${q.why}`, `Ask for: ${q.askFor}`, `Follow-up: ${q.followUp}`, ...q.sources.map(s => `${s.title}: ${s.url}`), ''
  ])].join('\n')
}
