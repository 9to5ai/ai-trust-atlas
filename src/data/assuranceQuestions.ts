/*
 * Internal audit & assurance audience (2026-09 ontology review).
 * Original Atlas discussion prompts for internal auditors and assurance practitioners,
 * keyed by the ID of the item they belong to. They are not audit procedures,
 * findings or opinions.
 */
export type AssurancePrompt = { text: string; askFor: string; followUp: string }

export const assuranceConceptQuestions: Record<string, string> = {}
export const assuranceRiskQuestions: Record<string, string> = {}
export const assuranceControlQuestions: Record<string, string> = {}
export const assuranceSourceQuestions: Record<string, string> = {}
export const assuranceDevelopmentQuestions: Record<string, string> = {}
export const assuranceUseCasePrompts: Record<string, AssurancePrompt> = {}
export const assuranceIncidentPrompts: Record<string, AssurancePrompt> = {}
