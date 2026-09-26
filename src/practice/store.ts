import { useSyncExternalStore } from 'react'
import { emptyWorkspace, parseWorkspace, type Workspace } from './core/workspace'

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
