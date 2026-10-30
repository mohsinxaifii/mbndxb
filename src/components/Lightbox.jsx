import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import gsap from 'gsap'
import { duration, isVideo, url } from '../lib/media.js'
import { lockScroll, reduced } from '../lib/smooth.js'

const Ctx = createContext(() => {})
export const useLightbox = () => useContext(Ctx)

export function LightboxProvider({ children }) {
  const [state, setState] = useState(null) // { items, index, title }
  const open = useCallback((items, index = 0, title = '') => setState({ items, index, title }), [])
  return (
    <Ctx.Provider value={open}>
      {children}
      {state && createPortal(<Lightbox {...state} onClose={() => setState(null)} />, document.body)}
    </Ctx.Provider>
  )
}

function Lightbox({ items, index: start, title, onClose }) {
  const [index, setIndex] = useState(start)
  const root = useRef()
  const stage = useRef()
  const touch = useRef(null)
  const m = items[index]
  const tall = m.h / m.w > 1.6
  const many = items.length > 1

  const step = useCallback(d => setIndex(i => (i + d + items.length) % items.length), [items.length])

  const close = useCallback(() => {
    if (reduced) return onClose()
    gsap.to(root.current, { autoAlpha: 0, duration: 0.35, ease: 'power2.in', onComplete: onClose })
  }, [onClose])

  useEffect(() => {
    lockScroll(true)
    if (!reduced) gsap.fromTo(root.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, ease: 'power2.out' })
    return () => lockScroll(false)
  }, [])

  useEffect(() => {
    const key = e => {
      if (e.key === 'Escape') close()
      else if (e.key === 'ArrowRight' && many) step(1)
      else if (e.key === 'ArrowLeft' && many) step(-1)
    }
    window.addEventListener('keydown', key)
    return () => window.removeEventListener('keydown', key)
  }, [close, step, many])

  useEffect(() => {
    if (reduced || !stage.current) return
    stage.current.scrollTop = 0
    gsap.fromTo(stage.current.firstElementChild, { autoAlpha: 0, y: 24, scale: 0.985 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.6, ease: 'expo.out' })
  }, [index])

  return (
    <div
      className="lightbox"
      ref={root}
      role="dialog"
      aria-modal="true"
      aria-label={title || 'Viewer'}
      onTouchStart={e => (touch.current = e.touches[0].clientX)}
      onTouchEnd={e => {
        if (touch.current == null || !many) return
        const dx = e.changedTouches[0].clientX - touch.current
        if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1)
        touch.current = null
      }}
    >
      <div className="lightbox__bar">
        <span className="mono">{title}</span>
        <span className="mono">{String(index + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}</span>
        <button className="mono lightbox__close" onClick={close} data-cursor="Close">Close</button>
      </div>

      <div className={`lightbox__stage${tall ? ' is-tall' : ''}`} ref={stage} data-lenis-prevent onClick={e => e.target === e.currentTarget && close()}>
        {isVideo(m) ? (
          <video key={m.key} src={url(m.src)} poster={url(m.poster)} controls autoPlay playsInline style={{ aspectRatio: `${m.w} / ${m.h}` }} />
        ) : (
          <img key={m.key} src={url(m.src)} alt="" width={m.w} height={m.h} style={{ background: m.color }} />
        )}
      </div>

      {many && (
        <>
          <button className="lightbox__nav is-prev" onClick={() => step(-1)} aria-label="Previous" data-cursor="Prev" />
          <button className="lightbox__nav is-next" onClick={() => step(1)} aria-label="Next" data-cursor="Next" />
        </>
      )}
      {isVideo(m) && <span className="lightbox__meta mono">{duration(m)}{m.audio ? ' · sound on' : ''}</span>}
    </div>
  )
}
