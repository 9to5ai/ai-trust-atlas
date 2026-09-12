import { ArrowUpRight, MagnifyingGlass, X } from '@phosphor-icons/react'
import { useEffect, useRef, useState } from 'react'
import { searchObjects } from '../lib/workspace'
const searchAtlas = (query: string) => searchObjects(query).map(x => ({...x,detail:x.summary}))

export function SearchDialog({onClose,onSelect}:{onClose:()=>void;onSelect:(id:string)=>void}) {
  const [query,setQuery]=useState('')
  const [active,setActive]=useState(0)
  const ref=useRef<HTMLDialogElement>(null)
  const results=searchAtlas(query).slice(0,30)
  useEffect(()=>{const previous=document.activeElement as HTMLElement;ref.current?.showModal();return()=>previous?.focus()},[])
  useEffect(()=>{document.getElementById(`search-result-${active}`)?.scrollIntoView({block:'nearest'})},[active])
  return <dialog ref={ref} className="atlas-search-dialog" onCancel={onClose} onClick={e=>{if(e.target===e.currentTarget)onClose()}} aria-label="Search everything in the Atlas"><div className="command-input"><MagnifyingGlass/><input autoFocus placeholder="Try “Who is accountable?” or “CPS234”…" aria-label="Search all Atlas objects" value={query} onChange={e=>{setQuery(e.target.value);setActive(0)}} onKeyDown={e=>{if(e.key==='ArrowDown'){e.preventDefault();setActive(x=>Math.min(x+1,results.length-1))}if(e.key==='ArrowUp'){e.preventDefault();setActive(x=>Math.max(0,x-1))}if(e.key==='Enter'&&results[active])onSelect(results[active].id)}}/><button onClick={onClose} aria-label="Close search"><X/></button></div><div className="command-caption" role="status">{query?`${searchAtlas(query).length} matches across the corpus`:'Explore a concept, or type to search the entire corpus'}</div><div className="command-results">{results.map((x,i)=><button id={`search-result-${i}`} className={active===i?'active':''} key={x.id} onClick={()=>onSelect(x.id)}><span><small>{x.kind}</small><strong>{x.name}</strong><p>{x.detail}</p></span><ArrowUpRight/></button>)}{!results.length&&<p className="command-empty">No matches. Try “oversight”, “APRA” or “privacy”.</p>}</div><footer><span>↑ ↓ to navigate · Enter to explore</span><span>Esc to close</span></footer></dialog>
}
