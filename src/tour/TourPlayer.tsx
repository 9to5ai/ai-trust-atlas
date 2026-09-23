import { ArrowLeft, ArrowRight, Pause, Play, X } from '@phosphor-icons/react'
import { useEffect, useRef, useState } from 'react'
import type { Tour } from '../data/tours'
import styles from './TourPlayer.module.css'

type Props = { tour: Tour; step: number; onStep: (step: number) => void; onExit: () => void }

/* Lower-third narration for guided demos. Works with presentation clickers (→, Space, PageDown / ←, PageUp). */
export function TourPlayer({ tour, step, onStep, onExit }: Props) {
  const [autoplay, setAutoplay] = useState(false)
  const current = tour.steps[step]
  const last = step === tour.steps.length - 1
  const latest = useRef({ step, onStep, onExit, last })
  latest.current = { step, onStep, onExit, last }

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) return
      if (event.target instanceof Element && event.target.closest('input, textarea, select, [contenteditable="true"], dialog[open]')) return
      const { step: now, onStep: go, onExit: exit, last: atEnd } = latest.current
      if (['ArrowRight', 'PageDown', ' '].includes(event.key)) { event.preventDefault(); if (!atEnd) go(now + 1) }
      else if (['ArrowLeft', 'PageUp'].includes(event.key)) { event.preventDefault(); if (now > 0) go(now - 1) }
      else if (event.key === 'Escape') { event.preventDefault(); exit() }
    }
    window.addEventListener('keydown', handler, true)
    return () => window.removeEventListener('keydown', handler, true)
  }, [])

  useEffect(() => {
    if (!autoplay) return
    if (last) { setAutoplay(false); return }
    const timer = window.setTimeout(() => onStep(step + 1), current.dwellMs ?? 9000)
    return () => window.clearTimeout(timer)
  }, [autoplay, step, last, current, onStep])

  return (
    <section className={styles.player} aria-label={`Guided tour: ${tour.title}`} aria-live="polite">
      <div className={styles.progress} aria-hidden="true">
        {tour.steps.map((item, index) => <button key={item.title} type="button" tabIndex={-1} className={index <= step ? styles.done : undefined} onClick={() => onStep(index)} />)}
      </div>
      <header className={styles.head}>
        <span className={styles.eyebrow}>Guided tour · {tour.title}</span>
        <span className={`${styles.count} tabular`}>{step + 1} / {tour.steps.length}</span>
      </header>
      <h2 className={styles.title}>{current.title}</h2>
      <p className={styles.narration}>{current.narration}</p>
      <footer className={styles.controls}>
        <button type="button" className={styles.ghost} onClick={onExit} aria-label="Exit tour"><X size={16} /> Exit</button>
        <div className={styles.navigation}>
          <button type="button" className={styles.icon} onClick={() => setAutoplay((value) => !value)} aria-pressed={autoplay} aria-label={autoplay ? 'Pause autoplay' : 'Autoplay tour'} title={autoplay ? 'Pause autoplay' : 'Autoplay'}>{autoplay ? <Pause size={16} /> : <Play size={16} />}</button>
          <button type="button" className={styles.icon} onClick={() => onStep(step - 1)} disabled={step === 0} aria-label="Previous step"><ArrowLeft size={16} /></button>
          {last
            ? <button type="button" className={styles.primary} onClick={onExit}>Finish</button>
            : <button type="button" className={styles.primary} onClick={() => onStep(step + 1)}>Next <ArrowRight size={16} /></button>}
        </div>
      </footer>
    </section>
  )
}
