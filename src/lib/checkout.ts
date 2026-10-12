// Checkout draft — the customer details and chosen payment method captured on
// the checkout screen. Persisted to sessionStorage so that going to the
// payment screen (and back again, or refreshing) never loses what the customer
// typed. The cart itself is persisted separately by the cart provider.
import type { PaymentMethod } from './order'

export interface CheckoutDraft {
  name: string
  phone: string
  email: string
  mode: 'pickup' | 'delivery'
  address: string
  notes: string
  payment: PaymentMethod
}

const KEY = 'dmo.checkoutDraft'

export function saveCheckoutDraft(draft: CheckoutDraft) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(draft))
  } catch {
    /* ignore */
  }
}

export function readCheckoutDraft(): CheckoutDraft | null {
  try {
    const raw = sessionStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as CheckoutDraft) : null
  } catch {
    return null
  }
}

export function clearCheckoutDraft() {
  try {
    sessionStorage.removeItem(KEY)
  } catch {
    /* ignore */
  }
}