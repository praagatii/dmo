// Real Doddmane home — ported from ragwhoo/doddamane (Next.js) into this Vite
// app. Home hero (herobg parallax zoom + leaf reveal + centre logo + text.png)
// with the dark green nav-square that expands into a full-screen menu.
//
// Navigation items reflect the current site structure: Home + Menu are
// routes (Menu is the only separate page), while Our Story and Locations are
// sections on the homepage that the menu smooth-scrolls to.
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { navigate, navigateToSection } from '../../lib/router'
import RealSections from './RealSections'
import {
  SquareMenuOverlay,
  useMenuScale,
  type SquareNavItem,
} from './SquareNav'

export function RealHome({ playIntro = true }: { playIntro?: boolean }) {
  const [open, setOpen] = useState(false)
  const menuScale = useMenuScale()

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
    set('.real-square', 'opacity', '1')
    set('.centre-logo', 'transform', 'none')
  }

  // While the full-screen nav is open, freeze background scrolling.
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  const introPlayedRef = useRef(false)

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
      gsap.set('.real-square', { opacity: 0 })

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
        .to('.real-square', { opacity: 1, duration: 0.4, ease: 'power2.out' }, 2.4)
    }, mainRoot)

    return () => ctx.revert()
  }, [playIntro])

  const pick = (item: SquareNavItem) => {
    setOpen(false)
    if (item.section) navigateToSection('/', item.section)
    else if (item.to) navigate(item.to)
  }

  return (
    <main className="real-site">
      <section data-hero className="real-hero">
        <div data-hero-bg className="real-hero-bg" />
        <div data-leaf-overlay className="real-leaf">
          <img src="/34.png" alt="left leaf" className="leaf-left" />
          <img src="/35.png" alt="right leaf" className="leaf-right" />
        </div>
        <div
          className={`real-logo-wrap${open ? ' real-logo-wrap--hidden' : ''}`}
          onClick={() => setOpen((v) => !v)}
        >
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

      <button
        type="button"
        className="real-square"
        style={
          open
            ? { transform: `scale(${menuScale})`, borderRadius: 0 }
            : undefined
        }
        onClick={() => setOpen((v) => !v)}
        aria-label="menu"
      />

      {open && (
        <SquareMenuOverlay onPick={pick} onClose={() => setOpen(false)} />
      )}
    </main>
  )
}