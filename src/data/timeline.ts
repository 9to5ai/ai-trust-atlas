import type { EditorialStatus, Instrument } from '../types'
import { developments } from './developments'
import { instruments } from './instruments'

/*
 * Dated events for the regulatory horizon. Publication and commencement
 * events are derived from reviewed source records where their dates are
 * machine-readable; application milestones are curated below. Curated events
 * drafted on 24 September 2026 carry editorialStatus 'draft'.
 */
export type TimelinePrecision = 'day' | 'month' | 'year'
export type TimelineKind = 'published' | 'in-force' | 'applies' | 'transition-ends' | 'expected' | 'development'
export type TimelineCertainty = 'enacted' | 'scheduled' | 'expected'
export type TimelineEvent = {
  id: string
  date: string
  precision: TimelinePrecision
  kind: TimelineKind
  certainty: TimelineCertainty
  title: string
  summary: string
  instrumentId?: string
  provisionIds?: string[]
  region: Instrument['region']
  sourceUrl?: string
  editorialStatus?: EditorialStatus
}

export const timelineKindLabels: Record<TimelineKind, string> = {
  published: 'Published',
  'in-force': 'Commences',
  applies: 'Obligations apply',
  'transition-ends': 'Transition ends',
  expected: 'Expected',
  development: 'Development',
}

const instrumentById = new Map(instruments.map((instrument) => [instrument.id, instrument]))
const precisionOf = (date: string): TimelinePrecision | undefined => (/^\d{4}-\d{2}-\d{2}$/.test(date) ? 'day' : /^\d{4}-\d{2}$/.test(date) ? 'month' : undefined)

const curated = (event: Omit<TimelineEvent, 'region' | 'editorialStatus' | 'precision'> & { precision?: TimelinePrecision }): TimelineEvent => {
  const instrument = event.instrumentId ? instrumentById.get(event.instrumentId) : undefined
  if (event.instrumentId && !instrument) throw new Error(`Timeline event ${event.id} references unknown source ${event.instrumentId}`)
  return { precision: precisionOf(event.date) ?? 'month', ...event, region: instrument?.region ?? 'Global', sourceUrl: event.sourceUrl ?? instrument?.officialUrl, editorialStatus: 'draft' }
}

const euAct = 'https://eur-lex.europa.eu/eli/reg/2024/1689/oj/eng'
const euAmendment = 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=OJ:L_202601744'

export const curatedEvents: TimelineEvent[] = [
  curated({ id: 'eu-ai-act-prohibitions', date: '2025-02-02', kind: 'applies', certainty: 'enacted', title: 'EU AI Act: prohibitions and AI literacy apply', summary: 'Prohibited practices (Article 5) and AI literacy duties (Article 4) apply.', instrumentId: 'eu-ai-act', provisionIds: ['eu-ai-act-4', 'eu-ai-act-5'], sourceUrl: euAct }),
  curated({ id: 'eu-ai-act-gpai', date: '2025-08-02', kind: 'applies', certainty: 'enacted', title: 'EU AI Act: general-purpose AI obligations apply', summary: 'Obligations for providers of general-purpose AI models apply, alongside governance and penalty provisions.', instrumentId: 'eu-ai-act', provisionIds: ['eu-ai-act-53', 'eu-ai-act-55'], sourceUrl: euAct }),
  curated({ id: 'eu-ai-act-transparency', date: '2026-08-02', kind: 'applies', certainty: 'enacted', title: 'EU AI Act: Article 50 transparency rules apply', summary: 'Transparency duties for interacting with AI and for synthetic content generally apply, per the 2026 amendment.', instrumentId: 'eu-ai-act', provisionIds: ['eu-ai-act-50'], sourceUrl: euAmendment }),
  curated({ id: 'eu-ai-act-50-2-transition', date: '2026-12-02', kind: 'transition-ends', certainty: 'scheduled', title: 'EU AI Act: Article 50(2) transition ends', summary: 'Transition ends for marking obligations for qualifying systems already on the market.', instrumentId: 'eu-ai-act', provisionIds: ['eu-ai-act-50'], sourceUrl: euAmendment }),
  curated({ id: 'eu-ai-act-annex-iii', date: '2027-12-02', kind: 'applies', certainty: 'scheduled', title: 'EU AI Act: Annex III high-risk rules apply', summary: 'High-risk requirements apply to systems in listed use areas such as employment, credit and essential services.', instrumentId: 'eu-ai-act', provisionIds: ['eu-ai-act-6', 'eu-ai-act-9', 'eu-ai-act-10', 'eu-ai-act-14', 'eu-ai-act-26', 'eu-ai-act-27'], sourceUrl: euAmendment }),
  curated({ id: 'eu-ai-act-annex-i', date: '2028-08-02', kind: 'applies', certainty: 'scheduled', title: 'EU AI Act: Annex I high-risk rules apply', summary: 'High-risk requirements apply to AI that is a safety component of products covered by listed EU harmonisation law.', instrumentId: 'eu-ai-act', provisionIds: ['eu-ai-act-6', 'eu-ai-act-43'], sourceUrl: euAmendment }),
  curated({ id: 'cps230-commences', date: '2025-07-01', kind: 'in-force', certainty: 'enacted', title: 'APRA CPS 230 commences', summary: 'Operational risk, business continuity and service-provider requirements commence for APRA-regulated entities.', instrumentId: 'apra-cps-230' }),
  curated({ id: 'cps230-existing-contracts', date: '2026-07-01', kind: 'transition-ends', certainty: 'enacted', title: 'CPS 230: pre-existing service-provider arrangements', summary: 'Service-provider requirements reach pre-existing contractual arrangements (at the earlier of renewal or this date).', instrumentId: 'apra-cps-230', provisionIds: ['cps230-provider'] }),
  curated({ id: 'au-privacy-adm', date: '2026-12-10', kind: 'applies', certainty: 'scheduled', title: 'Privacy Act: automated-decision transparency', summary: 'Privacy policies must describe the use of personal information in substantially automated decisions that significantly affect individuals.', instrumentId: 'au-privacy-act', provisionIds: ['au-privacy-app1-adm'] }),
  curated({ id: 'osfi-e23-effective', date: '2027-05-01', kind: 'in-force', certainty: 'scheduled', title: 'OSFI Guideline E-23 takes effect', summary: 'Canada’s model risk management guideline, covering AI and machine-learning models, takes effect for federally regulated institutions.', instrumentId: 'osfi-e23' }),
  curated({ id: 'fsb-sound-practices-final', date: '2026-10', precision: 'month', kind: 'expected', certainty: 'expected', title: 'FSB: final report on AI sound practices expected', summary: 'The Financial Stability Board has indicated a final report following consultation.', instrumentId: 'fsb-ai-sound-practices' }),
  curated({ id: 'iia-gias-effective', date: '2025-01-09', kind: 'in-force', certainty: 'enacted', title: 'IIA Global Internal Audit Standards take effect', summary: 'New internal audit standards apply to functions conforming with the IIA framework.', instrumentId: 'iia-gias' }),
]

/* Publication and commencement dates recorded on reviewed source records. */
export const derivedEvents: TimelineEvent[] = instruments.flatMap((instrument) => {
  const events: TimelineEvent[] = []
  const published = precisionOf(instrument.published)
  if (published) events.push({ id: `published:${instrument.id}`, date: instrument.published, precision: published, kind: 'published', certainty: 'enacted', title: `${instrument.shortTitle} published`, summary: instrument.summary, instrumentId: instrument.id, region: instrument.region, sourceUrl: instrument.officialUrl, editorialStatus: instrument.editorialStatus })
  const effective = instrument.effective && precisionOf(instrument.effective) === 'day' ? instrument.effective : undefined
  if (effective && effective !== instrument.published && !curatedEvents.some((event) => event.instrumentId === instrument.id && event.date === effective)) {
    events.push({ id: `effective:${instrument.id}`, date: effective, precision: 'day', kind: 'in-force', certainty: 'enacted', title: `${instrument.shortTitle} takes effect`, summary: instrument.applicability, instrumentId: instrument.id, region: instrument.region, sourceUrl: instrument.officialUrl, editorialStatus: instrument.editorialStatus })
  }
  return events
})

export const developmentEvents: TimelineEvent[] = developments.map((item) => ({
  id: `development:${item.id}`,
  date: item.published,
  precision: 'day',
  kind: 'development',
  certainty: 'enacted',
  title: item.title,
  summary: item.implication,
  instrumentId: item.sourceId && instrumentById.has(item.sourceId) ? item.sourceId : undefined,
  region: (item.sourceId && instrumentById.get(item.sourceId)?.region) || 'Global',
  sourceUrl: item.url,
}))

export const timelineEvents: TimelineEvent[] = [...curatedEvents, ...derivedEvents, ...developmentEvents].sort((a, b) => a.date.localeCompare(b.date))
