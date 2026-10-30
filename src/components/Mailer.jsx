import { url } from '../lib/media.js'
import { useReveal } from './Plate.jsx'

// A tall emailer shown in a fixed window. Hovering scrolls it top to bottom,
// at a pace that depends on how long the mailer is.
export default function Mailer({ m, onOpen }) {
  const ref = useReveal()
  const travel = Math.max(0, m.h / m.w - 1.45)
  const shift = -Math.max(0, 1 - (1.45 * m.w) / m.h) * 100
  return (
    <figure
      ref={ref}
      className="mailer reveal"
      style={{ '--tint': m.color, '--shift': `${shift}%`, '--time': `${2 + travel * 2.4}s` }}
      onClick={onOpen}
      data-cursor="Read"
    >
      <img src={url(m.sm)} width={m.w} height={m.h} alt="" loading="lazy" decoding="async" />
    </figure>
  )
}
