import type { EditorialStatus } from '../types'
import { instrumentById } from './instruments'

/*
 * Implementation playbooks and a tools catalogue, drafted 24 September 2026
 * for editorial review. Playbooks are Atlas practice guidance: sequences of
 * candidate control work linked to the sources that motivate each step. They
 * describe what teams commonly do, not what any organisation must do.
 * Tools are limited to government, standards-body, non-profit and community
 * open-source resources, listed without endorsement.
 */
export type PlaybookStep = { title: string; guidance: string; controlIds: string[]; sourceIds: string[]; artefacts: string[] }
export type Playbook = { id: string; title: string; outcome: string; audience: string; timeframe: string; roles: string[]; steps: PlaybookStep[]; editorialStatus: EditorialStatus }

export const playbooks: Playbook[] = [
  {
    id: 'ai-inventory-ownership',
    title: 'Stand up an AI inventory with accountable owners',
    outcome: 'Every in-scope AI system is known, owned, classified and scheduled for proportionate review.',
    audience: 'Chief risk officers, AI governance leads, heads of data',
    timeframe: '6–10 weeks',
    roles: ['Accountable executive', 'AI governance lead', 'System owners', 'Risk and compliance'],
    editorialStatus: 'draft',
    steps: [
      { title: 'Define what counts and how it enters', guidance: 'Agree a working definition of an AI system, including embedded vendor features, and set an intake route so new uses are registered before deployment.', controlIds: ['ai-inventory-classification', 'context-materiality'], sourceIds: ['provision:nist-govern-1-6', 'provision:eu-ai-act-6'], artefacts: ['AI definition and intake form'] },
      { title: 'Build the register', guidance: 'Record each system’s purpose, owner, users, data, model and vendor dependencies, lifecycle state and affected people.', controlIds: ['ai-inventory-classification', 'data-model-provenance'], sourceIds: ['provision:ai6-information', 'provision:iso42001-a4'], artefacts: ['AI register'] },
      { title: 'Name owners and decision rights', guidance: 'Assign an accountable owner per system and define who may approve, pause, accept risk or retire it.', controlIds: ['accountable-ownership', 'decision-rights-approval'], sourceIds: ['provision:ai6-accountable', 'provision:iso42001-a3', 'provision:nist-govern-3-2'], artefacts: ['RACI and delegation schedule'] },
      { title: 'Classify by materiality', guidance: 'Tier systems by decision significance, people affected and dependency, and schedule impact assessments for higher tiers.', controlIds: ['context-materiality', 'impact-risk-assessment'], sourceIds: ['provision:eu-ai-act-6', 'provision:iso42001-a5', 'provision:nist-map-1-1'], artefacts: ['Risk-tiering criteria', 'Assessment schedule'] },
      { title: 'Report and keep it current', guidance: 'Give the board a periodic view of the portfolio and exceptions, and test the register against procurement and change records.', controlIds: ['accountable-ownership', 'competence-challenge'], sourceIds: ['instrument:apra-ai-letter-2026'], artefacts: ['Board AI portfolio report'] },
    ],
  },
  {
    id: 'iso-42001-readiness',
    title: 'Prepare for ISO/IEC 42001 certification',
    outcome: 'An AI management system that is scoped, operating and internally audited before a certification audit.',
    audience: 'AI governance leads, quality and compliance teams',
    timeframe: '3–9 months',
    roles: ['Management system owner', 'Top management', 'Internal audit', 'System owners'],
    editorialStatus: 'draft',
    steps: [
      { title: 'Set context and scope', guidance: 'Define interested parties, the AI roles you play and the boundary of the management system.', controlIds: ['context-materiality'], sourceIds: ['provision:iso42001-context'], artefacts: ['Scope statement'] },
      { title: 'Establish leadership and policy', guidance: 'Adopt an AI policy, assign roles and show top-management commitment.', controlIds: ['accountable-ownership', 'decision-rights-approval'], sourceIds: ['provision:iso42001-leadership', 'provision:iso42001-a2'], artefacts: ['AI policy', 'Roles and authorities'] },
      { title: 'Assess risks and impacts', guidance: 'Run AI risk assessments and system impact assessments, and plan treatment.', controlIds: ['impact-risk-assessment'], sourceIds: ['provision:iso42001-planning', 'provision:iso42001-a5', 'instrument:iso-42005'], artefacts: ['Risk assessment', 'Impact assessments', 'Treatment plan'] },
      { title: 'Select and justify controls', guidance: 'Map treatment to Annex A control areas and record inclusions and exclusions with reasons.', controlIds: ['secure-ai-development', 'data-model-provenance', 'third-party-assessment'], sourceIds: ['provision:iso42001-a6', 'provision:iso42001-a7', 'provision:iso42001-a10'], artefacts: ['Statement of applicability'] },
      { title: 'Operate, monitor and review', guidance: 'Run the controls, monitor performance, complete internal audits and a management review before the certification audit.', controlIds: ['runtime-monitoring', 'competence-challenge'], sourceIds: ['provision:iso42001-operation', 'provision:iso42001-performance'], artefacts: ['Internal audit report', 'Management review minutes'] },
      { title: 'Choose a certification body', guidance: 'Prefer bodies whose AIMS certification is accredited against ISO/IEC 42006 requirements, and be clear that certification is not assurance on AI outcomes.', controlIds: ['competence-challenge'], sourceIds: ['instrument:iso-42006'], artefacts: ['Certification body shortlist'] },
    ],
  },
  {
    id: 'cps230-ai-vendors',
    title: 'Review AI service providers under CPS 230',
    outcome: 'Material AI dependencies are identified, contracted, monitored and tested within tolerance.',
    audience: 'APRA-regulated entities: operational risk, procurement and technology',
    timeframe: '8–12 weeks',
    roles: ['Accountable executive', 'Operational risk', 'Procurement', 'Vendor owners'],
    editorialStatus: 'draft',
    steps: [
      { title: 'Find the material AI providers', guidance: 'Identify service providers whose AI capabilities support critical operations or could materially affect them.', controlIds: ['third-party-assessment', 'ai-inventory-classification'], sourceIds: ['provision:cps230-provider', 'instrument:apra-ai-letter-2026'], artefacts: ['Material service provider list'] },
      { title: 'Diligence beyond SOC 2', guidance: 'Use assurance reports, but check what they do not cover: model changes, training data, evaluation and AI-specific incidents.', controlIds: ['third-party-assessment', 'fit-for-purpose-evaluation'], sourceIds: ['instrument:aicpa-soc2-tsc', 'provision:cps234-third-parties'], artefacts: ['AI vendor due-diligence questionnaire'] },
      { title: 'Contract for change and exit', guidance: 'Secure notice of material model or service changes, data and incident obligations, audit rights and a workable exit.', controlIds: ['third-party-assessment', 'change-release-retirement'], sourceIds: ['provision:cps230-provider', 'provision:iso42001-a10'], artefacts: ['AI contract clause library'] },
      { title: 'Set tolerances and monitor', guidance: 'Define disruption tolerances for AI-dependent operations and monitor provider performance and incidents against them.', controlIds: ['resilience-rollback-continuity', 'runtime-monitoring'], sourceIds: ['provision:cps230-tolerance-dimensions', 'provision:cps230-bcp-dependencies'], artefacts: ['Tolerance statement', 'Provider monitoring dashboard'] },
      { title: 'Test severe but plausible scenarios', guidance: 'Exercise provider failure, degraded model behaviour and concentration scenarios, and fix the gaps found.', controlIds: ['resilience-rollback-continuity', 'incident-response-reporting'], sourceIds: ['provision:cps230-test-review', 'provision:cps230-independent-review'], artefacts: ['Scenario test report'] },
    ],
  },
  {
    id: 'asae-3000-readiness',
    title: 'Get ready for assurance over AI governance',
    outcome: 'A defined subject matter, suitable criteria and evidence that an independent practitioner could test.',
    audience: 'Boards, audit committees, chief risk officers',
    timeframe: '2–4 months before an engagement',
    roles: ['Audit committee', 'Management', 'Internal audit', 'External practitioner'],
    editorialStatus: 'draft',
    steps: [
      { title: 'Decide what is to be assured', guidance: 'Choose the subject matter — for example the design of AI governance controls, or a public AI statement — and who will rely on the report.', controlIds: ['accountable-ownership'], sourceIds: ['provision:isae3000-preconditions', 'instrument:asae-3000'], artefacts: ['Engagement scope memo'] },
      { title: 'Agree suitable criteria', guidance: 'Select criteria that are relevant, complete and measurable, such as a control framework mapped to your obligations.', controlIds: ['records-traceability'], sourceIds: ['provision:isae3000-preconditions', 'instrument:iso-42001'], artefacts: ['Criteria document'] },
      { title: 'Choose the level of assurance', guidance: 'Weigh limited against reasonable assurance, and design against operating effectiveness, given maturity and cost.', controlIds: ['competence-challenge'], sourceIds: ['provision:isae3000-levels', 'provision:asae3150-operating'], artefacts: ['Assurance options paper'] },
      { title: 'Assess readiness and close gaps', guidance: 'Run a self-assessment, fix the largest gaps and assemble evidence that shows controls operating over time.', controlIds: ['records-traceability', 'runtime-monitoring'], sourceIds: ['instrument:iia-gias', 'provision:eu-ai-act-12'], artefacts: ['Readiness assessment', 'Evidence index'] },
      { title: 'Engage the practitioner', guidance: 'Confirm independence, the engagement terms and management’s representations, and plan the timetable.', controlIds: ['accountable-ownership'], sourceIds: ['instrument:asae-3150', 'instrument:isae-3000'], artefacts: ['Engagement letter'] },
    ],
  },
  {
    id: 'agentic-guardrails',
    title: 'Put runtime guardrails around AI agents',
    outcome: 'Agents act within defined mandates, with least privilege, approvals for high-impact actions and a way to stop them.',
    audience: 'Technology, security and product leaders deploying agents',
    timeframe: '4–8 weeks per agent class',
    roles: ['Product owner', 'Security engineering', 'Platform team', 'Risk'],
    editorialStatus: 'draft',
    steps: [
      { title: 'Write the mandate', guidance: 'State what the agent may do, for whom, with which tools and limits, and what it must escalate.', controlIds: ['agent-runtime-constraints', 'decision-rights-approval'], sourceIds: ['concept:agent-authority', 'instrument:imda-agentic-framework'], artefacts: ['Agent mandate'] },
      { title: 'Grant least privilege', guidance: 'Give the agent its own identity and the minimum tool, data and credential access for the mandate.', controlIds: ['least-privilege-access'], sourceIds: ['instrument:asd-agentic-harnesses', 'instrument:dta-agentic-addendum'], artefacts: ['Access matrix'] },
      { title: 'Gate high-impact actions', guidance: 'Require human approval or policy checks before payments, external communications, deletions or other irreversible actions.', controlIds: ['agent-runtime-constraints', 'human-intervention-safe-stop'], sourceIds: ['provision:nist-manage-2-4', 'provision:ai6-human-control'], artefacts: ['Action approval policy'] },
      { title: 'Observe everything', guidance: 'Log prompts, tool calls, decisions and outcomes so incidents can be reconstructed, and alert on anomalies.', controlIds: ['records-traceability', 'runtime-monitoring'], sourceIds: ['provision:eu-ai-act-12', 'instrument:asd-unexpected-agent-actions'], artefacts: ['Agent telemetry design'] },
      { title: 'Red-team and rehearse', guidance: 'Test prompt injection, tool misuse and goal drift, and rehearse stopping and rolling back the agent.', controlIds: ['adversarial-security-testing', 'incident-response-reporting'], sourceIds: ['instrument:owasp-agentic-top-10', 'instrument:mitre-atlas'], artefacts: ['Red-team report', 'Kill-switch runbook'] },
    ],
  },
]

export type ToolPurpose = 'Test and evaluate' | 'Secure and red-team' | 'Govern and document' | 'Provenance and transparency'
export type Tool = { id: string; name: string; publisher: string; kind: 'Government' | 'Standards body' | 'Non-profit' | 'Community open source'; purpose: ToolPurpose; summary: string; controlIds: string[]; instrumentId?: string; url: string; editorialStatus: EditorialStatus }

const catalogue: Tool[] = [
  { id: 'dioptra', name: 'Dioptra', publisher: 'NIST', kind: 'Government', purpose: 'Test and evaluate', summary: 'Open test platform for reproducible experiments that measure AI model trustworthiness characteristics, including adversarial robustness.', controlIds: ['fit-for-purpose-evaluation', 'adversarial-security-testing'], url: 'https://pages.nist.gov/dioptra/', editorialStatus: 'draft' },
  { id: 'inspect', name: 'Inspect', publisher: 'UK AI Security Institute', kind: 'Government', purpose: 'Test and evaluate', summary: 'Open-source framework for large language model evaluations, including agentic tasks.', controlIds: ['fit-for-purpose-evaluation'], instrumentId: 'uk-aisi-inspect', url: 'https://inspect.aisi.org.uk/', editorialStatus: 'draft' },
  { id: 'ai-verify', name: 'AI Verify', publisher: 'IMDA and the AI Verify Foundation', kind: 'Government', purpose: 'Test and evaluate', summary: 'Testing framework and toolkit that combines technical tests with process checks against governance principles.', controlIds: ['fit-for-purpose-evaluation', 'fairness-rights-testing', 'records-traceability'], instrumentId: 'singapore-ai-verify', url: 'https://aiverifyfoundation.sg/', editorialStatus: 'draft' },
  { id: 'fairlearn', name: 'Fairlearn', publisher: 'Fairlearn community', kind: 'Community open source', purpose: 'Test and evaluate', summary: 'Python library for assessing and mitigating fairness-related harms, with metrics, mitigation algorithms and guidance.', controlIds: ['fairness-rights-testing'], url: 'https://fairlearn.org/', editorialStatus: 'draft' },
  { id: 'mitre-atlas', name: 'MITRE ATLAS', publisher: 'MITRE', kind: 'Non-profit', purpose: 'Secure and red-team', summary: 'Knowledge base of adversary tactics and techniques against AI systems, for threat modelling and red-team planning.', controlIds: ['adversarial-security-testing', 'secure-ai-development'], instrumentId: 'mitre-atlas', url: 'https://atlas.mitre.org/', editorialStatus: 'draft' },
  { id: 'owasp-llm', name: 'OWASP Top 10 for LLM Applications', publisher: 'OWASP GenAI Security Project', kind: 'Non-profit', purpose: 'Secure and red-team', summary: 'The most critical security risks for applications built on large language models, with mitigations.', controlIds: ['secure-ai-development', 'adversarial-security-testing'], instrumentId: 'owasp-llm-top-10', url: 'https://genai.owasp.org/', editorialStatus: 'draft' },
  { id: 'owasp-agentic', name: 'OWASP Agentic Top 10', publisher: 'OWASP GenAI Security Project', kind: 'Non-profit', purpose: 'Secure and red-team', summary: 'Security risks specific to agentic applications, from tool misuse to goal manipulation.', controlIds: ['agent-runtime-constraints', 'adversarial-security-testing'], instrumentId: 'owasp-agentic-top-10', url: 'https://genai.owasp.org/', editorialStatus: 'draft' },
  { id: 'owasp-aisvs', name: 'OWASP AISVS', publisher: 'OWASP', kind: 'Non-profit', purpose: 'Secure and red-team', summary: 'Verification requirements for designing, building and testing AI-enabled systems securely.', controlIds: ['secure-ai-development', 'least-privilege-access'], instrumentId: 'owasp-aisvs', url: 'https://owasp.org/www-project-artificial-intelligence-security-verification-standard-aisvs-docs/', editorialStatus: 'draft' },
  { id: 'nist-playbook', name: 'NIST AI RMF Playbook', publisher: 'NIST', kind: 'Government', purpose: 'Govern and document', summary: 'Suggested actions, references and documentation for each AI RMF subcategory.', controlIds: ['accountable-ownership', 'impact-risk-assessment', 'records-traceability'], instrumentId: 'nist-ai-rmf-playbook', url: 'https://airc.nist.gov/', editorialStatus: 'draft' },
  { id: 'csa-aicm', name: 'AI Controls Matrix', publisher: 'Cloud Security Alliance', kind: 'Non-profit', purpose: 'Govern and document', summary: 'Vendor-neutral control framework for cloud-based AI systems, with mappings to other frameworks.', controlIds: ['third-party-assessment', 'secure-ai-development'], instrumentId: 'csa-aicm-1-1', url: 'https://cloudsecurityalliance.org/', editorialStatus: 'draft' },
  { id: 'mit-mitigations', name: 'MIT AI Risk Mitigations', publisher: 'MIT AI Risk Repository', kind: 'Non-profit', purpose: 'Govern and document', summary: 'Catalogue of mitigations organised against the MIT AI risk taxonomy.', controlIds: ['impact-risk-assessment'], instrumentId: 'mit-ai-risk-mitigations', url: 'https://airisk.mit.edu/', editorialStatus: 'draft' },
  { id: 'c2pa', name: 'C2PA Content Credentials', publisher: 'Coalition for Content Provenance and Authenticity', kind: 'Standards body', purpose: 'Provenance and transparency', summary: 'Open technical standard for attaching tamper-evident provenance to media, including AI-generated content.', controlIds: ['ai-notice-disclosure', 'data-model-provenance'], instrumentId: 'c2pa-2-4', url: 'https://c2pa.org/', editorialStatus: 'draft' },
]

/* Tools that are also Atlas sources use the source record's reviewed official URL. */
export const tools: Tool[] = catalogue.map((tool) => ({ ...tool, url: (tool.instrumentId && instrumentById.get(tool.instrumentId)?.officialUrl) || tool.url }))

export const playbookById = new Map(playbooks.map((playbook) => [playbook.id, playbook]))
export const toolPurposes: ToolPurpose[] = ['Test and evaluate', 'Secure and red-team', 'Govern and document', 'Provenance and transparency']
