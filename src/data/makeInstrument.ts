import type { SourceRecord } from '../types.js'

export type InstrumentInput = Omit<SourceRecord, 'lastVerified'> & { lastVerified?: string }

export const makeInstrument = (input: InstrumentInput): SourceRecord => ({
  ...input,
  lastVerified: input.lastVerified ?? '2026-08-28',
})
