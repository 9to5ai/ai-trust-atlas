import { authorityOrder, regionOrder } from './labels'
import { objectById } from './workspace'
import type { AuthorityClass, Instrument } from '../types'
import type { LayoutMode } from './graphModel'
export type AtlasView = { useCases?: boolean; incidents?: boolean; selected?: string; layout: LayoutMode; projection: 'atlas' | 'list' | 'focus' | 'questions' | 'use-cases'; query: string; authorities: AuthorityClass[]; regions: Instrument['region'][]; year: number; anchor?: string }
export function readView(url: URL, maxYear: number): AtlasView {
  const p=url.searchParams
  const raw=url.hash.replace(/^#\//,'').replace(/^clause\//,'provision/').replace('/',':')
  const selected=objectById.has(raw)?raw:undefined
  const mode=p.get('mode')
  const layout:LayoutMode=mode==='risk'||mode==='controls'||mode==='authority'?mode:selected?.startsWith('risk-')?'risk':selected?.startsWith('control-')?'controls':'ontology'
  const year=Number(p.get('year'))
  return {...(p.get('useCases')==='1'?{useCases:true}:{}),...(p.get('incidents')==='1'||selected?.startsWith('incident:')?{incidents:true}:{}),selected,layout,projection:p.get('view')==='use-cases'?'use-cases':p.get('view')==='questions'?'questions':p.get('view')==='list'?'list':p.get('view')==='focus'&&selected?'focus':'atlas',query:(p.get('q')??'').slice(0,300),authorities:authorityOrder.filter(x=>p.getAll('type').includes(x)),regions:regionOrder.filter(x=>p.getAll('region').includes(x)),year:year>=1900&&year<=maxYear?year:maxYear,anchor:objectById.has(p.get('anchor')??'')?p.get('anchor')!:selected}
}
export function viewUrl(view:AtlasView) {
  const p=new URLSearchParams()
  if(view.useCases)p.set('useCases','1')
  if(view.incidents)p.set('incidents','1')
  if(view.layout!=='ontology')p.set('mode',view.layout)
  if(view.projection!=='atlas')p.set('view',view.projection)
  if(view.query)p.set('q',view.query)
  view.authorities.forEach(x=>p.append('type',x));view.regions.forEach(x=>p.append('region',x))
  p.set('year',String(view.year))
  if(view.projection==='focus'&&view.anchor)p.set('anchor',view.anchor)
  return `${p.size?'?'+p.toString():''}${view.selected?'#/'+view.selected.replace(':','/'):''}`
}
