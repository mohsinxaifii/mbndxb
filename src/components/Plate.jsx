import { useEffect, useRef, useState } from 'react'
import { url } from '../lib/media.js'

// One shared observer tells each piece the first time it comes into view.
// The state lives in React, so re-renders (e.g. when the image loads) keep it.
let io
const waiting = new Map()
function observe(el, onShow) {
  if (!io) {
    io = new IntersectionObserver(entries => {
      for (const e of entries) {
        if (e.isIntersecting) {
          waiting.get(e.target)?.()
          waiting.delete(e.target)
          io.unobserve(e.target)
        }
      }
    }, { rootMargin: '0px 0px -6% 0px' })
  }
  waiting.set(el, onShow)
  io.observe(el)
  return () => {
    waiting.delete(el)
    io.unobserve(el)
  }
}

export function useReveal() {
  const ref = useRef()
  const [shown, setShown] = useState(false)
  useEffect(() => observe(ref.current, () => setShown(true)), [])
  return [ref, shown]
}

// An image at its true proportions, never cropped, with its dominant colour
// standing in until it loads.
export default function Plate({ m, sizes = '50vw', alt = '', big = false, className = '', onOpen, cursor = 'View', eager = false }) {
  const [ref, shown] = useReveal()
  const [loaded, setLoaded] = useState(false)
  if (!m) return null
  const full = Math.min(m.w, m.h / m.w > 1.6 ? 1400 : 2000)
  const set = m.sm === m.src ? undefined : `${url(m.sm)} ${Math.min(m.w, 720)}w, ${url(m.src)} ${full}w`
  return (
    <figure
      ref={ref}
      className={`plate reveal${shown ? ' is-in' : ''}${loaded ? ' is-loaded' : ''} ${className}`}
      style={{ '--ar': `${m.w} / ${m.h}`, '--tint': m.color }}
      onClick={onOpen}
      data-cursor={onOpen ? cursor : undefined}
    >
      <img
        src={url(big ? m.src : m.sm)}
        srcSet={set}
        sizes={sizes}
        width={m.w}
        height={m.h}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={() => setLoaded(true)}
      />
    </figure>
  )
}
