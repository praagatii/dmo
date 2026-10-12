// Cart state shared across the ordering experience. Persisted to
// localStorage so navigating between menu → cart → checkout keeps the order.
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export interface CartLine {
  id: string
  name: string
  price: number
  image: string
  qty: number
  options?: string[]
}

interface CartContextValue {
  lines: CartLine[]
  count: number
  subtotal: number
  add: (line: Omit<CartLine, 'qty'>, qty?: number) => void
  setQty: (id: string, qty: number) => void
  remove: (id: string) => void
  clear: () => void
}

const STORAGE_KEY = 'dmo.cart'

const CartContext = createContext<CartContextValue | null>(null)

function readStored(): CartLine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as CartLine[]) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(readStored)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines))
    } catch {
      /* private mode — cart simply won't persist */
    }
  }, [lines])

  const value = useMemo<CartContextValue>(() => {
    const count = lines.reduce((n, l) => n + l.qty, 0)
    const subtotal = lines.reduce((n, l) => n + l.qty * l.price, 0)
    return {
      lines,
      count,
      subtotal,
      add: (line, qty = 1) =>
        setLines((cur) => {
          const existing = cur.find((l) => l.id === line.id)
          if (existing) {
            return cur.map((l) =>
              l.id === line.id ? { ...l, qty: l.qty + qty } : l,
            )
          }
          return [...cur, { ...line, qty }]
        }),
      setQty: (id, qty) =>
        setLines((cur) =>
          qty <= 0
            ? cur.filter((l) => l.id !== id)
            : cur.map((l) => (l.id === id ? { ...l, qty } : l)),
        ),
      remove: (id) => setLines((cur) => cur.filter((l) => l.id !== id)),
      clear: () => setLines([]),
    }
  }, [lines])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
