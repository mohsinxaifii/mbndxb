import { useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { bySlug, projects } from '../data/projects.js'
import { site } from '../data/site.js'
import { count, isVideo, media, pieces, section, url } from '../lib/media.js'
import { rows } from '../lib/layout.js'
import { onReveal } from '../lib/reveal.js'
import { reduced, scrollTo } from '../lib/smooth.js'
import { TLink } from '../lib/transition.jsx'
import { useLightbox } from '../components/Lightbox.jsx'
import { Letters, Words } from '../components/Split.jsx'
import Plate from '../components/Plate.jsx'
import VideoTile from '../components/VideoTile.jsx'
import Mailer from '../components/Mailer.jsx'
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
  const all = pieces(p)
  const cover = media(p.cover)
  const mark = p.mark && media(p.mark)
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
      .from('.phead__title .ch', { yPercent: 110, '--wdth': 62, duration: 1.4, stagger: 0.03 })
      .from('.phead .w > span', { yPercent: 110, duration: 1, stagger: 0.012 }, 0.2)
      .from('.phead__meta > *', { autoAlpha: 0, y: 14, duration: 0.9, stagger: 0.05 }, 0.3)
      .from('.phero', { clipPath: 'inset(18% 8% 0% 8%)', duration: 1.6 }, 0.25)
    const off = onReveal(() => tl.play())

    gsap.fromTo('.phero__media', { scale: 1.12 }, {
      scale: 1, ease: 'none',
      scrollTrigger: { trigger: '.phero', start: 'top bottom', end: 'bottom top', scrub: true },
    })
    gsap.fromTo('.pnext__title .ch', { yPercent: 100 }, {
      yPercent: 0, stagger: 0.03, ease: 'none',
      scrollTrigger: { trigger: '.pnext', start: 'top 90%', end: 'top 40%', scrub: true },
    })
    return off
  }, { scope: root })

  return (
    <main className="project" ref={root} style={{ '--tone': p.tone }}>
      <header className="phead">
        <div className="phead__top mono">
          <TLink to="/#work" label="Index" className="phead__back" data-cursor="Index">← Index</TLink>
          <span>{String(n + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}</span>
        </div>
        <h1 className="phead__title"><Letters text={p.title} /></h1>
        <div className="phead__body">
          <p className="phead__intro"><Words text={p.intro} /></p>
          <dl className="phead__meta">
            <div><dt className="mono">Client</dt><dd>{p.client}</dd></div>
            <div><dt className="mono">Discipline</dt><dd>{p.disciplines.join(', ')}</dd></div>
            <div><dt className="mono">Pieces</dt><dd>{count(p)}</dd></div>
            {p.sections.length > 1 && (
              <div>
                <dt className="mono">Chapters</dt>
                <dd>{p.sections.map((s, i) => <a key={s.key} href={`#${s.key}`} className="phead__chapter" onClick={e => { e.preventDefault(); scrollTo(`#${s.key}`, { offset: -40 }) }}>{s.title}{i < p.sections.length - 1 ? ', ' : ''}</a>)}</dd>
              </div>
            )}
            {mark && <div className="phead__mark" style={{ background: mark.color }}><img src={url(mark.sm)} alt={`${p.title} logo`} /></div>}
          </dl>
        </div>
      </header>

      <figure className="phero" style={{ background: cover.color }}>
        {isVideo(cover)
          ? <video className="phero__media" src={url(cover.src)} poster={url(cover.poster)} muted loop autoPlay playsInline />
          : <img className="phero__media" src={url(cover.src)} alt={p.title} width={cover.w} height={cover.h} />}
      </figure>

      {p.sections.map((s, i) => {
        const items = section(p.slug, s.key)
        if (!items.length) return null
        return (
          <section className="chapter" id={s.key} key={s.key}>
            <aside className="chapter__side">
              <div className="chapter__sticky">
                <span className="mono">({String(i + 1).padStart(2, '0')})</span>
                <h2>{s.title}</h2>
                {s.note && <p>{s.note}</p>}
                <span className="mono chapter__count">{items.length} {items.length === 1 ? 'piece' : 'pieces'}</span>
              </div>
            </aside>
            <div className="chapter__body">
              <Gallery items={items} title={`${p.title}, ${s.title}`} onOpen={openAt} />
            </div>
          </section>
        )
      })}

      <TLink to={`/work/${next.slug}`} label={next.title} className="pnext" data-cursor="Next">
        <span className="mono">Next project — {String(projects.indexOf(next) + 1).padStart(2, '0')}</span>
        <span className="pnext__title"><Letters text={next.title} /></span>
        <span className="pnext__peek" style={{ background: nextCover.color }}>
          <img src={url(nextCover.poster ?? nextCover.sm)} alt="" loading="lazy" />
        </span>
      </TLink>

      <Footer />
    </main>
  )
}

function Gallery({ items, title, onOpen }) {
  // Films come in every shape (9:16, 1:1, 16:9), so they sit in rows of equal
  // height instead of the 12-column rhythm.
  if (items.every(isVideo)) {
    const label = title.split(', ').pop()
    return (
      <div className="justify">
        {items.map(m => (
          <div key={m.key} style={{ '--r': m.w / m.h }}>
            <VideoTile m={m} label={`${label} ${m.key.slice(-2)}`} onOpen={() => onOpen(m)} />
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
          {isVideo(m) ? (
            <VideoTile m={m} label={`${title.split(', ').pop()} ${m.key.slice(-2)}`} onOpen={() => onOpen(m)} />
          ) : row.kind === 'tall' && m.h / m.w > 1.6 ? (
            <Mailer m={m} onOpen={() => onOpen(m)} />
          ) : (
            <Plate m={m} alt={title} sizes={`(max-width: 800px) ${span <= 4 ? 50 : 100}vw, ${Math.round((span / 12) * 82)}vw`} onOpen={() => onOpen(m)} />
          )}
        </div>
      ))}
    </div>
  ))
}
