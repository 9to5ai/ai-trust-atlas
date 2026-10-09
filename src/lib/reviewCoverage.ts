import { instruments } from '../data/instruments'
import type { Instrument, SourceProvision } from '../types'

export const reviewCoverage = {
  sourceCount: instruments.length,
  draftSources: instruments.filter((source) => source.editorialStatus === 'draft').length,
  reviewedSources: instruments.filter((source) => source.editorialStatus === 'reviewed').length,
  unclassifiedSources: instruments.filter((source) => source.editorialStatus === undefined).length,
  depths: {
    publicText: instruments.filter((source) => source.detailAvailability === 'full-public-text').length,
    publicSummary: instruments.filter((source) => source.detailAvailability === 'public-summary').length,
    licensed: instruments.filter((source) => source.detailAvailability === 'licensed-standard').length,
  },
  draftSections: instruments.reduce((total, source) => total + source.provisions.filter((section) => section.editorialStatus === 'draft').length, 0),
  reviewedSections: instruments.reduce((total, source) => total + source.provisions.filter((section) => section.editorialStatus === 'reviewed').length, 0),
}

export const sourceFreshnessLabel = (source: Pick<Instrument, 'editorialStatus' | 'lastVerified'>) =>
  source.editorialStatus === 'draft' ? `Drafted ${source.lastVerified} · awaiting editorial review` : `Selected section review date ${source.lastVerified} · source-level review state ${source.editorialStatus === 'reviewed' ? 'marked reviewed' : 'not recorded'}`

export const sourceWeeklyStatus = (source: Pick<Instrument, 'editorialStatus' | 'lastVerified'>, today: string) => {
  if (source.editorialStatus === 'draft') return 'Draft awaiting editorial review; not a substantive review date'
  if (source.editorialStatus === undefined) return `Source-level review state not recorded · ${isWeeklyReviewDue(source.lastVerified, today) ? 'check due based on the recorded date' : 'recorded date less than seven days old'}`
  return isWeeklyReviewDue(source.lastVerified, today) ? 'Weekly substantive review due' : 'Weekly substantive review not yet due'
}

export const sourceReviewDepthLabel = (source: Pick<Instrument, 'detailAvailability'>) => ({
  'full-public-text': 'Public text available; Atlas section review is recorded separately',
  'public-summary': 'Public summary only; full text not assessed',
  'licensed-standard': 'Licensed full text not reproduced; original paraphrase only',
}[source.detailAvailability])

export const sectionReviewLabel = (section: Pick<SourceProvision, 'editorialStatus' | 'reviewedAt'>) => {
  if (section.editorialStatus === 'draft') return `Draft recorded ${section.reviewedAt ?? 'date not recorded'} · awaiting editorial review`
  if (section.editorialStatus === 'reviewed') return `Selected section reviewed ${section.reviewedAt ?? 'date not recorded'}`
  return 'No section-specific review date recorded'
}

export const sourceTargetedReviewDate = (source: Instrument) => {
  const dates = source.provisions.filter((section) => section.editorialStatus === 'reviewed' && section.reviewedAt).map((section) => section.reviewedAt!).sort().reverse()
  return dates[0] ?? undefined
}

export const isWeeklyReviewDue = (lastSubstantiveReview: string, today: string) => {
  const reviewed = Date.parse(lastSubstantiveReview)
  const current = Date.parse(today)
  return !Number.isFinite(reviewed) || !Number.isFinite(current) || current - reviewed >= 7 * 86_400_000
}

export const todayUtc = () => {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Australia/Sydney', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date())
  return `${parts.find((part) => part.type === 'year')?.value}-${parts.find((part) => part.type === 'month')?.value}-${parts.find((part) => part.type === 'day')?.value}`
}
