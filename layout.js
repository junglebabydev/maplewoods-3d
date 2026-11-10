// Where every piece goes, shared by the 3D viewer (furniture.js) and the 2D plan (source/make-plan.mts).
// x, z: plan metres from the brochure trace (x east, z south). rot: degrees about the vertical axis,
// as in three.js (0 = the piece's front faces +z, south). y: height off the floor for pieces that sit on
// something. w, d: footprint across the front and front to back, for the 2D plan; ox, oz shift the
// footprint centre in the piece's own frame when the model is not centred.
export const LAYOUT = [
  // Living: TV wall to the west, sofa facing it, play corner along the same wall
  { name: 'TV console', piece: 'tvConsole', x: 2.7, z: 9.1, rot: 90, w: 2.0, d: 0.45, kind: 'tv-console' },
  { name: 'TV', piece: 'tv65', x: 2.64, z: 9.1, rot: 90, y: 0.58, w: 1.45, d: 0.25, kind: 'tv' },
  { name: 'Rug', piece: 'rug', x: 3.95, z: 9.1, rot: 90, w: 2.3, d: 1.6, kind: 'rug' },
  { name: 'Ottoman', piece: 'ottoman', x: 3.95, z: 9.1, rot: 90, y: 0.012, w: 0.9, d: 0.7, kind: 'ottoman' },
  { name: 'Sofa', piece: 'sofa', x: 5.43, z: 9.1, rot: -90, w: 2.4, d: 0.95, kind: 'sofa', label: '3-seater sofa' },
  { name: 'Wall ladder', piece: 'wallLadder', x: 2.46, z: 7.3, rot: 90, w: 0.72, d: 0.12, oz: 0.06, kind: 'other' },
  { name: 'Play kitchen', piece: 'playKitchen', x: 2.68, z: 10.75, rot: 90, w: 0.72, d: 0.4, kind: 'cabinet' },
  // Dining
  { name: 'Sideboard', piece: 'sideboard', x: 4.3, z: 0.34, rot: 0, w: 1.6, d: 0.45, kind: 'sideboard', label: 'Seb sideboard' },
  { name: 'Dining table', piece: 'diningTable', x: 5.0, z: 4.6, rot: 90, w: 1.8, d: 0.9, kind: 'dining-table' },
  ...[4.0, 4.6, 5.2].map((z) => ({ name: 'Dining chair', piece: 'diningChair', x: 4.1, z, rot: 90, w: 0.45, d: 0.5, kind: 'dining-chair' })),
  ...[4.3, 4.9].map((z) => ({ name: 'Dining chair', piece: 'diningChair', x: 5.9, z, rot: -90, w: 0.45, d: 0.5, kind: 'dining-chair' })),
  { name: 'High chair', piece: 'trippTrapp', x: 5.0, z: 5.85, rot: 180, w: 0.46, d: 0.5, kind: 'high-chair' },
  // Master bedroom
  { name: 'King bed', piece: 'greyBed', x: 12.9, z: 6.43, rot: 0, w: 1.97, d: 2.24, kind: 'bed' },
  // The baby's crib, at the foot of the king bed, clear of the wardrobe, door and windows
  { name: 'Crib', piece: 'crib', x: 12.8, z: 8.55, rot: 0, w: 1.27, d: 0.74, kind: 'crib', label: 'Crib' },
  { name: 'Nightstand', piece: 'nightstand', x: 11.62, z: 5.53, rot: 0, w: 0.5, d: 0.42, kind: 'nightstand' },
  { name: 'Nightstand', piece: 'nightstand', x: 14.2, z: 5.53, rot: 0, w: 0.5, d: 0.42, kind: 'nightstand' },
  // Bedroom 2: the queen bed under the window, TV at the foot, clear of the door swing
  { name: 'Queen bed', piece: 'whiteBed', x: 10.835, z: 1.155, rot: 0, w: 1.76, d: 2.09, kind: 'bed', label: 'MALM queen bed' },
  { name: 'Nightstand', piece: 'nightstandSmall', x: 11.945, z: 0.32, rot: 0, w: 0.4, d: 0.4, kind: 'nightstand' },
  { name: 'Lamp', piece: 'tableLamp', x: 11.945, z: 0.32, rot: 0, y: 0.55, w: 0.38, d: 0.38, kind: 'other' },
  { name: 'TV on stand', piece: 'tvOnStand', x: 11.3, z: 3.015, rot: 180, w: 1.0, d: 0.45, kind: 'tv' },
  // Bedroom 3: kids' room, two junior beds side by side with the book display between them
  { name: 'Kids bed', piece: 'kidsBed', x: 12.865, z: 2.665, rot: 0, w: 0.77, d: 1.67, kind: 'bed', label: 'Kids bed', color: 'mint' },
  { name: 'Kids bed', piece: 'kidsBed', x: 14.465, z: 2.665, rot: 0, w: 0.77, d: 1.67, kind: 'bed', label: 'Kids bed', color: 'pink' },
  { name: 'Book display', piece: 'bookDisplay', x: 13.665, z: 1.98, rot: 0, w: 0.7, d: 0.3, kind: 'bookcase' },
  { name: 'Play mat', piece: 'playMat', x: 13.4, z: 4.35, rot: 0, w: 2.0, d: 1.4, kind: 'rug' },
  { name: 'Kids wardrobe', piece: 'kidsWardrobe', x: 14.6, z: 4.94, rot: 180, w: 0.6, d: 0.5, kind: 'wardrobe' },
  { name: 'Glider', piece: 'glider', x: 11.95, z: 4.75, rot: 90, w: 0.8, d: 0.76, kind: 'armchair' },
  { name: 'Glider ottoman', piece: 'gliderOttoman', x: 12.75, z: 4.75, rot: 90, w: 0.5, d: 0.4, kind: 'ottoman' },
  // Study
  { name: 'Desk', piece: 'desk', x: 8.6, z: 11.08, rot: 180, w: 1.2, d: 0.6, kind: 'desk', label: 'White desk' },
  { name: 'Printer cart', piece: 'printerCart', x: 9.55, z: 11.13, rot: 180, w: 0.42, d: 0.45, kind: 'cabinet' },
  { name: 'Office chair', piece: 'officeChair', x: 8.6, z: 10.4, rot: 0, w: 0.62, d: 0.62, kind: 'office-chair' },
  { name: 'Side chair', piece: 'diningChair', x: 9.75, z: 9.6, rot: -60, w: 0.45, d: 0.5, kind: 'dining-chair' },
  { name: 'Filing cabinet', piece: 'fileCabinet', x: 9.92, z: 8.6, rot: -90, w: 0.45, d: 0.6, kind: 'cabinet' },
  { name: 'Whiteboard', piece: 'easel', x: 7.35, z: 9.7, rot: 100, w: 0.62, d: 0.55, oz: -0.075, kind: 'other' },
]
