/**
 * Geometry for the single-image corridor background.
 *
 * The scene shows one full-frame image on one plane, centred on the camera
 * axis and parallel to the viewport. The plane is sized so that from the
 * start camera (z = 0) it exactly fills the window, edge to edge. Scrolling
 * moves the camera forward along -Z, so the image smoothly enlarges — a
 * deterministic walk-in zoom driven by scroll progress (see CameraRig).
 */
export const CORRIDOR = {
  /** Vertical field of view matching the master image's proportions. */
  fov: 50,
  /** Master image aspect ratio (1672 / 941). */
  imageAspect: 1672 / 941,
  /** Camera starts level at the vanishing point height (0). */
  cameraStartZ: 0,
  /**
   * Forward travel. The single background plane sits at z = -40 and fills
   * the viewport at the start camera (z = 0). Advancing to cameraEndZ dolls
   * in toward the image: at full scroll the plane is (40/16) = 2.5x screen
   * width, a pronounced walk-in zoom. Depth relief is mild (DEPTH.amplitude
   * 3.5) so the enlarged foreground stays clean.
   */
  cameraEndZ: -24,
  nearPlane: 0.1,
  farPlane: 400,
  /** Per-unit plane height factor: 2 * tan(fov/2). */
  viewScale: 2 * Math.tan((50 * Math.PI) / 360),
  /**
   * Where the corridor's vanishing point sits in the reference image, as a
   * fraction from the top (measured from the depth map: the far doorway is at
   * ~0.43). The backdrop is nudged so this lands on the camera's level line;
   * otherwise the level camera reads as a slight downward tilt ("lifted").
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
 * with the pointer and its gaze steers slightly, so the image appears to
 * shift with the cursor (a small real camera move, not a fake layer offset).
 */
export const PARALLAX = {
  /** Camera travel (world units) at the cursor extremes (-1..1). */
  pan: 0.6,
  /**
   * The plane is drawn this many times larger than the exact fill so the
   * camera can pan without ever exposing a gap at the edges (and so the
   * horizon nudge below still leaves the top edge covered).
   */
  margin: 1.18,
  /** How much the camera gaze steers with the cursor (0 = eyes straight). */
  look: 0.5,
}

/**
 * Depth-map displacement. The background plane is rebuilt as a fine grid and
 * each vertex is pushed toward the camera (positive z) by its depth value, so
 * white (near) parts of the corridor stand proud and dark (far) parts recede.
 * The hallway image is mapped onto the same surface, giving true per-pixel
 * parallax under the cursor and the scroll dolly.
 */
export const DEPTH = {
  /** Base depth of the backdrop grid (world z). */
  planeZ: -40,
  /**
   * How far (world units) the nearest depth value (white) is pulled from the
   * base toward the camera. Kept small: enough relief for the hallway to
   * parallax convincingly as the cursor moves, without re-projecting the
   * image so far it warps the flat reference look.
   */
  amplitude: 3.5,
  /** Grid segments across the image width (height is derived from aspect). */
  segments: 192,
  /** Resolution at which the depth map is sampled to build geometry. */
  grid: 256,
}