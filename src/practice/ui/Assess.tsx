import { useMemo, useState, type CSSProperties } from 'react'
import { Link } from '../../app/router'
import { Page, PageHero } from '../../ui/Page'
import { getAssessmentQuestions, scoreAssessment, scoringRules } from '../core/assessment'
import { domainIds, domains, maturityLevels, type Level } from '../core/facets'
import { useCorpus } from '../PracticeApp'
import { setAnswer, setAnswerNote, useWorkspace } from '../store'
import { domainColors, PracticeMap } from './PracticeMap'
import styles from './Workspace.module.css'

/*
 * The assessment: each question is a practice's four maturity levels. Quick mode covers the practices flagged
 * as core; full mode covers everything. Scores come from the shared, deterministic scoring rules.
 */
export function Assess() {
  const corpus = useCorpus()
  const workspace = useWorkspace()
  const [mode, setMode] = useState<'quick' | 'full'>(() => (Object.keys(workspace.answers).length > 8 ? 'full' : 'quick'))
  const [notesOpen, setNotesOpen] = useState<Record<string, boolean>>({})
  const questions = useMemo(() => getAssessmentQuestions(corpus, { quick: mode === 'quick' }), [corpus, mode])
  const result = useMemo(() => scoreAssessment(corpus, workspace.answers), [corpus, workspace.answers])
  const answered = questions.filter((question) => workspace.answers[question.practiceId]).length
  const levels = Object.fromEntries(Object.entries(result.practices).map(([id, score]) => [id, score.level]))
  const quickCount = getAssessmentQuestions(corpus, { quick: true }).length

  return (
    <Page labelledBy="assess-title" wide>
      <PageHero id="assess-title" eyebrow="Assessment" title="Where your AI trust practices stand" lede="Pick the level that best describes each practice in your organisation today. Be honest: the roadmap is only as useful as these answers. Everything stays in this browser." />

      {result.overall.rated > 0 && (
        <section aria-labelledby="results-title" className={styles.panel} style={{ marginBottom: 'var(--space-7)' }}>
          <h2 id="results-title" className={styles.panelTitle}>Results so far</h2>
          <div className={styles.results}>
            <div className={styles.score}>
              <span className={styles.label}>Average level</span>
              <span className={styles.scoreValue}>{result.overall.score?.toFixed(1)}</span>
              <span className={styles.muted}>{result.overall.rated} of {result.overall.total} practices rated</span>
              <Link to="/practice/roadmap" className={styles.buttonPrimary} style={{ marginTop: 'var(--space-3)', justifySelf: 'start' }}>See your roadmap</Link>
            </div>
            <div className={styles.bars}>
              {domainIds.map((domain) => {
                const aggregate = result.domains[domain]
                if (!aggregate.total) return null
                return (
                  <div key={domain} className={styles.bar} style={{ '--c': domainColors[domain] } as CSSProperties}>
                    <span>{domains[domain].name}</span>
                    <span className={styles.track} role="img" aria-label={aggregate.score ? `Average level ${aggregate.score} of 4` : 'Not rated'}><span style={{ width: `${((aggregate.score ?? 0) / 4) * 100}%` }} /></span>
                    <span>{aggregate.score ? `${aggregate.score.toFixed(1)} / 4` : '—'}<span className={styles.muted}> · {aggregate.rated}/{aggregate.total}</span></span>
                  </div>
                )
              })}
            </div>
          </div>
          <PracticeMap practices={corpus.practices} levels={levels} progress={() => undefined} />
          <details className={styles.rules}>
            <summary>How scores are calculated</summary>
            <ol>{scoringRules.map((rule) => <li key={rule}>{rule}</li>)}</ol>
          </details>
        </section>
      )}

      <div className={styles.modes} role="group" aria-label="Assessment length">
        <button type="button" className={mode === 'quick' ? styles.buttonPrimary : styles.button} aria-pressed={mode === 'quick'} onClick={() => setMode('quick')}>Quick: {quickCount} core practices, about 10 minutes</button>
        <button type="button" className={mode === 'full' ? styles.buttonPrimary : styles.button} aria-pressed={mode === 'full'} onClick={() => setMode('full')}>Full: all {corpus.practices.length} practices</button>
      </div>
      <div className={styles.muted}>{answered} of {questions.length} answered</div>
      <div className={styles.progress} role="progressbar" aria-valuemin={0} aria-valuemax={questions.length} aria-valuenow={answered} aria-label="Assessment progress"><span style={{ width: `${questions.length ? (answered / questions.length) * 100 : 0}%` }} /></div>

      {domainIds.map((domain) => {
        const group = questions.filter((question) => question.domain === domain)
        if (!group.length) return null
        return (
          <section key={domain} className={styles.domainGroup} style={{ '--c': domainColors[domain] } as CSSProperties} aria-labelledby={`assess-${domain}`}>
            <h2 id={`assess-${domain}`} className={styles.domainHeading}><span className={styles.orb} aria-hidden="true" />{domains[domain].name}</h2>
            {group.map((question) => {
              const answer = workspace.answers[question.practiceId]
              const capped = result.practices[question.practiceId]?.capped
              return (
                <fieldset key={question.practiceId} className={styles.question}>
                  <legend><span className={styles.qid}>{question.practiceId}</span>{question.title}</legend>
                  <p className={styles.qtext}>{question.question} <Link to={`/practice/p/${question.practiceId}`}>Read the practice</Link></p>
                  <div className={styles.levels}>
                    {question.options.map((option) => (
                      <label key={option.level} className={styles.level}>
                        <input type="radio" name={`level-${question.practiceId}`} checked={answer?.level === option.level} onChange={() => setAnswer(question.practiceId, option.level as Level)} />
                        <span className={styles.levelHead}><span className={styles.levelNumber}>{option.level}</span>{option.name}</span>
                        <span className={styles.muted}>{maturityLevels[option.level - 1].meaning}</span>
                        <ul>{option.criteria.map((criterion) => <li key={criterion}>{criterion}</li>)}</ul>
                      </label>
                    ))}
                  </div>
                  <div className={styles.questionFoot}>
                    {answer && <button type="button" className={styles.linkButton} onClick={() => setAnswer(question.practiceId, undefined)}>Clear answer</button>}
                    {answer && <button type="button" className={styles.linkButton} onClick={() => setNotesOpen((open) => ({ ...open, [question.practiceId]: !open[question.practiceId] }))}>{answer.note || notesOpen[question.practiceId] ? 'Note' : 'Add a note'}</button>}
                    {capped && <span className={styles.muted}>Rated Assured by an agent; counted as Operating until a person confirms it.</span>}
                  </div>
                  {answer && (notesOpen[question.practiceId] || answer.note) && (
                    <textarea className={`${styles.textarea} ${styles.note}`} aria-label={`Note for ${question.practiceId}`} maxLength={2000} defaultValue={answer.note ?? ''} placeholder="What is this rating based on? Evidence, gaps, owners." onBlur={(event) => setAnswerNote(question.practiceId, event.target.value)} />
                  )}
                </fieldset>
              )
            })}
          </section>
        )
      })}
      {answered === questions.length && questions.length > 0 && (
        <div className={styles.actions}><Link to="/practice/roadmap" className={styles.buttonPrimary}>All answered: see your roadmap</Link>{mode === 'quick' && <button type="button" className={styles.button} onClick={() => setMode('full')}>Continue with the full assessment</button>}</div>
      )}
    </Page>
  )
}
