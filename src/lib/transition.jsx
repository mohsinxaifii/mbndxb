import { createContext, useCallback, useContext, useRef } from 'react'
import { useHref, useLocation, useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { hold, release } from './reveal.js'
import { jumpTop, reduced, scrollTo, setTone } from './smooth.js'

const Ctx = createContext(() => {})

export function TransitionProvider({ children }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const curtain = useRef()
  const label = useRef()
  const busy = useRef(false)

  const go = useCallback((to, text = '') => {
    const [path, hash] = to.split('#')
    if (busy.current) return
    if (path === pathname) {
      scrollTo(hash ? `#${hash}` : 0)
      return
    }
    const land = () => {
      navigate(path)
      jumpTop()
      setTone('light')
    }
    const settle = () => {
      ScrollTrigger.refresh()
      if (hash) requestAnimationFrame(() => scrollTo(`#${hash}`, { immediate: true }))
    }
    if (reduced) {
      land()
      requestAnimationFrame(settle)
      return
    }
    busy.current = true
    hold()
    label.current.textContent = text
    gsap.timeline({ onComplete: () => (busy.current = false) })
      .set(curtain.current, { yPercent: 100, autoAlpha: 1 })
      .to(curtain.current, { yPercent: 0, duration: 0.75, ease: 'expo.inOut' })
      .fromTo(label.current, { yPercent: 110 }, { yPercent: 0, duration: 0.6, ease: 'expo.out' }, '-=0.3')
      .add(land)
      .add(settle, '+=0.25')
      .to(label.current, { yPercent: -110, duration: 0.45, ease: 'expo.in' }, '+=0.05')
      .add(release, '-=0.05')
      .to(curtain.current, { yPercent: -100, duration: 0.85, ease: 'expo.inOut' }, '-=0.1')
      .set(curtain.current, { autoAlpha: 0 })
  }, [navigate, pathname])

  return (
    <Ctx.Provider value={go}>
      {children}
      <div className="curtain" ref={curtain} aria-hidden="true">
        <div className="curtain__label"><span ref={label} /></div>
      </div>
    </Ctx.Provider>
  )
}

export const useGo = () => useContext(Ctx)

// A link that plays the curtain. Modified clicks fall through to the browser.
export function TLink({ to, label, children, onClick, ...rest }) {
  const go = useGo()
  const href = useHref(to)
  return (
    <a
      href={href}
      onClick={e => {
        onClick?.(e)
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button) return
        e.preventDefault()
        go(to, label)
      }}
      {...rest}
    >
      {children}
    </a>
  )
}
