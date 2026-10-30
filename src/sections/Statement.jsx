import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { media, url } from '../lib/media.js'
import { reduced } from '../lib/smooth.js'

// A sentence read at the pace of the scroll. Words light up one by one and
// small windows open inside the line to show what each phrase means.
const LINE = [
  'I bring stories to life through',
  { pill: 'packaging/05' }, 'packaging people want to pick up,',
  { pill: 'social-media/12' }, 'posts that stop the scroll,',
  { pill: 'performance-marketing/05', video: true }, 'ads that earn the tap',
  'and', { pill: 'motion-graphics/06', video: true }, 'motion that says it in seconds.',
]

export default function Statement() {
  const root = useRef()

  useGSAP(() => {
    if (reduced) return
    const words = gsap.utils.toArray('.statement__text .sw')
    const pills = gsap.utils.toArray('.statement__pill')
    gsap.timeline({ scrollTrigger: { trigger: '.statement__text', start: 'top 75%', end: 'bottom 45%', scrub: 0.6 } })
      .fromTo(words, { opacity: 0.12 }, { opacity: 1, stagger: 0.1, ease: 'none' }, 0)
      .fromTo(pills, { width: 0 }, { width: '1.9em', stagger: { each: 0.1 * (words.length / pills.length) }, ease: 'power2.out', duration: 0.6 }, 0.2)
  }, { scope: root })

  return (
    <section className="statement" ref={root}>
      <p className="eyebrow mono">(01) Approach</p>
      <p className="statement__text">
        {LINE.flatMap((part, i) => {
          if (typeof part === 'string') {
            return part.split(' ').map((w, j) => <span className="sw" key={`${i}-${j}`}>{w} </span>)
          }
          const m = media(part.pill)
          if (!m) return []
          return [
            <span className="statement__pill" key={i} aria-hidden="true">
              {part.video
                ? <video src={url(m.loop)} poster={url(m.poster)} muted loop autoPlay playsInline />
                : <img src={url(m.sm)} alt="" />}
            </span>,
            ' ',
          ]
        })}
      </p>
    </section>
  )
}
