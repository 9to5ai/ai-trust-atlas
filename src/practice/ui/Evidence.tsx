import { DownloadSimple, FileDoc, Printer } from '@phosphor-icons/react'
import { useMemo, useState, type CSSProperties } from 'react'
import { Link } from '../../app/router'
import { Page, PageHero } from '../../ui/Page'
import { compileEvidencePack, evidencePackMarkdown, evidenceRecordId, evidenceStatusNames, type EvidenceStatus } from '../core/evidence'
import { maturityLevels } from '../core/facets'
import type { Practice } from '../core/schema'
import type { EvidenceRecord } from '../core/workspace'
import { useCorpus } from '../PracticeApp'
import { downloadFile, removeEvidence, upsertEvidence, useWorkspace } from '../store'
import { domainColors } from './PracticeMap'
import styles from './Workspace.module.css'

/*
 * Evidence: for each practice's evidence tests, record what exists, where it is and whether it has been reviewed.
 * Work produced with AI tools records the tool, model, date and the person who checked it.
 */
export function Evidence() {
  const corpus = useCorpus()
  const workspace = useWorkspace()
  const today = new Date().toISOString().slice(0, 10)
  const [scope, setScope] = useState<'mine' | 'all'>('mine')
  const [busy, setBusy] = useState(false)
  const started = (practice: Practice) => !!workspace.answers[practice.id] || !!workspace.steps[practice.id]?.length || workspace.evidence.some((record) => record.practiceId === practice.id)
  const shown = scope === 'all' || !corpus.practices.some(started) ? corpus.practices : corpus.practices.filter(started)
  const pack = useMemo(() => compileEvidencePack(corpus, workspace, { today, practiceIds: shown.map((practice) => practice.id) }), [corpus, workspace, today, shown])
  const records = new Map(workspace.evidence.map((record) => [record.id, record]))
  const fileBase = `ai-trust-evidence-${(workspace.profile.orgName || 'pack').toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${today}`

  const exportDocx = async () => {
    setBusy(true)
    try { const { evidencePackDocx } = await import('../exports/docx'); downloadFile(`${fileBase}.docx`, await evidencePackDocx(pack)) } finally { setBusy(false) }
  }

  return (
    <Page labelledBy="evidence-title" wide>
      <PageHero id="evidence-title" eyebrow="Evidence" title="Evidence that your practices operate" lede="Record, test by test, the evidence an auditor would look for: what exists, where it is and whether someone has reviewed it. This becomes your evidence pack." />
      <div className={styles.counts}>
        {(['reviewed', 'collected', 'planned', 'none'] as EvidenceStatus[]).map((status) => <div key={status} className={styles.count}><strong>{pack.counts[status]}</strong><span className={styles.muted}>{evidenceStatusNames[status]}</span></div>)}
        <div className={styles.count}><strong>{pack.aiProduced}</strong><span className={styles.muted}>Produced with AI tools</span></div>
      </div>
      <div className={styles.actions}>
        <button type="button" className={styles.button} onClick={() => downloadFile(`${fileBase}.md`, evidencePackMarkdown(pack), 'text/markdown')}><DownloadSimple size={16} /> Evidence pack (Markdown)</button>
        <button type="button" className={styles.button} onClick={exportDocx} disabled={busy}><FileDoc size={16} /> {busy ? 'Preparing…' : 'Evidence pack (Word)'}</button>
        <Link to="/practice/board-summary" className={styles.button}><Printer size={16} /> Board summary</Link>
        <span className={styles.muted} role="group" aria-label="Which practices to show">
          <button type="button" className={styles.linkButton} aria-pressed={scope === 'mine'} onClick={() => setScope('mine')} style={{ fontWeight: scope === 'mine' ? 700 : 400 }}>Practices you have started</button>
          {' · '}
          <button type="button" className={styles.linkButton} aria-pressed={scope === 'all'} onClick={() => setScope('all')} style={{ fontWeight: scope === 'all' ? 700 : 400 }}>All practices</button>
        </span>
      </div>
      {shown.map((practice) => {
        const packPractice = pack.practices.find((item) => item.id === practice.id)!
        const recorded = practice.evidenceTests.filter((test) => records.has(evidenceRecordId(practice.id, test.id))).length
        return (
          <details key={practice.id} className={styles.evidencePractice} style={{ '--c': domainColors[practice.domain] } as CSSProperties} open={recorded > 0 || undefined}>
            <summary><span className={styles.qid}>{practice.id}</span>{practice.title}<span className={styles.muted}>{packPractice.levelName ?? 'Not assessed'} → {maturityLevels[packPractice.target - 1].name} · {recorded} of {practice.evidenceTests.length} tests with evidence</span></summary>
            <div className={styles.tests}>
              {practice.evidenceTests.map((test) => <TestRow key={test.id} practice={practice} testId={test.id} testText={test.test} expected={test.evidence} record={records.get(evidenceRecordId(practice.id, test.id))} />)}
            </div>
          </details>
        )
      })}
    </Page>
  )
}

function TestRow({ practice, testId, testText, expected, record }: { practice: Practice; testId: string; testText: string; expected: string; record?: EvidenceRecord }) {
  const id = evidenceRecordId(practice.id, testId)
  const [ai, setAi] = useState(!!(record?.provenance?.tool || record?.provenance?.model))
  const save = (patch: Partial<EvidenceRecord>) => {
    const base: Omit<EvidenceRecord, 'updatedAt'> = { id, practiceId: practice.id, testId, title: `${practice.id} ${testId}`, status: record?.status ?? 'planned', location: record?.location, note: record?.note, provenance: record?.provenance }
    upsertEvidence({ ...base, ...patch })
  }
  const setProvenance = (key: 'tool' | 'model' | 'date' | 'reviewer', value: string) => save({ provenance: { ...record?.provenance, [key]: value || undefined } })
  return (
    <div className={styles.test}>
      <div>
        <p><strong className={styles.qid}>{testId}</strong> {testText}</p>
        <p className={styles.muted}>An auditor would look for: {expected}</p>
      </div>
      <div className={styles.testControls}>
        <label className={styles.check}>Status
          <select className={styles.select} value={record?.status ?? 'none'} onChange={(event) => event.target.value === 'none' ? removeEvidence(id) : save({ status: event.target.value as EvidenceRecord['status'] })}>
            {(['none', 'planned', 'collected', 'reviewed'] as EvidenceStatus[]).map((status) => <option key={status} value={status}>{evidenceStatusNames[status]}</option>)}
          </select>
        </label>
        {record && <>
          <input className={styles.input} aria-label={`Where the evidence for ${practice.id} ${testId} is`} placeholder="Where it is (document name, link or system)" defaultValue={record.location ?? ''} maxLength={500} onBlur={(event) => save({ location: event.target.value || undefined })} />
          <textarea className={styles.textarea} aria-label={`Notes for ${practice.id} ${testId}`} placeholder="Notes: what it shows, gaps, next steps" defaultValue={record.note ?? ''} maxLength={2000} onBlur={(event) => save({ note: event.target.value || undefined })} />
          <label className={styles.check}><input type="checkbox" checked={ai} onChange={(event) => { setAi(event.target.checked); if (!event.target.checked) save({ provenance: undefined }) }} /> Produced with an AI tool</label>
          {ai && (
            <div className={styles.provenance}>
              <input className={styles.input} aria-label="AI tool" placeholder="Tool (for example Claude)" defaultValue={record.provenance?.tool ?? ''} maxLength={120} onBlur={(event) => setProvenance('tool', event.target.value)} />
              <input className={styles.input} aria-label="Model" placeholder="Model" defaultValue={record.provenance?.model ?? ''} maxLength={120} onBlur={(event) => setProvenance('model', event.target.value)} />
              <input className={styles.input} aria-label="Date produced" type="date" defaultValue={record.provenance?.date ?? ''} onBlur={(event) => setProvenance('date', event.target.value)} />
              <input className={styles.input} aria-label="Reviewed by" placeholder="Reviewed by (name or role)" defaultValue={record.provenance?.reviewer ?? ''} maxLength={120} onBlur={(event) => setProvenance('reviewer', event.target.value)} />
            </div>
          )}
        </>}
      </div>
    </div>
  )
}
