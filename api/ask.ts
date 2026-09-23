import { CitationFilter, conclusiveLanguage } from './_lib/citations'
import { retrieve } from './_lib/corpus'
import { budgetRemaining, checkRateLimit, hashIp, recordUsage, validateInput } from './_lib/guard'
import { selectProvider, type LlmProvider } from './_lib/llm'

/*
 * POST /api/ask — answers a question from Atlas records only, streaming
 * Server-Sent Events: meta (records supplied), delta (answer text), done
 * (citations kept and dropped, model, usage) or error.
 */
type Env = Record<string, string | undefined>
const json = (status: number, body: unknown) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } })
const sse = (event: string, data: unknown) => `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`

export async function handleAsk(request: Request, env: Env = process.env, provider: LlmProvider = selectProvider(env)): Promise<Response> {
  if (env.ASK_ENABLED === 'false') return json(503, { error: 'Ask the Atlas is switched off. Search and the Library remain available.' })
  let body: unknown
  try { body = await request.json() } catch { return json(400, { error: 'Send a JSON body with a question.' }) }
  const input = validateInput(body)
  if ('error' in input) return json(400, input)

  const client = hashIp(request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'local')
  const limit = await checkRateLimit(env, client)
  if (!limit.ok) return json(429, { error: limit.reason })
  if ((await budgetRemaining(env)) <= 0) return json(503, { error: 'Ask the Atlas is resting for today. Search and the Library remain available.' })

  const records = retrieve(`${input.history.filter((turn) => turn.role === 'user').slice(-1).map((turn) => turn.text).join(' ')} ${input.question}`)
  const allowed = new Set(records.map((record) => record.id))
  const filter = new CitationFilter(allowed)
  const encoder = new TextEncoder()
  const started = Date.now()

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: string, data: unknown) => controller.enqueue(encoder.encode(sse(event, data)))
      send('meta', { provider: provider.name, model: provider.model, records: records.map((record) => ({ id: record.id, title: record.title, kind: record.kind, draft: !!record.draft })) })
      let answer = ''
      let usage = { inputTokens: 0, outputTokens: 0 }
      try {
        if (!records.length) {
          const text = 'The Atlas records do not cover this question. Try rephrasing, or explore the Library and Universe.'
          answer = text
          send('delta', { text })
        } else {
          for await (const part of provider.stream(input.question, records, input.history)) {
            if (part.usage) usage = part.usage
            if (part.text) { const safe = filter.push(part.text); if (safe) { answer += safe; send('delta', { text: safe }) } }
          }
          const rest = filter.flush()
          if (rest) { answer += rest; send('delta', { text: rest }) }
        }
        send('done', { cited: [...filter.cited], dropped: [...filter.dropped], uncited: records.length > 0 && filter.cited.size === 0, conclusiveLanguage: conclusiveLanguage.test(answer), provider: provider.name, model: provider.model, usage })
        await recordUsage(env, usage.inputTokens + usage.outputTokens)
        console.log(JSON.stringify({ at: 'ask', client, records: records.length, cited: filter.cited.size, dropped: filter.dropped.size, ms: Date.now() - started, ...usage }))
      } catch (error) {
        console.error(JSON.stringify({ at: 'ask', client, error: error instanceof Error ? error.message.slice(0, 200) : 'unknown' }))
        send('error', { error: 'The model could not answer just now. Please try again shortly.' })
      } finally {
        controller.close()
      }
    },
  })
  return new Response(stream, { headers: { 'content-type': 'text/event-stream; charset=utf-8', 'cache-control': 'no-store', 'x-accel-buffering': 'no' } })
}

export function POST(request: Request) {
  return handleAsk(request)
}

export function GET() {
  return json(405, { error: 'Use POST with a JSON body: { "question": "…" }' })
}
