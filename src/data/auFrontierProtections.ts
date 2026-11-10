import type { InstrumentRelation, SourceRecord } from '../types'
import type { Development } from './developments'
import type { RoleQuestions } from './nodeQuestionPrompts'

export const AU_FRONTIER_ID = 'au-frontier-ai-protections-proposal'
export const AU_FRONTIER_URL = 'https://www.pm.gov.au/media/new-australian-ai-safety-and-security-protections'
const date = '2026-11-10'

export const auFrontierSource: SourceRecord = {
  id: AU_FRONTIER_ID,
  title: 'New Australian AI safety and security protections',
  shortTitle: 'Australian Frontier AI Proposal',
  issuer: 'Australian Government — Prime Minister, Defence, Home Affairs and Industry ministers',
  jurisdiction: 'Australia — proposed scope: frontier AI companies operating in Australia',
  region: 'Australia', authorityClass: 'policy-guidance', legalEffect: 'informational',
  authorityNote: 'Government legislative proposal; no operative duties established by this announcement',
  status: 'not-in-force', published: date, lastVerified: date, editorialStatus: 'reviewed',
  officialUrl: AU_FRONTIER_URL,
  summary: 'The Government proposes mandatory frontier-AI protections through Australian AI Standards legislation and a targeted AI-safety regulator supported by the Australian AI Safety Institute.',
  applicability: 'Proposed scope is frontier AI companies wishing to operate in Australia, not automatically every AI user. Detailed legislation and consultation are forthcoming; thresholds, notification periods, penalties and commencement are unspecified. Full release reviewed. Source: Licensed from the Commonwealth of Australia under a Creative Commons Attribution 4.0 International Licence. Original Atlas summaries and questions; no endorsement implied.',
  sectors: ['AI providers'], detailAvailability: 'full-public-text',
  conceptIds: ['ai-security', 'risk-treatment', 'evaluation', 'incident-response', 'transparency-disclosure', 'lifecycle-governance'],
  provisions: [{
    id: 'au-frontier-proposed-protections', ref: 'Six proposed protection areas',
    title: 'Proposed frontier-AI safeguards',
    summary: 'The proposed areas cover lifecycle security; serious model-risk management; independent evaluation; rapid incident notification to government; published safety and security frameworks; and adaptation to changing standards. These are announced proposals, not enacted requirements.',
    sourceUrl: AU_FRONTIER_URL,
    conceptIds: ['ai-security', 'risk-treatment', 'evaluation', 'incident-response', 'transparency-disclosure', 'lifecycle-governance'],
    granularity: 'section', editorialStatus: 'reviewed', reviewedAt: date,
    note: 'Locator: the six-item list following “Companies will be required by the regulator to”. Concept connections are Atlas interpretation. No requirement, control-effectiveness or assurance conclusion is inferred.',
  }],
}

export const auFrontierSourceQuestions: RoleQuestions = {
  board: 'Are we potentially a frontier AI provider in Australia, or a customer monitoring changes to our suppliers?',
  executive: 'Who will track the bill’s scope and translate confirmed provisions into a dated implementation assessment?',
  regulator: 'How does the organisation distinguish these announced proposals from obligations already applying to its activities?',
  assurance: 'Which criteria in our review are current obligations, voluntary commitments or anticipated legislation?',
}
export const auFrontierSectionQuestions: RoleQuestions = {
  board: 'Which of the six proposed safeguards would expose a material gap if adopted for our frontier models?',
  executive: 'Can we map the six announced protection areas to owners and evidence while recording unresolved legislative details?',
  regulator: 'What evidence would establish whether a company falls within the eventual frontier-AI scope?',
  assurance: 'Can an independent evaluator obtain the model access and records needed to test the safety claims management publishes?',
}

export const auFrontierPlanRelation: InstrumentRelation = {
  id: 'au-frontier-proposal-extends-national-plan', sourceId: AU_FRONTIER_ID, targetId: 'au-national-ai-plan',
  type: 'extends', basis: 'explicit', confidence: 'high',
  explanation: 'The announcement says the proposed protections build on the National AI Plan. This is a policy-development link; it does not make the Plan binding or establish enacted protections.',
  sourceAnchors: ['10 November 2026 announcement: closing paragraphs and Minister Ayres quotation'],
  citations: [{ sourceTitle: 'New Australian AI safety and security protections', url: AU_FRONTIER_URL, locator: 'National AI Plan references in Minister Ayres quotation', accessedAt: date }],
}

export const auFrontierDevelopment: Development = {
  id: 'au-frontier-ai-protections-announced', published: date, reviewed: date, added: date,
  dateBasis: 'Government announcement published', status: 'Legislative proposal — not in force',
  issuer: 'Australian Government', title: 'Australia proposes frontier-AI safety protections and a targeted regulator',
  summary: 'The 10 November announcement sets out six proposed protection areas for frontier AI companies operating in Australia.',
  implication: 'Atlas interpretation: monitor legislative scope and supplier implications; this release supplies no present compliance or assurance criteria.',
  question: 'What evidence would change our assessment of whether the eventual law covers our activities?',
  topics: ['governance', 'security', 'testing', 'lifecycle'], sourceId: AU_FRONTIER_ID, url: AU_FRONTIER_URL,
  timeline: false, // One publication event from the source, not a duplicate development event.
}
export const auFrontierDevelopmentPrompt = {
  questions: {
    board: 'What decision can wait for the bill, and what frontier-AI exposure warrants attention now?',
    executive: 'How will we capture changes between this announcement and the eventual legislative text?',
    regulator: 'How are preparatory actions distinguished from claims of compliance with a law that has not been enacted?',
    assurance: 'Would a reader mistake our readiness assessment for assurance against legislation still being developed?',
  },
  askFor: 'A dated proposal-to-legislation tracker, provider-versus-customer scope assessment, named owners and existing evidence for the six proposed areas.',
  followUp: 'Which assumption must be revisited when the bill or regulator mandate is published?',
}
