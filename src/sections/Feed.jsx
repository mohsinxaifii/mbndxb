import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { bySlug } from '../data/projects.js'
import { pieces, sample, url } from '../lib/media.js'
import { reduced } from '../lib/smooth.js'
import { TLink } from '../lib/transition.jsx'
import { useLightbox } from '../components/Lightbox.jsx'

// Columns of square posts sliding at different speeds, like a feed seen from
// a distance. Each column runs the opposite way to its neighbours.

export default function Feed() {
  const root = useRef()
  const open = useLightbox()
  const posts = pieces('social-media').filter(m => {
    const r = m.w / m.h
    return r > 0.75 && r < 1.3
  })
  const picked = sample(posts, 32)
  const cols = [0, 1, 2, 3].map(c => picked.filter((_, i) => i % 4 === c))

  useGSAP(() => {
    if (reduced) return
    const speeds = [-18, 12, -26, 8]
    gsap.utils.toArray('.feed__col').forEach((col, i) => {
      gsap.fromTo(col, { yPercent: speeds[i] > 0 ? -speeds[i] : 0 }, {
        yPercent: speeds[i] > 0 ? 0 : speeds[i], ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
      })
    })
  }, { scope: root })

  return (
    <section className="feed" ref={root}>
      <div className="feed__head">
        <p className="eyebrow mono">(03) The feed</p>
        <h2 className="feed__title">Posts, banners <br />and mailers, <em className="thin">made for the scroll.</em></h2>
        <div className="feed__links mono">
          {['social-media', 'web-banners', 'emailers'].map(s => (
            <TLink key={s} to={`/work/${s}`} label={bySlug[s].title} data-cursor="Open">
              {bySlug[s].title} <span aria-hidden="true">→</span>
            </TLink>
          ))}
        </div>
      </div>
      <div className="feed__wall">
        {cols.map((col, c) => (
          <div className="feed__col" key={c}>
            {col.map(m => (
              <button key={m.key} className="feed__post" style={{ background: m.color }} onClick={() => open(picked, picked.indexOf(m), 'The feed')} data-cursor="View">
                <img src={url(m.sm)} alt="" width={m.w} height={m.h} loading="lazy" decoding="async" />
              </button>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}
