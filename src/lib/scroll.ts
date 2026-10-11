/**
 * Shared, mutable scroll state read by the R3F render loop.
 * GSAP ScrollTrigger writes to it; three/useFrame reads from it.
 * Kept outside React state on purpose — this updates every scroll frame.
 */
export const scrollState = {
  /** 0 at the top of the journey, 1 at the end (through the doorway). */
  progress: 0,
  /**
   * Smoothed progress: glides toward `progress` on the GSAP ticker each
   * frame, so the camera moves at a steady 60fps glide rather than tracking
   * the raw scroll position (which is what makes the view look glitchy).
   */
  smooth: 0,
  /** Cinematic opening: 0 = curtain closed/still, 1 = fully inside. */
  intro: 0,
  /** Cursor position in -1..1 (x right, y up) for the hero parallax. */
  pointerX: 0,
  pointerY: 0,
}

/**
 * How quickly the smoothed progress catches up with the raw scroll.
 * Higher = snappier, lower = floatier.
 */
export const SCROLL_RESPONSE = 7

export function resetScroll() {
  scrollState.progress = 0
  scrollState.smooth = 0
  scrollState.intro = 0
  scrollState.pointerX = 0
  scrollState.pointerY = 0
}

/** Normalise window cursor coordinates into -1..1 and share them. */
export function updatePointer(clientX: number, clientY: number) {
  scrollState.pointerX = (clientX / window.innerWidth) * 2 - 1
  scrollState.pointerY = -((clientY / window.innerHeight) * 2 - 1)
}

/** Frame-rate independent easing of `smooth` toward the raw `progress`. */
export function smoothScrollStep(dtSeconds: number) {
  const f = 1 - Math.exp(-dtSeconds * SCROLL_RESPONSE)
  scrollState.smooth += (scrollState.progress - scrollState.smooth) * f
}

/** Section station positions along the journey (0..1). */
export function stationFor(index: number, total: number): number {
  if (total <= 1) return 0
  return index / (total - 1)
}
