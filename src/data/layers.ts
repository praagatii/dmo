/**
 * Asset manifest for the 12 supplied corridor layers (L1–L12).
 *
 * Audit findings (Desktop, all 1672x941, same as the master reference):
 *  - L1, L2, L3 carry a real alpha channel (transparency-free apart from
 *    their cutouts). No masking needed.
 *  - L4–L12 are flat RGB files with a Photoshop checkerboard BAKED into
 *    the background — there is no alpha channel. This includes L11 and
 *    L12, which on the Desktop are named "11.png" and "12.png".
 *
 * The baked checker cannot be treated as transparency, and the originals
 * may not be regenerated. The non-destructive solution used here is to
 * ship the originals bit-for-bit and key out the checker at render time
 * with a luminance/chroma test in a custom shader (see LayerPlane.tsx).
 */
export interface LayerDef {
  /** Layer id from the brief, e.g. "L1". */
  id: string
  /** Public URL of the unmodified image file. */
  file: string
  /** What the layer depicts, per the brief's mapping. */
  role: string
  /** World-space depth. Camera starts at z = CORRIDOR.cameraStartZ (0). */
  z: number
  /** true when the layer has a baked checkerboard that must be keyed. */
  key: boolean
  /** Optional additive blending for lighting overlays (L12). */
  blend?: 'additive'
  /** Opacity multiplier for blended layers. */
  opacity?: number
  /** Original filename on the Desktop (source of truth for provenance). */
  source: string
}

export const LAYERS: LayerDef[] = [
  { id: 'L1', file: '/layers/l1.png', role: 'Door and back wall', z: -128, key: false, source: 'l1.png' },
  { id: 'L2', file: '/layers/l2.png', role: 'Rear arches and columns', z: -105, key: false, source: 'l2.png' },
  { id: 'L3', file: '/layers/l3.png', role: 'Middle arches and columns', z: -78, key: false, source: 'l3.png' },
  { id: 'L4', file: '/layers/l4.png', role: 'Foreground arches and columns', z: -42, key: true, source: 'l4.png' },

  { id: 'L5', file: '/layers/l5.png', role: 'Ceiling and wooden beams', z: -90, key: true, source: 'l5.png' },
  { id: 'L6', file: '/layers/l6.png', role: 'Red carpet with gold borders', z: -88, key: true, source: 'l6.png' },
  { id: 'L7', file: '/layers/l7.png', role: 'Side flooring', z: -86, key: true, source: 'l7.png' },
  { id: 'L8', file: '/layers/l8.png', role: 'Left wall and niches', z: -65, key: true, source: 'l8.png' },
  { id: 'L9', file: '/layers/l9.png', role: 'Right wall and niches', z: -65, key: true, source: 'l9.png' },
  { id: 'L10', file: '/layers/l10.png', role: 'Hanging lamps and floor lamps', z: -72, key: true, source: 'l10.png' },
  { id: 'L11', file: '/layers/l11.png', role: 'Potted plants', z: -70, key: true, source: '11.png' },
  { id: 'L12', file: '/layers/l12.png', role: 'Lighting and shadows overlay', z: -45, key: true, blend: 'additive', opacity: 0.3, source: '12.png' },
]

/** Keying thresholds tuned against the baked checker tones (see audit):
 *  white squares ≈ 0.98 linear, grey squares ≈ 0.50–0.53 linear,
 *  while the artwork is either much darker or strongly warm-coloured. */
export const CHECKER_KEY = {
  lumLo: 0.48,
  lumHi: 0.93,
  chroma: 0.075,
}