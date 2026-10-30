import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { site } from '../data/site.js'
import { projects } from '../data/projects.js'
import { media, url } from '../lib/media.js'
import { onReveal } from '../lib/reveal.js'
import { finePointer, reduced, scrollTo } from '../lib/smooth.js'
import { Words } from '../components/Split.jsx'
import Flag from '../components/Flag.jsx'

// The illustrated studio scene fills the section. It is pinned by its top
// edge, so the head is never cut: only the desk or the empty sides trim away.
// He is thinking, so the disciplines drift up from his head like passing
// thoughts; steam curls off the mug; warm late-afternoon light breathes behind
// him. The overlays live in the picture's own coordinates.

// Where the scene is pinned horizontally (0 = left edge, 1 = right edge).
const FOCUS_X = 0.72
// On phones: a 4:5 portrait crop around the face (in picture pixels).
const PORTRAIT = { x: 640, y: 150, w: 580, h: 725 }
const phone = () => matchMedia('(max-width: 900px)').matches
const DUST = Array.from({ length: 22 }, (_, i) => ({
  left: 30 + ((i * 37) % 66),
  top: 8 + ((i * 53) % 70),
  size: 2 + (i % 3),
}))

export default function Hero() {
  const root = useRef()
  const thoughts = useRef()
  const scene = media('site/hero')

  useGSAP(() => {
    if (reduced) return
    const tl = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' } })
      .fromTo('.hero__canvas', { scale: 1.08, filter: 'blur(16px)', autoAlpha: 0 }, { scale: 1, filter: 'blur(0px)', autoAlpha: 1, duration: 2.2, ease: 'power3.out' })
      .from('.hero__glow', { autoAlpha: 0, duration: 2 }, 0.6)
      .from('.hero__bar > *', { y: 12, autoAlpha: 0, duration: 1, stagger: 0.08 }, 0.4)
      .from('.hero__head .w > span', { y: '0.35em', autoAlpha: 0, filter: 'blur(10px)', duration: 1.4, stagger: 0.05 }, 0.6)
      .from('.hero__intro, .hero__facts li, .hero__cta > *', { y: 16, autoAlpha: 0, duration: 1, stagger: 0.05 }, 1.1)
    const off = onReveal(() => tl.play())

    gsap.to('.hero__glow', { opacity: 0.5, scale: 1.08, duration: 4.5, ease: 'sine.inOut', yoyo: true, repeat: -1 })
    gsap.utils.toArray('.hero__dust i').forEach(d => {
      gsap.fromTo(d, { y: 0, autoAlpha: 0 }, {
        y: () => -gsap.utils.random(50, 140),
        x: () => gsap.utils.random(-24, 24),
        autoAlpha: () => gsap.utils.random(0.3, 0.8),
        duration: () => gsap.utils.random(5, 9),
        delay: () => gsap.utils.random(0, 6),
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      })
    })
    // Steam: each wisp rises, sways and thins out, out of step with the others.
    gsap.utils.toArray('.hero__steam path').forEach((p, i) => {
      gsap.fromTo(p, { y: 8, opacity: 0 }, {
        keyframes: [{ y: -4, opacity: 0.55, duration: 1.6 }, { y: -18, opacity: 0, duration: 1.8 }],
        x: i % 2 ? 3 : -3,
        ease: 'sine.inOut',
        repeat: -1,
        delay: i * 1.1,
      })
    })

    gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true } })
      .to('.hero__depth', { yPercent: 12, ease: 'none' }, 0)
      .to('.hero__copy', { yPercent: -18, autoAlpha: 0.2, ease: 'none' }, 0)
    return off
  }, { scope: root })

  // Thoughts: the disciplines rise from his head one after another and fade.
  useEffect(() => {
    if (reduced) return
    const box = thoughts.current
    let i = 0
    let timer
    const think = () => {
      if (document.hidden) return
      const p = projects[i++ % projects.length]
      const el = document.createElement('span')
      el.className = 'hero__thought mono'
      el.textContent = p.title
      box.appendChild(el)
      const side = i % 2 ? 1 : -1
      // Rise in proportion to the frame, so the labels fade before its top edge.
      const H = box.parentElement.offsetHeight
      gsap.timeline({ onComplete: () => el.remove() })
        .fromTo(el, { x: side * 10, y: 10, scale: 0.85, autoAlpha: 0, filter: 'blur(6px)' }, { x: side * 34, y: -H * 0.05, scale: 1, autoAlpha: 1, filter: 'blur(0px)', duration: 1.6, ease: 'power2.out' })
        .to(el, { x: side * 60, y: -H * 0.13, autoAlpha: 0, filter: 'blur(4px)', duration: 2.2, ease: 'power1.in' })
    }
    const start = setTimeout(() => {
      think()
      timer = setInterval(think, 2200)
    }, 3200)
    return () => {
      clearTimeout(start)
      clearInterval(timer)
      box.replaceChildren()
    }
  }, [])

  // Cover the section with the scene, like object-fit: cover, but pinned to
  // the top so the head is always in frame. Overlays scale with it.
  useEffect(() => {
    const bg = root.current.querySelector('.hero__bg')
    const canvas = root.current.querySelector('.hero__canvas')
    const fit = () => {
      const W = bg.clientWidth
      const H = bg.clientHeight
      if (phone()) {
        const k = W / PORTRAIT.w
        canvas.style.width = `${scene.w * k}px`
        canvas.style.height = `${scene.h * k}px`
        canvas.style.left = `${-PORTRAIT.x * k}px`
        canvas.style.top = `${-PORTRAIT.y * k}px`
        return
      }
      canvas.style.top = '0px'
      // A little extra where the pointer shifts the scene, so no edge ever shows.
      const k = Math.max(W / scene.w, H / scene.h) * (finePointer ? 1.04 : 1)
      const w = scene.w * k
      canvas.style.width = `${w}px`
      canvas.style.height = `${scene.h * k}px`
      canvas.style.left = `${(W - w) * FOCUS_X}px`
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(bg)
    return () => ro.disconnect()
  }, [scene.w, scene.h])

  // Depth: the scene and its light shift a little against the pointer.
  useEffect(() => {
    if (!finePointer || reduced) return
    const el = root.current
    const sx = gsap.quickTo(el.querySelector('.hero__depth'), 'x', { duration: 1.4, ease: 'power3' })
    const sy = gsap.quickTo(el.querySelector('.hero__depth'), 'y', { duration: 1.4, ease: 'power3' })
    const gx = gsap.quickTo(el.querySelector('.hero__glow'), 'x', { duration: 2, ease: 'power3' })
    const gy = gsap.quickTo(el.querySelector('.hero__glow'), 'y', { duration: 2, ease: 'power3' })
    const move = e => {
      const nx = e.clientX / innerWidth - 0.5
      const ny = e.clientY / innerHeight - 0.5
      sx(nx * -12)
      sy(ny * -8)
      gx(nx * 50)
      gy(ny * 30)
    }
    window.addEventListener('pointermove', move)
    return () => window.removeEventListener('pointermove', move)
  }, [])

  return (
    <section className="hero" ref={root}>
      <div className="hero__bg" aria-hidden="true">
        <div className="hero__depth">
          <div className="hero__canvas">
            <div className="hero__glow" />
            <img className="hero__scene" src={url(scene.src)} srcSet={`${url(scene.sm)} 720w, ${url(scene.src)} ${scene.w}w`} sizes="100vw" alt="" width={scene.w} height={scene.h} />
            <div className="hero__dust">{DUST.map((d, i) => <i key={i} style={{ left: `${d.left}%`, top: `${d.top}%`, width: d.size, height: d.size }} />)}</div>
            <svg className="hero__steam" viewBox="0 0 40 60">
              <path d="M14 58 C 8 46, 20 40, 14 28 S 18 10, 14 2" />
              <path d="M22 58 C 28 46, 16 38, 22 26 S 18 8, 22 0" />
              <path d="M30 58 C 26 48, 34 40, 30 30" />
            </svg>
            <div className="hero__thoughts" ref={thoughts} />
          </div>
        </div>
        <div className="hero__veil" />
      </div>

      <div className="hero__bar">
        <p className="hero__place">
          <Flag /> <span>Dubai, United Arab Emirates</span> <span className="ar" lang="ar">دبي</span>
        </p>
        <p className="mono hero__coords">25.2048° N, 55.2708° E</p>
      </div>

      <div className="hero__copy">
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
    </section>
  )
}
