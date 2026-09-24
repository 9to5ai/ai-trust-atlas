import type { SourceRecord, InstrumentRelation, SourceProvision } from '../types.js'
import { makeInstrument } from './makeInstrument'

/*
 * Library completeness review, 24 September 2026 (research/sourcing/2026-09-24-completeness-review.md).
 * Adds Australian depth and global financial-regulator sources, and corrects existing records.
 * Every record is a draft for editorial review: summaries are original synopses; titles, dates and
 * official URLs were checked against the issuers' public pages on the review date.
 */
const drafted = '2026-09-24'
const note = 'Draft prepared for editorial review. Original synopsis; confirm scope and edition against the issuer’s current text before relying on it.'
const draft = { editorialStatus: 'draft' as const, lastVerified: drafted }
const section = (id: string, ref: string, title: string, summary: string, conceptIds: string[]): SourceProvision => ({ id, ref, title, summary, conceptIds, granularity: 'section', editorialStatus: 'draft', reviewedAt: drafted, note })

export const reviewInstruments: SourceRecord[] = [
  /* Australia */
  makeInstrument({
    ...draft, id: 'au-national-ai-plan', title: 'National AI Plan', shortTitle: 'National AI Plan', issuer: 'Department of Industry, Science and Resources', jurisdiction: 'Australia', region: 'Australia', authorityClass: 'policy-guidance', authorityNote: 'Government policy; not legislation', status: 'active', published: '2025-12-02',
    officialUrl: 'https://www.industry.gov.au/publications/national-ai-plan',
    summary: 'The Australian Government’s plan to capture AI opportunities, spread the benefits and keep Australians safe. It relies on existing laws and sector regulators, voluntary guidance and a new AI Safety Institute rather than a standalone AI Act.', applicability: 'Sets government direction. It creates no obligations itself; sector laws, regulator guidance and any future amendments do.', sectors: ['Cross-sector', 'Public sector'],
    conceptIds: ['accountability', 'systemic-risk', 'evaluation', 'human-rights'], detailAvailability: 'full-public-text',
    provisions: [
      section('national-ai-plan-safe', 'Keep Australians safe', 'Existing laws first', 'Regulates AI through existing, technology-neutral laws and sector regulators, supported by voluntary guidance, with legislative gaps to be addressed where they emerge.', ['accountability', 'systemic-risk']),
      section('national-ai-plan-aisi', 'AI Safety Institute', 'Technical capability for government', 'Establishes an Australian AI Safety Institute to monitor, test and share information on emerging AI capabilities and risks, and to advise government and regulators.', ['evaluation', 'systemic-risk']),
    ],
  }),
  makeInstrument({
    ...draft, id: 'apra-cpg-230', title: 'Prudential Practice Guide CPG 230 Operational Risk Management', shortTitle: 'APRA CPG 230', issuer: 'Australian Prudential Regulation Authority', jurisdiction: 'Australia - APRA-regulated entities', region: 'Australia', authorityClass: 'policy-guidance', authorityNote: 'Prudential practice guidance; not binding, but shows how APRA expects CPS 230 to be met', status: 'active', published: '2026-04', effective: 'Updated version applies from 1 July 2026',
    officialUrl: 'https://www.apra.gov.au/operational-risk-management',
    summary: 'APRA’s guidance on meeting CPS 230: operational risk frameworks, critical operations, tolerance levels, business continuity and management of material service providers. Updated alongside the 2026 CPS 230 amendments.', applicability: 'Guidance for APRA-regulated entities. It explains better practice; the binding requirements are in CPS 230.', sectors: ['Banking', 'Insurance', 'Superannuation'],
    conceptIds: ['operational-resilience', 'third-party-risk', 'exitability', 'risk-treatment', 'accountability'], detailAvailability: 'full-public-text',
    provisions: [
      section('cpg230-service-providers', 'Material service providers', 'Managing critical suppliers', 'Explains due diligence, agreements, monitoring and exit planning for material service providers, including technology and AI vendors that support critical operations.', ['third-party-risk', 'exitability', 'supply-chain']),
      section('cpg230-continuity', 'Business continuity', 'Tolerance levels and testing', 'Describes how to set tolerance levels for critical operations and test that continuity plans can keep them within tolerance.', ['operational-resilience', 'incident-response']),
    ],
  }),
  makeInstrument({
    ...draft, id: 'oaic-genai-training', title: 'Guidance on privacy and developing and training generative AI models', shortTitle: 'OAIC GenAI Training Privacy', issuer: 'Office of the Australian Information Commissioner', jurisdiction: 'Australia', region: 'Australia', authorityClass: 'policy-guidance', authorityNote: 'Regulator guidance on applying the Privacy Act', status: 'active', published: '2024-10-21',
    officialUrl: 'https://www.oaic.gov.au/privacy/privacy-guidance-for-organisations-and-government-agencies/guidance-on-privacy-and-developing-and-training-generative-ai-models',
    summary: 'How the Australian Privacy Principles apply when organisations design, train, fine-tune or supply data for generative AI models, including scraped and third-party datasets.', applicability: 'Applies to APP entities that develop AI models or provide personal information to developers. The companion guide covers using commercial AI products.', sectors: ['Cross-sector', 'AI providers'],
    conceptIds: ['privacy', 'data-governance', 'provenance', 'transparency-disclosure', 'impact-assessment'], detailAvailability: 'full-public-text',
    provisions: [
      section('oaic-genai-collection', 'APPs 3 and 6', 'Collecting and reusing data for training', 'Treats training data as personal information where individuals are identifiable, and sets expectations for lawful, fair collection and for secondary use, including publicly available data.', ['privacy', 'data-governance', 'provenance']),
      section('oaic-genai-transparency', 'APPs 1 and 5', 'Telling people about training', 'Expects clear notice of how personal information is used to develop models and a privacy impact assessment before training.', ['transparency-disclosure', 'impact-assessment', 'privacy']),
    ],
  }),
  makeInstrument({
    ...draft, id: 'oaic-adm-transparency', title: 'Guidance on transparency in automated decision-making: issues paper', shortTitle: 'OAIC ADM Transparency', issuer: 'Office of the Australian Information Commissioner', jurisdiction: 'Australia', region: 'Australia', authorityClass: 'policy-guidance', authorityNote: 'Regulator consultation; final guidance pending', status: 'closed-consultation', published: '2026-05-18', effective: 'Obligation commences 10 December 2026',
    officialUrl: 'https://www.oaic.gov.au/engage-with-us/consultations/consultation-on-guidance-for-transparency-in-automated-decision-making',
    summary: 'The OAIC’s consultation on guidance for the new APP 1 automated decision-making obligation. From 10 December 2026, privacy policies must describe personal information used in, and decisions made by, computer programs that could significantly affect individuals.', applicability: 'Consultation closed 15 June 2026. Replace this record with the final guidance when the OAIC publishes it.', sectors: ['Cross-sector'],
    conceptIds: ['transparency-disclosure', 'privacy', 'explainability', 'contestability'], detailAvailability: 'full-public-text',
    provisions: [
      section('oaic-adm-scope', 'Scope of the obligation', 'Which decisions are covered', 'Covers decisions made, or substantially and directly supported, by a computer program using personal information where the decision could reasonably be expected to significantly affect an individual’s rights or interests.', ['transparency-disclosure', 'privacy']),
    ],
  }),
  makeInstrument({
    ...draft, id: 'aicd-hti-director-guide', title: 'A Director’s Guide to AI Governance (Version 2)', shortTitle: 'AICD Director’s AI Guide', issuer: 'Australian Institute of Company Directors and UTS Human Technology Institute', jurisdiction: 'Australia', region: 'Australia', authorityClass: 'framework', authorityNote: 'Industry guidance for directors; not regulatory', status: 'active', published: '2026-06-29',
    officialUrl: 'https://www.aicd.com.au/news-media/research-and-reports/a-directors-guide-to-ai-governance.html',
    summary: 'Board-level guidance on overseeing AI: strategy and opportunity, accountability, risk, people and stakeholder impact. Version 2 updates the 2024 guide for agentic AI and maturing governance practice, with an SME and not-for-profit checklist.', applicability: 'Practical guidance for boards. It does not change directors’ legal duties, which come from the Corporations Act and general law.', sectors: ['Cross-sector'],
    conceptIds: ['accountability', 'decision-rights', 'competence', 'inventory', 'human-oversight'], detailAvailability: 'full-public-text',
    provisions: [
      section('aicd-guide-oversight', 'Board oversight', 'What boards should ask for', 'Frames AI oversight around clear accountability, an inventory of material AI use, risk appetite, reporting to the board and director capability.', ['accountability', 'decision-rights', 'inventory', 'competence']),
    ],
  }),
  makeInstrument({
    ...draft, id: 'asic-rg-234', title: 'Regulatory Guide 234 Advertising financial products and services (including credit)', shortTitle: 'ASIC RG 234', issuer: 'Australian Securities and Investments Commission', jurisdiction: 'Australia - promoters and publishers of financial products and credit', region: 'Australia', authorityClass: 'policy-guidance', authorityNote: 'Regulatory guidance on existing misleading-conduct laws', status: 'active', published: '2026-06-09',
    officialUrl: 'https://www.asic.gov.au/regulatory-resources/find-a-document/regulatory-guides/rg-234-advertising-financial-products-and-services-including-credit',
    summary: 'ASIC’s first rewrite of its advertising guidance since 2012. It applies whatever the technology, including AI-generated content, and cautions against overstating what AI-enabled tools can do.', applicability: 'Guidance on obligations not to mislead under the ASIC Act and Corporations Act. It consolidates the withdrawn RG 53 on past performance.', sectors: ['Banking', 'Financial advice', 'Credit'],
    conceptIds: ['transparency-disclosure', 'reliability', 'accountability'], detailAvailability: 'full-public-text',
    provisions: [
      section('rg234-ai', 'AI and advertising', 'AI-generated and AI-promoting content', 'Advertising produced with AI is subject to the same obligations, and promotions of AI-enabled services should not overstate capability or hide limitations such as errors or bias.', ['transparency-disclosure', 'reliability']),
    ],
  }),
  makeInstrument({
    ...draft, id: 'dta-ai-technical-standard', title: 'Australian Government AI technical standard', shortTitle: 'DTA AI Technical Standard', issuer: 'Digital Transformation Agency', jurisdiction: 'Australia - Commonwealth agencies', region: 'Australia', authorityClass: 'standard', authorityNote: 'Non-legislative technical standard for government agencies', status: 'active', published: '2025-07-31',
    officialUrl: 'https://www.digital.gov.au/policy/ai/AI-technical-standard',
    summary: 'Lifecycle requirements for AI systems used by Australian Government agencies: 42 statements and 148 implementation criteria from design through to decommissioning.', applicability: 'Written for Commonwealth agencies under the AI policy. Private organisations can use it as a reference for control design.', sectors: ['Public sector'],
    conceptIds: ['lifecycle-governance', 'documentation', 'evaluation', 'continuous-monitoring', 'data-governance'], detailAvailability: 'full-public-text',
    provisions: [
      section('dta-standard-lifecycle', 'Lifecycle statements', 'Design to decommissioning', 'Sets what agencies should do at each lifecycle stage, with criteria for data, testing, monitoring, documentation and retirement.', ['lifecycle-governance', 'evaluation', 'continuous-monitoring', 'documentation']),
    ],
  }),
  makeInstrument({
    ...draft, id: 'nsw-ai-assessment-framework', title: 'NSW Artificial Intelligence Assessment Framework', shortTitle: 'NSW AI Assessment Framework', issuer: 'NSW Government (Office for AI, Department of Customer Service)', jurisdiction: 'Australia - NSW Government agencies', region: 'Australia', authorityClass: 'policy-guidance', authorityNote: 'Mandatory for NSW Government agencies under Circular DCS-2026-02', status: 'active', published: '2026-01',
    officialUrl: 'https://www.digital.nsw.gov.au/policy/artificial-intelligence/ai-governance-assurance-and-frameworks/nsw-ai-assessment-framework',
    summary: 'The self-assessment every NSW Government agency must apply to AI use across the lifecycle. The 2026 revision is faster, aligned to standards and covers generative AI, with higher-risk uses referred to an AI Review Committee.', applicability: 'Binding on NSW Government agencies through policy. A useful reference for other organisations’ risk triage.', sectors: ['Public sector'],
    conceptIds: ['impact-assessment', 'materiality', 'human-oversight', 'privacy', 'accountability'], detailAvailability: 'full-public-text',
    provisions: [
      section('nsw-aiaf-triage', 'Risk assessment', 'Triage and escalation', 'Assesses a use against risk factors, triggers safeguards such as privacy impact assessment and legal review, and escalates higher-risk uses for independent review.', ['impact-assessment', 'materiality', 'accountability']),
    ],
  }),
  makeInstrument({
    ...draft, id: 'treasury-ai-acl-review', title: 'Review of AI and the Australian Consumer Law: final report', shortTitle: 'Treasury AI and ACL Review', issuer: 'The Treasury', jurisdiction: 'Australia', region: 'Australia', authorityClass: 'research-database', authorityNote: 'Government review; recommendations, not law', status: 'active', published: '2025-10-03',
    officialUrl: 'https://treasury.gov.au/publication/p2025-702329',
    summary: 'Finds the Australian Consumer Law broadly able to protect consumers of AI-enabled goods and services, and proposes targeted clarifications such as who counts as a manufacturer in AI supply chains.', applicability: 'Policy findings. Any amendments would require separate legislation.', sectors: ['Cross-sector', 'Consumer'],
    conceptIds: ['accountability', 'supply-chain', 'reliability'], detailAvailability: 'full-public-text',
    provisions: [
      section('acl-review-findings', 'Findings', 'Existing law, targeted fixes', 'Concludes that principles-based consumer law adapts to AI, while flagging clarifications for software-enabled goods and AI supply chains.', ['accountability', 'supply-chain']),
    ],
  }),
  makeInstrument({
    ...draft, id: 'au-scams-prevention-framework', title: 'Scams Prevention Framework Act 2025', shortTitle: 'Scams Prevention Framework', issuer: 'Australian Parliament', jurisdiction: 'Australia - designated sectors', region: 'Australia', authorityClass: 'law', authorityNote: 'Legislation; obligations apply to designated sectors through rules and codes', status: 'phased', published: '2025-02', effective: 'Sector rules and codes in development (exposure drafts May 2026)',
    officialUrl: 'https://www.legislation.gov.au/C2025A00015/asmade/text',
    summary: 'Requires regulated businesses, starting with banks, telcos and some digital platforms, to take reasonable steps to prevent, detect, report, disrupt and respond to scams, with penalties of up to $50 million. AI-enabled impersonation raises the bar for what counts as reasonable.', applicability: 'Applies to sectors designated by the Minister, with detail set by rules and sector codes.', sectors: ['Banking', 'Telecommunications', 'Digital platforms'],
    conceptIds: ['adversarial-risk', 'incident-response', 'accountability', 'continuous-monitoring'], detailAvailability: 'full-public-text',
    provisions: [
      section('spf-principles', 'SPF principles', 'Prevent, detect, report, disrupt, respond', 'Sets overarching principles for governance, prevention, detection, reporting, disruption and response, enforced through rules and sector codes.', ['adversarial-risk', 'incident-response', 'continuous-monitoring']),
    ],
  }),
  makeInstrument({
    ...draft, id: 'apra-cpg-234', title: 'Prudential Practice Guide CPG 234 Information Security', shortTitle: 'APRA CPG 234', issuer: 'Australian Prudential Regulation Authority', jurisdiction: 'Australia - APRA-regulated entities', region: 'Australia', authorityClass: 'policy-guidance', authorityNote: 'Prudential practice guidance; not binding', status: 'active', published: '2019-06',
    officialUrl: 'https://www.apra.gov.au/practice-guides/cpg-234',
    summary: 'APRA’s guidance on implementing CPS 234: information security roles, capability, controls, testing, incident management and assurance, including over third parties.', applicability: 'Guidance for APRA-regulated entities. The binding requirements are in CPS 234.', sectors: ['Banking', 'Insurance', 'Superannuation'],
    conceptIds: ['ai-security', 'access-control', 'third-party-risk', 'evaluation'], detailAvailability: 'full-public-text',
    provisions: [
      section('cpg234-testing', 'Testing control effectiveness', 'Testing and assurance', 'Describes systematic testing of information security controls and independent assurance, relevant to AI systems handling sensitive data.', ['evaluation', 'ai-security', 'assurance']),
    ],
  }),

  /* Global financial regulators */
  makeInstrument({
    ...draft, id: 'mas-airm-guidelines-cp', title: 'Consultation Paper on Guidelines on Artificial Intelligence Risk Management', shortTitle: 'MAS AI Risk Guidelines (CP)', issuer: 'Monetary Authority of Singapore', jurisdiction: 'Singapore - all financial institutions', region: 'Singapore', authorityClass: 'policy-guidance', authorityNote: 'Proposed supervisory guidelines; final version pending', status: 'closed-consultation', published: '2025-11-13', effective: 'Final guidelines pending; 12-month transition proposed',
    officialUrl: 'https://www.mas.gov.sg/-/media/mas-media-library/publications/consultations/bd/2025/final_consultation_paper_on_guidelines_on_ai_risk_management_forrelease.pdf',
    summary: 'Proposed MAS expectations for how every financial institution governs AI, including generative and agentic AI: board and senior management oversight, an AI inventory with risk materiality, lifecycle controls and the capability to manage AI.', applicability: 'Consultation closed 31 January 2026. MAS said in August 2026 the guidelines would be finalised soon; update this record when they are.', sectors: ['Banking', 'Insurance', 'Capital markets'],
    conceptIds: ['accountability', 'inventory', 'materiality', 'lifecycle-governance', 'evaluation', 'agent-authority'], detailAvailability: 'full-public-text',
    provisions: [
      section('mas-airm-oversight', 'Oversight', 'Board and senior management', 'Boards and senior management oversee AI risk, set policies and ensure the institution has the capabilities to use AI responsibly.', ['accountability', 'competence']),
      section('mas-airm-inventory', 'Identification and inventory', 'Know every AI use and its materiality', 'Institutions identify AI use across the organisation, keep an inventory and assess each use’s risk materiality to scale controls.', ['inventory', 'materiality']),
      section('mas-airm-lifecycle', 'Lifecycle controls', 'From data to monitoring', 'Proportionate controls over data, fairness, explainability, human oversight, third parties, evaluation, monitoring and change management.', ['lifecycle-governance', 'evaluation', 'human-oversight', 'third-party-risk']),
    ],
  }),
  makeInstrument({
    ...draft, id: 'iosco-ai-toolkit', title: 'Supervisory Toolkit for AI Use in Capital Markets: Final Report', shortTitle: 'IOSCO AI Toolkit', issuer: 'International Organization of Securities Commissions', jurisdiction: 'International - securities regulators', region: 'Global', authorityClass: 'policy-guidance', authorityNote: 'Non-binding supervisory toolkit for member regulators', status: 'active', published: '2026-05-25',
    officialUrl: 'https://www.iosco.org/library/pubdocs/pdf/IOSCOPD823.pdf',
    summary: 'Practical, lifecycle-wide tools for securities regulators supervising firms’ AI, from traditional machine learning to generative and agentic AI. Builds on IOSCO’s March 2025 report on AI use cases, risks and challenges.', applicability: 'Written for regulators, but shows firms what supervisors are likely to ask. It is not a binding standard.', sectors: ['Capital markets', 'Asset management'],
    conceptIds: ['lifecycle-governance', 'evaluation', 'explainability', 'third-party-risk', 'accountability'], detailAvailability: 'full-public-text',
    provisions: [
      section('iosco-toolkit-lifecycle', 'Lifecycle supervision', 'What supervisors examine', 'Organises supervisory questions across the AI lifecycle: governance, data, development, testing, deployment, monitoring and third-party reliance.', ['lifecycle-governance', 'evaluation', 'third-party-risk']),
    ],
  }),
  makeInstrument({
    ...draft, id: 'iais-ai-application-paper', title: 'Application Paper on the supervision of artificial intelligence', shortTitle: 'IAIS AI Application Paper', issuer: 'International Association of Insurance Supervisors', jurisdiction: 'International - insurance supervisors', region: 'Global', authorityClass: 'policy-guidance', authorityNote: 'Supervisory guidance on applying the Insurance Core Principles', status: 'active', published: '2025-07-02',
    officialUrl: 'https://www.iais.org/uploads/2025/07/Application-Paper-on-the-supervision-of-artificial-intelligence.pdf',
    summary: 'How insurance supervisors and insurers apply existing Insurance Core Principles to AI: governance and accountability, robustness and security, transparency and explainability, and fairness to customers.', applicability: 'Guidance for supervisors, applied proportionately. It does not create new standards.', sectors: ['Insurance'],
    conceptIds: ['accountability', 'reliability', 'explainability', 'fairness-bias', 'transparency-disclosure'], detailAvailability: 'full-public-text',
    provisions: [
      section('iais-ai-governance', 'Governance and accountability', 'Existing principles, applied to AI', 'Insurers remain accountable for AI outcomes, including from third-party systems, with risk management proportionate to the use.', ['accountability', 'third-party-risk']),
      section('iais-ai-fairness', 'Fair treatment of customers', 'Fairness, transparency and redress', 'Addresses unfair discrimination, explainability to customers and routes to challenge AI-supported decisions.', ['fairness-bias', 'explainability', 'contestability']),
    ],
  }),
  makeInstrument({
    ...draft, id: 'eiopa-ai-opinion', title: 'Opinion on Artificial Intelligence governance and risk management', shortTitle: 'EIOPA AI Opinion', issuer: 'European Insurance and Occupational Pensions Authority', jurisdiction: 'European Union - insurance', region: 'Europe', authorityClass: 'policy-guidance', authorityNote: 'Supervisory opinion addressed to national authorities', status: 'active', published: '2025-08-06',
    officialUrl: 'https://www.eiopa.europa.eu/publications/opinion-artificial-intelligence-governance-and-risk-management_en',
    summary: 'Explains how existing insurance law (Solvency II, IDD, DORA) applies to AI systems that are not prohibited or high-risk under the AI Act: risk-based governance, fairness, data, documentation, explainability and human oversight.', applicability: 'Interpretive guidance for supervisors; it introduces no new rules. High-risk life and health pricing systems fall under the AI Act instead.', sectors: ['Insurance', 'Pensions'],
    conceptIds: ['lifecycle-governance', 'fairness-bias', 'data-governance', 'documentation', 'explainability', 'human-oversight'], detailAvailability: 'full-public-text',
    provisions: [
      section('eiopa-ai-proportionate', 'Risk-based approach', 'Proportionate AI governance', 'Governance and risk management scale with the impact of each AI system on customers and the undertaking.', ['materiality', 'lifecycle-governance']),
    ],
  }),
  makeInstrument({
    ...draft, id: 'fca-mills-review', title: 'The Mills Review: the long-term impact of AI on retail financial services', shortTitle: 'FCA Mills Review', issuer: 'Financial Conduct Authority', jurisdiction: 'United Kingdom', region: 'United Kingdom', authorityClass: 'research-database', authorityNote: 'Regulator-commissioned review; recommendations, not rules', status: 'active', published: '2026-07-06',
    officialUrl: 'https://www.fca.org.uk/publications/calls-input/review-long-term-impact-ai-retail-financial-services-mills-review',
    summary: 'Looks at how AI could reshape retail financial services by 2030, including AI agents acting for consumers, and sets seven priority recommendations for the FCA’s response.', applicability: 'Sets direction for FCA policy. Existing rules such as the Consumer Duty continue to apply to AI.', sectors: ['Retail financial services'],
    conceptIds: ['agent-authority', 'accountability', 'fairness-bias', 'systemic-risk'], detailAvailability: 'full-public-text',
    provisions: [
      section('mills-agents', 'AI acting for consumers', 'From assistant to decision-maker', 'Considers what happens to consumer protection when AI agents choose and switch products on customers’ behalf.', ['agent-authority', 'accountability']),
    ],
  }),
  makeInstrument({
    ...draft, id: 'hkma-genai-consumer-protection', title: 'Consumer Protection in respect of Use of Generative Artificial Intelligence', shortTitle: 'HKMA GenAI Circular', issuer: 'Hong Kong Monetary Authority', jurisdiction: 'Hong Kong - authorized institutions', region: 'Hong Kong', authorityClass: 'policy-guidance', authorityNote: 'Supervisory circular to authorized institutions', status: 'active', published: '2024-08-19',
    officialUrl: 'https://brdr.hkma.gov.hk/eng/doc-ldg/docId/20241107-1-EN',
    summary: 'Guiding principles for banks using generative AI in customer-facing applications, extending the HKMA’s 2019 big data and AI principles: governance, fairness, transparency, data protection, output monitoring and human review.', applicability: 'Applies to authorized institutions in Hong Kong using GenAI with customers.', sectors: ['Banking'],
    conceptIds: ['transparency-disclosure', 'human-oversight', 'contestability', 'continuous-monitoring', 'fairness-bias'], detailAvailability: 'full-public-text',
    provisions: [
      section('hkma-genai-human', 'Human intervention', 'Opt-out and human review', 'Customers should be able to opt out of GenAI or ask for human review where practicable, and outputs should be monitored for quality and harm.', ['human-oversight', 'contestability', 'continuous-monitoring']),
    ],
  }),
  makeInstrument({
    ...draft, id: 'sfc-genai-circular', title: 'Circular to licensed corporations: Use of generative AI language models', shortTitle: 'SFC GenAI Circular', issuer: 'Securities and Futures Commission of Hong Kong', jurisdiction: 'Hong Kong - licensed corporations', region: 'Hong Kong', authorityClass: 'policy-guidance', authorityNote: 'Supervisory circular to licensed corporations', status: 'active', published: '2024-11-12',
    officialUrl: 'https://apps.sfc.hk/edistributionWeb/gateway/EN/circular/doc?refNo=24EC55',
    summary: 'Expectations for licensed corporations using generative AI language models, built or bought: senior management oversight, model risk management, cyber security and data, and third-party risk, with extra safeguards for high-risk uses such as investment advice.', applicability: 'Applies to SFC-licensed corporations using AI language models in regulated activities.', sectors: ['Capital markets', 'Asset management'],
    conceptIds: ['accountability', 'materiality', 'evaluation', 'ai-security', 'third-party-risk', 'human-oversight'], detailAvailability: 'full-public-text',
    provisions: [
      section('sfc-genai-principles', 'Core principles', 'Four areas of control', 'Senior management responsibilities, AI model risk management, cyber security and data risk management, and third-party provider risk.', ['accountability', 'evaluation', 'ai-security', 'third-party-risk']),
      section('sfc-genai-high-risk', 'High-risk use cases', 'Extra safeguards', 'High-risk uses, such as providing investment recommendations, need a human in the loop, output accuracy checks and disclosure to clients.', ['materiality', 'human-oversight', 'transparency-disclosure']),
    ],
  }),
  makeInstrument({
    ...draft, id: 'naic-ai-model-bulletin', title: 'Model Bulletin: Use of Artificial Intelligence Systems by Insurers', shortTitle: 'NAIC AI Model Bulletin', issuer: 'National Association of Insurance Commissioners', jurisdiction: 'United States - adopting states', region: 'United States', authorityClass: 'policy-guidance', authorityNote: 'Model bulletin; effect depends on each state’s adoption', status: 'active', published: '2023-12',
    officialUrl: 'https://content.naic.org/sites/default/files/legal-adoption-map-ai-model-bulletin.pdf',
    summary: 'Expects insurers to run a written AI systems program covering governance, risk management, internal controls and third-party systems, so AI-supported decisions comply with unfair-trade and unfair-discrimination laws. About 25 states and territories had adopted it by mid-2026.', applicability: 'Applies in states that issue it. Other states rely on existing insurance law or their own AI rules.', sectors: ['Insurance'],
    conceptIds: ['accountability', 'fairness-bias', 'third-party-risk', 'documentation'], detailAvailability: 'full-public-text',
    provisions: [
      section('naic-aisp', 'AIS program', 'A written AI systems program', 'Insurers document governance, risk management and controls for AI systems across the lifecycle, proportionate to consumer impact.', ['accountability', 'lifecycle-governance', 'documentation']),
    ],
  }),
  makeInstrument({
    ...draft, id: 'eba-ai-act-mapping', title: 'AI Act implications for the EU banking and payments sector', shortTitle: 'EBA AI Act Mapping', issuer: 'European Banking Authority', jurisdiction: 'European Union - banking and payments', region: 'Europe', authorityClass: 'research-database', authorityNote: 'Supervisory analysis; not guidelines', status: 'active', published: '2025-11',
    officialUrl: 'https://www.eba.europa.eu/sites/default/files/2025-11/d8b999ce-a1d9-4964-9606-971bbc2aaf89/AI%20Act%20implications%20for%20the%20EU%20banking%20sector.pdf',
    summary: 'Maps AI Act high-risk requirements, especially for creditworthiness assessment and credit scoring, against EU banking and payments law. Finds no significant contradictions and no immediate need for new EBA guidelines.', applicability: 'Analysis to support consistent supervision; it does not change obligations.', sectors: ['Banking', 'Payments'],
    conceptIds: ['lifecycle-governance', 'fairness-bias', 'data-governance', 'human-oversight'], detailAvailability: 'full-public-text',
    provisions: [
      section('eba-mapping-credit', 'Credit scoring', 'High-risk use under two regimes', 'Shows how credit-scoring AI meets both AI Act requirements and existing banking rules on governance, data and model risk.', ['fairness-bias', 'data-governance', 'lifecycle-governance']),
    ],
  }),
  makeInstrument({
    ...draft, id: 'esma-ai-statement', title: 'Public Statement on AI and investment services', shortTitle: 'ESMA AI Statement', issuer: 'European Securities and Markets Authority', jurisdiction: 'European Union - investment firms', region: 'Europe', authorityClass: 'policy-guidance', authorityNote: 'Supervisory statement on MiFID II obligations', status: 'active', published: '2024-05-30',
    officialUrl: 'https://www.esma.europa.eu/document/public-statement-ai-and-investment-services',
    summary: 'How MiFID II obligations apply when investment firms use AI with retail clients: acting in clients’ best interests, clear disclosure of AI use, management accountability, and ongoing checks on AI-produced information.', applicability: 'Initial guidance for firms providing investment services to retail clients.', sectors: ['Investment services'],
    conceptIds: ['transparency-disclosure', 'accountability', 'continuous-monitoring', 'reliability'], detailAvailability: 'full-public-text',
    provisions: [
      section('esma-ai-controls', 'Organisational requirements', 'Controls on AI outputs', 'Firms should test and monitor AI tools and run frequent after-the-fact checks on information AI delivers to clients.', ['continuous-monitoring', 'evaluation', 'reliability']),
    ],
  }),
  makeInstrument({
    ...draft, id: 'boe-fsif-ai', title: 'Financial Stability in Focus: Artificial intelligence in the financial system', shortTitle: 'BoE AI Financial Stability', issuer: 'Bank of England Financial Policy Committee', jurisdiction: 'United Kingdom', region: 'United Kingdom', authorityClass: 'research-database', authorityNote: 'Central bank analysis; not rules', status: 'active', published: '2025-04',
    officialUrl: 'https://www.bankofengland.co.uk/financial-stability-in-focus/2025/april-2025',
    summary: 'Sets out four channels through which AI could affect financial stability: banks’ and insurers’ core decisions, financial markets, operational reliance on AI service providers, and AI-enabled cyber threats.', applicability: 'Macroprudential analysis that informs Bank of England and PRA supervision.', sectors: ['Banking', 'Insurance', 'Capital markets'],
    conceptIds: ['systemic-risk', 'third-party-risk', 'operational-resilience', 'adversarial-risk'], detailAvailability: 'full-public-text',
    provisions: [
      section('boe-ai-channels', 'Transmission channels', 'How AI could threaten stability', 'Correlated model behaviour, concentration in a few AI providers and faster, cheaper cyber attacks are the main channels of concern.', ['systemic-risk', 'third-party-risk', 'adversarial-risk']),
    ],
  }),
  makeInstrument({
    ...draft, id: 'japan-fsa-ai-discussion-paper', title: 'AI Discussion Paper: Preliminary Discussion Points for Promoting the Sound Utilization of AI in the Financial Sector', shortTitle: 'Japan FSA AI Paper', issuer: 'Financial Services Agency of Japan', jurisdiction: 'Japan', region: 'Japan', authorityClass: 'research-database', authorityNote: 'Supervisory discussion paper; not rules', status: 'active', published: '2025-03-04', effective: 'Version 1.1 published 3 March 2026',
    officialUrl: 'https://www.fsa.go.jp/en/news/2026/20260303/aidp.html',
    summary: 'The FSA’s supervisory stance on AI in finance, encouraging adoption while addressing governance, risk management and how existing rules apply. It highlights the “risk of inaction” from falling behind.', applicability: 'Discussion points informed by a public-private forum; not binding guidance.', sectors: ['Banking', 'Insurance', 'Capital markets'],
    conceptIds: ['accountability', 'risk-treatment', 'competence'], detailAvailability: 'full-public-text',
    provisions: [
      section('fsa-ai-inaction', 'Risk of inaction', 'Balancing adoption and risk', 'Frames AI governance as enabling safe adoption, with risk management proportionate to use rather than blanket restriction.', ['risk-treatment', 'accountability']),
    ],
  }),
]

export const reviewRelations: InstrumentRelation[] = [
  { id: 'cpg230-guides-cps230', sourceId: 'apra-cpg-230', targetId: 'apra-cps-230', type: 'guides-implementation-of', explanation: 'APRA issues CPG 230 as guidance on meeting CPS 230.', basis: 'explicit', confidence: 'high', sourceAnchors: ['CPG 230'] },
  { id: 'cpg234-guides-cps234', sourceId: 'apra-cpg-234', targetId: 'apra-cps-234', type: 'guides-implementation-of', explanation: 'APRA issues CPG 234 as guidance on meeting CPS 234.', basis: 'explicit', confidence: 'high', sourceAnchors: ['CPG 234'] },
  { id: 'oaic-genai-interprets-privacy', sourceId: 'oaic-genai-training', targetId: 'au-privacy-act', type: 'interprets', explanation: 'The OAIC explains how the Australian Privacy Principles apply to training generative AI.', basis: 'explicit', confidence: 'high', sourceAnchors: ['APPs 1, 3, 5, 6 and 10'] },
  { id: 'oaic-adm-interprets-privacy', sourceId: 'oaic-adm-transparency', targetId: 'au-privacy-act', type: 'interprets', explanation: 'The consultation informs guidance on the APP 1 automated decision-making obligation.', basis: 'explicit', confidence: 'high', sourceAnchors: ['APP 1'] },
  { id: 'oaic-genai-complements-commercial', sourceId: 'oaic-genai-training', targetId: 'oaic-commercial-ai', type: 'complements', explanation: 'The OAIC published the developer guide and the commercial-products guide as a pair.', basis: 'explicit', confidence: 'high', sourceAnchors: ['OAIC AI guidance, October 2024'] },
  { id: 'rg234-interprets-asic-act', sourceId: 'asic-rg-234', targetId: 'au-asic-act', type: 'interprets', explanation: 'RG 234 gives ASIC’s view on complying with prohibitions on misleading financial advertising.', basis: 'explicit', confidence: 'medium', sourceAnchors: ['RG 234'] },
  { id: 'dta-standard-implements-policy', sourceId: 'dta-ai-technical-standard', targetId: 'dta-ai-policy', type: 'guides-implementation-of', explanation: 'The DTA describes the technical standard as supporting the policy for responsible use of AI in government.', basis: 'explicit', confidence: 'high', sourceAnchors: ['AI technical standard'] },
  { id: 'national-plan-adoption-guidance', sourceId: 'au-national-ai-plan', targetId: 'au-ai-adoption-guidance', type: 'complements', explanation: 'The Plan relies on the Guidance for AI Adoption as the main voluntary governance guidance.', basis: 'explicit', confidence: 'medium', sourceAnchors: ['National AI Plan: Keep Australians safe'] },
  { id: 'aicd-guide-frontier-board', sourceId: 'aicd-hti-director-guide', targetId: 'asd-frontier-board', type: 'complements', explanation: 'Both are written for Australian boards; the ASD–AICD guide focuses on frontier AI cyber risk.', basis: 'cross-framework-synthesis', confidence: 'medium', sourceAnchors: ['Atlas interpretation'] },
  { id: 'mas-cp-extends-mrm', sourceId: 'mas-airm-guidelines-cp', targetId: 'mas-ai-mrm', type: 'extends', explanation: 'MAS’s proposed guidelines build on the supervisory observations in its 2024 AI model risk information paper.', basis: 'explicit', confidence: 'medium', sourceAnchors: ['Consultation paper, November 2025'] },
  { id: 'mas-cp-complements-feat', sourceId: 'mas-airm-guidelines-cp', targetId: 'mas-feat', type: 'complements', explanation: 'The FEAT principles remain relevant alongside the proposed risk management guidelines.', basis: 'cross-framework-synthesis', confidence: 'medium', sourceAnchors: ['Atlas interpretation'] },
  { id: 'iosco-complements-fsb', sourceId: 'iosco-ai-toolkit', targetId: 'fsb-ai-sound-practices', type: 'complements', explanation: 'IOSCO addresses capital markets supervision while the FSB works across the financial system.', basis: 'cross-framework-synthesis', confidence: 'medium', sourceAnchors: ['Atlas interpretation'] },
  { id: 'iais-complements-fsb', sourceId: 'iais-ai-application-paper', targetId: 'fsb-ai-sound-practices', type: 'complements', explanation: 'The IAIS applies insurance principles to AI; the FSB considers cross-sector practices.', basis: 'cross-framework-synthesis', confidence: 'medium', sourceAnchors: ['Atlas interpretation'] },
  { id: 'eiopa-co-applies-ai-act', sourceId: 'eiopa-ai-opinion', targetId: 'eu-ai-act', type: 'co-applies-with', explanation: 'EIOPA covers AI in insurance that is not prohibited or high-risk under the AI Act.', basis: 'explicit', confidence: 'high', sourceAnchors: ['Opinion scope'] },
  { id: 'eba-maps-ai-act', sourceId: 'eba-ai-act-mapping', targetId: 'eu-ai-act', type: 'maps-to', explanation: 'The EBA maps AI Act high-risk requirements against banking and payments law.', basis: 'explicit', confidence: 'high', sourceAnchors: ['EBA factsheet, November 2025'] },
  { id: 'eba-maps-dora', sourceId: 'eba-ai-act-mapping', targetId: 'eu-dora', type: 'co-applies-with', explanation: 'Banking-sector ICT and third-party requirements apply alongside the AI Act.', basis: 'cross-framework-synthesis', confidence: 'medium', sourceAnchors: ['Atlas interpretation'] },
  { id: 'esma-complements-ai-act', sourceId: 'esma-ai-statement', targetId: 'eu-ai-act', type: 'complements', explanation: 'ESMA addresses MiFID II conduct duties for AI; the AI Act adds product-level obligations.', basis: 'cross-framework-synthesis', confidence: 'medium', sourceAnchors: ['Atlas interpretation'] },
  { id: 'mills-complements-white-paper', sourceId: 'fca-mills-review', targetId: 'uk-ai-white-paper', type: 'complements', explanation: 'The FCA applies the UK’s sector-led approach to retail financial services.', basis: 'cross-framework-synthesis', confidence: 'medium', sourceAnchors: ['Atlas interpretation'] },
  { id: 'boe-complements-pra', sourceId: 'boe-fsif-ai', targetId: 'uk-pra-ss1-23', type: 'complements', explanation: 'System-wide AI risk analysis sits alongside the PRA’s model risk expectations for firms.', basis: 'cross-framework-synthesis', confidence: 'medium', sourceAnchors: ['Atlas interpretation'] },
  { id: 'sfc-complements-hkma', sourceId: 'sfc-genai-circular', targetId: 'hkma-genai-consumer-protection', type: 'complements', explanation: 'Hong Kong’s securities and banking regulators set parallel expectations for generative AI.', basis: 'cross-framework-synthesis', confidence: 'medium', sourceAnchors: ['Atlas interpretation'] },
]

/* Corrections to existing records (section C of the review). */
export const reviewCorrections: Record<string, Partial<SourceRecord>> = {
  'au-ai-adoption-guidance': { published: '2025-10-21', effective: 'Updated 5 May 2026', applicability: 'Voluntary economy-wide guidance that replaced the 2024 Voluntary AI Safety Standard. It is not a compliance standard or regulator-approved control assessment.' },
  'eu-ai-act': { applicability: 'Applies based on provider, deployer, product, location and market criteria. The Digital Omnibus on AI (in force 27 July 2026) moved high-risk dates to 2 December 2027 (Annex III) and 2 August 2028 (Annex I). Legal advice is needed for specific scope.' },
  'uk-ai-white-paper': { authorityNote: 'Current UK policy framework; the government has said there will be no horizontal AI bill in the short to medium term' },
  'us-sr-26-2': { applicability: 'Applies according to agency and institution scope. It supersedes SR 11-7 and SR 21-8. Generative and agentic AI are outside its scope and need separate governance.' },
  'mas-ai-mrm': { summary: 'MAS’s 2024 information paper on supervisory observations about governance, inventory, development, validation, deployment and monitoring of AI models. It led to the proposed AI Risk Management Guidelines.' },
  'iso-42001': { applicability: 'Voluntary international management-system standard unless adopted by contract, policy or law. Adopted in Australia as AS ISO/IEC 42001:2023. Full text is licensed.' },
}

/* Extra sections for existing records. */
export const reviewSections: Record<string, SourceProvision[]> = {
  'au-privacy-act': [
    section('au-privacy-app1-adm', 'APP 1 (automated decisions)', 'Automated decision-making transparency', 'From 10 December 2026, privacy policies must describe the kinds of personal information used, and the kinds of decisions made, by computer programs in decisions that could significantly affect individuals.', ['transparency-disclosure', 'privacy', 'explainability']),
  ],
}

/* Announcements kept as What's new items rather than permanent sources (section D), and a low-value report removed. */
export const retiredSourceIds = new Set(['apra-frontier-speech-2026', 'apra-asic-frontier-roundtables-2026', 'fsb-frontier-letter-2026', 'five-eyes-frontier-statement', 'iso-tr-24028'])
