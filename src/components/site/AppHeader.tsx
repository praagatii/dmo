import { Link, useRoute } from '../../lib/router'
import { useCart } from '../../lib/cart'
import { restaurant } from '../../data/restaurant'

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/branches', label: 'Branches' },
]

export function AppHeader() {
  const route = useRoute()
  const { count } = useCart()

  return (
    <header className="app-header">
      <Link to="/" className="app-header__brand" aria-label="Doddmane Oota home">
        <span className="app-header__mark" lang="kn">
          ಊ
        </span>
        <span className="app-header__name">
          {restaurant.name}
          <small lang="kn">{restaurant.nameKannada}</small>
        </span>
      </Link>

      <nav className="app-header__nav" aria-label="Primary">
        {LINKS.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className={`app-header__link${route === l.to ? ' is-active' : ''}`}
          >
            {l.label}
          </Link>
        ))}
      </nav>

      <div className="app-header__actions">
        <Link to="/order" className="app-header__order">
          Order Now
        </Link>
        <Link to="/cart" className="app-header__cart" aria-label="View cart">
          <span>Cart</span>
          {count > 0 && <span className="app-header__cart-count">{count}</span>}
        </Link>
      </div>
    </header>
  )
}
