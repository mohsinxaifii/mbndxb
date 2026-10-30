import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { url } from '../lib/media.js'
import { onReveal } from '../lib/reveal.js'
import { finePointer, reduced } from '../lib/smooth.js'

// A photograph redrawn as a halftone: one dot per cell, sized by how dark the
// picture is there. It is drawn fresh at the screen's resolution, so a small
// source stays crisp at any size. The dots grow in from the centre on arrival
// and lean away from the pointer.
export default function Halftone({ m, cols = 72, className = '' }) {
  const canvas = useRef()

  useEffect(() => {
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
    let raf = 0
    let alive = true

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
        grid[i] = (1 - lum) * a
        if (a > 0.5) ink.push(grid[i])
      }
      // Stretch the tones of the subject itself, so a dark photo still shows
      // its features instead of filling in as a silhouette.
      ink.sort((x, y) => x - y)
      const lo = ink[Math.floor(ink.length * 0.04)] ?? 0
      const hi = ink[Math.floor(ink.length * 0.97)] ?? 1
      for (let i = 0; i < grid.length; i++) {
        const a = data[i * 4 + 3] / 255
        const t = gsap.utils.clamp(0, 1, (grid[i] / (a || 1) - lo) / (hi - lo || 1))
        grid[i] = Math.pow(t, 1.35) * a
      }
    }

    const size = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = cv.clientWidth
      h = cv.clientHeight
      cv.width = Math.round(w * dpr)
      cv.height = Math.round(h * dpr)
    }

    const draw = () => {
      if (!grid) return
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = getComputedStyle(cv).color
      const cell = w / cols
      const reach = cell * 9
      const cx = cols / 2, cy = rows / 2
      const maxD = Math.hypot(cx, cy)
      pointer.x += (pointer.tx - pointer.x) * 0.12
      pointer.y += (pointer.ty - pointer.y) * 0.12
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const v = grid[y * cols + x]
          if (v < 0.04) continue
          // Arrival: dots switch on in a ring that opens out from the centre.
          const d = Math.hypot(x - cx, y - cy) / maxD
          const t = gsap.utils.clamp(0, 1, state.p * 1.6 - d * 0.6)
          if (t <= 0) continue
          let px = (x + 0.5) * cell
          let py = (y + 0.5) * cell
          let r = (cell / 2) * Math.sqrt(v) * 0.95 * t
          const dx = px - pointer.x, dy = py - pointer.y
          const dist = Math.hypot(dx, dy)
          if (dist < reach) {
            const f = 1 - dist / reach
            px += (dx / (dist || 1)) * f * cell * 1.4
            py += (dy / (dist || 1)) * f * cell * 1.4
            r *= 1 - f * 0.35
          }
          ctx.beginPath()
          ctx.arc(px, py, r, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    }

    // Only animate while on screen.
    let visible = true
    const loop = () => {
      if (visible) draw()
      if (alive) raf = requestAnimationFrame(loop)
    }
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
    io.observe(cv)

    const move = e => {
      const r = cv.getBoundingClientRect()
      pointer.tx = e.clientX - r.left
      pointer.ty = e.clientY - r.top
    }
    const leave = () => { pointer.tx = -1e4; pointer.ty = -1e4 }

    img.onload = () => {
      sample()
      size()
      if (reduced) return draw()
      loop()
    }
    img.src = url(m.src)

    const off = onReveal(() => gsap.to(state, { p: 1, duration: 2.2, ease: 'power2.out', delay: 0.3 }))
    window.addEventListener('resize', size)
    if (finePointer && !reduced) {
      window.addEventListener('pointermove', move)
      cv.addEventListener('pointerleave', leave)
    }
    return () => {
      alive = false
      cancelAnimationFrame(raf)
      io.disconnect()
      off()
      window.removeEventListener('resize', size)
      window.removeEventListener('pointermove', move)
      cv.removeEventListener('pointerleave', leave)
    }
  }, [m, cols])

  return <canvas ref={canvas} className={`halftone ${className}`} style={{ aspectRatio: `${m.w} / ${m.h}` }} role="img" aria-label="Portrait" />
}
