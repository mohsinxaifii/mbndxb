import { capabilities } from '../data/site.js'
import Marquee from '../components/Marquee.jsx'

export default function Capabilities() {
  const half = Math.ceil(capabilities.length / 2)
  return (
    <section className="brands" aria-label="What I do">
      <p className="eyebrow mono brands__eyebrow">(06) What I do</p>
      <Marquee items={capabilities.slice(0, half)} className="marquee--heavy" />
      <Marquee items={capabilities.slice(half)} className="marquee--thin" reverse speed={30} />
    </section>
  )
}
