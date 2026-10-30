import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { disciplines, projects } from '../data/projects.js'
import { count, media, url } from '../lib/media.js'
import { finePointer, reduced, velocity } from '../lib/smooth.js'
import { TLink } from '../lib/transition.jsx'

// Every project as a line of type. Hovering a line floats its cover beside
// the pointer; the preview leans with the speed of the movement.
export default function Index() {
  const root = useRef()
  const preview = useRef()
  const [filter, setFilter] = useState('All')
  const [active, setActive] = useState(null)
  const shown = projects.filter(p => filter === 'All' || p.disciplines.includes(filter))
  const tags = ['All', ...disciplines.filter(d => projects.some(p => p.disciplines.includes(d)))]

  useEffect(() => {
    const on = e => setFilter(e.detail)
    window.addEventListener('index:filter', on)
    return () => window.removeEventListener('index:filter', on)
  }, [])

  // Rows rise in when the list first scrolls into view, and again on every filter change.
  const first = useRef(true)
  useGSAP(() => {
    if (reduced) return
    gsap.fromTo('.index__row', { autoAlpha: 0, y: 24 }, {
      autoAlpha: 1, y: 0, duration: 0.8, ease: 'expo.out', stagger: 0.04,
      scrollTrigger: first.current ? { trigger: '.index__list', start: 'top 85%' } : undefined,
    })
    first.current = false
  }, { scope: root, dependencies: [filter] })

  useEffect(() => {
    if (!finePointer || reduced) return
    const el = preview.current
    const x = gsap.quickTo(el, 'x', { duration: 0.7, ease: 'power3' })
    const y = gsap.quickTo(el, 'y', { duration: 0.7, ease: 'power3' })
    const r = gsap.quickTo(el, 'rotation', { duration: 0.9, ease: 'power3' })
    let lastX = 0
    const move = e => {
      x(e.clientX)
      y(e.clientY)
      r(gsap.utils.clamp(-12, 12, (e.clientX - lastX) * 0.4 + velocity() * 0.05))
      lastX = e.clientX
    }
    window.addEventListener('pointermove', move)
    return () => window.removeEventListener('pointermove', move)
  }, [])

  return (
    <section className="index" id="work" ref={root}>
      <div className="index__head">
        <p className="eyebrow mono">(05) Index</p>
        <h2 className="index__title">All work</h2>
        <div className="index__filters" role="group" aria-label="Filter by discipline">
          {tags.map(t => {
            const n = t === 'All' ? projects.length : projects.filter(p => p.disciplines.includes(t)).length
            return (
              <button key={t} className={`chip mono${filter === t ? ' is-on' : ''}`} onClick={() => setFilter(t)} aria-pressed={filter === t}>
                {t}<sup>{n}</sup>
              </button>
            )
          })}
        </div>
      </div>

      <ol className={`index__list${active ? ' has-active' : ''}`} onPointerLeave={() => setActive(null)}>
        {shown.map(p => {
          const n = projects.indexOf(p) + 1
          return (
            <li key={p.slug} className={`index__row${active === p.slug ? ' is-active' : ''}`} onPointerEnter={() => setActive(p.slug)}>
              <TLink to={`/work/${p.slug}`} label={p.title} data-cursor="View">
                <span className="mono index__n">{String(n).padStart(2, '0')}</span>
                <span className="index__name">{p.title}</span>
                <span className="mono index__tags">{p.disciplines.join(', ')}</span>
                <span className="mono index__count">{String(count(p)).padStart(2, '0')}</span>
                <span className="index__arrow" aria-hidden="true">→</span>
              </TLink>
            </li>
          )
        })}
      </ol>

      {finePointer && !reduced && (
        <div className={`index__preview${active ? ' is-on' : ''}`} ref={preview} aria-hidden="true">
          {projects.map(p => {
            const m = media(p.cover)
            const src = m.kind === 'video' ? m.poster : m.sm
            return <img key={p.slug} src={url(src)} alt="" className={active === p.slug ? 'is-on' : ''} style={{ aspectRatio: `${m.w} / ${m.h}` }} loading="lazy" />
          })}
        </div>
      )}
    </section>
  )
}
