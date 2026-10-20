import type { Requirement, SourceProvision, SourceRecord } from '../types'
import type { Development } from './developments'
import type { Audience } from './leadershipQuestions'

export const RBNZ_FRONTIER_ID = 'nz-rbnz-fma-frontier-cyber'
export const RBNZ_FRONTIER_PDF = 'https://www.rbnz.govt.nz/-/media/project/sites/rbnz/files/publications/speeches/2026/supervisory-expectations-on-cyber-risk-associated-with-frontier-ai.pdf'
export const RBNZ_FRONTIER_NEWS = 'https://www.rbnz.govt.nz/news-and-events/news/2026/10/rbnz-and-fma-outline-supervisory-expectations-on-cyber-and-ai-risks'
const reviewedAt = '2026-10-20'
const section = (id: string, page: number, ref: string, title: string, summary: string, conceptIds: string[]): SourceProvision => ({
  id, ref, title, summary, conceptIds, granularity: 'section', editorialStatus: 'reviewed', reviewedAt,
  sourceUrl: `${RBNZ_FRONTIER_PDF}#page=${page}`,
  note: 'Original Atlas synopsis of the joint remarks, 15 October 2026. Source: RBNZ and FMA; copyright RBNZ. Concept and control connections are Atlas interpretations, not findings about any entity.',
})

export const rbnzFrontierSource: SourceRecord = {
  id: RBNZ_FRONTIER_ID,
  title: 'Supervisory expectations on cyber risk associated with frontier AI',
  shortTitle: 'RBNZ/FMA Frontier AI Cyber',
  issuer: 'Reserve Bank of New Zealand and Financial Markets Authority',
  jurisdiction: 'New Zealand - RBNZ- and FMA-regulated entities', region: 'New Zealand',
  authorityClass: 'policy-guidance', legalEffect: 'supervisory-expectation',
  authorityNote: 'Joint supervisory expectations reflecting existing obligations; not a new standalone AI law',
  status: 'active', published: '2026-10-15', lastVerified: reviewedAt, editorialStatus: 'reviewed',
  officialUrl: RBNZ_FRONTIER_PDF,
  summary: 'Joint RBNZ/FMA remarks on frontier-AI cyber risk, board oversight, provider concentration and recovery preparedness in New Zealand financial services.',
  applicability: 'Addresses entities regulated by RBNZ and FMA, in proportion to their business and risk profile. The remarks reflect existing prudential, conduct, cyber and operational-resilience obligations; they specify no new commencement date. Full seven-page remarks reviewed; cited external research and institutional control effectiveness were not independently validated. Original Atlas synopses; source and copyright owner: RBNZ, with FMA joint authorship.',
  sectors: ['Financial services'], detailAvailability: 'full-public-text',
  conceptIds: ['ai-security', 'access-control', 'risk-treatment', 'lifecycle-governance', 'accountability', 'ai-policy-appetite', 'inventory', 'competence', 'assurance', 'third-party-risk', 'systemic-risk', 'operational-resilience', 'incident-response', 'evaluation', 'consumer-outcomes'],
  provisions: [
    section('nz-frontier-cyber-defence', 4, 'p. 3 - Improving cyber fundamentals and AI-enabled defence', 'Cyber defence at attack speed',
      'Strengthen identity, asset management and patching. Accelerate remediation with change risk managed, assess manual triage and govern defensive AI; consider unsupported systems in transformation plans.',
      ['ai-security', 'access-control', 'risk-treatment', 'lifecycle-governance']),
    section('nz-frontier-cyber-governance', 5, 'p. 4 - Reviewing AI-related governance and risk management settings', 'Board visibility and challenge',
      'Align AI risk management with appetite and resilience goals. Boards need visibility of AI use, clear accountability, skills to challenge management and appropriate independent assurance.',
      ['accountability', 'ai-policy-appetite', 'inventory', 'competence', 'assurance']),
    section('nz-frontier-cyber-suppliers', 5, 'pp. 4-5 - Understanding and managing third-party risk', 'Supplier exposure and concentration',
      'Assess suppliers’ AI use, shared dependencies and disruption exposure. Define shared responsibilities and timely change, vulnerability and incident notification; entities retain operational-risk accountability.',
      ['third-party-risk', 'systemic-risk', 'operational-resilience', 'accountability']),
    section('nz-frontier-cyber-recovery', 6, 'p. 5 - Incident response and recovery', 'Rehearse compromised and disrupted services',
      'Reassess fraud and identity checks. Exercise attack, model-failure and supplier-outage scenarios, including manual alternatives, restoration and critical suppliers where appropriate.',
      ['incident-response', 'operational-resilience', 'evaluation', 'consumer-outcomes']),
  ],
}

const requirement = (provisionId: string, title: string, summary: string, addressees: Requirement['addressees'], conceptIds: string[], controlIds: string[]): Requirement => {
  const provision = rbnzFrontierSource.provisions.find(item => item.id === provisionId)!
  return { id: `req-${provisionId}`, instrumentId: RBNZ_FRONTIER_ID, provisionId, ref: provision.ref,
    title, summary, addressees, modality: 'should', conceptIds, controlIds,
    sourceUrl: provision.sourceUrl!, reviewedAt, editorialStatus: 'reviewed' }
}
// Source expectations are expressed as "should"; no new legal duty or effective date is inferred.
export const rbnzFrontierRequirements: Requirement[] = [
  requirement('nz-frontier-cyber-defence', 'Keep cyber defence responsive and controlled',
    'Entities should maintain identity and asset controls, speed risk-based vulnerability remediation while managing operational change risk, and oversee any defensive AI used.',
    ['regulated-entity'], ['ai-security', 'access-control', 'risk-treatment'], ['least-privilege-access', 'change-release-retirement']),
  requirement('nz-frontier-cyber-governance', 'Maintain accountable and informed AI oversight',
    'Boards and senior management should understand material AI use and dependencies, set appetite, assign accountability and maintain the capability to challenge management, supported by appropriate independent assurance.',
    ['board', 'senior-management'], ['accountability', 'ai-policy-appetite', 'inventory', 'competence', 'assurance'], ['accountable-ownership', 'ai-inventory-classification', 'competence-challenge']),
  requirement('nz-frontier-cyber-suppliers', 'Manage supplier AI exposure and concentration',
    'Entities should assess supplier resilience and AI exposure, define shared responsibilities and arrange timely notification of material changes, vulnerabilities and incidents, retaining operational-risk accountability.',
    ['regulated-entity'], ['third-party-risk', 'operational-resilience', 'accountability'], ['third-party-assessment', 'accountable-ownership']),
  requirement('nz-frontier-cyber-recovery', 'Test response and recovery for AI-related disruption',
    'Entities should assess fraud and verification controls and test response, recovery, manual workarounds and failover against severe but plausible attacks, model failures and supplier outages, involving critical suppliers where appropriate.',
    ['regulated-entity'], ['incident-response', 'operational-resilience', 'evaluation', 'consumer-outcomes'], ['incident-response-reporting', 'resilience-rollback-continuity', 'fit-for-purpose-evaluation']),
]

type RolePrompt = Record<Audience, string>
export const rbnzFrontierSourceQuestions: RolePrompt = {
  board: 'Would our cyber and recovery plans still work if AI-enabled attacks outpaced normal decisions?',
  executive: 'Which cyber, AI-use and supplier changes need action under the joint supervisory expectations?',
  regulator: 'How has the entity assessed these expectations against its own activities and existing obligations?',
  assurance: 'What operating evidence supports management’s assessment of cyber readiness and recovery capacity?',
}
export const rbnzFrontierProvisionQuestions: Record<string, RolePrompt> = {
  'nz-frontier-cyber-defence': {
    board: 'Where does unsupported technology leave us exposed despite faster patching elsewhere?',
    executive: 'How do we shorten remediation times without introducing unacceptable change risk?',
    regulator: 'What supports the entity’s view that monitoring and triage can match its threat exposure?',
    assurance: 'Can patch, exception and change records substantiate the claimed speed and safety of remediation?',
  },
  'nz-frontier-cyber-governance': {
    board: 'What AI use or dependency could be material but still invisible to this board?',
    executive: 'Who updates risk appetite and accountability when AI changes a material service?',
    regulator: 'How do board capability, challenge and reporting reflect the entity’s changing AI risk profile?',
    assurance: 'Can we trace a material AI risk from identification to board challenge, ownership and follow-through?',
  },
  'nz-frontier-cyber-suppliers': {
    board: 'Could apparently separate suppliers fail together because they depend on the same AI or cloud service?',
    executive: 'Do supplier arrangements reveal AI use and require timely notice of material changes and incidents?',
    regulator: 'How does the entity oversee shared responsibilities while retaining operational-risk accountability?',
    assurance: 'Can supplier records and notification tests substantiate the dependency and responsibility assessment?',
  },
  'nz-frontier-cyber-recovery': {
    board: 'Could critical services continue if a concentrated provider failed during an AI-enabled attack?',
    executive: 'When did we last exercise manual workarounds and recovery with a critical supplier?',
    regulator: 'Which plausible AI-enabled fraud, model-failure and supplier-outage scenarios were tested?',
    assurance: 'Did recovery exercises demonstrate usable workarounds and restoration, with unresolved weaknesses recorded?',
  },
}

export const rbnzFrontierDevelopment: Development = {
  id: 'rbnz-fma-frontier-cyber-expectations', published: '2026-10-15', reviewed: reviewedAt, added: reviewedAt,
  dateBasis: 'Remarks delivered', status: 'Joint supervisory expectations',
  issuer: 'RBNZ and FMA', title: 'New Zealand supervisors address frontier-AI cyber resilience',
  summary: 'RBNZ and FMA set out expectations for cyber controls, AI governance, supplier concentration and recovery in joint remarks to financial-sector leaders.',
  implication: 'Atlas interpretation: reassess remediation speed, board visibility and supplier recovery evidence. The remarks reflect existing obligations and do not themselves create a new standalone AI law.',
  question: 'Which part of our cyber response depends on a supplier we have not exercised with?',
  topics: ['security', 'governance', 'third-party', 'resilience', 'testing'], sourceId: RBNZ_FRONTIER_ID,
  url: RBNZ_FRONTIER_NEWS,
  // The new source already supplies the publication event; do not duplicate it in the timeline.
  timeline: false,
}
export const rbnzFrontierDevelopmentPrompt = {
  questions: {
    board: 'Which gap in frontier-AI cyber readiness needs a board decision now?',
    executive: 'What changes follow from comparing our cyber, supplier and recovery arrangements with these expectations?',
    regulator: 'Can the entity explain its response to the joint expectations without treating them as a new standalone law?',
    assurance: 'What evidence would distinguish a documented response from controls that operated during the review period?',
  },
  askFor: 'A dated gap assessment, remediation and change records, board reporting, supplier dependency and notification records, and recovery-exercise results.',
  followUp: 'Which unresolved weakness has no accountable owner or tested fallback?',
}
