import { useEffect, useRef, useState } from 'react'
import { url } from '../lib/media.js'

// One shared observer: anything with .reveal gets .is-in the first time it shows.
let io
function observe(el) {
  if (!io) {
    io = new IntersectionObserver(entries => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('is-in')
          io.unobserve(e.target)
        }
      }
    }, { rootMargin: '0px 0px -8% 0px' })
  }
  io.observe(el)
  return () => io.unobserve(el)
}

export function useReveal() {
  const ref = useRef()
  useEffect(() => observe(ref.current), [])
  return ref
}

// An image at its true proportions, never cropped, with its dominant colour
// standing in until it loads.
export default function Plate({ m, sizes = '50vw', alt = '', big = false, className = '', onOpen, cursor = 'View', eager = false }) {
  const ref = useReveal()
  const [loaded, setLoaded] = useState(false)
  if (!m) return null
  const full = Math.min(m.w, m.h / m.w > 1.6 ? 1400 : 2000)
  const set = m.sm === m.src ? undefined : `${url(m.sm)} ${Math.min(m.w, 720)}w, ${url(m.src)} ${full}w`
  return (
    <figure
      ref={ref}
      className={`plate reveal${loaded ? ' is-loaded' : ''} ${className}`}
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
