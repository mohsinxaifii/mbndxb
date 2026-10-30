import data from '../data/media.json'

const BASE = import.meta.env.BASE_URL

export const url = p => (p ? BASE + p : undefined)

export function media(key) {
  const m = data[key]
  if (!m) {
    console.warn(`media: no entry for "${key}"`)
    return null
  }
  return { key, ...m }
}

// Every piece in a category, in filename order.
export function pieces(slug) {
  return Object.keys(data).filter(k => k.startsWith(`${slug}/`)).sort().map(media)
}

// Picks evenly through a list so a long one can be sampled.
export function sample(list, n) {
  if (list.length <= n) return list
  const step = list.length / n
  return Array.from({ length: n }, (_, i) => list[Math.floor(i * step)])
}

export const isVideo = m => m?.kind === 'video'

export function duration(m) {
  const s = Math.round(m.duration || 0)
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}
