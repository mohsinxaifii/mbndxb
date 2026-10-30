import { brands } from '../data/site.js'
import Marquee from '../components/Marquee.jsx'

export default function Brands() {
  const half = Math.ceil(brands.length / 2)
  return (
    <section className="brands" aria-label="Brands in the work">
      <p className="eyebrow mono brands__eyebrow">(06) Brands in the work</p>
      <Marquee items={brands.slice(0, half)} className="marquee--sans" />
      <Marquee items={brands.slice(half)} className="marquee--serif" reverse speed={30} />
    </section>
  )
}
