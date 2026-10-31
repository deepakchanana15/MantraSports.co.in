'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Lock, Loader2 } from 'lucide-react'
import { useCart } from '@/lib/cart/CartContext'
import { formatPrice } from '@/lib/utils/format'
import { INDIAN_STATES } from '@/lib/config/india'
import { startCheckout, confirmPayment, reportPaymentFailed } from '@/lib/actions/orders'
import { getWhatsAppUrl } from '@/lib/config/site'

// Minimal typing for the Razorpay Checkout script
interface RazorpayResponse {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}
interface RazorpayInstance {
  open: () => void
  on: (event: string, handler: (res: { error?: { description?: string; metadata?: { order_id?: string } } }) => void) => void
}
declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => RazorpayInstance
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true)
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

const inputCls = 'h-12 w-full rounded-[2px] border border-[#E0DFDB] bg-white px-3 text-sm text-[#111] outline-none focus:border-[#E85D1A]'
const labelCls = 'mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.08em] text-[#333]'

export function CheckoutClient({ deliveryTime, paymentsEnabled }: { deliveryTime: string; paymentsEnabled: boolean }) {
  const router = useRouter()
  const { items, subtotal, ready, clear } = useCart()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [showGst, setShowGst] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    const fd = new FormData(e.currentTarget)
    const get = (k: string) => String(fd.get(k) ?? '')

    setSubmitting(true)
    const result = await startCheckout({
      items: items.map((i) => ({ productId: i.productId, option: i.option, quantity: i.quantity })),
      customer: {
        name: get('name'),
        email: get('email'),
        phone: get('phone'),
        addressLine1: get('addressLine1'),
        addressLine2: get('addressLine2'),
        city: get('city'),
        state: get('state') as (typeof INDIAN_STATES)[number],
        pincode: get('pincode'),
        buyerGstin: get('buyerGstin'),
        buyerCompany: get('buyerCompany'),
        note: get('note'),
      },
    })

    if (!result.ok) {
      setError(result.error)
      setSubmitting(false)
      return
    }

    const loaded = await loadRazorpayScript()
    if (!loaded || !window.Razorpay) {
      setError('Could not load the payment window. Please check your connection and try again.')
      setSubmitting(false)
      return
    }

    const rzp = new window.Razorpay({
      key: result.keyId,
      order_id: result.razorpayOrderId,
      amount: result.amountPaise,
      currency: 'INR',
      name: 'Mantra Sports India',
      description: `Order ${result.orderNumber}`,
      image: `${window.location.origin}/images/brand/logo.png`,
      prefill: result.prefill,
      notes: { orderNumber: result.orderNumber },
      theme: { color: '#E85D1A' },
      handler: async (response: RazorpayResponse) => {
        const confirmed = await confirmPayment({
          razorpayOrderId: response.razorpay_order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpaySignature: response.razorpay_signature,
        })
        if (confirmed.ok) {
          clear()
          router.push(`/order-confirmation/${confirmed.accessToken}`)
        } else {
          setError(`${confirmed.error} (Order ${result.orderNumber})`)
          setSubmitting(false)
        }
      },
      modal: {
        ondismiss: () => {
          setSubmitting(false)
          setError('Payment was cancelled. Your cart is saved — you can try again whenever you are ready.')
        },
      },
    })
    rzp.on('payment.failed', (res) => {
      void reportPaymentFailed(result.razorpayOrderId)
      setError(res.error?.description ? `Payment failed: ${res.error.description}` : 'Payment failed. Please try again or use a different payment method.')
    })
    rzp.open()
  }

  if (!ready) return <div className="mx-auto h-96 max-w-[1200px] animate-pulse bg-[#F8F7F4]" />

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-[1200px] px-4 py-16 text-center sm:px-8">
        <h1 className="font-display text-3xl font-bold uppercase text-[#111]">Checkout</h1>
        <p className="mt-4 text-sm text-[#6B6B6B]">Your cart is empty.</p>
        <Link href="/shop" className="mt-6 inline-block rounded-[2px] bg-[#E85D1A] px-8 py-3 font-display text-sm font-semibold uppercase tracking-[0.1em] text-white">Go to Shop</Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-8 lg:py-14">
      <h1 className="mb-8 font-display text-[32px] font-bold uppercase tracking-[0.01em] text-[#111] sm:text-[40px]">Checkout</h1>

      {!paymentsEnabled && (
        <div className="mb-6 border border-orange-200 bg-orange-50 p-4 text-sm text-orange-800">
          Online payment is being set up. To order now, please{' '}
          <a href={getWhatsAppUrl("Hi, I'd like to place an order.")} target="_blank" rel="noopener noreferrer" className="font-semibold underline">message us on WhatsApp</a>.
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_380px]" noValidate={false}>
        <div className="space-y-8">
          <fieldset>
            <legend className="mb-4 font-display text-lg font-bold uppercase text-[#111]">Contact</legend>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="name" className={labelCls}>Full name *</label>
                <input id="name" name="name" required autoComplete="name" maxLength={100} className={inputCls} />
              </div>
              <div>
                <label htmlFor="email" className={labelCls}>Email *</label>
                <input id="email" name="email" type="email" required autoComplete="email" className={inputCls} />
              </div>
              <div>
                <label htmlFor="phone" className={labelCls}>Mobile number *</label>
                <input id="phone" name="phone" type="tel" required autoComplete="tel" placeholder="98765 43210" pattern="(\+?91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}" title="10-digit Indian mobile number" className={inputCls} />
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-4 font-display text-lg font-bold uppercase text-[#111]">Delivery Address</legend>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="addressLine1" className={labelCls}>House / flat, street *</label>
                <input id="addressLine1" name="addressLine1" required autoComplete="address-line1" maxLength={255} className={inputCls} />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="addressLine2" className={labelCls}>Area, landmark (optional)</label>
                <input id="addressLine2" name="addressLine2" autoComplete="address-line2" maxLength={255} className={inputCls} />
              </div>
              <div>
                <label htmlFor="city" className={labelCls}>City / town *</label>
                <input id="city" name="city" required autoComplete="address-level2" maxLength={100} className={inputCls} />
              </div>
              <div>
                <label htmlFor="pincode" className={labelCls}>PIN code *</label>
                <input id="pincode" name="pincode" required inputMode="numeric" autoComplete="postal-code" pattern="[1-9][0-9]{5}" maxLength={6} title="6-digit PIN code" className={inputCls} />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="state" className={labelCls}>State / UT *</label>
                <select id="state" name="state" required autoComplete="address-level1" defaultValue="" className={inputCls}>
                  <option value="" disabled>Select state…</option>
                  {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </fieldset>

          <div>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-[#333]">
              <input type="checkbox" checked={showGst} onChange={(e) => setShowGst(e.target.checked)} className="h-4 w-4 accent-[#E85D1A]" />
              I&apos;m buying for a business and want a GST invoice
            </label>
            {showGst && (
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="buyerCompany" className={labelCls}>Business name</label>
                  <input id="buyerCompany" name="buyerCompany" maxLength={150} className={inputCls} />
                </div>
                <div>
                  <label htmlFor="buyerGstin" className={labelCls}>GSTIN</label>
                  <input id="buyerGstin" name="buyerGstin" maxLength={15} placeholder="22AAAAA0000A1Z5" className={`${inputCls} uppercase`} />
                </div>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="note" className={labelCls}>Order notes (optional)</label>
            <textarea id="note" name="note" rows={3} maxLength={1000} placeholder="e.g. preferred delivery time, bat knocking-in request" className="w-full rounded-[2px] border border-[#E0DFDB] bg-white p-3 text-sm text-[#111] outline-none focus:border-[#E85D1A]" />
          </div>
        </div>

        <aside className="h-fit border border-[#E0DFDB] bg-[#F8F7F4] p-6 lg:sticky lg:top-24">
          <h2 className="mb-4 font-display text-lg font-bold uppercase text-[#111]">Your Order</h2>
          <ul className="mb-4 space-y-3">
            {items.map((item) => (
              <li key={`${item.productId}-${item.option ?? ''}`} className="flex gap-3 text-sm">
                <div className="relative h-14 w-14 shrink-0 bg-white">
                  {item.imageUrl && <Image src={item.imageUrl} alt="" fill sizes="56px" className="object-contain p-1" />}
                  <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#111] px-1 text-[10px] font-bold text-white">{item.quantity}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold leading-tight text-[#111]">{item.name}</p>
                  {item.option && <p className="text-xs text-[#6B6B6B]">{item.option}</p>}
                </div>
                <p className="shrink-0 text-[#111]">{formatPrice(item.unitPrice * item.quantity)}</p>
              </li>
            ))}
          </ul>
          <dl className="space-y-2 border-t border-[#E0DFDB] pt-4 text-sm">
            <div className="flex justify-between"><dt className="text-[#6B6B6B]">Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-[#6B6B6B]">Delivery</dt><dd className="font-semibold text-green-700">FREE</dd></div>
            <div className="flex justify-between border-t border-[#E0DFDB] pt-3 text-base"><dt className="font-semibold">Total</dt><dd className="font-display font-bold">{formatPrice(subtotal)}</dd></div>
          </dl>
          <p className="mt-1 text-xs text-[#999]">Inclusive of all taxes. Estimated delivery: {deliveryTime}.</p>

          <label className="mt-5 flex items-start gap-2 text-xs leading-relaxed text-[#444]">
            <input type="checkbox" name="terms" required className="mt-0.5 h-4 w-4 shrink-0 accent-[#E85D1A]" />
            <span>
              I agree to the <Link href="/terms-and-conditions" target="_blank" className="underline">Terms &amp; Conditions</Link>,{' '}
              <Link href="/returns-policy" target="_blank" className="underline">Returns Policy</Link> and{' '}
              <Link href="/privacy-policy" target="_blank" className="underline">Privacy Policy</Link>.
            </span>
          </label>

          <button
            type="submit"
            disabled={submitting || !paymentsEnabled}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-[2px] bg-[#E85D1A] py-4 font-display text-sm font-semibold uppercase tracking-[0.1em] text-white transition-colors hover:bg-[#C44B0F] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
            {submitting ? 'Processing…' : `Pay ${formatPrice(subtotal)}`}
          </button>
          <p className="mt-3 text-center text-[11px] text-[#999]">Secure payment by Razorpay · UPI, cards, netbanking &amp; wallets</p>

          {error && <p className="mt-4 border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</p>}
        </aside>
      </form>
    </div>
  )
}
