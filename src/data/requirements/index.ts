import type { Requirement } from '../../types.js'
import { australiaRequirements } from './australia'
import { financialRequirements } from './financial'
import { internationalRequirements } from './international'

/* What source sections require, of whom and by when. See Requirement in src/types.ts. */
export const requirements: Requirement[] = [...australiaRequirements, ...internationalRequirements, ...financialRequirements]

export const requirementsForSource = (instrumentId: string, provisionId?: string) =>
  requirements.filter((item) => item.instrumentId === instrumentId && (!provisionId || item.provisionId === provisionId))
export const requirementsForControl = (controlId: string) => requirements.filter((item) => item.controlIds.includes(controlId))
export const requirementsForConcept = (conceptId: string) => requirements.filter((item) => item.conceptIds.includes(conceptId))
