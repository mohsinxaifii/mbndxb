import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { bySlug } from '../data/projects.js'
import { duration, media, pieces, url } from '../lib/media.js'
import { reduced, toneTrigger } from '../lib/smooth.js'
import { TLink } from '../lib/transition.jsx'
import { useLightbox } from '../components/Lightbox.jsx'
import VideoTile from '../components/VideoTile.jsx'

// The page goes dark. A film opens from a small window to the full screen
// while the title parts around it, then a strip of reels drifts past.
const FILM = 'motion-graphics/01'

export default function Motion() {
  const root = useRef()
  const open = useLightbox()
  const film = media(FILM)
  const reels = [...pieces('performance-marketing'), ...pieces('motion-graphics')].filter(m => m.h > m.w).slice(0, 9)

  useGSAP(() => {
    if (reduced) return toneTrigger(root.current)
    gsap.timeline({
      scrollTrigger: { trigger: '.motion__stage', start: 'top top', end: '+=140%', pin: true, scrub: 0.8 },
    })
      .fromTo('.motion__frame', { clipPath: 'inset(31% 33% 31% 33% round 10px)' }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'power2.inOut' }, 0)
      .fromTo('.motion__frame video', { scale: 1.35 }, { scale: 1, ease: 'power2.inOut' }, 0)
      .to('.motion__word--l', { xPercent: -70, autoAlpha: 0, ease: 'power2.in' }, 0)
      .to('.motion__word--r', { xPercent: 70, autoAlpha: 0, ease: 'power2.in' }, 0)
      .fromTo('.motion__play', { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.2 }, 0.75)

    // After the pin, so the tone covers the pinned distance too.
    toneTrigger(root.current)

    gsap.fromTo('.reels__track', { xPercent: 6 }, {
      xPercent: -38, ease: 'none',
      scrollTrigger: { trigger: '.reels', start: 'top bottom', end: 'bottom top', scrub: true },
    })
  }, { scope: root })

  return (
    <section className="motion" id="motion" ref={root}>
      <div className="motion__stage">
        <p className="eyebrow mono motion__eyebrow">(04) Motion</p>
        <h2 className="motion__title" aria-label="In motion">
          <span className="motion__word motion__word--l">In</span>
          <span className="motion__word motion__word--r thin">motion</span>
        </h2>
        <div className="motion__frame">
          <video src={url(film.src)} poster={url(film.poster)} muted loop autoPlay playsInline />
        </div>
        <button className="motion__play mono" onClick={() => open([film], 0, bySlug['motion-graphics'].title)} data-cursor="Play">
          <span className="motion__playdot" aria-hidden="true" /> Play with sound · {duration(film)}
        </button>
      </div>

      <div className="reels">
        <div className="reels__head">
          <p className="mono">Cut for feeds, stories and screens</p>
<div className="reels__links">
            {['performance-marketing', 'motion-graphics'].map(slug => (
              <TLink key={slug} to={`/work/${slug}`} label={bySlug[slug].title} className="reels__all" data-cursor="Open">
                {bySlug[slug].title} <span aria-hidden="true">→</span>
              </TLink>
            ))}
          </div>
        </div>
        <div className="reels__track">
          {reels.map((m, i) => (
            <VideoTile key={m.key} m={m} label={bySlug[m.key.split('/')[0]].title} onOpen={() => open(reels, i, 'In motion')} />
          ))}
        </div>
      </div>
    </section>
  )
}
