import { makeInstrument } from './makeInstrument'

export const standardsAndTestingInstruments = [
  makeInstrument({
    id: 'iso-42005', title: 'ISO/IEC 42005:2025 Artificial intelligence system impact assessment', shortTitle: 'ISO/IEC 42005', issuer: 'ISO and IEC', jurisdiction: 'International', region: 'Global', authorityClass: 'international-standard', status: 'active', published: '2025-05', officialUrl: 'https://www.iso.org/standard/42005',
    summary: 'Guidance for assessing foreseeable impacts of AI systems on individuals, groups and society across the lifecycle.', applicability: 'Voluntary international standard unless incorporated by contract, policy or law. Full text is licensed.', sectors: ['Cross-sector'],
    conceptIds: ['impact-assessment', 'materiality', 'human-rights', 'fairness-bias', 'lifecycle-governance', 'risk-treatment', 'documentation'], detailAvailability: 'licensed-standard',
    clauses: [{ id: 'iso42005-impact-process', ref: 'Impact-assessment lifecycle', title: 'Scope, analyse, treat and revisit impacts', summary: 'Public metadata indicates a structured lifecycle approach to stakeholder and societal impacts.', conceptIds: ['impact-assessment', 'materiality', 'human-rights', 'lifecycle-governance'] }],
  }),
  makeInstrument({
    id: 'iso-38507', title: 'ISO/IEC 38507:2022 Governance implications of the use of artificial intelligence by organizations', shortTitle: 'ISO/IEC 38507', issuer: 'ISO and IEC', jurisdiction: 'International', region: 'Global', authorityClass: 'international-standard', status: 'active', published: '2022-04', officialUrl: 'https://www.iso.org/standard/56641.html',
    summary: 'Guidance for governing bodies on effective, efficient and acceptable organisational use of AI.', applicability: 'Voluntary governance guidance. Full text is licensed and is not reproduced in the atlas.', sectors: ['Cross-sector'],
    conceptIds: ['accountability', 'decision-rights', 'materiality', 'competence', 'risk-treatment', 'human-oversight'], detailAvailability: 'licensed-standard',
    clauses: [{ id: 'iso38507-governing-body', ref: 'Governance implications', title: 'Governing-body oversight', summary: 'Public metadata frames board-level evaluation, direction and monitoring of organisational AI use.', conceptIds: ['accountability', 'decision-rights', 'materiality', 'continuous-monitoring'] }],
  }),
  makeInstrument({
    id: 'iso-5338', title: 'ISO/IEC 5338:2023 AI system life cycle processes', shortTitle: 'ISO/IEC 5338', issuer: 'ISO and IEC', jurisdiction: 'International', region: 'Global', authorityClass: 'international-standard', status: 'active', published: '2023-12', officialUrl: 'https://www.iso.org/standard/81118.html',
    summary: 'Defines AI-specific lifecycle processes based on established systems and software engineering standards.', applicability: 'Voluntary lifecycle standard. Full text is licensed.', sectors: ['Cross-sector'],
    conceptIds: ['lifecycle-governance', 'change-management', 'documentation', 'data-governance', 'evaluation', 'continuous-monitoring', 'exitability'], detailAvailability: 'licensed-standard',
    clauses: [{ id: 'iso5338-processes', ref: 'Lifecycle processes', title: 'Requirements through retirement', summary: 'Public metadata connects requirements, architecture, implementation, operation, change and retirement processes.', conceptIds: ['lifecycle-governance', 'change-management', 'documentation', 'exitability'] }],
  }),
  makeInstrument({
    id: 'iso-tr-24028', title: 'ISO/IEC TR 24028:2020 Overview of trustworthiness in artificial intelligence', shortTitle: 'ISO/IEC TR 24028', issuer: 'ISO and IEC', jurisdiction: 'International', region: 'Global', authorityClass: 'international-standard', status: 'active', published: '2020-05', officialUrl: 'https://www.iso.org/standard/77608.html',
    summary: 'Technical report describing trustworthiness characteristics for AI systems.', applicability: 'Voluntary technical report. Full text is licensed; atlas content uses public metadata and original synthesis.', sectors: ['Cross-sector'],
    conceptIds: ['transparency-disclosure', 'explainability', 'human-oversight', 'operational-resilience', 'reliability', 'ai-security', 'privacy'], detailAvailability: 'licensed-standard',
    clauses: [{ id: 'iso24028-characteristics', ref: 'Trustworthiness characteristics', title: 'Qualities of trustworthy AI', summary: 'Public metadata highlights transparency, explainability, controllability, resilience, reliability, safety, security and privacy.', conceptIds: ['transparency-disclosure', 'explainability', 'human-oversight', 'reliability', 'ai-security', 'privacy'] }],
  }),
  makeInstrument({
    id: 'nist-ai-rmf-playbook', title: 'NIST AI Risk Management Framework Playbook', shortTitle: 'NIST AI RMF Playbook', issuer: 'National Institute of Standards and Technology', jurisdiction: 'United States - voluntary global reference', region: 'United States', authorityClass: 'government-guidance', status: 'living', published: '2023-03', effective: 'Updated 2026-06', officialUrl: 'https://airc.nist.gov/airmf-resources/playbook/',
    summary: 'Living set of suggested actions and references for AI RMF categories and subcategories.', applicability: 'Voluntary implementation resource. Suggested actions are not mandatory controls or proof of conformity.', sectors: ['Cross-sector'],
    conceptIds: ['accountability', 'impact-assessment', 'risk-treatment', 'evaluation', 'continuous-monitoring', 'documentation', 'evidence-quality'], detailAvailability: 'full-public-text',
    clauses: [{ id: 'nist-playbook-actions', ref: 'Govern, Map, Measure, Manage', title: 'Suggested implementation actions', summary: 'Offers candidate actions and resources aligned to each AI RMF function and category.', conceptIds: ['accountability', 'impact-assessment', 'evaluation', 'risk-treatment'] }],
  }),
  makeInstrument({
    id: 'nist-adversarial-ml', title: 'NIST AI 100-2e2025 Adversarial Machine Learning Taxonomy and Terminology', shortTitle: 'NIST Adversarial ML', issuer: 'National Institute of Standards and Technology', jurisdiction: 'United States - voluntary global reference', region: 'United States', authorityClass: 'threat-knowledge', status: 'active', published: '2025-03-24', officialUrl: 'https://www.nist.gov/publications/adversarial-machine-learning-taxonomy-and-terminology-attacks-and-mitigations-0',
    summary: 'Taxonomy for predictive and generative AI attacks, attacker goals, capabilities, knowledge and mitigations.', applicability: 'Threat taxonomy and terminology. It is not a risk rating or evidence of a specific system\'s exposure.', sectors: ['Cross-sector'],
    conceptIds: ['adversarial-risk', 'ai-security', 'supply-chain', 'red-teaming', 'runtime-guardrails', 'incident-response'], detailAvailability: 'full-public-text',
    clauses: [{ id: 'nist-aml-taxonomy', ref: 'Attack taxonomy', title: 'Attacks, goals and mitigations', summary: 'Structures adversarial AI risks to support threat modelling, control design and evaluation.', conceptIds: ['adversarial-risk', 'ai-security', 'red-teaming', 'incident-response'] }],
  }),
  makeInstrument({
    id: 'nist-sp-800-218a', title: 'NIST SP 800-218A Secure Software Development Practices for Generative AI and Dual-Use Foundation Models', shortTitle: 'NIST SP 800-218A', issuer: 'National Institute of Standards and Technology', jurisdiction: 'United States - voluntary global reference', region: 'United States', authorityClass: 'government-guidance', status: 'active', published: '2024-07', officialUrl: 'https://csrc.nist.gov/pubs/sp/800/218/a/final',
    summary: 'Community profile augmenting secure software-development practices for AI models and model-based systems.', applicability: 'Voluntary engineering guidance. It does not by itself cover deployment and operating effectiveness.', sectors: ['Software development', 'AI providers'],
    conceptIds: ['lifecycle-governance', 'ai-security', 'supply-chain', 'documentation', 'change-management', 'evaluation', 'provenance'], detailAvailability: 'full-public-text',
    clauses: [{ id: 'nist-ssdf-ai', ref: 'SSDF community profile', title: 'Secure AI development practices', summary: 'Maps model and software-development risks to practices and implementation evidence.', conceptIds: ['lifecycle-governance', 'ai-security', 'supply-chain', 'documentation'] }],
  }),
  makeInstrument({
    id: 'nist-synthetic-content', title: 'NIST AI 100-4 Reducing Risks Posed by Synthetic Content', shortTitle: 'NIST Synthetic Content', issuer: 'National Institute of Standards and Technology', jurisdiction: 'United States - voluntary global reference', region: 'United States', authorityClass: 'government-guidance', status: 'active', published: '2024-11-20', officialUrl: 'https://www.nist.gov/publications/reducing-risks-posed-synthetic-content-overview-technical-approaches-digital-content',
    summary: 'Technical overview of provenance, authentication, watermarking, detection, testing and auditing for synthetic content.', applicability: 'Voluntary technical report. Detection or provenance signals do not establish that content is true.', sectors: ['Cross-sector', 'Media'],
    conceptIds: ['provenance', 'transparency-disclosure', 'evaluation', 'auditability', 'ai-security'], detailAvailability: 'full-public-text',
    clauses: [{ id: 'nist-content-techniques', ref: 'Technical approaches', title: 'Provenance, detection and evaluation', summary: 'Reviews techniques and limitations for authenticating, marking, detecting and auditing synthetic content.', conceptIds: ['provenance', 'transparency-disclosure', 'evaluation', 'auditability'] }],
  }),
  makeInstrument({
    id: 'owasp-llm-top-10', title: 'OWASP Top 10 for Large Language Model Applications 2026', shortTitle: 'OWASP LLM Top 10', issuer: 'OWASP GenAI Security Project', jurisdiction: 'Global knowledge base', region: 'Global', authorityClass: 'threat-knowledge', status: 'living', published: '2026-08', officialUrl: 'https://genai.owasp.org/resource/owasp-genai-llm-top-10-2026/',
    summary: 'Awareness taxonomy for critical security risks in applications built with large language models.', applicability: 'Community threat taxonomy. It is not a control standard, certification or proof of exposure.', sectors: ['Cross-sector'],
    conceptIds: ['adversarial-risk', 'ai-security', 'supply-chain', 'tool-use', 'data-governance', 'red-teaming'], detailAvailability: 'full-public-text',
    clauses: [{ id: 'owasp-llm-risks', ref: 'Top 10 risks', title: 'LLM application attack surface', summary: 'Describes priority risks, scenarios and mitigations for LLM-enabled applications.', conceptIds: ['adversarial-risk', 'ai-security', 'supply-chain', 'tool-use'] }],
  }),
  makeInstrument({
    id: 'owasp-agentic-top-10', title: 'OWASP Top 10 for Agentic Applications 2026', shortTitle: 'OWASP Agentic Top 10', issuer: 'OWASP GenAI Security Project', jurisdiction: 'Global knowledge base', region: 'Global', authorityClass: 'threat-knowledge', status: 'living', published: '2025-12-09', officialUrl: 'https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/',
    summary: 'Threat taxonomy for goal hijack, tool misuse, identity, memory, inter-agent and cascading-failure risks.', applicability: 'Community threat knowledge for design and testing. It is not a legal or assurance framework.', sectors: ['Cross-sector'],
    conceptIds: ['agent-authority', 'tool-use', 'access-control', 'runtime-guardrails', 'adversarial-risk', 'supply-chain', 'intervention'], detailAvailability: 'full-public-text',
    clauses: [{ id: 'owasp-agentic-risks', ref: 'Top 10 agentic risks', title: 'Authority and execution threats', summary: 'Organises agent-specific attack paths and failure modes to support controls and red-team scenarios.', conceptIds: ['agent-authority', 'tool-use', 'runtime-guardrails', 'adversarial-risk', 'intervention'] }],
  }),
  makeInstrument({
    id: 'owasp-aisvs', title: 'OWASP AI Security Verification Standard 1.0', shortTitle: 'OWASP AISVS', issuer: 'OWASP', jurisdiction: 'Global technical standard', region: 'Global', authorityClass: 'testing-framework', status: 'active', published: '2026-06', officialUrl: 'https://github.com/OWASP/AISVS',
    summary: 'Testable AI security requirements arranged in chapters and verification levels.', applicability: 'Open security verification standard. Meeting selected requirements is evidence input, not an assurance conclusion.', sectors: ['Cross-sector'],
    conceptIds: ['ai-security', 'access-control', 'adversarial-risk', 'supply-chain', 'evaluation', 'evidence-quality', 'auditability'], detailAvailability: 'full-public-text',
    clauses: [{ id: 'aisvs-requirements', ref: 'Fourteen chapters', title: 'Testable AI security requirements', summary: 'Bridges high-level AI security risks to verifiable implementation requirements.', conceptIds: ['ai-security', 'evaluation', 'evidence-quality', 'auditability'] }],
  }),
  makeInstrument({
    id: 'c2pa-2-4', title: 'C2PA Technical Specification 2.4', shortTitle: 'C2PA 2.4', issuer: 'Coalition for Content Provenance and Authenticity', jurisdiction: 'Global technical standard', region: 'Global', authorityClass: 'international-standard', status: 'active', published: '2026-04', officialUrl: 'https://spec.c2pa.org/specifications/specifications/2.4/specs/C2PA_Specification.html',
    summary: 'Open technical specification for signed manifests, assertions, claims, trust lists and content validation.', applicability: 'Technical provenance mechanism. Valid provenance does not establish content truth or legal compliance.', sectors: ['Media', 'Cross-sector'],
    conceptIds: ['provenance', 'transparency-disclosure', 'traceability', 'ai-security', 'auditability'], detailAvailability: 'full-public-text',
    clauses: [{ id: 'c2pa-manifests', ref: 'Claims and manifests', title: 'Content provenance architecture', summary: 'Defines cryptographically verifiable statements about content origin, actions and AI-use disclosure.', conceptIds: ['provenance', 'traceability', 'transparency-disclosure', 'ai-security'] }],
  }),
  makeInstrument({
    id: 'enisa-ai-cyber-framework', title: 'Multilayer Framework for Good Cybersecurity Practices for AI', shortTitle: 'ENISA AI Cyber Framework', issuer: 'European Union Agency for Cybersecurity', jurisdiction: 'European Union and voluntary global reference', region: 'Europe', authorityClass: 'government-guidance', status: 'active', published: '2023-06-07', officialUrl: 'https://www.enisa.europa.eu/publications/multilayer-framework-for-good-cybersecurity-practices-for-ai',
    summary: 'Layered guidance combining foundational cybersecurity, AI-specific security and sector-specific controls.', applicability: 'Official EU cybersecurity guidance, not binding law or proof of effective controls.', sectors: ['Cross-sector'],
    conceptIds: ['ai-security', 'adversarial-risk', 'lifecycle-governance', 'supply-chain', 'incident-response', 'risk-treatment'], detailAvailability: 'full-public-text',
    clauses: [{ id: 'enisa-ai-layers', ref: 'Three security layers', title: 'Baseline, AI-specific and sector controls', summary: 'Connects established cyber practices to AI threats and sector context.', conceptIds: ['ai-security', 'adversarial-risk', 'supply-chain', 'risk-treatment'] }],
  }),
  makeInstrument({
    id: 'uk-aisi-inspect', title: 'Inspect AI Evaluation Framework', shortTitle: 'UK AISI Inspect', issuer: 'UK AI Security Institute', jurisdiction: 'United Kingdom and open global use', region: 'United Kingdom', authorityClass: 'testing-framework', status: 'living', published: '2024-05', officialUrl: 'https://www.aisi.gov.uk/blog/open-sourcing-our-testing-framework-inspect',
    summary: 'Open-source framework for constructing evaluations from datasets, solvers and scorers.', applicability: 'Evaluation infrastructure. Scores and logs are potential evidence, not universal safety or assurance conclusions.', sectors: ['Cross-sector', 'AI providers'],
    conceptIds: ['evaluation', 'red-teaming', 'reliability', 'agent-authority', 'evidence-quality', 'auditability'], detailAvailability: 'full-public-text',
    clauses: [{ id: 'inspect-evals', ref: 'Datasets, solvers and scorers', title: 'Composable AI evaluations', summary: 'Supports reproducible capability, reasoning, safety and autonomy evaluations with recorded logs.', conceptIds: ['evaluation', 'red-teaming', 'reliability', 'evidence-quality'] }],
  }),
]
