import { instruments } from '../data/instruments'

const provisionOwner = new Map(instruments.flatMap((instrument) => instrument.provisions.map((provision) => [provision.id, instrument.id] as const)))

/* Where a cited record opens in the Atlas. */
export function recordLink(id: string) {
  const [kind, ...rest] = id.split(':')
  const key = rest.join(':')
  if (kind === 'instrument') return `/library/${key}`
  if (kind === 'provision') { const owner = provisionOwner.get(key); return owner ? `/library/${owner}#section-${key}` : `/universe#/provision/${key}` }
  if (kind === 'control-objective') return `/crosswalk/${key}`
  return `/universe#/${kind}/${key}`
}
