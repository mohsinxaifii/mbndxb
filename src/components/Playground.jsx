import { useEffect, useRef } from 'react'
import Matter from 'matter-js'
import gsap from 'gsap'
import { projects } from '../data/projects.js'
import { onReveal } from '../lib/reveal.js'
import { finePointer, reduced } from '../lib/smooth.js'
import { useGo } from '../lib/transition.jsx'

const { Engine, Bodies, Body, Composite, Mouse, MouseConstraint } = Matter

// The types of work as solid pills that drop into a tray. On a mouse they can
// be grabbed and thrown; a click without a drag opens that type of work.
// Colours are taken from the UAE flag: red, green, black and white.
const LOOKS = ['is-red', 'is-ink', 'is-green', 'is-white']

export default function Playground() {
  const root = useRef()
  const go = useGo()

  useEffect(() => {
    const box = root.current
    const pills = [...box.querySelectorAll('.pg__pill')]
    if (reduced) {
      box.classList.add('is-static')
      return
    }

    const engine = Engine.create({ gravity: { y: 1.1 } })
    let W = box.clientWidth
    let H = box.clientHeight
    let walls = []
    const buildWalls = () => {
      Composite.remove(engine.world, walls)
      const t = 200
      walls = [
        Bodies.rectangle(W / 2, H + t / 2, W * 3, t, { isStatic: true }),
        Bodies.rectangle(-t / 2, 0, t, H * 4, { isStatic: true }),
        Bodies.rectangle(W + t / 2, 0, t, H * 4, { isStatic: true }),
      ]
      Composite.add(engine.world, walls)
    }
    buildWalls()

    const bodies = pills.map((el, i) => {
      const w = el.offsetWidth
      const h = el.offsetHeight
      const b = Bodies.rectangle(
        W * (0.15 + 0.7 * ((i * 0.37) % 1)),
        -h - i * 120,
        w, h,
        { chamfer: { radius: h / 2 - 1 }, restitution: 0.35, friction: 0.25, frictionAir: 0.012, density: 0.002 },
      )
      Body.setAngle(b, gsap.utils.random(-0.5, 0.5))
      return { el, b, w, h }
    })

    let mc
    if (finePointer) {
      const mouse = Mouse.create(box)
      // Matter grabs the wheel by default, which would stop the page scrolling.
      mouse.element.removeEventListener('wheel', mouse.mousewheel)
      mouse.element.removeEventListener('mousewheel', mouse.mousewheel)
      mouse.element.removeEventListener('DOMMouseScroll', mouse.mousewheel)
      mc = MouseConstraint.create(engine, { mouse, constraint: { stiffness: 0.2, render: { visible: false } } })
      Composite.add(engine.world, mc)
    }

    let dropped = false
    const drop = () => {
      if (dropped) return
      dropped = true
      Composite.add(engine.world, bodies.map(x => x.b))
    }
    const off = onReveal(() => setTimeout(drop, 500))

    const tick = (_, dt) => {
      if (!dropped) return
      Engine.update(engine, Math.min(dt, 32))
      for (const { el, b, w, h } of bodies) {
        el.style.transform = `translate(${b.position.x - w / 2}px, ${b.position.y - h / 2}px) rotate(${b.angle}rad)`
      }
    }
    gsap.ticker.add(tick)

    // A click opens the type of work; a drag does not.
    let downAt = null
    const down = e => (downAt = { x: e.clientX, y: e.clientY, t: performance.now() })
    const up = e => {
      if (!downAt) return
      const moved = Math.hypot(e.clientX - downAt.x, e.clientY - downAt.y)
      const pill = document.elementsFromPoint(e.clientX, e.clientY).find(n => n.classList?.contains('pg__pill'))
      if (pill && moved < 6 && performance.now() - downAt.t < 400) go(`/work/${pill.dataset.slug}`, pill.dataset.title)
      downAt = null
    }
    box.addEventListener('pointerdown', down)
    window.addEventListener('pointerup', up)

    const resize = () => {
      W = box.clientWidth
      H = box.clientHeight
      buildWalls()
      for (const { b } of bodies) {
        if (b.position.x > W) Body.setPosition(b, { x: W - 60, y: b.position.y })
      }
    }
    window.addEventListener('resize', resize)

    return () => {
      off()
      gsap.ticker.remove(tick)
      box.removeEventListener('pointerdown', down)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('resize', resize)
      if (mc) Mouse.clearSourceEvents?.(mc.mouse)
      Engine.clear(engine)
    }
  }, [go])

  return (
    <div className="pg" ref={root} data-cursor={finePointer ? 'Throw' : undefined}>
      <p className="pg__hint mono">{finePointer ? '(Pick one to open. Or throw it.)' : '(Tap one to open)'}</p>
      {projects.map((p, i) => (
        <a
          key={p.slug}
          href={`${import.meta.env.BASE_URL}work/${p.slug}`}
          className={`pg__pill ${LOOKS[i % LOOKS.length]}`}
          data-slug={p.slug}
          data-title={p.title}
          data-cursor="Open"
          onClick={e => {
            e.preventDefault()
            if (!finePointer || reduced) go(`/work/${p.slug}`, p.title)
          }}
        >
          {p.title} <span aria-hidden="true">↗</span>
        </a>
      ))}
    </div>
  )
}
