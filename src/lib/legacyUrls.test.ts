import { describe, expect, it } from 'vitest'
import { legacyRedirect } from './legacyUrls'

const at = (path: string) => legacyRedirect(new URL(path, 'https://atlas.example'))

describe('legacy shared links', () => {
  it('opens the Universe from the site root and leaves other routes alone', () => {
    expect(at('/')).toBe('/universe')
    expect(at('/?utm_source=newsletter')).toBe('/universe?utm_source=newsletter')
    expect(at('/universe?view=list')).toBeNull()
    expect(at('/methodology')).toBe('/universe')
  })

  it('opens the Universe from retired pages, landing on the source a link pointed to', () => {
    expect(at('/library')).toBe('/universe')
    expect(at('/library/compare?ids=apra-cps-230,eu-dora')).toBe('/universe')
    expect(at('/ask')).toBe('/universe')
    expect(at('/library/apra-cps-230')).toBe('/universe#/instrument/apra-cps-230')
  })

  it('sends selections, filters and display modes to the Universe', () => {
    expect(at('/#/instrument/apra-cps-230')).toBe('/universe#/instrument/apra-cps-230')
    expect(at('/?mode=risk&year=2026#/risk-subdomain/mit-1-1')).toBe('/universe?mode=risk&year=2026#/risk-subdomain/mit-1-1')
    expect(at('/?view=list&type=standard&region=Australia&year=2026')).toBe('/universe?view=list&type=standard&region=Australia&year=2026')
    expect(at('/?view=focus&anchor=concept:privacy#/concept/privacy')).toBe('/universe?view=focus&anchor=concept%3Aprivacy#/concept/privacy')
  })

  it('gives the question workspace and use cases their own pages', () => {
    expect(at('/?view=questions&year=2026')).toBe('/questions?year=2026')
    expect(at('/?view=use-cases')).toBe('/cases')
    expect(at('/?view=use-cases&year=2026#/use-case/cba-fraud-agent')).toBe('/cases?year=2026#/use-case/cba-fraud-agent')
  })
})
