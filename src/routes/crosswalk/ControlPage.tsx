import { ArrowSquareOut, Planet } from '@phosphor-icons/react'
import { Link } from '../../app/router'
import { conceptById } from '../../data/concepts'
import { controlFamilies, controlObjectives } from '../../data/controls'
import { crosswalkMatrix } from '../../lib/crosswalk'
import { Badge, Button, Callout, DraftBadge } from '../../ui/Kit'
import { Page } from '../../ui/Page'
import { NotFound } from '../NotFound'
import styles from './Crosswalk.module.css'

export function ControlPage({ id }: { id: string }) {
  const control = controlObjectives.find((item) => item.id === id)
  if (!control) return <NotFound />
  const family = controlFamilies.find((item) => item.id === control.familyId)
  const row = crosswalkMatrix().find((item) => item.control.id === id)!
  return (
    <Page labelledBy="control-title" wide>
      <nav className={styles.crumbs} aria-label="Breadcrumb"><Link to="/crosswalk">Crosswalk</Link><span>/</span><span>{family?.name}</span></nav>
      <header className={styles.hero}>
        <div className={styles.badges}><Badge tone="aurora">{control.code}</Badge><Badge>{family?.name}</Badge>{control.controlTypes.map((type) => <Badge key={type}>{type}</Badge>)}</div>
        <h1 id="control-title">{control.name}</h1>
        <p>{control.objective}</p>
        <div className={styles.actionsRow}><Button to={`/universe#/control-objective/${control.id}`} variant="primary"><Planet size={18} /> Open in the Universe</Button></div>
      </header>
      <div className={styles.detailGrid}>
        <div className={styles.detailMain}>
          <section>
            <h2>Why it matters</h2>
            <p className={styles.lead}>{control.purpose}</p>
          </section>
          <section>
            <h2>Where it maps</h2>
            <div className={styles.frameworks}>
              {row.cells.map((cell) => (
                <article key={cell.framework.id} className={styles.frameworkCard}>
                  <header><h3>{cell.framework.label}</h3><span className="tabular">{cell.links.length || 'No'} {cell.links.length === 1 ? 'mapping' : 'mappings'}</span></header>
                  {cell.links.length ? (
                    <ul>{cell.links.map((link) => (
                      <li key={link.assertion.id}>
                        <Link to={`/library/${link.instrument.id}#section-${link.provision.id}`}><span className="tabular">{link.provision.ref}</span> {link.provision.title}</Link>
                        <p>{link.provision.summary}</p>
                        <small>{link.instrument.shortTitle} · Atlas interpretation {link.provision.editorialStatus === 'draft' && <DraftBadge />}</small>
                      </li>
                    ))}</ul>
                  ) : <p className={styles.none}>No mapping recorded. That is not the same as “not required”.</p>}
                </article>
              ))}
            </div>
          </section>
        </div>
        <aside className={styles.detailSide}>
          <div className={styles.panel}>
            <h2>Implementation examples</h2>
            <ul>{control.implementationExamples.map((example) => <li key={example}>{example}</li>)}</ul>
          </div>
          <div className={styles.panel}>
            <h2>Evidence to look for</h2>
            <ul>{control.evidenceExamples.map((example) => <li key={example}>{example}</li>)}</ul>
          </div>
          <div className={styles.panel}>
            <h2>Concepts</h2>
            <div className={styles.tags}>{control.conceptIds.map((conceptId) => <Link key={conceptId} to={`/universe#/concept/${conceptId}`}>{conceptById.get(conceptId)?.name ?? conceptId}</Link>)}</div>
          </div>
          <div className={styles.panel}>
            <h2>Seeded from</h2>
            <ul>{control.sourceRefs.map((ref) => <li key={`${ref.instrumentId}-${ref.locator}`}><a href={ref.url} target="_blank" rel="noreferrer">{ref.sourceTitle} <ArrowSquareOut size={12} /></a> <small>{ref.locator}</small></li>)}</ul>
          </div>
        </aside>
      </div>
      <Callout tone="caution">Candidate control objectives are neutral starting points, not a claim about any organisation’s controls or their effectiveness.</Callout>
    </Page>
  )
}
