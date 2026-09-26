import { useCallback, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { Link } from '../../app/router'
import { domainIds, domains, stageIds, stages, type DomainId } from '../core/facets'
import type { Practice } from '../core/schema'
import styles from './PracticeMap.module.css'

/*
 * The practice map: a star chart of the AI lifecycle that continues the Atlas Universe. Each practice is a lane.
 * It has a star at every stage it covers, joined by a trail, in its domain's colour. Pointing at a practice lights
 * its trail and draws dashed arcs to the practices it builds on. Underneath it is a plain list of links.
 */
export const domainColors: Record<DomainId, string> = {
  governance: '#f0a46b',
  risk: '#df83a7',
  data: '#8ad7d0',
  security: '#ef7373',
  testing: '#74b9a2',
  transparency: '#a78bfa',
  fairness: '#ffc46b',
  'third-party': '#5ee4ff',
}

const lifecycle = stageIds.filter((stage) => stage !== 'organisation-wide')
const columns = stageIds.length

type Segment = { from: number; to: number; kind: 'solid' | 'gap' | 'span' }
function segments(practice: Practice): Segment[] {
  const tagged = lifecycle.map((stage, index) => (practice.stages.includes(stage) ? index : -1)).filter((index) => index >= 0)
  const result: Segment[] = []
  for (let index = 1; index < tagged.length; index++) result.push({ from: tagged[index - 1], to: tagged[index], kind: tagged[index] - tagged[index - 1] === 1 ? 'solid' : 'gap' })
  // Organisation-wide practices span the whole lifecycle: a faint band from the first stage to the last.
  if (practice.stages.includes('organisation-wide')) result.push({ from: 0, to: columns - 1, kind: 'span' })
  return result
}

type Arc = { d: string; color: string }

export function PracticeMap({ practices, progress }: { practices: Practice[]; progress: (practice: Practice) => string | undefined }) {
  const wrap = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<string>()
  const [arcs, setArcs] = useState<Arc[]>([])
  const byId = useMemo(() => new Map(practices.map((practice) => [practice.id, practice])), [practices])
  const activePractice = active ? byId.get(active) : undefined
  const prerequisites = new Set(activePractice?.prerequisites ?? [])

  const draw = useCallback(() => {
    const root = wrap.current
    if (!root || !activePractice) { setArcs([]); return }
    const box = root.getBoundingClientRect()
    const firstStar = (id: string) => {
      const star = root.querySelector(`[data-lane="${id}"] [data-star]`)
      if (!star) return undefined
      const rect = star.getBoundingClientRect()
      return { x: rect.left + rect.width / 2 - box.left, y: rect.top + rect.height / 2 - box.top }
    }
    const to = firstStar(activePractice.id)
    const next: Arc[] = []
    for (const id of activePractice.prerequisites) {
      const from = firstStar(id)
      if (!from || !to) continue
      const bulge = Math.min(160, 40 + Math.abs(to.y - from.y) * 0.25)
      const controlX = Math.min(from.x, to.x) - bulge
      next.push({ d: `M${from.x.toFixed(1)},${from.y.toFixed(1)} C${controlX.toFixed(1)},${from.y.toFixed(1)} ${controlX.toFixed(1)},${to.y.toFixed(1)} ${to.x.toFixed(1)},${to.y.toFixed(1)}`, color: domainColors[byId.get(id)!.domain] })
    }
    setArcs(next)
  }, [activePractice, byId])

  useLayoutEffect(() => {
    draw()
    if (!activePractice || !wrap.current) return
    const observer = new ResizeObserver(draw)
    observer.observe(wrap.current)
    return () => observer.disconnect()
  }, [draw, activePractice])

  let order = 0
  return (
    <div className={styles.map} ref={wrap} data-active={active ? '' : undefined} onMouseLeave={() => setActive(undefined)}>
      <div className={styles.sky} aria-hidden="true" />
      <div className={styles.guides} aria-hidden="true">{stageIds.map((stage) => <span key={stage} className={stage === 'organisation-wide' ? styles.orgWide : undefined} />)}</div>
      <div className={styles.horizon} aria-hidden="true">
        <span className={styles.horizonLabel}>Practice</span>
        <div className={styles.stageRow}>
          {stageIds.map((stage, index) => (
            <span key={stage} className={stage === 'organisation-wide' ? `${styles.stage} ${styles.orgWide}` : styles.stage} style={{ '--i': index } as CSSProperties}>
              <span className={styles.stageName}>{stages[stage].name}</span>
              <span className={styles.stageNode} />
            </span>
          ))}
        </div>
      </div>

      {domainIds.map((domain) => {
        const members = practices.filter((practice) => practice.domain === domain)
        return (
          <section key={domain} className={styles.domain} style={{ '--c': domainColors[domain] } as CSSProperties} aria-labelledby={`map-${domain}`}>
            <h3 id={`map-${domain}`} className={styles.domainName}>
              <span className={styles.orb} aria-hidden="true" />
              <span className={styles.code}>{domains[domain].code}</span>
              {domains[domain].name}
            </h3>
            {members.length ? (
              <ul className={styles.lanes}>
                {members.map((practice) => {
                  const note = progress(practice)
                  return (
                    <li
                      key={practice.id}
                      className={styles.lane}
                      data-lane={practice.id}
                      data-on={practice.id === active || undefined}
                      data-prerequisite={prerequisites.has(practice.id) || undefined}
                      style={{ '--n': order++ } as CSSProperties}
                      onMouseEnter={() => setActive(practice.id)}
                    >
                      <Link to={`/practice/p/${practice.id}`} className={styles.label} title={practice.summary} onFocus={() => setActive(practice.id)} onBlur={() => setActive(undefined)}>
                        <span className={styles.id}>{practice.id}</span>
                        <span className={styles.title}>{practice.title}</span>
                        <span className={styles.srOnly}> — {practice.stages.map((stage) => stages[stage].name).join(', ')}{note ? `. ${note}` : ''}</span>
                        {note && <span className={styles.done} aria-hidden="true" />}
                      </Link>
                      <div className={styles.track} aria-hidden="true">
                        {segments(practice).map((segment, index) => (
                          <span key={index} className={`${styles.segment} ${styles[segment.kind]}`} style={{ '--from': segment.from, '--to': segment.to } as CSSProperties} />
                        ))}
                        {stageIds.map((stage, index) => practice.stages.includes(stage) && (
                          <span key={stage} className={stage === 'organisation-wide' ? `${styles.star} ${styles.orgStar}` : styles.star} data-star style={{ '--col': index } as CSSProperties} />
                        ))}
                      </div>
                    </li>
                  )
                })}
              </ul>
            ) : <p className={styles.empty}>Practices in this domain are being written.</p>}
          </section>
        )
      })}

      <svg className={styles.arcs} aria-hidden="true">
        {arcs.map((arc, index) => <path key={`${active}-${index}`} d={arc.d} stroke="currentColor" style={{ color: arc.color }} />)}
      </svg>
      <p className={styles.legend}>
        {activePractice
          ? <><strong>{activePractice.id} {activePractice.title}</strong>{activePractice.prerequisites.length ? <> · builds on {activePractice.prerequisites.map((id) => `${id} ${byId.get(id)?.title ?? ''}`).join(', ')}</> : ' · a foundation practice'}</>
          : 'Each star is a lifecycle stage a practice covers. Point at a practice to trace it; dashed arcs lead to the practices it builds on.'}
      </p>
    </div>
  )
}
