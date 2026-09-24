import { instruments } from '../data/instruments'

/* Page titles and descriptions, shared by the running app and the build-time head prerender. */
export type PageMeta = { title: string; description: string }
const brand = 'AI Trust Atlas'
export const defaultMeta: PageMeta = { title: brand, description: 'A source-linked map of AI laws, standards, risks and controls. Explore the landscape, trace obligations to controls and prepare evidence-based board and executive conversations.' }

const staticPages: Record<string, PageMeta> = {
  '/universe': { title: `The Universe · ${brand}`, description: 'An interactive 3D map of AI laws, standards, risks and controls, with every connection traceable to its source.' },
  '/library': { title: `Library · ${brand}`, description: `${instruments.length} AI laws, standards, assurance standards, guidance and research sources, with their authority, status and mapped sections.` },
  '/library/compare': { title: `Compare sources · ${brand}`, description: 'Compare up to three AI laws, standards or guidance documents concept by concept, down to the section.' },
  '/questions': { title: `Questions for boards and executives · ${brand}`, description: 'Role-specific questions about AI for boards, executives and regulators, ready to build into a meeting brief.' },
  '/cases': { title: `AI in production · ${brand}`, description: 'Company-reported production AI deployments with the questions they raise.' },
  '/ask': { title: `Ask the Atlas · ${brand}`, description: 'Answers drawn only from the Atlas’s reviewed records, with every claim cited.' },
  '/methodology': { title: `Methodology · ${brand}`, description: 'How the Atlas selects, verifies and connects sources, and the boundaries it keeps.' },
}

const dynamicPages: Record<string, PageMeta> = Object.fromEntries([
  ...instruments.map((instrument) => [`/library/${instrument.id}`, { title: `${instrument.shortTitle} · ${brand}`, description: instrument.summary }]),
])

export const shareablePages: Record<string, PageMeta> = { ...staticPages, ...dynamicPages }
export const metaFor = (pathname: string): PageMeta => shareablePages[pathname] ?? defaultMeta
