import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { url } from '../lib/media.js'
import { onReveal } from '../lib/reveal.js'
import { finePointer, reduced } from '../lib/smooth.js'

// A portrait drawn entirely as a halftone: one dot per cell, sized by how dark
// the picture is there. The dots grow in from the centre on arrival, then a
// ghost cursor sweeps across once to show they respond. After that the dots
// lean away from the real pointer, and a click or tap sends a ripple through.
export default function Halftone({ m, cols = 130, className = '' }) {
  const root = useRef()
  const canvas = useRef()
  const [hint, setHint] = useState(false)

  useEffect(() => {
    const box = root.current
    const cv = canvas.current
    const ctx = cv.getContext('2d')
    const img = new Image()
    let grid = null
    let rows = 0
    let w = 0
    let h = 0
    let dpr = 1
    const state = { p: reduced ? 1 : 0 }
    const pointer = { x: -1e4, y: -1e4, tx: -1e4, ty: -1e4 }
    const ghost = { on: false, x: 0, y: 0 }
    const ripples = []
    let raf = 0
    let alive = true
    let dirty = true
    let touched = false

    const sample = () => {
      rows = Math.round((cols * img.height) / img.width)
      const off = document.createElement('canvas')
      off.width = cols
      off.height = rows
      const o = off.getContext('2d')
      o.drawImage(img, 0, 0, cols, rows)
      const data = o.getImageData(0, 0, cols, rows).data
      grid = new Float32Array(cols * rows)
      const ink = []
      for (let i = 0; i < cols * rows; i++) {
        const r = data[i * 4], g = data[i * 4 + 1], b = data[i * 4 + 2], a = data[i * 4 + 3] / 255
        const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
        grid[i] = 1 - lum
        if (a > 0.5) ink.push(grid[i])
      }
      // Stretch the subject's tones so the features read, then give every
      // part of the subject at least a faint dot so its outline holds.
      ink.sort((x, y) => x - y)
      const lo = ink[Math.floor(ink.length * 0.03)] ?? 0
      const hi = ink[Math.floor(ink.length * 0.98)] ?? 1
      for (let i = 0; i < grid.length; i++) {
        const a = data[i * 4 + 3] / 255
        if (a < 0.35) { grid[i] = 0; continue }
        const t = gsap.utils.clamp(0, 1, (grid[i] - lo) / (hi - lo || 1))
        // A gentle S-curve pulls the mid-tones apart, so the eyes, brows and
        // nose separate from the skin around them.
        const s = t < 0.5 ? 2 * t * t : 1 - 2 * (1 - t) * (1 - t)
        const c = t * 0.35 + s * 0.65
        grid[i] = Math.max(0.07, c) * Math.min(1, a * 1.2)
      }
    }

    const size = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = cv.clientWidth
      h = cv.clientHeight
      cv.width = Math.round(w * dpr)
      cv.height = Math.round(h * dpr)
      dirty = true
    }

    const draw = now => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)
      const cell = w / cols
      const reach = cell * 11
      const push = cell * 1.6
      const cx = cols / 2, cy = rows / 2
      const maxD = Math.hypot(cx, cy)
      const live = ripples.filter(r => now - r.t < 1600)
      ripples.length = 0
      ripples.push(...live)

      // One path for every dot: far cheaper than filling them one by one.
      ctx.beginPath()
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const v = grid[y * cols + x]
          if (v <= 0) continue
          const d = Math.hypot(x - cx, y - cy) / maxD
          const t = gsap.utils.clamp(0, 1, state.p * 1.6 - d * 0.6)
          if (t <= 0) continue
          let px = (x + 0.5) * cell
          let py = (y + 0.5) * cell
          let r = (cell / 2) * Math.sqrt(v) * 0.92 * t
          const dx = px - pointer.x, dy = py - pointer.y
          const dist = Math.hypot(dx, dy)
          if (dist < reach) {
            const f = 1 - dist / reach
            px += (dx / (dist || 1)) * f * push
            py += (dy / (dist || 1)) * f * push
            r *= 1 - f * 0.4
          }
          for (const rp of ripples) {
            const age = (now - rp.t) / 1600
            const ring = age * w * 0.9
            const rx = px - rp.x, ry = py - rp.y
            const rd = Math.hypot(rx, ry)
            const band = 1 - Math.abs(rd - ring) / (cell * 6)
            if (band > 0) {
              const k = band * (1 - age)
              px += (rx / (rd || 1)) * k * cell * 1.3
              py += (ry / (rd || 1)) * k * cell * 1.3
              r *= 1 + k * 0.6
            }
          }
          ctx.moveTo(px + r, py)
          ctx.arc(px, py, r, 0, Math.PI * 2)
        }
      }
      ctx.fillStyle = getComputedStyle(cv).color
      ctx.fill()

      // The ghost cursor: a small ring, so the first sweep reads as a pointer.
      if (ghost.on) {
        ctx.beginPath()
        ctx.arc(ghost.x, ghost.y, cell * 3.2, 0, Math.PI * 2)
        ctx.strokeStyle = '#d2461f'
        ctx.lineWidth = 1.5
        ctx.stroke()
        ctx.beginPath()
        ctx.arc(ghost.x, ghost.y, cell * 0.9, 0, Math.PI * 2)
        ctx.fillStyle = '#d2461f'
        ctx.fill()
      }
    }

    // Redraw only when something is moving.
    let visible = true
    const loop = now => {
      const settling = Math.abs(pointer.tx - pointer.x) + Math.abs(pointer.ty - pointer.y) > 0.3
      if (settling) {
        pointer.x += (pointer.tx - pointer.x) * 0.14
        pointer.y += (pointer.ty - pointer.y) * 0.14
      }
      if (visible && grid && (dirty || settling || ripples.length || state.p < 1 || ghost.on)) {
        draw(now)
        dirty = false
      }
      if (alive) raf = requestAnimationFrame(loop)
    }
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
    io.observe(cv)

    const local = e => {
      const r = cv.getBoundingClientRect()
      return { x: e.clientX - r.left, y: e.clientY - r.top }
    }
    const firstTouch = () => {
      if (touched) return
      touched = true
      setHint(false)
    }
    const move = e => {
      if (ghost.on) return
      const p = local(e)
      pointer.tx = p.x
      pointer.ty = p.y
    }
    const enter = () => firstTouch()
    const leave = () => { pointer.tx = -1e4; pointer.ty = -1e4 }
    const down = e => {
      firstTouch()
      const p = local(e)
      ripples.push({ x: p.x, y: p.y, t: performance.now() })
    }

    // Once the portrait has arrived, a ghost cursor sweeps across the face.
    let sweep
    const demo = () => {
      if (touched || reduced) return
      setHint(true)
      const path = { t: 0 }
      sweep = gsap.to(path, {
        t: 1,
        duration: 2.6,
        ease: 'sine.inOut',
        onStart: () => (ghost.on = true),
        onUpdate: () => {
          // A gentle S across the face, from lower left to upper right and back to centre.
          const a = path.t
          ghost.x = w * (0.2 + 0.62 * a)
          ghost.y = h * (0.62 - 0.32 * Math.sin(a * Math.PI) + 0.06 * Math.sin(a * Math.PI * 3))
          pointer.x = pointer.tx = ghost.x
          pointer.y = pointer.ty = ghost.y
        },
        onComplete: () => {
          ghost.on = false
          ripples.push({ x: ghost.x, y: ghost.y, t: performance.now() })
          pointer.tx = -1e4
          pointer.ty = -1e4
          dirty = true
        },
      })
    }

    img.onload = () => {
      sample()
      size()
      raf = requestAnimationFrame(loop)
    }
    img.src = url(m.src)

    const off = onReveal(() => gsap.to(state, { p: 1, duration: 2, ease: 'power2.out', delay: 0.3, onComplete: () => setTimeout(demo, 300) }))
    window.addEventListener('resize', size)
    if (!reduced) {
      box.addEventListener('pointerdown', down)
      if (finePointer) {
        window.addEventListener('pointermove', move)
        box.addEventListener('pointerenter', enter)
        box.addEventListener('pointerleave', leave)
      }
    }
    return () => {
      alive = false
      cancelAnimationFrame(raf)
      sweep?.kill()
      io.disconnect()
      off()
      window.removeEventListener('resize', size)
      window.removeEventListener('pointermove', move)
      box.removeEventListener('pointerdown', down)
      box.removeEventListener('pointerenter', enter)
      box.removeEventListener('pointerleave', leave)
    }
  }, [m, cols])

  return (
    <figure ref={root} className={`halftone ${className}`} style={{ aspectRatio: `${m.w} / ${m.h}` }} data-cursor={finePointer ? 'Play' : undefined}>
      <canvas ref={canvas} role="img" aria-label="Portrait of Mobeen Saifi, drawn in halftone dots" />
      <figcaption className={`halftone__hint mono${hint ? ' is-on' : ''}`} aria-hidden="true">
        <i /> Interactive portrait · {finePointer ? 'hover to explore' : 'tap to ripple'}
      </figcaption>
    </figure>
  )
}
