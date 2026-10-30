import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { site } from '../data/site.js'
import { reduced, scrollTo, toneTrigger } from '../lib/smooth.js'
import { Words } from './Split.jsx'
import Flag from './Flag.jsx'

export default function Footer() {
  const root = useRef()

  useGSAP(() => {
    toneTrigger(root.current)
    if (reduced) return
    gsap.from('.contact__title .w > span', {
      y: '0.4em', autoAlpha: 0, filter: 'blur(10px)', duration: 1.2, ease: 'expo.out', stagger: 0.06,
      scrollTrigger: { trigger: '.contact__title', start: 'top 80%' },
    })
    gsap.from('.contact__row', {
      y: 30, autoAlpha: 0, duration: 0.9, ease: 'expo.out', stagger: 0.08,
      scrollTrigger: { trigger: '.contact__links', start: 'top 85%' },
    })
  }, { scope: root })

  return (
    <footer className="contact" id="contact" ref={root}>
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
        <span className="contact__place"><Flag /> {site.city}, UAE</span>
        <button onClick={() => scrollTo(0, { duration: 2 })}>Back to top ↑</button>
      </div>
    </footer>
  )
}
