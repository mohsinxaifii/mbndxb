import data from '../data/media.json'
import { projects } from '../data/projects.js'

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

export function section(slug, key) {
  const prefix = `${slug}/${key}-`
  return Object.keys(data).filter(k => k.startsWith(prefix)).sort().map(media)
}

// Every piece in a project, in section order. Logos ("mark") are not pieces.
export function pieces(project) {
  return project.sections.flatMap(s => section(project.slug, s.key))
}

export const count = project => pieces(project).length

export const totalPieces = () => projects.reduce((n, p) => n + count(p), 0)

// Picks every nth item so a long list can be sampled evenly.
export function sample(list, n) {
  if (list.length <= n) return list
  const step = list.length / n
  return Array.from({ length: n }, (_, i) => list[Math.floor(i * step)])
}

export const ratio = m => m.w / m.h

export const isVideo = m => m?.kind === 'video'

export function duration(m) {
  const s = Math.round(m.duration || 0)
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}
