import { site } from '../data/site.js'

// The wordmark: first name over surname, the second line stepped in, closed
// with a vermilion full stop.
export default function Logo({ className = '' }) {
  const [first, last] = site.name.split(' ')
  return (
    <span className={`logo ${className}`} role="img" aria-label={site.name}>
      <span className="logo__row" aria-hidden="true">{first}</span>
      <span className="logo__row logo__row--b" aria-hidden="true">{last}<i className="logo__dot" /></span>
    </span>
  )
}
