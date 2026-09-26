import { useSyncExternalStore } from 'react'
import { emptyWorkspace, parseWorkspace, type Answer, type EvidenceRecord, type Workspace } from './core/workspace'

/*
 * The workspace lives only in this browser's localStorage. It is never sent to the server.
 * Export and import move it between devices, colleagues or an agent.
 */
export const WORKSPACE_STORAGE_KEY = 'atp-workspace-v1'
const listeners = new Set<() => void>()
let cache: Workspace | undefined
let storageFailed = false

function load(): Workspace {
  if (cache) return cache
  try {
    const raw = localStorage.getItem(WORKSPACE_STORAGE_KEY)
    const parsed = raw ? parseWorkspace(JSON.parse(raw)) : undefined
    cache = parsed?.ok ? parsed.workspace : emptyWorkspace()
  } catch {
    storageFailed = true
    cache = emptyWorkspace()
  }
  return cache
}

function save(next: Workspace) {
  cache = next
  try { localStorage.setItem(WORKSPACE_STORAGE_KEY, JSON.stringify(next)); storageFailed = false } catch { storageFailed = true }
  listeners.forEach((listener) => listener())
}

const subscribe = (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener) } }
export const useWorkspace = () => useSyncExternalStore(subscribe, load, load)
export const workspaceStorageFailed = () => storageFailed

export function updateWorkspace(change: (workspace: Workspace) => Workspace) {
  save({ ...change(load()), updatedAt: new Date().toISOString() })
}

/* True when there are changes since the last export (or ever, if never exported). */
export const hasUnexportedChanges = (workspace: Workspace) =>
  (Object.keys(workspace.answers).length > 0 || Object.keys(workspace.steps).length > 0 || workspace.evidence.length > 0) && (!workspace.exportedAt || workspace.exportedAt < workspace.updatedAt)

export function toggleStep(practiceId: string, stepId: string) {
  updateWorkspace((workspace) => {
    const done = new Set(workspace.steps[practiceId] ?? [])
    if (done.has(stepId)) done.delete(stepId); else done.add(stepId)
    return { ...workspace, steps: { ...workspace.steps, [practiceId]: [...done].sort() } }
  })
}

export function exportWorkspace(corpusVersion?: string) {
  const exportedAt = new Date().toISOString()
  const workspace = { ...load(), corpusVersion: corpusVersion ?? load().corpusVersion, exportedAt, updatedAt: load().updatedAt }
  save(workspace)
  return new Blob([JSON.stringify(workspace, null, 2)], { type: 'application/json' })
}

export function importWorkspace(text: string): { ok: true } | { ok: false; error: string } {
  let json: unknown
  try { json = JSON.parse(text) } catch { return { ok: false, error: 'This file is not valid JSON.' } }
  const parsed = parseWorkspace(json)
  if (!parsed.ok) return parsed
  save(parsed.workspace)
  return { ok: true }
}

export const resetWorkspaceCache = () => { cache = undefined }

/* ---------- Operations used by the profile, assessment, roadmap and evidence screens ---------- */

const today = () => new Date().toISOString().slice(0, 10)

export function setProfile(patch: Partial<Workspace['profile']>) {
  updateWorkspace((workspace) => ({ ...workspace, profile: { ...workspace.profile, ...patch } }))
}

export function setAnswer(practiceId: string, level: Answer['level'] | undefined, note?: string) {
  updateWorkspace((workspace) => {
    const answers = { ...workspace.answers }
    if (level === undefined) delete answers[practiceId]
    else answers[practiceId] = { level, answeredBy: 'human', at: today(), ...(note ? { note } : answers[practiceId]?.note ? { note: answers[practiceId].note } : {}) }
    return { ...workspace, answers }
  })
}

export function setAnswerNote(practiceId: string, note: string) {
  updateWorkspace((workspace) => {
    const existing = workspace.answers[practiceId]
    if (!existing) return workspace
    return { ...workspace, answers: { ...workspace.answers, [practiceId]: { ...existing, note: note.slice(0, 2000) || undefined } } }
  })
}

export function setTarget(practiceId: string, level: Answer['level']) {
  updateWorkspace((workspace) => ({ ...workspace, targets: { ...workspace.targets, [practiceId]: level } }))
}

export function upsertEvidence(record: Omit<EvidenceRecord, 'updatedAt'>) {
  updateWorkspace((workspace) => ({
    ...workspace,
    evidence: [...workspace.evidence.filter((item) => item.id !== record.id), { ...record, updatedAt: today() }].sort((a, b) => a.id.localeCompare(b.id)),
  }))
}

export function removeEvidence(id: string) {
  updateWorkspace((workspace) => ({ ...workspace, evidence: workspace.evidence.filter((item) => item.id !== id) }))
}

export function clearWorkspace() {
  save(emptyWorkspace())
}

export function downloadFile(name: string, content: Blob | string, type = 'text/plain') {
  const blob = typeof content === 'string' ? new Blob([content], { type }) : content
  const url = URL.createObjectURL(blob)
  const link = Object.assign(document.createElement('a'), { href: url, download: name })
  document.body.append(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
