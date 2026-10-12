import { useState, type ChangeEvent, type FormEvent } from 'react'
import { useCart } from '../../lib/cart'
import { inr } from '../../lib/format'
import { Link, navigate } from '../../lib/router'
import { saveOrder, makeOrderRef, type PlacedOrder } from '../../lib/order'

// Delivery availability is not confirmed by the restaurant, so it is shown but
// clearly flagged as unconfirmed. Flip this only once delivery is verified.
const DELIVERY_ENABLED = false

type Mode = 'pickup' | 'delivery'

const EMPTY = { name: '', phone: '', email: '', address: '', notes: '' }

export function CheckoutPage() {
  const { lines, subtotal, count, clear } = useCart()
  const [mode, setMode] = useState<Mode>('pickup')
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState<Record<string, string>>({})

  if (count === 0) {
    return (
      <main className="page page--checkout">
        <div className="empty-state">
          <h1>Nothing to check out</h1>
          <p>Your cart is empty. Add something from the menu first.</p>
          <Link to="/order" className="btn btn--primary">
            Browse the menu
          </Link>
        </div>
      </main>
    )
  }

  const total = subtotal

  const set =
    (key: keyof typeof EMPTY) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((f) => ({ ...f, [key]: e.target.value }))
      setErrors((er) => ({ ...er, [key]: '' }))
    }

  const validate = () => {
    const er: Record<string, string> = {}
    if (!form.name.trim()) er.name = 'Please enter your name.'
    if (!/^[0-9+\-\s]{10,15}$/.test(form.phone.trim()))
      er.phone = 'Enter a valid phone number (10–15 digits).'
    if (form.email.trim() && !/^\S+@\S+\.\S+$/.test(form.email.trim()))
      er.email = 'Enter a valid email address.'
    if (mode === 'delivery' && !form.address.trim())
      er.address = 'An address is required for delivery.'
    setErrors(er)
    return Object.keys(er).length === 0
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!validate()) {
      document
        .querySelector('.field--error input, .field--error textarea')
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    const order: PlacedOrder = {
      ref: makeOrderRef(),
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim() || undefined,
      mode,
      address: mode === 'delivery' ? form.address.trim() : undefined,
      lines: lines.map((l) => ({ name: l.name, qty: l.qty, price: l.price })),
      subtotal,
      total,
      at: new Date().toISOString(),
      demo: true,
    }
    saveOrder(order)
    // No backend or payment is wired up, so this is an explicitly-labelled
    // demo confirmation — never a claim of a real order.
    clear()
    navigate('/order/confirmation')
  }

  return (
    <main className="page page--checkout">
      <header className="page-head">
        <h1 className="page-title">Checkout</h1>
        <p className="page-sub">Almost there.</p>
      </header>

      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={submit} noValidate>
          <fieldset className="fieldset">
            <legend>Your details</legend>

            <label className={`field${errors.name ? ' field--error' : ''}`}>
              <span className="field__label">Name</span>
              <input
                type="text"
                value={form.name}
                onChange={set('name')}
                autoComplete="name"
                aria-invalid={Boolean(errors.name)}
              />
              {errors.name && <span className="field__error">{errors.name}</span>}
            </label>

            <label className={`field${errors.phone ? ' field--error' : ''}`}>
              <span className="field__label">Phone</span>
              <input
                type="tel"
                value={form.phone}
                onChange={set('phone')}
                autoComplete="tel"
                placeholder="+91 …"
                aria-invalid={Boolean(errors.phone)}
              />
              {errors.phone && (
                <span className="field__error">{errors.phone}</span>
              )}
            </label>

            <label className={`field${errors.email ? ' field--error' : ''}`}>
              <span className="field__label">
                Email <em>(optional)</em>
              </span>
              <input
                type="email"
                value={form.email}
                onChange={set('email')}
                autoComplete="email"
                aria-invalid={Boolean(errors.email)}
              />
              {errors.email && (
                <span className="field__error">{errors.email}</span>
              )}
            </label>
          </fieldset>

          <fieldset className="fieldset">
            <legend>How would you like it?</legend>
            <div className="modes">
              <label className={`mode${mode === 'pickup' ? ' is-active' : ''}`}>
                <input
                  type="radio"
                  name="mode"
                  checked={mode === 'pickup'}
                  onChange={() => setMode('pickup')}
                />
                <span className="mode__title">Pickup</span>
                <span className="mode__note">Collect from the kitchen</span>
              </label>
              <label
                className={`mode${mode === 'delivery' ? ' is-active' : ''}${
                  DELIVERY_ENABLED ? '' : ' mode--muted'
                }`}
              >
                <input
                  type="radio"
                  name="mode"
                  checked={mode === 'delivery'}
                  onChange={() => setMode('delivery')}
                />
                <span className="mode__title">Delivery</span>
                <span className="mode__note">
                  {DELIVERY_ENABLED
                    ? 'To your door'
                    : 'Availability not yet confirmed'}
                </span>
              </label>
            </div>

            {mode === 'delivery' && (
              <label
                className={`field${errors.address ? ' field--error' : ''}`}
              >
                <span className="field__label">Delivery address</span>
                <textarea
                  rows={3}
                  value={form.address}
                  onChange={set('address')}
                  aria-invalid={Boolean(errors.address)}
                />
                {errors.address && (
                  <span className="field__error">{errors.address}</span>
                )}
              </label>
            )}

            <label className="field">
              <span className="field__label">
                Notes <em>(optional)</em>
              </span>
              <textarea rows={2} value={form.notes} onChange={set('notes')} />
            </label>
          </fieldset>

          <p className="checkout-notice">
            <strong>Demo checkout.</strong> No payment is taken and no order is
            sent to the kitchen — this screen demonstrates the ordering flow so
            a real backend and payment provider can be connected later.
          </p>

          <button type="submit" className="btn btn--primary btn--block">
            Place order (demo)
          </button>
        </form>

        <aside className="summary" aria-label="Order summary">
          <h2 className="summary__title">Order summary</h2>
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
            Payment method and status will be shown here once a payment
            provider is connected.
          </p>
          <Link to="/cart" className="btn btn--ghost btn--block">
            Back to cart
          </Link>
        </aside>
      </div>
    </main>
  )
}
