import { NextResponse } from 'next/server'
import { verifyWebhookSignature } from '@/lib/razorpay'
import { markOrderPaid } from '@/lib/orders'
import { prisma } from '@/lib/db/prisma'

// Razorpay webhook — configure in Razorpay Dashboard → Settings → Webhooks:
//   URL:    https://www.mantrasports.co.in/api/razorpay/webhook
//   Events: payment.captured, order.paid, payment.failed
//   Secret: same value as RAZORPAY_WEBHOOK_SECRET
// Backup path for marking orders paid when the customer closes the browser
// before returning to the site.

export const dynamic = 'force-dynamic'

interface WebhookPayload {
  event: string
  payload: {
    payment?: { entity: { id: string; order_id: string; status: string } }
    order?: { entity: { id: string } }
  }
}

export async function POST(request: Request) {
  const rawBody = await request.text()
  if (!verifyWebhookSignature(rawBody, request.headers.get('x-razorpay-signature'))) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  let body: WebhookPayload
  try {
    body = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const payment = body.payload.payment?.entity
  try {
    if ((body.event === 'payment.captured' || body.event === 'order.paid') && payment?.order_id) {
      await markOrderPaid(payment.order_id, payment.id)
    } else if (body.event === 'payment.failed' && payment?.order_id) {
      await prisma.order.updateMany({
        where: { razorpayOrderId: payment.order_id, status: 'PENDING_PAYMENT' },
        data: { status: 'PAYMENT_FAILED' },
      })
    }
  } catch (err) {
    console.error('[razorpay webhook] processing failed', err)
    // 500 makes Razorpay retry later
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
