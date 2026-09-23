import type { ReactNode } from 'react'
import styles from './Page.module.css'

export function Page({ children, labelledBy, wide = false }: { children: ReactNode; labelledBy: string; wide?: boolean }) {
  return <main id="main-content" className={`${styles.page}${wide ? ` ${styles.wide}` : ''}`} aria-labelledby={labelledBy}>{children}</main>
}

export function PageHero({ id, eyebrow, title, lede, children }: { id: string; eyebrow: string; title: ReactNode; lede?: ReactNode; children?: ReactNode }) {
  return (
    <header className={styles.hero}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1 id={id} className={styles.title}>{title}</h1>
      {lede && <p className={styles.lede}>{lede}</p>}
      {children}
    </header>
  )
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <span className={styles.eyebrow}>{children}</span>
}

export function Section({ id, eyebrow, title, intro, children }: { id: string; eyebrow?: string; title: ReactNode; intro?: ReactNode; children: ReactNode }) {
  return (
    <section className={styles.section} aria-labelledby={id}>
      <div className={styles.sectionHead}>
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <h2 id={id} className={styles.sectionTitle}>{title}</h2>
        {intro && <p className={styles.sectionIntro}>{intro}</p>}
      </div>
      {children}
    </section>
  )
}
