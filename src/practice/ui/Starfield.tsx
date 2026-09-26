import { useEffect, useRef } from 'react'

/*
 * A 2D echo of the Atlas Universe sky: the same cool-white twinkling stars, a slow parallax drift that follows the
 * pointer, and the occasional shooting star. It pauses when off screen and draws a still sky for reduced motion.
 */
type Star = { x: number; y: number; depth: number; size: number; phase: number; speed: number }
type Meteor = { x: number; y: number; vx: number; vy: number; life: number; age: number }

const STAR_COLOUR = '207, 232, 255' // #cfe8ff, the Universe star colour
const AURORA = '196, 181, 253' // #c4b5fd, the Universe path pulse colour

export function Starfield({ className }: { className?: string }) {
  const canvas = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const element = canvas.current
    const context = element?.getContext('2d')
    if (!element || !context) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let width = 0, height = 0, ratio = 1, frame = 0, visible = true, last = 0
    let stars: Star[] = []
    const meteors: Meteor[] = []
    let nextMeteor = performance.now() + 2500
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 }

    const seed = () => {
      const count = Math.round((width * height) / 8500)
      stars = Array.from({ length: count }, () => {
        const depth = Math.random()
        return { x: Math.random() * width, y: Math.random() * height, depth, size: 0.3 + depth * depth * 1.15, phase: Math.random() * Math.PI * 2, speed: 0.4 + Math.random() * 1.4 }
      })
    }
    const resize = () => {
      const box = element.getBoundingClientRect()
      ratio = Math.min(2, window.devicePixelRatio || 1)
      width = box.width
      height = box.height
      element.width = Math.round(width * ratio)
      element.height = Math.round(height * ratio)
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      seed()
      draw(performance.now())
    }

    const draw = (time: number) => {
      context.clearRect(0, 0, width, height)
      pointer.x += (pointer.tx - pointer.x) * 0.05
      pointer.y += (pointer.ty - pointer.y) * 0.05
      for (const star of stars) {
        const twinkle = reduced ? 0.75 : 0.55 + 0.45 * Math.sin(time * 0.001 * star.speed + star.phase)
        const x = star.x + pointer.x * star.depth * 14
        const y = star.y + pointer.y * star.depth * 10
        // Stars behind the practice titles stay faint so the text reads cleanly.
        const behindText = x < width * 0.32 ? 0.35 : 1
        const alpha = (0.22 + star.depth * 0.6) * twinkle * behindText
        context.fillStyle = `rgba(${STAR_COLOUR}, ${alpha.toFixed(3)})`
        context.beginPath()
        context.arc(x, y, star.size, 0, Math.PI * 2)
        context.fill()
        if (star.size > 1.2 && behindText === 1) {
          context.fillStyle = `rgba(${STAR_COLOUR}, ${(alpha * 0.12).toFixed(3)})`
          context.beginPath()
          context.arc(x, y, star.size * 3.2, 0, Math.PI * 2)
          context.fill()
        }
      }
      if (reduced) return
      if (time > nextMeteor) {
        const fromLeft = Math.random() < 0.5
        meteors.push({ x: fromLeft ? Math.random() * width * 0.5 : width * (0.5 + Math.random() * 0.5), y: Math.random() * height * 0.35, vx: (fromLeft ? 1 : -1) * (0.55 + Math.random() * 0.35), vy: 0.22 + Math.random() * 0.18, life: 1100 + Math.random() * 600, age: 0 })
        nextMeteor = time + 5000 + Math.random() * 9000
      }
      for (let index = meteors.length - 1; index >= 0; index--) {
        const meteor = meteors[index]
        meteor.age += 16
        const progress = meteor.age / meteor.life
        if (progress >= 1) { meteors.splice(index, 1); continue }
        const x = meteor.x + meteor.vx * meteor.age, y = meteor.y + meteor.vy * meteor.age
        const fade = Math.sin(progress * Math.PI)
        const gradient = context.createLinearGradient(x, y, x - meteor.vx * 140, y - meteor.vy * 140)
        gradient.addColorStop(0, `rgba(${STAR_COLOUR}, ${(0.9 * fade).toFixed(3)})`)
        gradient.addColorStop(0.3, `rgba(${AURORA}, ${(0.35 * fade).toFixed(3)})`)
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
        context.strokeStyle = gradient
        context.lineWidth = 1.4
        context.beginPath()
        context.moveTo(x, y)
        context.lineTo(x - meteor.vx * 140, y - meteor.vy * 140)
        context.stroke()
      }
    }

    const loop = (time: number) => {
      frame = requestAnimationFrame(loop)
      if (!visible || time - last < 33) return // about 30 frames a second is plenty for a sky
      last = time
      draw(time)
    }
    const onPointer = (event: PointerEvent) => {
      const box = element.getBoundingClientRect()
      pointer.tx = ((event.clientX - box.left) / box.width - 0.5) * 2
      pointer.ty = ((event.clientY - box.top) / box.height - 0.5) * 2
    }

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(element)
    const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting })
    intersection.observe(element)
    resize()
    if (!reduced) {
      frame = requestAnimationFrame(loop)
      window.addEventListener('pointermove', onPointer, { passive: true })
    }
    return () => {
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      intersection.disconnect()
      window.removeEventListener('pointermove', onPointer)
    }
  }, [])

  return <canvas ref={canvas} className={className} aria-hidden="true" />
}
