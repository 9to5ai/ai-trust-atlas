import { Compass, X } from '@phosphor-icons/react'
import { useEffect } from 'react'
import { tours } from '../data/tours'
import styles from './PresenterDock.module.css'

/* Shown while presenting with no tour running: pick a tour, or leave presenting. */
export function PresenterDock({ onStart, onExit }: { onStart: (id: string) => void; onExit: () => void }) {
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || event.defaultPrevented) return
      if (event.target instanceof Element && event.target.closest('input, textarea, select, dialog[open]')) return
      onExit()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onExit])

  return (
    <section className={styles.dock} aria-label="Presenting">
      <header className={styles.head}>
        <span className={styles.eyebrow}><Compass size={14} weight="duotone" /> Choose a guided tour</span>
        <button type="button" className={styles.exit} onClick={onExit}><X size={14} /> Stop presenting <kbd>Esc</kbd></button>
      </header>
      <div className={styles.tours}>
        {tours.map((tour) => (
          <button key={tour.id} type="button" className={styles.tour} onClick={() => onStart(tour.id)}>
            <strong>{tour.title}</strong>
            <span>{tour.summary}</span>
            <small>{tour.steps.length} steps · about {tour.minutes} min</small>
          </button>
        ))}
      </div>
      <p className={styles.hint}>Or explore freely: drag to orbit, scroll to zoom, click any node. Use → and ← (or a clicker) to move through a tour.</p>
    </section>
  )
}
