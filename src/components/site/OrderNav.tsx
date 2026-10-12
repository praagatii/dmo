// Standalone square navigation for the ordering pages. Visually and
// behaviourally identical to the homepage hero nav: the green square expands
// into the full-screen menu with Home / Menu / Our Story / Locations.
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
      <button
        type="button"
        className="real-square"
        style={
          open ? { transform: `scale(${menuScale})`, borderRadius: 0 } : undefined
        }
        onClick={() => setOpen((v) => !v)}
        aria-label="menu"
      />
      {open && <SquareMenuOverlay onPick={pick} onClose={() => setOpen(false)} />}
    </>
  )
}