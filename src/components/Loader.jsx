import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { media, url } from '../lib/media.js'
import { release } from '../lib/reveal.js'
import { site } from '../data/site.js'

// First visit only: prints land one by one on a loose pile, each whole and
// at its own angle, then the pile scatters and the screen lifts away.
const PILE = [
  'packaging/07', 'social-media/08', 'branding/11', 'packaging/04', 'social-media/02',
  'packaging/05', 'branding/09', 'social-media/12', 'print/01', 'packaging/10', 'packaging/01',
]

export default function Loader({ onDone }) {
  const root = useRef()
  const count = useRef()
  const picks = PILE.map(media).filter(Boolean)

  useEffect(() => {
    let tl
    let alive = true
    const loads = picks.map(m => new Promise(r => {
      const i = new Image()
      i.onload = i.onerror = r
      i.src = url(m.sm)
    }))
    Promise.race([Promise.all(loads), new Promise(r => setTimeout(r, 3000))]).then(() => {
      if (!alive) return
      const prints = root.current.querySelectorAll('.loader__print')
      const state = { p: 0 }
      tl = gsap.timeline({ onComplete: finish })
        .from('.loader__meta > *', { autoAlpha: 0, y: 10, duration: 0.8, ease: 'expo.out', stagger: 0.05 })
        .from(prints, {
          y: () => gsap.utils.random(-260, 260),
          x: () => gsap.utils.random(-380, 380),
          rotation: () => gsap.utils.random(-40, 40),
          scale: 1.25,
          autoAlpha: 0,
          duration: 0.9,
          ease: 'expo.out',
          stagger: 0.17,
        }, 0.2)
        .to(state, {
          p: 1,
          duration: 0.17 * prints.length + 0.6,
          ease: 'none',
          onUpdate: () => (count.current.textContent = String(Math.round(state.p * 100)).padStart(3, '0')),
        }, 0.2)
        .to(prints, {
          y: () => -window.innerHeight * gsap.utils.random(0.9, 1.3),
          x: () => gsap.utils.random(-200, 200),
          rotation: () => gsap.utils.random(-30, 30),
          duration: 0.9,
          ease: 'expo.in',
          stagger: { each: 0.03, from: 'end' },
        }, '+=0.2')
        .to('.loader__meta > *', { autoAlpha: 0, duration: 0.4 }, '<')
        .add(() => {
          document.documentElement.classList.remove('intro')
          release()
        }, '-=0.35')
        .to(root.current, { yPercent: -100, duration: 0.9, ease: 'expo.inOut' }, '-=0.3')
    })
    function finish() {
      try { sessionStorage.setItem('intro', '1') } catch (e) {}
      onDone()
    }
    return () => {
      alive = false
      tl?.kill()
    }
  }, [])

  return (
    <div className="loader" ref={root} aria-hidden="true">
      <div className="loader__meta">
        <span className="mono">{site.role}</span>
        <span className="mono">{site.city}</span>
      </div>
      <div className="loader__pile">
        {picks.map((m, i) => (
          <img
            key={m.key}
            className="loader__print"
            src={url(m.sm)}
            alt=""
            style={{ aspectRatio: `${m.w} / ${m.h}`, background: m.color, rotate: `${((i * 37) % 17) - 8}deg`, zIndex: i }}
          />
        ))}
      </div>
      <div className="loader__meta loader__meta--foot">
        <span className="mono" ref={count}>000</span>
        <span className="mono">Creative direction · since 2015</span>
      </div>
    </div>
  )
}
