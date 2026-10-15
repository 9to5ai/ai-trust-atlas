import { makeInstrument } from './makeInstrument'
import type { SourceProvision } from '../types'

export const FSB_FINAL_URL = 'https://www.fsb.org/uploads/P151026-1.pdf'
export const FSB_FINAL_PAGE = 'https://www.fsb.org/2026/10/sound-practices-for-responsible-adoption-of-artificial-intelligence-ai-final-report/'
const reviewed = '2026-10-15'
const note = 'Final report reviewed 15 October 2026. Original Atlas synopsis; concept and control connections are Atlas interpretations. These are proportionate, non-binding practices, not compliance criteria.'
const practice = (number: number, section: string, pages: string, page: number, title: string, summary: string, conceptIds: string[], qualification?: string): SourceProvision => ({
  id: `fsb-sound-practice-${number}`, ref: `Sound Practice ${number} · section ${section}, pp. ${pages}`, title, summary, conceptIds,
  granularity: 'practice', sourceUrl: `${FSB_FINAL_URL}#page=${page}`, reviewedAt: reviewed, editorialStatus: 'reviewed',
  note: qualification ? `${note} ${qualification}` : note,
})

export const fsbFinal = makeInstrument({
  id: 'fsb-ai-sound-practices', title: 'Sound Practices for Responsible Adoption of Artificial Intelligence (AI) — Final Report', shortTitle: 'FSB AI Sound Practices',
  issuer: 'Financial Stability Board', jurisdiction: 'Global financial sector', region: 'Global', authorityClass: 'policy-guidance',
  authorityNote: 'Final, non-binding sound practices; not an international standard', status: 'active', published: reviewed, lastVerified: reviewed,
  officialUrl: FSB_FINAL_URL,
  summary: 'Twelve final practices connect organisation-wide AI governance with lifecycle risk management, including additional considerations for generative, agentic and third-party AI.',
  applicability: 'A proportionate toolkit for financial institutions of different sizes and business models. It does not create legal duties or replace local requirements. Agentic and multi-agent practices remain emerging; the response note says the additional agentic considerations were not fully consulted on. Case studies illustrate reported experience, not independently verified outcomes or benchmarks.',
  sectors: ['Financial services'], detailAvailability: 'full-public-text', editorialStatus: 'reviewed',
  conceptIds: ['accountability', 'decision-rights', 'competence', 'inventory', 'materiality', 'lifecycle-governance', 'risk-treatment', 'data-governance', 'explainability', 'transparency-disclosure', 'evaluation', 'continuous-monitoring', 'human-oversight', 'agent-authority', 'runtime-guardrails', 'access-control', 'traceability', 'ai-security', 'third-party-risk', 'operational-resilience', 'exitability'],
  provisions: [
    // Retain the existing identifier so saved source-section links still work.
    { id: 'fsb-proposed-practices', ref: 'Final report overview · pp. 1–5; annex p. 65', title: 'Governance and lifecycle adoption', summary: 'Four governance practices and eight lifecycle practices provide a proportionate approach from AI strategy to retirement.', conceptIds: ['accountability', 'materiality', 'lifecycle-governance', 'third-party-risk', 'agent-authority'], sourceUrl: `${FSB_FINAL_URL}#page=5`, reviewedAt: reviewed, editorialStatus: 'reviewed', note },
    practice(1, '2.1', '20–22', 24, 'Strategy and risk appetite', 'Align AI choices, oversight and resources with strategy and risk appetite; reassess decisions to adopt or defer AI.', ['accountability', 'decision-rights', 'materiality', 'competence']),
    practice(2, '2.2', '22–24', 26, 'Accountability and independent challenge', 'Define ownership and coordination across functions, with objective challenge independent of development and business use.', ['accountability', 'decision-rights', 'assurance']),
    practice(3, '2.3', '24–27', 28, 'Risk frameworks and lifecycle records', 'Integrate AI into risk frameworks and retain protected lifecycle records. Attribute agent actions to identities, permissions and human oversight.', ['inventory', 'risk-treatment', 'documentation', 'traceability', 'agent-authority']),
    practice(4, '2.4', '27–30', 31, 'Learning and retained expertise', 'Adapt governance using incidents and external developments; maintain human judgement, expertise and the ability to challenge AI.', ['competence', 'lifecycle-governance', 'continuous-monitoring', 'human-oversight']),
    practice(5, '3.2', '31–33', 35, 'Materiality and risk', 'Assess materiality separately from risk and reassess as use changes. Evaluate combined agent permissions, not just each permission in isolation.', ['materiality', 'impact-assessment', 'risk-treatment', 'agent-authority', 'access-control']),
    practice(6, '3.3', '33–35', 37, 'Technology selection', 'Choose AI, simpler alternatives or non-adoption against business needs, risks, capabilities, dependencies and total costs.', ['materiality', 'lifecycle-governance', 'third-party-risk', 'change-management']),
    practice(7, '3.4', '35–37', 39, 'Data governance and agent context', 'Manage data quality, provenance, access and retention. Separate agent goals, permissions and rules from the data agents consume.', ['data-governance', 'provenance', 'privacy', 'access-control', 'agent-authority']),
    practice(8, '3.5', '38–43', 42, 'Explainability and transparency', 'Tailor explanations and disclosures to stakeholders. Assess explainability limits and compensating controls; consider alternatives when residual risk exceeds appetite.', ['explainability', 'transparency-disclosure', 'risk-treatment', 'contestability'], 'Page 40, footnote 69: generated reasoning may be incomplete or inaccurate and is not an authoritative record of model behaviour without additional validation.'),
    practice(9, '3.6', '43–49', 47, 'Performance and workflow evaluation', 'Use proportionate testing, independent assessment and monitoring. Evaluate agent workflows and intermediate actions, alongside final outcomes.', ['evaluation', 'reliability', 'continuous-monitoring', 'agent-authority', 'traceability']),
    practice(10, '3.7', '49–55', 53, 'Human oversight and technical limits', 'Pair meaningful human authority with technical limits, tested intervention and safe stopping. Govern sub-agents and their orchestration.', ['human-oversight', 'decision-rights', 'runtime-guardrails', 'agent-authority', 'operational-resilience']),
    practice(11, '3.8', '55–60', 59, 'Cyber resilience and least agency', 'Adapt cyber controls, scenarios and information sharing to AI threats. Apply agent identity, least privilege and action-level authorisation.', ['ai-security', 'access-control', 'incident-response', 'evaluation', 'agent-authority']),
    practice(12, '3.9', '60–64', 64, 'Suppliers, concentration and exit', 'Assess embedded AI and supply-chain dependencies; obtain proportionate information, contract protections and continuity or exit options.', ['third-party-risk', 'supply-chain', 'operational-resilience', 'exitability', 'evidence-quality'], 'Certification can support due diligence but is not sufficient on its own; assess compensating controls or avoid the supplier where risks remain outside appetite (p. 62).'),
  ],
})
