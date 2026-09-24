import type { SourceRecord, InstrumentRelation } from '../types.js'
import { makeInstrument } from './makeInstrument'

/*
 * Assurance standards: how independent practitioners plan, perform and report
 * engagements over AI governance and controls. Drafted 24 September 2026 for
 * editorial review. Summaries are original synopses; titles, dates and
 * official URLs were checked against the issuers' public pages.
 */
const drafted = '2026-09-24'
const note = 'Draft prepared for editorial review. Original synopsis; confirm scope and edition against the issuer’s current text before relying on it.'

export const assuranceInstruments: SourceRecord[] = [
  makeInstrument({
    id: 'isae-3000', title: 'ISAE 3000 (Revised) Assurance Engagements Other than Audits or Reviews of Historical Financial Information', shortTitle: 'ISAE 3000 (Revised)', issuer: 'International Auditing and Assurance Standards Board (IAASB)', jurisdiction: 'International', region: 'Global', authorityClass: 'assurance-standard', authorityNote: 'Professional standard for assurance practitioners; applies to the engagement, not to the entity being assured', status: 'active', published: '2013-12', effective: 'Assurance reports dated on or after 15 December 2015', lastVerified: drafted, editorialStatus: 'draft',
    officialUrl: 'https://www.iaasb.org/publications/international-standard-assurance-engagements-isae-3000-revised-assurance-engagements-other-audits-or-0',
    summary: 'The umbrella international standard for assurance engagements on subject matter other than historical financial information — the usual basis for independent assurance over AI governance, controls or reported AI information.', applicability: 'Governs professional accountants performing assurance engagements. It requires suitable criteria and an appropriate subject matter; it does not itself define criteria for AI systems.', sectors: ['Cross-sector'],
    conceptIds: ['assurance', 'evidence-quality', 'auditability', 'materiality', 'documentation'], detailAvailability: 'full-public-text',
    provisions: [
      { id: 'isae3000-preconditions', ref: 'Preconditions', title: 'Suitable criteria and appropriate subject matter', summary: 'An engagement is accepted only where the underlying subject matter is appropriate and the criteria are suitable and available to intended users.', conceptIds: ['assurance', 'materiality'], granularity: 'section', editorialStatus: 'draft', reviewedAt: drafted, note },
      { id: 'isae3000-levels', ref: 'Reasonable and limited assurance', title: 'Two levels of assurance', summary: 'Distinguishes reasonable assurance (a positive-form opinion) from limited assurance (a conclusion that nothing has come to the practitioner’s attention), with different evidence depth.', conceptIds: ['assurance', 'evidence-quality'], granularity: 'section', editorialStatus: 'draft', reviewedAt: drafted, note },
      { id: 'isae3000-evidence', ref: 'Obtaining evidence', title: 'Evidence and materiality', summary: 'Requires sufficient appropriate evidence, consideration of materiality and professional scepticism, with documentation of work performed.', conceptIds: ['evidence-quality', 'auditability', 'documentation'], granularity: 'section', editorialStatus: 'draft', reviewedAt: drafted, note },
      { id: 'isae3000-report', ref: 'Assurance report', title: 'What the report must say', summary: 'The report identifies the subject matter, criteria, responsibilities, the level of assurance, inherent limitations and the practitioner’s conclusion.', conceptIds: ['assurance', 'transparency-disclosure'], granularity: 'section', editorialStatus: 'draft', reviewedAt: drafted, note },
    ],
  }),
  makeInstrument({
    id: 'asae-3000', title: 'ASAE 3000 Assurance Engagements Other than Audits or Reviews of Historical Financial Information', shortTitle: 'ASAE 3000', issuer: 'Auditing and Assurance Standards Board (AUASB)', jurisdiction: 'Australia', region: 'Australia', authorityClass: 'assurance-standard', authorityNote: 'Australian standard for assurance practitioners, equivalent to ISAE 3000 (Revised)', status: 'active', published: '2025-01', lastVerified: drafted, editorialStatus: 'draft',
    officialUrl: 'https://standards.auasb.gov.au/asae-3000-jan-2025',
    summary: 'The Australian equivalent of ISAE 3000 (Revised), used for assurance engagements on non-financial subject matter such as controls, compliance frameworks and AI governance information.', applicability: 'Applies to assurance practitioners performing engagements in Australia. It sets engagement requirements, not criteria for the entity’s AI systems.', sectors: ['Cross-sector', 'Financial services'],
    conceptIds: ['assurance', 'evidence-quality', 'auditability', 'materiality'], detailAvailability: 'full-public-text',
    provisions: [
      { id: 'asae3000-engagement', ref: 'Requirements', title: 'Planning and performing the engagement', summary: 'Sets requirements for engagement acceptance, planning, evidence, the practitioner’s expert and reporting, consistent with ISAE 3000 (Revised).', conceptIds: ['assurance', 'evidence-quality'], granularity: 'section', editorialStatus: 'draft', reviewedAt: drafted, note },
    ],
  }),
  makeInstrument({
    id: 'asae-3150', title: 'ASAE 3150 Assurance Engagements on Controls', shortTitle: 'ASAE 3150', issuer: 'Auditing and Assurance Standards Board (AUASB)', jurisdiction: 'Australia', region: 'Australia', authorityClass: 'assurance-standard', authorityNote: 'Australian subject-matter standard for assurance on controls, applied with ASAE 3000', status: 'active', published: '2022-12', lastVerified: drafted, editorialStatus: 'draft',
    officialUrl: 'https://standards.auasb.gov.au/asae-3150-sep-2022',
    summary: 'Assurance on the design, implementation and operating effectiveness of controls against identified control objectives — a natural fit for independent assurance over AI controls.', applicability: 'Applies to assurance practitioners reporting on controls at an entity, except service-organisation engagements covered by ASAE 3402.', sectors: ['Cross-sector', 'Financial services'],
    conceptIds: ['assurance', 'evidence-quality', 'auditability', 'evaluation'], detailAvailability: 'full-public-text',
    provisions: [
      { id: 'asae3150-design', ref: 'Design and description', title: 'Suitability of design', summary: 'The practitioner reports on whether controls are suitably designed to achieve identified control objectives and, where applicable, fairly described.', conceptIds: ['assurance', 'evaluation'], granularity: 'section', editorialStatus: 'draft', reviewedAt: drafted, note },
      { id: 'asae3150-operating', ref: 'Operating effectiveness', title: 'Controls operating over a period', summary: 'Where in scope, the practitioner tests whether controls operated effectively as designed throughout the specified period.', conceptIds: ['assurance', 'evidence-quality', 'continuous-monitoring'], granularity: 'section', editorialStatus: 'draft', reviewedAt: drafted, note },
    ],
  }),
  makeInstrument({
    id: 'isae-3402', title: 'ISAE 3402 Assurance Reports on Controls at a Service Organization', shortTitle: 'ISAE 3402', issuer: 'International Auditing and Assurance Standards Board (IAASB)', jurisdiction: 'International', region: 'Global', authorityClass: 'assurance-standard', authorityNote: 'Professional standard for service-organisation control reports', status: 'active', published: '2009-12', effective: 'Reports for periods ending on or after 15 June 2011', lastVerified: drafted, editorialStatus: 'draft',
    officialUrl: 'https://www.iaasb.org/projects/assurance-reports-service-organizations-controls',
    summary: 'Type 1 and Type 2 reports on a service organisation’s controls — relevant when AI capabilities are provided by a third party whose controls matter to its customers.', applicability: 'Focused on controls likely to be relevant to user entities’ internal control over financial reporting. Other subject matter usually falls under ISAE 3000.', sectors: ['Cross-sector', 'Financial services'],
    conceptIds: ['assurance', 'third-party-risk', 'evidence-quality'], detailAvailability: 'full-public-text',
    provisions: [
      { id: 'isae3402-types', ref: 'Type 1 and Type 2 reports', title: 'Design versus operating effectiveness', summary: 'A Type 1 report covers the description and design of controls at a point in time; a Type 2 report adds operating effectiveness over a period.', conceptIds: ['assurance', 'third-party-risk'], granularity: 'section', editorialStatus: 'draft', reviewedAt: drafted, note },
    ],
  }),
  makeInstrument({
    id: 'aicpa-soc2-tsc', title: '2017 Trust Services Criteria for Security, Availability, Processing Integrity, Confidentiality, and Privacy (With Revised Points of Focus — 2022)', shortTitle: 'SOC 2 Trust Services Criteria', issuer: 'AICPA Assurance Services Executive Committee', jurisdiction: 'United States - used internationally', region: 'United States', authorityClass: 'assurance-standard', authorityNote: 'Control criteria for attestation engagements (SOC 2)', status: 'active', published: '2022-10', lastVerified: drafted, editorialStatus: 'draft',
    officialUrl: 'https://www.aicpa-cima.com/resources/download/2017-trust-services-criteria-with-revised-points-of-focus-2022',
    summary: 'The criteria behind SOC 2 reports. Many AI vendors’ assurance packs rest on SOC 2, which evaluates security and related controls rather than AI-specific risks.', applicability: 'Criteria for attestation or consulting engagements on controls. A SOC 2 report does not by itself address model behaviour, fairness or AI-specific governance.', sectors: ['Cross-sector', 'AI providers'],
    conceptIds: ['assurance', 'ai-security', 'access-control', 'privacy', 'third-party-risk', 'reliability'], detailAvailability: 'full-public-text',
    provisions: [
      { id: 'soc2-common-criteria', ref: 'Common criteria (CC series)', title: 'Security common criteria', summary: 'Criteria spanning control environment, risk assessment, monitoring, logical access, system operations and change management.', conceptIds: ['ai-security', 'access-control', 'change-management', 'continuous-monitoring'], granularity: 'section', editorialStatus: 'draft', reviewedAt: drafted, note },
      { id: 'soc2-categories', ref: 'Additional categories', title: 'Availability, integrity, confidentiality, privacy', summary: 'Optional categories that extend a SOC 2 examination beyond security to the service commitments most relevant to users.', conceptIds: ['reliability', 'privacy', 'data-governance'], granularity: 'section', editorialStatus: 'draft', reviewedAt: drafted, note },
    ],
  }),
  makeInstrument({
    id: 'iso-42006', title: 'ISO/IEC 42006:2025 Requirements for bodies providing audit and certification of artificial intelligence management systems', shortTitle: 'ISO/IEC 42006', issuer: 'ISO and IEC', jurisdiction: 'International', region: 'Global', authorityClass: 'assurance-standard', authorityNote: 'Requirements for certification bodies, additional to ISO/IEC 17021-1', status: 'active', published: '2025-07-31', lastVerified: drafted, editorialStatus: 'draft',
    officialUrl: 'https://www.iso.org/standard/42006',
    summary: 'Sets additional requirements for bodies that audit and certify AI management systems against ISO/IEC 42001, including auditor competence and audit time.', applicability: 'Applies to certification bodies, not to the certified organisation. Certification is not assurance on AI outcomes or legal compliance. Full text is licensed.', sectors: ['Cross-sector'],
    conceptIds: ['assurance', 'competence', 'evidence-quality', 'auditability'], detailAvailability: 'licensed-standard',
    provisions: [
      { id: 'iso42006-competence', ref: 'Competence requirements', title: 'Competent AIMS auditors', summary: 'Specifies competence expected of personnel involved in AIMS certification, beyond generic management-system auditing.', conceptIds: ['competence', 'assurance'], granularity: 'clause', editorialStatus: 'draft', reviewedAt: drafted, note },
      { id: 'iso42006-audit', ref: 'Audit time and process', title: 'Planning a credible certification audit', summary: 'Adds requirements on audit time, access to documentation and certification documents for AI management systems.', conceptIds: ['assurance', 'evidence-quality', 'auditability'], granularity: 'clause', editorialStatus: 'draft', reviewedAt: drafted, note },
    ],
  }),
  makeInstrument({
    id: 'iia-gias', title: 'Global Internal Audit Standards', shortTitle: 'IIA Global Internal Audit Standards', issuer: 'The Institute of Internal Auditors', jurisdiction: 'International', region: 'Global', authorityClass: 'assurance-standard', authorityNote: 'Professional standards for internal audit functions', status: 'active', published: '2024-01-09', effective: '2025-01-09', lastVerified: drafted, editorialStatus: 'draft',
    officialUrl: 'https://www.theiia.org/en/standards/',
    summary: 'Five domains, fifteen principles and fifty-two standards for internal audit — the basis for third-line assurance over AI governance and risk management.', applicability: 'Applies to internal audit functions that conform to the Standards. Topical requirements and guidance may add expectations for specific risk areas.', sectors: ['Cross-sector'],
    conceptIds: ['assurance', 'accountability', 'evidence-quality', 'competence'], detailAvailability: 'full-public-text',
    provisions: [
      { id: 'gias-governing-internal-audit', ref: 'Domain III', title: 'Governing the internal audit function', summary: 'Board and senior management responsibilities for internal audit’s mandate, independence and resourcing.', conceptIds: ['accountability', 'assurance'], granularity: 'section', editorialStatus: 'draft', reviewedAt: drafted, note },
      { id: 'gias-performing-services', ref: 'Domain V', title: 'Performing internal audit services', summary: 'Planning, evidence, evaluation of findings and communication of results for each engagement.', conceptIds: ['assurance', 'evidence-quality', 'documentation'], granularity: 'section', editorialStatus: 'draft', reviewedAt: drafted, note },
    ],
  }),
]

export const assuranceRelations: InstrumentRelation[] = [
  { id: 'iso42006-certifies-42001', sourceId: 'iso-42006', targetId: 'iso-42001', type: 'certifies-against', explanation: 'ISO/IEC 42006 sets requirements for bodies that audit and certify AI management systems against ISO/IEC 42001.', basis: 'explicit', confidence: 'high', sourceAnchors: ['ISO/IEC 42006:2025 scope'] },
  { id: 'asae3000-aligns-isae3000', sourceId: 'asae-3000', targetId: 'isae-3000', type: 'aligns-with', explanation: 'The AUASB describes ASAE 3000 as the Australian equivalent of ISAE 3000 (Revised).', basis: 'explicit', confidence: 'high', sourceAnchors: ['ASAE 3000 (January 2025)'] },
  { id: 'asae3150-extends-asae3000', sourceId: 'asae-3150', targetId: 'asae-3000', type: 'extends', explanation: 'ASAE 3150 is a subject-matter standard for assurance on controls, applied together with ASAE 3000.', basis: 'explicit', confidence: 'high', sourceAnchors: ['ASAE 3150 (December 2022)'] },
  { id: 'isae3402-extends-isae3000', sourceId: 'isae-3402', targetId: 'isae-3000', type: 'extends', explanation: 'ISAE 3402 is a subject-matter standard for service-organisation controls within the ISAE 3000 framework.', basis: 'explicit', confidence: 'high', sourceAnchors: ['ISAE 3402 staff overview'] },
  { id: 'isae3000-assures-42001', sourceId: 'isae-3000', targetId: 'iso-42001', type: 'provides-assurance-basis-for', explanation: 'An ISAE 3000 engagement could use an AI management system’s requirements as criteria. That is assurance, which differs from ISO/IEC 42006 certification.', basis: 'cross-framework-synthesis', confidence: 'medium', sourceAnchors: ['ISAE 3000 (Revised) preconditions', 'ISO/IEC 42001 overview'] },
  { id: 'asae3150-assures-cps234', sourceId: 'asae-3150', targetId: 'apra-cps-234', type: 'provides-assurance-basis-for', explanation: 'An ASAE 3150 engagement can report on the design and operating effectiveness of controls relevant to CPS 234 obligations, if suitable control objectives are defined.', basis: 'cross-framework-synthesis', confidence: 'medium', sourceAnchors: ['ASAE 3150', 'CPS 234 testing of control effectiveness'] },
  { id: 'gias-assures-cps230', sourceId: 'iia-gias', targetId: 'apra-cps-230', type: 'provides-assurance-basis-for', explanation: 'CPS 230 expects internal audit to review the credibility of continuity arrangements; the Global Internal Audit Standards govern how that review is performed.', basis: 'cross-framework-synthesis', confidence: 'medium', sourceAnchors: ['Global Internal Audit Standards', 'CPS 230 testing and review'] },
  { id: 'soc2-supports-thirdparty', sourceId: 'aicpa-soc2-tsc', targetId: 'apra-cps-230', type: 'supports-evidence-for', explanation: 'SOC 2 reports from AI service providers can inform service-provider monitoring under CPS 230, but rarely cover AI-specific risks on their own.', basis: 'cross-framework-synthesis', confidence: 'medium', sourceAnchors: ['2017 Trust Services Criteria', 'CPS 230 service provider management'] },
]
