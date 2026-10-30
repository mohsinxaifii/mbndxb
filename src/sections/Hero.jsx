import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { site } from '../data/site.js'
import { media } from '../lib/media.js'
import { onReveal } from '../lib/reveal.js'
import { reduced, scrollTo } from '../lib/smooth.js'
import { Words } from '../components/Split.jsx'
import Flag from '../components/Flag.jsx'
import Halftone from '../components/Halftone.jsx'

// Statement on the left; the portrait on the right, drawn as a halftone.
export default function Hero() {
  const root = useRef()
  const portrait = media('site/portrait')

  useGSAP(() => {
    if (reduced) return
    const tl = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' } })
      .from('.hero__bar > *', { y: 12, autoAlpha: 0, duration: 1, stagger: 0.08 })
      .from('.hero__head .w > span', { y: '0.3em', autoAlpha: 0, filter: 'blur(10px)', duration: 1.4, stagger: 0.05 }, 0.1)
      .from('.hero__intro, .hero__facts li, .hero__cta > *', { y: 14, autoAlpha: 0, duration: 1, stagger: 0.05 }, 0.6)
    return onReveal(() => tl.play())
  }, { scope: root })

  return (
    <section className="hero" ref={root}>
      <div className="hero__bar">
        <p className="hero__place">
          <Flag /> <span>Dubai, United Arab Emirates</span> <span className="ar" lang="ar">دبي</span>
        </p>
        <p className="mono hero__coords">25.2048° N, 55.2708° E</p>
      </div>

      <div className="hero__main">
        <div className="hero__text">
          <h1 className="hero__head"><Words text={site.headline} /></h1>
          <p className="hero__intro">{site.intro}</p>
          <ul className="hero__facts mono">
            {site.facts.map(f => <li key={f}>{f}</li>)}
          </ul>
          <div className="hero__cta">
            <button className="pill pill--solid" onClick={() => scrollTo('#work')} data-cursor="Scroll">See the work ↓</button>
            <button className="pill" onClick={() => scrollTo('#contact')} data-cursor="Contact">Get in touch</button>
          </div>
        </div>
        {portrait && <Halftone m={portrait} className="hero__portrait" />}
      </div>
    </section>
  )
}
