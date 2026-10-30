import { useLayoutEffect, useRef } from 'react'
import { site } from '../data/site.js'

// The wordmark: first name heavy and condensed, surname light and scaled to
// the same width, set as one block. The dots of the two i's are lifted out
// as vermilion circles and hop when the mark is hovered.
export default function Logo({ className = '' }) {
  const root = useRef()
  const [first, last] = site.name.split(' ')

  useLayoutEffect(() => {
    const el = root.current
    const [a, b] = el.querySelectorAll('.logo__row')
    // The surname is scaled, not spaced out, until both rows share one width.
    const justify = () => {
      b.style.fontSize = '1em'
      const wa = a.getBoundingClientRect().width
      const wb = b.getBoundingClientRect().width
      if (wa && wb) b.style.fontSize = `${wa / wb}em`
    }
    justify()
    document.fonts?.ready.then(justify)
    const ro = new ResizeObserver(justify)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const letters = word => [...word].map((c, i) =>
    c === 'i'
      ? <span className="logo__ch logo__i" key={i} style={{ '--n': i }}>ı</span>
      : <span className="logo__ch" key={i}>{c}</span>,
  )

  return (
    <span className={`logo ${className}`} ref={root} role="img" aria-label={site.name}>
      <span className="logo__row logo__row--a" aria-hidden="true">{letters(first)}</span>
      <span className="logo__row logo__row--b" aria-hidden="true">{letters(last)}</span>
    </span>
  )
}
