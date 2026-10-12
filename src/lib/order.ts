// A locally-recorded order used by the checkout → payment → confirmation
// handoff. `demo: true` marks that nothing was sent to a backend and no real
// payment was taken — the confirmation screen must present this honestly.
export type PaymentMethod = 'online' | 'cod'

// Deliberately narrow: a demo payment can only ever be `paid` (simulated
// success) or `due` (pay on delivery). A failed/cancelled demo payment is
// never recorded as an order at all.
export type PaymentStatus = 'paid' | 'due'

export interface PlacedOrder {
  ref: string
  name: string
  phone: string
  email?: string
  mode: 'pickup' | 'delivery'
  address?: string
  notes?: string
  lines: { name: string; qty: number; price: number }[]
  subtotal: number
  total: number
  at: string
  demo: true
  paymentMethod: PaymentMethod
  paymentStatus: PaymentStatus
  /** Demo transaction reference, present only for a simulated online payment. */
  txnRef?: string
  paidAt?: string
}

const KEY = 'dmo.lastOrder'

export function saveOrder(order: PlacedOrder) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(order))
  } catch {
    /* ignore */
  }
}

export function readOrder(): PlacedOrder | null {
  try {
    const raw = sessionStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as PlacedOrder) : null
  } catch {
    return null
  }
}

export function makeOrderRef(): string {
  const stamp = Date.now().toString(36).toUpperCase().slice(-5)
  return `DMO-DEV-${stamp}`
}

/** Demo-only payment reference. Never a real gateway ID. */
export function makeTxnRef(): string {
  const stamp = Date.now().toString(36).toUpperCase().slice(-4)
  const rand = Math.random().toString(36).toUpperCase().slice(2, 6)
  return `DEMO-${stamp}${rand}`
}