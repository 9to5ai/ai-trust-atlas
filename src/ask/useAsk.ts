import { useCallback, useRef, useState } from 'react'

export type AskRecord = { id: string; title: string; kind: string; draft: boolean }
export type AskMessage = {
  id: string
  role: 'user' | 'model'
  text: string
  records?: AskRecord[]
  cited?: string[]
  dropped?: string[]
  uncited?: boolean
  conclusiveLanguage?: boolean
  model?: string
  provider?: string
  error?: string
  pending?: boolean
}

/* Reads a Server-Sent Events stream from a fetch body. */
export async function* readEvents(body: ReadableStream<Uint8Array>) {
  const reader = body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    let boundary = buffer.indexOf('\n\n')
    while (boundary !== -1) {
      const block = buffer.slice(0, boundary)
      buffer = buffer.slice(boundary + 2)
      const event = block.match(/^event: (.+)$/m)?.[1]
      const data = block.match(/^data: (.+)$/m)?.[1]
      if (event && data) yield { event, data: JSON.parse(data) as Record<string, unknown> }
      boundary = buffer.indexOf('\n\n')
    }
  }
}

let counter = 0
const nextId = () => `m${Date.now().toString(36)}${(counter++).toString(36)}`

export function useAsk(endpoint = '/api/ask') {
  const [messages, setMessages] = useState<AskMessage[]>([])
  const [busy, setBusy] = useState(false)
  const controller = useRef<AbortController | null>(null)

  const update = (id: string, patch: Partial<AskMessage> | ((message: AskMessage) => Partial<AskMessage>)) =>
    setMessages((current) => current.map((message) => (message.id === id ? { ...message, ...(typeof patch === 'function' ? patch(message) : patch) } : message)))

  const ask = useCallback(async (question: string) => {
    const text = question.trim()
    if (!text || busy) return
    const history = messages.filter((message) => !message.error && !message.pending).slice(-6).map((message) => ({ role: message.role, text: message.text }))
    const user: AskMessage = { id: nextId(), role: 'user', text }
    const reply: AskMessage = { id: nextId(), role: 'model', text: '', pending: true }
    setMessages((current) => [...current, user, reply])
    setBusy(true)
    controller.current = new AbortController()
    try {
      const response = await fetch(endpoint, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ question: text, history }), signal: controller.current.signal })
      if (!response.ok || !response.body) {
        const body = await response.json().catch(() => ({})) as { error?: string }
        update(reply.id, { pending: false, error: body.error ?? 'Ask the Atlas is unavailable right now.' })
        return
      }
      for await (const { event, data } of readEvents(response.body)) {
        if (event === 'meta') update(reply.id, { records: data.records as AskRecord[], model: data.model as string, provider: data.provider as string })
        if (event === 'delta') update(reply.id, (message) => ({ text: message.text + (data.text as string) }))
        if (event === 'done') update(reply.id, { pending: false, cited: data.cited as string[], dropped: data.dropped as string[], uncited: data.uncited as boolean, conclusiveLanguage: data.conclusiveLanguage as boolean })
        if (event === 'error') update(reply.id, { pending: false, error: data.error as string })
      }
      update(reply.id, { pending: false })
    } catch (error) {
      update(reply.id, { pending: false, error: (error as Error).name === 'AbortError' ? 'Stopped.' : 'Could not reach Ask the Atlas.' })
    } finally {
      setBusy(false)
      controller.current = null
    }
  }, [busy, endpoint, messages])

  const stop = () => controller.current?.abort()
  const reset = () => { stop(); setMessages([]) }
  return { messages, busy, ask, stop, reset }
}
