// Persistent top navigation shown on every page (homepage and ordering flow).
// A dark-green bar with the centre logo on the left and the page / section
// links on the right. On small screens the links collapse into a burger panel.
import { useState } from 'react'
import { Link, useRoute } from '../../lib/router'

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/order', label: 'Menu' },
  { to: '/', section: 'story', label: 'Our Story' },
  { to: '/', section: 'locations', label: 'Locations' },
  { to: '/', section: 'contact', label: 'Contact' },
]

export function SiteNav() {
  const route = useRoute()
  const [open, setOpen] = useState(false)

  return (
    <header className="site-nav">
      <Link to="/" className="site-nav__brand" onClick={() => setOpen(false)}>
        <img src="/centre-logo.png" alt="Dodda Mane Oota" className="site-nav__logo" />
      </Link>

      <nav className="site-nav__links" aria-label="primary">
        {LINKS.map((link) => {
          const active = !link.section && route === link.to
          return (
            <Link
              key={link.label}
              to={link.to}
              section={link.section}
              className={`site-nav__link${active ? ' is-active' : ''}`}
            >
              {link.label}
            </Link>
          )
        })}
      </nav>

      <button
        type="button"
        className={`site-nav__burger${open ? ' is-open' : ''}`}
        onClick={() => setOpen((v) => !v)}
        aria-label="menu"
        aria-expanded={open}
      >
        <span />
        <span />
        <span />
      </button>

      {open && (
        <nav className="site-nav__panel" onClick={() => setOpen(false)}>
          {LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              section={link.section}
              className="site-nav__panel-link"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}