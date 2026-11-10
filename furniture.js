// The family's own furniture, modelled from photos and placed in the new unit.
// Positions are plan metres from the brochure trace (x east, z south); each piece faces +z before rotation.
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { LAYOUT } from './layout.js'

const OFF = [-7.51, -5.74] // plan metres -> viewer world
const mat = (color, roughness = 0.7, metalness = 0, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness, metalness, ...extra })
const M = {
  acacia: mat('#9a6d45', 0.62), acaciaLight: mat('#b48a60', 0.62), acaciaDark: mat('#7d5535', 0.62),
  oak: mat('#c38c4e', 0.5), oakDark: mat('#a8743f', 0.55), birch: mat('#d9bd90', 0.6), beech: mat('#d3a56c', 0.55),
  walnut: mat('#4a2617', 0.4), espresso: mat('#3b2a20', 0.45), legWood: mat('#5a3a26', 0.5),
  sofa: mat('#a49c91', 0.95), ottoman: mat('#d0c4ae', 0.95), greyFabric: mat('#77726c', 0.95), charcoal: mat('#4a4f57', 0.95),
  seatFabric: mat('#3f4652', 0.95), linen: mat('#efe9dd', 0.9), pillow: mat('#f6f2ea', 0.9), blush: mat('#e2b1a2', 0.9),
  throw: mat('#66625d', 0.95), white: mat('#f2f1ec', 0.45), offWhite: mat('#ece8de', 0.5), black: mat('#121214', 0.25),
  screen: mat('#0b0c10', 0.12, 0.2), steel: mat('#9ea2a6', 0.35, 0.8), darkMetal: mat('#3a3b3e', 0.4, 0.6),
  mesh: mat('#34373c', 0.8), seatGrey: mat('#8c939b', 0.85), lampShade: mat('#8e8b85', 0.9),
  net: mat('#ffffff', 0.9, 0, { transparent: true, opacity: 0.38, side: THREE.DoubleSide, depthWrite: false }),
  rug: mat('#ddd7ca', 1), rugBlue: mat('#2c6c83', 1), rugTeal: mat('#6ea3ae', 1), rugInk: mat('#253c52', 1),
  mint: mat('#b9d9cc', 0.9), pink: mat('#efc8c3', 0.9), cream: mat('#efe3bd', 0.9), pink2: mat('#e9bfc4', 0.9),
  canvas: mat('#f3cbb9', 0.9), canvasGold: mat('#f6dca2', 0.9), canvasRose: mat('#eeb1a3', 0.9), board: mat('#f7f7f5', 0.3),
}

// Helpers: y is the bottom of the part
function box(g, w, h, d, m, x = 0, y = 0, z = 0, r = 0) {
  const rr = Math.min(r, w / 2 - 1e-3, h / 2 - 1e-3, d / 2 - 1e-3)
  const geo = rr > 0.002 ? new RoundedBoxGeometry(w, h, d, 3, rr) : new THREE.BoxGeometry(w, h, d)
  const mesh = new THREE.Mesh(geo, m); mesh.position.set(x, y + h / 2, z); g.add(mesh); return mesh
}
function cyl(g, rTop, rBot, h, m, x = 0, y = 0, z = 0, seg = 16) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(rTop, rBot, h, seg), m); mesh.position.set(x, y + h / 2, z); g.add(mesh); return mesh
}
function rod(g, a, b, r, m) { // cylinder between two points
  const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b), len = A.distanceTo(B)
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, 10), m)
  mesh.position.copy(A).add(B).multiplyScalar(0.5)
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), B.clone().sub(A).normalize()); g.add(mesh); return mesh
}
const legs4 = (g, w, d, h, m, inset = 0.06, r = 0.02, taper = 0.6) => {
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) cyl(g, r, r * taper, h, m, sx * (w / 2 - inset), 0, sz * (d / 2 - inset))
}

// ---------- Living ----------
function tvConsole() { // acacia, 2.0 x 0.45
  const g = new THREE.Group(), w = 2.0, d = 0.45
  legs4(g, w, d, 0.16, M.acacia, 0.08, 0.028)
  box(g, w, 0.42, d, M.acacia, 0, 0.16, 0, 0.01)
  box(g, 0.56, 0.34, 0.01, M.acaciaLight, -0.69, 0.2, d / 2)
  box(g, 0.56, 0.34, 0.01, M.acaciaLight, 0.69, 0.2, d / 2)
  box(g, 0.74, 0.15, 0.01, M.acaciaLight, 0, 0.2, d / 2)
  box(g, 0.74, 0.16, 0.3, M.espresso, 0, 0.38, d / 2 - 0.15)
  return g
}
function tv65() {
  const g = new THREE.Group()
  for (const sx of [-0.55, 0.55]) box(g, 0.04, 0.07, 0.25, M.black, sx, 0, 0)
  box(g, 1.45, 0.84, 0.045, M.screen, 0, 0.07, 0, 0.01)
  return g
}
function sofa() { // grey 3-seater with adjustable headrests, 240 x 95 cm
  const g = new THREE.Group(), w = 2.4, d = 0.95
  for (const x of [-1.1, 1.1, -0.1, 0.1]) for (const z of [-0.38, 0.38]) cyl(g, 0.025, 0.018, 0.12, M.legWood, x, 0, z)
  box(g, w, 0.3, d, M.sofa, 0, 0.12, 0, 0.05)
  const seatW = (w - 0.36) / 3
  for (let i = -1; i <= 1; i++) box(g, seatW - 0.02, 0.13, 0.66, M.sofa, i * seatW, 0.42, 0.1, 0.05)
  box(g, w - 0.36, 0.42, 0.24, M.sofa, 0, 0.42, -0.34, 0.07)
  for (const s of [-1, 1]) box(g, 0.18, 0.26, d, M.sofa, s * (w / 2 - 0.09), 0.42, 0, 0.06)
  for (const x of [-seatW, seatW]) box(g, seatW - 0.08, 0.3, 0.18, M.sofa, x, 0.86, -0.36, 0.07)
  box(g, seatW - 0.2, 0.16, 0.16, M.sofa, 0, 0.84, -0.37, 0.06)
  return g
}
function ottoman() { const g = new THREE.Group(); box(g, 0.9, 0.04, 0.7, M.legWood, 0, 0, 0); box(g, 0.9, 0.4, 0.7, M.ottoman, 0, 0.04, 0, 0.04); return g }
function rug() { // cream with blue brush strokes, 2.3 x 1.6
  const g = new THREE.Group(); box(g, 2.3, 0.012, 1.6, M.rug, 0, 0, 0)
  let s = 7; const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280)
  for (let i = 0; i < 34; i++) {
    const m = [M.rugBlue, M.rugTeal, M.rugInk][i % 3], len = 0.08 + rnd() * 0.45
    box(g, len, 0.002, 0.02 + rnd() * 0.05, m, -1.05 + rnd() * 2.1, 0.012, -0.72 + rnd() * 1.44)
  }
  return g
}
function playKitchen() { // IKEA DUKTIG style, 0.72 x 0.4 x 1.09
  const g = new THREE.Group(), w = 0.72, d = 0.4
  box(g, w, 0.55, d, M.birch, 0, 0, 0)
  box(g, 0.33, 0.42, 0.01, M.offWhite, -0.17, 0.08, d / 2); box(g, 0.33, 0.42, 0.01, M.offWhite, 0.17, 0.08, d / 2)
  box(g, w + 0.02, 0.03, d + 0.02, M.birch, 0, 0.55, 0)
  box(g, 0.2, 0.01, 0.2, M.black, -0.18, 0.58, 0); box(g, 0.2, 0.04, 0.16, M.darkMetal, 0.17, 0.555, 0.02)
  rod(g, [0.17, 0.58, -0.13], [0.17, 0.72, -0.13], 0.012, M.darkMetal); rod(g, [0.17, 0.72, -0.13], [0.17, 0.72, -0.04], 0.012, M.darkMetal)
  for (const s of [-1, 1]) box(g, 0.03, 0.51, 0.25, M.birch, s * (w / 2 - 0.015), 0.58, -0.07)
  box(g, w, 0.02, 0.25, M.birch, 0, 0.82, -0.07); box(g, w, 0.02, 0.25, M.birch, 0, 1.07, -0.07)
  box(g, w, 0.51, 0.01, M.offWhite, 0, 0.58, -0.195)
  box(g, 0.34, 0.2, 0.22, M.offWhite, -0.08, 0.84, -0.06)
  return g
}
function wallLadder() { // Pikler-style wall bars with pull-up frame
  const g = new THREE.Group()
  for (const s of [-1, 1]) box(g, 0.07, 2.05, 0.035, M.birch, s * 0.32, 0.02, 0.06, 0.01)
  for (let y = 0.18; y < 1.95; y += 0.21) rod(g, [-0.3, y, 0.06], [0.3, y, 0.06], 0.017, M.beech)
  for (const s of [-1, 1]) {
    box(g, 0.04, 0.1, 0.72, M.birch, s * 0.36, 1.98, 0.42, 0.01)
    rod(g, [s * 0.34, 1.35, 0.08], [s * 0.34, 2.0, 0.62], 0.02, M.birch)
  }
  for (const z of [0.3, 0.46, 0.62]) rod(g, [-0.36, 2.03, z], [0.36, 2.03, z], 0.017, M.beech)
  return g
}

// ---------- Dining ----------
function sideboard() { // Castlery Seb, 160 x 45 x 78 cm, with the pink canvas above
  const g = new THREE.Group(), w = 1.6, d = 0.45
  legs4(g, w, d, 0.2, M.acacia, 0.1, 0.022)
  box(g, w, 0.58, d, M.acacia, 0, 0.2, 0, 0.02)
  box(g, 0.5, 0.52, 0.01, M.acaciaLight, -0.53, 0.23, d / 2); box(g, 0.5, 0.52, 0.01, M.acaciaLight, 0.53, 0.23, d / 2)
  for (let i = 0; i < 3; i++) box(g, 0.5, 0.16, 0.01, M.acaciaLight, 0, 0.235 + i * 0.175, d / 2)
  for (const [x, y] of [[-0.58, 0.68], [0.58, 0.68], [0, 0.34], [0, 0.52], [0, 0.7]]) box(g, 0.15, 0.015, 0.02, M.black, x, y, d / 2 + 0.01)
  box(g, 1.0, 1.1, 0.04, M.canvas, 0, 1.12, -d / 2 + 0.03)
  box(g, 0.55, 0.45, 0.004, M.canvasGold, 0.15, 1.5, -d / 2 + 0.052)
  box(g, 0.4, 0.35, 0.004, M.canvasRose, -0.22, 1.25, -d / 2 + 0.054)
  return g
}
function diningTable() { // IKEA EKEDALEN, 180 x 90 x 75 cm closed (240 cm extended)
  const g = new THREE.Group(), w = 1.8, d = 0.9
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) box(g, 0.06, 0.71, 0.06, M.oak, sx * (w / 2 - 0.06), 0, sz * (d / 2 - 0.06))
  box(g, w - 0.08, 0.08, d - 0.08, M.oakDark, 0, 0.63, 0)
  box(g, w, 0.04, d, M.oak, 0, 0.71, 0, 0.005)
  return g
}
function diningChair() {
  const g = new THREE.Group()
  for (const sx of [-1, 1]) { cyl(g, 0.018, 0.016, 0.45, M.oakDark, sx * 0.19, 0, 0.18); rod(g, [sx * 0.19, 0, -0.2], [sx * 0.19, 0.84, -0.22], 0.018, M.oakDark) }
  box(g, 0.44, 0.03, 0.44, M.oakDark, 0, 0.44, 0); box(g, 0.42, 0.04, 0.4, M.seatFabric, 0, 0.47, 0.01, 0.015)
  box(g, 0.42, 0.22, 0.025, M.oak, 0, 0.62, -0.22, 0.01)
  return g
}
function trippTrapp() { // high chair with white baby set
  const g = new THREE.Group()
  for (const s of [-1, 1]) { box(g, 0.035, 0.03, 0.5, M.beech, s * 0.22, 0, 0.05); rod(g, [s * 0.22, 0.03, 0.26], [s * 0.22, 0.79, -0.12], 0.022, M.beech) }
  box(g, 0.42, 0.02, 0.26, M.beech, 0, 0.47, 0.0); box(g, 0.42, 0.02, 0.3, M.beech, 0, 0.22, 0.08)
  for (const y of [0.6, 0.72]) box(g, 0.46, 0.05, 0.02, M.beech, 0, y, -0.12, 0.01)
  box(g, 0.32, 0.22, 0.03, M.white, 0, 0.52, -0.08, 0.02); box(g, 0.3, 0.03, 0.03, M.white, 0, 0.66, 0.14, 0.012)
  return g
}

// ---------- Bedrooms ----------
function nightstand(w = 0.5, d = 0.42, h = 0.6, m = M.walnut) {
  const g = new THREE.Group(); box(g, w, h, d, m, 0, 0, 0, 0.01)
  box(g, w - 0.06, h * 0.35, 0.008, M.espresso, 0, h * 0.55, d / 2); box(g, 0.1, 0.012, 0.015, M.steel, 0, h * 0.72, d / 2 + 0.01)
  return g
}
function tableLamp() { const g = new THREE.Group(); cyl(g, 0.07, 0.08, 0.02, M.steel); cyl(g, 0.008, 0.008, 0.42, M.steel, 0, 0.02); cyl(g, 0.14, 0.19, 0.24, M.lampShade, 0, 0.36, 0, 24); return g }
function greyBed() { // IKEA king (180x200 mattress), upholstered storage bed with tall sloping tufted headboard, ~197 x 224 cm
  const g = new THREE.Group()
  box(g, 1.93, 0.05, 2.04, M.espresso, 0, 0, 0.08)
  box(g, 1.97, 0.33, 2.08, M.greyFabric, 0, 0.05, 0.08, 0.03)
  box(g, 1.82, 0.26, 2.0, M.linen, 0, 0.38, 0.1, 0.06)
  const head = box(g, 1.97, 1.18, 0.16, M.greyFabric, 0, 0, -1.04, 0.05); head.rotation.x = -0.06
  for (let r = 0; r < 2; r++) for (let c = 0; c < 6; c++) cyl(g, 0.015, 0.015, 0.01, M.throw, -0.8 + c * 0.32, 0.82 + r * 0.2, -0.93 - (0.82 + r * 0.2) * 0.06).rotation.x = Math.PI / 2
  for (const x of [-0.45, 0.45]) box(g, 0.66, 0.13, 0.42, M.pillow, x, 0.63, -0.68, 0.06)
  box(g, 1.86, 0.05, 1.4, M.pillow, 0, 0.63, 0.42, 0.025)
  return g
}
function whiteBed() { // IKEA MALM high, queen (160x200 mattress), 176 x 209 cm, 100 cm headboard
  const g = new THREE.Group()
  box(g, 1.76, 0.38, 2.04, M.white, 0, 0, 0.02, 0.01)
  box(g, 1.76, 1.0, 0.05, M.white, 0, 0, -1.02)
  box(g, 1.6, 0.24, 1.98, M.linen, 0, 0.3, 0.03, 0.05)
  for (const x of [-0.42, 0.42]) box(g, 0.62, 0.15, 0.4, M.pillow, x, 0.54, -0.72, 0.06)
  box(g, 1.66, 0.05, 1.35, M.pillow, 0, 0.54, 0.3, 0.025)
  return g
}
function tvOnStand() {
  const g = new THREE.Group()
  box(g, 0.7, 0.03, 0.45, M.black, 0, 0, 0, 0.01); box(g, 0.08, 1.1, 0.06, M.black, 0, 0.03, -0.08)
  box(g, 0.97, 0.57, 0.045, M.screen, 0, 0.82, -0.03, 0.008)
  return g
}
function crib() { // Stokke Sleepi-style oval cot with canopy, 1.27 x 0.74
  const g = new THREE.Group(), a = 0.635, b = 0.37
  const ring = (y) => { const t = new THREE.Mesh(new THREE.TorusGeometry(1, 0.02, 8, 48), M.beech); t.rotation.x = Math.PI / 2; t.scale.set(a, b, 1); t.position.y = y; g.add(t) }
  ring(0.3); ring(0.86)
  for (let i = 0; i < 34; i++) { const t = (i / 34) * Math.PI * 2; cyl(g, 0.011, 0.011, 0.56, M.beech, Math.cos(t) * a, 0.3, Math.sin(t) * b, 6) }
  const mattress = cyl(g, 1, 1, 0.1, M.pillow, 0, 0.3, 0, 32); mattress.scale.set(a - 0.03, 1, b - 0.03)
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) cyl(g, 0.02, 0.02, 0.3, M.beech, sx * a * 0.6, 0, sz * b * 0.7)
  cyl(g, 0.012, 0.012, 1.95, M.white, -a + 0.05, 0, 0)
  const net = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.42, 1.4, 24, 1, true), M.net); net.position.set(-a + 0.25, 1.25, 0); g.add(net)
  return g
}
function kidsWardrobe() { const g = new THREE.Group(); box(g, 0.6, 1.26, 0.5, M.birch, 0, 0, 0); box(g, 0.6, 0.02, 0.5, M.white, 0, 1.26, 0); box(g, 0.29, 1.18, 0.01, mat('#e5d0ad', 0.6), -0.15, 0.04, 0.25); box(g, 0.29, 1.18, 0.01, mat('#e5d0ad', 0.6), 0.15, 0.04, 0.25); for (const x of [-0.03, 0.03]) cyl(g, 0.012, 0.012, 0.02, M.white, x, 0.75, 0.26).rotation.x = Math.PI / 2; return g }
function bookDisplay() {
  const g = new THREE.Group()
  for (const s of [-1, 1]) box(g, 0.02, 0.65, 0.3, M.birch, s * 0.34, 0, 0)
  box(g, 0.66, 0.012, 0.3, M.birch, 0, 0.0, 0)
  for (let i = 0; i < 3; i++) {
    const y = 0.08 + i * 0.2, z = 0.1 - i * 0.08
    box(g, 0.66, 0.012, 0.1, M.birch, 0, y, z)
    box(g, 0.66, 0.06, 0.012, M.birch, 0, y, z + 0.05)
  }
  return g
}
function kidsBed(duvet = 'mint') { // IKEA SNIGLAR-style junior bed in beech, 70x160 mattress, about 77 x 167 cm
  const g = new THREE.Group(), w = 0.77, d = 1.67, cover = { mint: M.mint, pink: M.pink2 }[duvet] ?? M.mint
  for (const sx of [-1, 1]) for (const [sz, h] of [[-1, 0.62], [1, 0.46]]) box(g, 0.045, h, 0.045, M.beech, sx * (w / 2 - 0.0225), 0, sz * (d / 2 - 0.0225), 0.008)
  for (const sx of [-1, 1]) box(g, 0.025, 0.1, d - 0.09, M.beech, sx * (w / 2 - 0.02), 0.18, 0)
  for (const [sz, top] of [[-1, 0.6], [1, 0.44]]) {
    box(g, w - 0.09, 0.04, 0.03, M.beech, 0, top - 0.04, sz * (d / 2 - 0.0225))
    for (let i = 0; i < 5; i++) box(g, 0.035, top - 0.3, 0.02, M.beech, -0.24 + i * 0.12, 0.26, sz * (d / 2 - 0.0225))
  }
  box(g, 0.7, 0.1, 1.6, M.pillow, 0, 0.22, 0, 0.03)
  box(g, 0.46, 0.08, 0.3, M.pillow, 0, 0.32, -0.6, 0.04)
  box(g, 0.68, 0.05, 1.05, cover, 0, 0.32, 0.22, 0.02)
  return g
}
function playMat() { const g = new THREE.Group(); [M.mint, M.pink, M.cream, M.pink2].forEach((m, i) => box(g, 0.5, 0.04, 1.4, m, -0.75 + i * 0.5, 0, 0, 0.01)); return g }
function glider() {
  const g = new THREE.Group()
  cyl(g, 0.38, 0.38, 0.05, M.charcoal, 0, 0, 0, 32)
  box(g, 0.56, 0.32, 0.56, M.charcoal, 0, 0.08, 0.02, 0.05)
  box(g, 0.56, 0.16, 0.6, M.charcoal, 0, 0.36, 0.04, 0.06)
  const back = box(g, 0.54, 0.78, 0.18, M.charcoal, 0, 0.48, -0.3, 0.07); back.rotation.x = -0.12
  for (const s of [-1, 1]) box(g, 0.13, 0.2, 0.62, M.charcoal, s * 0.34, 0.5, 0.02, 0.06)
  return g
}
function gliderOttoman() { const g = new THREE.Group(); cyl(g, 0.24, 0.24, 0.03, M.charcoal, 0, 0, 0, 24); for (const s of [-1, 1]) rod(g, [s * 0.14, 0.03, 0], [s * 0.16, 0.28, 0], 0.012, M.steel); box(g, 0.5, 0.15, 0.4, M.charcoal, 0, 0.28, 0, 0.05); return g }

// ---------- Study ----------
function desk() {
  const g = new THREE.Group(), w = 1.2, d = 0.6
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) box(g, 0.035, 0.71, 0.035, M.white, sx * (w / 2 - 0.03), 0, sz * (d / 2 - 0.03))
  box(g, w, 0.03, d, M.white, 0, 0.71, 0)
  box(g, 0.5, 0.1, 0.24, M.oak, -0.3, 0.74, -0.16)
  box(g, 0.22, 0.12, 0.18, M.darkMetal, 0.25, 0.74, -0.17); box(g, 0.03, 0.18, 0.03, M.black, 0.25, 0.86, -0.17)
  box(g, 0.62, 0.36, 0.03, M.screen, 0.25, 0.98, -0.16, 0.01)
  return g
}
function printerCart() { const g = new THREE.Group(); box(g, 0.42, 0.6, 0.45, M.white, 0, 0, 0); box(g, 0.38, 0.4, 0.4, M.offWhite, 0, 0.06, 0.03); box(g, 0.4, 0.16, 0.34, M.white, 0, 0.6, 0, 0.02); return g }
function officeChair() { // mesh task chair
  const g = new THREE.Group()
  for (let i = 0; i < 5; i++) { const t = (i / 5) * Math.PI * 2; rod(g, [0, 0.08, 0], [Math.cos(t) * 0.32, 0.05, Math.sin(t) * 0.32], 0.018, M.white); const c = new THREE.Mesh(new THREE.SphereGeometry(0.03, 10, 8), M.darkMetal); c.position.set(Math.cos(t) * 0.32, 0.03, Math.sin(t) * 0.32); g.add(c) }
  cyl(g, 0.025, 0.025, 0.36, M.steel, 0, 0.08)
  box(g, 0.5, 0.07, 0.47, M.seatGrey, 0, 0.44, 0.02, 0.03)
  const back = box(g, 0.46, 0.6, 0.04, M.mesh, 0, 0.56, -0.25, 0.02); back.rotation.x = -0.15
  for (const s of [-1, 1]) { rod(g, [s * 0.26, 0.48, 0], [s * 0.26, 0.66, 0], 0.012, M.white); box(g, 0.07, 0.025, 0.24, M.white, s * 0.26, 0.66, 0.02, 0.01) }
  return g
}
function fileCabinet() { const g = new THREE.Group(); box(g, 0.45, 0.7, 0.6, M.white, 0, 0, 0, 0.01); for (const y of [0.18, 0.5]) box(g, 0.14, 0.015, 0.02, M.steel, 0, y, 0.3); return g }
function easel() {
  const g = new THREE.Group()
  for (const [x, z] of [[-0.3, 0.2], [0.3, 0.2], [0, -0.35]]) rod(g, [x, 0, z], [x * 0.3, 1.6, z * 0.2], 0.012, M.darkMetal)
  const b = box(g, 0.62, 0.9, 0.02, M.board, 0, 0.7, 0.12, 0.01); b.rotation.x = -0.12
  return g
}

// ---------- Layout (positions live in layout.js) ----------
const PIECES = {
  tvConsole, tv65, rug, ottoman, sofa, wallLadder, playKitchen, sideboard, diningTable, diningChair, trippTrapp,
  greyBed, nightstand: () => nightstand(), nightstandSmall: () => nightstand(0.4, 0.4, 0.55, M.espresso), tableLamp, whiteBed, tvOnStand,
  crib, kidsBed: (e) => kidsBed(e.color), playMat, glider, gliderOttoman, kidsWardrobe, bookDisplay,
  desk, printerCart, officeChair, fileCabinet, easel,
}
export function buildFurniture(floorY = 0.01) {
  const root = new THREE.Group(); root.name = 'Furniture'
  for (const e of LAYOUT) {
    const g = PIECES[e.piece](e)
    g.position.set(e.x + OFF[0], floorY + (e.y ?? 0), e.z + OFF[1]); g.rotation.y = (e.rot * Math.PI) / 180; g.name = e.name
    root.add(g)
  }
  root.traverse((o) => { if (o.isMesh) { o.castShadow = o.material !== M.net; o.receiveShadow = true } })
  return root
}
