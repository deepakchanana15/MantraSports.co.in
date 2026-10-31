'use client'

import { useLocalStorage } from './useLocalStorage'

const MAX_ITEMS = 8

export interface RecentlyViewedProduct {
  id: string
  name: string
  slug: string
  image?: string
  price?: number
  currency?: string
}

export function useRecentlyViewed() {
  const [items, setItems] = useLocalStorage<RecentlyViewedProduct[]>('mantra-recently-viewed', [])

  const addProduct = (product: RecentlyViewedProduct) => {
    setItems((prev) => {
      const filtered = prev.filter((p) => p.id !== product.id)
      return [product, ...filtered].slice(0, MAX_ITEMS)
    })
  }

  const clearAll = () => setItems([])

  return { items, addProduct, clearAll }
}
