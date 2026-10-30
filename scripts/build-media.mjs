// Turns the originals in media-source/ into web-ready files under public/media/
// and writes src/data/media.json (sizes, colours, paths) for the app to read.
//
//   npm run media            only rebuilds what changed
//   npm run media -- --force rebuilds everything
//
// Images  -> <name>.webp (max 2000px wide) + <name>-sm.webp (720px wide)
// GIFs    -> animated webp at the same two sizes
// Videos  -> <name>.mp4 (h264, long side 1280, faststart)
//            <name>-loop.mp4 (first 6s, silent, long side 540) for hover/grid previews
//            <name>.webp poster

import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import sharp from 'sharp'
import ffmpeg from 'ffmpeg-static'

const ROOT = path.resolve(import.meta.dirname, '..')
const SRC = path.join(ROOT, 'media-source')
const OUT = path.join(ROOT, 'public/media')
const DATA = path.join(ROOT, 'src/data/media.json')
const FORCE = process.argv.includes('--force')

const IMG = /\.(jpe?g|png|webp|gif)$/i
const VID = /\.mp4$/i

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => {
    if (e.name.startsWith('_') || e.name === 'manifest.json') return []
    const p = path.join(dir, e.name)
    return e.isDirectory() ? walk(p) : [p]
  })
}

const fresh = (out, src) => !FORCE && fs.existsSync(out) && fs.statSync(out).mtimeMs >= fs.statSync(src).mtimeMs

const hex = ({ r, g, b }) => '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')

async function image(src, key) {
  const gif = /\.gif$/i.test(src)
  const base = path.join(OUT, key)
  fs.mkdirSync(path.dirname(base), { recursive: true })
  const meta = await sharp(src).metadata()
  const w = meta.width, h = meta.pageHeight || meta.height
  // Very tall pieces (emailers, leaflets) don't need 2000px of width.
  const maxW = h / w > 1.6 ? 1400 : 2000
  const opts = gif ? { animated: true } : {}

  if (!fresh(`${base}.webp`, src)) {
    await sharp(src, opts).resize({ width: Math.min(w, maxW), withoutEnlargement: true })
      .webp({ quality: 82, effort: 5 }).toFile(`${base}.webp`)
  }
  if (!fresh(`${base}-sm.webp`, src)) {
    await sharp(src, opts).resize({ width: Math.min(w, 720), withoutEnlargement: true })
      .webp({ quality: 76, effort: 5 }).toFile(`${base}-sm.webp`)
  }
  const { dominant } = await sharp(src).stats()
  return { kind: gif ? 'gif' : 'image', src: `media/${key}.webp`, sm: `media/${key}-sm.webp`, w, h, color: hex(dominant) }
}

function probe(src) {
  try { execFileSync(ffmpeg, ['-hide_banner', '-i', src], { stdio: 'pipe' }) } catch (e) {
    const s = String(e.stderr)
    const [, w, h] = s.match(/Video:.*?(\d{2,5})x(\d{2,5})/) || []
    const [, hh, mm, ss] = s.match(/Duration: (\d+):(\d+):([\d.]+)/) || []
    return { w: +w, h: +h, duration: Math.round((+hh * 3600 + +mm * 60 + +ss) * 10) / 10, audio: /Audio:/.test(s) }
  }
}

function ff(args) { execFileSync(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-y', ...args], { stdio: 'inherit' }) }

async function video(src, key) {
  const base = path.join(OUT, key)
  fs.mkdirSync(path.dirname(base), { recursive: true })
  const { w, h, duration, audio } = probe(src)
  const fit = side => (w >= h ? `scale='min(${side},iw)':-2` : `scale=-2:'min(${side},ih)'`)

  if (!fresh(`${base}.mp4`, src)) {
    ff(['-i', src, '-vf', fit(1280), '-c:v', 'libx264', '-preset', 'slow', '-crf', '25', '-pix_fmt', 'yuv420p',
      ...(audio ? ['-c:a', 'aac', '-b:a', '96k'] : ['-an']), '-movflags', '+faststart', `${base}.mp4`])
  }
  if (!fresh(`${base}-loop.mp4`, src)) {
    ff(['-i', src, '-t', '6', '-vf', fit(540), '-c:v', 'libx264', '-preset', 'slow', '-crf', '29', '-pix_fmt', 'yuv420p',
      '-an', '-movflags', '+faststart', `${base}-loop.mp4`])
  }
  if (!fresh(`${base}.webp`, src)) {
    const tmp = `${base}.poster.png`
    ff(['-ss', String(Math.min(1.5, duration / 3)), '-i', src, '-frames:v', '1', tmp])
    await sharp(tmp).resize({ width: Math.min(w, 900) }).webp({ quality: 78 }).toFile(`${base}.webp`)
    fs.rmSync(tmp)
  }
  const { dominant } = await sharp(`${base}.webp`).stats()
  return { kind: 'video', src: `media/${key}.mp4`, loop: `media/${key}-loop.mp4`, poster: `media/${key}.webp`, w, h, duration, audio, color: hex(dominant) }
}

const files = walk(SRC).sort()
const out = {}
let i = 0
for (const f of files) {
  const key = path.relative(SRC, f).replace(/\\/g, '/').replace(/\.[^.]+$/, '')
  process.stdout.write(`\r[${++i}/${files.length}] ${key.padEnd(48)}`)
  if (IMG.test(f)) out[key] = await image(f, key)
  else if (VID.test(f)) out[key] = await video(f, key)
}
fs.writeFileSync(DATA, JSON.stringify(out, null, 1))
console.log(`\nwrote ${Object.keys(out).length} entries to src/data/media.json`)
