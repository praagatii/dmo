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
  /** Public URL of the colour image. */
  file: string
  /** Public URL of the matching monochrome depth map (white = near). */
  depth: string
  /** What the layer depicts. */
  role: string
  /** World-space z of the doorway (far end of the corridor). */
  z: number
  /** Original filename (provenance). */
  source: string
}

export const LAYERS: LayerDef[] = [
  {
    id: 'BG',
    file: '/bg1.png',
    depth: '/bgdm1.png',
    role: 'Golden Heritage Hallway (depth-extruded corridor)',
    z: -50,
    source: 'bg1.png',
  },
]
