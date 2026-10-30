import { useRef } from 'react'
import gsap from 'gsap'
import { Draggable } from 'gsap/Draggable'
import { useGSAP } from '@gsap/react'
import { finePointer, reduced } from '../lib/smooth.js'

gsap.registerPlugin(Draggable)

// A sticker pinned loosely to the page. It drifts against the scroll at its
// own speed, sways a little, and can be picked up and moved.
export default function Floater({ children, style, speed = 1, tilt = -6, className = '' }) {
  const outer = useRef()
  const pop = useRef()
  const inner = useRef()

  useGSAP(() => {
    if (reduced) return
    gsap.fromTo(outer.current, { y: 120 * speed, rotation: tilt - 6 * speed }, {
      y: -120 * speed, rotation: tilt + 6 * speed, ease: 'none',
      scrollTrigger: { trigger: outer.current, start: 'top bottom', end: 'bottom top', scrub: true },
    })
    // Three layers so the drift, the pop-in and the drag never fight over one transform.
    gsap.from(pop.current, {
      scale: 0, rotation: -40, duration: 1.2, ease: 'back.out(1.8)',
      scrollTrigger: { trigger: outer.current, start: 'top 90%' },
    })
    if (finePointer) {
      Draggable.create(inner.current, {
        onPress() { gsap.to(this.target, { scale: 1.08, duration: 0.3 }) },
        onRelease() { gsap.to(this.target, { scale: 1, duration: 0.5, ease: 'back.out(2)' }) },
      })
    }
  })

  return (
    <div className={`floater ${className}`} ref={outer} style={style} aria-hidden="true">
      <div ref={pop}>
        <div className="floater__inner" ref={inner} data-cursor="Drag">{children}</div>
      </div>
    </div>
  )
}

// A round badge with its text running around the edge, turning slowly.
export function Badge({ text, center }) {
  const id = useRef(`ring-${Math.random().toString(36).slice(2, 8)}`).current
  return (
    <div className="badge">
      <svg viewBox="0 0 200 200" className="badge__ring">
        <defs><path id={id} d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" /></defs>
        <text><textPath href={`#${id}`} startOffset="0">{text}</textPath></text>
      </svg>
      <span className="badge__center">{center}</span>
    </div>
  )
}
