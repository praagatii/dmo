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

const STAGGER = 0.035

interface NavItem {
  name: string
  to?: string
  section?: string
}

const NAV_ITEMS: NavItem[] = [
  { name: 'Home', to: '/' },
  { name: 'Menu', to: '/order' },
  { name: 'Our Story', section: 'story' },
  { name: 'Locations', section: 'locations' },
]

function TextRoll({ children }: { children: string }) {
  const chars = children.split('')
  const delay = (i: number) =>
    `${(STAGGER * Math.abs(i - (chars.length - 1) / 2)).toFixed(3)}s`
  return (
    <span className="real-roll group-roll">
      <span>
        {chars.map((l, i) => (
          <span
            key={`a${i}`}
            className="real-roll__a"
            style={{ transitionDelay: delay(i) }}
          >
            {l}
          </span>
        ))}
      </span>
      <span>
        {chars.map((l, i) => (
          <span
            key={`b${i}`}
            className="real-roll__b"
            style={{ transitionDelay: delay(i) }}
          >
            {l}
          </span>
        ))}
      </span>
    </span>
  )
}

function MenuOverlay({
  onPick,
  onClose,
}: {
  onPick: (item: NavItem) => void
  onClose: () => void
}) {
  return (
    <div
      className="real-menu-overlay"
      onClick={(e) => {
        e.stopPropagation()
        onClose()
      }}
    >
      <ul className="real-menu-list">
        {NAV_ITEMS.map((item) => (
          <li key={item.name} className="real-menu-item">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onPick(item)
              }}
            >
              <TextRoll>{item.name}</TextRoll>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function RealHome({ playIntro = true }: { playIntro?: boolean }) {
  const [open, setOpen] = useState(false)
  const [menuScale, setMenuScale] = useState(40)

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

  useEffect(() => {
    const vw = window.innerWidth
    const vh = window.innerHeight
    const cy = 16 + 36
    const dx = vw / 2
    const dy = Math.max(cy, vh - cy)
    setMenuScale(Math.ceil(Math.max(dx, dy) / 36) + 1)
  }, [])

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

  const pick = (item: NavItem) => {
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
        <MenuOverlay onPick={pick} onClose={() => setOpen(false)} />
      )}
    </main>
  )
}