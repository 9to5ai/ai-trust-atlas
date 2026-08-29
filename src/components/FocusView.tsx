import { ArrowLeft, ArrowRight, GitBranch, ListBullets } from '@phosphor-icons/react'
import { AnimatePresence, motion } from 'motion/react'
import type { CSSProperties } from 'react'
import { concepts, domainById, domains } from '../data/concepts'
import { instrumentById, instruments } from '../data/instruments'
import { relations } from '../data/relations'
import { authorityLabels, relationLabels } from '../lib/labels'

type Props = {
  selectedNodeId: string
  onSelectNode: (nodeId: string) => void
  onBack: () => void
}

type StructureRow = {
  id: string
  title: string
  meta: string
  summary?: string
}

const nodeKindLabel = (kind: string) => kind === 'instrument'
  ? 'Instrument'
  : kind === 'concept'
    ? 'Ontology concept'
    : kind === 'domain'
      ? 'Trust domain'
      : 'Clause-level detail'

export function FocusView({ selectedNodeId, onSelectNode, onBack }: Props) {
  const [kind, rawId] = selectedNodeId.split(':')
  const instrument = kind === 'instrument' ? instrumentById.get(rawId) : kind === 'clause' ? instruments.find((candidate) => candidate.clauses.some((clause) => clause.id === rawId)) : undefined
  const clause = kind === 'clause' ? instrument?.clauses.find((candidate) => candidate.id === rawId) : undefined
  const concept = kind === 'concept' ? concepts.find((candidate) => candidate.id === rawId) : undefined
  const domain = kind === 'domain' ? domains.find((candidate) => candidate.id === rawId) : concept ? domainById.get(concept.domainId) : undefined

  const title = clause?.title ?? instrument?.shortTitle ?? concept?.name ?? domain?.name ?? 'Selected node'
  const summary = clause?.summary ?? instrument?.summary ?? concept?.definition ?? domain?.definition ?? ''
  const selectedDomain = domain ?? (instrument ? domainById.get(concepts.find((candidate) => instrument.conceptIds.includes(candidate.id))?.domainId ?? '') : undefined)
  const accent = selectedDomain?.color ?? '#8ad7d0'

  const explainedRelations = instrument && !clause
    ? relations.filter((relation) => relation.sourceId === instrument.id || relation.targetId === instrument.id).map((relation) => {
      const outgoing = relation.sourceId === instrument.id
      return { relation, related: instrumentById.get(outgoing ? relation.targetId : relation.sourceId), direction: outgoing ? 'Outgoing' : 'Incoming' }
    }).filter((entry) => entry.related)
    : []

  const structureRows: StructureRow[] = instrument && !clause
    ? [
      ...instrument.conceptIds.flatMap((conceptId) => {
        const item = concepts.find((candidate) => candidate.id === conceptId)
        return item ? [{ id: `concept:${item.id}`, title: item.name, meta: domainById.get(item.domainId)?.name ?? 'Ontology concept', summary: item.definition }] : []
      }),
      ...instrument.clauses.map((item) => ({ id: `clause:${item.id}`, title: `${item.ref} · ${item.title}`, meta: 'Clause-level detail', summary: item.summary })),
    ]
    : concept
      ? [
        ...(domain ? [{ id: `domain:${domain.id}`, title: domain.name, meta: 'Parent trust domain', summary: domain.definition }] : []),
        ...instruments.filter((candidate) => candidate.conceptIds.includes(concept.id)).map((item) => ({ id: `instrument:${item.id}`, title: item.shortTitle, meta: authorityLabels[item.authorityClass], summary: item.summary })),
      ]
      : domain
        ? concepts.filter((item) => item.domainId === domain.id).map((item) => ({
          id: `concept:${item.id}`,
          title: item.name,
          meta: `${instruments.filter((candidate) => candidate.conceptIds.includes(item.id)).length} connected instruments`,
          summary: item.definition,
        }))
        : clause && instrument
          ? [
            { id: `instrument:${instrument.id}`, title: instrument.shortTitle, meta: 'Parent instrument', summary: instrument.summary },
            ...clause.conceptIds.flatMap((conceptId) => {
              const item = concepts.find((candidate) => candidate.id === conceptId)
              return item ? [{ id: `concept:${item.id}`, title: item.name, meta: domainById.get(item.domainId)?.name ?? 'Ontology concept', summary: item.definition }] : []
            }),
          ]
          : []

  return (
    <AnimatePresence mode="wait">
      <motion.section
        className="focus-ledger"
        key={selectedNodeId}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        aria-label={`Relationship list for ${title}`}
        style={{ '--focus-accent': accent } as CSSProperties}
      >
        <header className="focus-ledger-header">
          <button className="focus-back" type="button" onClick={onBack}><ArrowLeft /> Back to universe</button>
          <div className="focus-kicker"><span />{nodeKindLabel(kind)}</div>
          <h2>{title}</h2>
          {summary && <p>{summary}</p>}
          <div className="focus-ledger-metrics" role="group" aria-label="Selected node connection counts">
            <div><strong>{explainedRelations.length}</strong><span>explained relationships</span></div>
            <div><strong>{structureRows.length}</strong><span>structural connections</span></div>
          </div>
        </header>

        {explainedRelations.length > 0 && (
          <section className="focus-group">
            <div className="focus-group-heading"><GitBranch /><div><h3>Explained relationships</h3><p>Curated links with direction, basis and confidence.</p></div><span>{explainedRelations.length}</span></div>
            <div className="focus-rows">
              {explainedRelations.map(({ relation, related, direction }, index) => (
                <button className="focus-row focus-relation-row" type="button" key={relation.id} onClick={() => related && onSelectNode(`instrument:${related.id}`)}>
                  <span className="focus-row-index">{String(index + 1).padStart(2, '0')}</span>
                  <span className="focus-row-body">
                    <span className="focus-row-meta">{direction} · {relationLabels[relation.type]}</span>
                    <strong>{related?.shortTitle}</strong>
                    <p>{relation.explanation}</p>
                    <small>{relation.basis.replaceAll('-', ' ')} · {relation.confidence} confidence</small>
                  </span>
                  <ArrowRight className="focus-row-arrow" />
                </button>
              ))}
            </div>
          </section>
        )}

        <section className="focus-group">
          <div className="focus-group-heading"><ListBullets /><div><h3>Structural connections</h3><p>Navigate the ontology without tracing lines.</p></div><span>{structureRows.length}</span></div>
          <div className="focus-rows">
            {structureRows.map((row, index) => (
              <button className="focus-row" type="button" key={row.id} onClick={() => onSelectNode(row.id)}>
                <span className="focus-row-index">{String(index + 1).padStart(2, '0')}</span>
                <span className="focus-row-body">
                  <span className="focus-row-meta">{row.meta}</span>
                  <strong>{row.title}</strong>
                  {row.summary && <p>{row.summary}</p>}
                </span>
                <ArrowRight className="focus-row-arrow" />
              </button>
            ))}
            {structureRows.length === 0 && <p className="focus-empty">No structural connection is recorded for this node.</p>}
          </div>
        </section>
      </motion.section>
    </AnimatePresence>
  )
}
