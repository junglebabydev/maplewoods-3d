// Draws plan.svg (the 2D floor plan with furniture) from the brochure trace.
// Uses the plan geometry from a Floorimate checkout: walls, doors and windows from its sample home,
// which is traced from the same brochure. Furniture matches furniture.js.
// Needs a Floorimate checkout next to this repo (../floorplay). From inside it:
//   npx tsx ../maplewoods-3d/source/make-plan.mts ../maplewoods-3d/plan.svg
import { writeFileSync } from 'node:fs'
import { sampleProject } from '../../floorplay/src/core/sample'
import { planDrawing, type Prim } from '../../floorplay/src/core/drawing'
import { footprint, labelPoint, pointInPolygon, polygonArea } from '../../floorplay/src/core/geometry'
import type { FurnitureItem, Vec2 } from '../../floorplay/src/core/types'

const out = process.argv[2] ?? 'plan.svg'
const p = sampleProject()

// Match furniture.js where it differs from the Floorimate sample, and add the two extra pieces.
const furniture: FurnitureItem[] = p.furniture.map((f) => {
  if (f.name === 'Glider chair') return { ...f, x: 12.62, y: 0.62 }
  if (f.name === 'Filing cabinet') return { ...f, x: 9.98 }
  return f
})
furniture.push(
  { id: 'ladder', kind: 'other', name: 'Wall ladder', w: 0.72, d: 0.12, h: 2.05, x: 2.52, y: 7.3, rotation: -90, color: '#d9bd90' },
  { id: 'board', kind: 'other', name: 'Whiteboard', w: 0.62, d: 0.55, h: 1.6, x: 7.35, y: 9.7, rotation: -100, color: '#f7f7f5' },
)

const FLOOR: Record<string, string> = { marble: '#f1ebe1', parquet: '#ead3b4', wood: '#ead3b4', tile: '#e6e6e2', deck: '#d9c6b0', plain: '#f2f0ea' }
const ACCENT = '#2f5d50'
const n = (v: number) => (Math.round(v * 1000) / 1000).toString()
const pts = (ps: Vec2[]) => ps.map(([x, y]) => `${n(x)},${n(y)}`).join(' ')
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;')

const d = planDrawing({ ...p, furniture: [] }, { furniture: false })
const pad = 0.9
const minX = d.min[0] - pad, minY = d.min[1] - pad - 0.4
const W = d.max[0] - d.min[0] + pad * 2, H = d.max[1] - d.min[1] + pad * 2 + 0.4

const svg: string[] = []
svg.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${n(minX)} ${n(minY)} ${n(W)} ${n(H)}" width="${Math.round(W * 100)}" height="${Math.round(H * 100)}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, Roboto, sans-serif">`)
svg.push(`<rect x="${n(minX)}" y="${n(minY)}" width="${n(W)}" height="${n(H)}" fill="#ffffff"/>`)

// Rooms, filled by floor finish
svg.push('<g id="rooms">')
for (const r of p.rooms) svg.push(`<polygon points="${pts(r.polygon)}" fill="${FLOOR[r.floor] ?? FLOOR.plain}" stroke="#ddd6ca" stroke-width="0.02"/>`)
svg.push('</g>')

// Walls, windows, doors
const prim = (q: Prim) => {
  if (q.t === 'poly') {
    const style = q.layer === 'walls' ? 'fill="#2b2b2b"' : 'fill="#ffffff" stroke="#4c7f9b" stroke-width="0.025"'
    return `<polygon points="${pts(q.pts)}" ${style}/>`
  }
  if (q.t === 'line') {
    const style = q.layer === 'windows' ? 'stroke="#4c7f9b" stroke-width="0.025"' : 'stroke="#3a3a3a" stroke-width="0.025"'
    return `<line x1="${n(q.a[0])}" y1="${n(q.a[1])}" x2="${n(q.b[0])}" y2="${n(q.b[1])}" ${style}/>`
  }
  if (q.t === 'arc') {
    const v1 = [q.from[0] - q.c[0], q.from[1] - q.c[1]], v2 = [q.to[0] - q.c[0], q.to[1] - q.c[1]]
    const sweep = v1[0] * v2[1] - v1[1] * v2[0] > 0 ? 1 : 0
    return `<path d="M ${n(q.from[0])} ${n(q.from[1])} A ${n(q.r)} ${n(q.r)} 0 0 ${sweep} ${n(q.to[0])} ${n(q.to[1])}" fill="none" stroke="#6b665e" stroke-width="0.018" stroke-dasharray="0.07 0.05"/>`
  }
  return ''
}
svg.push('<g id="walls">')
for (const layer of ['walls', 'windows', 'doors']) for (const q of d.prims) if (q.layer === layer) svg.push(prim(q))
svg.push('</g>')

// Furniture: outlines, names on the bigger pieces
svg.push('<g id="furniture">')
const order = [...furniture].sort((a, b) => (a.kind === 'rug' ? -1 : 0) - (b.kind === 'rug' ? -1 : 0) || (a.elevation ?? 0) - (b.elevation ?? 0))
for (const f of order) {
  const fp = footprint(f)
  if (f.kind === 'rug') svg.push(`<polygon points="${pts(fp)}" fill="rgba(47,93,80,0.05)" stroke="${ACCENT}" stroke-width="0.018" stroke-dasharray="0.08 0.05"/>`)
  else svg.push(`<polygon points="${pts(fp)}" fill="${(f.elevation ?? 0) > 0 ? 'rgba(18,18,20,0.75)' : 'rgba(255,255,255,0.82)'}" stroke="${ACCENT}" stroke-width="0.025" stroke-linejoin="round"/>`)
}
const NO_LABEL = new Set(['Dining chair', 'Side chair', 'Nightstand', 'Glider ottoman', 'Ottoman', 'Printer cart'])
const SHORT: Record<string, string> = { 'EKEDALEN dining table': 'Dining table', 'Acacia TV console': 'TV console', 'Tripp Trapp high chair': 'High chair', 'Mesh office chair': 'Office chair', 'Glider chair': 'Glider' }
for (const f of order) {
  if ((f.elevation ?? 0) > 0 || NO_LABEL.has(f.name)) continue
  const fp = footprint(f)
  const bw = Math.max(...fp.map((q) => q[0])) - Math.min(...fp.map((q) => q[0]))
  const bh = Math.max(...fp.map((q) => q[1])) - Math.min(...fp.map((q) => q[1]))
  const label = SHORT[f.name] ?? f.name
  // Run the text along the longer side of the piece.
  const upright = bh > bw * 1.4 && f.kind !== 'rug'
  const along = upright ? bh : bw, across = upright ? bw : bh
  const size = Math.min(0.13, (along * 0.82) / (label.length * 0.58), across * 0.45)
  if (size < 0.06) continue
  let at: Vec2 = f.kind === 'rug' ? [f.x + (fp[0][0] - f.x) * 0.62, f.y + (fp[0][1] - f.y) * 0.72] : [f.x, f.y]
  // The TV sits on the console: put the console's name beside it, on the room side.
  if (f.name === 'Acacia TV console') at = [f.x + 0.11, f.y]
  const rot = upright ? ` transform="rotate(-90 ${n(at[0])} ${n(at[1])})"` : ''
  svg.push(`<text x="${n(at[0])}" y="${n(at[1])}" font-size="${n(size)}" font-weight="600" fill="${ACCENT}" text-anchor="middle" dominant-baseline="central"${rot}>${esc(label)}</text>`)
}
svg.push('</g>')

// Room names and areas
svg.push('<g id="room-labels">')
const segDist = (q: Vec2, a: Vec2, b: Vec2) => {
  const dx = b[0] - a[0], dy = b[1] - a[1], L2 = dx * dx + dy * dy
  const t = L2 ? Math.max(0, Math.min(1, ((q[0] - a[0]) * dx + (q[1] - a[1]) * dy) / L2)) : 0
  return Math.hypot(q[0] - a[0] - t * dx, q[1] - a[1] - t * dy)
}
const polyDist = (q: Vec2, poly: Vec2[]) => Math.min(...poly.map((a, i) => segDist(q, a, poly[(i + 1) % poly.length])))
const pieces = furniture.filter((f) => f.kind !== 'rug').map((f) => footprint(f))
/** The point in a room farthest from its walls and from any furniture, keeping room for a w x h label. */
function clearSpot(poly: Vec2[], w: number, h: number): Vec2 {
  const xs = poly.map((q) => q[0]), ys = poly.map((q) => q[1])
  let best: Vec2 = labelPoint(poly), bestScore = -Infinity
  for (let x = Math.min(...xs); x <= Math.max(...xs); x += 0.1) {
    for (let y = Math.min(...ys); y <= Math.max(...ys); y += 0.1) {
      const box: Vec2[] = [[x - w / 2, y - h / 2], [x + w / 2, y - h / 2], [x + w / 2, y + h / 2], [x - w / 2, y + h / 2], [x, y]]
      if (!box.every((c) => pointInPolygon(c, poly))) continue
      if (pieces.some((fp) => box.some((c) => pointInPolygon(c, fp)) || fp.some((c) => c[0] > x - w / 2 && c[0] < x + w / 2 && c[1] > y - h / 2 && c[1] < y + h / 2))) continue
      const near = Math.min(polyDist([x, y], poly), ...pieces.map((fp) => (pointInPolygon([x, y], fp) ? 0 : polyDist([x, y], fp))))
      // Prefer clear space, then closeness to the room's natural label point.
      const c = labelPoint(poly)
      const score = Math.min(near, 0.6) - Math.hypot(x - c[0], y - c[1]) * 0.05
      if (score > bestScore) { bestScore = score; best = [x, y] }
    }
  }
  return best
}
for (const r of p.rooms) {
  const area = r.labelledArea ?? polygonArea(r.polygon)
  const size = area >= 8 ? 0.24 : area >= 3 ? 0.16 : 0.12
  const w = Math.max(r.name.length * size * 0.58, 4 * size), h = size * 2.3
  const [x, y] = clearSpot(r.polygon, w, h)
  const halo = 'stroke="#ffffff" stroke-width="0.07" stroke-linejoin="round" paint-order="stroke"'
  svg.push(`<text x="${n(x)}" y="${n(y - size * 0.55)}" font-size="${n(size)}" font-weight="700" fill="#1f1d1a" text-anchor="middle" dominant-baseline="central" ${halo}>${esc(r.name)}</text>`)
  svg.push(`<text x="${n(x)}" y="${n(y + size * 0.65)}" font-size="${n(size * 0.75)}" fill="#6b665e" text-anchor="middle" dominant-baseline="central" ${halo}>${area.toFixed(area < 10 ? 1 : 2)} m²</text>`)
}
svg.push('</g>')

// Scale bar and north arrow (north points left on the brochure)
const sx = d.min[0], sy = d.max[1] + 0.55
svg.push(`<g id="scale" fill="#1f1d1a"><rect x="${n(sx)}" y="${n(sy)}" width="5" height="0.05"/>`)
for (let i = 0; i <= 5; i++) svg.push(`<rect x="${n(sx + i - 0.012)}" y="${n(sy - 0.1)}" width="0.024" height="0.15"/>`)
svg.push(`<text x="${n(sx + 5.2)}" y="${n(sy + 0.03)}" font-size="0.2" dominant-baseline="central">5 m</text>`)
const nx = d.max[0] - 0.4, ny = d.max[1] + 0.5
svg.push(`<polygon points="${pts([[nx - 0.45, ny], [nx + 0.05, ny - 0.15], [nx - 0.08, ny], [nx + 0.05, ny + 0.15]])}"/><text x="${n(nx + 0.22)}" y="${n(ny)}" font-size="0.22" font-weight="700" dominant-baseline="central">N</text></g>`)
svg.push('</svg>')

writeFileSync(out, svg.join('\n'))
console.log(`wrote ${out}: ${furniture.length} pieces, ${p.rooms.length} rooms, ${(svg.join('\n').length / 1024).toFixed(0)} KB`)
