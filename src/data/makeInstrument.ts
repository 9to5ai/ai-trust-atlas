import type { Instrument } from '../types'

export type InstrumentInput = Omit<Instrument, 'lastVerified'> & { lastVerified?: string }

export const makeInstrument = (input: InstrumentInput): Instrument => ({
  ...input,
  lastVerified: input.lastVerified ?? '2026-08-28',
})
