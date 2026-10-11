import { navSections, restaurant } from '../../data/restaurant'
import { goToSection } from '../../lib/nav'

interface NavProps {
  active: number
  canRender3D: boolean
  show3D: boolean
  onToggle: () => void
}

export function Nav({ active, canRender3D, show3D, onToggle }: NavProps) {
  return (
    <header className="nav">
      <button className="nav__brand" type="button" onClick={() => goToSection('hero')}>
        <span className="nav__brand-mark" aria-hidden="true" lang="kn">
          ಊ
        </span>
        <span className="nav__brand-text">
          {restaurant.name}
          <small lang="kn">ದೊಡ್ಡ ಮನೆ ಊಟ</small>
        </span>
      </button>

      <nav className="nav__links" aria-label="Sections">
        {navSections.map((section, i) => (
          <button
            key={section.id}
            type="button"
            className={`nav__dot${i === active ? ' is-active' : ''}`}
            onClick={() => goToSection(section.id)}
            aria-current={i === active ? 'true' : undefined}
          >
            <span className="nav__dot-label">{section.label}</span>
          </button>
        ))}
      </nav>

      <div className="nav__aside">
        {canRender3D && (
          <button className="nav__toggle" type="button" onClick={onToggle}>
            {show3D ? 'Simple view' : 'Enter 3D'}
          </button>
        )}
        <a className="nav__call" href={`tel:${restaurant.verified.phoneHref}`}>
          Call
        </a>
      </div>
    </header>
  )
}
