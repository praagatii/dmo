/**
 * Geometry for the depth-extruded corridor background.
 *
 * The hallway image is mapped onto a fine grid and every vertex is pushed
 * toward the camera by its depth value (white = near), so the picture stops
 * being a flat card and becomes a real 3D corridor: the floor, walls and
 * ceiling nearest the viewer come right up to the camera while the far
 * doorway recedes. Scrolling flies the camera forward along -Z — in from the
 * corridor mouth toward the doorway — so the movement reads as walking into a
 * room rather than zooming into a picture.
 */
export const CORRIDOR = {
  /** Vertical field of view matching the master image's proportions. */
  fov: 50,
  /** Master image aspect ratio (1672 / 941). */
  imageAspect: 1672 / 941,
  /** Camera enters at the corridor mouth and ends just short of the doorway. */
  cameraStartZ: 8,
  cameraEndZ: -34,
  /**
   * Far end of the corridor (the doorway / back wall) in world z. The camera
   * never reaches it, so there is always corridor ahead of the viewer.
   */
  doorwayZ: -50,
  /**
   * How far the near rim of the image — its border, i.e. the floor and walls
   * right at the viewer — is pulled toward the camera. This is the corridor's
   * length: the larger it is beside the image's width, the deeper the hallway
   * feels (and the stronger the motion parallax as the camera advances).
   */
  tunnelDepth: 40,
  nearPlane: 0.1,
  farPlane: 400,
  /** Per-unit plane height factor: 2 * tan(fov/2). */
  viewScale: 2 * Math.tan((50 * Math.PI) / 360),
  /**
   * Where the corridor's vanishing point sits in the reference image, as a
   * fraction from the top (measured from the depth map: the far doorway is at
   * ~0.43). The corridor is nudged so this lands on the camera's level line,
   * so the hallway recedes straight ahead instead of skewing up the frame.
   */
  horizonRow: 0.43,
}

export const PALETTE = {
  background: '#160b06',
  gold: '#d3a04a',
  lamp: '#ffcf8e',
  terracotta: '#e07a38',
}

/**
 * Cursor parallax for the hero background. The camera translates a little
 * with the pointer and its gaze steers slightly, so the corridor appears to
 * shift with the cursor (a small real camera move, not a fake layer offset).
 */
export const PARALLAX = {
  /** Camera travel (world units) at the cursor extremes (-1..1). */
  pan: 0.6,
  /**
   * The corridor sheet is mapped a little larger than the exact fill so the
   * camera can pan without ever exposing a gap at the frame edges.
   */
  margin: 1.1,
  /** How much the camera gaze steers with the cursor (0 = eyes straight). */
  look: 0.5,
}

/**
 * Depth-map displacement grid. The corridor surface is rebuilt as a fine grid
 * sampled from the depth map; each vertex is pushed toward the camera by
 * CORRIDOR.tunnelDepth.
 */
export const DEPTH = {
  /** Grid segments across the image width (height is derived from aspect). */
  segments: 192,
  /** Resolution at which the depth map is sampled to build geometry. */
  grid: 256,
}
