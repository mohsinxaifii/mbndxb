import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { site } from '../data/site.js'
import { url } from '../lib/media.js'
import { finePointer, reduced } from '../lib/smooth.js'

// Experience, most recent first, beside a CV card that stays in view while the
// list scrolls. The card leans gently toward the pointer; downloading shows a
// short progress sweep and confirms.
export default function Resume() {
  const root = useRef()
  const card = useRef()
  const [state, setState] = useState('idle') // idle | saving | saved
  const timers = useRef([])
  const { cv } = site
  const file = url(cv.file)

  useGSAP(() => {
    if (reduced) return
    gsap.from('.cv__head > *', {
      y: 24, autoAlpha: 0, duration: 1, ease: 'expo.out', stagger: 0.08,
      scrollTrigger: { trigger: '.cv__head', start: 'top 80%' },
    })
    gsap.utils.toArray('.cv__role').forEach(el => {
      gsap.from(el, {
        y: 24, autoAlpha: 0, duration: 0.9, ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 85%' },
      })
    })
    gsap.fromTo('.cv__progress i', { scaleY: 0 }, {
      scaleY: 1, ease: 'none',
      scrollTrigger: { trigger: '.cv__list', start: 'top 70%', end: 'bottom 70%', scrub: true },
    })
    gsap.from(card.current, {
      y: 40, autoAlpha: 0, duration: 1.2, ease: 'expo.out',
      scrollTrigger: { trigger: card.current, start: 'top 85%' },
    })
  }, { scope: root })

  // A gentle 3D lean toward the pointer.
  useEffect(() => {
    if (!finePointer || reduced) return
    const el = card.current
    const rx = gsap.quickTo(el, 'rotationX', { duration: 0.8, ease: 'power3' })
    const ry = gsap.quickTo(el, 'rotationY', { duration: 0.8, ease: 'power3' })
    const move = e => {
      const r = el.getBoundingClientRect()
      ry(((e.clientX - r.left) / r.width - 0.5) * 8)
      rx(-((e.clientY - r.top) / r.height - 0.5) * 8)
    }
    const leave = () => { rx(0); ry(0) }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
    }
  }, [])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const download = () => {
    timers.current.forEach(clearTimeout)
    setState('saving')
    timers.current = [
      setTimeout(() => setState('saved'), 900),
      setTimeout(() => setState('idle'), 3400),
    ]
  }

  return (
    <section className="cv" id="cv" ref={root}>
      <header className="cv__head">
        <p className="eyebrow mono">(CV) Curriculum vitae</p>
        <h2 className="cv__title">Experience, <em className="thin">since 2015.</em></h2>
      </header>

      <div className="cv__grid">
        <ol className="cv__list">
          <span className="cv__progress" aria-hidden="true"><i /></span>
          {cv.roles.map(r => (
            <li className="cv__role" key={r.from + r.role}>
              <div className="cv__when mono">
                <span>{r.from} — {r.to}</span>
                {r.to === 'Present' && <span className="cv__now">Current</span>}
              </div>
              <div className="cv__what">
                <h3 className="cv__name">{r.role}</h3>
                <p className="cv__company">{r.company} <span>· {r.place}</span></p>
                <p className="cv__line">{r.line}</p>
              </div>
            </li>
          ))}
        </ol>

        <aside className="cv__aside">
          <div className="cv__card" ref={card}>
            <div className="cv__card-top mono">
              <span>Curriculum vitae</span>
              <span>PDF · 2 pages · {cv.size}</span>
            </div>
            <p className="cv__card-title">{cv.title}</p>
            <p className="cv__card-summary">{cv.summary}</p>

            <p className="mono cv__card-label">Software</p>
            <ul className="cv__tools">
              {cv.software.map(t => (
                <li key={t.code} title={t.name} style={{ '--bg': t.bg, '--fg': t.fg }}>
                  <b>{t.code}</b>
                  <span>{t.name}</span>
                </li>
              ))}
            </ul>

            <dl className="cv__details">
              {cv.details.map(d => (
                <div key={d.label}>
                  <dt className="mono">{d.label}</dt>
                  <dd>{d.value}</dd>
                </div>
              ))}
            </dl>

            <div className="cv__actions">
              <a
                className={`cv__download is-${state}`}
                href={file}
                download="Mobeen-Saifi-CV.pdf"
                onClick={download}
                data-cursor="Download"
              >
                <span className="cv__download-fill" aria-hidden="true" />
                <span className="cv__download-label" aria-live="polite">
                  {state === 'saving' ? 'Preparing…' : state === 'saved' ? 'Saved ✓' : 'Download CV ↓'}
                </span>
              </a>
              <a className="cv__open" href={file} target="_blank" rel="noreferrer" data-cursor="Open">Open ↗</a>
            </div>
          </div>
        </aside>
      </div>
    </section>
  )
}
