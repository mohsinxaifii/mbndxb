import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const reduced = typeof window !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
export const finePointer = typeof window !== 'undefined' && matchMedia('(pointer: fine)').matches

export let lenis = null

export function startSmooth() {
  if (reduced || lenis) return
  lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.9 })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add(t => lenis.raf(t * 1000))
  gsap.ticker.lagSmoothing(0)
}

export function scrollTo(target, opts = {}) {
  if (lenis) lenis.scrollTo(target, { duration: 1.4, ...opts })
  else if (typeof target === 'number') window.scrollTo(0, target)
  else document.querySelector(target)?.scrollIntoView()
}

export const jumpTop = () => (lenis ? lenis.scrollTo(0, { immediate: true, force: true }) : window.scrollTo(0, 0))

export function lockScroll(on) {
  if (lenis) on ? lenis.stop() : lenis.start()
  document.documentElement.classList.toggle('locked', on)
}

export const velocity = () => lenis?.velocity ?? 0

// Page tone: some sections turn the whole page dark while they're in view.
export function setTone(tone) {
  const root = document.documentElement
  // Colour transitions only switch on once the page has toned at least once,
  // so the hand-off from the dark intro is instant.
  root.classList.add('toned')
  root.dataset.tone = tone
}

export function toneTrigger(el, tone = 'dark') {
  return ScrollTrigger.create({
    trigger: el,
    start: 'top 55%',
    end: 'bottom 45%',
    onToggle: self => setTone(self.isActive ? tone : 'light'),
  })
}
