import { useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { bySlug, projects } from '../data/projects.js'
import { site } from '../data/site.js'
import { isVideo, media, pieces, url } from '../lib/media.js'
import { rows } from '../lib/layout.js'
import { onReveal } from '../lib/reveal.js'
import { reduced } from '../lib/smooth.js'
import { TLink } from '../lib/transition.jsx'
import { useLightbox } from '../components/Lightbox.jsx'
import { Words } from '../components/Split.jsx'
import Plate from '../components/Plate.jsx'
import VideoTile from '../components/VideoTile.jsx'
import Footer from '../components/Footer.jsx'
import NotFound from './NotFound.jsx'

export default function Project() {
  const { slug } = useParams()
  const p = bySlug[slug]
  if (!p) return <NotFound />
  return <ProjectView key={slug} p={p} />
}

function ProjectView({ p }) {
  const root = useRef()
  const open = useLightbox()
  const all = pieces(p.slug)
  const n = projects.indexOf(p)
  const next = projects[(n + 1) % projects.length]
  const nextCover = media(next.cover)
  const openAt = m => open(all, all.indexOf(m), p.title)

  useEffect(() => {
    document.title = `${p.title} — ${site.name}`
  }, [p])

  useGSAP(() => {
    if (reduced) return
    const tl = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' } })
      .from('.phead .w > span', { y: '0.4em', autoAlpha: 0, filter: 'blur(10px)', duration: 1.2, stagger: 0.04 })
      .from('.phead__meta > *, .phead__top > *', { autoAlpha: 0, y: 14, duration: 0.9, stagger: 0.05 }, 0.3)
    const off = onReveal(() => tl.play())

    gsap.from('.pnext__title .w > span', {
      y: '0.4em', autoAlpha: 0, filter: 'blur(10px)', duration: 1.2, ease: 'expo.out', stagger: 0.06,
      scrollTrigger: { trigger: '.pnext', start: 'top 80%' },
    })
    return off
  }, { scope: root })

  return (
    <main className="project" ref={root} style={{ '--tone': p.tone }}>
      <header className="phead">
        <div className="phead__top mono">
          <TLink to="/#work" label="The work" className="phead__back" data-cursor="Index">← The work</TLink>
          <span>{String(n + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}</span>
        </div>
        <h1 className="phead__title"><Words text={p.title} /></h1>
        <div className="phead__meta">
          <p className="phead__intro">{p.intro}</p>
          <p className="mono">{p.tags.join(' · ')}</p>
        </div>
      </header>

      <section className="gallery">
        <Gallery items={all} title={p.title} onOpen={openAt} />
      </section>

      <TLink to={`/work/${next.slug}`} label={next.title} className="pnext" data-cursor="Next">
        <span className="mono">Next — {String(projects.indexOf(next) + 1).padStart(2, '0')}</span>
        <span className="pnext__title"><Words text={next.title} /></span>
        <img className="pnext__peek" src={url(nextCover.poster ?? nextCover.sm)} alt="" loading="lazy" style={{ aspectRatio: `${nextCover.w} / ${nextCover.h}` }} />
      </TLink>

      <Footer />
    </main>
  )
}

function Gallery({ items, title, onOpen }) {
  // Films come in every shape (9:16, 1:1, 16:9), so they sit in rows of equal
  // height instead of the 12-column rhythm.
  if (items.every(isVideo)) {
    return (
      <div className="justify">
        {items.map(m => (
          <div key={m.key} style={{ '--r': m.w / m.h }}>
            <VideoTile m={m} label={title} onOpen={() => onOpen(m)} />
          </div>
        ))}
        <i aria-hidden="true" />
      </div>
    )
  }
  return rows(items).map((row, r) => (
    <div className={`grow grow--${row.kind}`} key={r}>
      {row.cells.map(({ m, span, start }) => (
        <div className="grow__cell" key={m.key} style={{ '--span': span, '--start': start ?? 'auto' }}>
          <Plate m={m} alt={title} sizes={`(max-width: 800px) ${span <= 4 ? 50 : 100}vw, ${Math.round((span / 12) * 95)}vw`} onOpen={() => onOpen(m)} />
        </div>
      ))}
    </div>
  ))
}
