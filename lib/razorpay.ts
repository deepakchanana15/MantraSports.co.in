import 'server-only'
import { createHmac, timingSafeEqual } from 'node:crypto'

// ─── Razorpay (server-side) ──────────────────────────────────────────────────
// Env: RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, RAZORPAY_WEBHOOK_SECRET
// Docs: https://razorpay.com/docs/payments/server-integration/

export function isRazorpayConfigured(): boolean {
  return Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET)
}

export function getRazorpayKeyId(): string {
  return process.env.RAZORPAY_KEY_ID ?? ''
}

function authHeader(): string {
  const id = process.env.RAZORPAY_KEY_ID
  const secret = process.env.RAZORPAY_KEY_SECRET
  if (!id || !secret) throw new Error('Razorpay is not configured')
  return `Basic ${Buffer.from(`${id}:${secret}`).toString('base64')}`
}

export interface RazorpayOrder {
  id: string
  amount: number
  currency: string
  receipt: string
  status: string
}

/** Creates a Razorpay order. `amountPaise` is in the smallest unit (₹1 = 100). */
export async function createRazorpayOrder(params: {
  amountPaise: number
  receipt: string
  notes?: Record<string, string>
}): Promise<RazorpayOrder> {
  const res = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: { Authorization: authHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount: params.amountPaise,
      currency: 'INR',
      receipt: params.receipt,
      notes: params.notes,
    }),
    signal: AbortSignal.timeout(10000),
    cache: 'no-store',
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Razorpay order creation failed (${res.status}): ${body}`)
  }
  return res.json()
}

/** Fetches payments for a Razorpay order — used to confirm a payment server-side. */
export async function fetchRazorpayOrderPayments(razorpayOrderId: string): Promise<Array<{ id: string; status: string; amount: number }>> {
  const res = await fetch(`https://api.razorpay.com/v1/orders/${encodeURIComponent(razorpayOrderId)}/payments`, {
    headers: { Authorization: authHeader() },
    signal: AbortSignal.timeout(10000),
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`Razorpay payments lookup failed (${res.status})`)
  const data = await res.json()
  return data.items ?? []
}

function safeEqualHex(a: string, b: string): boolean {
  const ab = Buffer.from(a, 'utf8')
  const bb = Buffer.from(b, 'utf8')
  return ab.length === bb.length && timingSafeEqual(ab, bb)
}

/** Verifies the signature Razorpay Checkout returns after a successful payment. */
export function verifyPaymentSignature(params: { orderId: string; paymentId: string; signature: string }): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET
  if (!secret) return false
  const expected = createHmac('sha256', secret).update(`${params.orderId}|${params.paymentId}`).digest('hex')
  return safeEqualHex(expected, params.signature)
}

/** Verifies the X-Razorpay-Signature header on a webhook request body. */
export function verifyWebhookSignature(rawBody: string, signature: string | null): boolean {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET
  if (!secret || !signature) return false
  const expected = createHmac('sha256', secret).update(rawBody).digest('hex')
  return safeEqualHex(expected, signature)
}
