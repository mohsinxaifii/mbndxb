// Lays a list of pieces into 12-column rows without ever cropping them.
// Consecutive pieces of the same shape are grouped, then dealt out in a
// rotating rhythm of row patterns so long runs don't turn into a flat grid.

export function shape(m) {
  const r = m.w / m.h
  if (r >= 2.2) return 'wide'
  if (r >= 1.25) return 'land'
  if (r >= 0.75) return 'square'
  return 'tall'
}

const PATTERNS = {
  wide: [[12]],
  land: [[6, 6], [12], [7, 5], [6, 6], [5, 7]],
  square: [[4, 4, 4], [3, 3, 3, 3], [7, 5], [4, 4, 4], [3, 3, 3, 3], [5, 7]],
  tall: [[3, 3, 3, 3]],
}

// For a remainder smaller than the next pattern.
function fallback(kind, n) {
  if (kind === 'wide') return [{ span: 12 }]
  if (kind === 'land') return n === 1 ? [{ span: 8, start: 3 }] : [{ span: 6 }, { span: 6 }]
  if (kind === 'tall') return Array.from({ length: n }, (_, i) => ({ span: 3, start: i === 0 ? 7 - n * 1.5 : undefined }))
  if (n === 1) return [{ span: 6, start: 4 }]
  if (n === 2) return [{ span: 6 }, { span: 6 }]
  return [{ span: 4 }, { span: 4 }, { span: 4 }]
}

export function rows(items) {
  const out = []
  const turn = {}
  let i = 0
  while (i < items.length) {
    const kind = shape(items[i])
    let j = i
    while (j < items.length && shape(items[j]) === kind) j++
    let group = items.slice(i, j)
    while (group.length) {
      const pats = PATTERNS[kind]
      turn[kind] = (turn[kind] ?? -1) + 1
      let pat = pats[turn[kind] % pats.length].map(span => ({ span }))
      if (group.length < pat.length) pat = fallback(kind, group.length)
      out.push({ kind, cells: pat.map((p, n) => ({ ...p, start: p.start && Math.round(p.start), m: group[n] })) })
      group = group.slice(pat.length)
    }
    i = j
  }
  return out
}
