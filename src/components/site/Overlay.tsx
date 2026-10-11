import { useEffect, useRef } from 'react'
import { navSections } from '../../data/restaurant'
import { sectionRenderers } from './Sections'

interface OverlayProps {
  listenerRef: React.RefObject<((progress: number) => void) | null>
}

type InertElement = HTMLElement & { inert: boolean }

/**
 * HTML content laid over the 3D scene. Panels fade and slide as the camera
 * passes each arch, but the markup itself is plain, readable, accessible DOM.
 */
export function Overlay({ listenerRef }: OverlayProps) {
  const panels = useRef<(HTMLElement | null)[]>([])
  const count = navSections.length

  useEffect(() => {
    const update = (p: number) => {
      for (let i = 0; i < count; i++) {
        const el = panels.current[i]
        if (!el) continue
        const station = i / (count - 1)
        const half = 0.62 / (count - 1)

        let o: number
        if (i === 0) {
          o = p <= station + half ? 1 : 1 - (p - station - half) / half
        } else if (i === count - 1) {
          o = p >= station - half ? 1 : 1 - (station - half - p) / half
        } else {
          o = 1 - Math.abs(p - station) / half
        }
        o = Math.min(1, Math.max(0, o))
        const eased = o * o * (3 - 2 * o)

        const dir = i % 2 === 0 ? -1 : 1
        const shift = (1 - eased) * 30
        el.style.opacity = String(eased)
        el.style.transform = `translate3d(${dir * shift}px, ${(1 - eased) * 22}px, 0)`
        el.style.visibility = eased < 0.01 ? 'hidden' : 'visible'

        const interactive = eased > 0.55
        el.style.pointerEvents = interactive ? 'auto' : 'none'
        ;(el as InertElement).inert = !interactive
      }
    }

    listenerRef.current = update
    update(0)
    return () => {
      listenerRef.current = null
    }
  }, [count, listenerRef])

  return (
    <div className="overlay">
      {navSections.map((section, i) => {
        const Render = sectionRenderers[section.id]
        const isHero = section.id === 'hero'
        return (
          <section
            key={section.id}
            id={section.id}
            ref={(el) => {
              panels.current[i] = el
            }}
            className={[
              'panel',
              isHero ? 'panel--hero' : 'panel--card',
              i % 2 === 0 ? 'panel--left' : 'panel--right',
            ].join(' ')}
            style={{ opacity: i === 0 ? 1 : 0 }}
          >
            <div className="panel__inner">{Render ? <Render /> : null}</div>
          </section>
        )
      })}
    </div>
  )
}
