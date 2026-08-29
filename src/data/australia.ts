import { makeInstrument } from './makeInstrument'

export const australianInstruments = [
  makeInstrument({
    id: 'au-corporations-act', title: 'Corporations Act 2001', shortTitle: 'Corporations Act', issuer: 'Australian Parliament', jurisdiction: 'Australia', region: 'Australia', authorityClass: 'law', status: 'in-force', published: '2001', officialUrl: 'https://www.legislation.gov.au/C2004A00818/latest/text',
    summary: 'Core corporations and financial-services law governing directors, licensees, disclosure, conduct and product obligations.', applicability: 'Binding according to the Act. AI use remains subject to existing director, licensing and conduct duties.', sectors: ['Financial services', 'Corporations'],
    conceptIds: ['accountability', 'decision-rights', 'competence', 'risk-treatment', 'transparency-disclosure', 'contestability'], detailAvailability: 'full-public-text',
    clauses: [{ id: 'corp-act-afs', ref: 'Chapter 7', title: 'Financial services and markets', summary: 'Establishes licensing, conduct, disclosure and product duties relevant when AI supports financial services.', conceptIds: ['accountability', 'competence', 'transparency-disclosure', 'contestability'] }],
  }),
  makeInstrument({
    id: 'au-asic-act', title: 'Australian Securities and Investments Commission Act 2001', shortTitle: 'ASIC Act', issuer: 'Australian Parliament', jurisdiction: 'Australia', region: 'Australia', authorityClass: 'law', status: 'in-force', published: '2001', officialUrl: 'https://www.legislation.gov.au/C2004A00819/latest/text',
    summary: 'Establishes ASIC powers and financial-consumer protections, including misleading and unconscionable conduct rules.', applicability: 'Binding within scope. AI-generated representations and customer interactions do not escape technology-neutral consumer protections.', sectors: ['Financial services'],
    conceptIds: ['accountability', 'transparency-disclosure', 'fairness-bias', 'contestability', 'human-rights'], detailAvailability: 'full-public-text',
    clauses: [{ id: 'asic-act-consumer', ref: 'Part 2 Division 2', title: 'Financial consumer protection', summary: 'Prohibits misleading, deceptive and unconscionable conduct in financial services.', conceptIds: ['transparency-disclosure', 'fairness-bias', 'contestability'] }],
  }),
  makeInstrument({
    id: 'au-far-act', title: 'Financial Accountability Regime Act 2023', shortTitle: 'FAR Act', issuer: 'Australian Parliament', jurisdiction: 'Australia', region: 'Australia', authorityClass: 'law', status: 'in-force', published: '2023', effective: '2024-03-15 / 2025-03-15', officialUrl: 'https://www.legislation.gov.au/C2023A00067/latest/versions',
    summary: 'Creates entity and senior-executive accountability duties across banking, insurance and superannuation.', applicability: 'Binding for covered accountable entities and people. It sharpens ownership but does not create AI-specific controls.', sectors: ['Banking', 'Insurance', 'Superannuation'],
    conceptIds: ['accountability', 'decision-rights', 'inventory', 'competence', 'auditability'], detailAvailability: 'full-public-text',
    clauses: [{ id: 'far-accountability', ref: 'Accountability obligations', title: 'Reasonable steps and clear responsibility', summary: 'Requires covered entities and accountable persons to take reasonable steps and maintain clear responsibility records.', conceptIds: ['accountability', 'decision-rights', 'auditability'] }],
  }),
  makeInstrument({
    id: 'apra-cps-220', title: 'CPS 220 Risk Management', shortTitle: 'APRA CPS 220', issuer: 'Australian Prudential Regulation Authority', jurisdiction: 'Australia - APRA-regulated entities', region: 'Australia', authorityClass: 'regulatory-expectation', status: 'in-force', published: '2019', officialUrl: 'https://www.apra.gov.au/standards/cps-220',
    summary: 'Whole-of-entity prudential framework for material risks, risk appetite, oversight, declarations and independent review.', applicability: 'Binding prudential standard for covered entities. AI risks should be integrated according to materiality.', sectors: ['Banking', 'Insurance', 'Superannuation'],
    conceptIds: ['accountability', 'materiality', 'risk-treatment', 'decision-rights', 'continuous-monitoring', 'assurance'], detailAvailability: 'full-public-text',
    clauses: [{ id: 'cps220-framework', ref: 'Risk management framework', title: 'All material risks', summary: 'Requires a board-approved framework covering all material risks, appetite, controls, monitoring and independent review.', conceptIds: ['materiality', 'risk-treatment', 'continuous-monitoring', 'assurance'] }],
  }),
  makeInstrument({
    id: 'asic-rep-798', title: 'REP 798 Beware the gap: Governance arrangements in the face of AI innovation', shortTitle: 'ASIC REP 798', issuer: 'Australian Securities and Investments Commission', jurisdiction: 'Australia - AFS and credit licensees', region: 'Australia', authorityClass: 'analytical-report', status: 'active', published: '2024-10-29', officialUrl: 'https://www.asic.gov.au/regulatory-resources/find-a-document/reports/rep-798-beware-the-gap-governance-arrangements-in-the-face-of-ai-innovation',
    summary: 'Reports ASIC findings from 624 AI use cases across 23 licensees and identifies governance gaps and consumer risks.', applicability: 'Regulatory evidence and expectation context, not a standalone legal obligation or proof of an individual firm\'s maturity.', sectors: ['Financial services'],
    conceptIds: ['inventory', 'accountability', 'fairness-bias', 'transparency-disclosure', 'third-party-risk', 'continuous-monitoring', 'human-oversight'], detailAvailability: 'full-public-text',
    clauses: [{ id: 'rep798-findings', ref: 'Key findings', title: 'Governance is lagging adoption', summary: 'Identifies incomplete inventories, uneven risk frameworks and gaps in third-party and consumer-risk governance.', conceptIds: ['inventory', 'accountability', 'third-party-risk', 'fairness-bias'] }],
  }),
  makeInstrument({
    id: 'au-ai-adoption-guidance', title: 'Guidance for AI Adoption: Implementation Guidance', shortTitle: 'AI Adoption Guidance', issuer: 'Australian Government National AI Centre', jurisdiction: 'Australia', region: 'Australia', authorityClass: 'government-guidance', status: 'voluntary', published: '2026-05-05', officialUrl: 'https://www.ai.gov.au/staying-safe-and-responsible/essential-ai-practices/guidance-ai-adoption-implementation-guidance',
    summary: 'Six essential practices for accountable, transparent and risk-based adoption of complex and higher-risk AI.', applicability: 'Voluntary economy-wide guidance. It is not a compliance standard or regulator-approved control assessment.', sectors: ['Cross-sector'],
    conceptIds: ['accountability', 'impact-assessment', 'inventory', 'evaluation', 'continuous-monitoring', 'human-oversight', 'intervention', 'third-party-risk'], detailAvailability: 'full-public-text',
    clauses: [{ id: 'adoption-six-practices', ref: 'Six essential practices', title: 'Practical adoption baseline', summary: 'Covers accountability, stakeholder safeguards, risk management, transparency, testing and human control.', conceptIds: ['accountability', 'impact-assessment', 'inventory', 'evaluation', 'human-oversight'] }],
  }),
  makeInstrument({
    id: 'dta-ai-policy', title: 'Policy for the Responsible Use of AI in Government 2.0', shortTitle: 'Government AI Policy', issuer: 'Digital Transformation Agency', jurisdiction: 'Australian Government', region: 'Australia', authorityClass: 'government-policy', status: 'active', published: '2025-12-01', effective: '2025-12-15', officialUrl: 'https://www.digital.gov.au/ai/ai-in-government-policy',
    summary: 'Mandatory policy within its stated Commonwealth scope for accountable officials, transparency, ownership and impact assessment.', applicability: 'Mandatory only for covered Commonwealth entities, subject to policy scope and exceptions. It is not binding on private firms.', sectors: ['Government'],
    conceptIds: ['accountability', 'inventory', 'impact-assessment', 'transparency-disclosure', 'competence', 'lifecycle-governance'], detailAvailability: 'full-public-text',
    clauses: [{ id: 'dta-ai-policy-requirements', ref: 'Policy requirements', title: 'Accountability and transparency', summary: 'Requires accountable officials, AI strategies, transparency statements, use-case ownership and staff capability.', conceptIds: ['accountability', 'inventory', 'transparency-disclosure', 'competence'] }],
  }),
  makeInstrument({
    id: 'dta-agentic-addendum', title: 'Agentic AI Addendum to the AI Technical Standard', shortTitle: 'DTA Agentic Addendum', issuer: 'Digital Transformation Agency', jurisdiction: 'Australian Government', region: 'Australia', authorityClass: 'government-guidance', status: 'active', published: '2026-06-04', officialUrl: 'https://www.digital.gov.au/policy/ai/agentic-ai-addendum',
    summary: 'Adds governance and technical practices for autonomy, memory, tool access, observability and failure containment.', applicability: 'Government implementation guidance. It is conceptually useful outside government but not a private-sector legal requirement.', sectors: ['Government', 'Cross-sector reference'],
    conceptIds: ['agent-authority', 'tool-use', 'access-control', 'runtime-guardrails', 'human-oversight', 'traceability', 'intervention'], detailAvailability: 'full-public-text',
    clauses: [{ id: 'dta-agentic-controls', ref: 'Agentic controls', title: 'Bound autonomy and observable execution', summary: 'Addresses autonomy tiers, memory, permissions, checkpoints, monitoring, containment and decommissioning.', conceptIds: ['agent-authority', 'tool-use', 'runtime-guardrails', 'traceability', 'intervention'] }],
  }),
  makeInstrument({
    id: 'asd-secure-ai-development', title: 'Guidelines for Secure AI System Development', shortTitle: 'ASD Secure AI', issuer: 'Australian Signals Directorate and international partners', jurisdiction: 'Australia and international partners', region: 'Australia', authorityClass: 'threat-knowledge', status: 'active', published: '2023-11-27', officialUrl: 'https://www.cyber.gov.au/business-government/secure-design/artificial-intelligence/guidelines-for-secure-ai-system-development',
    summary: 'Secure-by-design guidance across AI design, development, deployment and operation.', applicability: 'Technical security guidance, not law and not evidence that a particular control operates.', sectors: ['Cross-sector'],
    conceptIds: ['ai-security', 'adversarial-risk', 'supply-chain', 'red-teaming', 'continuous-monitoring', 'incident-response'], detailAvailability: 'full-public-text',
    clauses: [{ id: 'asd-ai-lifecycle', ref: 'Secure lifecycle', title: 'Design through operation', summary: 'Covers threat modelling, supply chain, data/model protection, logging, testing and incident management.', conceptIds: ['lifecycle-governance', 'ai-security', 'supply-chain', 'red-teaming', 'incident-response'] }],
  }),
  makeInstrument({
    id: 'asd-ai-supply-chain', title: 'Artificial Intelligence and Machine Learning: Supply Chain Risks and Mitigations', shortTitle: 'ASD AI Supply Chain', issuer: 'Australian Signals Directorate and international partners', jurisdiction: 'Australia and international partners', region: 'Australia', authorityClass: 'threat-knowledge', status: 'active', published: '2025-10-16', effective: 'Updated 2026-03-05', officialUrl: 'https://www.cyber.gov.au/business-government/secure-design/artificial-intelligence/artificial-intelligence-and-machine-learning-supply-chain-risks-and-mitigations',
    summary: 'Threat and mitigation guidance for models, data, software, infrastructure and AI providers.', applicability: 'Threat knowledge and implementation guidance. It does not prove supplier risk or control weakness.', sectors: ['Cross-sector'],
    conceptIds: ['supply-chain', 'third-party-risk', 'provenance', 'ai-security', 'exitability', 'incident-response'], detailAvailability: 'full-public-text',
    clauses: [{ id: 'asd-ai-supply-controls', ref: 'Risk mitigations', title: 'Trace and govern the AI supply chain', summary: 'Recommends component inventories, provenance, due diligence, shared responsibility, monitoring and response planning.', conceptIds: ['supply-chain', 'provenance', 'third-party-risk', 'incident-response'] }],
  }),
  makeInstrument({
    id: 'asd-frontier-board', title: 'Frontier AI Cyber Threat Considerations for Boards of Directors', shortTitle: 'Frontier AI Board Guide', issuer: 'Australian Signals Directorate and Australian Institute of Company Directors', jurisdiction: 'Australia', region: 'Australia', authorityClass: 'threat-knowledge', status: 'active', published: '2026-08-05', officialUrl: 'https://www.cyber.gov.au/business-government/protecting-business-leaders/cyber-security-for-business-leaders/frontier-ai-cyber-threat-considerations-for-boards-of-directors',
    summary: 'Board-level guidance for machine-speed vulnerability discovery, agentic attack, critical services and recovery.', applicability: 'Official threat guidance. It is not a prudential standard or evidence of an organisation\'s exposure.', sectors: ['Cross-sector', 'Financial services'],
    conceptIds: ['accountability', 'adversarial-risk', 'access-control', 'operational-resilience', 'incident-response', 'third-party-risk', 'intervention'], detailAvailability: 'full-public-text',
    clauses: [{ id: 'frontier-board-challenge', ref: 'Board considerations', title: 'Can controls work at machine speed?', summary: 'Prompts directors to challenge attack-surface, privilege, continuity, supplier and recovery assumptions.', conceptIds: ['accountability', 'access-control', 'operational-resilience', 'third-party-risk'] }],
  }),
  makeInstrument({
    id: 'asic-ai-cyber-letter', title: 'ASIC Open Letter: Urgent Cyber Uplift as AI Accelerates Cyber Threats', shortTitle: 'ASIC AI Cyber Letter', issuer: 'Australian Securities and Investments Commission', jurisdiction: 'Australia - licensees and market participants', region: 'Australia', authorityClass: 'regulatory-expectation', status: 'active', published: '2026-05-08', officialUrl: 'https://www.asic.gov.au/about-asic/news-centre/find-a-media-release/2026-releases/26-092mr-asic-calls-for-urgent-cyber-uplift-as-ai-accelerates-cyber-threats',
    summary: 'Calls on boards and licensees to strengthen cyber resilience as AI compresses threat timelines.', applicability: 'Supervisory expectation grounded in existing licensing duties. It is not a standalone technology standard.', sectors: ['Financial services'],
    conceptIds: ['accountability', 'ai-security', 'access-control', 'third-party-risk', 'incident-response', 'operational-resilience'], detailAvailability: 'full-public-text',
    clauses: [{ id: 'asic-cyber-actions', ref: 'Govern, protect, detect, respond', title: 'Cyber-resilience uplift', summary: 'Emphasises effective and proportionate controls, patching, privilege, suppliers and exercised response.', conceptIds: ['ai-security', 'access-control', 'third-party-risk', 'incident-response'] }],
  }),
]
