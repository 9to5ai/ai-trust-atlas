import type { Instrument } from '../types'
import { australianInstruments } from './australia'
import { globalInstruments } from './global'
import { standardsAndTestingInstruments } from './standards'

const verified = '2026-08-28'

const coreInstruments: Instrument[] = [
  {
    id: 'au-privacy-act', title: 'Privacy Act 1988', shortTitle: 'Privacy Act', issuer: 'Australian Parliament', jurisdiction: 'Australia', region: 'Australia', authorityClass: 'law', status: 'in-force', published: '1988', lastVerified: verified,
    officialUrl: 'https://www.legislation.gov.au/C2004A03712/latest/text',
    summary: 'Australia\'s principal federal privacy law, including the Australian Privacy Principles governing personal information.',
    applicability: 'Applies according to the Act\'s coverage and exemptions. AI use does not displace existing privacy obligations.', sectors: ['Cross-sector', 'Financial services'],
    conceptIds: ['privacy', 'data-governance', 'transparency-disclosure', 'accountability', 'third-party-risk'], detailAvailability: 'full-public-text',
    provisions: [
      { id: 'au-privacy-app', ref: 'Schedule 1', title: 'Australian Privacy Principles', summary: 'Principles governing collection, use, disclosure, quality, security and access to personal information.', conceptIds: ['privacy', 'data-governance', 'transparency-disclosure'] },
      { id: 'au-privacy-app11', ref: 'APP 11', title: 'Security of personal information', summary: 'Requires reasonable steps to protect personal information and address information no longer needed.', conceptIds: ['privacy', 'ai-security', 'incident-response'] },
    ],
  },
  {
    id: 'apra-ai-letter-2026', title: 'Letter to Industry on Artificial Intelligence', shortTitle: 'APRA AI Letter', issuer: 'Australian Prudential Regulation Authority', jurisdiction: 'Australia - APRA-regulated entities', region: 'Australia', authorityClass: 'regulatory-expectation', status: 'active', published: '2026-04-30', lastVerified: verified,
    officialUrl: 'https://www.apra.gov.au/news-and-publications/apra-letter-industry-artificial-intelligence-ai',
    summary: 'Sets APRA\'s supervisory focus on safe AI adoption, governance, risk management, cyber security and operational resilience.',
    applicability: 'Relevant to APRA-regulated entities. It communicates supervisory expectations rather than creating a standalone AI prudential standard.', sectors: ['Banking', 'Insurance', 'Superannuation'],
    conceptIds: ['accountability', 'inventory', 'materiality', 'lifecycle-governance', 'ai-security', 'operational-resilience', 'third-party-risk', 'human-oversight', 'agent-authority'], detailAvailability: 'full-public-text',
    provisions: [
      { id: 'apra-ai-governance', ref: 'Governance', title: 'Business-owned AI governance', summary: 'Boards and senior management should understand material AI use and retain clear accountability.', conceptIds: ['accountability', 'inventory', 'decision-rights'] },
      { id: 'apra-ai-agentic', ref: 'Agentic AI', title: 'Autonomous and agentic workflows', summary: 'Agent authority, non-human identity, access and resilience require explicit control.', conceptIds: ['agent-authority', 'access-control', 'runtime-guardrails', 'operational-resilience'] },
    ],
  },
  {
    id: 'apra-cps-230', title: 'CPS 230 Operational Risk Management', shortTitle: 'APRA CPS 230', issuer: 'Australian Prudential Regulation Authority', jurisdiction: 'Australia - APRA-regulated entities', region: 'Australia', authorityClass: 'regulatory-expectation', status: 'in-force', published: '2023-07', effective: '2025-07-01', lastVerified: verified,
    officialUrl: 'https://handbook.apra.gov.au/standard/cps-230',
    summary: 'Prudential standard for operational risk, business continuity and service-provider management.', applicability: 'Binding prudential standard for covered APRA-regulated entities.', sectors: ['Banking', 'Insurance', 'Superannuation'],
    conceptIds: ['accountability', 'operational-resilience', 'incident-response', 'third-party-risk', 'exitability', 'continuous-monitoring'], detailAvailability: 'full-public-text',
    provisions: [
      { id: 'cps230-operational-risk', ref: 'Operational risk management', title: 'Operational risk framework', summary: 'Requires an operational-risk framework supported by controls, monitoring and remediation.', conceptIds: ['risk-treatment', 'continuous-monitoring', 'accountability'] },
      { id: 'cps230-provider', ref: 'Service provider management', title: 'Material service providers', summary: 'Requires identification, agreements, monitoring and management of material service providers.', conceptIds: ['third-party-risk', 'exitability', 'operational-resilience'] },
    ],
  },
  {
    id: 'apra-cps-234', title: 'CPS 234 Information Security', shortTitle: 'APRA CPS 234', issuer: 'Australian Prudential Regulation Authority', jurisdiction: 'Australia - APRA-regulated entities', region: 'Australia', authorityClass: 'regulatory-expectation', status: 'in-force', published: '2019', lastVerified: verified,
    officialUrl: 'https://handbook.apra.gov.au/standard/cps-234',
    summary: 'Prudential standard requiring information-security capability, controls, incident notification and testing.', applicability: 'Binding prudential standard for covered APRA-regulated entities.', sectors: ['Banking', 'Insurance', 'Superannuation'],
    conceptIds: ['accountability', 'ai-security', 'access-control', 'third-party-risk', 'incident-response', 'evaluation', 'assurance'], detailAvailability: 'full-public-text',
    provisions: [
      { id: 'cps234-controls', ref: 'Information security controls', title: 'Controls and systematic testing', summary: 'Controls should be commensurate with threats and tested through a systematic program.', conceptIds: ['ai-security', 'evaluation', 'evidence-quality'] },
      { id: 'cps234-incidents', ref: 'Notification', title: 'Information-security incidents', summary: 'Material incidents and control weaknesses trigger notification requirements.', conceptIds: ['incident-response', 'accountability', 'traceability'] },
    ],
  },
  {
    id: 'eu-ai-act', title: 'Regulation (EU) 2024/1689 - Artificial Intelligence Act', shortTitle: 'EU AI Act', issuer: 'European Union', jurisdiction: 'European Union', region: 'Europe', authorityClass: 'law', status: 'phased', published: '2024-07-12', effective: '2024-08-01', lastVerified: verified,
    officialUrl: 'https://eur-lex.europa.eu/eli/reg/2024/1689/oj/eng',
    summary: 'Risk-based legal framework for AI systems and general-purpose AI models, with phased obligations and enforcement.', applicability: 'Applies based on provider, deployer, product, location and market criteria. Legal advice is needed for specific scope.', sectors: ['Cross-sector', 'Financial services'],
    conceptIds: ['materiality', 'inventory', 'lifecycle-governance', 'documentation', 'data-governance', 'transparency-disclosure', 'human-oversight', 'evaluation', 'continuous-monitoring', 'incident-response'], detailAvailability: 'full-public-text',
    provisions: [
      { id: 'eu-ai-act-9', ref: 'Article 9', title: 'Risk management system', summary: 'Requires an iterative lifecycle risk-management system for high-risk AI systems.', conceptIds: ['lifecycle-governance', 'impact-assessment', 'risk-treatment', 'continuous-monitoring'] },
      { id: 'eu-ai-act-14', ref: 'Article 14', title: 'Human oversight', summary: 'High-risk systems must support effective oversight by appropriately competent people.', conceptIds: ['human-oversight', 'intervention', 'competence'] },
      { id: 'eu-ai-act-15', ref: 'Article 15', title: 'Accuracy, robustness and cybersecurity', summary: 'High-risk systems must achieve appropriate accuracy, robustness and cybersecurity throughout the lifecycle.', conceptIds: ['reliability', 'ai-security', 'operational-resilience'] },
    ],
  },
  {
    id: 'nist-ai-rmf', title: 'Artificial Intelligence Risk Management Framework 1.0', shortTitle: 'NIST AI RMF', issuer: 'National Institute of Standards and Technology', jurisdiction: 'United States - voluntary global reference', region: 'United States', authorityClass: 'risk-framework', status: 'voluntary', published: '2023-01', lastVerified: verified,
    officialUrl: 'https://www.nist.gov/itl/ai-risk-management-framework',
    summary: 'Voluntary framework organising AI risk work through Govern, Map, Measure and Manage.', applicability: 'Voluntary and non-sector-specific. It does not certify compliance or operating effectiveness.', sectors: ['Cross-sector'],
    conceptIds: ['accountability', 'materiality', 'impact-assessment', 'lifecycle-governance', 'evaluation', 'continuous-monitoring', 'risk-treatment', 'human-oversight'], detailAvailability: 'full-public-text',
    provisions: [
      { id: 'nist-rmf-govern', ref: 'GOVERN', title: 'Govern', summary: 'Cultivates risk culture, accountability, policies and lifecycle governance.', conceptIds: ['accountability', 'decision-rights', 'competence', 'lifecycle-governance'] },
      { id: 'nist-rmf-map', ref: 'MAP', title: 'Map', summary: 'Establishes context and identifies impacts and risks for affected people and systems.', conceptIds: ['materiality', 'impact-assessment', 'human-rights'] },
      { id: 'nist-rmf-measure', ref: 'MEASURE', title: 'Measure', summary: 'Assesses, analyses and tracks AI risk using appropriate methods and metrics.', conceptIds: ['evaluation', 'fairness-bias', 'reliability', 'continuous-monitoring'] },
      { id: 'nist-rmf-manage', ref: 'MANAGE', title: 'Manage', summary: 'Prioritises and treats risks while monitoring the effectiveness of responses.', conceptIds: ['risk-treatment', 'incident-response', 'continuous-monitoring'] },
    ],
  },
  {
    id: 'nist-genai-profile', title: 'Artificial Intelligence Risk Management Framework: Generative Artificial Intelligence Profile', shortTitle: 'NIST GenAI Profile', issuer: 'National Institute of Standards and Technology', jurisdiction: 'United States - voluntary global reference', region: 'United States', authorityClass: 'risk-framework', status: 'voluntary', published: '2024-07', lastVerified: verified,
    officialUrl: 'https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence',
    summary: 'Companion profile describing generative-AI risks and actions aligned to the NIST AI RMF.', applicability: 'Voluntary profile for generative-AI risk management.', sectors: ['Cross-sector'],
    conceptIds: ['provenance', 'transparency-disclosure', 'adversarial-risk', 'evaluation', 'human-oversight', 'third-party-risk', 'incident-response'], detailAvailability: 'full-public-text',
    provisions: [
      { id: 'nist-genai-risks', ref: 'Section 2', title: 'Generative-AI risk profile', summary: 'Describes risks including confabulation, information integrity, privacy, bias, security and ecosystem effects.', conceptIds: ['reliability', 'provenance', 'privacy', 'fairness-bias', 'adversarial-risk', 'systemic-risk'] },
    ],
  },
  {
    id: 'iso-42001', title: 'ISO/IEC 42001:2023 Artificial intelligence management system', shortTitle: 'ISO/IEC 42001', issuer: 'ISO and IEC', jurisdiction: 'International', region: 'Global', authorityClass: 'international-standard', status: 'active', published: '2023-12', lastVerified: verified,
    officialUrl: 'https://www.iso.org/standard/42001',
    summary: 'Requirements for establishing, implementing, maintaining and continually improving an AI management system.', applicability: 'Voluntary international management-system standard unless adopted by contract, policy or law. Full text is licensed.', sectors: ['Cross-sector'],
    conceptIds: ['accountability', 'inventory', 'materiality', 'lifecycle-governance', 'risk-treatment', 'competence', 'continuous-monitoring', 'assurance'], detailAvailability: 'licensed-standard',
    provisions: [
      { id: 'iso42001-context', ref: 'Clause 4', title: 'Context of the organisation', summary: 'Defines organisational context, interested parties and the management-system scope.', conceptIds: ['materiality', 'accountability'] },
      { id: 'iso42001-planning', ref: 'Clause 6', title: 'Planning', summary: 'Addresses risks, opportunities, objectives and planning for the AI management system.', conceptIds: ['impact-assessment', 'risk-treatment', 'decision-rights'] },
      { id: 'iso42001-operation', ref: 'Clause 8', title: 'Operation', summary: 'Covers operational planning and controls, including AI system impact assessment and treatment.', conceptIds: ['lifecycle-governance', 'impact-assessment', 'risk-treatment'] },
      { id: 'iso42001-improvement', ref: 'Clause 10', title: 'Improvement', summary: 'Addresses nonconformity, corrective action and continual improvement.', conceptIds: ['incident-response', 'continuous-monitoring'] },
    ],
  },
  {
    id: 'iso-23894', title: 'ISO/IEC 23894:2023 Artificial intelligence - Guidance on risk management', shortTitle: 'ISO/IEC 23894', issuer: 'ISO and IEC', jurisdiction: 'International', region: 'Global', authorityClass: 'international-standard', status: 'active', published: '2023-02', lastVerified: verified,
    officialUrl: 'https://www.iso.org/standard/77304.html',
    summary: 'Guidance for integrating AI-specific risk management into organisational activities and functions.', applicability: 'Voluntary guidance standard. Full text is licensed.', sectors: ['Cross-sector'],
    conceptIds: ['materiality', 'impact-assessment', 'risk-treatment', 'lifecycle-governance', 'continuous-monitoring'], detailAvailability: 'licensed-standard',
    provisions: [
      { id: 'iso23894-process', ref: 'Risk-management process', title: 'AI risk-management process', summary: 'Adapts identification, analysis, evaluation, treatment, monitoring and communication to AI.', conceptIds: ['impact-assessment', 'risk-treatment', 'continuous-monitoring'] },
    ],
  },
  {
    id: 'oecd-ai-principles', title: 'OECD Principles on Artificial Intelligence', shortTitle: 'OECD AI Principles', issuer: 'Organisation for Economic Co-operation and Development', jurisdiction: 'International', region: 'Global', authorityClass: 'government-guidance', status: 'active', published: '2019', effective: 'Updated 2024', lastVerified: verified,
    officialUrl: 'https://oecd.ai/en/ai-principles',
    summary: 'Intergovernmental principles for trustworthy AI and national policy, updated to address general-purpose and generative AI.', applicability: 'Non-binding intergovernmental recommendation that influences national policy and frameworks.', sectors: ['Cross-sector'],
    conceptIds: ['human-rights', 'fairness-bias', 'transparency-disclosure', 'reliability', 'ai-security', 'accountability', 'incident-response'], detailAvailability: 'full-public-text',
    provisions: [
      { id: 'oecd-human-centred', ref: 'Principle 1.2', title: 'Human-centred values and fairness', summary: 'Calls for respect for law, human rights, democratic values, diversity and safeguards.', conceptIds: ['human-rights', 'fairness-bias', 'human-oversight'] },
      { id: 'oecd-robustness', ref: 'Principle 1.4', title: 'Robustness, security and safety', summary: 'Calls for robust, secure and safe operation throughout the lifecycle and traceability where appropriate.', conceptIds: ['reliability', 'ai-security', 'operational-resilience', 'traceability'] },
    ],
  },
  {
    id: 'singapore-ai-verify', title: 'AI Verify Testing Framework and Toolkit', shortTitle: 'AI Verify', issuer: 'Infocomm Media Development Authority and AI Verify Foundation', jurisdiction: 'Singapore - voluntary global reference', region: 'Singapore', authorityClass: 'testing-framework', status: 'living', published: '2022', lastVerified: verified,
    officialUrl: 'https://www.imda.gov.sg/how-we-can-help/ai-verify',
    summary: 'Testing framework and toolkit combining governance-process checks with technical tests for AI systems.', applicability: 'Voluntary testing resource. Test outputs are evidence inputs, not certification or an assurance opinion.', sectors: ['Cross-sector'],
    conceptIds: ['evaluation', 'fairness-bias', 'transparency-disclosure', 'human-oversight', 'reliability', 'evidence-quality'], detailAvailability: 'public-summary',
    provisions: [
      { id: 'ai-verify-principles', ref: 'Testing framework', title: 'Governance and technical testing', summary: 'Maps governance principles to process checks and measurable technical tests.', conceptIds: ['evaluation', 'evidence-quality', 'fairness-bias', 'reliability'] },
    ],
  },
  {
    id: 'mitre-atlas', title: 'Adversarial Threat Landscape for Artificial-Intelligence Systems', shortTitle: 'MITRE ATLAS', issuer: 'MITRE', jurisdiction: 'Global knowledge base', region: 'Global', authorityClass: 'threat-knowledge', status: 'living', published: '2020', lastVerified: verified,
    officialUrl: 'https://atlas.mitre.org/',
    summary: 'Knowledge base of adversary tactics and techniques for machine-learning, generative-AI and AI-enabled systems.', applicability: 'Threat knowledge for security analysis and testing. It is not law, a control framework or proof of exposure.', sectors: ['Cross-sector'],
    conceptIds: ['adversarial-risk', 'ai-security', 'supply-chain', 'red-teaming', 'incident-response', 'agent-authority'], detailAvailability: 'full-public-text',
    provisions: [
      { id: 'atlas-tactics', ref: 'Tactics and techniques', title: 'AI adversary behaviours', summary: 'Structures adversary objectives and techniques to support threat modelling and testing.', conceptIds: ['adversarial-risk', 'red-teaming', 'ai-security'] },
    ],
  },
]

export const instruments: Instrument[] = [
  ...coreInstruments,
  ...australianInstruments,
  ...globalInstruments,
  ...standardsAndTestingInstruments,
]

export const instrumentById = new Map(instruments.map((instrument) => [instrument.id, instrument]))
