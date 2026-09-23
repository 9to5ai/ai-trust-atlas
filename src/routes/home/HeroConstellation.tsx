import { useMemo } from 'react'
import { buildGraphModel } from '../../lib/graphModel'
import styles from './Home.module.css'

/*
 * The real Atlas graph (topics, concepts, sources and their links), drawn as a
 * tilted, slowly turning disc. Decorative: the same content is navigable in the
 * Universe and List views.
 */
export function HeroConstellation() {
  const model = useMemo(() => buildGraphModel('ontology', { query: '', authorityClasses: new Set(), regions: new Set(), publishedThrough: 9999 }, undefined, 'all', false, false), [])
  const byId = useMemo(() => new Map(model.nodes.map((node) => [node.id, node])), [model])
  return (
    <div className={styles.constellation} aria-hidden="true">
      <svg viewBox="-600 -600 1200 1200" className={styles.disc}>
        <defs>
          <radialGradient id="hero-core">
            <stop offset="0" stopColor="var(--signal)" stopOpacity=".55" />
            <stop offset=".35" stopColor="var(--aurora)" stopOpacity=".18" />
            <stop offset="1" stopColor="var(--aurora)" stopOpacity="0" />
          </radialGradient>
          <filter id="hero-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <circle r="560" className={styles.orbit} />
        <circle r="400" className={styles.orbit} />
        <circle r="240" className={styles.orbit} />
        <circle r="230" fill="url(#hero-core)" />
        <g className={styles.edges}>
          {model.edges.map((edge) => {
            const from = byId.get(edge.sourceId)
            const to = byId.get(edge.targetId)
            if (!from || !to) return null
            return <line key={edge.id} x1={from.targetX} y1={from.targetY} x2={to.targetX} y2={to.targetY} stroke={to.color} />
          })}
        </g>
        <g filter="url(#hero-glow)">
          {model.nodes.map((node) => (
            <circle key={node.id} cx={node.targetX} cy={node.targetY} r={node.kind === 'domain' ? 11 : node.kind === 'concept' ? 5.5 : 3.6} fill={node.color} className={node.kind === 'domain' ? styles.domainNode : undefined} />
          ))}
        </g>
        <circle r="26" className={styles.core} />
      </svg>
    </div>
  )
}
