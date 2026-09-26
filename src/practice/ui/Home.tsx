import type { CSSProperties } from 'react'
import { Link } from '../../app/router'
import { DraftBadge } from '../../ui/Kit'
import { Page, PageHero, Section } from '../../ui/Page'
import { domainIds, domains } from '../core/facets'
import type { Practice } from '../core/schema'
import { listChanges } from '../core/search'
import { useCorpus } from '../PracticeApp'
import { useWorkspace } from '../store'
import { domainColors, PracticeMap } from './PracticeMap'
import styles from './Practice.module.css'

/* Home: every practice on the lifecycle star chart (a domain list on small screens) and recent changes. */
export function Home() {
  const corpus = useCorpus()
  const workspace = useWorkspace()
  const changes = listChanges(corpus).slice(0, 6)
  const draft = (practice: Practice) => corpus.includesDrafts && practice.status !== 'approved'
  const progress = (practice: Practice) => {
    const done = workspace.steps[practice.id]?.length ?? 0
    const total = practice.steps.foundations.length + practice.steps.implementation.length
    return done ? `${done} of ${total} steps done` : undefined
  }

  return (
    <Page labelledBy="practice-home-title" wide>
      <PageHero
        id="practice-home-title"
        eyebrow="AI Trust Practice"
        title="What to do at each stage of the AI lifecycle"
        lede="Browse by domain or lifecycle stage. Each practice sets out what to do, what evidence to check, and how the work changes as your program matures."
      />

      <PracticeMap practices={corpus.practices} progress={progress} />

      <div className={styles.domainList}>
        {domainIds.map((domain) => {
          const members = corpus.practices.filter((practice) => practice.domain === domain)
          return (
            <section key={domain} aria-labelledby={`domain-${domain}`} style={{ '--c': domainColors[domain] } as CSSProperties}>
              <h2 id={`domain-${domain}`} className={styles.domainHeading}><span className={styles.domainOrb} aria-hidden="true" /><span><span className={styles.domainCode}>{domains[domain].code}</span>{domains[domain].name}</span></h2>
              {members.length ? <ul>{members.map((practice) => <li key={practice.id}>
                <Link to={`/practice/p/${practice.id}`}><span className={styles.cellId}>{practice.id}</span> {practice.title}</Link>
                {draft(practice) && <DraftBadge />}
                <p>{practice.summary}</p>
              </li>)}</ul> : <p className={styles.muted}>Practices in this domain are being written.</p>}
            </section>
          )
        })}
      </div>

      <Section id="practice-changes" eyebrow="Changelog" title="Recent changes">
        <ul className={styles.changes}>
          {changes.map((change) => (
            <li key={`${change.practiceId}-${change.version}`}>
              <time dateTime={change.date}>{change.date}</time>
              <Link to={`/practice/p/${change.practiceId}`}>{change.practiceId} {change.title}</Link>
              <span className={styles.version}>v{change.version}</span>
              <span>{change.summary}</span>
            </li>
          ))}
        </ul>
      </Section>
      <p className={styles.disclaimer}>General information, not legal or professional advice. Every claim links to its source so you can check it. Corpus {corpus.version}{corpus.includesDrafts ? ', including drafts awaiting editorial review' : ''}.</p>
    </Page>
  )
}
