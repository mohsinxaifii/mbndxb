import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { projects } from '../data/projects.js'
import { duration, pieces, sample, url } from '../lib/media.js'
import { reduced, toneTrigger } from '../lib/smooth.js'
import { TLink } from '../lib/transition.jsx'
import { useLightbox } from '../components/Lightbox.jsx'
import Plate from '../components/Plate.jsx'
import VideoTile from '../components/VideoTile.jsx'
import Floater from '../components/Floater.jsx'
import Flag from '../components/Flag.jsx'

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

// Stickers pinned loosely to some chapters. They drift with the scroll and can be dragged.
const STICKERS = {
  packaging: {
    pos: { right: '8vw', top: '6vh' }, tilt: 7,
    body: <span className="sticker sticker--flag"><Flag /> Dubai-based. Brief me from anywhere.</span>,
  },
  branding: {
    pos: { left: '46vw', top: '2vh' }, tilt: -8, speed: 1.3,
    body: (
      <span className="sticker sticker--ink">
        <svg viewBox="0 0 24 24" className="sticker__icon" aria-hidden="true"><path d="M12 2l2.2 6.6L21 11l-6.8 2.4L12 20l-2.2-6.6L3 11l6.8-2.4z" /></svg>
        AI in the workflow, every single day
      </span>
    ),
  },
  'web-banners': {
    pos: { right: '10vw', top: '4vh' }, tilt: 6, speed: 1.1,
    body: (
      <span className="sticker sticker--red">
        <svg viewBox="0 0 32 20" className="sticker__icon sticker__car" aria-hidden="true">
          <path d="M4 13l2-6c.4-1.2 1.4-2 2.7-2h12.6c1.3 0 2.3.8 2.7 2l2 6v4h-3v-2H7v2H4z" />
          <circle cx="9" cy="13" r="1.6" /><circle cx="23" cy="13" r="1.6" />
        </svg>
        Dubai driving license. Happy to drive to your shoot.
      </span>
    ),
  },
}

export default function Chapters() {
  return projects.map((p, i) => <Chapter key={p.slug} p={p} n={i + 1} first={i === 0} />)
}

function Chapter({ p, n, first }) {
  const root = useRef()
  const open = useLightbox()
  const view = VIEW[p.slug] ?? { kind: 'grid', take: 8 }
  const all = pieces(p.slug)
  const items = view.kind === 'film' ? [all.find(m => m.key === p.cover) ?? all[0]] : sample(all, view.take)
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
    <section className={`chap chap--${view.kind}`} id={first ? 'work' : view.kind === 'film' ? 'motion' : undefined} ref={root}>
      <header className="chap__head">
        <span className="mono chap__n">({String(n).padStart(2, '0')})</span>
        <h2 className="chap__title">{p.title}</h2>
        <span className="mono chap__tags">{p.tags.join(' · ')}</span>
        <TLink to={`/work/${p.slug}`} label={p.title} className="chap__all" data-cursor="Open">
          View all <span aria-hidden="true">→</span>
        </TLink>
      </header>
      <Body kind={view.kind} items={items} title={p.title} show={show} />
      {STICKERS[p.slug] && (
        <Floater style={STICKERS[p.slug].pos} tilt={STICKERS[p.slug].tilt} speed={STICKERS[p.slug].speed ?? 1}>
          {STICKERS[p.slug].body}
        </Floater>
      )}
    </section>
  )
}

function Body({ kind, items, title, show }) {
  if (kind === 'strip' || kind === 'reels') {
    return (
      <div className="chap__window">
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
    )
  }
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
