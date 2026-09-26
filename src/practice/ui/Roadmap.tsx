import { DownloadSimple, Printer } from '@phosphor-icons/react'
import { useMemo, type CSSProperties } from 'react'
import { Link } from '../../app/router'
import { Page, PageHero } from '../../ui/Page'
import { scoreAssessment } from '../core/assessment'
import { roadmapCsv } from '../core/evidence'
import { maturityLevels, type Level } from '../core/facets'
import { bucketNames, bucketOrder, buildRoadmap, roadmapRules } from '../core/roadmap'
import { useCorpus } from '../PracticeApp'
import { downloadFile, setTarget, useWorkspace } from '../store'
import { domainColors } from './PracticeMap'
import styles from './Workspace.module.css'

/* The roadmap: gaps ranked by published rules and sequenced by prerequisites, with every ranking explained. */
const bucketIntro = { now: 'Start these first.', next: 'Once the first set is under way.', later: 'Plan for these.' } as const

export function Roadmap() {
  const corpus = useCorpus()
  const workspace = useWorkspace()
  const today = new Date().toISOString().slice(0, 10)
  const result = useMemo(() => scoreAssessment(corpus, workspace.answers), [corpus, workspace.answers])
  const items = useMemo(() => buildRoadmap({ corpus, result, targets: workspace.targets, profile: workspace.profile, today }), [corpus, result, workspace.targets, workspace.profile, today])
  const assessed = result.overall.rated > 0

  return (
    <Page labelledBy="roadmap-title" wide>
      <PageHero id="roadmap-title" eyebrow="Roadmap" title="What to work on now, next and later" lede="Ranked from your assessment and organisation profile. Every item says why it is where it is, and nothing is scheduled before the practices it builds on." />
      <div className={styles.actions}>
        <button type="button" className={styles.button} onClick={() => downloadFile(`ai-trust-roadmap-${today}.csv`, roadmapCsv(items), 'text/csv')}><DownloadSimple size={16} /> Download as CSV</button>
        <Link to="/practice/board-summary" className={styles.button}><Printer size={16} /> Board summary</Link>
        {!assessed && <span className={styles.muted}>You have not rated any practices yet, so everything is treated as Ad hoc. <Link to="/practice/assess">Take the assessment</Link> for a roadmap that fits you.</span>}
        {assessed && !workspace.profile.systemTypes.length && <span className={styles.muted}><Link to="/practice/profile">Add your organisation profile</Link> to rank practices by the kinds of AI you use.</span>}
      </div>

      {items.length === 0 ? (
        <p className={styles.panel}>Every practice is at or above its target. Raise targets on the practices where you want to go further, or re-assess as things change.</p>
      ) : (
        <div className={styles.columns}>
          {bucketOrder.map((bucket) => {
            const members = items.filter((item) => item.bucket === bucket)
            return (
              <section key={bucket} className={styles.column} aria-labelledby={`bucket-${bucket}`}>
                <h2 id={`bucket-${bucket}`} className={styles.columnHead}>{bucketNames[bucket]}<span className={styles.muted}>{members.length}</span></h2>
                <p className={styles.muted} style={{ margin: 0 }}>{bucketIntro[bucket]}</p>
                {members.map((item) => {
                  const practice = corpus.practices.find((candidate) => candidate.id === item.practiceId)!
                  const done = workspace.steps[item.practiceId]?.length ?? 0
                  const total = practice.steps.foundations.length + practice.steps.implementation.length
                  return (
                    <article key={item.practiceId} className={styles.card} style={{ '--c': domainColors[item.domain] } as CSSProperties}>
                      <Link to={`/practice/p/${item.practiceId}`} className={styles.cardTitle}><span className={styles.qid}>{item.practiceId}</span>{item.title}</Link>
                      <div className={styles.levelRow}>
                        <span>{item.current ? maturityLevels[item.current - 1].name : 'Not assessed'} →</span>
                        <label className={styles.muted}>
                          <span className={styles.srOnlyLive}>Target level for {item.practiceId}</span>
                          <select className={styles.select} value={item.target} onChange={(event) => setTarget(item.practiceId, Number(event.target.value) as Level)}>
                            {maturityLevels.map((level) => <option key={level.level} value={level.level}>{level.name}</option>)}
                          </select>
                        </label>
                      </div>
                      <span className={styles.muted}>Owner: {item.owner}</span>
                      {item.prerequisites.length > 0 && <div className={styles.prereqs}>Builds on {item.prerequisites.map((id) => <Link key={id} to={`/practice/p/${id}`}>{id}</Link>)}</div>}
                      <details>
                        <summary className={styles.muted}>Why it is here · priority {item.priority}</summary>
                        <ul className={styles.reasons}>{item.reasons.map((reason) => <li key={reason}>{reason}</li>)}</ul>
                      </details>
                      <div className={styles.mini} role="img" aria-label={`${done} of ${total} steps done`}><span style={{ width: `${(done / total) * 100}%` }} /></div>
                    </article>
                  )
                })}
              </section>
            )
          })}
        </div>
      )}

      <details className={styles.rules}>
        <summary>How the ranking works</summary>
        <ol>{roadmapRules.map((rule) => <li key={rule}>{rule}</li>)}</ol>
      </details>
    </Page>
  )
}
