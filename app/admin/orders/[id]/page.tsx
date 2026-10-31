import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db/prisma'
import { formatDate, formatPrice } from '@/lib/utils/format'
import { ORDER_STATUS_BADGE } from '@/components/admin/orderStatus'
import { OrderActions } from './OrderActions'

export const metadata: Metadata = { title: 'Order' }

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const order = await prisma.order.findUnique({ where: { id }, include: { items: true } }).catch(() => null)
  if (!order) notFound()

  return (
    <div className="max-w-5xl">
      <Link href="/admin/orders" className="text-sm text-neutral-500 hover:text-brand-600">← All orders</Link>

      <div className="mb-6 mt-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold uppercase tracking-tight text-neutral-900">{order.orderNumber}</h1>
          <p className="text-sm text-neutral-500">
            Placed {formatDate(order.createdAt, { hour: '2-digit', minute: '2-digit' })}
            {order.paidAt && <> · Paid {formatDate(order.paidAt, { hour: '2-digit', minute: '2-digit' })}</>}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`rounded px-2.5 py-1 text-xs font-semibold uppercase ${ORDER_STATUS_BADGE[order.status] ?? ''}`}>{order.status.replace('_', ' ')}</span>
          {order.paidAt && (
            <Link href={`/invoice/${order.accessToken}`} target="_blank" className="rounded border border-neutral-300 px-3 py-1.5 text-sm hover:bg-neutral-50">Invoice ↗</Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <section className="rounded border border-neutral-200 bg-white">
            <h2 className="border-b border-neutral-200 px-4 py-3 text-sm font-semibold text-neutral-700">Items</h2>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-neutral-100">
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3">
                      {item.productId ? (
                        <Link href={`/admin/products/${item.productId}/edit`} className="font-medium text-neutral-900 hover:text-brand-600">{item.productName}</Link>
                      ) : (
                        <span className="font-medium text-neutral-900">{item.productName}</span>
                      )}
                      {item.option && <p className="text-xs text-neutral-500">{item.option}</p>}
                      {item.sku && <p className="text-xs text-neutral-400">SKU {item.sku}</p>}
                    </td>
                    <td className="px-4 py-3 text-right text-neutral-600">{item.quantity} × {formatPrice(Number(item.unitPrice))}</td>
                    <td className="px-4 py-3 text-right font-medium text-neutral-900">{formatPrice(Number(item.lineTotal))}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t border-neutral-200 text-sm">
                <tr><td className="px-4 py-2 text-neutral-500" colSpan={2}>Delivery</td><td className="px-4 py-2 text-right">{Number(order.shippingFee) === 0 ? 'Free' : formatPrice(Number(order.shippingFee))}</td></tr>
                <tr><td className="px-4 py-2 font-semibold" colSpan={2}>Total (incl. GST)</td><td className="px-4 py-2 text-right font-semibold">{formatPrice(Number(order.total))}</td></tr>
              </tfoot>
            </table>
          </section>

          <section className="grid grid-cols-1 gap-6 rounded border border-neutral-200 bg-white p-4 text-sm sm:grid-cols-2">
            <div>
              <h2 className="mb-2 font-semibold text-neutral-700">Customer</h2>
              <p>{order.customerName}</p>
              <p><a href={`mailto:${order.email}`} className="text-brand-600 hover:underline">{order.email}</a></p>
              <p><a href={`tel:${order.phone}`} className="text-brand-600 hover:underline">{order.phone}</a></p>
              {order.buyerCompany && <p className="mt-2">{order.buyerCompany}</p>}
              {order.buyerGstin && <p>GSTIN: <strong>{order.buyerGstin}</strong></p>}
            </div>
            <div>
              <h2 className="mb-2 font-semibold text-neutral-700">Ship to</h2>
              <p>{order.addressLine1}</p>
              {order.addressLine2 && <p>{order.addressLine2}</p>}
              <p>{order.city}, {order.state} {order.pincode}</p>
            </div>
            {order.customerNote && (
              <div className="sm:col-span-2">
                <h2 className="mb-1 font-semibold text-neutral-700">Customer note</h2>
                <p className="whitespace-pre-line text-neutral-600">{order.customerNote}</p>
              </div>
            )}
            <div className="text-xs text-neutral-400 sm:col-span-2">
              Razorpay order {order.razorpayOrderId ?? '—'}{order.razorpayPaymentId && <> · payment {order.razorpayPaymentId}</>}
              {order.confirmationSentAt ? ' · confirmation email sent' : order.paidAt ? ' · confirmation email NOT sent (check SMTP settings)' : ''}
            </div>
          </section>
        </div>

        <OrderActions
          orderId={order.id}
          status={order.status}
          courier={order.courier ?? ''}
          trackingNumber={order.trackingNumber ?? ''}
          trackingUrl={order.trackingUrl ?? ''}
          adminNotes={order.adminNotes ?? ''}
        />
      </div>
    </div>
  )
}
