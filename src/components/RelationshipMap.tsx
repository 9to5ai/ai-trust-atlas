import { ArrowsOut, Minus, Plus, PushPin, Target, X } from '@phosphor-icons/react'
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react'
import { assertionById, basisMatches, connections, objectById, otherEnd, type BasisFilter, type RecordedPath } from '../lib/workspace'

type Point={x:number;y:number}
type Props={selected:string;edge?:string;basis:BasisFilter;onSelect:(id:string)=>void;onEdge:(id:string)=>void;path?:RecordedPath;resetKey:number}
const W=220,H=116
export function RelationshipMap({selected,edge,basis,onSelect,onEdge,path,resetKey}:Props){
 const [positions,setPositions]=useState<Record<string,Point>>({})
 const [expanded,setExpanded]=useState<string[]>([])
 const [pinned,setPinned]=useState<string[]>([])
 const [camera,setCamera]=useState({x:0,y:0,scale:.78})
 const [size,setSize]=useState({width:800,height:600})
 const [notice,setNotice]=useState('')
 const viewport=useRef<HTMLDivElement>(null)
 const drag=useRef<{id?:string;x:number;y:number;origin:Point;moved:boolean} | undefined>(undefined)
 const sizeRef=useRef(size);sizeRef.current=size
 const fit=(points:Record<string,Point>)=>{const values=Object.values(points);if(!values.length)return;const minX=Math.min(...values.map(p=>p.x))-45,minY=Math.min(...values.map(p=>p.y))-60;const width=Math.max(...values.map(p=>p.x))+W-minX+45,height=Math.max(...values.map(p=>p.y))+H-minY+60;const box=sizeRef.current;const scale=Math.max(.22,Math.min(1.05,(box.width-30)/width,(box.height-70)/height));setCamera({x:(box.width-width*scale)/2-minX*scale,y:45+(box.height-70-height*scale)/2-minY*scale,scale})}
 const seed=(id:string)=>{const related=connections(id,basis);const byKind=new Map<string,string[]>();for(const a of related){const other=otherEnd(a,id);const kind=objectById.get(other)?.kind??'';if(kind.includes('Theme')||kind==='Theme')continue;byKind.set(kind,[...new Set([...(byKind.get(kind)??[]),other])])}
  const ids:string[]=[];let row=0;while(ids.length<6&&row<12){for(const list of byKind.values()){if(list[row])ids.push(list[row]);if(ids.length>=6)break}row++}
  const points:Record<string,Point>={[id]:{x:365,y:155}};ids.forEach((other,i)=>{points[other]={x:i%2===0?30:700,y:20+Math.floor(i/2)*155}});setPositions(points);setExpanded([id]);setPinned([]);setNotice(`${ids.length} of ${new Set(related.map(a=>otherEnd(a,id))).size} neighbours shown. Expand to reveal more.`);fit(points)
 }
 useEffect(()=>{const el=viewport.current;if(!el)return;const observer=new ResizeObserver(entries=>{const r=entries[0].contentRect;if(!r.width||!r.height)return;setSize({width:r.width,height:r.height})});observer.observe(el);return()=>observer.disconnect()},[])
 useEffect(()=>{seed(selected)},[resetKey])
 useEffect(()=>{setNotice('Basis filter applied. Cards retain their positions; only matching relationships are shown.')},[basis])
 useEffect(()=>{if(Object.keys(positions).length)fit(positions)},[size.width,size.height])
 useEffect(()=>{if(!path)return;const points:Record<string,Point>={};path.nodeIds.forEach((id,i)=>{points[id]={x:60+i*325,y:130+(i%2)*150}});setPositions(points);setExpanded([]);setNotice('Recorded path. Arrowheads preserve assertion direction, including reverse traversal.');fit(points)},[path])
 const expand=(id:string)=>{const candidates=[...new Set(connections(id,basis).map(a=>otherEnd(a,id)))].filter(x=>!positions[x]);const add=candidates.slice(0,8);if(!add.length){setNotice('All neighbours allowed by this basis filter are already visible.');return}
  const next={...positions};const origin=next[id]??{x:500,y:200};if(!next[id])next[id]=origin
  for(const [i,other] of add.entries()){let p={x:origin.x+(i%2===0?-380:380),y:origin.y+160+Math.floor(i/2)*125};let tries=0;while(Object.values(next).some(q=>Math.abs(q.x-p.x)<W+30&&Math.abs(q.y-p.y)<H+25)&&tries++<100)p={...p,y:p.y+125};next[other]=p}
  setPositions(next);setExpanded(x=>[...new Set([...x,id])]);setNotice(`Added ${add.length} neighbours; ${candidates.length-add.length} more available. Existing positions preserved.`)
 }
 const collapse=(id:string)=>{const remaining=expanded.filter(x=>x!==id);const keep=new Set([selected,...remaining,...pinned,...(path?.nodeIds??[])]);remaining.forEach(root=>connections(root,basis).forEach(a=>keep.add(otherEnd(a,root))));setPositions(current=>Object.fromEntries(Object.entries(current).filter(([key])=>keep.has(key))));setExpanded(remaining);setNotice('Branch collapsed. Selected and pinned objects retained.')}
 const candidates=Object.keys(positions).flatMap(id=>connections(id,basis)).filter(a=>positions[a.sourceNodeId]&&positions[a.targetNodeId]); const preferred=[...(path?.edgeIds??[]), ...(edge?[edge]:[])].map(id=>assertionById.get(id)).filter((a):a is NonNullable<typeof a> => Boolean(a&&positions[a.sourceNodeId]&&positions[a.targetNodeId]&&basisMatches(a,basis))); const visibleEdges=[...new Map([...candidates,...preferred].map(a=>[`${a.sourceNodeId}|${a.targetNodeId}`,a])).values()]
 const start=(e:PointerEvent<HTMLElement>,id?:string)=>{if(e.button!==0)return;if(!id&&e.target!==e.currentTarget)return;const origin=id?positions[id]:{x:camera.x,y:camera.y};if(id&&pinned.includes(id))return;drag.current={id,x:e.clientX,y:e.clientY,origin,moved:false};e.currentTarget.setPointerCapture(e.pointerId)}
 const move=(e:PointerEvent<HTMLElement>)=>{const d=drag.current;if(!d)return;const dx=e.clientX-d.x,dy=e.clientY-d.y;if(Math.abs(dx)+Math.abs(dy)>4)d.moved=true;if(d.id){setPositions(p=>({...p,[d.id!]:{x:d.origin.x+dx/camera.scale,y:d.origin.y+dy/camera.scale}}))}else setCamera(c=>({...c,x:d.origin.x+dx,y:d.origin.y+dy}))}
 const end=()=>{drag.current=undefined}
 const zoom=(factor:number)=>setCamera(c=>{const scale=Math.min(1.8,Math.max(.2,c.scale*factor));return {scale,x:size.width/2-(size.width/2-c.x)*scale/c.scale,y:size.height/2-(size.height/2-c.y)*scale/c.scale}})
 return <div className="relationship-map" ref={viewport} aria-label="Interactive relationship map" onPointerDown={e=>start(e)} onPointerMove={move} onPointerUp={end} onPointerCancel={end}>
  <div className="map-instruction">READ THE CONNECTIONS <span>Drag cards or canvas · select a line to inspect its basis</span></div>
  <div className="map-world" style={{transform:`translate(${camera.x}px,${camera.y}px) scale(${camera.scale})`}}>
   <svg className="relationship-lines" width="1" height="1" aria-label="Recorded relationships"><defs><marker id="edge-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8Z" fill="#8b9d8a"/></marker><marker id="edge-active-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8Z" fill="#c2e9ad"/></marker></defs>
    {visibleEdges.map(a=>{const f=positions[a.sourceNodeId],t=positions[a.targetNodeId],right=t.x>=f.x;const sx=f.x+(right?W:0),sy=f.y+H/2,tx=t.x+(right?0:W),ty=t.y+H/2;const d=`M${sx} ${sy} C${sx+(right?110:-110)} ${sy},${tx+(right?-110:110)} ${ty},${tx} ${ty}`;const active=edge===a.id||path?.edgeIds.includes(a.id);return <g key={a.id} className={active?'map-edge active':'map-edge'} role="button" tabIndex={0} aria-label={`${objectById.get(a.sourceNodeId)?.name} ${a.predicate} ${objectById.get(a.targetNodeId)?.name}`} onClick={()=>onEdge(a.id)} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();onEdge(a.id)}}}><path d={d} className="edge-hit"/><path d={d} className="edge-stroke" strokeDasharray={a.basis==='atlas-synthesis'?'5 5':undefined} markerEnd={`url(#${active?'edge-active-arrow':'edge-arrow'})`}/><rect x={(sx+tx)/2-68} y={(sy+ty)/2-11} width="136" height="22" rx="11"/><text x={(sx+tx)/2} y={(sy+ty)/2+4}>{a.predicate.replaceAll('-',' ')}</text></g>})}
   </svg>
   {Object.entries(positions).map(([id,p])=>{const x=objectById.get(id);if(!x)return null;return <div key={id} className={`map-card ${selected===id?'selected':''} ${path?.nodeIds.includes(id)?'on-path':''}`} style={{left:p.x,top:p.y,'--node-color':x.color} as CSSProperties}>
    <span className="map-drag-handle" title="Drag to reposition" onPointerDown={e=>{e.stopPropagation();start(e,id)}} onPointerMove={move} onPointerUp={end}>⠿</span><button className="map-card-main" onClick={()=>onSelect(id)}><span>{x.kind}<small>{connections(id,basis).length} links</small></span><strong>{x.name}</strong></button><div className="map-card-actions"><button onClick={()=>expand(id)} aria-label={`Expand ${x.name}`}><Plus/> Expand</button>{expanded.includes(id)&&<button onClick={()=>collapse(id)} aria-label={`Collapse ${x.name}`}><Minus/></button>}<button aria-pressed={pinned.includes(id)} onClick={()=>setPinned(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id])} aria-label={`Pin ${x.name}`}><PushPin weight={pinned.includes(id)?'fill':'regular'}/></button>{id!==selected&&!pinned.includes(id)&&<button onClick={()=>setPositions(p=>Object.fromEntries(Object.entries(p).filter(([key])=>key!==id)))} aria-label={`Hide ${x.name}`}><X/></button>}</div>
   </div>})}
  </div>
  {!positions[selected]&&<button className="map-reveal" onClick={()=>seed(selected)}><Target/> Focus map on selected object</button>}
  <div className="map-bottom"><p role="status">{notice}</p><div><span><i/> Source-authored / crosswalk</span><span><i className="dashed"/> Atlas interpretation</span></div></div>
  <div className="map-zoom"><button onClick={()=>zoom(.82)} aria-label="Zoom out"><Minus/></button><span>{Math.round(camera.scale*100)}%</span><button onClick={()=>zoom(1.22)} aria-label="Zoom in"><Plus/></button><button onClick={()=>fit(positions)} aria-label="Fit visible map"><ArrowsOut/></button><button onClick={()=>seed(selected)} aria-label="Focus selected neighbourhood"><Target/></button></div>
  <svg className="map-minimap" viewBox="0 0 150 90" aria-label="Map overview" role="img">{Object.entries(positions).map(([id,p])=>{const all=Object.values(positions),minX=Math.min(...all.map(p=>p.x)),minY=Math.min(...all.map(p=>p.y)),maxX=Math.max(...all.map(p=>p.x))+W,maxY=Math.max(...all.map(p=>p.y))+H;return <rect key={id} x={8+(p.x-minX)/(maxX-minX)*134} y={8+(p.y-minY)/(maxY-minY)*74} width={Math.max(4,W/(maxX-minX)*134)} height={Math.max(3,H/(maxY-minY)*74)} fill={id===selected?'#476749':'#b9c6b1'}/>})}</svg>
 </div>
}
