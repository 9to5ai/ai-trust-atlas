import { DownloadSimple } from '@phosphor-icons/react'
import { useMemo, useState } from 'react'
import { Link } from '../../app/router'
import { controlFamilies } from '../../data/controls'
import { CROSSWALK_DRAFTED } from '../../data/crosswalk'
import { standardNotes } from '../../exports/notes'
import { crosswalkCoverage, crosswalkFrameworks, crosswalkMatrix, type CrosswalkCell } from '../../lib/crosswalk'
import { Button, Callout, Chip, ChipGroup } from '../../ui/Kit'
import { Page, PageHero } from '../../ui/Page'
import styles from './Crosswalk.module.css'

const shortRef = (link: CrosswalkCell['links'][number]) => {
  const ref = link.provision.ref.replace(/ · p\. \d+$/, '').replace(/^Article /, 'Art ').replace(/ and Annex [IVX]+$/, '').replace(/^Annex /, '').replace(/^Clause /, 'Cl ').replace(/^Practice /, 'P')
  return link.instrument.id.startsWith('apra-') ? `${link.instrument.shortTitle.replace('APRA ', '')} · ${link.provision.title}` : ref
}

function Cell({ cell }: { cell: CrosswalkCell }) {
  const count = cell.links.length
  if (!count) return <td className={styles.empty} title="No mapping recorded — not the same as not required"><span aria-label="No recorded mapping">—</span></td>
  const shown = cell.links.slice(0, 3)
  return (
    <td className={styles.cell} data-level={Math.min(count, 3)} title={cell.links.map((link) => `${link.instrument.shortTitle} ${link.provision.ref} — ${link.provision.title}`).join('\n')}>
      <div className={styles.refs}>
        {shown.map((link) => <Link key={link.assertion.id} to={`/library/${link.instrument.id}#section-${link.provision.id}`}>{shortRef(link)}</Link>)}
        {count > shown.length && <span className={styles.more}>+{count - shown.length}</span>}
      </div>
    </td>
  )
}

export function CrosswalkPage() {
  const [family, setFamily] = useState<string | undefined>()
  const [frameworkIds, setFrameworkIds] = useState(() => crosswalkFrameworks.map((framework) => framework.id))
  const rows = useMemo(() => crosswalkMatrix(frameworkIds, family), [frameworkIds, family])
  const coverage = useMemo(() => crosswalkCoverage(crosswalkMatrix()), [])
  const frameworks = crosswalkFrameworks.filter((framework) => frameworkIds.includes(framework.id))
  const toggleFramework = (id: string) => setFrameworkIds((current) => current.includes(id) ? (current.length > 1 ? current.filter((item) => item !== id) : current) : crosswalkFrameworks.map((framework) => framework.id).filter((item) => item === id || current.includes(item)))

  const exportXlsx = async () => {
    const { downloadWorkbook } = await import('../../exports/xlsx')
    const all = crosswalkMatrix()
    await downloadWorkbook('atlas-control-crosswalk.xlsx', [
      { name: 'Crosswalk', columns: [{ header: 'Code', key: 'code', width: 10 }, { header: 'Control objective', key: 'name', width: 36 }, { header: 'Family', key: 'family', width: 22 }, ...crosswalkFrameworks.map((framework) => ({ header: framework.label, key: framework.id, width: 34 }))], rows: all.map((row) => ({ code: row.control.code, name: row.control.name, family: controlFamilies.find((item) => item.id === row.control.familyId)?.name ?? '', ...Object.fromEntries(row.cells.map((cell) => [cell.framework.id, cell.links.map((link) => `${link.provision.ref} — ${link.provision.title}`).join('\n') || 'No recorded mapping'])) })) },
      { name: 'Mappings', columns: [{ header: 'Code', key: 'code', width: 10 }, { header: 'Framework', key: 'framework', width: 22 }, { header: 'Source', key: 'source', width: 24 }, { header: 'Provision', key: 'provision', width: 28 }, { header: 'Rationale', key: 'rationale', width: 70 }, { header: 'Basis', key: 'basis', width: 20 }, { header: 'Status', key: 'status', width: 14 }, { header: 'Link', key: 'link', width: 40 }], rows: all.flatMap((row) => row.cells.flatMap((cell) => cell.links.map((link) => ({ code: row.control.code, framework: cell.framework.label, source: link.instrument.shortTitle, provision: `${link.provision.ref} — ${link.provision.title}`, rationale: link.assertion.rationale, basis: 'Atlas interpretation', status: 'Draft for review', link: { text: 'Official text', hyperlink: link.assertion.citations[0]?.url ?? link.instrument.officialUrl } })))) },
    ], [`Crosswalk drafted ${CROSSWALK_DRAFTED}. A mapping means a control objective may help address a provision; it never means the control satisfies it. “No recorded mapping” is not the same as “not required”.`, ...standardNotes])
  }

  return (
    <Page labelledBy="crosswalk-title" wide>
      <PageHero id="crosswalk-title" eyebrow="Crosswalk" title="One control, many obligations" lede="Twenty-four candidate control objectives mapped to specific articles, clauses and practices across the frameworks your clients meet most — so one well-designed control can serve several obligations." />

      <section className={styles.coverage} aria-label="Coverage by framework">
        {coverage.map(({ framework, mapped, total }) => (
          <button key={framework.id} type="button" className={styles.coverageCard} aria-pressed={frameworkIds.includes(framework.id)} onClick={() => toggleFramework(framework.id)}>
            <span className={styles.coverageLabel}>{framework.label}</span>
            <strong className="tabular">{mapped}<small>/{total}</small></strong>
            <span className={styles.bar} aria-hidden="true"><i style={{ width: `${(mapped / total) * 100}%` }} /></span>
            <small>{framework.note}</small>
          </button>
        ))}
      </section>

      <div className={styles.controls}>
        <ChipGroup label="Control family">
          <Chip pressed={!family} onClick={() => setFamily(undefined)}>All families</Chip>
          {controlFamilies.map((item) => <Chip key={item.id} pressed={family === item.id} onClick={() => setFamily(item.id)}>{item.shortName}</Chip>)}
        </ChipGroup>
        <Button onClick={exportXlsx}><DownloadSimple size={16} /> Export to Excel</Button>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.matrix}>
          <caption className="sr-only">Control objectives by framework; cells list mapped provisions</caption>
          <thead><tr><th scope="col">Control objective</th>{frameworks.map((framework) => <th key={framework.id} scope="col">{framework.shortLabel}</th>)}</tr></thead>
          {controlFamilies.filter((item) => !family || item.id === family).map((item) => (
            <tbody key={item.id}>
              <tr className={styles.familyRow}><th colSpan={frameworks.length + 1} scope="colgroup"><i style={{ background: item.color }} />{item.code} · {item.name}</th></tr>
              {rows.filter((row) => row.control.familyId === item.id).map((row) => (
                <tr key={row.control.id}>
                  <th scope="row"><Link to={`/crosswalk/${row.control.id}`}><span className="tabular">{row.control.code}</span>{row.control.name}</Link></th>
                  {row.cells.map((cell) => <Cell key={cell.framework.id} cell={cell} />)}
                </tr>
              ))}
            </tbody>
          ))}
        </table>
      </div>

      <Callout tone="caution" title="How to read this crosswalk">Every link is an Atlas interpretation drafted for editorial review: the control objective <em>may help address</em> the provision. It never establishes that a control satisfies an obligation. A dash means no mapping has been recorded — not that nothing is required.</Callout>
    </Page>
  )
}
