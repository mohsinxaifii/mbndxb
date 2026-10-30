import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { site } from '../data/site.js'
import { reduced, scrollTo, toneTrigger } from '../lib/smooth.js'
import { Letters, Words } from './Split.jsx'
import Clock from './Clock.jsx'
import { fitText } from '../lib/fit.js'

export default function Footer() {
  const root = useRef()

  useGSAP(() => {
    const unfit = fitText(root.current.querySelector('.contact__mark'))
    toneTrigger(root.current)
    if (reduced) return unfit
    gsap.from('.contact__title .w > span', {
      yPercent: 110, duration: 1.1, ease: 'expo.out', stagger: 0.06,
      scrollTrigger: { trigger: '.contact__title', start: 'top 80%' },
    })
    gsap.from('.contact__row', {
      y: 30, autoAlpha: 0, duration: 0.9, ease: 'expo.out', stagger: 0.08,
      scrollTrigger: { trigger: '.contact__links', start: 'top 85%' },
    })
    gsap.fromTo('.contact__mark .ch', { yPercent: 100 }, {
      yPercent: 0, ease: 'none', stagger: 0.04,
      scrollTrigger: { trigger: '.contact__mark', start: 'top bottom', end: 'bottom bottom', scrub: true },
    })
    return unfit
  }, { scope: root })

  const links = site.email ? [{ label: 'Email', handle: site.email, href: `mailto:${site.email}` }, ...site.links] : site.links

  return (
    <footer className="contact" id="contact" ref={root}>
      <p className="eyebrow mono">(Contact)</p>
      <h2 className="contact__title">
        <Words text="Let’s make something" /> <em className="serif"><Words text="that moves." /></em>
      </h2>

      <ul className="contact__links">
        {links.map(l => (
          <li key={l.label}>
            <a className="contact__row" href={l.href} target="_blank" rel="noreferrer" data-cursor="Open">
              <span className="contact__label">{l.label}</span>
              <span className="contact__handle mono">{l.handle}</span>
              <span className="contact__arrow" aria-hidden="true">↗</span>
            </a>
          </li>
        ))}
      </ul>

      <div className="contact__base mono">
        <span>© {new Date().getFullYear()} {site.legal}</span>
        <Clock />
        <button onClick={() => scrollTo(0, { duration: 2 })}>Back to top ↑</button>
      </div>

      <div className="contact__mark" aria-hidden="true">
        <Letters text={site.mark} />
      </div>
    </footer>
  )
}
