import { ArrowLeft, ArrowUpRight, CirclesThreePlus, FileText, ListBullets, Rows } from '@phosphor-icons/react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useMemo, useState } from 'react'
import { buildFocusListModel, type FocusListMode } from '../lib/focusList'
import { authorityLabels } from '../lib/labels'
import type { Instrument } from '../types'

type Props = {
  anchorId: string
  instruments: Instrument[]
  selectedNodeId?: string
  onSelectNode: (nodeId: string) => void
  onReturnToAtlas: () => void
  inactive?: boolean
}

export function FocusList({ anchorId, instruments, selectedNodeId, onSelectNode, onReturnToAtlas, inactive = false }: Props) {
  const model = useMemo(() => buildFocusListModel(anchorId, instruments), [anchorId, instruments])
  const [mode, setMode] = useState<FocusListMode>(model?.defaultMode ?? 'instruments')
  const reducedMotion = useReducedMotion()

  useEffect(() => setMode(model?.defaultMode ?? 'instruments'), [model?.anchorId, model?.defaultMode])
  if (!model) return null

  const rows = mode === 'provisions' ? model.provisions : model.instruments
  const spring = reducedMotion ? { duration: 0 } : { type: 'spring' as const, stiffness: 210, damping: 27, mass: 0.85 }

  return (
    <motion.section
      className="focus-list"
      aria-labelledby="focus-list-title"
      initial={reducedMotion ? false : { opacity: 0, scale: 1.035 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
      transition={spring}
      inert={inactive || undefined}
      aria-hidden={inactive || undefined}
    >
      <div className="focus-list-ambient" aria-hidden="true"><span /><span /><span /></div>
      <header className="focus-list-header">
        <button className="focus-return" type="button" onClick={onReturnToAtlas}><ArrowLeft /> Return to universe</button>
        <div className="focus-anchor">
          <span>{model.anchorEyebrow}</span>
          <h2 id="focus-list-title">{model.anchorLabel}</h2>
          <p>{model.anchorSummary}</p>
        </div>
        <div className="focus-list-summary" aria-live="polite">
          <strong>{rows.length}</strong>
          <span>{mode === 'provisions' ? 'source provisions' : 'connected instruments'}</span>
        </div>
      </header>

      <div className="focus-list-toolbar">
        <div className="focus-mode-switch" role="tablist" aria-label="Focus list contents">
          {model.provisions.length > 0 && <button type="button" role="tab" aria-selected={mode === 'provisions'} onClick={() => setMode('provisions')}><FileText /> Provisions <small>{model.provisions.length}</small></button>}
          <button type="button" role="tab" aria-selected={mode === 'instruments'} onClick={() => setMode('instruments')}><Rows /> {model.provisions.length ? 'Related instruments' : 'Instruments'} <small>{model.instruments.length}</small></button>
        </div>
        <p><CirclesThreePlus /> Ranked by explicit shared concepts and source foundations.</p>
      </div>

      <div className="focus-list-scroll" role="tabpanel" tabIndex={0}>
        <div className="focus-spine" aria-hidden="true" />
        <AnimatePresence mode="popLayout" initial={false}>
          {mode === 'instruments' && model.instruments.map((row, index) => (
            <motion.button
              layout
              className={selectedNodeId === `instrument:${row.instrument.id}` ? 'focus-row instrument-row selected' : 'focus-row instrument-row'}
              type="button"
              key={row.instrument.id}
              onClick={() => onSelectNode(`instrument:${row.instrument.id}`)}
              initial={reducedMotion ? false : { opacity: 0, x: index % 2 === 0 ? -72 : 72, y: 20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, x: 24 }}
              transition={{ ...spring, delay: reducedMotion ? 0 : Math.min(index, 10) * 0.035 }}
            >
              <span className="focus-index">{String(index + 1).padStart(2, '0')}</span>
              <i className="focus-node" aria-hidden="true" />
              <span className="focus-row-main">
                <span className="focus-row-title"><strong>{row.instrument.shortTitle}</strong><small>{authorityLabels[row.instrument.authorityClass]}</small></span>
                <span className="focus-row-subtitle">{row.instrument.issuer} · {row.instrument.region} · {row.instrument.status.replaceAll('-', ' ')}</span>
                <span className="focus-connection">{row.connectionLabel}</span>
              </span>
              <span className="focus-row-metrics">
                <span><strong>{row.sharedConcepts.length}</strong> concepts</span>
                <span><strong>{row.relatedRiskCount}</strong> risks</span>
                <span><strong>{row.relatedControlCount}</strong> controls</span>
              </span>
              <ArrowUpRight className="focus-row-arrow" />
            </motion.button>
          ))}

          {mode === 'provisions' && model.provisions.map((row, index) => (
            <motion.button
              layout
              className={selectedNodeId === `provision:${row.provision.id}` ? 'focus-row provision-row selected' : 'focus-row provision-row'}
              type="button"
              key={row.provision.id}
              onClick={() => onSelectNode(`provision:${row.provision.id}`)}
              initial={reducedMotion ? false : { opacity: 0, x: index % 2 === 0 ? -64 : 64, y: 18 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, x: 24 }}
              transition={{ ...spring, delay: reducedMotion ? 0 : Math.min(index, 10) * 0.045 }}
            >
              <span className="focus-index">{String(index + 1).padStart(2, '0')}</span>
              <i className="focus-node provision" aria-hidden="true" />
              <span className="focus-row-main">
                <span className="focus-row-title"><strong>{row.provision.ref}</strong><small>{row.provision.granularity ?? 'source provision'}</small></span>
                <span className="focus-row-subtitle">{row.provision.title}</span>
                <span className="focus-connection">{row.concepts.map((concept) => concept.name).join(' + ') || 'Document structure'}</span>
              </span>
              <span className="focus-row-copy">{row.provision.summary}</span>
              <ArrowUpRight className="focus-row-arrow" />
            </motion.button>
          ))}
        </AnimatePresence>

        {rows.length === 0 && <div className="focus-empty"><ListBullets /><strong>No connected records in the active filters.</strong><p>Return to the universe or broaden the filters in Explore.</p></div>}
      </div>
    </motion.section>
  )
}
