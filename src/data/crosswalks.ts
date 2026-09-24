import type { CrosswalkLink, PublishedCrosswalk } from '../types.js'

/*
 * Published crosswalks: section-to-section links taken from a mapping that a named
 * body has published. They carry the "published-crosswalk" basis, distinct from
 * Atlas interpretation. Hosting or endorsement status is recorded in each note.
 */
export const publishedCrosswalks: PublishedCrosswalk[] = [
  {
    id: 'airc-nist-rmf-iso42001',
    title: 'NIST AI RMF to ISO/IEC FDIS 42001 AI Management System Crosswalk',
    publisher: 'Microsoft (listed by the NIST AI Resource Center)',
    url: 'https://airc.nist.gov/docs/NIST_AI_RMF_to_ISO_IEC_42001_Crosswalk.pdf',
    published: '2023-05',
    note:
      'Community crosswalk provided by Microsoft and listed on the NIST AI Resource Center crosswalk page, which describes its listings as submitted by the AI RMF user community and says inclusion does not imply NIST endorsement of the mapped resource, or that either resource fully covers the other. It maps AI RMF 1.0 subcategories to the final draft (FDIS) of ISO/IEC 42001, citing main clauses and Annex B implementation guidance (B.x.y), which shares numbering and titles with the Annex A controls (A.x.y) in the published 2023 standard. The PDF carries no date; May 2023 is taken from its file metadata. Links below are recorded only where the Atlas holds both sections; the Atlas groups Annex A controls by topic, so each link can stand for several paired items.',
  },
]

const CROSSWALK_ID = 'airc-nist-rmf-iso42001'

type Pair = { nist: string; iso: string; items: string }

/* Pairings read from the crosswalk table (AI RMF subcategory -> ISO/IEC FDIS 42001 item). */
const pairs: Pair[] = [
  { nist: 'nist-govern-1-1', iso: 'iso42001-context', items: '4.1 Understanding the organization and its context' },
  { nist: 'nist-govern-1-1', iso: 'iso42001-planning', items: '6.2 AI objectives and planning to achieve them' },
  { nist: 'nist-govern-1-1', iso: 'iso42001-a2', items: 'B.2.2 AI policy; B.2.4 Review of the AI policy' },
  { nist: 'nist-govern-1-6', iso: 'iso42001-a4', items: 'B.4.2 Resource documentation; B.4.3 Data resources; B.4.4 Tooling resources; B.4.5 System and computing resources; B.4.6 Human resources' },
  { nist: 'nist-govern-3-2', iso: 'iso42001-a6', items: 'B.6.1.3 Processes for responsible design and development of AI systems' },
  { nist: 'nist-govern-3-2', iso: 'iso42001-a9', items: 'B.9.3 Objectives for responsible use of AI system' },
  { nist: 'nist-govern-3-2', iso: 'iso42001-a4', items: 'B.4.6 Human resources' },
  { nist: 'nist-govern-3-2', iso: 'iso42001-a5', items: 'B.5.3 Documentation of AI system impact assessments' },
  { nist: 'nist-govern-3-2', iso: 'iso42001-support', items: '7.2 Competence' },
  { nist: 'nist-govern-6-1', iso: 'iso42001-a10', items: 'B.10.2 Allocating responsibilities; B.10.3 Suppliers' },
  { nist: 'nist-map-1-1', iso: 'iso42001-planning', items: '6.1.4 AI system impact assessment' },
  { nist: 'nist-map-1-1', iso: 'iso42001-a5', items: 'B.5.2 AI system impact assessment process; B.5.3 Documentation of AI system impact assessments; B.5.4 Assessing AI system impact on individuals and groups of individuals; B.5.5 Assessing societal impacts of AI systems' },
  { nist: 'nist-map-3-5', iso: 'iso42001-a6', items: 'B.6.1.3 Processes for responsible design and development of AI systems; B.6.2.7 AI system technical documentation' },
  { nist: 'nist-map-3-5', iso: 'iso42001-a8', items: 'B.8.2 System documentation and information for users' },
  { nist: 'nist-map-5-1', iso: 'iso42001-planning', items: '6.1.2 AI risk assessment' },
  { nist: 'nist-map-5-1', iso: 'iso42001-a5', items: 'B.5.2 AI system impact assessment process' },
  { nist: 'nist-measure-2-1', iso: 'iso42001-a8', items: 'B.8.4 Communication of incidents' },
  { nist: 'nist-measure-2-1', iso: 'iso42001-a6', items: 'B.6.2.4 AI system verification and validation; B.6.2.7 AI system technical documentation' },
  { nist: 'nist-measure-2-1', iso: 'iso42001-a4', items: 'B.4.2 Resource documentation' },
  { nist: 'nist-measure-2-3', iso: 'iso42001-a7', items: 'B.7.4 Quality of data for AI systems' },
  { nist: 'nist-measure-2-3', iso: 'iso42001-a6', items: 'B.6.2.6 AI system operation and monitoring' },
  { nist: 'nist-measure-2-7', iso: 'iso42001-a7', items: 'B.7.2 Data for development and enhancement of AI system' },
  { nist: 'nist-measure-2-7', iso: 'iso42001-a3', items: 'B.3.2 AI roles and responsibilities' },
  { nist: 'nist-measure-2-7', iso: 'iso42001-a2', items: 'B.2.3 Alignment with other organizational policies' },
  { nist: 'nist-measure-2-7', iso: 'iso42001-a5', items: 'B.5.2 AI system impact assessment process' },
  { nist: 'nist-measure-2-7', iso: 'iso42001-a6', items: 'B.6.1.2 Objectives for responsible development of AI system; B.6.2.3 Documentation of AI system design and development' },
  { nist: 'nist-measure-2-7', iso: 'iso42001-a9', items: 'B.9.3 Objectives for responsible use of AI system' },
  { nist: 'nist-manage-2-4', iso: 'iso42001-a9', items: 'B.9.4 Intended use of the AI system' },
  { nist: 'nist-manage-2-4', iso: 'iso42001-a8', items: 'B.8.2 System documentation and information for users' },
  { nist: 'nist-manage-2-4', iso: 'iso42001-a6', items: 'B.6.2.7 AI system technical documentation; B.6.1.3 Processes for responsible design and development of AI systems' },
  { nist: 'nist-manage-4-1', iso: 'iso42001-performance', items: '9.2.1 General (internal audit)' },
  { nist: 'nist-manage-4-1', iso: 'iso42001-a6', items: 'B.6.2.6 AI system operation and monitoring' },
  { nist: 'nist-manage-4-1', iso: 'iso42001-a8', items: 'B.8.3 External reporting' },
  { nist: 'nist-manage-4-1', iso: 'iso42001-a10', items: 'B.10.4 Customers' },
  { nist: 'nist-manage-4-3', iso: 'iso42001-performance', items: '9.3.2 Management review inputs' },
  { nist: 'nist-manage-4-3', iso: 'iso42001-a8', items: 'B.8.5 Information for interested parties' },
  { nist: 'nist-manage-4-3', iso: 'iso42001-a6', items: 'B.6.2.6 AI system operation and monitoring' },
]

export const crosswalkLinks: CrosswalkLink[] = pairs.map(({ nist, iso, items }) => ({
  id: `xw-${nist.replace(/^nist-/, 'nist-rmf-')}--${iso}`,
  crosswalkId: CROSSWALK_ID,
  from: { instrumentId: 'nist-ai-rmf', provisionId: nist },
  to: { instrumentId: 'iso-42001', provisionId: iso },
  note: `The Microsoft crosswalk listed by NIST pairs this AI RMF subcategory with ISO/IEC FDIS 42001 ${items}.`,
}))
