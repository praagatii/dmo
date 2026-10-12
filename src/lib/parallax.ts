// Lightweight scroll parallax for images marked `[data-parallax]`.
//
// Each image is translated inside its (overflow-hidden) parent as the parent
// moves through the viewport, giving the image a slower, floating motion. The
// image is scaled up slightly so the translation never reveals an edge.
//
// Disabled for `prefers-reduced-motion: reduce`. Pure rAF + passive listeners,
// so it stays cheap; callers get a cleanup function.

const SELECTOR = '[data-parallax]'
const SCALE = 1.18
// Fraction of the container height the image travels each way. Must stay
// within the slack created by SCALE ((SCALE - 1) / 2 ≈ 0.09).
const RANGE = 0.08

export function initParallax(root: ParentNode = document): () => void {
  const imgs = Array.from(root.querySelectorAll<HTMLElement>(SELECTOR))
  if (imgs.length === 0) return () => {}

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return () => {}
  }

  const items = imgs.map((el) => ({
    el,
    container: el.parentElement ?? el,
  }))

  let frame = 0

  const update = () => {
    frame = 0
    const vh = window.innerHeight
    for (const { el, container } of items) {
      const rect = container.getBoundingClientRect()
      if (rect.bottom < 0 || rect.top > vh || rect.height === 0) continue
      // +1 when the container is below the viewport, −1 when above, 0 at centre.
      const progress =
        (rect.top + rect.height / 2 - vh / 2) / (vh / 2 + rect.height / 2)
      const y = -progress * rect.height * RANGE
      el.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0) scale(${SCALE})`
    }
  }

  const onScroll = () => {
    if (frame) return
    frame = requestAnimationFrame(update)
  }

  update()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll)

  return () => {
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onScroll)
    if (frame) cancelAnimationFrame(frame)
    for (const { el } of items) el.style.transform = ''
  }
}