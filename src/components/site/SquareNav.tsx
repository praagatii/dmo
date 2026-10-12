// Shared full-screen square navigation — identical on the homepage hero and
// every ordering page, so one navigation system is used everywhere.
import { useEffect, useState } from 'react'

export interface SquareNavItem {
  name: string
  to?: string
  section?: string
}

export const squareNavItems: SquareNavItem[] = [
  { name: 'Home', to: '/' },
  { name: 'Menu', to: '/order' },
  { name: 'Our Story', section: 'story' },
  { name: 'Locations', section: 'locations' },
]

const STAGGER = 0.035

export function TextRoll({ children }: { children: string }) {
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

export function SquareMenuOverlay({
  onPick,
  onClose,
}: {
  onPick: (item: SquareNavItem) => void
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
        {squareNavItems.map((item) => (
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

/** Expansion factor so the square covers the whole viewport when opened. */
export function useMenuScale(): number {
  const [menuScale, setMenuScale] = useState(40)
  useEffect(() => {
    const vw = window.innerWidth
    const vh = window.innerHeight
    const cy = 16 + 36
    const dx = vw / 2
    const dy = Math.max(cy, vh - cy)
    setMenuScale(Math.ceil(Math.max(dx, dy) / 36) + 1)
  }, [])
  return menuScale
}