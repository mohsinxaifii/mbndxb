import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { media, url } from '../lib/media.js'
import { release } from '../lib/reveal.js'
import { site } from '../data/site.js'

// First visit only: a quick riffle through the work, like flicking a stack of
// prints, then the last print opens to fill the screen and lifts away.
const RIFFLE = [
  'packaging/07', 'social-media/08', 'branding/11', 'packaging/04', 'web-banners/06', 'social-media/02',
  'packaging/05', 'branding/09', 'social-media/12', 'print/01', 'packaging/10', 'social-media/20',
  'emailers/09', 'packaging/01',
]

export default function Loader({ onDone }) {
  const root = useRef()
  const frame = useRef()
  const count = useRef()
  const picks = RIFFLE.map(media).filter(Boolean)
  // The last print ends up full screen, so it loads at full size.
  const srcOf = (m, i) => url(i === picks.length - 1 ? m.src : m.sm)

  useEffect(() => {
    let tl
    let alive = true
    const loads = picks.map((m, n) => new Promise(r => {
      const i = new Image()
      i.onload = i.onerror = r
      i.src = srcOf(m, n)
    }))
    Promise.race([Promise.all(loads), new Promise(r => setTimeout(r, 3000))]).then(() => {
      if (!alive) return
      const imgs = frame.current.querySelectorAll('img')
      const state = { p: 0 }
      let shown = -1
      const show = i => {
        if (i === shown) return
        imgs[shown]?.classList.remove('is-on')
        imgs[i].classList.add('is-on')
        shown = i
      }
      show(0)
      tl = gsap.timeline({ onComplete: finish })
        .fromTo('.loader__meta > *', { yPercent: 110 }, { yPercent: 0, duration: 0.9, ease: 'expo.out', stagger: 0.05 })
        .fromTo(frame.current, { clipPath: 'inset(50% 50% 50% 50%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1, ease: 'expo.inOut' }, 0)
        .to(state, {
          p: 1,
          duration: 2.1,
          ease: 'power1.inOut',
          onUpdate: () => {
            count.current.textContent = String(Math.round(state.p * 100)).padStart(3, '0')
            show(Math.min(imgs.length - 1, Math.floor(state.p * imgs.length)))
          },
        }, 0.3)
        .to('.loader__meta > *', { yPercent: -110, duration: 0.6, ease: 'expo.in', stagger: 0.03 })
        .to(frame.current, { width: '100vw', height: '100svh', duration: 1.1, ease: 'expo.inOut' }, '-=0.3')
        .add(() => {
          document.documentElement.classList.remove('intro')
          release()
        }, '-=0.25')
        .to(root.current, { yPercent: -100, duration: 1, ease: 'expo.inOut' }, '-=0.15')
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
      <div className="loader__frame" ref={frame}>
        {picks.map((m, i) => <img key={m.key} src={srcOf(m, i)} alt="" style={{ background: m.color }} />)}
      </div>
      <div className="loader__meta loader__meta--foot">
        <span className="mono" ref={count}>000</span>
        <span className="mono">Design · Motion · Content</span>
      </div>
    </div>
  )
}
