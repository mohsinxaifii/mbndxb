import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { TLink } from '../lib/transition.jsx'
import { lenis } from '../lib/smooth.js'
import { site } from '../data/site.js'
import Clock from './Clock.jsx'

const links = [
  { to: '/#work', label: 'Work' },
  { to: '/work/motion', label: 'Motion' },
  { to: '/#contact', label: 'Contact' },
]

// Slides away while reading down the page, returns on the way back up.
export default function Nav() {
  const el = useRef()
  const { pathname } = useLocation()

  useEffect(() => {
    let last = 0
    const onScroll = () => {
      const y = window.scrollY
      el.current.classList.toggle('is-away', y > 160 && y > last)
      last = y
    }
    const src = lenis ?? window
    src.on ? src.on('scroll', onScroll) : window.addEventListener('scroll', onScroll, { passive: true })
    return () => (src.off ? src.off('scroll', onScroll) : window.removeEventListener('scroll', onScroll))
  }, [])

  useEffect(() => el.current.classList.remove('is-away'), [pathname])

  return (
    <header className="nav" ref={el}>
      <TLink to="/" label={site.name} className="nav__mark" aria-label={`${site.name}, home`}>
        {site.mark}
      </TLink>
      <nav className="nav__links" aria-label="Main">
        {links.map((l, i) => (
          <TLink key={l.to} to={l.to} label={l.label} className="nav__link">
            <span className="mono">0{i + 1}</span>
            <span className="nav__word" data-text={l.label}>{l.label}</span>
          </TLink>
        ))}
      </nav>
      <Clock />
    </header>
  )
}
