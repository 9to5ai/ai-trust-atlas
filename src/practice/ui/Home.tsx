import { useMemo, type CSSProperties } from 'react'
import { Link } from '../../app/router'
import { Page, PageHero } from '../../ui/Page'
import { domainIds, domains } from '../core/facets'
import { scoreAssessment } from '../core/assessment'
import type { Practice } from '../core/schema'
import { useCorpus } from '../PracticeApp'
import { useWorkspace } from '../store'
import { domainColors, PracticeMap } from './PracticeMap'
import styles from './Practice.module.css'

/* Home: every practice on the lifecycle star chart, or a domain list on small screens. */
export function Home() {
  const corpus = useCorpus()
  const workspace = useWorkspace()
  const result = useMemo(() => scoreAssessment(corpus, workspace.answers), [corpus, workspace.answers])
  const assessed = result.overall.rated > 0
  const levels = assessed ? Object.fromEntries(Object.entries(result.practices).map(([id, score]) => [id, score.level])) : undefined
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

      <div className={styles.homeActions}>
        {assessed
          ? <><Link to="/practice/roadmap" className={styles.homePrimary}>See your roadmap</Link><Link to="/practice/assess" className={styles.homeSecondary}>Update your assessment ({result.overall.rated} of {result.overall.total} rated)</Link></>
          : <><Link to="/practice/assess" className={styles.homePrimary}>Take the quick assessment</Link><span className={styles.muted}>About 10 minutes. Your answers stay in this browser.</span></>}
        {!workspace.profile.orgName && !workspace.profile.sector && <Link to="/practice/profile" className={styles.homeSecondary}>Set up your organisation profile</Link>}
      </div>

      <PracticeMap practices={corpus.practices} progress={progress} levels={levels} />

      <div className={styles.domainList}>
        {domainIds.map((domain) => {
          const members = corpus.practices.filter((practice) => practice.domain === domain)
          return (
            <section key={domain} aria-labelledby={`domain-${domain}`} style={{ '--c': domainColors[domain] } as CSSProperties}>
              <h2 id={`domain-${domain}`} className={styles.domainHeading}><span className={styles.domainOrb} aria-hidden="true" /><span><span className={styles.domainCode}>{domains[domain].code}</span>{domains[domain].name}</span></h2>
              {members.length ? <ul>{members.map((practice) => <li key={practice.id}>
                <Link to={`/practice/p/${practice.id}`}><span className={styles.cellId}>{practice.id}</span> {practice.title}</Link>
                <p>{practice.summary}</p>
              </li>)}</ul> : <p className={styles.muted}>Practices in this domain are being written.</p>}
            </section>
          )
        })}
      </div>

      <p className={styles.disclaimer}>General information, not legal or professional advice. Every claim links to its source so you can check it.</p>
    </Page>
  )
}
