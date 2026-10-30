// Pages want to play their entrance once the screen is actually visible:
// after the intro on first load, or as the curtain lifts after navigation.
// Whoever covers the screen calls hold(); release() plays everything queued.

let pending = typeof document !== 'undefined' && document.documentElement.classList.contains('intro')
let queue = []

export function hold() {
  pending = true
}

export function release() {
  pending = false
  const q = queue
  queue = []
  q.forEach(fn => fn())
}

export function onReveal(fn) {
  if (!pending) {
    fn()
    return () => {}
  }
  queue.push(fn)
  return () => { queue = queue.filter(f => f !== fn) }
}
