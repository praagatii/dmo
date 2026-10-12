import { useCart } from '../../lib/cart'
import { inr } from '../../lib/format'
import { Link, navigate } from '../../lib/router'

export function CartPage() {
  const { lines, subtotal, count, setQty, remove } = useCart()

  if (count === 0) {
    return (
      <main className="page page--cart">
        <div className="empty-state">
          <p className="empty-state__kn" lang="kn">
            ಖಾಲಿ
          </p>
          <h1>Your cart is empty</h1>
          <p>Add a few dishes from the menu and they will show up here.</p>
          <Link to="/order" className="btn btn--primary">
            Browse the menu
          </Link>
        </div>
      </main>
    )
  }

  const total = subtotal

  return (
    <main className="page page--cart">
      <header className="page-head">
        <h1 className="page-title">Your cart</h1>
        <p className="page-sub">
          {count} item{count > 1 ? 's' : ''}
        </p>
      </header>

      <div className="cart-layout">
        <ul className="cart-list">
          {lines.map((l) => (
            <li key={l.id} className="cart-line">
              <img className="cart-line__img" src={l.image} alt="" />
              <div className="cart-line__main">
                <h2 className="cart-line__name">{l.name}</h2>
                <span className="cart-line__unit">{inr(l.price)} each</span>
              </div>
              <div
                className="qty"
                role="group"
                aria-label={`Quantity for ${l.name}`}
              >
                <button
                  type="button"
                  onClick={() => setQty(l.id, l.qty - 1)}
                  aria-label="Decrease quantity"
                >
                  &minus;
                </button>
                <span aria-live="polite">{l.qty}</span>
                <button
                  type="button"
                  onClick={() => setQty(l.id, l.qty + 1)}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              <span className="cart-line__total">{inr(l.price * l.qty)}</span>
              <button
                type="button"
                className="cart-line__remove"
                onClick={() => remove(l.id)}
                aria-label={`Remove ${l.name}`}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>

        <aside className="summary" aria-label="Order summary">
          <h2 className="summary__title">Summary</h2>
          <div className="summary__row">
            <span>Subtotal</span>
            <span>{inr(subtotal)}</span>
          </div>
          <div className="summary__row">
            <span>Taxes &amp; charges</span>
            <span className="summary__muted">Not configured</span>
          </div>
          <div className="summary__row summary__row--total">
            <span>Total</span>
            <span>{inr(total)}</span>
          </div>
          <button
            type="button"
            className="btn btn--primary btn--block"
            onClick={() => navigate('/checkout')}
          >
            Proceed to checkout
          </button>
          <Link to="/order" className="btn btn--ghost btn--block">
            Add more items
          </Link>
        </aside>
      </div>
    </main>
  )
}
