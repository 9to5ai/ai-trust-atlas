import { Check, DownloadSimple, Minus, Plus, X } from '@phosphor-icons/react'
import { useMemo, useState } from 'react'
import { Link, navigate } from '../../app/router'
import { domains } from '../../data/concepts'
import { instruments } from '../../data/instruments'
import { standardNotes } from '../../exports/xlsx'
import { authorityLabels } from '../../lib/labels'
import { comparisonRows } from '../../lib/workspace'
import { Button, Callout, EmptyState } from '../../ui/Kit'
import { Page, PageHero } from '../../ui/Page'
import styles from './Compare.module.css'

const readIds = () => (new URLSearchParams(window.location.search).get('ids') ?? '').split(',').filter((id) => instruments.some((instrument) => instrument.id === id)).slice(0, 3)

export function ComparePage() {
  const [ids, setIds] = useState(readIds)
  const [onlyDifferences, setOnlyDifferences] = useState(false)
  const [adding, setAdding] = useState('')
  const update = (next: string[]) => { setIds(next); navigate(`/library/compare${next.length ? `?ids=${next.join(',')}` : ''}`, { replace: true }) }
  const selected = ids.map((id) => instruments.find((instrument) => instrument.id === id)!)
  const rows = useMemo(() => comparisonRows(ids).filter((row) => !onlyDifferences || !row.cells.every((cell) => cell.recorded || cell.provisions.length)), [ids, onlyDifferences])
  const grouped = domains.map((domain) => ({ domain, rows: rows.filter((row) => row.concept.domainId === domain.id) })).filter((group) => group.rows.length)

  const exportXlsx = async () => {
    const { downloadWorkbook } = await import('../../exports/xlsx')
    await downloadWorkbook(`atlas-comparison-${ids.join('-')}.xlsx`, [{
      name: 'Comparison',
      columns: [{ header: 'Theme', key: 'theme', width: 22 }, { header: 'Concept', key: 'concept', width: 28 }, ...selected.map((instrument) => ({ header: instrument.shortTitle, key: instrument.id, width: 44 }))],
      rows: rows.map((row) => ({ theme: domains.find((domain) => domain.id === row.concept.domainId)?.shortName ?? '', concept: row.concept.name, ...Object.fromEntries(row.cells.map((cell) => [cell.instrument.id, cell.provisions.length ? cell.provisions.map((provision) => `${provision.ref} — ${provision.title}`).join('\n') : cell.recorded ? 'Recorded at source level' : 'No recorded link'])) })),
    }], ['Shared concepts do not make sources equivalent. A missing link means none is recorded in the Atlas, not that the topic is absent from the source.', ...standardNotes])
  }

  return (
    <Page labelledBy="compare-title" wide>
      <PageHero id="compare-title" eyebrow="Compare" title="Shared themes. Different foundations." lede="Put up to three sources side by side and see where the Atlas records each one engaging the same trust concepts — down to the section." />
      <div className={styles.picker}>
        {selected.map((instrument) => (
          <div key={instrument.id} className={styles.pick}>
            <span>{authorityLabels[instrument.authorityClass]} · {instrument.region}</span>
            <Link to={`/library/${instrument.id}`}>{instrument.shortTitle}</Link>
            <button type="button" onClick={() => update(ids.filter((id) => id !== instrument.id))} aria-label={`Remove ${instrument.shortTitle}`}><X size={14} /></button>
          </div>
        ))}
        {ids.length < 3 && (
          <label className={styles.add}>
            <Plus size={16} />
            <select aria-label="Add a source to compare" value={adding} onChange={(event) => { const id = event.target.value; setAdding(''); if (id) update([...ids, id]) }}>
              <option value="">Add a source…</option>
              {[...instruments].sort((a, b) => a.shortTitle.localeCompare(b.shortTitle)).filter((instrument) => !ids.includes(instrument.id)).map((instrument) => <option key={instrument.id} value={instrument.id}>{instrument.shortTitle}</option>)}
            </select>
          </label>
        )}
      </div>

      {ids.length < 2 ? <EmptyState title="Choose at least two sources"><p>Try APRA CPS 230 with the EU AI Act and ISO/IEC 42001, or <Link to="/library/compare?ids=apra-cps-230,eu-dora,uk-pra-ss1-23">compare CPS 230, DORA and PRA SS1/23</Link>.</p></EmptyState> : (
        <>
          <div className={styles.controls}>
            <label className={styles.toggle}><input type="checkbox" checked={onlyDifferences} onChange={(event) => setOnlyDifferences(event.target.checked)} /> Only show differences</label>
            <span className="tabular">{rows.length} concepts</span>
            <Button onClick={exportXlsx} variant="secondary"><DownloadSimple size={16} /> Export to Excel</Button>
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr><th scope="col">Concept</th>{selected.map((instrument) => <th key={instrument.id} scope="col">{instrument.shortTitle}</th>)}</tr>
              </thead>
              {grouped.map(({ domain, rows: domainRows }) => (
                <tbody key={domain.id}>
                  <tr className={styles.group}><th colSpan={selected.length + 1} scope="colgroup"><i style={{ background: domain.color }} />{domain.name}</th></tr>
                  {domainRows.map((row) => (
                    <tr key={row.concept.id}>
                      <th scope="row"><Link to={`/universe#/concept/${row.concept.id}`}>{row.concept.name}</Link></th>
                      {row.cells.map((cell) => (
                        <td key={cell.instrument.id} className={cell.provisions.length ? styles.strong : cell.recorded ? styles.weak : styles.none}>
                          {cell.provisions.length ? (
                            <ul>{cell.provisions.map((provision) => <li key={provision.id}><Check size={12} weight="bold" /><Link to={`/library/${cell.instrument.id}#section-${provision.id}`}>{provision.ref}</Link> <span>{provision.title}</span></li>)}</ul>
                          ) : cell.recorded ? <span><Check size={12} /> Source level</span> : <span aria-label="No recorded link"><Minus size={12} /></span>}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              ))}
            </table>
          </div>
          <Callout tone="caution" title="Read with care">Shared concepts do not make sources equivalent, and a dash means no link is recorded in the Atlas — not that the topic is absent from the source.</Callout>
        </>
      )}
    </Page>
  )
}
