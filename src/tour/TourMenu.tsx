import { Compass } from '@phosphor-icons/react'
import { useEffect, useRef, useState } from 'react'
import { tours } from '../data/tours'
import styles from './TourMenu.module.css'

export function TourMenu({ activeId, onStart }: { activeId?: string; onStart: (id: string) => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const close = (event: MouseEvent | KeyboardEvent) => {
      if (event instanceof KeyboardEvent ? event.key === 'Escape' : !ref.current?.contains(event.target as Node)) setOpen(false)
    }
    window.addEventListener('pointerdown', close)
    window.addEventListener('keydown', close)
    return () => { window.removeEventListener('pointerdown', close); window.removeEventListener('keydown', close) }
  }, [open])
  return (
    <div className={styles.menu} ref={ref}>
      <button type="button" className={styles.trigger} aria-expanded={open} aria-haspopup="true" onClick={() => setOpen((value) => !value)}><Compass size={15} weight="duotone" /> Guided tours</button>
      {open && (
        <div className={styles.panel} role="menu" aria-label="Guided tours">
          {tours.map((tour) => (
            <button key={tour.id} type="button" role="menuitem" className={styles.item} aria-current={tour.id === activeId || undefined} onClick={() => { setOpen(false); onStart(tour.id) }}>
              <strong>{tour.title}</strong>
              <span>{tour.summary}</span>
              <small>{tour.steps.length} steps · about {tour.minutes} min · {tour.audience}</small>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
