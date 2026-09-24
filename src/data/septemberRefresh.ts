import type { SourceRecord, SourceProvision } from '../types.js'
const reviewedAt = '2026-09-07'
const note = 'Targeted source-page review on 7 September 2026. Original synopsis; topic connections are Atlas interpretation.'

export const septemberSources: SourceRecord[] = [
  {
    id: 'owasp-agent-control-standard', title: 'OWASP Agent Control Standard (ACS)', shortTitle: 'OWASP ACS', issuer: 'OWASP GenAI Security Project', jurisdiction: 'Global community reference', region: 'Global', authorityClass: 'testing-tool', authorityNote: "Voluntary implementation specification and tooling", status: 'living', published: '2026-09-01', lastVerified: reviewedAt,
    officialUrl: 'https://genai.owasp.org/resource/agent-control-standard-acs/',
    summary: 'An open approach to enforcing portable safety policies through hooks in agent platforms.',
    applicability: 'Community technical resource for agent platforms. Inclusion does not establish implementation, control effectiveness or compliance. Review covers the official overview, not the full implementation.',
    sectors: ['Cross-sector'], conceptIds: ['agent-authority', 'runtime-guardrails', 'traceability', 'access-control'], detailAvailability: 'public-summary',
    provisions: [{id: 'acs-runtime-hooks', ref: 'Official overview', title: 'Portable controls for agent actions', summary: 'Describes middleware hooks through which agent platforms can apply declarative policies at runtime and make agent actions inspectable.', conceptIds: ['runtime-guardrails', 'agent-authority', 'traceability'], sourceUrl: 'https://genai.owasp.org/resource/agent-control-standard-acs/', reviewedAt, note}],
  },
  {
    id: 'owasp-genai-crosswalk', title: 'OWASP GenAI Security Industry Framework Crosswalk', shortTitle: 'OWASP GenAI Crosswalk', issuer: 'OWASP GenAI Security Project', jurisdiction: 'Global community reference', region: 'Global', authorityClass: 'research-database', authorityNote: "Informational mapping reference", status: 'living', published: '2026-09-01', lastVerified: reviewedAt,
    officialUrl: 'https://genai.owasp.org/resource/genai-security-industry-framework-crosswalk/',
    summary: 'A published crosswalk connecting GenAI security risks with security and governance frameworks.',
    applicability: 'A navigation aid for comparing frameworks. The overview was reviewed; individual crosswalk rows have not been imported or validated. Mappings do not establish equivalence, applicability or effective risk reduction.',
    sectors: ['Cross-sector'], conceptIds: ['ai-security', 'risk-treatment', 'evidence-quality'], detailAvailability: 'public-summary',
    provisions: [{id: 'owasp-crosswalk-overview', ref: 'Official overview', title: 'Find related framework controls', summary: 'OWASP describes connections between GenAI vulnerabilities and frameworks including NIST, ISO, MITRE ATLAS and the EU AI Act. Inspect the published crosswalk for individual mappings.', conceptIds: ['ai-security', 'risk-treatment', 'evidence-quality'], sourceUrl: 'https://genai.owasp.org/resource/genai-security-industry-framework-crosswalk/', reviewedAt, note}],
  },
  {
    id: 'nist-critical-infrastructure-concept', title: 'Concept Note: AI RMF Profile on Trustworthy AI in Critical Infrastructure', shortTitle: 'NIST Critical Infrastructure', issuer: 'National Institute of Standards and Technology', jurisdiction: 'United States - voluntary reference', region: 'United States', authorityClass: 'research-database', authorityNote: "Concept stage; not a final profile", status: 'living', published: '2026-04-07', lastVerified: reviewedAt,
    officialUrl: 'https://www.nist.gov/programs-projects/concept-note-ai-rmf-profile-trustworthy-ai-critical-infrastructure',
    summary: 'An ongoing NIST project to tailor AI risk-management practices to critical infrastructure.',
    applicability: 'Concept-stage work, not a final profile or mandatory standard. The project overview was updated on 17 July 2026. Review covers that overview, not a completed framework.',
    sectors: ['Critical infrastructure', 'Financial services'], conceptIds: ['operational-resilience', 'lifecycle-governance', 'supply-chain', 'agent-authority'], detailAvailability: 'public-summary',
    provisions: [{id: 'nist-ci-concept-overview', ref: 'Project overview', title: 'Risk practices for critical infrastructure', summary: 'The planned profile will help operators communicate AI trustworthiness needs across development, operation and supply chains.', conceptIds: ['operational-resilience', 'lifecycle-governance', 'supply-chain'], sourceUrl: 'https://www.nist.gov/programs-projects/concept-note-ai-rmf-profile-trustworthy-ai-critical-infrastructure', reviewedAt, note}],
  },
]

export const septemberSections: Record<string, SourceProvision[]> = {
  'eu-ai-act': [{id: 'eu-ai-act-2026-timeline', ref: 'Regulation (EU) 2026/1744, Article 1(39)-(40)', title: 'Updated application dates', summary: 'Annex III high-risk rules apply from 2 December 2027; Annex I high-risk rules from 2 August 2028. Article 50 transparency rules generally apply from 2 August 2026, with a 2 December 2026 transition for Article 50(2) for qualifying systems already on the market.', conceptIds: ['lifecycle-governance', 'transparency-disclosure', 'documentation'], sourceUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=OJ:L_202601744', reviewedAt, note: `${note} Check the amended law for scope, exceptions and transitional arrangements; the Atlas does not decide applicability.`}],
  'nist-ai-rmf': [{id: 'nist-rmf-revision-2026', ref: 'Official AI RMF landing page', title: 'AI RMF revision underway', summary: 'NIST states that AI RMF 1.0 is being revised. Version 1.0 remains linked on the official page; this entry does not imply a replacement has been finalised.', conceptIds: ['lifecycle-governance', 'risk-treatment'], sourceUrl: 'https://www.nist.gov/itl/ai-risk-management-framework', reviewedAt, note}],
}
