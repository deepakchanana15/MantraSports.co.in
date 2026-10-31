'use server'

import { z } from 'zod'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { Prisma, type OrderStatus } from '@prisma/client'
import { auth } from '@/auth'
import { prisma } from '@/lib/db/prisma'
import { rateLimit } from '@/lib/utils/rate-limit'
import { INDIAN_STATES, PINCODE_RE, INDIAN_MOBILE_RE, GSTIN_RE, normaliseIndianMobile } from '@/lib/config/india'
import {
  isRazorpayConfigured,
  getRazorpayKeyId,
  createRazorpayOrder,
  verifyPaymentSignature,
  fetchRazorpayOrderPayments,
} from '@/lib/razorpay'
import { generateOrderNumber, generateAccessToken, markOrderPaid } from '@/lib/orders'
import { sendShippedNotification } from '@/lib/email/order-emails'

const MAX_QTY_PER_ITEM = 20

const checkoutSchema = z.object({
  items: z.array(z.object({
    productId: z.string().uuid(),
    option: z.string().max(100).nullable(),
    quantity: z.number().int().min(1).max(MAX_QTY_PER_ITEM),
  })).min(1, 'Your cart is empty.').max(50),
  customer: z.object({
    name: z.string().trim().min(2, 'Please enter your full name.').max(100),
    email: z.string().trim().email('Please enter a valid email address.').max(255),
    phone: z.string().trim().regex(INDIAN_MOBILE_RE, 'Please enter a valid 10-digit Indian mobile number.'),
    addressLine1: z.string().trim().min(5, 'Please enter your address.').max(255),
    addressLine2: z.string().trim().max(255).optional().default(''),
    city: z.string().trim().min(2, 'Please enter your city.').max(100),
    state: z.enum(INDIAN_STATES, { errorMap: () => ({ message: 'Please select your state.' }) }),
    pincode: z.string().trim().regex(PINCODE_RE, 'Please enter a valid 6-digit PIN code.'),
    buyerGstin: z.string().trim().toUpperCase().optional().default('')
      .refine((v) => v === '' || GSTIN_RE.test(v), 'Please enter a valid 15-character GSTIN, or leave it blank.'),
    buyerCompany: z.string().trim().max(150).optional().default(''),
    note: z.string().trim().max(1000).optional().default(''),
  }),
})

export type CheckoutInput = z.input<typeof checkoutSchema>

export type StartCheckoutResult =
  | {
      ok: true
      keyId: string
      razorpayOrderId: string
      amountPaise: number
      orderNumber: string
      prefill: { name: string; email: string; contact: string }
    }
  | { ok: false; error: string }

async function clientIp(): Promise<string | null> {
  const hdrs = await headers()
  return hdrs.get('x-forwarded-for')?.split(',')[0]?.trim() ?? hdrs.get('x-real-ip') ?? null
}

/**
 * Validates the cart against the database, creates a pending order and a
 * matching Razorpay order. Prices always come from the database.
 */
export async function startCheckout(input: CheckoutInput): Promise<StartCheckoutResult> {
  const parsed = checkoutSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: parsed.error.errors[0]?.message ?? 'Please check your details.' }

  if (!isRazorpayConfigured()) {
    return { ok: false, error: 'Online payment is not available right now. Please contact us on WhatsApp to place your order.' }
  }

  const ip = await clientIp()
  if (!rateLimit(`checkout:${ip ?? 'unknown'}`, { maxRequests: 10, windowMs: 10 * 60 * 1000 }).success) {
    return { ok: false, error: 'Too many attempts. Please wait a few minutes and try again.' }
  }

  const { items, customer } = parsed.data

  const products = await prisma.product.findMany({
    where: { id: { in: items.map((i) => i.productId) } },
    select: {
      id: true, name: true, sku: true, status: true, price: true, salePrice: true,
      stockStatus: true, stockQty: true, optionName: true, optionValues: true,
      hsnCode: true, gstRate: true,
      images: { where: { isPrimary: true }, take: 1, select: { url: true } },
    },
  })
  const byId = new Map(products.map((p) => [p.id, p]))

  const lines: Prisma.OrderItemCreateWithoutOrderInput[] = []
  let subtotal = new Prisma.Decimal(0)

  for (const item of items) {
    const p = byId.get(item.productId)
    if (!p || p.status !== 'ACTIVE') return { ok: false, error: 'An item in your cart is no longer available. Please remove it and try again.' }
    const unit = p.salePrice ?? p.price
    if (!unit) return { ok: false, error: `${p.name} is available on request only. Please contact us for a price.` }
    if (p.stockStatus === 'OUT_OF_STOCK') return { ok: false, error: `${p.name} is out of stock. Please remove it from your cart.` }
    if (p.stockQty !== null && p.stockQty < item.quantity) {
      return { ok: false, error: `Only ${p.stockQty} × ${p.name} left in stock. Please reduce the quantity.` }
    }
    if (p.optionValues.length > 0 && (!item.option || !p.optionValues.includes(item.option))) {
      return { ok: false, error: `Please choose a ${p.optionName?.toLowerCase() ?? 'option'} for ${p.name}.` }
    }

    const lineTotal = unit.mul(item.quantity)
    subtotal = subtotal.add(lineTotal)
    lines.push({
      product: { connect: { id: p.id } },
      productName: p.name,
      sku: p.sku,
      option: p.optionValues.length > 0 && item.option ? `${p.optionName ?? 'Option'}: ${item.option}` : null,
      imageUrl: p.images[0]?.url ?? null,
      unitPrice: unit,
      quantity: item.quantity,
      lineTotal,
      hsnCode: p.hsnCode,
      gstRate: p.gstRate,
    })
  }

  const shippingFee = new Prisma.Decimal(0) // Free delivery for all B2C orders in India
  const total = subtotal.add(shippingFee)
  const amountPaise = total.mul(100).toDecimalPlaces(0).toNumber()
  if (amountPaise < 100) return { ok: false, error: 'Order total is too low to process.' }

  try {
    const orderNumber = await generateOrderNumber()
    const order = await prisma.order.create({
      data: {
        orderNumber,
        accessToken: generateAccessToken(),
        customerName: customer.name,
        email: customer.email.toLowerCase(),
        phone: normaliseIndianMobile(customer.phone),
        addressLine1: customer.addressLine1,
        addressLine2: customer.addressLine2 || null,
        city: customer.city,
        state: customer.state,
        pincode: customer.pincode,
        buyerGstin: customer.buyerGstin || null,
        buyerCompany: customer.buyerCompany || null,
        customerNote: customer.note || null,
        subtotal,
        shippingFee,
        total,
        ipAddress: ip,
        items: { create: lines },
      },
    })

    let rzp
    try {
      rzp = await createRazorpayOrder({
        amountPaise,
        receipt: orderNumber,
        notes: { orderNumber, orderId: order.id },
      })
    } catch (err) {
      // No payment can happen without a Razorpay order — don't leave an orphan pending order behind
      await prisma.order.delete({ where: { id: order.id } }).catch(() => {})
      throw err
    }
    await prisma.order.update({ where: { id: order.id }, data: { razorpayOrderId: rzp.id } })

    return {
      ok: true,
      keyId: getRazorpayKeyId(),
      razorpayOrderId: rzp.id,
      amountPaise,
      orderNumber,
      prefill: { name: customer.name, email: customer.email, contact: normaliseIndianMobile(customer.phone) },
    }
  } catch (err) {
    console.error('[checkout] failed to create order', err)
    return { ok: false, error: 'We could not start the payment. Please try again in a moment.' }
  }
}

/** Called after Razorpay Checkout succeeds. Verifies the signature, then marks the order paid. */
export async function confirmPayment(params: {
  razorpayOrderId: string
  razorpayPaymentId: string
  razorpaySignature: string
}): Promise<{ ok: true; accessToken: string } | { ok: false; error: string }> {
  const valid = verifyPaymentSignature({
    orderId: params.razorpayOrderId,
    paymentId: params.razorpayPaymentId,
    signature: params.razorpaySignature,
  })
  if (!valid) return { ok: false, error: 'We could not verify your payment. If money was deducted, please contact us with your order number.' }

  await markOrderPaid(params.razorpayOrderId, params.razorpayPaymentId)

  const order = await prisma.order.findUnique({
    where: { razorpayOrderId: params.razorpayOrderId },
    select: { accessToken: true },
  })
  if (!order) return { ok: false, error: 'Order not found.' }
  return { ok: true, accessToken: order.accessToken }
}

/**
 * Re-checks a pending order with Razorpay (e.g. the customer closed the tab
 * after paying). Marks it paid if Razorpay reports a captured payment.
 */
export async function refreshOrderPayment(accessToken: string): Promise<void> {
  const order = await prisma.order.findUnique({
    where: { accessToken },
    select: { status: true, razorpayOrderId: true },
  })
  if (!order?.razorpayOrderId || order.status !== 'PENDING_PAYMENT' || !isRazorpayConfigured()) return
  try {
    const payments = await fetchRazorpayOrderPayments(order.razorpayOrderId)
    const captured = payments.find((p) => p.status === 'captured')
    if (captured) await markOrderPaid(order.razorpayOrderId, captured.id)
  } catch (err) {
    console.error('[checkout] payment refresh failed', err)
  }
}

export async function reportPaymentFailed(razorpayOrderId: string): Promise<void> {
  await prisma.order.updateMany({
    where: { razorpayOrderId, status: 'PENDING_PAYMENT' },
    data: { status: 'PAYMENT_FAILED' },
  })
}

/** Order-status lookup by order number + email. Returns the access token on a match. */
export async function lookupOrder(formData: FormData): Promise<{ ok: true; accessToken: string } | { ok: false; error: string }> {
  const orderNumber = String(formData.get('orderNumber') ?? '').trim().toUpperCase()
  const email = String(formData.get('email') ?? '').trim().toLowerCase()
  if (!orderNumber || !email) return { ok: false, error: 'Please enter your order number and email address.' }

  const ip = await clientIp()
  if (!rateLimit(`order-lookup:${ip ?? 'unknown'}`, { maxRequests: 10, windowMs: 10 * 60 * 1000 }).success) {
    return { ok: false, error: 'Too many attempts. Please wait a few minutes and try again.' }
  }

  const order = await prisma.order.findUnique({ where: { orderNumber }, select: { email: true, accessToken: true } })
  if (!order || order.email !== email) {
    return { ok: false, error: "We couldn't find an order with those details. Please check and try again." }
  }
  return { ok: true, accessToken: order.accessToken }
}

// ─── Admin ────────────────────────────────────────────────────────────────────

const ADMIN_STATUSES: OrderStatus[] = ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED']

export async function updateOrder(id: string, formData: FormData): Promise<{ ok: boolean; error?: string; emailed?: boolean }> {
  const session = await auth()
  if (!session) return { ok: false, error: 'Unauthorized' }

  const status = String(formData.get('status') ?? '') as OrderStatus
  if (status && !ADMIN_STATUSES.includes(status) && status !== 'PENDING_PAYMENT' && status !== 'PAYMENT_FAILED') {
    return { ok: false, error: 'Invalid status' }
  }
  const courier = String(formData.get('courier') ?? '').trim() || null
  const trackingNumber = String(formData.get('trackingNumber') ?? '').trim() || null
  const trackingUrl = String(formData.get('trackingUrl') ?? '').trim() || null
  const adminNotes = String(formData.get('adminNotes') ?? '').trim() || null
  const notifyCustomer = formData.get('notifyCustomer') === 'on'

  if (trackingUrl && !/^https?:\/\//i.test(trackingUrl)) return { ok: false, error: 'Tracking URL must start with http:// or https://' }

  const before = await prisma.order.findUnique({ where: { id }, select: { status: true, shippedAt: true } })
  if (!before) return { ok: false, error: 'Order not found' }

  const order = await prisma.order.update({
    where: { id },
    data: {
      ...(status ? { status } : {}),
      courier,
      trackingNumber,
      trackingUrl,
      adminNotes,
      ...(status === 'SHIPPED' && !before.shippedAt ? { shippedAt: new Date() } : {}),
    },
    include: { items: true },
  })

  let emailed = false
  if (notifyCustomer && status === 'SHIPPED') {
    emailed = await sendShippedNotification(order)
  }

  revalidatePath('/admin/orders')
  revalidatePath(`/admin/orders/${id}`)
  return { ok: true, emailed }
}
