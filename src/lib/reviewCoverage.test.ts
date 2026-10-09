import { describe, expect, it } from 'vitest'
import { instruments } from '../data/instruments'
import { isWeeklyReviewDue, reviewCoverage, sectionReviewLabel, sourceFreshnessLabel, sourceReviewDepthLabel, sourceWeeklyStatus, sourceTargetedReviewDate } from './reviewCoverage'

describe('review coverage signals', () => {
  it('counts only recorded source and section states', () => {
    expect(reviewCoverage.sourceCount).toBe(instruments.length)
    expect(reviewCoverage.draftSources + reviewCoverage.reviewedSources + reviewCoverage.unclassifiedSources).toBe(instruments.length)
    expect(reviewCoverage.depths.publicText + reviewCoverage.depths.publicSummary + reviewCoverage.depths.licensed).toBe(instruments.length)
    expect(reviewCoverage.reviewedSources).toBeGreaterThan(0)
    expect(reviewCoverage.reviewedSources + reviewCoverage.draftSources + reviewCoverage.unclassifiedSources).toBe(instruments.length)
    expect(reviewCoverage.draftSections).toBeGreaterThan(0)
    expect(reviewCoverage.reviewedSections).toBeGreaterThan(0)
  })
  it('does not call draft dates verification dates', () => {
    expect(sourceFreshnessLabel({ editorialStatus: 'draft', lastVerified: '2026-09-24' })).toContain('Drafted 2026-09-24')
    expect(sourceFreshnessLabel({ editorialStatus: 'reviewed', lastVerified: '2026-09-29' })).toBe('Selected section review date 2026-09-29 · source-level review state marked reviewed')
    expect(sourceFreshnessLabel({ lastVerified: '2026-09-29' })).toContain('source-level review state not recorded')
    expect(sourceWeeklyStatus({ editorialStatus: 'draft', lastVerified: '2026-09-01' }, '2026-10-09')).toContain('not a substantive review date')
    expect(sourceWeeklyStatus({ lastVerified: '2026-09-01' }, '2026-10-09')).toContain('check due based on the recorded date')
    expect(sectionReviewLabel({ editorialStatus: 'draft', reviewedAt: '2026-09-25' })).toContain('Draft recorded 2026-09-25')
    expect(sectionReviewLabel({ editorialStatus: 'reviewed', reviewedAt: '2026-10-05' })).toContain('Selected section reviewed 2026-10-05')
    expect(sourceReviewDepthLabel({ detailAvailability: 'licensed-standard' })).toContain('Licensed full text not reproduced')
    expect(sourceTargetedReviewDate(instruments.find((source) => source.id === 'mas-airm-guidelines-cp')!)).toBe('2026-10-08')
  })
  it('marks a weekly check due at seven days without asserting the source changed', () => {
    expect(isWeeklyReviewDue('2026-10-02', '2026-10-09')).toBe(true)
    expect(isWeeklyReviewDue('2026-10-03', '2026-10-09')).toBe(false)
    expect(isWeeklyReviewDue('not-a-date', '2026-10-09')).toBe(true)
  })
})
