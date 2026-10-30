import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { url } from '../lib/media.js'
import { reduced, velocity } from '../lib/smooth.js'

// An endless row of work at its true proportions. It drifts on its own,
// leans into the scroll, and slows to a stop while the pointer is over it.
export default function Drift({ items, reverse = false, speed = 30, onOpen, className = '' }) {
  const root = useRef()

  useGSAP(() => {
    if (reduced) return
    const track = root.current.firstElementChild
    const half = () => track.scrollWidth / 2
    let x = reverse ? -half() / 2 : 0
    let pace = 1
    let target = 1
    const enter = () => (target = 0)
    const leave = () => (target = 1)
    root.current.addEventListener('pointerenter', enter)
    root.current.addEventListener('pointerleave', leave)
    const tick = (_, dt) => {
      pace += (target - pace) * 0.06
      const push = Math.min(Math.abs(velocity()) * 0.5, 25)
      x += (reverse ? 1 : -1) * (speed + push * 10) * pace * (dt / 1000)
      const w = half()
      if (x <= -w) x += w
      if (x > 0) x -= w
      gsap.set(track, { x })
    }
    gsap.ticker.add(tick)
    return () => {
      gsap.ticker.remove(tick)
      root.current?.removeEventListener('pointerenter', enter)
      root.current?.removeEventListener('pointerleave', leave)
    }
  }, { scope: root })

  return (
    <div className={`drift ${className}`} ref={root}>
      <div className="drift__track">
        {[...items, ...items].map((m, i) => (
          <button
            key={i}
            className="drift__item"
            style={{ aspectRatio: `${m.w} / ${m.h}`, background: m.color }}
            onClick={() => onOpen?.(i % items.length)}
            data-cursor="View"
            tabIndex={i < items.length ? 0 : -1}
            aria-hidden={i >= items.length}
          >
            <img src={url(m.poster ?? m.sm)} alt="" width={m.w} height={m.h} loading={i < 8 ? 'eager' : 'lazy'} decoding="async" />
          </button>
        ))}
      </div>
    </div>
  )
}
