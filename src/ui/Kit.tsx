import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from '../app/router'
import styles from './Kit.module.css'

export function Chip({ pressed, count, children, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { pressed?: boolean; count?: number }) {
  return <button type="button" className={styles.chip} aria-pressed={pressed} {...props}>{children}{count !== undefined && <span className={`${styles.chipCount} tabular`}>{count}</span>}</button>
}

export function ChipGroup({ label, children }: { label: string; children: ReactNode }) {
  return <div className={styles.chipGroup} role="group" aria-label={label}><span className={styles.chipLabel}>{label}</span><div className={styles.chips}>{children}</div></div>
}

export function Badge({ tone = 'neutral', children, title }: { tone?: 'neutral' | 'signal' | 'aurora' | 'caution' | 'positive' | 'critical'; children: ReactNode; title?: string }) {
  return <span className={`${styles.badge} ${styles[tone]}`} title={title}>{children}</span>
}

export function DraftBadge() {
  return <Badge tone="caution" title="Prepared for editorial review; not yet approved">Draft · awaiting review</Badge>
}

type ButtonLinkProps = { to?: string; href?: string; variant?: 'primary' | 'secondary' | 'ghost'; children: ReactNode; onClick?: () => void; disabled?: boolean; ariaLabel?: string }
export function Button({ to, href, variant = 'secondary', children, onClick, disabled, ariaLabel }: ButtonLinkProps) {
  const className = `${styles.button} ${styles[variant]}`
  if (to) return <Link to={to} className={className} aria-label={ariaLabel}>{children}</Link>
  if (href) return <a href={href} className={className} target="_blank" rel="noreferrer" aria-label={ariaLabel}>{children}</a>
  return <button type="button" className={className} onClick={onClick} disabled={disabled} aria-label={ariaLabel}>{children}</button>
}

export function Callout({ title, children, tone = 'signal' }: { title?: string; children: ReactNode; tone?: 'signal' | 'caution' }) {
  return <aside className={`${styles.callout} ${styles[tone]}`}>{title && <strong>{title}</strong>}<div>{children}</div></aside>
}

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return <div className={styles.empty} role="status"><strong>{title}</strong>{children}</div>
}
