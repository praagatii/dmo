// A locally-recorded order used by the checkout → confirmation handoff.
// `demo: true` marks that nothing was sent to a backend and no payment was
// taken — the confirmation screen must present this honestly.
export interface PlacedOrder {
  ref: string
  name: string
  phone: string
  email?: string
  mode: 'pickup' | 'delivery'
  address?: string
  lines: { name: string; qty: number; price: number }[]
  subtotal: number
  total: number
  at: string
  demo: true
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
