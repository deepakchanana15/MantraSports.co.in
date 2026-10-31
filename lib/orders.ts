import 'server-only'
import { randomBytes } from 'node:crypto'
import { prisma } from '@/lib/db/prisma'
import { sendOrderConfirmation, sendNewOrderNotification } from '@/lib/email/order-emails'

/** e.g. MSI-261031-7K3Q — date + random suffix, checked for uniqueness. */
export async function generateOrderNumber(): Promise<string> {
  const d = new Date()
  const date = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`
  for (let attempt = 0; attempt < 5; attempt++) {
    const suffix = randomBytes(3).toString('hex').toUpperCase().slice(0, 5)
    const orderNumber = `MSI-${date}-${suffix}`
    const exists = await prisma.order.findUnique({ where: { orderNumber }, select: { id: true } })
    if (!exists) return orderNumber
  }
  throw new Error('Could not generate a unique order number')
}

export function generateAccessToken(): string {
  return randomBytes(24).toString('base64url')
}

/**
 * Marks an order as paid. Safe to call more than once (the browser callback
 * and the Razorpay webhook may both arrive) — only the first call changes the
 * order, reduces stock and sends the emails.
 */
export async function markOrderPaid(razorpayOrderId: string, razorpayPaymentId: string): Promise<boolean> {
  const updated = await prisma.order.updateMany({
    where: { razorpayOrderId, status: { in: ['PENDING_PAYMENT', 'PAYMENT_FAILED'] } },
    data: { status: 'PAID', razorpayPaymentId, paidAt: new Date() },
  })
  if (updated.count === 0) return false

  const order = await prisma.order.findUnique({
    where: { razorpayOrderId },
    include: { items: true },
  })
  if (!order) return false

  // Reduce tracked stock quantities; products without a quantity are untracked.
  for (const item of order.items) {
    if (!item.productId) continue
    await prisma.product.updateMany({
      where: { id: item.productId, stockQty: { not: null } },
      data: { stockQty: { decrement: item.quantity } },
    })
    await prisma.product.updateMany({
      where: { id: item.productId, stockQty: { lte: 0 } },
      data: { stockQty: 0, stockStatus: 'OUT_OF_STOCK' },
    })
  }

  const [sent] = await Promise.all([
    sendOrderConfirmation(order),
    sendNewOrderNotification(order),
  ])
  if (sent) {
    await prisma.order.update({ where: { id: order.id }, data: { confirmationSentAt: new Date() } })
  }
  return true
}
