import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { bySlug, featured } from '../data/projects.js'
import { count, media, url } from '../lib/media.js'
import { reduced } from '../lib/smooth.js'
import { TLink } from '../lib/transition.jsx'

// Six projects on a horizontal track. On wide screens the section pins and
// vertical scroll drives the track sideways, with each image drifting inside
// its frame. On narrow screens it is a plain vertical list.
export default function Selected() {
  const root = useRef()
  const track = useRef()
  const list = featured.map(s => bySlug[s])

  useGSAP(() => {
    if (reduced) return
    const mm = gsap.matchMedia()
    mm.add('(min-width: 900px)', () => {
      const distance = () => track.current.scrollWidth - window.innerWidth
      const move = gsap.to(track.current, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      })
      gsap.to('.selected__progress i', {
        scaleX: 1, ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: () => `+=${distance()}`, scrub: true },
      })
      gsap.utils.toArray('.card__frame').forEach(card => {
        gsap.fromTo(card.firstElementChild, { xPercent: -8 }, {
          xPercent: 8, ease: 'none',
          scrollTrigger: { trigger: card, containerAnimation: move, start: 'left right', end: 'right left', scrub: true },
        })
      })
    })
    mm.add('(max-width: 899px)', () => {
      gsap.utils.toArray('.card').forEach(card => {
        gsap.from(card, { y: 60, autoAlpha: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: card, start: 'top 88%' } })
      })
    })
    return () => mm.revert()
  }, { scope: root })

  return (
    <section className="selected" ref={root}>
      <div className="selected__head">
        <p className="eyebrow mono">(02) Selected work</p>
        <h2 className="selected__title">
          A few that <em className="serif">mattered</em>
        </h2>
        <p className="selected__note mono">Scroll to move through · {String(list.length).padStart(2, '0')}</p>
      </div>
      <div className="selected__track" ref={track}>
        {list.map((p, i) => {
          const m = media(p.cover)
          return (
            <TLink key={p.slug} to={`/work/${p.slug}`} label={p.title} className="card" data-cursor="View" style={{ '--ar': `${m.w} / ${m.h}`, '--tone': p.tone }}>
              <div className="card__frame" style={{ background: m.color }}>
                <img className="card__img" src={url(m.src)} alt={p.title} width={m.w} height={m.h} loading="lazy" decoding="async" />
              </div>
              <div className="card__meta">
                <span className="mono">{String(i + 1).padStart(2, '0')}</span>
                <h3>{p.title}</h3>
                <span className="mono">{p.disciplines.join(' · ')}</span>
                <span className="mono card__count">{count(p)} pcs</span>
              </div>
            </TLink>
          )
        })}
        <TLink to="/#work" label="Index" className="card card--end" data-cursor="Index">
          <span className="mono">All projects</span>
          <span className="card__endword">Index <span aria-hidden="true">→</span></span>
        </TLink>
      </div>
      <div className="selected__progress" aria-hidden="true"><i /></div>
    </section>
  )
}
