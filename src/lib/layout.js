// Lays a mixed list of pieces into 12-column rows without ever cropping them.
// Each row takes its shape from the next piece in line, then fills up with
// the next pieces of that same shape, so the mix of the list survives while
// every row still holds pieces that sit well together.

export function shape(m) {
  const r = m.w / m.h
  if (r >= 2.2) return 'wide'
  if (r >= 1.25) return 'land'
  if (r >= 0.75) return 'square'
  return 'tall'
}

const PATTERNS = {
  wide: [[12]],
  land: [[6, 6], [4, 4, 4], [7, 5], [4, 4, 4], [5, 7]],
  square: [[4, 4, 4], [3, 3, 3, 3], [7, 5], [4, 4, 4], [3, 3, 3, 3], [5, 7]],
  tall: [[3, 3, 3, 3]],
}

// For a remainder smaller than the next pattern.
function fallback(kind, n) {
  if (kind === 'wide') return [{ span: 12 }]
  if (kind === 'land') return n === 1 ? [{ span: 8, start: 3 }] : [{ span: 6 }, { span: 6 }]
  if (kind === 'tall') return Array.from({ length: n }, (_, i) => ({ span: 3, start: i === 0 ? Math.round(7 - n * 1.5) : undefined }))
  if (n === 1) return [{ span: 6, start: 4 }]
  if (n === 2) return [{ span: 6 }, { span: 6 }]
  return [{ span: 4 }, { span: 4 }, { span: 4 }]
}

export function rows(items) {
  const left = [...items]
  const turn = {}
  const out = []
  while (left.length) {
    const kind = shape(left[0])
    turn[kind] = (turn[kind] ?? -1) + 1
    const pats = PATTERNS[kind]
    let pat = pats[turn[kind] % pats.length].map(span => ({ span }))
    const pick = left.filter(m => shape(m) === kind).slice(0, pat.length)
    if (pick.length < pat.length) pat = fallback(kind, pick.length)
    pick.forEach(m => left.splice(left.indexOf(m), 1))
    out.push({ kind, cells: pat.map((p, i) => ({ ...p, m: pick[i] })) })
  }
  return out
}
