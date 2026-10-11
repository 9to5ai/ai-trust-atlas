import { lazy, Suspense, useState } from 'react'
import { supportsWebGL, type UniverseProps } from './shared'
import './clusters.css'

const WebGLUniverse = lazy(() => import('./WebGLUniverse'))
const GraphCanvas = lazy(() => import('../components/GraphCanvas').then(module => ({ default: module.GraphCanvas })))

/* Chooses the cinematic WebGL renderer when available, the 2D canvas otherwise. */
export function Universe(props: UniverseProps) {
  const [webgl, setWebgl] = useState(supportsWebGL)
  return (
    <Suspense fallback={<div className="graph-stage universe-loading" aria-busy="true"><span>Charting the universe…</span></div>}>
      {webgl ? <WebGLUniverse {...props} onContextLost={() => setWebgl(false)} /> : <GraphCanvas {...props} />}
    </Suspense>
  )
}
