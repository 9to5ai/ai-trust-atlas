import { useMemo, useState } from 'react'
import { instruments } from '../data/instruments'
import { isWeeklyReviewDue, sourceFreshnessLabel, sourceWeeklyStatus, sourceTargetedReviewDate, sourceReviewDepthLabel, reviewCoverage, todayUtc } from '../lib/reviewCoverage'
import { Link } from '../app/router'
import { Page, PageHero } from '../ui/Page'
import styles from './CoveragePage.module.css'

type Filter = 'all' | 'due' | 'draft' | 'licensed'

export function CoveragePage() {
  const [filter, setFilter] = useState<Filter>('all')
  const sources = useMemo(() => instruments.filter((source) => filter === 'all' || (filter === 'due' ? source.editorialStatus !== 'draft' && isWeeklyReviewDue(source.lastVerified, todayUtc()) : filter === 'draft' ? source.editorialStatus === 'draft' || source.provisions.some((section) => section.editorialStatus === 'draft') : source.detailAvailability === 'licensed-standard')), [filter])
  return <Page labelledBy="coverage-title" wide>
    <PageHero id="coverage-title" eyebrow="Review and coverage" title="What has been reviewed, and what hasn’t." lede="These are recorded dates and content limits, not a live change detector. A recorded date at least seven days old flags a check as due. It does not mean the source changed, and a date without a source-level review state does not confirm a substantive review." />
    <section className={styles.summary} aria-label="Recorded coverage totals">
      <div><strong>{reviewCoverage.sourceCount}</strong><span>source records</span></div>
      <div><strong>{reviewCoverage.draftSources}</strong><span>draft sources awaiting editorial review</span></div>
      <div><strong>{reviewCoverage.reviewedSources}</strong><span>sources with an explicit substantive review state</span></div>
      <div><strong>{reviewCoverage.unclassifiedSources}</strong><span>sources without a source-level editorial state</span></div>
      <div><strong>{reviewCoverage.reviewedSections}</strong><span>selected sections marked reviewed</span></div>
      <div><strong>{reviewCoverage.draftSections}</strong><span>draft sections awaiting review</span></div>
    </section>
    <p className={styles.depth}>Recorded source depth: {reviewCoverage.depths.publicText} with public text available · {reviewCoverage.depths.publicSummary} public-summary only · {reviewCoverage.depths.licensed} licensed full-text records.</p>
    <section className={styles.limits} aria-labelledby="coverage-limits">
      <h2 id="coverage-limits">How to read these dates</h2>
      <ul>
        <li>“Selected section review date” is the latest recorded date for a selected passage, not proof that every section or the full source was reviewed.</li>
        <li>A draft date records when Atlas material was prepared. It is not a source verification or editorial approval.</li>
        <li>“Check due” uses the seven-day sourcing cadence. Unspecified source-level review states remain unspecified; a draft date is not treated as a check date.</li>
        <li>Targeted checks are not stored in a consistent source-level field; the selected section dates show only recorded passage reviews.</li>
        <li>Licensed standards are represented by original paraphrases; their full text is not reproduced here.</li>
      </ul>
    </section>
    <div className={styles.listHead}>
      <h2>Source records</h2>
      <div role="group" aria-label="Filter coverage records">
        <button aria-pressed={filter === 'all'} onClick={() => setFilter('all')}>All {instruments.length}</button>
        <button aria-pressed={filter === 'due'} onClick={() => setFilter('due')}>Weekly check due</button>
        <button aria-pressed={filter === 'draft'} onClick={() => setFilter('draft')}>Draft records</button>
        <button aria-pressed={filter === 'licensed'} onClick={() => setFilter('licensed')}>Licensed summaries</button>
      </div>
    </div>
    <ol className={styles.records}>
      {sources.map((source) => <li key={source.id}>
        <div className={styles.identity}><strong>{source.shortTitle}</strong><span>{source.authorityClass.replaceAll('-', ' ')} · {source.region}</span></div>
        <div><p>{sourceFreshnessLabel(source)}</p><p>{sourceWeeklyStatus(source, todayUtc())}</p></div>
        <div><p>{sourceTargetedReviewDate(source) ? `Latest selected section reviewed ${sourceTargetedReviewDate(source)}` : 'No selected-section review date recorded'}</p><p>{source.provisions.filter((section) => section.editorialStatus === 'reviewed').length} selected sections marked reviewed · {source.provisions.filter((section) => section.editorialStatus === 'draft').length} draft sections</p></div>
        <div><p>{sourceReviewDepthLabel(source)}</p></div>
        <Link to={`/universe#/instrument/${source.id}`}>Open in Universe →</Link>
      </li>)}
    </ol>
    <nav className={styles.next} aria-label="Continue exploring">
      <Link to="/universe">Explore the Universe</Link>
      <Link to="/questions">Prepare meeting questions</Link>
      <Link to="/cases">See use cases</Link>
    </nav>
  </Page>
}
