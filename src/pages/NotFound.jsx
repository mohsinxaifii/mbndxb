import { TLink } from '../lib/transition.jsx'

export default function NotFound() {
  return (
    <main className="lost">
      <p className="mono">(404)</p>
      <h1>This page <em className="thin">moved on.</em></h1>
      <TLink to="/" label="Home" className="lost__link" data-cursor="Home">Back to the work →</TLink>
    </main>
  )
}
