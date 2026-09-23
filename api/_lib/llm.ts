import { GoogleGenAI } from '@google/genai'
import type { Chunk } from './corpus'
import type { Turn } from './prompt'
import { buildContents, systemPrompt } from './prompt'

/*
 * Provider abstraction. Gemini (AI Studio key) is the default; Vertex AI can be
 * selected for Australian data residency (australia-southeast1); 'mock' gives
 * a deterministic, keyless answer for demos, development and tests.
 */
export type Usage = { inputTokens: number; outputTokens: number }
export type StreamPart = { text?: string; usage?: Usage }
export type LlmProvider = { name: string; model: string; stream(question: string, records: Chunk[], history: Turn[]): AsyncIterable<StreamPart> }

type Env = Record<string, string | undefined>

export const defaultModel = 'gemini-3.8-flash'

function geminiProvider(client: GoogleGenAI, name: string, model: string): LlmProvider {
  return {
    name,
    model,
    async *stream(question, records, history) {
      const response = await client.models.generateContentStream({
        model,
        contents: buildContents(question, records, history),
        config: { systemInstruction: systemPrompt, temperature: 0.2, maxOutputTokens: 1200 },
      })
      let usage: Usage | undefined
      for await (const chunk of response) {
        if (chunk.usageMetadata) usage = { inputTokens: chunk.usageMetadata.promptTokenCount ?? 0, outputTokens: chunk.usageMetadata.candidatesTokenCount ?? 0 }
        const text = chunk.text
        if (text) yield { text }
      }
      if (usage) yield { usage }
    },
  }
}

export const mockProvider: LlmProvider = {
  name: 'demo',
  model: 'atlas-demo',
  async *stream(_question, records) {
    const top = records.slice(0, 4)
    if (!top.length) { yield { text: 'The Atlas records do not cover this question yet. Try the Library or the Universe search.' }; return }
    const lines = ['Demo mode (no language model configured). These are the most relevant Atlas records:', '', ...top.map((record) => `- **${record.title}** — ${record.text.split('. ')[0].replace(/\.$/, '')}. [[${record.id}]]`), '', 'Configure GEMINI_API_KEY to get a written answer grounded in these records.']
    for (const line of lines) { yield { text: `${line}\n` }; await new Promise((resolve) => setTimeout(resolve, 12)) }
    yield { usage: { inputTokens: 0, outputTokens: 0 } }
  },
}

export function selectProvider(env: Env = process.env): LlmProvider {
  const model = env.GEMINI_MODEL || defaultModel
  const choice = env.ASK_PROVIDER || (env.GOOGLE_GENAI_USE_VERTEXAI === 'true' ? 'vertex' : env.GEMINI_API_KEY ? 'gemini' : 'mock')
  if (choice === 'vertex') return geminiProvider(new GoogleGenAI({ vertexai: true, project: env.GOOGLE_CLOUD_PROJECT, location: env.GOOGLE_CLOUD_LOCATION || 'australia-southeast1' }), 'vertex', model)
  if (choice === 'gemini' && env.GEMINI_API_KEY) return geminiProvider(new GoogleGenAI({ apiKey: env.GEMINI_API_KEY }), 'gemini', model)
  return mockProvider
}
