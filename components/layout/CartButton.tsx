'use client'

import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { useCart } from '@/lib/cart/CartContext'

export function CartButton() {
  const { count, ready } = useCart()
  return (
    <Link
      href="/cart"
      aria-label={ready && count > 0 ? `Cart, ${count} ${count === 1 ? 'item' : 'items'}` : 'Cart'}
      className="relative flex items-center justify-center rounded p-2 text-[#111] transition-colors hover:text-[#E85D1A]"
    >
      <ShoppingBag className="h-[22px] w-[22px]" aria-hidden="true" />
      {ready && count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#E85D1A] px-1 text-[10px] font-bold text-white">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </Link>
  )
}
