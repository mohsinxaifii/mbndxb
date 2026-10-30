import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { projects } from '../data/projects.js'
import { duration, pieces, sample, url } from '../lib/media.js'
import { reduced, scrollTo, toneTrigger } from '../lib/smooth.js'
import { TLink } from '../lib/transition.jsx'
import { useLightbox } from '../components/Lightbox.jsx'
import Plate from '../components/Plate.jsx'
import VideoTile from '../components/VideoTile.jsx'

// One chapter per type of work. Each is shown the way that kind of work is
// best seen; every piece keeps its true proportions.
const VIEW = {
  packaging: { kind: 'strip', take: 10 },
  'social-media': { kind: 'wall', take: 24 },
  'performance-marketing': { kind: 'reels', take: 9 },
  branding: { kind: 'grid', take: 12 },
  'motion-graphics': { kind: 'film', take: 1 },
  'web-banners': { kind: 'banners', take: 5 },
  emailers: { kind: 'mailers', take: 6 },
  print: { kind: 'strip', take: 8 },
}

export default function Chapters() {
  return (
    <div className="chapters">
      <CategoryBar />
      {projects.map((p, i) => <Chapter key={p.slug} p={p} n={i + 1} />)}
    </div>
  )
}

// While the work is on screen, every category sits in a bar at the top of the
// page. The one you are reading is filled in; a click glides to another.
function CategoryBar() {
  const bar = useRef()
  const [active, setActive] = useState(projects[0].slug)
  const [open, setOpen] = useState(false)
  const at = projects.findIndex(p => p.slug === active)

  useGSAP(() => {
    const el = bar.current
    ScrollTrigger.create({
      trigger: '.chapters',
      start: 'top 45%',
      end: 'bottom 55%',
      onToggle: self => {
        el.classList.toggle('is-on', self.isActive)
        if (!self.isActive) setOpen(false)
      },
    })
    projects.forEach(p => {
      ScrollTrigger.create({
        trigger: `#c-${p.slug}`,
        start: 'top 50%',
        end: 'bottom 50%',
        onToggle: self => self.isActive && setActive(p.slug),
      })
    })
  })

  // Keep the active pill in view when the bar scrolls sideways on small screens.
  useEffect(() => {
    const pill = bar.current?.querySelector('.catbar__pill.is-active')
    const track = bar.current?.querySelector('.catbar__scroll')
    if (pill && track) track.scrollTo({ left: pill.offsetLeft - track.clientWidth / 2 + pill.offsetWidth / 2, behavior: 'smooth' })
  }, [active])

  const go = slug => {
    setOpen(false)
    const nav = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 64
    scrollTo(`#c-${slug}`, { offset: -(nav + 40) })
  }
  const step = d => go(projects[Math.min(projects.length - 1, Math.max(0, at + d))].slug)
  const num = i => String(i + 1).padStart(2, '0')

  return (
    <nav className="catbar" ref={bar} aria-label="Jump to a type of work">
      <div className="catbar__track">
        <div className="catbar__scroll">
        {projects.map(p => (
          <button
            key={p.slug}
            className={`catbar__pill${active === p.slug ? ' is-active' : ''}`}
            onClick={() => go(p.slug)}
            aria-current={active === p.slug ? 'true' : undefined}
          >
            {p.title}
          </button>
        ))}
        </div>
      </div>

      {/* Phones: one switcher instead of a row that would have to scroll. */}
      <div className={`catbar__mini${open ? ' is-open' : ''}`}>
        <ul className="catbar__menu" role="list">
          {projects.map((p, i) => (
            <li key={p.slug}>
              <button className={active === p.slug ? 'is-active' : ''} onClick={() => go(p.slug)}>
                <span className="mono">{num(i)}</span> {p.title}
              </button>
            </li>
          ))}
        </ul>
        <div className="catbar__switch">
          <button className="catbar__step" onClick={() => step(-1)} disabled={at <= 0} aria-label="Previous type of work">‹</button>
          <button className="catbar__current" onClick={() => setOpen(o => !o)} aria-expanded={open}>
            <span className="mono">{num(at)} / {num(projects.length - 1)}</span>
            <span>{projects[at]?.title}</span>
            <span className="catbar__caret" aria-hidden="true">▴</span>
          </button>
          <button className="catbar__step" onClick={() => step(1)} disabled={at >= projects.length - 1} aria-label="Next type of work">›</button>
        </div>
      </div>
    </nav>
  )
}

function Chapter({ p, n }) {
  const root = useRef()
  const open = useLightbox()
  const view = VIEW[p.slug] ?? { kind: 'grid', take: 8 }
  const all = pieces(p.slug)
  // Reels show only vertical pieces, so the strip keeps one shape and even spacing.
  const pool = view.kind === 'reels' && all.filter(m => m.h > m.w).length >= 4 ? all.filter(m => m.h > m.w) : all
  const items = view.kind === 'film' ? [all.find(m => m.key === p.cover) ?? all[0]] : sample(pool, view.take)
  const show = i => open(items, i, p.title)

  useGSAP(() => {
    if (view.kind === 'film') toneTrigger(root.current)
    if (reduced) return
    const el = root.current
    gsap.from(el.querySelectorAll('.chap__head > *'), {
      y: 30, autoAlpha: 0, filter: 'blur(8px)', duration: 1.1, ease: 'expo.out', stagger: 0.07,
      scrollTrigger: { trigger: el, start: 'top 80%' },
    })
    const mm = gsap.matchMedia()
    mm.add('(min-width: 801px)', () => {
      const track = el.querySelector('.chap__track')
      if (track) {
        gsap.fromTo(track, { x: 0 }, {
          x: () => -Math.max(0, track.scrollWidth - track.parentElement.clientWidth),
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top 70%', end: 'bottom 30%', scrub: 0.8, invalidateOnRefresh: true },
        })
      }
      el.querySelectorAll('.chap__col').forEach((col, i) => {
        gsap.fromTo(col, { y: i % 2 ? -60 : 60 }, {
          y: i % 2 ? 60 : -60, ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
        })
      })
      el.querySelectorAll('.chap__banner').forEach((b, i) => {
        gsap.fromTo(b, { xPercent: i % 2 ? -10 : 10 }, {
          xPercent: 0, ease: 'none',
          scrollTrigger: { trigger: b, start: 'top bottom', end: 'bottom top', scrub: true },
        })
      })
      const film = el.querySelector('.chap__film')
      if (film) {
        gsap.fromTo(film, { scale: 0.62, rotation: -2 }, {
          scale: 1, rotation: 0, ease: 'none',
          scrollTrigger: { trigger: film, start: 'top bottom', end: 'center center', scrub: true },
        })
      }
    })
    return () => mm.revert()
  }, { scope: root })

  return (
    <section className={`chap chap--${view.kind}`} id={`c-${p.slug}`} ref={root}>
      {n === 1 && <span id="work" className="chap__anchor" />}
      {view.kind === 'film' && <span id="motion" className="chap__anchor" />}
      <header className="chap__head">
        <span className="mono chap__n">({String(n).padStart(2, '0')})</span>
        <h2 className="chap__title">{p.title}</h2>
        <span className="mono chap__tags">{p.tags.join(' · ')}</span>
        <TLink to={`/work/${p.slug}`} label={p.title} className="chap__all" data-cursor="Open">
          View all <span aria-hidden="true">→</span>
        </TLink>
      </header>
      <Body kind={view.kind} items={items} title={p.title} show={show} />
    </section>
  )
}

// Phones: a strip is a left-aligned swipeable carousel that also advances on its own.
// One piece every few seconds, looping to the start, only while on screen;
// any touch pauses it, and it resumes a few seconds after the last one.
function useAutoplay(ref) {
  useEffect(() => {
    const el = ref.current
    if (!el || reduced || !matchMedia('(max-width: 800px)').matches) return
    let visible = false
    let idleUntil = 0
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0.5 })
    io.observe(el)
    const hold = () => (idleUntil = Date.now() + 5000)
    const opts = { passive: true }
    el.addEventListener('touchstart', hold, opts)
    el.addEventListener('pointerdown', hold, opts)
    el.addEventListener('wheel', hold, opts)
    const step = () => {
      if (!visible || Date.now() < idleUntil || document.hidden) return
      // Cards snap to the left margin, so step to the next card's left edge.
      const pad = parseFloat(getComputedStyle(el).scrollPaddingLeft) || 0
      const cells = [...el.querySelectorAll('.chap__cell')]
      const next = cells.find(c => c.offsetLeft - pad > el.scrollLeft + 4)
      const atEnd = !next || el.scrollLeft + el.clientWidth >= el.scrollWidth - 4
      el.scrollTo({ left: atEnd ? 0 : next.offsetLeft - pad, behavior: 'smooth' })
    }
    const timer = setInterval(step, 2800)
    return () => {
      clearInterval(timer)
      io.disconnect()
      el.removeEventListener('touchstart', hold)
      el.removeEventListener('pointerdown', hold)
      el.removeEventListener('wheel', hold)
    }
  }, [ref])
}

function Strip({ items, title, show }) {
  const win = useRef()
  const [at, setAt] = useState(0)
  useAutoplay(win)
  // Which piece is centred, for the position dots on phones.
  useEffect(() => {
    const el = win.current
    const onScroll = () => {
      const pad = parseFloat(getComputedStyle(el).scrollPaddingLeft) || 0
      const x = el.scrollLeft + pad
      const cells = [...el.querySelectorAll('.chap__cell')]
      // At the far end the last card can't reach the margin, so count it as current.
      const end = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4
      let best = 0
      cells.forEach((c, i) => { if (Math.abs(c.offsetLeft - x) < Math.abs(cells[best].offsetLeft - x)) best = i })
      setAt(end ? cells.length - 1 : best)
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <>
    <div className="chap__window" ref={win}>
      <div className="chap__track">
        {items.map((m, i) => (
          <div className="chap__cell" key={m.key} style={{ '--r': m.w / m.h }}>
            {m.kind === 'video'
              ? <VideoTile m={m} label={title} onOpen={() => show(i)} />
              : <Plate m={m} alt={title} sizes="40vw" onOpen={() => show(i)} />}
          </div>
        ))}
      </div>
    </div>
    <div className="chap__dots" aria-hidden="true">
      {items.map((m, i) => <i key={m.key} className={i === at ? 'is-on' : ''} />)}
    </div>
    </>
  )
}

function Body({ kind, items, title, show }) {
  if (kind === 'strip' || kind === 'reels') return <Strip items={items} title={title} show={show} />

  if (kind === 'wall' || kind === 'mailers') {
    const n = kind === 'wall' ? 4 : 6
    const cols = Array.from({ length: n }, (_, c) => items.map((m, i) => [m, i]).filter((_, i) => i % n === c))
    return (
      <div className={`chap__cols chap__cols--${n}`}>
        {cols.map((col, c) => (
          <div className="chap__col" key={c}>
            {col.map(([m, i]) => <Plate key={m.key} m={m} alt={title} sizes={`${Math.round(100 / n)}vw`} onOpen={() => show(i)} cursor={kind === 'mailers' ? 'Read' : 'View'} />)}
          </div>
        ))}
      </div>
    )
  }
  if (kind === 'banners') {
    return (
      <div className="chap__banners">
        {items.map((m, i) => (
          <div className="chap__banner" key={m.key}>
            <Plate m={m} alt={title} sizes="80vw" onOpen={() => show(i)} />
          </div>
        ))}
      </div>
    )
  }
  if (kind === 'film') {
    const m = items[0]
    return (
      <div className="chap__stage">
        <figure className="chap__film" style={{ aspectRatio: `${m.w} / ${m.h}` }} onClick={() => show(0)} data-cursor="Play">
          <video src={url(m.src)} poster={url(m.poster)} muted loop autoPlay playsInline />
          <span className="chap__play mono"><i aria-hidden="true" /> Play with sound · {duration(m)}</span>
        </figure>
      </div>
    )
  }
  return (
    <div className="chap__grid">
      {items.map((m, i) => (
        <Plate key={m.key} m={m} alt={title} sizes="25vw" onOpen={() => show(i)} />
      ))}
    </div>
  )
}
