/**
 * Scene assets.
 *
 * The 12-layer multiplane reconstruction was removed. The supplied layers
 * are artistic crops of a single viewpoint (their floor and ceiling vanish
 * to opposite points), so they cannot be re-projected through a moving
 * camera. The scene now uses the single full reference image on one plane.
 */
export interface LayerDef {
  /** Layer id. */
  id: string
  /** Public URL of the image file. */
  file: string
  /** What the layer depicts. */
  role: string
  /** World-space depth. Camera starts at z = CORRIDOR.cameraStartZ (0). */
  z: number
  /** Original filename (provenance). */
  source: string
}

export const LAYERS: LayerDef[] = [
  {
    id: 'BG',
    file: '/layers/golden-heritage-hallway.png',
    role: 'Golden Heritage Hallway (single reference image)',
    z: -40,
    source: 'golden-heritage-hallway.png',
  },
]
