import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { projects } from '../data/projects.js'
import { media, url } from '../lib/media.js'
import { finePointer, reduced, velocity } from '../lib/smooth.js'
import { TLink } from '../lib/transition.jsx'

// Every type of work as a line of type. Hovering a line floats its cover
// beside the pointer; the preview leans with the speed of the movement.
export default function Index() {
  const root = useRef()
  const preview = useRef()
  const [active, setActive] = useState(null)

  useGSAP(() => {
    if (reduced) return
    gsap.from('.index__row', {
      autoAlpha: 0, y: 24, duration: 0.8, ease: 'expo.out', stagger: 0.05,
      scrollTrigger: { trigger: '.index__list', start: 'top 85%' },
    })
  }, { scope: root })

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
        <h2 className="index__title">The work</h2>
        <p className="index__note">Sorted by what it is, not who it was for. Every page mixes brands, seasons and formats.</p>
      </div>

      <ol className={`index__list${active ? ' has-active' : ''}`} onPointerLeave={() => setActive(null)}>
        {projects.map((p, i) => (
          <li key={p.slug} className={`index__row${active === p.slug ? ' is-active' : ''}`} onPointerEnter={() => setActive(p.slug)}>
            <TLink to={`/work/${p.slug}`} label={p.title} data-cursor="View">
              <span className="mono index__n">{String(i + 1).padStart(2, '0')}</span>
              <span className="index__name">{p.title}</span>
              <span className="mono index__tags">{p.tags.join(', ')}</span>
              <span className="index__arrow" aria-hidden="true">→</span>
            </TLink>
          </li>
        ))}
      </ol>

      {finePointer && !reduced && (
        <div className={`index__preview${active ? ' is-on' : ''}`} ref={preview} aria-hidden="true">
          {projects.map(p => {
            const m = media(p.cover)
            return <img key={p.slug} src={url(m.poster ?? m.sm)} alt="" className={active === p.slug ? 'is-on' : ''} style={{ aspectRatio: `${m.w} / ${m.h}` }} loading="lazy" />
          })}
        </div>
      )}
    </section>
  )
}
