import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { site } from '../data/site.js'
import { media, totalPieces, url } from '../lib/media.js'
import { projects } from '../data/projects.js'
import { onReveal } from '../lib/reveal.js'
import { finePointer, reduced } from '../lib/smooth.js'
import { Letters, Words } from '../components/Split.jsx'
import { fitText } from '../lib/fit.js'

// The name is set across the full width. It arrives narrow and widens into
// place, then squeezes back as you scroll on, using Archivo's width axis.
export default function Hero() {
  const root = useRef()
  const name = useRef()
  const portrait = media('site/portrait-01')

  useGSAP(() => {
    const unfit = fitText(name.current)

    if (!reduced) {
      const tl = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' } })
        .fromTo('.hero__name .ch', { yPercent: 105, '--wdth': 62 }, { yPercent: 0, '--wdth': 112, duration: 1.6, stagger: 0.045 })
        .from('.hero__portrait', { clipPath: 'inset(100% 0 0 0)', duration: 1.4 }, 0.25)
        .from('.hero__portrait img', { scale: 1.3, duration: 1.8 }, 0.25)
        .from('.hero .w > span', { yPercent: 110, duration: 1.1, stagger: 0.015 }, 0.4)
        .from('.hero__foot > *', { autoAlpha: 0, y: 12, duration: 1, stagger: 0.08 }, 0.8)
      const off = onReveal(() => tl.play())

      gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true } })
        .to('.hero__name .ch', { '--wdth': 62, yPercent: -12, stagger: { each: 0.02, from: 'center' }, ease: 'none' }, 0)
        .to('.hero__portrait', { yPercent: -30, ease: 'none' }, 0)
        .to('.hero__mid', { autoAlpha: 0, ease: 'none' }, 0)

      if (finePointer) {
        const img = root.current.querySelector('.hero__portrait img')
        const rx = gsap.quickTo(img, 'xPercent', { duration: 1.2, ease: 'power3' })
        const ry = gsap.quickTo(img, 'yPercent', { duration: 1.2, ease: 'power3' })
        const move = e => {
          rx((e.clientX / innerWidth - 0.5) * -6)
          ry((e.clientY / innerHeight - 0.5) * -6)
        }
        window.addEventListener('pointermove', move)
        return () => {
          off()
          unfit()
          window.removeEventListener('pointermove', move)
        }
      }
      return () => { off(); unfit() }
    }
    return unfit
  }, { scope: root })

  return (
    <section className="hero" ref={root}>
      <div className="hero__mid">
        <p className="hero__role">
          <span className="mono">(Role)</span>
          <Words text={`${site.role}.`} />
          <Words text="Design, motion & content." />
        </p>
        <figure className="hero__portrait">
          <img src={url(portrait.src)} width={portrait.w} height={portrait.h} alt={`${site.name}, portrait`} />
        </figure>
        <p className="hero__intro">
          <span className="mono">(About)</span>
          <Words text={site.intro} />
        </p>
      </div>

      <h1 className="hero__name" ref={name}>
        <Letters text={site.name.toUpperCase()} />
      </h1>

      <div className="hero__foot mono">
        <span>Packaging · Identity · Campaigns · Motion</span>
        <span>{totalPieces()} pieces, {projects.length} projects</span>
        <span className="hero__scroll">Scroll <i aria-hidden="true" /></span>
      </div>
    </section>
  )
}
