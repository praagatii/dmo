import { useEffect, useRef, useState } from 'react'
import { Nav } from './Nav'
import { sectionRenderers } from './Sections'
import { navSections, restaurant } from '../../data/restaurant'

interface StaticSiteProps {
  canRender3D: boolean
  onEnter: () => void
}

export function StaticSite({ canRender3D, onEnter }: StaticSiteProps) {
  const [active, setActive] = useState(0)
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const sections = rootRef.current?.querySelectorAll<HTMLElement>('[data-section]')
    if (!sections?.length) return
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number((entry.target as HTMLElement).dataset.index)
            setActive(idx)
          }
        })
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    )
    sections.forEach((s) => obs.observe(s))
    return () => obs.disconnect()
  }, [])

  return (
    <div className="static">
      <Nav active={active} canRender3D={canRender3D} show3D={false} onToggle={onEnter} />

      <main ref={rootRef}>
        {navSections.map((section, i) => {
          const Render = sectionRenderers[section.id]
          const isHero = section.id === 'hero'
          return (
            <section
              key={section.id}
              id={section.id}
              data-section
              data-index={i}
              className={isHero ? 'static-hero' : `static-section static-section--${i % 2 === 0 ? 'a' : 'b'}`}
            >
              {isHero && <div className="static-hero__tunnel" aria-hidden="true" />}
              <div className={isHero ? 'static-hero__inner' : 'static-card'}>
                {Render ? <Render /> : null}
              </div>
            </section>
          )
        })}
      </main>

      <footer className="static-footer">
        <p>
          {restaurant.name} · <span lang="kn">{restaurant.nameKannada}</span> ·{" "}
          {restaurant.verified.area}, {restaurant.verified.city}
        </p>
        <p className="static-footer__note">
          Independent showcase. Details sourced from public listings and the
          restaurant’s Instagram; please confirm with the restaurant.
        </p>
      </footer>
    </div>
  )
}
