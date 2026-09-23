import { lazy, Suspense, useState } from 'react'
import { GraphCanvas } from '../components/GraphCanvas'
import { supportsWebGL, type UniverseProps } from './shared'

const WebGLUniverse = lazy(() => import('./WebGLUniverse'))

/* Chooses the cinematic WebGL renderer when available, the 2D canvas otherwise. */
export function Universe(props: UniverseProps) {
  const [webgl, setWebgl] = useState(supportsWebGL)
  if (!webgl) return <GraphCanvas {...props} />
  return (
    <Suspense fallback={<div className="graph-stage universe-loading" aria-busy="true"><span>Charting the universe…</span></div>}>
      <WebGLUniverse {...props} onContextLost={() => setWebgl(false)} />
    </Suspense>
  )
}
