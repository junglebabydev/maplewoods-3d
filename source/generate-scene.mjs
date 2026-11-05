// Builds the Pascal author_scene payload for Maplewoods, Chempaka Court, Type D1.
// Geometry is traced from the developer brochure in image pixels and converted to metres.
// Scale calibrated against the brochure's room areas (Bedroom 2 = 11.27 m2, Bedroom 3 = 10.00 m2).
const S = 0.0205 // metres per brochure pixel
const OX = 241, OZ = 566 // plan origin (outer-left / top wall centreline)
const r3 = (v) => Math.round(v * 1000) / 1000
const X = (px) => r3((px - OX) * S)
const Z = (py) => r3((py - OZ) * S)
const P = (px, py) => [X(px), Z(py)]
const len = (a, b) => Math.hypot(b[0] - a[0], b[1] - a[1])

const H = 2.8 // floor-to-ceiling, typical for this era of Singapore condo
const WHITE = '#f1efea'
const DOOR = '#4a2418' // dark mahogany doors seen in the walkthrough
const DOOR_FRAME = '#3a1b10'
const WIN_FRAME = '#3b3a36'
const SK_MARBLE = { height: 0.1, depth: 0.012, color: '#b39b82' }
const SK_WOOD = { height: 0.1, depth: 0.012, color: '#5b2f1b' }

const walls = []
// opening helper: centre given in brochure px along the wall's main axis
function W(id, a, b, opts = {}) {
  const start = P(...a), end = P(...b)
  const horiz = a[1] === b[1]
  const w = { id, start, end, height: opts.height ?? H, thickness: opts.t ?? 0.12, color: opts.color ?? WHITE }
  if (opts.sk) w.skirting = opts.sk
  if (opts.faceLeft) w.faceLeft = opts.faceLeft
  if (opts.faceRight) w.faceRight = opts.faceRight
  if (opts.openings) {
    w.openings = opts.openings.map((o) => {
      const c = horiz ? [o.at, a[1]] : [a[0], o.at]
      const along = r3(len(start, P(...c)))
      const out = { kind: o.kind, along, width: o.w, height: o.h ?? (o.kind === 'door' ? 2.1 : 1.5) }
      if (o.sill != null) out.sill = o.sill
      for (const k of ['name', 'type', 'style', 'hinge', 'swing', 'leaves']) if (o[k] != null) out[k] = o[k]
      if (o.kind === 'door') { out.color = o.color ?? DOOR; out.frameColor = o.frameColor ?? DOOR_FRAME }
      else { out.frameColor = WIN_FRAME; out.color = WIN_FRAME }
      return out
    })
  }
  walls.push(w)
}
const door = (at, w, extra = {}) => ({ kind: 'door', at, w, ...extra })
const win = (at, w, sill, h, extra = {}) => ({ kind: 'window', at, w, sill, h, type: 'sliding', ...extra })

// ---------- Exterior envelope (0.2 m) ----------
W('ext-north-a', [241, 566], [522, 566], { t: 0.2, sk: SK_MARBLE })
W('ext-north-b', [522, 566], [665, 566], { t: 0.2 })
W('ext-north-bed2', [665, 566], [884, 566], { t: 0.2, sk: SK_WOOD, openings: [win(790, 1.8, 0.6, 1.6, { name: 'Bedroom 2 window' })] })
W('ext-void-w', [884, 566], [884, 650], { t: 0.2, sk: SK_WOOD })
W('ext-void-s', [884, 650], [974, 650], { t: 0.2, sk: SK_WOOD })
W('ext-east', [974, 650], [974, 960], { t: 0.2, sk: SK_WOOD, openings: [
  win(740, 2.0, 0.6, 1.6, { name: 'Bedroom 3 window' }),
  win(890, 2.2, 0.6, 1.6, { name: 'Master bedroom east window' }),
] })
W('ext-se-1', [974, 960], [947, 960], { t: 0.2, sk: SK_WOOD })
W('ext-se-2', [947, 960], [947, 998], { t: 0.2, sk: SK_WOOD })
W('ext-se-3', [947, 998], [910, 998], { t: 0.2, sk: SK_WOOD })
W('ext-se-4', [910, 998], [910, 1030], { t: 0.2, sk: SK_WOOD })
W('ext-master-south', [910, 1030], [745, 1030], { t: 0.2, sk: SK_WOOD, openings: [win(833, 2.0, 0.6, 1.6, { name: 'Master bedroom south window' })] })
W('ext-study-east', [745, 1030], [745, 1126], { t: 0.2, sk: SK_MARBLE })
W('ext-south', [745, 1126], [356, 1126], { t: 0.2, sk: SK_MARBLE, openings: [
  win(651, 2.4, 0.75, 1.5, { name: 'Study window' }),
  { kind: 'door', at: 460, w: 3.6, h: 2.4, type: 'sliding', style: 'glass', name: 'Balcony sliding doors', color: WIN_FRAME, frameColor: WIN_FRAME },
] })
W('ext-living-west', [356, 1126], [356, 897], { t: 0.2, sk: SK_MARBLE })
W('ext-jog', [356, 897], [393, 897], { t: 0.15 })
W('ext-west', [241, 1062], [241, 566], { t: 0.2, openings: [
  win(975, 0.5, 1.4, 0.6, { name: 'WC window', type: 'awning' }),
  win(893, 0.6, 1.2, 0.8, { name: 'Utility window', type: 'casement' }),
  win(780, 1.0, 1.05, 1.0, { name: 'Kitchen window' }),
  door(701, 0.85, { name: 'Service door', hinge: 'start' }),
  door(620, 1.0, { name: 'Main door', hinge: 'start' }),
] })

// ---------- Kitchen & service ----------
const TILE_WALL = { code: '__KITCHEN_TILE__', toHeight: H }
W('kitchen-north', [241, 655], [393, 655], { t: 0.15, sk: SK_MARBLE })
W('kitchen-east', [393, 897], [393, 655], { t: 0.15, sk: SK_MARBLE, openings: [door(718, 0.85, { name: 'Kitchen door', hinge: 'end' })] })
W('kitchen-south', [241, 850], [393, 850], { t: 0.12, openings: [door(332, 0.8, { name: 'Yard door', style: 'glass', color: '#d9d9d6', frameColor: '#bdbdb8' })] })
W('utility-east', [305, 850], [305, 937], { openings: [door(873, 0.7, { name: 'Utility door', type: 'folding', color: '#e8e6e0', frameColor: '#d0cec8' })] })
W('utility-south', [241, 937], [305, 937])
W('wc-east', [290, 937], [290, 1024], { openings: [door(1003, 0.6, { name: 'WC door', type: 'folding', color: '#e8e6e0', frameColor: '#d0cec8' })] })
W('wc-south', [241, 1024], [290, 1024])
W('yard-parapet', [241, 1062], [356, 1062], { t: 0.15, height: 1.1 })

// ---------- Powder room, store, bath 2, bedrooms ----------
W('powder-west', [522, 566], [522, 655], { sk: SK_MARBLE })
W('powder-south', [522, 655], [610, 655], { sk: SK_MARBLE, openings: [door(545, 0.7, { name: 'Powder room door' })] })
W('store-west', [568, 655], [568, 727], { sk: SK_MARBLE, openings: [door(691, 0.9, { name: 'Store door', type: 'folding' })] })
W('corridor-north', [568, 727], [843, 727], { sk: SK_WOOD, openings: [
  door(638, 0.75, { name: 'Bathroom 2 door', hinge: 'start' }),
  door(724, 0.85, { name: 'Bedroom 2 door', hinge: 'start' }),
] })
W('bath2-west', [610, 566], [610, 727])
W('bed2-west-a', [665, 566], [665, 632], { sk: SK_WOOD })
W('bed2-west-b', [665, 632], [696, 632], { sk: SK_WOOD })
W('bed2-west-c', [696, 632], [696, 727], { sk: SK_WOOD })
W('bed2-bed3', [843, 650], [843, 727], { sk: SK_WOOD })
W('bed3-north', [843, 650], [884, 650], { sk: SK_WOOD })
W('bed3-west', [800, 727], [800, 822], { sk: SK_WOOD, openings: [door(755, 0.85, { name: 'Bedroom 3 door', hinge: 'start' })] })
W('master-north', [745, 822], [974, 822], { sk: SK_WOOD, openings: [door(772, 0.85, { name: 'Master bedroom door', hinge: 'end' })] })

// ---------- Master bath (Bath 1) & study ----------
W('bath1-north', [620, 782], [745, 782], { sk: SK_MARBLE })
W('bath1-west', [620, 782], [620, 962], { sk: SK_MARBLE })
W('bath1-east', [745, 782], [745, 1030], { t: 0.15, sk: SK_WOOD, openings: [door(848, 0.7, { name: 'Master bath door', type: 'folding' })] })
W('study-north', [563, 962], [745, 962], { sk: SK_MARBLE, openings: [door(592, 0.8, { name: 'Study door', hinge: 'start' })] })
W('study-west', [563, 962], [563, 1126], { sk: SK_MARBLE, openings: [door(1055, 2.0, { name: 'Study folding doors', type: 'folding', leaves: 4 })] })

// ---------- Finishes (three.js modules) ----------
const MARBLE_FLOOR = `import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'
export default function build({ params, THREE }) {
  const pts = (params.polygon || []).map((p) => Array.isArray(p) ? p : [p.x, p.z ?? p.y])
  let x0 = Infinity, x1 = -Infinity, z0 = Infinity, z1 = -Infinity
  for (const [x, z] of pts) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); z0 = Math.min(z0, z); z1 = Math.max(z1, z) }
  const g = new THREE.Group()
  const T = 0.6, gap = 0.003, h = 0.008
  const tones = ['#a28c75', '#ab957c', '#97826d', '#b29c82', '#9d8771']
  const mats = tones.map((c) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.14, metalness: 0, name: 'slot_marble' }))
  const buckets = tones.map(() => [])
  const grout = new THREE.Mesh(new THREE.BoxGeometry(x1 - x0 + 1.2, 0.004, z1 - z0 + 1.2), new THREE.MeshStandardMaterial({ color: '#7a6857', roughness: 0.6, name: 'slot_grout' }))
  grout.position.set((x0 + x1) / 2, 0.002, (z0 + z1) / 2); g.add(grout)
  const inlay = []
  let i = 0
  const sx = Math.floor(x0 / T) * T, sz = Math.floor(z0 / T) * T
  for (let x = sx; x < x1 + T; x += T) for (let z = sz; z < z1 + T; z += T) {
    const b = new THREE.BoxGeometry(T - gap, h, T - gap); b.translate(x + T / 2, h / 2, z + T / 2)
    buckets[(i * 7 + Math.floor(x * 13) + Math.floor(z * 5)) % tones.length].push(b); i++
    const d = new THREE.BoxGeometry(0.1, 0.0005, 0.1); d.rotateY(Math.PI / 4); d.translate(x, h + 0.0002, z); inlay.push(d)
  }
  buckets.forEach((arr, k) => { if (arr.length) g.add(new THREE.Mesh(mergeGeometries(arr), mats[k])) })
  g.add(new THREE.Mesh(mergeGeometries(inlay), new THREE.MeshStandardMaterial({ color: '#ddd1bd', roughness: 0.14, name: 'slot_inlay' })))
  return g
}`

const tileFloor = (size, tones, grout, rough) => `import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'
export default function build({ params, THREE }) {
  const pts = (params.polygon || []).map((p) => Array.isArray(p) ? p : [p.x, p.z ?? p.y])
  let x0 = Infinity, x1 = -Infinity, z0 = Infinity, z1 = -Infinity
  for (const [x, z] of pts) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); z0 = Math.min(z0, z); z1 = Math.max(z1, z) }
  const g = new THREE.Group(), T = ${size}, gap = 0.004, h = 0.008
  const tones = ${JSON.stringify(tones)}
  const mats = tones.map((c) => new THREE.MeshStandardMaterial({ color: c, roughness: ${rough}, name: 'slot_tile' }))
  const buckets = tones.map(() => [])
  const base = new THREE.Mesh(new THREE.BoxGeometry(x1 - x0 + 1, 0.004, z1 - z0 + 1), new THREE.MeshStandardMaterial({ color: '${grout}', roughness: 0.8, name: 'slot_grout' }))
  base.position.set((x0 + x1) / 2, 0.002, (z0 + z1) / 2); g.add(base)
  let i = 0
  for (let x = Math.floor(x0 / T) * T; x < x1 + T; x += T) for (let z = Math.floor(z0 / T) * T; z < z1 + T; z += T) {
    const b = new THREE.BoxGeometry(T - gap, h, T - gap); b.translate(x + T / 2, h / 2, z + T / 2); buckets[(i++ * 5 + Math.floor(z * 7)) % tones.length].push(b)
  }
  buckets.forEach((arr, k) => { if (arr.length) g.add(new THREE.Mesh(mergeGeometries(arr), mats[k])) })
  return g
}`

const wallTile = (tw, th, tones, grout) => `import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'
export default function build({ params, THREE }) {
  const flat = (o) => { if (!o) return []; if (Array.isArray(o)) { if (o.length && typeof o[0] === 'number') { const r = []; for (let i = 0; i + 1 < o.length; i += 2) r.push([o[i], o[i + 1]]); return r } return o.flatMap((p) => Array.isArray(p) && typeof p[0] === 'number' ? [p] : (p && typeof p === 'object' && 'x' in p ? [[p.x, p.y ?? p.z]] : flat(p))) } if (typeof o === 'object') { if ('x0' in o && 'x1' in o) return [[o.x0, o.y0], [o.x1, o.y1]]; if ('x' in o && typeof o.x === 'number') return [[o.x, o.y ?? o.z]]; if (o.points) return flat(o.points); if (o.outer) return flat(o.outer); if ('width' in o && 'height' in o) return [[0, 0], [o.width, o.height]]; return Object.values(o).flatMap(flat) } return [] }
  const pts = flat(params.outline)
  if (!pts.length) throw new Error('outline=' + JSON.stringify(params.outline).slice(0, 300) + ' keys=' + Object.keys(params).join(','))
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity
  for (const [x, y] of pts) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y) }
  const g = new THREE.Group(), gap = 0.003, d = 0.008
  const tones = ${JSON.stringify(tones)}
  const mats = tones.map((c) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.25, name: 'slot_tile' }))
  const buckets = tones.map(() => [])
  const base = new THREE.Mesh(new THREE.BoxGeometry(x1 - x0 + 0.6, y1 - y0 + 0.6, 0.003), new THREE.MeshStandardMaterial({ color: '${grout}', roughness: 0.8, name: 'slot_grout' }))
  base.position.set((x0 + x1) / 2, (y0 + y1) / 2, 0.0015); g.add(base)
  let i = 0
  for (let x = Math.floor(x0 / ${tw}) * ${tw}; x < x1 + ${tw}; x += ${tw}) for (let y = Math.floor(y0 / ${th}) * ${th}; y < y1 + ${th}; y += ${th}) {
    const b = new THREE.BoxGeometry(${tw} - gap, ${th} - gap, d); b.translate(x + ${tw} / 2, y + ${th} / 2, d / 2); buckets[(i++) % tones.length].push(b)
  }
  buckets.forEach((arr, k) => { if (arr.length) g.add(new THREE.Mesh(mergeGeometries(arr), mats[k])) })
  return g
}`

const PARQUET = `import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'
export default function build({ params, THREE }) {
  const pts = (params.polygon || []).map((p) => Array.isArray(p) ? p : [p.x, p.z ?? p.y])
  let x0 = Infinity, x1 = -Infinity, z0 = Infinity, z1 = -Infinity
  for (const [x, z] of pts) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); z0 = Math.min(z0, z); z1 = Math.max(z1, z) }
  const g = new THREE.Group(), Q = 0.3, N = 4, s = Q / N, gap = 0.0015, h = 0.008
  const tones = ['#9a5a2b', '#a8662f', '#8c4f24', '#b2703a', '#94572a']
  const mats = tones.map((c) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.38, name: 'slot_teak' }))
  const buckets = tones.map(() => [])
  const base = new THREE.Mesh(new THREE.BoxGeometry(x1 - x0 + 1, 0.004, z1 - z0 + 1), new THREE.MeshStandardMaterial({ color: '#4a2a14', roughness: 0.8, name: 'slot_joint' }))
  base.position.set((x0 + x1) / 2, 0.002, (z0 + z1) / 2); g.add(base)
  let i = 0
  for (let x = Math.floor(x0 / Q) * Q, ix = 0; x < x1 + Q; x += Q, ix++) for (let z = Math.floor(z0 / Q) * Q, iz = 0; z < z1 + Q; z += Q, iz++) {
    const along = (ix + iz) % 2 === 0
    for (let k = 0; k < N; k++) {
      const b = along ? new THREE.BoxGeometry(Q - gap, h, s - gap) : new THREE.BoxGeometry(s - gap, h, Q - gap)
      if (along) b.translate(x + Q / 2, h / 2, z + s * k + s / 2); else b.translate(x + s * k + s / 2, h / 2, z + Q / 2)
      buckets[(i++ * 7 + ix * 3 + iz) % tones.length].push(b)
    }
  }
  buckets.forEach((arr, k) => { if (arr.length) g.add(new THREE.Mesh(mergeGeometries(arr), mats[k])) })
  return g
}`

const KITCHEN_WALL = wallTile(0.3, 0.3, ['#f4f4f1', '#efefeb'], '#cfcdc6')
const BATH_WALL = wallTile(0.6, 0.3, ['#d8c9b0', '#d2c2a8', '#dccdb5'], '#b8a88f')
const WHITE_TILE_WALL = wallTile(0.2, 0.2, ['#f3f3f0', '#eeeeea'], '#cfcdc6')
for (const w of walls) {
  for (const f of ['faceLeft', 'faceRight']) if (w[f]?.code === '__KITCHEN_TILE__') w[f].code = KITCHEN_WALL
}

const SEED = (px, py) => P(px, py)
const rooms = [
  { name: 'Living / Dining', seed: SEED(460, 850), floor: '#a28c75', floorCode: MARBLE_FLOOR },
  { name: 'Kitchen', seed: SEED(320, 770), floor: '#8d8c88', floorCode: tileFloor(0.3, ['#8d8c88', '#868580', '#93928d'], '#6f6e6a', 0.45), wallCode: KITCHEN_WALL },
  { name: 'Utility', seed: SEED(270, 890), floor: '#c9c8c3', floorCode: tileFloor(0.3, ['#c9c8c3', '#c3c2bd', '#cecdc8'], '#a9a8a2', 0.6) },
  { name: 'WC', seed: SEED(265, 985), floor: '#c9c8c3', floorCode: tileFloor(0.2, ['#c9c8c3', '#c3c2bd'], '#a9a8a2', 0.6), wallCode: WHITE_TILE_WALL },
  { name: 'Yard', seed: SEED(330, 1000), floor: '#c9c8c3', floorCode: tileFloor(0.2, ['#c9c8c3', '#c3c2bd', '#cecdc8'], '#a9a8a2', 0.6) },
  { name: 'Powder Room', seed: SEED(565, 615), floor: '#a28c75', floorCode: MARBLE_FLOOR, wallCode: BATH_WALL, wallToHeight: 1.2 },
  { name: 'Store', seed: SEED(590, 690), floor: '#a28c75' },
  { name: 'Bathroom 2', seed: SEED(650, 690), floor: '#cbc2b3', floorCode: tileFloor(0.4, ['#cfc6b8', '#c7beaf', '#d4ccbf', '#c2b9aa'], '#a99f90', 0.3), wallCode: WHITE_TILE_WALL },
  { name: 'Bedroom 2', seed: SEED(770, 680), floor: '#9a5a2b', floorCode: PARQUET },
  { name: 'Bedroom 3', seed: SEED(900, 740), floor: '#9a5a2b', floorCode: PARQUET },
  { name: 'Master Bedroom', seed: SEED(860, 920), floor: '#9a5a2b', floorCode: PARQUET },
  { name: 'Master Bath', seed: SEED(690, 870), floor: '#cbc2b3', floorCode: tileFloor(0.4, ['#cfc6b8', '#c7beaf', '#d4ccbf', '#c2b9aa'], '#a99f90', 0.3), wallCode: BATH_WALL },
  { name: 'Study', seed: SEED(650, 1045), floor: '#a28c75', floorCode: MARBLE_FLOOR },
]

// ---------- Built-ins (one three.js module each) ----------
// parts: [x0px, x1px, z0px, z1px, y0m, y1m, slot]  or {cyl:[cxpx, czpx, r, y0, y1], slot}
function item(id, name, category, mats, parts, extra = {}) {
  const abs = parts.map((p) => Array.isArray(p)
    ? { box: [X(p[0]), X(p[1]), Z(p[2]), Z(p[3]), p[4], p[5]], slot: p[6] }
    : { cyl: [X(p.cyl[0]), Z(p.cyl[1]), p.cyl[2], p.cyl[3], p.cyl[4]], slot: p.slot, sx: p.sx ?? 1, sz: p.sz ?? 1 })
  let x0 = Infinity, x1 = -Infinity, z0 = Infinity, z1 = -Infinity
  for (const a of abs) {
    if (a.box) { x0 = Math.min(x0, a.box[0]); x1 = Math.max(x1, a.box[1]); z0 = Math.min(z0, a.box[2]); z1 = Math.max(z1, a.box[3]) }
    else { const [cx, cz, r] = a.cyl; x0 = Math.min(x0, cx - r * a.sx); x1 = Math.max(x1, cx + r * a.sx); z0 = Math.min(z0, cz - r * a.sz); z1 = Math.max(z1, cz + r * a.sz) }
  }
  const cx = r3((x0 + x1) / 2), cz = r3((z0 + z1) / 2)
  const rel = abs.map((a) => a.box
    ? ['b', r3((a.box[0] + a.box[1]) / 2 - cx), r3((a.box[4] + a.box[5]) / 2), r3((a.box[2] + a.box[3]) / 2 - cz), r3(a.box[1] - a.box[0]), r3(a.box[5] - a.box[4]), r3(a.box[3] - a.box[2]), a.slot]
    : ['c', r3(a.cyl[0] - cx), r3((a.cyl[3] + a.cyl[4]) / 2), r3(a.cyl[1] - cz), a.cyl[2], r3(a.cyl[4] - a.cyl[3]), a.sx, a.sz, a.slot])
  const code = `export const mount = '${extra.mount ?? 'floor'}'
export default function build({ THREE }) {
  const g = new THREE.Group()
  const M = ${JSON.stringify(mats)}
  const mats = {}
  for (const [k, v] of Object.entries(M)) mats[k] = new THREE.MeshStandardMaterial({ color: v[0], roughness: v[1], metalness: v[2] ?? 0, name: k })
  const P = ${JSON.stringify(rel)}
  for (const p of P) {
    let m
    if (p[0] === 'b') { m = new THREE.Mesh(new THREE.BoxGeometry(p[4], p[5], p[6]), mats[p[7]]); m.position.set(p[1], p[2], p[3]) }
    else { m = new THREE.Mesh(new THREE.CylinderGeometry(p[4], p[4], p[5], 32), mats[p[8]]); m.scale.set(p[6], 1, p[7]); m.position.set(p[1], p[2], p[3]) }
    g.add(m)
  }
  ${extra.tail ?? ''}
  return g
}`
  return { id, name, category, code, position: [cx, 0, cz], rotation: 0 }
}

const KM = { slot_cabinet: ['#f3f2ee', 0.25], slot_counter: ['#8e8d89', 0.45], slot_steel: ['#b9bbbd', 0.3, 0.8], slot_black: ['#1d1d1f', 0.15], slot_handle: ['#9a9a9a', 0.3, 0.9] }
const items = [
  item('kc-west', 'Kitchen sink run', 'kitchen', KM, [
    [246, 275, 724, 845, 0, 0.85, 'slot_cabinet'], [245, 276, 723, 846, 0.85, 0.89, 'slot_counter'], [252, 270, 752, 806, 0.89, 0.895, 'slot_steel'],
  ]),
  item('kc-south', 'Kitchen corner run', 'kitchen', KM, [[276, 311, 816, 845, 0, 0.85, 'slot_cabinet'], [276, 312, 815, 846, 0.85, 0.89, 'slot_counter']]),
  item('kc-east', 'Kitchen hob run', 'kitchen', KM, [
    [360, 389, 742, 846, 0, 0.85, 'slot_cabinet'], [359, 390, 741, 846, 0.85, 0.89, 'slot_counter'], [365, 385, 778, 812, 0.89, 0.895, 'slot_black'],
    [372, 390, 776, 814, 1.55, 1.85, 'slot_steel'],
  ]),
  item('kc-north', 'Kitchen counter and oven tower', 'kitchen', KM, [
    [306, 359, 659, 688, 0, 0.85, 'slot_cabinet'], [306, 359, 658, 689, 0.85, 0.89, 'slot_counter'],
    [359, 389, 659, 688, 0, 2.2, 'slot_cabinet'], [362, 386, 688, 689, 0.55, 1.15, 'slot_black'], [362, 386, 688, 689, 1.25, 1.6, 'slot_black'],
  ]),
  item('fridge', 'Refrigerator', 'appliance', { slot_steel: ['#c4c6c8', 0.3, 0.7], slot_handle: ['#888', 0.3, 0.9] }, [[258, 303, 659, 692, 0, 1.8, 'slot_steel']]),
  item('laundry', 'Washer and dryer stack', 'appliance', { slot_white: ['#f4f4f2', 0.3], slot_glass: ['#3b4a55', 0.1] }, [
    [245, 275, 1028, 1058, 0, 0.85, 'slot_white'], [245, 275, 1028, 1058, 0.86, 1.7, 'slot_white'],
    { cyl: [276, 1043, 0.16, 0.25, 0.6], slot: 'slot_glass', sx: 0.15 },
  ]),
  item('powder-vanity', 'Powder room vanity', 'vanity', { slot_wood: ['#a8794a', 0.4], slot_marble: ['#8e3b32', 0.12], slot_basin: ['#f4f2ee', 0.2] }, [
    [528, 592, 571, 597, 0, 0.8, 'slot_wood'], [527, 593, 570, 599, 0.8, 0.84, 'slot_marble'], { cyl: [550, 585, 0.18, 0.84, 0.845], slot: 'slot_basin', sz: 0.7 },
  ]),
  item('powder-wc', 'Powder room WC', 'toilet', { slot_ceramic: ['#f5f4f0', 0.15] }, [[600, 607, 620, 642, 0, 0.75, 'slot_ceramic'], [580, 600, 623, 639, 0, 0.42, 'slot_ceramic']]),
  item('bath2-vanity', 'Bathroom 2 vanity', 'vanity', { slot_wood: ['#a8794a', 0.4], slot_marble: ['#8e3b32', 0.12], slot_basin: ['#f4f2ee', 0.2] }, [
    [670, 693, 678, 724, 0, 0.8, 'slot_wood'], [668, 693, 677, 725, 0.8, 0.84, 'slot_marble'], { cyl: [681, 701, 0.17, 0.84, 0.845], slot: 'slot_basin', sx: 0.7 },
  ]),
  item('bath2-wc', 'Bathroom 2 WC', 'toilet', { slot_ceramic: ['#f5f4f0', 0.15] }, [[685, 692, 643, 663, 0, 0.75, 'slot_ceramic'], [665, 685, 645, 661, 0, 0.42, 'slot_ceramic']]),
  item('bath2-shower', 'Bathroom 2 shower', 'shower', { slot_tray: ['#e9e7e2', 0.3], glass: ['#cfe3ea', 0.05] }, [
    [614, 662, 571, 629, 0, 0.04, 'slot_tray'], [614, 662, 629, 630, 0.04, 2.0, 'glass'],
  ]),
  item('bath1-tub', 'Master bathtub', 'bathtub', { slot_ceramic: ['#f5f4f0', 0.15], slot_water: ['#dfe9ec', 0.05] }, [
    [652, 742, 786, 820, 0, 0.55, 'slot_ceramic'], [656, 738, 790, 816, 0.55, 0.552, 'slot_water'],
  ]),
  item('bath1-vanity', 'Master bath double vanity', 'vanity', { slot_wood: ['#7a4a2a', 0.45], slot_marble: ['#9a3e33', 0.1], slot_basin: ['#f4f2ee', 0.2] }, [
    [624, 651, 828, 912, 0, 0.8, 'slot_wood'], [623, 652, 827, 913, 0.8, 0.84, 'slot_marble'],
    { cyl: [637, 850, 0.17, 0.84, 0.845], slot: 'slot_basin', sx: 0.7 }, { cyl: [637, 892, 0.17, 0.84, 0.845], slot: 'slot_basin', sx: 0.7 },
  ]),
  item('bath1-wc', 'Master bath WC', 'toilet', { slot_ceramic: ['#f5f4f0', 0.15] }, [[734, 741, 893, 913, 0, 0.75, 'slot_ceramic'], [714, 734, 895, 911, 0, 0.42, 'slot_ceramic']]),
  item('bath1-bidet', 'Master bath bidet', 'toilet', { slot_ceramic: ['#f5f4f0', 0.15] }, [[716, 741, 922, 942, 0, 0.4, 'slot_ceramic']]),
  item('master-wardrobe', 'Master bedroom wardrobe', 'wardrobe', { slot_laminate: ['#f2f1ec', 0.3], slot_handle: ['#3a2a20', 0.4] }, [
    [749, 777, 910, 1027, 0, 2.4, 'slot_laminate'],
    [777, 778, 935, 937, 0.9, 1.3, 'slot_handle'], [777, 778, 967, 969, 0.9, 1.3, 'slot_handle'], [777, 778, 999, 1001, 0.9, 1.3, 'slot_handle'],
  ]),
]

// Living-room ceiling fan, as seen in the walkthrough
items.push({
  id: 'living-fan', name: 'Ceiling fan', category: 'fan', position: [X(460), 2.33, Z(1010)], rotation: 0,
  code: `export const mount = 'floor'
export default function build({ THREE }) {
  const g = new THREE.Group()
  const white = new THREE.MeshStandardMaterial({ color: '#f2f2f0', roughness: 0.35, name: 'slot_body' })
  const glass = new THREE.MeshStandardMaterial({ color: '#fffaf0', roughness: 0.2, emissive: '#fff3d6', emissiveIntensity: 0.6, name: 'slot_lamp' })
  const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.25, 12), white); rod.position.y = -0.125; g.add(rod)
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.07, 0.12, 24), white); hub.position.y = -0.31; g.add(hub)
  const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.07, 24, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), glass); lamp.position.y = -0.37; g.add(lamp)
  const blades = new THREE.Group(); blades.name = 'part:blades'; blades.position.y = -0.33
  for (let i = 0; i < 3; i++) { const b = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.008, 0.12), white); b.position.x = 0.35; const arm = new THREE.Group(); arm.rotation.y = i * 2 * Math.PI / 3; arm.add(b); blades.add(arm) }
  g.add(blades)
  const light = new THREE.PointLight('#fff1dc', 1.2, 8); light.name = 'light:fan'; light.position.y = -0.42; g.add(light)
  const track = new THREE.NumberKeyframeTrack(blades.uuid + '.rotation[y]', [0, 1.5], [0, Math.PI * 2])
  g.animations = [new THREE.AnimationClip('loop', 1.5, [track])]
  return g
}`,
})

const lights = [
  [460, 650], [460, 860], [320, 750], [770, 680], [900, 740], [860, 920], [690, 870], [650, 1045], [650, 690], [565, 615], [330, 960],
].map(([x, y]) => ({ position: [X(x), 2.75, Z(y)], color: '#fff1dc', intensity: 1 }))

const slabs = [{
  name: 'Balcony', polygon: [P(348, 1131), P(572, 1131), P(572, 1196), P(348, 1196)], thickness: 0.15, top: -0.03, finish: '#7d6650',
  railing: [{ start: P(350, 1131), end: P(350, 1194), height: 1.1 }, { start: P(350, 1194), end: P(570, 1194), height: 1.1 }, { start: P(570, 1194), end: P(570, 1131), height: 1.1 }],
}]

const columns = [
  { name: 'Entrance column (left)', position: P(265, 569), width: 0.7, depth: 0.85, height: H, color: WHITE },
  { name: 'Entrance column (right)', position: P(351, 568), width: 0.45, depth: 0.95, height: H, color: WHITE },
  { name: 'Bedroom 2 column', position: P(741, 556), width: 0.64, depth: 0.62, height: H, color: WHITE },
  { name: 'Facade column', position: P(565, 1126), width: 0.45, depth: 0.45, height: H, color: WHITE },
]

export const payload = {
  levels: [{ name: 'Type D1 unit', elevation: 0, walls, rooms, slabs, columns, items, lights }],
  notes: [
    'Traced from the Maplewoods Chempaka Court Type D1 brochure plan; scale calibrated so Bedroom 2 and Bedroom 3 match the brochure areas (11.27 and 10.00 m2).',
    'Plan is drawn in brochure orientation (the brochure north arrow points to the left of the page), not true north.',
    'The A/C ledge and the external planter ledges around the master bedroom are not modelled; the yard is closed at the A/C ledge by a 1.1 m parapet.',
    'Ceiling height of 2.8 m and door and window sizes are estimates; finishes follow the owner walkthrough video.',
  ],
}

if (process.argv[1].endsWith('gen.mjs')) {
  const fs = await import('fs')
  fs.writeFileSync('payload.json', JSON.stringify(payload, null, 1))
  console.log('walls', walls.length, 'openings', walls.reduce((n, w) => n + (w.openings?.length ?? 0), 0), 'rooms', rooms.length, 'items', items.length, 'bytes', JSON.stringify(payload).length)
}
