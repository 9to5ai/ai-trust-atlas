import { FloppyDisk } from '@phosphor-icons/react'
import { useEffect, useRef, useState } from 'react'
import { useCorpus } from '../PracticeApp'
import { clearWorkspace, downloadFile, exportWorkspace, hasUnexportedChanges, importWorkspace, useWorkspace, workspaceStorageFailed } from '../store'
import styles from './Workspace.module.css'

/*
 * The workspace lives only in this browser. This menu saves it to a file, loads a file (from another device, a
 * colleague or an agent) and clears it. A reminder appears when there is work that has never been exported.
 */
const fileName = () => `ai-trust-practice-workspace-${new Date().toISOString().slice(0, 10)}.json`

export function WorkspaceMenu() {
  const corpus = useCorpus()
  const workspace = useWorkspace()
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState<string>()
  const fileInput = useRef<HTMLInputElement>(null)
  const wrap = useRef<HTMLDivElement>(null)
  const unsaved = hasUnexportedChanges(workspace)

  useEffect(() => {
    if (!open) return
    const close = (event: MouseEvent | KeyboardEvent) => {
      if (event instanceof KeyboardEvent ? event.key === 'Escape' : !wrap.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', close)
    document.addEventListener('keydown', close)
    return () => { document.removeEventListener('mousedown', close); document.removeEventListener('keydown', close) }
  }, [open])

  const exportNow = () => { downloadFile(fileName(), exportWorkspace(corpus.version)); setMessage('Saved a copy to your downloads.'); setOpen(false) }
  const importFile = async (file: File | undefined) => {
    if (!file) return
    if (unsaved && !window.confirm('Loading a file replaces the work in this browser. Continue?')) return
    const result = importWorkspace(await file.text())
    setMessage(result.ok ? 'Workspace loaded.' : result.error)
    setOpen(false)
  }
  const clear = () => {
    if (!window.confirm('Clear your profile, answers, targets, step progress and evidence from this browser? Export a copy first if you want to keep them.')) return
    clearWorkspace()
    setMessage('Workspace cleared.')
    setOpen(false)
  }

  return (
    <div className={styles.menuWrap} ref={wrap}>
      <button type="button" className={styles.menuButton} aria-expanded={open} aria-haspopup="menu" onClick={() => setOpen((value) => !value)} title={unsaved ? 'You have work that has not been saved to a file' : 'Your workspace'}>
        <FloppyDisk size={16} /> Workspace {unsaved && <span className={styles.menuDot} aria-label="not saved to a file" />}
      </button>
      {open && (
        <div className={styles.menu} role="menu">
          <p>Your profile, answers and evidence are kept in this browser only. Save a copy to move them or keep them safe.{workspaceStorageFailed() ? ' This browser is not letting the site store data, so save a copy before you leave.' : ''}</p>
          <button type="button" role="menuitem" onClick={exportNow}>Save a copy (.json)</button>
          <button type="button" role="menuitem" onClick={() => fileInput.current?.click()}>Load a saved copy…</button>
          <button type="button" role="menuitem" className={styles.danger} onClick={clear}>Clear this browser's workspace</button>
        </div>
      )}
      <input ref={fileInput} type="file" accept="application/json,.json" hidden onChange={(event) => { void importFile(event.target.files?.[0]); event.target.value = '' }} />
      {message && <span className={styles.srOnlyLive} role="status" aria-live="polite">{message}</span>}
    </div>
  )
}

export function SaveReminder() {
  const corpus = useCorpus()
  const workspace = useWorkspace()
  const [dismissed, setDismissed] = useState(() => { try { return sessionStorage.getItem('atp-reminder-dismissed') === '1' } catch { return false } })
  const answered = Object.keys(workspace.answers).length
  const evidence = workspace.evidence.length
  if (dismissed || !hasUnexportedChanges(workspace) || answered + evidence < 3) return null
  const dismiss = () => { setDismissed(true); try { sessionStorage.setItem('atp-reminder-dismissed', '1') } catch { /* private mode */ } }
  return (
    <div className={styles.reminder} role="region" aria-label="Save reminder">
      <p>Your work is saved in this browser only. Clearing browser data will erase it.</p>
      <button type="button" className={styles.buttonPrimary} onClick={() => { downloadFile(fileName(), exportWorkspace(corpus.version)) }}>Save a copy</button>
      <button type="button" className={styles.button} onClick={dismiss}>Not now</button>
    </div>
  )
}
