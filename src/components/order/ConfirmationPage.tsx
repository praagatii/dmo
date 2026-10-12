import { restaurant } from '../../data/restaurant'
import { inr } from '../../lib/format'
import { Link } from '../../lib/router'
import { readOrder } from '../../lib/order'

function formatDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function ConfirmationPage() {
  const order = readOrder()

  if (!order) {
    return (
      <main className="page page--confirmation">
        <div className="empty-state">
          <h1>No order to show</h1>
          <p>We could not find a recent order in this session.</p>
          <Link to="/order" className="btn btn--primary">
            Start an order
          </Link>
        </div>
      </main>
    )
  }

  const v = restaurant.verified

  return (
    <main className="page page--confirmation">
      <div className="demo-banner no-print">
        <strong>Development demo.</strong> This order was not sent to the
        kitchen and no payment was taken. It demonstrates the confirmation and
        bill flow only.
      </div>

      <section className="bill" aria-label="Order bill">
        <header className="bill__head">
          <div>
            <p className="bill__brand">{restaurant.name}</p>
            <p className="bill__brand-kn" lang="kn">
              {restaurant.nameKannada}
            </p>
          </div>
          <div className="bill__meta">
            <p>
              <span>Order</span>
              <strong>{order.ref}</strong>
            </p>
            <p>
              <span>Date</span>
              <strong>{formatDate(order.at)}</strong>
            </p>
            <p>
              <span>Type</span>
              <strong>{order.mode === 'pickup' ? 'Pickup' : 'Delivery'}</strong>
            </p>
          </div>
        </header>

        <div className="bill__customer">
          <div>
            <p className="bill__label">Customer</p>
            <p>{order.name}</p>
            <p>{order.phone}</p>
            {order.email && <p>{order.email}</p>}
          </div>
          {order.address && (
            <div>
              <p className="bill__label">Deliver to</p>
              <p>{order.address}</p>
            </div>
          )}
        </div>

        <table className="bill__table">
          <thead>
            <tr>
              <th scope="col">Item</th>
              <th scope="col" className="bill__num">
                Qty
              </th>
              <th scope="col" className="bill__num">
                Unit
              </th>
              <th scope="col" className="bill__num">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {order.lines.map((l, i) => (
              <tr key={`${l.name}-${i}`}>
                <td>{l.name}</td>
                <td className="bill__num">{l.qty}</td>
                <td className="bill__num">{inr(l.price)}</td>
                <td className="bill__num">{inr(l.price * l.qty)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="bill__totals">
          <div className="bill__total-row">
            <span>Subtotal</span>
            <span>{inr(order.subtotal)}</span>
          </div>
          <div className="bill__total-row">
            <span>Taxes &amp; charges</span>
            <span className="summary__muted">Not configured</span>
          </div>
          <div className="bill__total-row bill__total-row--grand">
            <span>Total</span>
            <span>{inr(order.total)}</span>
          </div>
        </div>

        <div className="bill__footer">
          <p>
            Payment: <span className="summary__muted">Not processed (demo)</span>
          </p>
          <p>
            Status: <strong>Demo order — not sent to kitchen</strong>
          </p>
          <p className="bill__address">
            {v.address}, {v.area}, {v.city} {v.pincode} · {v.phoneDisplay}
          </p>
        </div>
      </section>

      <div className="confirmation-actions no-print">
        <button
          type="button"
          className="btn btn--primary"
          onClick={() => window.print()}
        >
          Print bill
        </button>
        <Link to="/order" className="btn btn--ghost">
          Start another order
        </Link>
        <Link to="/" className="btn btn--ghost">
          Back to home
        </Link>
      </div>
    </main>
  )
}
