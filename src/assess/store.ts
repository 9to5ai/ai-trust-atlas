import { useSyncExternalStore } from 'react'
import { assessmentItems, type EvidenceStatus, type Level } from './content'

/*
 * Assessments are stored only in this browser (localStorage). They are never
 * sent to a server or to Ask the Atlas. Export produces a JSON file the user
 * controls; import validates and re-creates it.
 */
export type ItemResponse = { current?: Level; target?: Level; notes: string; evidence: EvidenceStatus }
export type Assessment = { id: string; name: string; scope: string; createdAt: string; updatedAt: string; example?: boolean; responses: Record<string, ItemResponse> }

export const ASSESSMENT_STORAGE_KEY = 'atlas-assessments-v1'
const listeners = new Set<() => void>()
let cache: Assessment[] | undefined
let storageError = false

const isLevel = (value: unknown): value is Level => Number.isInteger(value) && (value as number) >= 0 && (value as number) <= 5
const validIds = new Set(assessmentItems.map((item) => item.control.id))

export function parseAssessments(raw: string | null): Assessment[] {
  try {
    const value = JSON.parse(raw ?? '[]')
    const list = Array.isArray(value) ? value : [value]
    return list.filter((item) => item && typeof item.id === 'string' && typeof item.name === 'string').map((item) => ({
      id: item.id,
      name: String(item.name).slice(0, 120),
      scope: typeof item.scope === 'string' ? item.scope.slice(0, 400) : '',
      createdAt: typeof item.createdAt === 'string' ? item.createdAt : new Date().toISOString(),
      updatedAt: typeof item.updatedAt === 'string' ? item.updatedAt : new Date().toISOString(),
      example: item.example === true || undefined,
      responses: Object.fromEntries(Object.entries(item.responses ?? {}).filter(([id]) => validIds.has(id)).map(([id, response]) => {
        const r = response as Partial<ItemResponse>
        return [id, { current: isLevel(r.current) ? r.current : undefined, target: isLevel(r.target) ? r.target : undefined, notes: typeof r.notes === 'string' ? r.notes.slice(0, 2000) : '', evidence: (['not-requested', 'requested', 'received', 'reviewed'] as const).includes(r.evidence as EvidenceStatus) ? r.evidence as EvidenceStatus : 'not-requested' }]
      })),
    }))
  } catch {
    return []
  }
}

function load(): Assessment[] {
  if (cache) return cache
  try { cache = parseAssessments(localStorage.getItem(ASSESSMENT_STORAGE_KEY)) } catch { storageError = true; cache = [] }
  return cache
}

function save(next: Assessment[]) {
  cache = next
  try { localStorage.setItem(ASSESSMENT_STORAGE_KEY, JSON.stringify(next)); storageError = false } catch { storageError = true }
  listeners.forEach((listener) => listener())
}

const subscribe = (listener: () => void) => { listeners.add(listener); return () => listeners.delete(listener) }
export const useAssessments = () => useSyncExternalStore(subscribe, load, load)
export const useAssessment = (id: string) => useAssessments().find((item) => item.id === id)
export const assessmentStorageFailed = () => storageError
export const resetAssessmentCache = () => { cache = undefined }

const newId = () => (typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `a${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`)

export function createAssessment(name: string, scope: string, responses: Assessment['responses'] = {}, example = false) {
  const now = new Date().toISOString()
  const assessment: Assessment = { id: newId(), name: name.trim() || 'Untitled assessment', scope: scope.trim(), createdAt: now, updatedAt: now, responses, ...(example ? { example: true } : {}) }
  save([assessment, ...load()])
  return assessment.id
}

export function updateAssessment(id: string, patch: Partial<Pick<Assessment, 'name' | 'scope'>>) {
  save(load().map((item) => (item.id === id ? { ...item, ...patch, updatedAt: new Date().toISOString() } : item)))
}

export function updateResponse(id: string, objectiveId: string, patch: Partial<ItemResponse>) {
  save(load().map((item) => {
    if (item.id !== id) return item
    const current = item.responses[objectiveId] ?? { notes: '', evidence: 'not-requested' as EvidenceStatus }
    return { ...item, updatedAt: new Date().toISOString(), responses: { ...item.responses, [objectiveId]: { ...current, ...patch } } }
  }))
}

export const deleteAssessment = (id: string) => save(load().filter((item) => item.id !== id))
export const exportAssessmentJson = (assessment: Assessment) => JSON.stringify({ format: 'ai-trust-atlas-assessment', version: 1, ...assessment }, null, 2)

export function importAssessmentJson(raw: string) {
  const [parsed] = parseAssessments(raw)
  if (!parsed) return undefined
  const imported = { ...parsed, id: newId(), updatedAt: new Date().toISOString() }
  save([imported, ...load()])
  return imported.id
}

/* A clearly labelled example for demonstrations. */
export function createExampleAssessment() {
  const pattern: [Level, Level][] = [[3, 4], [2, 4], [2, 3], [1, 3], [3, 3], [2, 4], [1, 3], [2, 4], [3, 4], [2, 3], [3, 4], [1, 3], [2, 3], [1, 3], [1, 2], [2, 3], [2, 4], [1, 3], [1, 3], [1, 4], [2, 4], [1, 3], [3, 4], [2, 3]]
  const evidence: EvidenceStatus[] = ['reviewed', 'received', 'requested', 'not-requested']
  const responses = Object.fromEntries(assessmentItems.map((item, index) => [item.control.id, { current: pattern[index % pattern.length][0], target: pattern[index % pattern.length][1], notes: '', evidence: evidence[index % evidence.length] }]))
  return createAssessment('Example — regional bank, AI in lending and servicing', 'Illustrative data only. Retail lending decision support, customer-service assistant and fraud analytics.', responses, true)
}
