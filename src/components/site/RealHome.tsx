// Real Doddmane home — ported from ragwhoo/doddamane (Next.js) into this Vite
// app. Home hero (herobg parallax zoom + leaf reveal + centre logo + text.png)
// and the homepage sections. Navigation lives in the persistent SiteNav bar,
// so the hero carries only the brand, the tagline and the order CTA.
import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { navigate } from '../../lib/router'
import RealSections from './RealSections'

export function RealHome({ playIntro = true }: { playIntro?: boolean }) {
  const introPlayedRef = useRef(false)

  // Settled-state helper: when the intro should not play (already shown via
  // the 3D journey, or a later visit this session) render the hero as it looks
  // once the leaf reveal has finished.
  const setSettled = () => {
    const overlay = document.querySelector('[data-leaf-overlay]')
    if (overlay) (overlay as HTMLElement).style.display = 'none'
    const hero = document.querySelector('[data-hero]')
    if (!hero) return
    const set = (sel: string, prop: string, val: string) => {
      const el = hero.querySelector(sel)
      if (el) (el as HTMLElement).style[prop as never] = val
    }
    set('.hero-text', 'opacity', '1')
    set('.centre-logo', 'transform', 'none')
  }

  useLayoutEffect(() => {
    const mainRoot = document.querySelector('.real-site')
    const overlay = document.querySelector('[data-leaf-overlay]')
    const hero = document.querySelector('[data-hero]')
    if (!mainRoot || !overlay || !hero) return
    const heroBg = document.querySelector('[data-hero-bg]')
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')

    // Play the leaf intro only once; on any return to Home render the settled
    // state directly so the hero never gets stuck on the leaves.
    const shouldPlay = playIntro && !introPlayedRef.current
    if (!shouldPlay || mq.matches) {
      setSettled()
      introPlayedRef.current = true
      return
    }
    introPlayedRef.current = true

    if (!heroBg) return
    const ctx = gsap.context(() => {
      gsap.set(heroBg, { scale: 1.15 })
      gsap.set('.centre-logo', { y: '-100vh' })

      const tl = gsap.timeline({
        defaults: { ease: 'power3.inOut', duration: 1.4 },
        delay: 0.3,
      })

      tl.to('.leaf-left', { xPercent: -100 }, 0.1)
        .to('.leaf-right', { xPercent: 100 }, 0)
        .call(() => {
          ;(overlay as HTMLElement).style.display = 'none'
        }, undefined, 1.4)
        .to(heroBg, { scale: 1, duration: 1.4, ease: 'power2.inOut' }, 0)
        .fromTo(
          '.hero-text',
          { opacity: 0 },
          { opacity: 1, duration: 0.6, ease: 'power2.out' },
          1.4,
        )
        .to('.centre-logo', { y: '0vh', duration: 1, ease: 'power3.out' }, 1.4)
    }, mainRoot)

    return () => ctx.revert()
  }, [playIntro])

  return (
    <main className="real-site">
      <section data-hero className="real-hero">
        <div data-hero-bg className="real-hero-bg" />
        <div data-leaf-overlay className="real-leaf">
          <img src="/34.png" alt="left leaf" className="leaf-left" />
          <img src="/35.png" alt="right leaf" className="leaf-right" />
        </div>
        <div className="real-logo-wrap">
          <img src="/centre-logo.png" alt="centre logo" className="centre-logo" />
        </div>
        <div className="real-hero__group">
          <div className="real-hero-text">
            <img
              src="/text.png"
              alt="text"
              className="hero-text real-hero-text__img"
            />
          </div>
          <button
            type="button"
            className="real-hero__cta"
            onClick={() => navigate('/order')}
          >
            Order now
          </button>
        </div>
      </section>

      <RealSections onOrder={() => navigate('/order')} />
    </main>
  )
}