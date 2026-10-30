import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { site } from '../data/site.js'
import { pieces, sample } from '../lib/media.js'
import { onReveal } from '../lib/reveal.js'
import { reduced } from '../lib/smooth.js'
import { useLightbox } from '../components/Lightbox.jsx'
import { Words } from '../components/Split.jsx'
import Drift from '../components/Drift.jsx'

const mix = (...lists) => {
  const out = []
  const L = lists.map(l => [...l])
  while (L.some(l => l.length)) for (const l of L) if (l.length) out.push(l.shift())
  return out
}

// The work comes first: three rows of it drifting past at different speeds,
// each piece whole. One line underneath says what it is.
export default function Hero() {
  const root = useRef()
  const open = useLightbox()
  const rows = [
    { items: mix(sample(pieces('packaging'), 10), sample(pieces('branding'), 4)), speed: 22 },
    { items: mix(sample(pieces('social-media'), 12), sample(pieces('print'), 3)), speed: 30, reverse: true },
    { items: mix(sample(pieces('web-banners'), 6), sample(pieces('packaging').slice(1), 6)), speed: 18 },
  ]

  useGSAP(() => {
    if (reduced) return
    const tl = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' } })
      .from('.hero .drift', { xPercent: i => (i % 2 ? 18 : -18), autoAlpha: 0, duration: 2, stagger: 0.12 })
      .from('.hero .drift__item', { y: 40, scale: 0.92, autoAlpha: 0, duration: 1.4, stagger: { each: 0.02, from: 'random' } }, 0.1)
      .from('.hero__line .w > span', { y: '0.5em', autoAlpha: 0, filter: 'blur(10px)', duration: 1.2, stagger: 0.06 }, 0.6)
      .from('.hero__meta > *', { autoAlpha: 0, y: 10, duration: 1, stagger: 0.08 }, 0.9)
    return onReveal(() => tl.play())
  }, { scope: root })

  return (
    <section className="hero" ref={root}>
      <div className="hero__rows">
        {rows.map((r, i) => (
          <Drift key={i} items={r.items} speed={r.speed} reverse={r.reverse} onOpen={n => open(r.items, n, 'Selected work')} />
        ))}
      </div>
      <div className="hero__foot">
        <h1 className="hero__line"><Words text="Visuals that move people." /></h1>
        <div className="hero__meta mono">
          <span>{site.role}, {site.city}</span>
          <span>Design · Motion · Content</span>
        </div>
      </div>
    </section>
  )
}
