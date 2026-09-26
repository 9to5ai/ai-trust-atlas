import { ArrowLeft, ArrowRight } from '@phosphor-icons/react'
import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { Link } from '../../app/router'
import { Page, PageHero } from '../../ui/Page'
import { getAssessmentQuestions, scoreAssessment, scoringRules } from '../core/assessment'
import { domainIds, domains, maturityLevels, type Level } from '../core/facets'
import { useCorpus } from '../PracticeApp'
import { setAnswer, setAnswerNote, useWorkspace } from '../store'
import { domainColors, PracticeMap } from './PracticeMap'
import styles from './Workspace.module.css'

/*
 * The assessment: every practice, one question at a time on a horizontal carousel. Each question is the practice's
 * four maturity levels. Answering a new question moves on after a moment; results sit below the carousel.
 */
export function Assess() {
  const corpus = useCorpus()
  const workspace = useWorkspace()
  // Same order as the star chart: by domain, then by practice ID.
  const questions = useMemo(() => getAssessmentQuestions(corpus).sort((a, b) => domainIds.indexOf(a.domain) - domainIds.indexOf(b.domain) || a.practiceId.localeCompare(b.practiceId)), [corpus])
  const firstOpen = questions.findIndex((question) => !workspace.answers[question.practiceId])
  const [index, setIndex] = useState(() => (firstOpen < 0 ? 0 : firstOpen))
  const [notesOpen, setNotesOpen] = useState<Record<string, boolean>>({})
  const advance = useRef<number>(undefined)
  const swipe = useRef<{ x: number; y: number } | undefined>(undefined)
  const result = useMemo(() => scoreAssessment(corpus, workspace.answers), [corpus, workspace.answers])
  const answered = questions.filter((question) => workspace.answers[question.practiceId]).length
  const levels = Object.fromEntries(Object.entries(result.practices).map(([id, score]) => [id, score.level]))
  const current = questions[index]
  const go = (next: number) => { window.clearTimeout(advance.current); setIndex(Math.max(0, Math.min(questions.length - 1, next))) }

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.target instanceof Element && event.target.closest('input[type="text"], textarea, select')) return
      if (event.key === 'ArrowRight') { event.preventDefault(); go(index + 1) }
      if (event.key === 'ArrowLeft') { event.preventDefault(); go(index - 1) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })
  useEffect(() => () => window.clearTimeout(advance.current), [])

  const choose = (practiceId: string, level: Level) => {
    const wasOpen = !workspace.answers[practiceId]
    setAnswer(practiceId, level)
    if (wasOpen && index < questions.length - 1) {
      window.clearTimeout(advance.current)
      advance.current = window.setTimeout(() => setIndex((value) => Math.min(questions.length - 1, value + 1)), 450)
    }
  }

  return (
    <Page labelledBy="assess-title" wide>
      <PageHero id="assess-title" eyebrow="Assessment" title="Where your AI trust practices stand" lede="Pick the level that best describes each practice in your organisation today. Be honest: the roadmap is only as useful as these answers. Everything stays in this browser." />

      <section className={styles.carousel} aria-roledescription="carousel" aria-label="Assessment questions">
        <div className={styles.carouselHead} style={{ '--c': domainColors[current.domain] } as CSSProperties}>
          <span className={styles.carouselDomain}><span className={styles.orb} aria-hidden="true" />{domains[current.domain].name}</span>
          <span className={styles.muted} aria-live="polite">Question {index + 1} of {questions.length} · {answered} answered</span>
        </div>
        <div className={styles.progress} role="progressbar" aria-valuemin={0} aria-valuemax={questions.length} aria-valuenow={answered} aria-label="Questions answered"><span style={{ width: `${(answered / questions.length) * 100}%` }} /></div>

        <div className={styles.carouselNav}>
          <button type="button" className={styles.button} onClick={() => go(index - 1)} disabled={index === 0}><ArrowLeft size={16} /> Back</button>
          <div className={styles.dots} role="group" aria-label="Jump to a question">
            {questions.map((question, position) => (
              <button
                key={question.practiceId}
                type="button"
                className={styles.dot}
                style={{ '--c': domainColors[question.domain] } as CSSProperties}
                data-answered={workspace.answers[question.practiceId] ? '' : undefined}
                aria-current={position === index ? 'step' : undefined}
                aria-label={`${question.practiceId} ${question.title}${workspace.answers[question.practiceId] ? ', answered' : ''}`}
                title={`${question.practiceId} ${question.title}`}
                onClick={() => go(position)}
              />
            ))}
          </div>
          {index < questions.length - 1
            ? <button type="button" className={styles.buttonPrimary} onClick={() => go(index + 1)}>Next <ArrowRight size={16} /></button>
            : <a className={styles.buttonPrimary} href="#results-title">See results <ArrowRight size={16} /></a>}
        </div>
        <div
          className={styles.viewport}
          onPointerDown={(event) => { swipe.current = { x: event.clientX, y: event.clientY } }}
          onPointerUp={(event) => {
            const start = swipe.current
            swipe.current = undefined
            if (!start) return
            const dx = event.clientX - start.x, dy = event.clientY - start.y
            if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) go(index + (dx < 0 ? 1 : -1))
          }}
        >
          <div className={styles.track} style={{ transform: `translateX(-${index * 100}%)` }}>
            {questions.map((question, position) => {
              const answer = workspace.answers[question.practiceId]
              const capped = result.practices[question.practiceId]?.capped
              const active = position === index
              return (
                <fieldset
                  key={question.practiceId}
                  className={styles.slide}
                  style={{ '--c': domainColors[question.domain] } as CSSProperties}
                  aria-roledescription="slide"
                  aria-label={`${position + 1} of ${questions.length}: ${question.title}`}
                  aria-hidden={!active}
                  inert={!active}
                >
                  <legend className={styles.slideTitle}><span className={styles.qid}>{question.practiceId}</span>{question.title}</legend>
                  <p className={styles.qtext}>{question.question} <Link to={`/practice/p/${question.practiceId}`}>Read the practice</Link></p>
                  <div className={styles.levels}>
                    {question.options.map((option) => (
                      <label key={option.level} className={styles.level}>
                        <input type="radio" name={`level-${question.practiceId}`} checked={answer?.level === option.level} onChange={() => choose(question.practiceId, option.level as Level)} />
                        <span className={styles.levelHead}><span className={styles.levelNumber}>{option.level}</span>{option.name}</span>
                        <span className={styles.muted}>{maturityLevels[option.level - 1].meaning}</span>
                        <ul>{option.criteria.map((criterion) => <li key={criterion}>{criterion}</li>)}</ul>
                      </label>
                    ))}
                  </div>
                  <div className={styles.questionFoot}>
                    {answer && <button type="button" className={styles.linkButton} onClick={() => setAnswer(question.practiceId, undefined)}>Clear answer</button>}
                    {answer && <button type="button" className={styles.linkButton} onClick={() => { window.clearTimeout(advance.current); setNotesOpen((open) => ({ ...open, [question.practiceId]: !open[question.practiceId] })) }}>{answer.note || notesOpen[question.practiceId] ? 'Note' : 'Add a note'}</button>}
                    {capped && <span className={styles.muted}>Rated Assured by an agent; counted as Operating until a person confirms it.</span>}
                  </div>
                  {answer && (notesOpen[question.practiceId] || answer.note) && (
                    <textarea className={`${styles.textarea} ${styles.note}`} aria-label={`Note for ${question.practiceId}`} maxLength={2000} defaultValue={answer.note ?? ''} placeholder="What is this rating based on? Evidence, gaps, owners." onBlur={(event) => setAnswerNote(question.practiceId, event.target.value)} />
                  )}
                </fieldset>
              )
            })}
          </div>
        </div>

      </section>

      <section aria-labelledby="results-title" className={styles.panel} style={{ marginTop: 'var(--space-8)' }}>
        <h2 id="results-title" className={styles.panelTitle}>Results</h2>
        {result.overall.rated === 0 ? (
          <p className={styles.muted}>Answer the questions above and your results appear here.</p>
        ) : (
          <>
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
                      <span className={styles.meterTrack} role="img" aria-label={aggregate.score ? `Average level ${aggregate.score} of 4` : 'Not rated'}><span style={{ width: `${((aggregate.score ?? 0) / 4) * 100}%` }} /></span>
                      <span>{aggregate.score ? `${aggregate.score.toFixed(1)} / 4` : '—'}<span className={styles.muted}> · {aggregate.rated}/{aggregate.total}</span></span>
                    </div>
                  )
                })}
              </div>
            </div>
            <PracticeMap practices={corpus.practices} levels={levels} progress={() => undefined} />
          </>
        )}
        <details className={styles.rules}>
          <summary>How scores are calculated</summary>
          <ol>{scoringRules.map((rule) => <li key={rule}>{rule}</li>)}</ol>
        </details>
      </section>
    </Page>
  )
}
