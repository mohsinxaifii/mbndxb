import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { finePointer } from '../lib/smooth.js'

// A dot that trails the pointer. Over anything with data-cursor="Label" it
// opens into a disc carrying that label; over plain links it becomes a ring.
export default function Cursor() {
  const el = useRef()
  const text = useRef()

  useEffect(() => {
    if (!finePointer) return
    const root = document.documentElement
    root.classList.add('has-cursor')
    const x = gsap.quickTo(el.current, 'x', { duration: 0.5, ease: 'power3' })
    const y = gsap.quickTo(el.current, 'y', { duration: 0.5, ease: 'power3' })
    let label = ''

    const move = e => {
      x(e.clientX)
      y(e.clientY)
      el.current.classList.remove('is-hidden')
    }
    const over = e => {
      const t = e.target.closest?.('[data-cursor], a, button')
      const next = t?.dataset.cursor ?? ''
      el.current.classList.toggle('is-link', !!t && !next)
      if (next !== label) {
        label = next
        el.current.classList.toggle('is-label', !!next)
        if (next) text.current.textContent = next
      }
    }
    const leave = () => el.current.classList.add('is-hidden')
    const down = () => el.current.classList.add('is-down')
    const up = () => el.current.classList.remove('is-down')

    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerover', over, { passive: true })
    document.addEventListener('pointerleave', leave)
    window.addEventListener('pointerdown', down)
    window.addEventListener('pointerup', up)
    return () => {
      root.classList.remove('has-cursor')
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerover', over)
      document.removeEventListener('pointerleave', leave)
      window.removeEventListener('pointerdown', down)
      window.removeEventListener('pointerup', up)
    }
  }, [])

  if (!finePointer) return null
  return (
    <div className="cursor is-hidden" ref={el} aria-hidden="true">
      <span className="cursor__disc" />
      <span className="cursor__text mono" ref={text} />
    </div>
  )
}
