import { useEffect, useRef } from 'react'
import { duration, url } from '../lib/media.js'
import { useReveal } from './Plate.jsx'

// A silent preview loop that only plays while on screen. Opens the full film.
export default function VideoTile({ m, label, onOpen, className = '' }) {
  const [wrap, shown] = useReveal()
  const video = useRef()

  useEffect(() => {
    const v = video.current
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) v.play().catch(() => {})
      else v.pause()
    }, { threshold: 0.25 })
    io.observe(v)
    return () => io.disconnect()
  }, [])

  return (
    <figure
      ref={wrap}
      className={`plate plate--video reveal${shown ? ' is-in' : ''} ${className}`}
      style={{ '--ar': `${m.w} / ${m.h}`, '--tint': m.color }}
      onClick={onOpen}
      data-cursor="Play"
    >
      <video ref={video} src={url(m.loop)} poster={url(m.poster)} muted loop playsInline preload="none" />
      <figcaption className="plate__cap mono">
        <span>{label}</span>
        <span>{duration(m)}</span>
      </figcaption>
    </figure>
  )
}
