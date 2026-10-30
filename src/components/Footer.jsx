import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { site } from '../data/site.js'
import { reduced, scrollTo, toneTrigger } from '../lib/smooth.js'
import { fitText } from '../lib/fit.js'
import { Letters, Words } from './Split.jsx'
import Clock from './Clock.jsx'

export default function Footer() {
  const root = useRef()

  useGSAP(() => {
    const unfit = fitText(root.current.querySelector('.contact__big'))
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
    gsap.fromTo('.contact__big .ch', { yPercent: 100 }, {
      yPercent: 0, ease: 'none', stagger: 0.02,
      scrollTrigger: { trigger: '.contact__big', start: 'top bottom', end: 'bottom bottom', scrub: true },
    })
    return unfit
  }, { scope: root })

  return (
    <footer className="contact" id="contact" ref={root}>
      <p className="eyebrow mono">(Contact)</p>
      <h2 className="contact__title">
        <Words text="Let’s make something" /> <em className="thin"><Words text="that moves." /></em>
      </h2>

      <ul className="contact__links">
        {site.links.map(l => (
          <li key={l.label}>
            <a className="contact__row" href={l.href} target={l.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" data-cursor="Open">
              <span className="contact__label">{l.label}</span>
              <span className="contact__handle mono">{l.handle}</span>
              <span className="contact__arrow" aria-hidden="true">↗</span>
            </a>
          </li>
        ))}
      </ul>

      <div className="contact__base mono">
        <span>© {new Date().getFullYear()}</span>
        <Clock />
        <button onClick={() => scrollTo(0, { duration: 2 })}>Back to top ↑</button>
      </div>

      <a className="contact__big" href={`mailto:${site.email}`} data-cursor="Write">
        <Letters text={site.email} />
      </a>
    </footer>
  )
}
