import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { media, section, url } from '../lib/media.js'
import { projects } from '../data/projects.js'
import { reduced } from '../lib/smooth.js'
import { TLink } from '../lib/transition.jsx'

// A sentence read at the pace of the scroll. Words light up one by one and
// small windows open inside the line to show what each phrase means.
const LINE = [
  'I bring stories to life through',
  { pill: 'the-ayurveda-co/packaging-04' }, 'packaging people want to pick up,',
  { pill: 'social-creatives/posts-14' }, 'campaigns that stop the scroll',
  'and', { pill: 'motion/films-04', video: true }, 'motion that says it in seconds,',
  'with creativity, execution and a smart use of AI.',
]

const DISCIPLINES = [
  { title: 'Packaging', match: 'Packaging', note: 'Cartons, tubes, gift sets' },
  { title: 'Identity', match: 'Identity', note: 'Marks, stationery, systems' },
  { title: 'Campaigns', match: 'Campaigns', note: 'Social, banners, emailers' },
  { title: 'Motion', match: 'Motion', note: 'Films and performance ads' },
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

    gsap.from('.discipline', {
      y: 40, autoAlpha: 0, duration: 1, ease: 'expo.out', stagger: 0.08,
      scrollTrigger: { trigger: '.disciplines', start: 'top 85%' },
    })
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

      <ul className="disciplines">
        {DISCIPLINES.map((d, i) => {
          const list = projects.filter(p => p.disciplines.includes(d.match))
          const sample = section(list[0].slug, list[0].sections[0].key)[0]
          return (
            <li className="discipline" key={d.title}>
              <TLink
                to="/#work"
                label="Index"
                data-cursor="See all"
                onClick={() => window.dispatchEvent(new CustomEvent('index:filter', { detail: d.match }))}
              >
                <span className="mono">0{i + 1}</span>
                <h3>{d.title}</h3>
                <p>{d.note}</p>
                <span className="mono discipline__count">{list.length} projects</span>
                {sample && <img className="discipline__peek" src={url(sample.poster ?? sample.sm)} alt="" loading="lazy" />}
              </TLink>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
