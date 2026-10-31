'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

// ─── Cart (client-side, persisted in localStorage) ───────────────────────────
// Prices stored here are for display only. The server re-reads every product
// and recalculates totals at checkout, so a tampered cart can't change prices.

export interface CartItem {
  productId: string
  slug: string
  name: string
  imageUrl: string | null
  unitPrice: number
  option: string | null
  quantity: number
}

interface CartContextValue {
  items: CartItem[]
  count: number
  subtotal: number
  ready: boolean
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void
  updateQuantity: (productId: string, option: string | null, quantity: number) => void
  removeItem: (productId: string, option: string | null) => void
  clear: () => void
}

const STORAGE_KEY = 'mantra-cart-in'
export const MAX_QTY_PER_ITEM = 20

const CartContext = createContext<CartContextValue | null>(null)

const sameLine = (a: { productId: string; option: string | null }, productId: string, option: string | null) =>
  a.productId === productId && (a.option ?? null) === (option ?? null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) setItems(parsed)
      }
    } catch {
      // Storage unavailable (private mode) — cart works for this visit only
    }
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // ignore
    }
  }, [items, ready])

  const addItem = useCallback((item: Omit<CartItem, 'quantity'>, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => sameLine(i, item.productId, item.option))
      if (existing) {
        return prev.map((i) =>
          sameLine(i, item.productId, item.option)
            ? { ...i, ...item, quantity: Math.min(MAX_QTY_PER_ITEM, i.quantity + quantity) }
            : i
        )
      }
      return [...prev, { ...item, quantity: Math.min(MAX_QTY_PER_ITEM, quantity) }]
    })
  }, [])

  const updateQuantity = useCallback((productId: string, option: string | null, quantity: number) => {
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((i) => !sameLine(i, productId, option))
        : prev.map((i) => (sameLine(i, productId, option) ? { ...i, quantity: Math.min(MAX_QTY_PER_ITEM, quantity) } : i))
    )
  }, [])

  const removeItem = useCallback((productId: string, option: string | null) => {
    setItems((prev) => prev.filter((i) => !sameLine(i, productId, option)))
  }, [])

  const clear = useCallback(() => setItems([]), [])

  const value = useMemo<CartContextValue>(() => ({
    items,
    count: items.reduce((n, i) => n + i.quantity, 0),
    subtotal: items.reduce((n, i) => n + i.unitPrice * i.quantity, 0),
    ready,
    addItem,
    updateQuantity,
    removeItem,
    clear,
  }), [items, ready, addItem, updateQuantity, removeItem, clear])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>')
  return ctx
}
