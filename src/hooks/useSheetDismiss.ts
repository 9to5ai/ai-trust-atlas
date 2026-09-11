import { useCallback } from 'react'
import { animate, useMotionValue } from 'motion/react'

// Content scrolls normally. A downward gesture can take over only if it starts
// at the top; the sticky handle can always be dragged, including with a mouse.
export function useSheetDismiss(onClose: () => void) {
  const y = useMotionValue(0)
  const ref = useCallback((element: HTMLElement | null) => {
    if (!element) return
    y.set(0)
    let gesture: { x: number; y: number; started: number; dragging: boolean } | undefined
    let suppressClick = false
    let pointer: number | undefined
    let reset: ReturnType<typeof animate> | undefined
    const handle = (target: EventTarget | null) => target instanceof Element && !!target.closest('.mobile-inspector-peek')
    const start = (x: number, top: number, target: EventTarget | null) => {
      if (!window.matchMedia('(max-width: 860px)').matches) return
      const fromHandle = handle(target)
      if (!fromHandle && (element.scrollTop > 0 || (target instanceof Element && target.closest('button,a,input,textarea,select,summary')))) return
      reset?.stop(); y.set(0); suppressClick = false
      gesture = { x, y: top, started: Date.now(), dragging: false }
    }
    const move = (x: number, top: number, event: Event) => {
      if (!gesture) return
      const dx=x-gesture.x, dy=top-gesture.y
      if (!gesture.dragging) {
        if (Math.abs(dx)<8 && Math.abs(dy)<8) return
        if (dy<=0 || Math.abs(dx)>dy) { gesture=undefined; return }
        gesture.dragging=true
      }
      if (event.cancelable) event.preventDefault()
      y.set(Math.max(0,dy))
    }
    const end = (cancelled=false) => {
      if (!gesture) return
      const distance=y.get(), velocity=distance/Math.max(1,Date.now()-gesture.started)
      suppressClick=gesture.dragging
      const dismiss=!cancelled && gesture.dragging && (distance>=100 || (distance>=45 && velocity>=0.65))
      gesture=undefined
      if(dismiss) onClose()
      else reset=animate(y,0,{duration:window.matchMedia('(prefers-reduced-motion: reduce)').matches?0:0.18})
    }
    const touchStart=(e:TouchEvent)=>{ if(e.touches.length===1)start(e.touches[0].clientX,e.touches[0].clientY,e.target); else end(true) }
    const touchMove=(e:TouchEvent)=>{ if(e.touches.length!==1) { end(true); return }; move(e.touches[0].clientX,e.touches[0].clientY,e) }
    const touchEnd=()=>end()
    const cancel=()=>end(true)
    const down=(e:PointerEvent)=>{ if(e.pointerType==='touch' || e.button!==0 || !handle(e.target))return; start(e.clientX,e.clientY,e.target); if(gesture)pointer=e.pointerId }
    // Capture only once a drag starts; capturing the aside on pointerdown
    // retargets a normal handle click away from its expand button.
    const pointerMove=(e:PointerEvent)=>{if(e.pointerId===pointer){move(e.clientX,e.clientY,e);if(gesture?.dragging && !element.hasPointerCapture(e.pointerId))element.setPointerCapture(e.pointerId)}}
    const up=(e:PointerEvent)=>{if(e.pointerId===pointer){end();if(element.hasPointerCapture(e.pointerId))element.releasePointerCapture(e.pointerId);pointer=undefined}}
    const click=(e:MouseEvent)=>{if(suppressClick){e.preventDefault();e.stopPropagation();suppressClick=false}}
    element.addEventListener('touchstart',touchStart,{passive:true})
    element.addEventListener('touchmove',touchMove,{passive:false})
    element.addEventListener('touchend',touchEnd)
    element.addEventListener('touchcancel',cancel)
    element.addEventListener('pointerdown',down)
    element.addEventListener('pointermove',pointerMove)
    element.addEventListener('pointerup',up)
    element.addEventListener('pointercancel',cancel)
    element.addEventListener('click',click,true)
    return ()=>{
      reset?.stop()
      element.removeEventListener('touchstart',touchStart);element.removeEventListener('touchmove',touchMove);element.removeEventListener('touchend',touchEnd);element.removeEventListener('touchcancel',cancel)
      element.removeEventListener('pointerdown',down);element.removeEventListener('pointermove',pointerMove);element.removeEventListener('pointerup',up);element.removeEventListener('pointercancel',cancel);element.removeEventListener('click',click,true)
    }
  },[onClose,y])
  return {ref,y}
}
