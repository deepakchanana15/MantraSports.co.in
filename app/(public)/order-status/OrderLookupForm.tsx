'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { lookupOrder } from '@/lib/actions/orders'

export function OrderLookupForm() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  return (
    <form
      className="max-w-[480px] space-y-4"
      onSubmit={async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        const result = await lookupOrder(new FormData(e.currentTarget))
        if (result.ok) {
          router.push(`/order-confirmation/${result.accessToken}`)
        } else {
          setError(result.error)
          setLoading(false)
        }
      }}
    >
      <div>
        <label htmlFor="orderNumber" className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.08em] text-[#333]">Order number</label>
        <input id="orderNumber" name="orderNumber" required placeholder="MSI-261031-ABC12" className="h-12 w-full rounded-[2px] border border-[#E0DFDB] px-3 text-sm uppercase outline-none focus:border-[#E85D1A]" />
      </div>
      <div>
        <label htmlFor="email" className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.08em] text-[#333]">Email address</label>
        <input id="email" name="email" type="email" required className="h-12 w-full rounded-[2px] border border-[#E0DFDB] px-3 text-sm outline-none focus:border-[#E85D1A]" />
      </div>
      <button type="submit" disabled={loading} className="rounded-[2px] bg-[#E85D1A] px-8 py-3 font-display text-sm font-semibold uppercase tracking-[0.1em] text-white hover:bg-[#C44B0F] disabled:opacity-60">
        {loading ? 'Checking…' : 'Find My Order'}
      </button>
      {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
    </form>
  )
}
