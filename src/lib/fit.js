// Sizes a single line of type so it exactly fills its container's width.
// The element's first child is measured while .is-measuring pins any
// animated width axis to its resting value.
export function fitText(el) {
  const run = () => {
    el.classList.add('is-measuring')
    el.style.fontSize = '100px'
    const w = el.firstElementChild.getBoundingClientRect().width
    if (w) el.style.fontSize = `${(100 * el.clientWidth) / w}px`
    el.classList.remove('is-measuring')
  }
  run()
  document.fonts?.ready.then(run)
  window.addEventListener('resize', run)
  return () => window.removeEventListener('resize', run)
}
