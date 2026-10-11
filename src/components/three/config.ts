/**
 * Geometry for the layered (multiplane) corridor reconstruction.
 *
 * The experience is a stack of full-frame image planes, all sharing the
 * master image's 1672x941 aspect and its vanishing point at the frame
 * centre. Every plane is sized so that, from the start camera position,
 * it exactly fills the viewport — which means the starting composite is
 * pixel-identical to the master "Golden Heritage Hallway" reference.
 *
 * As the camera travels forward (z from 0 to cameraEndZ), near planes
 * grow much faster than far ones, so the foreground arch passes out of
 * view while the door slowly grows ahead — a deterministic function of
 * scroll progress (see CameraRig).
 */
export const CORRIDOR = {
  /** Vertical field of view matching the master image's proportions. */
  fov: 50,
  /** Master image aspect ratio (1672 / 941). */
  imageAspect: 1672 / 941,
  /** Camera starts level at the vanishing point height (0). */
  cameraStartZ: 0,
  cameraEndZ: -40,
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