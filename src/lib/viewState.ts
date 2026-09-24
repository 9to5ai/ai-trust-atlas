import { legalEffectOrder, sectorLabels } from '../data/sourceMetadata'
import type { LegalEffect, SectorId } from '../types'
import { conceptAliases } from '../data/concepts'
import { authorityOrder, regionOrder } from './labels'
import { objectById } from './workspace'
import type { AuthorityClass, Instrument } from '../types'
import type { LayoutMode } from './graphModel'
export type AtlasView = { useCases?: boolean; incidents?: boolean; selected?: string; layout: LayoutMode; projection: 'atlas' | 'list' | 'focus' | 'questions' | 'use-cases'; query: string; authorities: AuthorityClass[]; regions: Instrument['region'][]; effects?: LegalEffect[]; sectors?: SectorId[]; year: number; anchor?: string }
export const projectionRoutes = { questions: '/questions', 'use-cases': '/cases' } as const
export const pathForView = (view: Pick<AtlasView, 'projection'>) => view.projection === 'questions' || view.projection === 'use-cases' ? projectionRoutes[view.projection] : '/universe'
export function readView(url: URL, maxYear: number): AtlasView {
  const p=url.searchParams
  const routed=url.pathname===projectionRoutes.questions?'questions':url.pathname===projectionRoutes['use-cases']?'use-cases':undefined
  const hashId=url.hash.replace(/^#\//,'').replace(/^clause\//,'provision/').replace('/',':')
  // Concepts retired in the 2026-09 ontology review open the concept that absorbed them.
  const retired=hashId.match(/^concept:(.+)$/)?.[1]
  const raw=retired&&conceptAliases[retired]?`concept:${conceptAliases[retired]}`:hashId
  const selected=objectById.has(raw)?raw:undefined
  const mode=p.get('mode')
  const layout:LayoutMode=mode==='risk'||mode==='controls'||mode==='authority'?mode:selected?.startsWith('risk-')?'risk':selected?.startsWith('control-')?'controls':'ontology'
  const year=Number(p.get('year'))
  return {...(p.get('useCases')==='1'?{useCases:true}:{}),...(p.get('incidents')==='1'||selected?.startsWith('incident:')?{incidents:true}:{}),selected,layout,projection:routed??(p.get('view')==='use-cases'?'use-cases':p.get('view')==='questions'?'questions':p.get('view')==='list'?'list':p.get('view')==='focus'&&selected?'focus':'atlas'),query:(p.get('q')??'').slice(0,300),authorities:authorityOrder.filter(x=>p.getAll('type').includes(x)),regions:regionOrder.filter(x=>p.getAll('region').includes(x)),...facetsFrom(p),year:year>=1900&&year<=maxYear?year:maxYear,anchor:objectById.has(p.get('anchor')??'')?p.get('anchor')!:selected}
}
function facetsFrom(p:URLSearchParams):Pick<AtlasView,'effects'|'sectors'> {
  const effects=legalEffectOrder.filter(x=>p.getAll('effect').includes(x))
  const sectors=(Object.keys(sectorLabels) as SectorId[]).filter(x=>p.getAll('sector').includes(x))
  return {...(effects.length?{effects}:{}),...(sectors.length?{sectors}:{})}
}
export function viewUrl(view:AtlasView) {
  const p=new URLSearchParams()
  if(view.useCases)p.set('useCases','1')
  if(view.incidents)p.set('incidents','1')
  if(view.layout!=='ontology')p.set('mode',view.layout)
  if(view.projection!=='atlas'&&view.projection!=='questions'&&view.projection!=='use-cases')p.set('view',view.projection)
  if(view.query)p.set('q',view.query)
  view.authorities.forEach(x=>p.append('type',x));view.regions.forEach(x=>p.append('region',x));view.effects?.forEach(x=>p.append('effect',x));view.sectors?.forEach(x=>p.append('sector',x))
  p.set('year',String(view.year))
  if(view.projection==='focus'&&view.anchor)p.set('anchor',view.anchor)
  return `${p.size?'?'+p.toString():''}${view.selected?'#/'+view.selected.replace(':','/'):''}`
}
