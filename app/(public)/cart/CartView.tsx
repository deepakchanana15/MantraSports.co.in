'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from 'lucide-react'
import { useCart, MAX_QTY_PER_ITEM } from '@/lib/cart/CartContext'
import { formatPrice } from '@/lib/utils/format'

export function CartView() {
  const { items, subtotal, ready, updateQuantity, removeItem } = useCart()

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-8 lg:py-16">
      <h1 className="mb-8 font-display text-[32px] font-bold uppercase tracking-[0.01em] text-[#111] sm:text-[40px]">Your Cart</h1>

      {!ready ? (
        <div className="h-40 animate-pulse bg-[#F8F7F4]" />
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center border border-[#E0DFDB] bg-[#F8F7F4] px-6 py-16 text-center">
          <ShoppingBag className="mb-4 h-10 w-10 text-[#E85D1A]" />
          <p className="font-display text-xl font-bold uppercase text-[#111]">Your cart is empty</p>
          <p className="mt-2 text-sm text-[#6B6B6B]">Find your next bat, pads or kit in the shop.</p>
          <Link href="/shop" className="mt-6 inline-flex items-center gap-2 rounded-[2px] bg-[#E85D1A] px-8 py-3 font-display text-sm font-semibold uppercase tracking-[0.1em] text-white hover:bg-[#C44B0F]">
            Continue Shopping <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
          <ul className="divide-y divide-[#E0DFDB] border-y border-[#E0DFDB]">
            {items.map((item) => (
              <li key={`${item.productId}-${item.option ?? ''}`} className="flex gap-4 py-5">
                <Link href={`/shop/${item.slug}`} className="relative h-24 w-24 shrink-0 bg-[#F8F7F4]">
                  {item.imageUrl ? (
                    <Image src={item.imageUrl} alt={item.name} fill sizes="96px" className="object-contain p-2" />
                  ) : (
                    <span className="flex h-full items-center justify-center text-3xl" aria-hidden="true">🏏</span>
                  )}
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex justify-between gap-3">
                    <div className="min-w-0">
                      <Link href={`/shop/${item.slug}`} className="font-display text-[15px] font-semibold uppercase leading-tight text-[#111] hover:text-[#E85D1A]">
                        {item.name}
                      </Link>
                      {item.option && <p className="mt-0.5 text-xs text-[#6B6B6B]">{item.option}</p>}
                      <p className="mt-1 text-sm text-[#6B6B6B]">{formatPrice(item.unitPrice)} each</p>
                    </div>
                    <p className="shrink-0 font-display text-base font-semibold text-[#111]">{formatPrice(item.unitPrice * item.quantity)}</p>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-3">
                    <div className="flex h-9 items-center rounded-[2px] border border-[#E0DFDB]" role="group" aria-label={`Quantity for ${item.name}`}>
                      <button type="button" onClick={() => updateQuantity(item.productId, item.option, item.quantity - 1)} className="flex h-full w-9 items-center justify-center hover:text-[#E85D1A]" aria-label="Decrease quantity">
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                      <button type="button" disabled={item.quantity >= MAX_QTY_PER_ITEM} onClick={() => updateQuantity(item.productId, item.option, item.quantity + 1)} className="flex h-full w-9 items-center justify-center hover:text-[#E85D1A] disabled:opacity-30" aria-label="Increase quantity">
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <button type="button" onClick={() => removeItem(item.productId, item.option)} className="flex items-center gap-1 text-xs text-[#999] hover:text-red-600">
                      <Trash2 className="h-3.5 w-3.5" /> Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <aside className="h-fit border border-[#E0DFDB] bg-[#F8F7F4] p-6">
            <h2 className="mb-4 font-display text-lg font-bold uppercase text-[#111]">Order Summary</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-[#6B6B6B]">Subtotal</dt><dd className="text-[#111]">{formatPrice(subtotal)}</dd></div>
              <div className="flex justify-between"><dt className="text-[#6B6B6B]">Delivery</dt><dd className="font-semibold text-green-700">FREE</dd></div>
              <div className="flex justify-between border-t border-[#E0DFDB] pt-3 text-base"><dt className="font-semibold text-[#111]">Total</dt><dd className="font-display font-bold text-[#111]">{formatPrice(subtotal)}</dd></div>
            </dl>
            <p className="mt-1 text-xs text-[#999]">Inclusive of all taxes</p>
            <Link href="/checkout" className="mt-6 flex items-center justify-center gap-2 rounded-[2px] bg-[#E85D1A] py-3.5 font-display text-sm font-semibold uppercase tracking-[0.1em] text-white hover:bg-[#C44B0F]">
              Proceed to Checkout <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/shop" className="mt-3 block text-center text-sm text-[#6B6B6B] underline hover:text-[#E85D1A]">Continue shopping</Link>
          </aside>
        </div>
      )}
    </div>
  )
}
