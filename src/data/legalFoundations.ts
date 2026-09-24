import type { SourceRecord, InstrumentRelation } from '../types.js'

const reviewed = '2026-09-07'
const apraActUrl = 'https://www.legislation.gov.au/C2004A00310/latest/text'

const industryActs = [
  {
    "id": "au-banking-act",
    "title": "Banking Act 1959",
    "shortTitle": "Banking Act",
    "registerId": "C1959A00006",
    "published": "1959",
    "section": "11AF(1)",
    "sector": "Banking"
  },
  {
    "id": "au-insurance-act",
    "title": "Insurance Act 1973",
    "shortTitle": "Insurance Act",
    "registerId": "C1973A00076",
    "published": "1973",
    "section": "32(1)",
    "sector": "General insurance"
  },
  {
    "id": "au-life-insurance-act",
    "title": "Life Insurance Act 1995",
    "shortTitle": "Life Insurance Act",
    "registerId": "C2004A04860",
    "published": "1995",
    "section": "230A(1)",
    "sector": "Life insurance"
  },
  {
    "id": "au-phips-act",
    "title": "Private Health Insurance (Prudential Supervision) Act 2015",
    "shortTitle": "PHIPS Act",
    "registerId": "C2015A00085",
    "published": "2015",
    "section": "92(1)",
    "sector": "Private health insurance"
  },
  {
    "id": "au-sis-act",
    "title": "Superannuation Industry (Supervision) Act 1993",
    "shortTitle": "SIS Act",
    "registerId": "C2004A04633",
    "published": "1993",
    "section": "34C(1)",
    "sector": "Superannuation"
  }
]

export const legalFoundationInstruments: SourceRecord[] = [
  {
    id: 'au-apra-act', title: 'Australian Prudential Regulation Authority Act 1998', shortTitle: 'APRA Act',
    issuer: 'Australian Parliament', jurisdiction: 'Australia', region: 'Australia', authorityClass: 'law',
    authorityNote: 'Governing legislation establishing APRA and its mandate', status: 'in-force', published: '1998', lastVerified: reviewed,
    officialUrl: apraActUrl, summary: 'Establishes APRA and its institutional mandate for prudential regulation under the relevant Commonwealth laws.',
    applicability: 'Institutional foundation for APRA. The specific powers to make CPS 220, CPS 230 and CPS 234 sit in the applicable industry Acts.',
    sectors: ['Financial services'], conceptIds: ['accountability'], detailAvailability: 'public-summary',
    provisions: [{ id: 'apra-act-establishment', ref: 'Sections 7–9', title: 'Establishment and mandate', summary: 'Establishes APRA and sets out its purpose and functions.', conceptIds: ['accountability'], sourceUrl: apraActUrl, reviewedAt: reviewed, note: 'Selected institutional provisions and official APRA explanation reviewed; not a whole-Act analysis.' }],
  },
  ...industryActs.map((act): SourceRecord => ({
    id: act.id, title: act.title, shortTitle: act.shortTitle, issuer: 'Australian Parliament', jurisdiction: 'Australia', region: 'Australia', authorityClass: 'law',
    authorityNote: 'Enabling legislation for prudential standards within its scope', status: 'in-force', published: act.published, lastVerified: reviewed,
    officialUrl: `https://www.legislation.gov.au/Series/${act.registerId}`,
    summary: `Provides the legislative basis for APRA prudential standard-making in ${act.sector.toLowerCase()}.`,
    applicability: 'Selected standard-making power only. Coverage depends on the Act and the particular standard; this record does not summarise all obligations in the Act.',
    sectors: [act.sector], conceptIds: ['accountability'], detailAvailability: 'public-summary',
    provisions: [{ id: `${act.id}-standards-power`, ref: `Section ${act.section}`, title: 'Power to make prudential standards', summary: `The CPS 230 determination cites this provision as its standard-making authority for ${act.sector.toLowerCase()}.`, conceptIds: ['accountability'], sourceUrl: 'https://www.apra.gov.au/standards/cps-230', reviewedAt: reviewed, note: 'Section identified from the official determination; Act identity and status checked on the Federal Register. Not a full statutory interpretation.' }],
  })),
]

const standards = [
  { id: 'apra-cps-220', title: 'CPS 220', url: 'https://www.apra.gov.au/standards/cps-220', version: 'Determination dated 3 May 2019', acts: industryActs.slice(0, 4) },
  { id: 'apra-cps-230', title: 'CPS 230', url: 'https://www.apra.gov.au/standards/cps-230', version: 'Determination dated 23 April 2026; effective 1 July 2026', acts: industryActs },
  { id: 'apra-cps-234', title: 'CPS 234', url: 'https://www.apra.gov.au/standards/cps-234', version: 'Determination dated 30 November 2018; effective 1 July 2019', acts: industryActs },
]

export const legalFoundationRelations: InstrumentRelation[] = standards.flatMap((standard) => [
  ...standard.acts.map((act): InstrumentRelation => ({
    id: `${standard.id}-made-under-${act.id}`, sourceId: standard.id, targetId: act.id, type: 'made-under',
    explanation: `${standard.title} is made under section ${act.section} of the ${act.title} for ${act.sector.toLowerCase()}.`,
    basis: 'explicit', confidence: 'high', sourceAnchors: ['Determination / Authority', `Section ${act.section}`],
    citations: [{ sourceTitle: standard.title, locator: `Determination: section ${act.section} of the ${act.title}`, url: standard.url, accessedAt: reviewed, sourceVersion: standard.version }],
  })),
  {
    id: `${standard.id}-apra-governing-legislation`, sourceId: standard.id, targetId: 'au-apra-act', type: 'issuer-governed-by',
    explanation: `The APRA Act establishes the regulator issuing ${standard.title}. The standard-making powers are identified separately under the industry Acts.`,
    basis: 'explicit', confidence: 'high', sourceAnchors: ['Issuer: APRA', 'APRA Act sections 7–9'],
    citations: [
      { sourceTitle: standard.title, locator: 'Determination: APRA delegate', url: standard.url, accessedAt: reviewed, sourceVersion: standard.version },
      { sourceTitle: 'APRA governing legislation', locator: 'APRA mandate and industry Acts', url: 'https://www.apra.gov.au/news-and-publications/apras-objectives', accessedAt: reviewed },
    ],
  },
])
