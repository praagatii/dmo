// Ordering-page chrome: the same square navigation as the homepage (green
// square expands into the full-screen menu) together with the centre logo, so
// every page shows the brand beside the existing nav.
import { useEffect, useState } from 'react'
import { navigate, navigateToSection } from '../../lib/router'
import {
  SquareMenuOverlay,
  useMenuScale,
  type SquareNavItem,
} from './SquareNav'

export function OrderNav() {
  const [open, setOpen] = useState(false)
  const menuScale = useMenuScale()

  // While the full-screen nav is open, freeze background scrolling.
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  const pick = (item: SquareNavItem) => {
    setOpen(false)
    if (item.section) navigateToSection('/', item.section)
    else if (item.to) navigate(item.to)
  }

  return (
    <>
      <header className="order-nav">
        <a
          className="order-nav__brand"
          href="#/"
          aria-label="Dodda Mane Oota — home"
          onClick={(e) => {
            e.preventDefault()
            navigate('/')
          }}
        >
          <img
            src="/centre-logo.png"
            alt="Dodda Mane Oota"
            className="order-nav__logo"
          />
        </a>
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
      </header>
      {open && <SquareMenuOverlay onPick={pick} onClose={() => setOpen(false)} />}
    </>
  )
}