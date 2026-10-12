import { useEffect, useRef, useState } from 'react'
import { useCart } from '../../lib/cart'
import { inr } from '../../lib/format'
import { Link, navigate } from '../../lib/router'
import {
  saveOrder,
  makeOrderRef,
  makeTxnRef,
  type PlacedOrder,
} from '../../lib/order'
import { readCheckoutDraft, clearCheckoutDraft } from '../../lib/checkout'
import {
  demoGateway,
  type PaymentMethodOption,
  type PaymentResult,
} from '../../lib/payment'

type Status = 'form' | 'processing' | 'failed' | 'success'

const METHODS: { id: PaymentMethodOption; title: string; note: string }[] = [
  { id: 'upi', title: 'UPI', note: 'Demo — no UPI ID or PIN is collected' },
  { id: 'card', title: 'Card', note: 'Demo — no card number is collected' },
  { id: 'netbanking', title: 'Net banking', note: 'Demo — no credentials' },
]

export function PaymentPage() {
  const { lines, subtotal, count, clear } = useCart()
  // Capture the draft once: clearing sessionStorage on success must not null
  // out the in-memory copy the success screen still needs to render.
  const [draft] = useState(() => readCheckoutDraft())

  const [ref] = useState(() => makeOrderRef())
  const [method, setMethod] = useState<PaymentMethodOption>('upi')
  const [simulateFailure, setSimulateFailure] = useState(false)
  const [status, setStatus] = useState<Status>('form')
  const [result, setResult] = useState<PaymentResult | null>(null)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  // The payment screen is only reachable with a checkout draft and a cart.
  if (!draft) {
    return (
      <main className="page page--payment">
        <div className="empty-state">
          <h1>Nothing to pay for</h1>
          <p>Start from the menu, or return to checkout to continue.</p>
          <Link to="/order" className="btn btn--primary">
            Browse the menu
          </Link>
        </div>
      </main>
    )
  }

  if (count === 0 && status !== 'success') {
    return (
      <main className="page page--payment">
        <div className="empty-state">
          <h1>Nothing to pay for</h1>
          <p>Your cart is empty. Add something from the menu first.</p>
          <Link to="/order" className="btn btn--primary">
            Browse the menu
          </Link>
        </div>
      </main>
    )
  }

  const total = subtotal

  // Clear the cart/draft and move on to the bill (used by the auto-advance and
  // the "View bill" button).
  const finish = () => {
    window.clearTimeout(timer.current)
    clearCheckoutDraft()
    clear()
    navigate('/order/confirmation')
  }

  const complete = async () => {
    setStatus('processing')
    const res = await demoGateway.pay({
      amount: total,
      method,
      simulateFailure,
    })
    setResult(res)

    if (res.outcome === 'failure') {
      // Never record a failed payment as an order.
      setStatus('failed')
      return
    }

    const order: PlacedOrder = {
      ref,
      name: draft.name,
      phone: draft.phone,
      email: draft.email || undefined,
      mode: draft.mode,
      address: draft.mode === 'delivery' ? draft.address : undefined,
      notes: draft.notes || undefined,
      lines: lines.map((l) => ({ name: l.name, qty: l.qty, price: l.price })),
      subtotal,
      total,
      at: new Date().toISOString(),
      demo: true,
      paymentMethod: 'online',
      paymentStatus: 'paid',
      txnRef: res.txnRef || makeTxnRef(),
      paidAt: res.at,
    }
    saveOrder(order)
    setStatus('success')
    timer.current = window.setTimeout(finish, 1400)
  }

  return (
    <main className="page page--payment">
      <div className="demo-banner no-print">
        <strong>DEMO PAYMENT — NO REAL MONEY WILL BE CHARGED.</strong> This is a
        simulated gateway. No card details, UPI ID/PIN or banking credentials
        are collected, and no order is sent to the kitchen.
      </div>

      <header className="page-head">
        <p className="pay-secure">
          <span className="pay-lock" aria-hidden="true">
            &#128274;
          </span>{' '}
          Secure checkout (demo)
        </p>
        <h1 className="page-title">Payment</h1>
        <p className="page-sub">
          Order <strong>{ref}</strong> · Amount due{' '}
          <strong>{inr(total)}</strong>
        </p>
      </header>

      <div className="checkout-layout">
        <div className="checkout-form">
          {status === 'success' ? (
            <section className="pay-state pay-state--ok">
              <h2 className="pay-state__title">Demo Payment Successful</h2>
              <p>
                Simulated transaction reference{' '}
                <strong>{result?.txnRef}</strong>.
              </p>
              <p className="pay-state__sub">
                Taking you to your bill and confirmation…
              </p>
              <button
                type="button"
                className="btn btn--pay"
                onClick={finish}
              >
                View bill
              </button>
            </section>
          ) : status === 'processing' ? (
            <section className="pay-state">
              <span className="pay-spinner" aria-hidden="true" />
              <h2 className="pay-state__title">Processing demo payment…</h2>
              <p className="pay-state__sub">
                Contacting the simulated gateway. No real money is moving.
              </p>
            </section>
          ) : (
            <>
              {status === 'failed' && (
                <div className="pay-failed" role="alert">
                  <strong>Demo payment failed.</strong>{' '}
                  {result?.reason ?? 'The simulated payment did not go through.'}{' '}
                  Your card has not been charged and no order has been placed.
                </div>
              )}

              <fieldset className="fieldset">
                <legend>Choose a method</legend>
                <div className="pay-methods">
                  {METHODS.map((m) => (
                    <label
                      key={m.id}
                      className={`mode${method === m.id ? ' is-active' : ''}`}
                    >
                      <input
                        type="radio"
                        name="paymethod"
                        checked={method === m.id}
                        onChange={() => setMethod(m.id)}
                      />
                      <span className="mode__title">{m.title}</span>
                      <span className="mode__note">{m.note}</span>
                    </label>
                  ))}
                </div>
                <p className="pay-note">
                  Demo options only — selecting one does not collect any real
                  payment details.
                </p>
              </fieldset>

              <fieldset className="fieldset">
                <legend>Demo controls</legend>
                <label className="pay-check">
                  <input
                    type="checkbox"
                    checked={simulateFailure}
                    onChange={(e) => setSimulateFailure(e.target.checked)}
                  />
                  <span>
                    Simulate a failed payment (for demonstrating the failure and
                    retry flow)
                  </span>
                </label>
              </fieldset>

              <button
                type="button"
                className="btn btn--pay btn--block"
                onClick={complete}
              >
                {status === 'failed'
                  ? `Retry payment · ${inr(total)}`
                  : `Pay ${inr(total)}`}
              </button>

              <Link to="/checkout" className="btn btn--ghost btn--block">
                ← Back to checkout
              </Link>
            </>
          )}
        </div>

        <aside className="summary" aria-label="Order summary">
          <h2 className="summary__title">Order summary</h2>
          <p className="summary__ref">
            Order <strong>{ref}</strong>
          </p>
          <ul className="summary__lines">
            {lines.map((l) => (
              <li key={l.id}>
                <span>
                  {l.qty} × {l.name}
                </span>
                <span>{inr(l.qty * l.price)}</span>
              </li>
            ))}
          </ul>
          <div className="summary__row">
            <span>Subtotal</span>
            <span>{inr(subtotal)}</span>
          </div>
          <div className="summary__row">
            <span>Taxes &amp; charges</span>
            <span className="summary__muted">Not configured</span>
          </div>
          <div className="summary__row summary__row--total">
            <span>Total payable</span>
            <span>{inr(total)}</span>
          </div>
          <p className="summary__note">
            {draft.mode === 'delivery' ? 'Delivery' : 'Pickup'} · {draft.name}
          </p>
        </aside>
      </div>
    </main>
  )
}