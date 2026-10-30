import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { site } from '../data/site.js'
import { onReveal } from '../lib/reveal.js'
import { finePointer, reduced } from '../lib/smooth.js'
import { Words } from '../components/Split.jsx'
import Flag from '../components/Flag.jsx'
import Playground from '../components/Playground.jsx'
import Floater, { Badge } from '../components/Floater.jsx'

// "I shape how brands look, sell & move." Each of the three verbs acts itself
// out: the o's in "look" are eyes that follow the pointer, "sell" gets
// underlined by hand, and "move" sways. Below, the types of work as pills you
// can throw around.
export default function Hero() {
  const root = useRef()

  useGSAP(() => {
    if (reduced) return
    const tl = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' } })
      .from('.hero__place, .hero__since', { y: 14, autoAlpha: 0, duration: 1, stagger: 0.08 })
      .from('.hero__head .w > span, .hero__head .verb', { y: '0.35em', autoAlpha: 0, filter: 'blur(12px)', duration: 1.3, stagger: 0.07 }, 0.1)
      .fromTo('.sell__line path', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.2, ease: 'power2.inOut' }, 1)
      .from('.hero__intro', { y: 20, autoAlpha: 0, filter: 'blur(8px)', duration: 1.2 }, 0.7)
    const off = onReveal(() => tl.play())

    // "move": letters sway on their own, forever, gently.
    gsap.to('.move .ch', { y: '-0.08em', rotation: 4, duration: 0.9, ease: 'sine.inOut', yoyo: true, repeat: -1, stagger: { each: 0.12, from: 'start' } })
    return off
  }, { scope: root })

  // "look": pupils follow the pointer.
  useEffect(() => {
    if (!finePointer || reduced) return
    const pupils = [...root.current.querySelectorAll('.eye i')]
    const move = e => {
      for (const p of pupils) {
        const r = p.parentElement.getBoundingClientRect()
        const a = Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2))
        const d = r.width * 0.18
        p.style.transform = `translate(${Math.cos(a) * d}px, ${Math.sin(a) * d}px)`
      }
    }
    window.addEventListener('pointermove', move)
    return () => window.removeEventListener('pointermove', move)
  }, [])

  return (
    <section className="hero" ref={root}>
      <div className="hero__bar">
        <p className="hero__place"><Flag /> <span>Dubai, United Arab Emirates</span></p>
        <p className="hero__since mono">{site.role} · 12 years in</p>
      </div>

      <h1 className="hero__head" aria-label={site.headline}>
        <span aria-hidden="true">
          <Words text="I shape how brands" />{' '}
          <span className="verb look">l<span className="eye"><i /></span><span className="eye"><i /></span>k</span>,{' '}
          <span className="verb sell">sell<svg className="sell__line" viewBox="0 0 100 12" preserveAspectRatio="none"><path d="M2 8 C 25 2, 55 12, 98 4" pathLength="1" /></svg></span>{' '}
          <span className="verb">&amp;</span>{' '}
          <span className="verb move">{[...'move.'].map((c, i) => <span className="ch" key={i}>{c}</span>)}</span>
        </span>
      </h1>

      <p className="hero__intro">{site.intro}</p>

      <Playground />

      <Floater style={{ right: '9vw', top: '26vh' }} speed={0.6} tilt={8}>
        <Badge text="TWELVE YEARS · OF MAKING BRANDS MOVE · " center="12" />
      </Floater>
    </section>
  )
}
