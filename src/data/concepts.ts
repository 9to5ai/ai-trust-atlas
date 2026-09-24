import type { Concept, ConceptDomain } from '../types.js'

export const domains: ConceptDomain[] = [
  { id: 'governance', name: 'Governance and accountability', shortName: 'Governance', question: 'Who owns the outcome and the decision?', definition: 'Accountability, senior accountability, decision rights, AI policy and risk appetite, inventory and competence.', color: '#f0a46b', role: 'governance-capability', navigationFamily: 'decide-and-govern' },
  { id: 'risk', name: 'Risk and impact', shortName: 'Risk', question: 'What could undermine trust, and for whom?', definition: 'Context, materiality, impact assessment, model risk management and risk treatment.', color: '#df83a7', role: 'governance-capability', navigationFamily: 'decide-and-govern' },
  { id: 'lifecycle', name: 'Lifecycle and change', shortName: 'Lifecycle', question: 'How is risk governed as the system changes?', definition: 'Use-case intake and approval, lifecycle governance, change management and documentation.', color: '#c39af3', role: 'governance-capability', navigationFamily: 'decide-and-govern' },
  { id: 'data', name: 'Data and privacy', shortName: 'Data', question: 'Can the information foundation be trusted?', definition: 'Data governance, privacy, data provenance and lineage, and intellectual property.', color: '#7db9f5', role: 'trust-outcome', navigationFamily: 'protect-people-and-information' },
  { id: 'transparency', name: 'Transparency and contestability', shortName: 'Transparency', question: 'Can people understand, challenge and contest?', definition: 'Disclosure, content authenticity, explanation and routes to challenge outcomes.', color: '#8ad7d0', role: 'trust-outcome', navigationFamily: 'protect-people-and-information' },
  { id: 'fairness', name: 'Fairness and societal impact', shortName: 'Fairness', question: 'Are people and society treated fairly?', definition: 'Bias, discrimination, consumer outcomes, human rights, content safety, workforce and environmental impact.', color: '#e4c96f', role: 'trust-outcome', navigationFamily: 'protect-people-and-information' },
  { id: 'security', name: 'AI security', shortName: 'Security', question: 'Can misuse and attack be prevented or contained?', definition: 'Cybersecurity of AI, adversarial threats, identity, permissions, prompt security and system integrity.', color: '#ef7373', role: 'trust-outcome', navigationFamily: 'build-and-operate-safely' },
  { id: 'resilience', name: 'Reliability and resilience', shortName: 'Resilience', question: 'Will the system behave and recover as intended?', definition: 'Validity, reliability, operational resilience, incident response and systemic stability.', color: '#76cf93', role: 'trust-outcome', navigationFamily: 'build-and-operate-safely' },
  { id: 'third-party', name: 'Third-party and supply chain', shortName: 'Third party', question: 'Where do dependencies concentrate risk?', definition: 'Provider risk, supply-chain integrity, concentration, contracts, monitoring and exitability.', color: '#9eb6ca', role: 'governance-capability', navigationFamily: 'build-and-operate-safely' },
  { id: 'testing', name: 'Testing and evaluation', shortName: 'Testing', question: 'How are claims challenged?', definition: 'Evaluation, validation, red teaming, scenario testing, monitoring and limitations analysis.', color: '#74b9a2', role: 'governance-capability', navigationFamily: 'verify-and-assure' },
  { id: 'evidence', name: 'Evidence and assurance', shortName: 'Evidence', question: 'What evidence supports the claim?', definition: 'Evidence quality, traceability, auditability and independent assurance.', color: '#b8a8ff', role: 'governance-capability', navigationFamily: 'verify-and-assure' },
  { id: 'agentic', name: 'Human oversight and agent control', shortName: 'Oversight', question: 'Who can see, steer and stop the system?', definition: 'Meaningful human oversight, agent mandates, tool access, runtime guardrails, intervention and safe stop.', color: '#64c5e8', role: 'governance-capability', navigationFamily: 'build-and-operate-safely' },
]

/*
 * Concepts sit on two axes: trust objectives (what trustworthy AI achieves) and
 * governance capabilities (what an organisation does to get there). Controls and
 * risks live in their own layers (controls.ts, mitRiskTaxonomy.ts).
 * Retired concept IDs redirect through `conceptAliases`.
 */
const conceptDefinitions: Concept[] = [
  { id: 'accountability', name: 'Accountability', domainId: 'governance', role: 'governance-capability', definition: 'Named ownership for AI outcomes, controls and decisions.' },
  { id: 'senior-accountability', name: 'Senior accountability', domainId: 'governance', role: 'governance-capability', definition: 'Individual accountability of directors and senior executives for AI outcomes under board duties and accountability regimes such as FAR and SMCR.' },
  { id: 'decision-rights', name: 'Decision rights', domainId: 'governance', role: 'governance-capability', definition: 'Explicit authority for approval, exception, escalation and risk acceptance.' },
  { id: 'ai-policy-appetite', name: 'AI policy and risk appetite', domainId: 'governance', role: 'governance-capability', definition: 'Board-approved policy, principles and risk appetite that set the bounds of acceptable AI use.' },
  { id: 'inventory', name: 'AI inventory', domainId: 'governance', role: 'governance-capability', definition: 'A current record of AI systems, purposes, owners, dependencies and status.' },
  { id: 'competence', name: 'Competence and culture', domainId: 'governance', role: 'governance-capability', definition: 'Skills, incentives and awareness needed to govern AI responsibly.' },
  { id: 'materiality', name: 'Materiality and context', domainId: 'risk', role: 'governance-capability', definition: 'The significance of an AI use given purpose, stakeholders and potential harm.' },
  { id: 'impact-assessment', name: 'Impact assessment', domainId: 'risk', role: 'governance-capability', definition: 'Structured assessment of foreseeable impacts on people, organisations and society.' },
  { id: 'model-risk', name: 'Model risk management', domainId: 'risk', role: 'governance-capability', definition: 'Development standards, independent validation, performance monitoring and a model inventory, scaled to model risk, as prudential supervisors expect.' },
  { id: 'risk-treatment', name: 'Risk treatment', domainId: 'risk', role: 'governance-capability', definition: 'Selection and ownership of controls, restrictions, acceptance or avoidance.' },
  { id: 'use-case-intake', name: 'Use-case intake and approval', domainId: 'lifecycle', role: 'governance-capability', definition: 'Triage, risk rating, approval and registration of proposed AI uses before they are built or bought.' },
  { id: 'lifecycle-governance', name: 'Lifecycle governance', domainId: 'lifecycle', role: 'governance-capability', definition: 'Risk governance from conception through retirement.' },
  { id: 'change-management', name: 'Change management', domainId: 'lifecycle', role: 'governance-capability', definition: 'Controlled reassessment when models, data, prompts, tools or use change.' },
  { id: 'documentation', name: 'Technical documentation', domainId: 'lifecycle', role: 'governance-capability', definition: 'Versioned records of system design, purpose, limitations and operation.' },
  { id: 'data-governance', name: 'Data governance', domainId: 'data', role: 'governance-capability', definition: 'Accountable management of data quality, access, lineage and use.' },
  { id: 'privacy', name: 'Privacy and data protection', domainId: 'data', role: 'trust-objective', definition: 'Lawful, fair and secure handling of personal information.' },
  { id: 'provenance', name: 'Data provenance and lineage', domainId: 'data', role: 'trust-objective', definition: 'Traceable origin, transformation and custody of the data and components an AI system relies on.' },
  { id: 'intellectual-property', name: 'Intellectual property', domainId: 'data', role: 'trust-objective', definition: 'Respect for copyright, licences and other rights in training data, inputs and outputs.' },
  { id: 'transparency-disclosure', name: 'Transparency and disclosure', domainId: 'transparency', role: 'trust-objective', definition: 'Clear notice about AI use, system capability and limitations.' },
  { id: 'content-authenticity', name: 'Content authenticity', domainId: 'transparency', role: 'trust-objective', definition: 'Labelling, watermarking and provenance of AI-generated or manipulated content, including deepfakes.', aliases: ['deepfakes', 'synthetic content', 'watermarking'] },
  { id: 'explainability', name: 'Explainability', domainId: 'transparency', role: 'trust-objective', definition: 'Context-appropriate reasons and information that support understanding and challenge.' },
  { id: 'contestability', name: 'Contestability and redress', domainId: 'transparency', role: 'trust-objective', definition: 'Practical routes to question, appeal and remedy AI-influenced outcomes.' },
  { id: 'fairness-bias', name: 'Fairness and harmful bias', domainId: 'fairness', role: 'trust-objective', definition: 'Identification, evaluation and management of unjustified differential outcomes.' },
  { id: 'consumer-outcomes', name: 'Consumer outcomes', domainId: 'fairness', role: 'trust-objective', definition: 'Fair treatment, suitability and good outcomes for customers, including customers experiencing vulnerability.', aliases: ['conduct', 'consumer duty', 'fair treatment'] },
  { id: 'human-rights', name: 'Human rights and wellbeing', domainId: 'fairness', role: 'trust-objective', definition: 'Protection of rights, dignity and social wellbeing.' },
  { id: 'content-safety', name: 'Content safety', domainId: 'fairness', role: 'trust-objective', definition: 'Preventing toxic, abusive, self-harm or otherwise unsafe outputs and interactions.' },
  { id: 'workforce-impact', name: 'Workforce impact', domainId: 'fairness', role: 'trust-objective', definition: 'Effects of AI on jobs, skills, job quality and worker consultation.' },
  { id: 'environmental-impact', name: 'Environmental impact', domainId: 'fairness', role: 'trust-objective', definition: 'Energy, water and emissions from training and running AI, measured and managed.' },
  { id: 'ai-security', name: 'AI security', domainId: 'security', role: 'trust-objective', definition: 'Protection of models, data, prompts, tools and infrastructure from attacks such as evasion, poisoning, extraction and prompt injection.' },
  { id: 'secure-development', name: 'Secure AI development', domainId: 'security', role: 'governance-capability', definition: 'Security built into AI design, development and deployment: threat modelling, secure coding, dependency and secret management, and hardened deployment.' },
  { id: 'access-control', name: 'Identity and access control', domainId: 'security', role: 'governance-capability', definition: 'Least-privilege access for people, services and AI agents.' },
  { id: 'reliability', name: 'Validity and reliability', domainId: 'resilience', role: 'trust-objective', definition: 'Performance that is fit for purpose across intended conditions.' },
  { id: 'operational-resilience', name: 'Operational resilience', domainId: 'resilience', role: 'trust-objective', definition: 'Ability to maintain critical operations through disruption and recover safely.' },
  { id: 'incident-response', name: 'Incident response and recovery', domainId: 'resilience', role: 'governance-capability', definition: 'Detection, containment, reporting, remediation and learning after failure.' },
  { id: 'systemic-risk', name: 'Systemic stability', domainId: 'resilience', role: 'trust-objective', definition: 'Avoiding correlated failures and concentration in shared models, data or providers that could impair markets, the financial system or critical services.' },
  { id: 'third-party-risk', name: 'Third-party risk', domainId: 'third-party', role: 'governance-capability', definition: 'Governance of providers, dependencies, contracts, assurance and ongoing performance.' },
  { id: 'supply-chain', name: 'AI supply-chain integrity', domainId: 'third-party', role: 'governance-capability', definition: 'Security and provenance across models, components, datasets and deployment services.' },
  { id: 'exitability', name: 'Exitability', domainId: 'third-party', role: 'governance-capability', definition: 'Ability to migrate, substitute or safely discontinue a provider or component.' },
  { id: 'evaluation', name: 'Evaluation and validation', domainId: 'testing', role: 'governance-capability', definition: 'Testing claims against context-specific performance, safety and risk criteria.' },
  { id: 'red-teaming', name: 'Red teaming', domainId: 'testing', role: 'governance-capability', definition: 'Adversarial testing to discover harmful behaviours, vulnerabilities and control weaknesses.' },
  { id: 'continuous-monitoring', name: 'Continuous monitoring', domainId: 'testing', role: 'governance-capability', definition: 'Ongoing observation of performance, drift, incidents and control operation.' },
  { id: 'evidence-quality', name: 'Evidence quality and sufficiency', domainId: 'evidence', role: 'governance-capability', definition: 'Assessment of provenance, scope, integrity, timeliness and limitations of evidence.' },
  { id: 'traceability', name: 'Traceability', domainId: 'evidence', role: 'governance-capability', definition: 'Reconstruction of inputs, versions, actions, decisions and outcomes.' },
  { id: 'auditability', name: 'Auditability', domainId: 'evidence', role: 'governance-capability', definition: 'Ability to independently inspect and reconstruct the system and its governance.' },
  { id: 'assurance', name: 'Independent assurance', domainId: 'evidence', role: 'governance-capability', definition: 'A scoped conclusion formed by an authorised, sufficiently independent human assessor.' },
  { id: 'human-oversight', name: 'Human oversight and intervention', domainId: 'agentic', role: 'governance-capability', definition: 'Meaningful human capacity to understand, intervene, pause, override, roll back and decide.' },
  { id: 'agent-authority', name: 'Agent authority and tool access', domainId: 'agentic', role: 'governance-capability', definition: 'Explicit boundaries on what an agent may read, decide, execute or transmit, and the tools and credentials it holds.' },
  { id: 'runtime-guardrails', name: 'Runtime guardrails', domainId: 'agentic', role: 'governance-capability', definition: 'Enforceable checks that approve, block, constrain or escalate proposed outputs and actions.' },
]

export const concepts: Concept[] = conceptDefinitions

/* Concepts retired in the September 2026 ontology review, and the concept that absorbed each. */
export const conceptAliases: Record<string, string> = {
  'adversarial-risk': 'ai-security',
  'tool-use': 'agent-authority',
  intervention: 'human-oversight',
}

export const domainById = new Map(domains.map((domain) => [domain.id, domain]))
export const conceptById = new Map(concepts.map((concept) => [concept.id, concept]))
