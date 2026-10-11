/**
 * Shared, mutable scroll state read by the R3F render loop.
 * GSAP ScrollTrigger writes to it; three/useFrame reads from it.
 * Kept outside React state on purpose — this updates every scroll frame.
 */
export const scrollState = {
  /** 0 at the top of the journey, 1 at the end (through the doorway). */
  progress: 0,
  /** Cinematic opening: 0 = curtain closed/still, 1 = fully inside. */
  intro: 0,
}

export function resetScroll() {
  scrollState.progress = 0
  scrollState.intro = 0
}

/** Section station positions along the journey (0..1). */
export function stationFor(index: number, total: number): number {
  if (total <= 1) return 0
  return index / (total - 1)
}
