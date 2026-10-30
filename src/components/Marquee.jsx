import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { reduced, velocity } from '../lib/smooth.js'

// A row that drifts on its own and leans into the scroll: faster as you
// scroll, and it follows the direction you scroll in.
export default function Marquee({ items, reverse = false, className = '', speed = 40 }) {
  const root = useRef()

  useGSAP(() => {
    if (reduced) return
    const track = root.current.firstElementChild
    const half = () => track.scrollWidth / 2
    let x = reverse ? -half() : 0
    let dir = 1
    const tick = (_, dt) => {
      const v = velocity()
      if (Math.abs(v) > 0.5) dir = Math.sign(v)
      const push = Math.min(Math.abs(v) * 0.6, 30)
      x += (reverse ? 1 : -1) * dir * (speed + push * 12) * (dt / 1000)
      const w = half()
      if (x <= -w) x += w
      if (x > 0) x -= w
      gsap.set(track, { x })
    }
    gsap.ticker.add(tick)
    return () => gsap.ticker.remove(tick)
  }, { scope: root })

  const row = items.map((t, i) => (
    <span className="marquee__item" key={i}>
      {t}<span className="marquee__dot" aria-hidden="true" />
    </span>
  ))
  return (
    <div className={`marquee ${className}`} ref={root}>
      <div className="marquee__track">
        {row}
        <span aria-hidden="true" className="marquee__dup">{row}</span>
      </div>
    </div>
  )
}
