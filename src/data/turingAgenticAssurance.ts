import type { SourceRecord } from '../types'
import type { RoleQuestions } from './nodeQuestionPrompts'

export const TURING_AGENTIC_ID = 'uk-turing-agentic-assurance'
export const TURING_AGENTIC_PDF = 'https://www.turing.ac.uk/sites/default/files/2026-10/evaluation_for_assurance_of_agentic_ai_systems_in_financial_services_-_the_alan_turing_institute.pdf'
export const TURING_AGENTIC_LANDING = 'https://www.turing.ac.uk/news/publications/evaluation-assurance-agentic-ai-systems-financial-services'

// Bibliographic linking only. Report text, figures and case studies are not reproduced.
export const turingAgenticSource: SourceRecord = {
  id: TURING_AGENTIC_ID,
  title: 'Evaluation for Assurance of Agentic AI Systems in Financial Services',
  shortTitle: 'Turing Agentic AI Evaluation',
  issuer: 'The Alan Turing Institute',
  jurisdiction: 'United Kingdom - research reference', region: 'United Kingdom',
  authorityClass: 'research-database', legalEffect: 'informational',
  authorityNote: 'Research reference; not regulatory guidance or an assurance opinion',
  status: 'active', published: '2026-10', lastVerified: '2026-10-24', editorialStatus: 'reviewed',
  officialUrl: TURING_AGENTIC_LANDING,
  summary: 'October 2026 research report on evaluation for assurance of agentic AI systems in financial services, published by The Alan Turing Institute.',
  applicability: 'A research reference for financial-services evaluation discussions. It creates no legal duty and does not establish the safety or effectiveness of a system. Full report reviewed; cited studies and institutional results were not independently validated. Public Atlas entry is limited to bibliographic links and original discussion prompts. Copyright The Alan Turing Institute, 2026; detailed content reuse is not cleared. No endorsement by the Institute or contributors is implied.',
  sectors: ['Financial services'], detailAvailability: 'full-public-text',
  conceptIds: ['evaluation', 'evidence-quality', 'agent-authority'],
  provisions: [{
    id: 'turing-agentic-reading', ref: 'Section 4, pp. 34-43', title: 'Evaluation principles — reading reference',
    summary: 'Read the evaluation principles in the original report. Questions and concept links here are authored by Atlas.',
    sourceUrl: `${TURING_AGENTIC_PDF}#page=34`,
    conceptIds: ['evaluation', 'evidence-quality', 'agent-authority'],
    granularity: 'section', editorialStatus: 'reviewed', reviewedAt: '2026-10-24',
    note: 'Bibliographic locator only; no report synopsis or adapted figures. Concept links are Atlas interpretations, not equivalence or assurance claims.',
  }],
}

export const turingAgenticSourceQuestions: RoleQuestions = {
  board: 'What evidence would make us decline an agent deployment even if its average task score improved?',
  executive: 'Which deployment decision does our agent evaluation support, and who accepts the remaining uncertainty?',
  regulator: 'Can the firm separate research-informed evaluation choices from its applicable supervisory obligations?',
  assurance: 'Where does the evaluation evidence stop short of the assurance claim management wants to make?',
}
export const turingAgenticReadingQuestions: RoleQuestions = {
  board: 'Could a permitted sequence of agent actions still produce an unacceptable business outcome?',
  executive: 'Which failed permission or approval check blocks release regardless of the aggregate evaluation score?',
  regulator: 'Can the firm demonstrate a prohibited action being refused in its actual tool environment?',
  assurance: 'What independent checks establish that the automated evaluator detects the failures it is meant to detect?',
}
