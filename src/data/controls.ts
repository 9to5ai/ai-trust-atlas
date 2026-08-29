import type { ControlFamily, ControlObjective, ControlSourceReference } from '../types'
import { instrumentById } from './instruments'

export const CONTROL_MODEL_VERSION = '2026.08'
export const CONTROL_MODEL_VERIFIED = '2026-08-29'

export const controlFamilies: ControlFamily[] = [
  { id: 'govern-own', code: 'GOV', name: 'Govern and own', shortName: 'Govern', question: 'Who owns the decision and its consequences?', definition: 'Accountability, inventory, decision rights and competence for responsible AI use.', color: '#f0a46b' },
  { id: 'understand-assess', code: 'ASS', name: 'Understand and assess', shortName: 'Assess', question: 'What is the context, impact and dependency?', definition: 'Context, impact, data and third-party assessment before and throughout use.', color: '#df83a7' },
  { id: 'protect-constrain', code: 'PRO', name: 'Protect and constrain', shortName: 'Protect', question: 'What prevents unsafe or unauthorised action?', definition: 'Organisational and technical safeguards that bound access, data, development and autonomy.', color: '#ef7373' },
  { id: 'inform-recourse', code: 'INF', name: 'Inform and enable recourse', shortName: 'Inform', question: 'Can affected people understand and challenge?', definition: 'Disclosure, explanation, traceability, contestability and remedies.', color: '#8ad7d0' },
  { id: 'test-monitor', code: 'TST', name: 'Test and monitor', shortName: 'Test', question: 'How are claims challenged over time?', definition: 'Evaluation, adversarial testing, fairness analysis and continuous monitoring.', color: '#74b9a2' },
  { id: 'respond-retire', code: 'RES', name: 'Respond, recover and retire', shortName: 'Respond', question: 'How is harm contained and safe operation restored?', definition: 'Incidents, intervention, resilience, rollback, change and decommissioning.', color: '#76cf93' },
]

const sourceRef = (
  instrumentId: string,
  locator: string,
  sourceKind: ControlSourceReference['sourceKind'],
): ControlSourceReference => {
  const instrument = instrumentById.get(instrumentId)
  if (!instrument) throw new Error(`Unknown control source instrument: ${instrumentId}`)
  return { instrumentId, sourceTitle: instrument.shortTitle, locator, url: instrument.officialUrl, sourceKind }
}

const nist = (locator: string) => sourceRef('nist-ai-rmf-playbook', locator, 'suggested-action')
const mit = (locator: string) => sourceRef('mit-ai-risk-mitigations', locator, 'mitigation-pattern')
const au = (locator: string) => sourceRef('au-ai-adoption-guidance', locator, 'implementation-guidance')
const owasp = (locator: string) => sourceRef('owasp-aisvs', locator, 'verification-requirement')
const csa = (locator: string) => sourceRef('csa-aicm-1-1', locator, 'crosswalk')

export const controlObjectives: ControlObjective[] = [
  {
    id: 'accountable-ownership', code: 'ATC-01', name: 'Assign accountable ownership', shortName: 'Accountable ownership', familyId: 'govern-own',
    objective: 'Assign and communicate accountable human ownership for each AI system, its outcomes and material governance decisions.',
    purpose: 'Prevent accountability gaps across business, technology, risk and third-party participants.', controlTypes: ['governance', 'preventive'], lifecycleStages: ['Intake', 'Development', 'Deployment', 'Operation'], roleArchetypes: ['Board or governing body', 'Business owner', 'Risk owner'],
    conceptIds: ['accountability', 'decision-rights', 'human-oversight'], riskIds: ['mit-risk-5-2', 'mit-risk-6-5', 'mit-risk-7-1'],
    implementationExamples: ['Named business and risk owners', 'Documented role boundaries', 'Escalation and exception authorities'], evidenceExamples: ['Accountability register', 'Approved role charters', 'Decision and escalation records'], sourceRefs: [nist('GOVERN 1 and 2'), au('1. Decide who is accountable'), mit('1.1 Board Structure & Oversight')],
  },
  {
    id: 'ai-inventory-classification', code: 'ATC-02', name: 'Maintain an AI inventory and classification', shortName: 'Inventory', familyId: 'govern-own',
    objective: 'Maintain a current inventory of AI systems, owners, purposes, dependencies, lifecycle state and risk classification.',
    purpose: 'Make the population of AI use visible enough to govern proportionately.', controlTypes: ['governance', 'preventive', 'detective'], lifecycleStages: ['Intake', 'Deployment', 'Operation', 'Retirement'], roleArchetypes: ['AI governance function', 'Technology owner', 'Procurement'],
    conceptIds: ['inventory', 'materiality', 'third-party-risk'], riskIds: ['mit-risk-6-5', 'mit-risk-6-1', 'mit-risk-7-3'],
    implementationExamples: ['Use-case intake workflow', 'System and model register', 'Risk-tier and dependency tags'], evidenceExamples: ['Current AI register', 'Reconciliation reports', 'Classification criteria and approvals'], sourceRefs: [nist('GOVERN 1.5 and MAP 1'), au('2. Establish an AI strategy and governance framework'), mit('1.2 Risk Management')],
  },
  {
    id: 'decision-rights-approval', code: 'ATC-03', name: 'Define decision rights and approval gates', shortName: 'Decision gates', familyId: 'govern-own',
    objective: 'Define who may approve, pause, restrict, accept risk, grant exceptions or retire an AI system.',
    purpose: 'Keep consequential decisions with people who have the authority, context and competence to make them.', controlTypes: ['governance', 'preventive'], lifecycleStages: ['Intake', 'Pre-deployment', 'Change', 'Retirement'], roleArchetypes: ['Business owner', 'Risk owner', 'Release authority'],
    conceptIds: ['decision-rights', 'materiality', 'risk-treatment', 'intervention'], riskIds: ['mit-risk-5-2', 'mit-risk-6-4', 'mit-risk-6-5', 'mit-risk-7-2'],
    implementationExamples: ['Risk-tiered approval gates', 'Go or no-go criteria', 'Exception expiry and review'], evidenceExamples: ['Approval records', 'Risk acceptance rationale', 'Exception register'], sourceRefs: [nist('MANAGE 1.1 and 1.2'), au('1.1 Accountable people'), mit('1.5 Safety Decision Frameworks')],
  },
  {
    id: 'competence-challenge', code: 'ATC-04', name: 'Build competence and independent challenge', shortName: 'Competence', familyId: 'govern-own',
    objective: 'Ensure people governing, building, using and reviewing AI have role-appropriate competence and access to independent challenge.',
    purpose: 'Reduce poor decisions caused by capability gaps, incentives or unchecked assumptions.', controlTypes: ['governance', 'preventive', 'detective'], lifecycleStages: ['All lifecycle stages'], roleArchetypes: ['People leader', 'AI practitioner', 'Independent reviewer'],
    conceptIds: ['competence', 'assurance', 'accountability'], riskIds: ['mit-risk-5-1', 'mit-risk-6-4', 'mit-risk-6-5'],
    implementationExamples: ['Role-based AI training', 'Conflict-of-interest declarations', 'Independent review triggers'], evidenceExamples: ['Competency matrix', 'Training completion and assessment', 'Independent review records'], sourceRefs: [nist('GOVERN 4'), au('1.3 AI literacy and training'), mit('1.3 Conflict of Interest Protections')],
  },
  {
    id: 'context-materiality', code: 'ATC-05', name: 'Define context and materiality', shortName: 'Context', familyId: 'understand-assess',
    objective: 'Document intended purpose, affected stakeholders, decision significance, foreseeable misuse and organisational risk context.',
    purpose: 'Make proportional governance depend on real use and consequences rather than the technology label alone.', controlTypes: ['governance', 'preventive'], lifecycleStages: ['Intake', 'Change'], roleArchetypes: ['Business owner', 'Risk specialist', 'Legal or policy adviser'],
    conceptIds: ['materiality', 'human-rights', 'systemic-risk'], riskIds: ['mit-risk-5-1', 'mit-risk-6-1', 'mit-risk-6-2', 'mit-risk-7-5'],
    implementationExamples: ['Use-context statement', 'Stakeholder and harm analysis', 'Materiality criteria'], evidenceExamples: ['Approved use-case scope', 'Stakeholder map', 'Materiality assessment'], sourceRefs: [nist('MAP 1 and 2'), au('3. Assess impacts and risks'), mit('1.7 Societal Impact Assessment')],
  },
  {
    id: 'impact-risk-assessment', code: 'ATC-06', name: 'Assess impacts and risks', shortName: 'Impact assessment', familyId: 'understand-assess',
    objective: 'Identify, analyse and document foreseeable impacts and risks to people, organisations and society throughout the lifecycle.',
    purpose: 'Inform restrictions, testing, treatment and approval decisions with explicit assumptions and uncertainty.', controlTypes: ['governance', 'preventive', 'detective'], lifecycleStages: ['Intake', 'Pre-deployment', 'Change', 'Operation'], roleArchetypes: ['Business owner', 'Risk specialist', 'Affected-stakeholder adviser'],
    conceptIds: ['impact-assessment', 'risk-treatment', 'human-rights', 'fairness-bias'], riskIds: ['mit-risk-1-1', 'mit-risk-1-3', 'mit-risk-6-1', 'mit-risk-6-6'],
    implementationExamples: ['AI impact assessment', 'Risk and control self-assessment', 'Periodic reassessment'], evidenceExamples: ['Assessment report', 'Risk register entries', 'Assumptions and limitations log'], sourceRefs: [nist('MAP 3, 4 and 5'), au('3. Assess impacts and risks'), mit('1.2 Risk Management')],
  },
  {
    id: 'data-model-provenance', code: 'ATC-07', name: 'Establish data and model provenance', shortName: 'Provenance', familyId: 'understand-assess',
    objective: 'Record the origin, rights, transformations, versions and custody of material data, models and generated content.',
    purpose: 'Support lawful use, reproducibility, attribution and investigation of failures.', controlTypes: ['preventive', 'detective'], lifecycleStages: ['Acquisition', 'Development', 'Deployment', 'Operation'], roleArchetypes: ['Data owner', 'Model owner', 'Engineering team'],
    conceptIds: ['provenance', 'data-governance', 'traceability'], riskIds: ['mit-risk-2-1', 'mit-risk-3-1', 'mit-risk-3-2', 'mit-risk-4-3'],
    implementationExamples: ['Dataset and model lineage', 'Usage-rights review', 'Content provenance mechanisms'], evidenceExamples: ['Lineage records', 'Model and dataset cards', 'Licence and consent records'], sourceRefs: [nist('MAP 2 and MEASURE 2'), au('5.4 Data, model and system provenance'), mit('4.1 System Documentation')],
  },
  {
    id: 'third-party-assessment', code: 'ATC-08', name: 'Assess third parties and concentration', shortName: 'Third parties', familyId: 'understand-assess',
    objective: 'Assess provider capability, shared responsibilities, component provenance, concentration, change notification and exit options.',
    purpose: 'Make material dependencies and residual responsibility visible before adoption.', controlTypes: ['governance', 'preventive', 'detective'], lifecycleStages: ['Procurement', 'Integration', 'Operation', 'Exit'], roleArchetypes: ['Business owner', 'Procurement', 'Third-party risk'],
    conceptIds: ['third-party-risk', 'supply-chain', 'exitability', 'systemic-risk'], riskIds: ['mit-risk-2-2', 'mit-risk-6-1', 'mit-risk-6-4', 'mit-risk-7-3'],
    implementationExamples: ['AI-specific due diligence', 'Shared-responsibility matrix', 'Concentration and substitution analysis'], evidenceExamples: ['Due-diligence file', 'Contract clauses', 'Provider monitoring and exit plan'], sourceRefs: [nist('MANAGE 3'), au('1.2 Supply chain accountabilities'), mit('3.3 Access Management')],
  },
  {
    id: 'least-privilege-access', code: 'ATC-09', name: 'Enforce identity and least privilege', shortName: 'Least privilege', familyId: 'protect-constrain',
    objective: 'Authenticate human and machine identities and restrict data, model, tool and infrastructure access to the minimum required.',
    purpose: 'Limit unauthorised access, misuse and the blast radius of compromised users or agents.', controlTypes: ['preventive', 'detective'], lifecycleStages: ['Development', 'Deployment', 'Operation'], roleArchetypes: ['Security owner', 'Platform owner', 'Application owner'],
    conceptIds: ['access-control', 'tool-use', 'ai-security'], riskIds: ['mit-risk-2-1', 'mit-risk-2-2', 'mit-risk-4-2', 'mit-risk-7-2', 'mit-risk-7-6'],
    implementationExamples: ['Non-human identity management', 'Just-in-time privileged access', 'Tool and data permission allowlists'], evidenceExamples: ['Permission matrix', 'Access review results', 'Authentication and authorisation logs'], sourceRefs: [nist('GOVERN 1 and MANAGE 2'), au('5. Protect AI systems and data'), owasp('Access, identity and authorisation requirements'), csa('Control applicability and ownership metadata')],
  },
  {
    id: 'secure-ai-development', code: 'ATC-10', name: 'Secure AI development and supply chain', shortName: 'Secure development', familyId: 'protect-constrain',
    objective: 'Apply secure engineering, dependency integrity, secrets protection and change controls across the AI development pipeline.',
    purpose: 'Prevent exploitable weaknesses, tampering and untrusted components from entering production.', controlTypes: ['preventive', 'detective'], lifecycleStages: ['Acquisition', 'Development', 'Build', 'Release'], roleArchetypes: ['Engineering lead', 'Security engineering', 'Model provider'],
    conceptIds: ['ai-security', 'supply-chain', 'change-management', 'provenance'], riskIds: ['mit-risk-2-2', 'mit-risk-4-2', 'mit-risk-7-2', 'mit-risk-7-3'],
    implementationExamples: ['Secure development lifecycle', 'Model and package integrity checks', 'Protected secrets and build pipelines'], evidenceExamples: ['Threat model', 'Dependency inventory', 'Build attestations and security test results'], sourceRefs: [nist('GOVERN 1 and MANAGE 2'), sourceRef('nist-sp-800-218a', 'SSDF community profile', 'implementation-guidance'), owasp('Lifecycle and supply-chain verification requirements'), csa('Architectural and lifecycle relevance metadata')],
  },
  {
    id: 'privacy-data-protection', code: 'ATC-11', name: 'Protect privacy and sensitive information', shortName: 'Privacy protection', familyId: 'protect-constrain',
    objective: 'Limit collection, use, retention, inference and disclosure of personal, sensitive and confidential information.',
    purpose: 'Reduce privacy harm and information leakage across training, retrieval, prompts and outputs.', controlTypes: ['governance', 'preventive', 'detective', 'corrective'], lifecycleStages: ['Data acquisition', 'Development', 'Operation', 'Retirement'], roleArchetypes: ['Privacy owner', 'Data owner', 'Engineering team'],
    conceptIds: ['privacy', 'data-governance', 'ai-security', 'access-control'], riskIds: ['mit-risk-2-1', 'mit-risk-2-2'],
    implementationExamples: ['Data minimisation', 'Sensitive-data filtering', 'Privacy testing and leakage monitoring'], evidenceExamples: ['Privacy impact assessment', 'Data-flow map', 'Leakage test and monitoring results'], sourceRefs: [nist('MAP 2 and MEASURE 2'), au('5. Protect AI systems and data'), owasp('Data privacy and sensitive-information requirements')],
  },
  {
    id: 'agent-runtime-constraints', code: 'ATC-12', name: 'Bound agent authority and runtime action', shortName: 'Agent constraints', familyId: 'protect-constrain',
    objective: 'Define agent mandates and enforce runtime checks on tools, transactions, communications and high-impact actions.',
    purpose: 'Prevent autonomous systems from exceeding delegated authority or propagating unsafe actions.', controlTypes: ['governance', 'preventive', 'detective'], lifecycleStages: ['Design', 'Deployment', 'Operation'], roleArchetypes: ['Business owner', 'Agent platform owner', 'Security owner'],
    conceptIds: ['agent-authority', 'runtime-guardrails', 'tool-use', 'human-oversight'], riskIds: ['mit-risk-4-2', 'mit-risk-5-2', 'mit-risk-7-1', 'mit-risk-7-2', 'mit-risk-7-6'],
    implementationExamples: ['Machine-readable agent mandate', 'Approval for high-impact actions', 'Inter-agent message authentication'], evidenceExamples: ['Agent mandate register', 'Policy and tool configuration', 'Blocked-action and approval logs'], sourceRefs: [nist('MANAGE 2 and 4'), au('6. Maintain human control'), mit('2.3 Model Safety Engineering')],
  },
  {
    id: 'ai-notice-disclosure', code: 'ATC-13', name: 'Provide AI notice and disclosure', shortName: 'AI notice', familyId: 'inform-recourse',
    objective: 'Tell relevant people when AI is used and disclose material capabilities, limitations and generated-content status.',
    purpose: 'Support informed interaction and reduce deception or misplaced reliance.', controlTypes: ['governance', 'preventive'], lifecycleStages: ['Design', 'Deployment', 'Operation'], roleArchetypes: ['Business owner', 'Product owner', 'Communications or legal'],
    conceptIds: ['transparency-disclosure', 'provenance', 'human-rights'], riskIds: ['mit-risk-3-1', 'mit-risk-3-2', 'mit-risk-4-3', 'mit-risk-5-1'],
    implementationExamples: ['Contextual AI notices', 'Synthetic-content disclosure', 'Published capability and limitation statements'], evidenceExamples: ['Approved notices', 'Interface screenshots', 'Disclosure review records'], sourceRefs: [nist('GOVERN 1 and MAP 5'), au('4. Be clear about AI-generated content'), mit('4.2 Risk Disclosure')],
  },
  {
    id: 'explanation-limitations', code: 'ATC-14', name: 'Explain outcomes and limitations', shortName: 'Explanation', familyId: 'inform-recourse',
    objective: 'Provide context-appropriate information about how AI-influenced outcomes were produced and where the system may fail.',
    purpose: 'Enable understanding, appropriate reliance, review and challenge.', controlTypes: ['preventive', 'detective'], lifecycleStages: ['Design', 'Deployment', 'Operation'], roleArchetypes: ['Product owner', 'Model owner', 'Customer or stakeholder function'],
    conceptIds: ['explainability', 'transparency-disclosure', 'documentation'], riskIds: ['mit-risk-3-1', 'mit-risk-5-1', 'mit-risk-7-4'],
    implementationExamples: ['Audience-tested explanations', 'Known-limitations register', 'Decision trace summaries'], evidenceExamples: ['Explanation test results', 'Model or system cards', 'User research records'], sourceRefs: [nist('MEASURE 2'), au('4. Be clear about AI-generated content'), mit('4.1 System Documentation')],
  },
  {
    id: 'contestability-redress', code: 'ATC-15', name: 'Enable contestability and redress', shortName: 'Recourse', familyId: 'inform-recourse',
    objective: 'Provide accessible routes for people to question, correct, appeal and seek remedy for AI-influenced outcomes.',
    purpose: 'Preserve agency and support correction of consequential errors or unfair treatment.', controlTypes: ['governance', 'corrective'], lifecycleStages: ['Design', 'Deployment', 'Operation'], roleArchetypes: ['Business owner', 'Customer service', 'Complaints or legal'],
    conceptIds: ['contestability', 'human-rights', 'human-oversight'], riskIds: ['mit-risk-1-1', 'mit-risk-1-3', 'mit-risk-5-1', 'mit-risk-5-2'],
    implementationExamples: ['Human review pathway', 'Correction and appeal process', 'Accessible complaint channels'], evidenceExamples: ['Recourse procedure', 'Case records and outcomes', 'Accessibility testing'], sourceRefs: [nist('MAP 5 and MANAGE 4'), au('1.1 oversight of concerns and redress'), mit('4.4 Governance Disclosure')],
  },
  {
    id: 'records-traceability', code: 'ATC-16', name: 'Preserve records and traceability', shortName: 'Traceability', familyId: 'inform-recourse',
    objective: 'Retain sufficient versioned records to reconstruct material inputs, actions, decisions, approvals, changes and outcomes.',
    purpose: 'Support investigation, accountability, contestability and independent review.', controlTypes: ['governance', 'detective', 'corrective'], lifecycleStages: ['All lifecycle stages'], roleArchetypes: ['System owner', 'Records owner', 'Assurance function'],
    conceptIds: ['traceability', 'documentation', 'auditability', 'evidence-quality'], riskIds: ['mit-risk-3-1', 'mit-risk-4-3', 'mit-risk-6-5', 'mit-risk-7-4'],
    implementationExamples: ['Versioned decision logs', 'Model and prompt change records', 'Tamper-evident audit logging'], evidenceExamples: ['Audit logs', 'Change histories', 'Evidence retention schedule'], sourceRefs: [nist('GOVERN 1 and MEASURE 1'), au('Record governance decisions, testing, incidents and monitoring'), mit('4.1 System Documentation')],
  },
  {
    id: 'fit-for-purpose-evaluation', code: 'ATC-17', name: 'Evaluate fitness for purpose', shortName: 'Evaluation', familyId: 'test-monitor',
    objective: 'Test validity, reliability, safety and limitations under conditions representative of intended and foreseeable use.',
    purpose: 'Challenge claims before release and when context, models, data or behaviour changes.', controlTypes: ['detective', 'preventive'], lifecycleStages: ['Development', 'Pre-deployment', 'Change', 'Operation'], roleArchetypes: ['Model owner', 'Validation team', 'Business owner'],
    conceptIds: ['evaluation', 'reliability', 'materiality'], riskIds: ['mit-risk-1-3', 'mit-risk-3-1', 'mit-risk-7-3', 'mit-risk-7-4'],
    implementationExamples: ['Context-representative test sets', 'Acceptance criteria', 'Independent validation for material systems'], evidenceExamples: ['Evaluation plan', 'Results and limitations', 'Validation report and issue closure'], sourceRefs: [nist('MEASURE 1 and 2'), au('3. Assess impacts and risks'), mit('3.1 Testing & Auditing')],
  },
  {
    id: 'fairness-rights-testing', code: 'ATC-18', name: 'Test fairness and human impact', shortName: 'Fairness testing', familyId: 'test-monitor',
    objective: 'Evaluate differential performance, harmful bias, accessibility and foreseeable rights impacts for relevant groups and contexts.',
    purpose: 'Detect and address unjustified disparities and human impacts before and during use.', controlTypes: ['detective', 'corrective'], lifecycleStages: ['Development', 'Pre-deployment', 'Operation'], roleArchetypes: ['Model owner', 'Impact assessor', 'Affected-stakeholder adviser'],
    conceptIds: ['fairness-bias', 'human-rights', 'evaluation', 'impact-assessment'], riskIds: ['mit-risk-1-1', 'mit-risk-1-2', 'mit-risk-1-3', 'mit-risk-6-2'],
    implementationExamples: ['Subgroup performance testing', 'Qualitative stakeholder evaluation', 'Accessibility assessment'], evidenceExamples: ['Disaggregated metrics', 'Impact consultation record', 'Remediation and retest evidence'], sourceRefs: [nist('MEASURE 2'), au('3. Assess impacts and risks'), mit('3.1 Testing & Auditing')],
  },
  {
    id: 'adversarial-security-testing', code: 'ATC-19', name: 'Perform adversarial and security testing', shortName: 'Security testing', familyId: 'test-monitor',
    objective: 'Test AI systems and surrounding infrastructure against relevant adversarial, misuse and supply-chain scenarios.',
    purpose: 'Find exploitable weaknesses and unsafe behaviours before adversaries or failures do.', controlTypes: ['detective', 'preventive'], lifecycleStages: ['Development', 'Pre-deployment', 'Change', 'Operation'], roleArchetypes: ['Security testing', 'Red team', 'Engineering team'],
    conceptIds: ['red-teaming', 'adversarial-risk', 'ai-security', 'supply-chain'], riskIds: ['mit-risk-2-2', 'mit-risk-4-2', 'mit-risk-4-3', 'mit-risk-7-1', 'mit-risk-7-2', 'mit-risk-7-6'],
    implementationExamples: ['Threat-informed red teaming', 'Prompt and tool-abuse tests', 'Penetration and model-security tests'], evidenceExamples: ['Threat model', 'Test cases and results', 'Remediation and regression evidence'], sourceRefs: [nist('MEASURE 2 and MANAGE 4'), owasp('AISVS 1.0 verification requirements'), mit('3.1 Testing & Auditing')],
  },
  {
    id: 'runtime-monitoring', code: 'ATC-20', name: 'Monitor runtime behaviour and impact', shortName: 'Runtime monitoring', familyId: 'test-monitor',
    objective: 'Monitor performance, drift, misuse, incidents, human impact and control operation against defined thresholds.',
    purpose: 'Detect degradation and emerging risk quickly enough for meaningful response.', controlTypes: ['detective', 'corrective'], lifecycleStages: ['Deployment', 'Operation'], roleArchetypes: ['Operations owner', 'Model owner', 'Risk monitoring'],
    conceptIds: ['continuous-monitoring', 'reliability', 'incident-response', 'runtime-guardrails'], riskIds: ['mit-risk-1-2', 'mit-risk-3-2', 'mit-risk-6-6', 'mit-risk-7-1', 'mit-risk-7-3', 'mit-risk-7-6'],
    implementationExamples: ['Performance and drift thresholds', 'Abuse and anomaly detection', 'Stakeholder feedback channels'], evidenceExamples: ['Monitoring dashboards and logs', 'Threshold reviews', 'Alerts, investigations and actions'], sourceRefs: [nist('MANAGE 2 and 4'), au('3.5 ongoing monitoring and 6.1 oversight'), mit('3.5 Post-deployment Monitoring')],
  },
  {
    id: 'incident-response-reporting', code: 'ATC-21', name: 'Respond to and report incidents', shortName: 'Incident response', familyId: 'respond-retire',
    objective: 'Detect, triage, contain, investigate, remediate and report AI incidents and near misses through defined procedures.',
    purpose: 'Limit harm, meet notification expectations and turn failures into organisational learning.', controlTypes: ['detective', 'corrective', 'recovery'], lifecycleStages: ['Operation', 'Recovery'], roleArchetypes: ['Incident commander', 'Business owner', 'Legal or regulatory liaison'],
    conceptIds: ['incident-response', 'accountability', 'traceability'], riskIds: ['mit-risk-2-1', 'mit-risk-2-2', 'mit-risk-3-1', 'mit-risk-4-3', 'mit-risk-7-3', 'mit-risk-7-6'],
    implementationExamples: ['AI incident playbooks', 'Materiality and notification criteria', 'Near-miss learning process'], evidenceExamples: ['Incident records', 'Notification decisions', 'Post-incident review and actions'], sourceRefs: [nist('MANAGE 4'), au('Record incidents and monitoring'), mit('3.6 Incident Response & Recovery'), mit('4.3 Incident Reporting')],
  },
  {
    id: 'human-intervention-safe-stop', code: 'ATC-22', name: 'Enable human intervention and safe stop', shortName: 'Safe stop', familyId: 'respond-retire',
    objective: 'Provide trained people with usable mechanisms to pause, override, contain or transfer control when thresholds are breached.',
    purpose: 'Keep human authority meaningful when AI behaviour becomes unsafe or uncertain.', controlTypes: ['preventive', 'corrective', 'recovery'], lifecycleStages: ['Deployment', 'Operation', 'Recovery'], roleArchetypes: ['Business owner', 'Operator', 'Incident commander'],
    conceptIds: ['human-oversight', 'intervention', 'agent-authority'], riskIds: ['mit-risk-5-1', 'mit-risk-5-2', 'mit-risk-7-1', 'mit-risk-7-2', 'mit-risk-7-6'],
    implementationExamples: ['Manual override', 'Circuit breaker', 'Transfer to safe human process'], evidenceExamples: ['Intervention design', 'Authority and training records', 'Safe-stop drill results'], sourceRefs: [nist('MANAGE 1 and 4'), au('6. Maintain human control'), mit('3.6 Incident Response & Recovery')],
  },
  {
    id: 'resilience-rollback-continuity', code: 'ATC-23', name: 'Provide resilience, rollback and continuity', shortName: 'Resilience', familyId: 'respond-retire',
    objective: 'Maintain fallback, rollback, recovery and continuity options proportionate to the criticality and dependencies of the AI service.',
    purpose: 'Contain cascading failures and restore safe service without relying on the failed AI component.', controlTypes: ['preventive', 'corrective', 'recovery'], lifecycleStages: ['Design', 'Deployment', 'Operation', 'Recovery'], roleArchetypes: ['Service owner', 'Resilience owner', 'Technology operations'],
    conceptIds: ['operational-resilience', 'intervention', 'exitability', 'third-party-risk'], riskIds: ['mit-risk-2-2', 'mit-risk-7-1', 'mit-risk-7-3', 'mit-risk-7-6'],
    implementationExamples: ['Fallback process', 'Version rollback', 'Dependency isolation and continuity exercise'], evidenceExamples: ['Recovery design', 'Exercise results', 'Recovery objectives and actuals'], sourceRefs: [nist('MANAGE 2 and 4'), au('6.2 Decommission when appropriate'), mit('3.6 Incident Response & Recovery')],
  },
  {
    id: 'change-release-retirement', code: 'ATC-24', name: 'Govern change, release and retirement', shortName: 'Change and retire', familyId: 'respond-retire',
    objective: 'Reassess, approve, record and test material changes, and retire AI systems safely when they are no longer acceptable or needed.',
    purpose: 'Prevent silent scope drift and unmanaged persistence of obsolete, unsafe or unsupported systems.', controlTypes: ['governance', 'preventive', 'corrective', 'recovery'], lifecycleStages: ['Change', 'Release', 'Retirement'], roleArchetypes: ['Change authority', 'Business owner', 'Technology owner'],
    conceptIds: ['change-management', 'lifecycle-governance', 'exitability', 'documentation'], riskIds: ['mit-risk-6-4', 'mit-risk-6-5', 'mit-risk-7-1', 'mit-risk-7-3'],
    implementationExamples: ['Material-change criteria', 'Revalidation before release', 'Retirement, data disposition and provider exit'], evidenceExamples: ['Change approvals', 'Regression and revalidation results', 'Retirement and data-disposition record'], sourceRefs: [nist('GOVERN 1 and MANAGE 4'), au('6.2 Decommission when appropriate'), mit('3.4 Staged Deployment')],
  },
]

export const controlFamilyById = new Map(controlFamilies.map((family) => [family.id, family]))
export const controlObjectiveById = new Map(controlObjectives.map((control) => [control.id, control]))

export const controlsForRisk = (riskId: string, limit = 8) => controlObjectives.filter((control) => control.riskIds.includes(riskId)).slice(0, limit)
export const controlsForConcept = (conceptId: string, limit = 8) => controlObjectives.filter((control) => control.conceptIds.includes(conceptId)).slice(0, limit)
