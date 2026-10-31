import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { CheckCircle2, Clock, XCircle, Truck, FileText } from 'lucide-react'
import { prisma } from '@/lib/db/prisma'
import { formatPrice, formatDate } from '@/lib/utils/format'
import { refreshOrderPayment } from '@/lib/actions/orders'
import { getSiteSettings } from '@/lib/utils/settings'
import { getWhatsAppUrl } from '@/lib/config/site'

export const metadata: Metadata = {
  title: 'Your Order',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

const STATUS_COPY: Record<string, { title: string; text: string; tone: 'ok' | 'wait' | 'bad' }> = {
  PENDING_PAYMENT: { title: 'Awaiting payment', text: 'We have not received payment for this order yet. If you just paid, this page will update in a moment.', tone: 'wait' },
  PAYMENT_FAILED: { title: 'Payment failed', text: 'The payment for this order did not go through. No money has been taken — please try again from your cart.', tone: 'bad' },
  PAID: { title: 'Thank you — order confirmed', text: 'We have received your payment and will pack your order shortly. A confirmation has been sent to your email.', tone: 'ok' },
  PROCESSING: { title: 'Your order is being packed', text: 'We are preparing your order for dispatch.', tone: 'ok' },
  SHIPPED: { title: 'Your order is on its way', text: 'Your order has been dispatched.', tone: 'ok' },
  DELIVERED: { title: 'Delivered', text: 'Your order has been delivered. Enjoy your new gear!', tone: 'ok' },
  CANCELLED: { title: 'Order cancelled', text: 'This order has been cancelled. If you paid, your refund is processed to the original payment method.', tone: 'bad' },
  REFUNDED: { title: 'Order refunded', text: 'This order has been refunded to your original payment method.', tone: 'bad' },
}

export default async function OrderConfirmationPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  if (!/^[A-Za-z0-9_-]{20,64}$/.test(token)) notFound()

  await refreshOrderPayment(token)
  const order = await prisma.order.findUnique({ where: { accessToken: token }, include: { items: true } })
  if (!order) notFound()

  const { shipping_delivery_time } = await getSiteSettings(['shipping_delivery_time'])
  const copy = STATUS_COPY[order.status] ?? STATUS_COPY.PAID
  const Icon = copy.tone === 'ok' ? CheckCircle2 : copy.tone === 'wait' ? Clock : XCircle
  const iconColor = copy.tone === 'ok' ? 'text-green-600' : copy.tone === 'wait' ? 'text-orange-500' : 'text-red-500'
  const isPaid = ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'REFUNDED'].includes(order.status)

  return (
    <div className="mx-auto max-w-[900px] px-4 py-12 sm:px-8 lg:py-16">
      <div className="mb-10 text-center">
        <Icon className={`mx-auto mb-4 h-12 w-12 ${iconColor}`} />
        <h1 className="font-display text-[30px] font-bold uppercase text-[#111] sm:text-[38px]">{copy.title}</h1>
        <p className="mx-auto mt-3 max-w-[560px] text-sm leading-relaxed text-[#6B6B6B]">{copy.text}</p>
        <p className="mt-4 text-sm text-[#111]">Order number: <strong>{order.orderNumber}</strong></p>
        <p className="text-xs text-[#999]">Placed on {formatDate(order.createdAt)}</p>
      </div>

      {order.status === 'SHIPPED' && order.trackingNumber && (
        <div className="mb-8 flex flex-col items-start gap-3 border border-[#E0DFDB] bg-[#F8F7F4] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 text-sm">
            <Truck className="h-5 w-5 text-[#E85D1A]" />
            <span>{order.courier ? `${order.courier} · ` : ''}Tracking number <strong>{order.trackingNumber}</strong></span>
          </div>
          {order.trackingUrl && (
            <a href={order.trackingUrl} target="_blank" rel="noopener noreferrer" className="rounded-[2px] bg-[#E85D1A] px-5 py-2 font-display text-xs font-semibold uppercase tracking-[0.1em] text-white">Track parcel</a>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_280px]">
        <section>
          <h2 className="mb-3 font-display text-sm font-bold uppercase tracking-[0.12em] text-[#111]">Items</h2>
          <ul className="divide-y divide-[#E0DFDB] border-y border-[#E0DFDB]">
            {order.items.map((item) => (
              <li key={item.id} className="flex gap-4 py-4 text-sm">
                <div className="relative h-16 w-16 shrink-0 bg-[#F8F7F4]">
                  {item.imageUrl && <Image src={item.imageUrl} alt="" fill sizes="64px" className="object-contain p-1" />}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-[#111]">{item.productName}</p>
                  {item.option && <p className="text-xs text-[#6B6B6B]">{item.option}</p>}
                  <p className="text-xs text-[#6B6B6B]">Qty {item.quantity} × {formatPrice(Number(item.unitPrice))}</p>
                </div>
                <p className="font-semibold">{formatPrice(Number(item.lineTotal))}</p>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-1.5 text-sm">
            <div className="flex justify-between"><dt className="text-[#6B6B6B]">Subtotal</dt><dd>{formatPrice(Number(order.subtotal))}</dd></div>
            <div className="flex justify-between"><dt className="text-[#6B6B6B]">Delivery</dt><dd>{Number(order.shippingFee) === 0 ? 'FREE' : formatPrice(Number(order.shippingFee))}</dd></div>
            <div className="flex justify-between border-t border-[#E0DFDB] pt-2 text-base font-semibold"><dt>Total (incl. GST)</dt><dd>{formatPrice(Number(order.total))}</dd></div>
          </dl>
        </section>

        <aside className="space-y-6 text-sm">
          <div>
            <h2 className="mb-2 font-display text-sm font-bold uppercase tracking-[0.12em] text-[#111]">Delivering to</h2>
            <p className="leading-relaxed text-[#444]">
              {order.customerName}<br />{order.addressLine1}{order.addressLine2 && <><br />{order.addressLine2}</>}<br />
              {order.city}, {order.state} {order.pincode}<br />{order.phone}
            </p>
            {isPaid && order.status !== 'DELIVERED' && <p className="mt-2 text-xs text-[#6B6B6B]">Estimated delivery: {shipping_delivery_time}</p>}
          </div>
          {isPaid && (
            <Link href={`/invoice/${order.accessToken}`} target="_blank" className="flex items-center gap-2 font-semibold text-[#E85D1A] underline">
              <FileText className="h-4 w-4" /> View / print tax invoice
            </Link>
          )}
          <div className="border-t border-[#E0DFDB] pt-4 text-[#6B6B6B]">
            Questions about your order?{' '}
            <a href={getWhatsAppUrl(`Hi, I have a question about order ${order.orderNumber}.`)} target="_blank" rel="noopener noreferrer" className="font-semibold text-[#111] underline">WhatsApp us</a>{' '}
            or <Link href="/contact" className="font-semibold text-[#111] underline">contact us</Link>.
          </div>
        </aside>
      </div>

      <div className="mt-12 text-center">
        <Link href="/shop" className="inline-block rounded-[2px] bg-[#111] px-8 py-3 font-display text-sm font-semibold uppercase tracking-[0.1em] text-white hover:bg-[#E85D1A]">Continue Shopping</Link>
      </div>
    </div>
  )
}
