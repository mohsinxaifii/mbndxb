import { useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { site } from '../data/site.js'
import { reduced, scrollTo, toneTrigger } from '../lib/smooth.js'
import { Words } from './Split.jsx'
import Flag from './Flag.jsx'
import { Lattice, Skyline } from './Ornament.jsx'

export default function Footer() {
  const root = useRef()

  useGSAP(() => {
    toneTrigger(root.current)
    if (reduced) return
    gsap.from('.contact__hello, .contact__title .w > span', {
      y: '0.4em', autoAlpha: 0, filter: 'blur(10px)', duration: 1.2, ease: 'expo.out', stagger: 0.06,
      scrollTrigger: { trigger: '.contact__title', start: 'top 80%' },
    })
    gsap.from('.contact__row', {
      y: 30, autoAlpha: 0, duration: 0.9, ease: 'expo.out', stagger: 0.08,
      scrollTrigger: { trigger: '.contact__links', start: 'top 85%' },
    })
    // The skyline draws itself, landmark by landmark, as the page reaches its end.
    gsap.fromTo('.skyline path', { strokeDashoffset: 1 }, {
      strokeDashoffset: 0, ease: 'none', stagger: 0.08,
      scrollTrigger: { trigger: '.skyline', start: 'top 95%', end: 'bottom bottom', scrub: true },
    })
  }, { scope: root })

  return (
    <footer className="contact" id="contact" ref={root}>
      <Lattice className="contact__lattice" />
      <p className="contact__hello"><span className="ar" lang="ar">مرحبا</span> <span className="mono">Marhaba, hello</span></p>
      <h2 className="contact__title">
        <Words text="Hiring, or have a brief?" /> <em className="thin"><Words text="Let’s talk." /></em>
      </h2>
      <p className="contact__note">Available for creative director and senior creative roles in Dubai, and for project work with brands worldwide. Every message gets a reply within one working day.</p>

      <ul className="contact__links">
        {site.links.map(l => (
          <li key={l.label} className="contact__row">
            <a className="contact__open" href={l.href} target={l.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" data-cursor="Open">
              <span className="contact__label">{l.label}</span>
              <span className="contact__arrow" aria-hidden="true">↗</span>
            </a>
            <span className="contact__handle mono">{l.handle}</span>
            <CopyButton value={l.handle} what={l.label} />
          </li>
        ))}
      </ul>

      <Skyline className="contact__skyline" />

      <div className="contact__base mono">
        <span>© {new Date().getFullYear()}</span>
        <span className="contact__place"><Flag /> {site.city}, UAE</span>
        <button onClick={() => scrollTo(0, { duration: 2 })}>Back to top ↑</button>
      </div>
    </footer>
  )
}

// Copies a contact detail to the clipboard and says so for a moment.
function CopyButton({ value, what }) {
  const [done, setDone] = useState(false)
  const timer = useRef()
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
    } catch {
      // Older browsers, or a page not served over https.
      const t = Object.assign(document.createElement('textarea'), { value })
      document.body.append(t)
      t.select()
      document.execCommand('copy')
      t.remove()
    }
    setDone(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setDone(false), 1800)
  }
  return (
    <button className={`contact__copy mono${done ? ' is-done' : ''}`} onClick={copy} data-cursor="Copy" aria-label={`Copy ${what}`}>
      <svg viewBox="0 0 16 16" aria-hidden="true">
        {done
          ? <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          : <g fill="none" stroke="currentColor" strokeWidth="1.3"><rect x="5" y="5" width="8.5" height="8.5" rx="1.5" /><path d="M10.5 5V3.5A1.5 1.5 0 0 0 9 2H3.5A1.5 1.5 0 0 0 2 3.5V9a1.5 1.5 0 0 0 1.5 1.5H5" /></g>}
      </svg>
      <span aria-live="polite">{done ? 'Copied' : 'Copy'}</span>
    </button>
  )
}
