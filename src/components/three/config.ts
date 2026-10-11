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
   * width, giving a pronounced walk-in zoom. The camera always stays well
   * in front of the plane.
   */
  cameraEndZ: -24,
  nearPlane: 0.1,
  farPlane: 400,
  /** Per-unit plane height factor: 2 * tan(fov/2). */
  viewScale: 2 * Math.tan((50 * Math.PI) / 360),
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
   * camera can pan without ever exposing a gap at the edges.
   */
  margin: 1.12,
  /** How much the camera gaze steers with the cursor (0 = eyes straight). */
  look: 0.5,
}