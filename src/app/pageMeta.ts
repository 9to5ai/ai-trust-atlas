/* Page titles and descriptions, shared by the running app and the build-time head prerender. */
export type PageMeta = { title: string; description: string }
const brand = 'AI Trust Atlas'
export const defaultMeta: PageMeta = { title: brand, description: 'A source-linked map of AI laws, standards, risks and controls. Explore the landscape, trace obligations to controls and prepare evidence-based board and executive conversations.' }

export const shareablePages: Record<string, PageMeta> = {
  '/universe': { title: `The Universe · ${brand}`, description: 'An interactive 3D map of AI laws, standards, risks and controls, with every connection traceable to its source.' },
  '/questions': { title: `Questions for boards and executives · ${brand}`, description: 'Role-specific questions about AI for boards, executives and regulators, ready to build into a meeting brief.' },
  '/cases': { title: `AI in production · ${brand}`, description: 'Company-reported production AI deployments with the questions they raise.' },
}
export const metaFor = (pathname: string): PageMeta => shareablePages[pathname] ?? defaultMeta
