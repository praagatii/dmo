// Demo payment gateway — ISOLATED ON PURPOSE.
//
// This is the only place that "talks" to a payment provider. It never contacts
// a network, never touches card numbers / UPI IDs / PINs or bank credentials,
// and never moves real money. It simply resolves a simulated response after a
// short delay so the UI can exercise loading → success/failure.
//
// To integrate a real provider later, replace `demoGateway` with an
// implementation of `PaymentGateway` that creates the order on a SERVER (keys
// must never live in the browser) and confirms the result from the provider's
// signed callback. Nothing outside this file needs to change.

export type PaymentMethodOption = 'upi' | 'card' | 'netbanking'

export interface PaymentRequest {
  amount: number
  method: PaymentMethodOption
  /** Demo-only switch that forces the simulated gateway to fail. */
  simulateFailure?: boolean
}

export interface PaymentResult {
  outcome: 'success' | 'failure'
  /** Present only on success. A demo reference, never a real gateway ID. */
  txnRef: string
  at: string
  /** Human-readable reason on failure. */
  reason?: string
}

export interface PaymentGateway {
  pay(req: PaymentRequest): Promise<PaymentResult>
}

const ref = () => {
  const stamp = Date.now().toString(36).toUpperCase().slice(-4)
  const rand = Math.random().toString(36).toUpperCase().slice(2, 6)
  return `DEMO-${stamp}${rand}`
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

export const demoGateway: PaymentGateway = {
  async pay({ simulateFailure }) {
    // Simulate the round-trip to a payment gateway.
    await wait(1400)
    const at = new Date().toISOString()
    if (simulateFailure) {
      return {
        outcome: 'failure',
        txnRef: '',
        at,
        reason: 'Simulated decline — the demo gateway was asked to fail.',
      }
    }
    return { outcome: 'success', txnRef: ref(), at }
  },
}