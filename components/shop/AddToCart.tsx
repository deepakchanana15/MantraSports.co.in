'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Minus, Plus, ShoppingBag, Check } from 'lucide-react'
import { useCart, MAX_QTY_PER_ITEM } from '@/lib/cart/CartContext'

interface Props {
  product: {
    id: string
    slug: string
    name: string
    imageUrl: string | null
    unitPrice: number
    optionName: string | null
    optionValues: string[]
    maxQty: number | null
  }
}

export function AddToCart({ product }: Props) {
  const router = useRouter()
  const { addItem } = useCart()
  const [qty, setQty] = useState(1)
  const [option, setOption] = useState('')
  const [error, setError] = useState('')
  const [added, setAdded] = useState(false)

  const hasOptions = product.optionValues.length > 0
  const maxQty = Math.max(1, Math.min(MAX_QTY_PER_ITEM, product.maxQty ?? MAX_QTY_PER_ITEM))
  const optionLabel = product.optionName || 'Option'

  function add(goToCheckout: boolean) {
    if (hasOptions && !option) {
      setError(`Please choose a ${optionLabel.toLowerCase()}.`)
      return
    }
    setError('')
    addItem(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        imageUrl: product.imageUrl,
        unitPrice: product.unitPrice,
        option: hasOptions ? option : null,
      },
      qty
    )
    if (goToCheckout) {
      router.push('/checkout')
      return
    }
    setAdded(true)
    setTimeout(() => setAdded(false), 2500)
  }

  return (
    <div className="space-y-4">
      {hasOptions && (
        <div>
          <label htmlFor="product-option" className="mb-1.5 block font-display text-[11px] font-semibold uppercase tracking-[0.18em] text-[#111]">
            {optionLabel}
          </label>
          <select
            id="product-option"
            value={option}
            onChange={(e) => { setOption(e.target.value); setError('') }}
            className="h-12 w-full rounded-[2px] border border-[#E0DFDB] bg-white px-3 text-sm text-[#111] outline-none focus:border-[#E85D1A]"
          >
            <option value="">Select {optionLabel.toLowerCase()}…</option>
            {product.optionValues.map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>
      )}

      <div className="flex flex-wrap items-stretch gap-3">
        <div className="flex h-12 items-center rounded-[2px] border border-[#E0DFDB]" role="group" aria-label="Quantity">
          <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="flex h-full w-11 items-center justify-center text-[#333] hover:text-[#E85D1A]" aria-label="Decrease quantity">
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-10 text-center font-display text-base font-semibold text-[#111]" aria-live="polite">{qty}</span>
          <button type="button" onClick={() => setQty((q) => Math.min(maxQty, q + 1))} className="flex h-full w-11 items-center justify-center text-[#333] hover:text-[#E85D1A]" aria-label="Increase quantity">
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => add(false)}
          className="flex h-12 flex-1 items-center justify-center gap-2 rounded-[2px] bg-[#111] px-6 font-display text-sm font-semibold uppercase tracking-[0.1em] text-white transition-colors hover:bg-[#E85D1A]"
        >
          {added ? <><Check className="h-4 w-4" /> Added to Cart</> : <><ShoppingBag className="h-4 w-4" /> Add to Cart</>}
        </button>
      </div>

      <button
        type="button"
        onClick={() => add(true)}
        className="flex h-12 w-full items-center justify-center rounded-[2px] bg-[#E85D1A] px-6 font-display text-sm font-semibold uppercase tracking-[0.1em] text-white transition-colors hover:bg-[#C44B0F]"
      >
        Buy Now
      </button>

      {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
      {added && (
        <p className="text-sm text-[#333]">
          Added to your cart. <a href="/cart" className="font-semibold text-[#E85D1A] underline">View cart</a>
        </p>
      )}
    </div>
  )
}
