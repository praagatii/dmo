/**
 * Asset manifest for the 12 supplied corridor layers (L1–L12).
 *
 * Re-audit (public/newlayers, all 1672x941 like the master reference):
 *  - Every file is Format32bppArgb with a genuine alpha channel — there is
 *    NO baked checkerboard in this set. L1, L2, L3 and L11 are painted on
 *    near-opaque dark grounds (the corridor's ambient shadow) with real
 *    transparency at their outlines; L4–L10 are alpha cutouts; L12 is a
 *    soft semi-transparent lighting/shadows wash (83.5% semi, 0% opaque).
 *
 * The originals are shipped bit-for-bit in public/newlayers and composed
 * with real alpha blending (no keying, no masking, no generated proxy).
 * z is the plane's world-space depth; the camera starts at
 * CORRIDOR.cameraStartZ (0) and travels forward to cameraEndZ.
 * Planes are listed far -> near; renderOrder equals z so the painter's
 * order matches the depth stack.
 */
export interface LayerDef {
  /** Layer id from the brief, e.g. "L1". */
  id: string
  /** Public URL of the unmodified image file. */
  file: string
  /** What the layer depicts, per the brief's mapping. */
  role: string
  /** World-space depth. More negative = farther from the start camera. */
  z: number
  /** Original filename from the supplied set (provenance). */
  source: string
}

export const LAYERS: LayerDef[] = [
  { id: 'L1', file: '/newlayers/l1.png', role: 'Door and back wall', z: -128, source: 'l1.png' },
  { id: 'L2', file: '/newlayers/l2.png', role: 'Rear arches and columns', z: -112, source: 'l2.png' },
  { id: 'L8', file: '/newlayers/l8.png', role: 'Left wall and niches', z: -100, source: 'l8.png' },
  { id: 'L9', file: '/newlayers/l9.png', role: 'Right wall and niches', z: -100, source: 'l9.png' },
  { id: 'L5', file: '/newlayers/l5.png', role: 'Ceiling and wooden beams', z: -96, source: 'l5.png' },
  { id: 'L6', file: '/newlayers/l6.png', role: 'Red carpet with gold borders', z: -90, source: 'l6.png' },
  { id: 'L7', file: '/newlayers/l7.png', role: 'Side flooring', z: -88, source: 'l7.png' },
  { id: 'L3', file: '/newlayers/l3.png', role: 'Middle arches and columns', z: -82, source: 'l3.png' },
  { id: 'L10', file: '/newlayers/l10.png', role: 'Hanging lamps and floor lamps', z: -76, source: 'l10.png' },
  { id: 'L11', file: '/newlayers/l11.png', role: 'Potted plants', z: -72, source: 'l11.png' },
  { id: 'L12', file: '/newlayers/l12.png', role: 'Lighting and shadows overlay', z: -44, source: 'l12.png' },
  { id: 'L4', file: '/newlayers/l4.png', role: 'Foreground arches and columns', z: -40, source: 'l4.png' },
]