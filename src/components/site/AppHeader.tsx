import { useState } from 'react'
import { Link, useRoute } from '../../lib/router'
import { useCart } from '../../lib/cart'
import { restaurant } from '../../data/restaurant'

// One global navigation bar, reused on every page (home and ordering included)
// so the site never changes chrome mid-flow. About / Locations / Contact are
// sections on the homepage, so those links scroll to anchors on "/".
const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/order', label: 'Menu' },
  { to: '/', section: 'story', label: 'Our Story' },
  { to: '/', section: 'locations', label: 'Locations' },
  { to: '/', section: 'contact', label: 'Contact' },
]

export function AppHeader() {
  const route = useRoute()
  const { count } = useCart()
  const [open, setOpen] = useState(false)

  return (
    <header className="app-header">
      <Link
        to="/"
        className="app-header__brand"
        aria-label="Dodda Mane Oota home"
      >
        <span className="app-header__mark" lang="kn" aria-hidden="true">
          ಊ
        </span>
        {restaurant.name}
      </Link>

      <nav className="app-header__nav" aria-label="Primary">
        {LINKS.map((l) => (
          <Link
            key={l.label}
            to={l.to}
            section={l.section}
            className={`app-header__link${
              !l.section && route === l.to ? ' is-active' : ''
            }`}
          >
            {l.label}
          </Link>
        ))}
      </nav>

      <div className="app-header__actions">
        <Link to="/cart" className="app-header__cart" aria-label="View cart">
          <span>Cart</span>
          {count > 0 && <span className="app-header__cart-count">{count}</span>}
        </Link>
        <Link to="/order" className="app-header__order">
          <span className="app-header__order-dot" aria-hidden="true" />
          Order online
        </Link>
      </div>

      <button
        type="button"
        className="app-header__burger"
        aria-expanded={open}
        aria-label="Menu"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="app-header__burger-line" />
        <span className="app-header__burger-line" />
        <span className="app-header__burger-line" />
      </button>

      {open && (
        <nav className="app-header__mobile" aria-label="Mobile">
          {LINKS.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              section={l.section}
              className="app-header__mobile-link"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <Link
            to="/order"
            className="app-header__mobile-link is-accent"
            onClick={() => setOpen(false)}
          >
            Order online
          </Link>
        </nav>
      )}
    </header>
  )
}