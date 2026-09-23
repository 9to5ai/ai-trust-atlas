import { controlFamilies, controlObjectives } from '../data/controls'
import { crosswalkAssertions, crosswalkFrameworkFor, crosswalkFrameworks, type CrosswalkFramework } from '../data/crosswalk'
import { instrumentById } from '../data/instruments'
import type { ControlObjective, Instrument, MappingAssertion, SourceProvision } from '../types'

export type CrosswalkLink = { assertion: MappingAssertion; provision: SourceProvision; instrument: Instrument }
export type CrosswalkCell = { framework: CrosswalkFramework; links: CrosswalkLink[] }
export type CrosswalkRow = { control: ControlObjective; cells: CrosswalkCell[]; mappedFrameworks: number }

const provisionById = new Map([...instrumentById.values()].flatMap((instrument) => instrument.provisions.map((provision) => [provision.id, { provision, instrument }] as const)))

const linkFor = (assertion: MappingAssertion): CrosswalkLink | undefined => {
  const entry = provisionById.get(assertion.targetNodeId.replace(/^provision:/, ''))
  return entry ? { assertion, ...entry } : undefined
}

/* Rows are control objectives in family order; a cell with no links means no recorded mapping. */
export function crosswalkMatrix(frameworkIds: string[] = crosswalkFrameworks.map((framework) => framework.id), familyId?: string): CrosswalkRow[] {
  const frameworks = crosswalkFrameworks.filter((framework) => frameworkIds.includes(framework.id))
  const familyOrder = new Map(controlFamilies.map((family, index) => [family.id, index]))
  return controlObjectives
    .filter((control) => !familyId || control.familyId === familyId)
    .sort((a, b) => (familyOrder.get(a.familyId) ?? 0) - (familyOrder.get(b.familyId) ?? 0) || a.code.localeCompare(b.code))
    .map((control) => {
      const links = crosswalkAssertions.filter((assertion) => assertion.sourceNodeId === `control-objective:${control.id}`).map(linkFor).filter((link): link is CrosswalkLink => !!link)
      const cells = frameworks.map((framework) => ({ framework, links: links.filter((link) => crosswalkFrameworkFor(link.instrument.id) === framework.id) }))
      return { control, cells, mappedFrameworks: cells.filter((cell) => cell.links.length > 0).length }
    })
}

/* Share of control objectives with at least one recorded mapping, per framework. */
export function crosswalkCoverage(rows = crosswalkMatrix()) {
  return crosswalkFrameworks.map((framework) => {
    const mapped = rows.filter((row) => row.cells.some((cell) => cell.framework.id === framework.id && cell.links.length > 0)).length
    return { framework, mapped, total: rows.length }
  })
}

/* Provisions of one source that the crosswalk links to control objectives. */
export function crosswalkForInstrument(instrumentId: string) {
  return crosswalkAssertions.map(linkFor).filter((link): link is CrosswalkLink => !!link && link.instrument.id === instrumentId)
}

export { crosswalkFrameworks }
