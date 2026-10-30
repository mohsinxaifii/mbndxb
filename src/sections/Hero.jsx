import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { site } from '../data/site.js'
import { projects } from '../data/projects.js'
import { media, url } from '../lib/media.js'
import { onReveal } from '../lib/reveal.js'
import { reduced, scrollTo } from '../lib/smooth.js'
import { Letters, Words } from '../components/Split.jsx'

// "Visuals that move people", set large. A small window inside the second
// line flicks through the work, one type of work after another. The letters
// arrive narrow and open up, then squeeze back as you scroll on.
const WINDOW = [
  'packaging/01', 'social-media/08', 'branding/11', 'web-banners/06', 'packaging/05', 'social-media/12',
  'print/01', 'packaging/04', 'branding/09', 'social-media/02', 'packaging/10', 'emailers/09',
]

export default function Hero() {
  const root = useRef()
  const shots = WINDOW.map(media).filter(Boolean)
  const [on, setOn] = useState(0)

  useEffect(() => {
    if (reduced) return
    const id = setInterval(() => setOn(i => (i + 1) % shots.length), 1300)
    return () => clearInterval(id)
  }, [shots.length])

  useGSAP(() => {
    if (reduced) return
    const tl = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' } })
      .fromTo('.hero__type .ch', { yPercent: 110, '--wdth': 75 }, { yPercent: 0, '--wdth': 100, duration: 1.6, stagger: 0.035 })
      .from('.hero__window', { width: 0, duration: 1.4 }, 0.5)
      .from('.hero__top > *, .hero__foot > .mono', { autoAlpha: 0, y: 12, duration: 1, stagger: 0.06 }, 0.6)
      .from('.hero__intro .w > span', { yPercent: 110, duration: 1, stagger: 0.012 }, 0.7)
    const off = onReveal(() => tl.play())

    gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true } })
      .to('.hero__type .ch', { '--wdth': 75, stagger: { each: 0.01, from: 'end' }, ease: 'none' }, 0)
      .to('.hero__line--1', { xPercent: -6, ease: 'none' }, 0)
      .to('.hero__line--3', { xPercent: 6, ease: 'none' }, 0)
    return off
  }, { scope: root })

  return (
    <section className="hero" ref={root}>
      <div className="hero__top mono">
        <span>({site.role}, {site.city})</span>
        <span className="hero__disc">Design · Motion · Content</span>
      </div>

      <h1 className="hero__type" aria-label="Visuals that move people.">
        <span className="hero__line hero__line--1" aria-hidden="true"><Letters text="Visuals" /></span>
        <span className="hero__line hero__line--2" aria-hidden="true">
          <button className="hero__window" onClick={() => scrollTo('#work')} data-cursor="The work" tabIndex={-1}>
            {shots.map((m, i) => (
              <img key={m.key} src={url(m.sm)} alt="" className={i === on ? 'is-on' : ''} />
            ))}
          </button>
          <Letters text="that move" />
        </span>
        <span className="hero__line hero__line--3" aria-hidden="true"><Letters text="people." /></span>
      </h1>

      <div className="hero__foot">
        <p className="hero__intro"><Words text={site.intro} /></p>
        <span className="mono hero__types">{projects.map(p => p.title).join(' · ')}</span>
        <span className="mono hero__scroll">Scroll <i aria-hidden="true" /></span>
      </div>
    </section>
  )
}
