import { Fragment } from 'react'

// Text broken into masked lines of words or letters so GSAP can lift them in.
// Targets: .w > span for words, .ch for letters.

export function Words({ text, className = '' }) {
  // The space sits outside the masked span, or inline-block would swallow it.
  return text.split(' ').map((w, i, all) => (
    <Fragment key={i}>
      <span className={`w ${className}`}><span>{w}</span></span>
      {i < all.length - 1 ? ' ' : ''}
    </Fragment>
  ))
}

export function Letters({ text, className = '' }) {
  return (
    <span className={`letters ${className}`} aria-label={text}>
      {[...text].map((c, i) => (
        <span className="ch" key={i} aria-hidden="true">{c === ' ' ? ' ' : c}</span>
      ))}
    </span>
  )
}
