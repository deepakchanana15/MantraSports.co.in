import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/db/prisma'
import { formatDate, formatPrice } from '@/lib/utils/format'
import { ORDER_STATUS_BADGE } from '@/components/admin/orderStatus'

export const metadata: Metadata = { title: 'Orders' }

const FILTERS = [
  { value: '', label: 'Paid & active' },
  { value: 'PAID', label: 'To pack' },
  { value: 'PROCESSING', label: 'Processing' },
  { value: 'SHIPPED', label: 'Shipped' },
  { value: 'DELIVERED', label: 'Delivered' },
  { value: 'CANCELLED', label: 'Cancelled' },
  { value: 'UNPAID', label: 'Unpaid / failed' },
  { value: 'ALL', label: 'All' },
]

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string; q?: string }>
}) {
  const params = await searchParams
  const statusFilter = params.status ?? ''
  const q = (params.q ?? '').trim()
  const page = Math.max(1, parseInt(params.page ?? '1') || 1)
  const PER_PAGE = 25

  let orders: any[] = []
  let total = 0
  let toPack = 0
  let dbError = false

  const statusWhere =
    statusFilter === 'ALL' ? {}
    : statusFilter === 'UNPAID' ? { status: { in: ['PENDING_PAYMENT', 'PAYMENT_FAILED'] as any } }
    : statusFilter ? { status: statusFilter as any }
    : { status: { in: ['PAID', 'PROCESSING', 'SHIPPED'] as any } }
  const where = {
    ...statusWhere,
    ...(q ? { OR: [
      { orderNumber: { contains: q, mode: 'insensitive' as const } },
      { email: { contains: q, mode: 'insensitive' as const } },
      { customerName: { contains: q, mode: 'insensitive' as const } },
      { phone: { contains: q } },
    ] } : {}),
  }

  try {
    ;[orders, total, toPack] = await Promise.all([
      prisma.order.findMany({
        where,
        include: { _count: { select: { items: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * PER_PAGE,
        take: PER_PAGE,
      }),
      prisma.order.count({ where }),
      prisma.order.count({ where: { status: 'PAID' } }),
    ])
  } catch {
    dbError = true
  }

  const totalPages = Math.ceil(total / PER_PAGE)
  const qs = (p: number) => `/admin/orders?page=${p}${statusFilter ? `&status=${statusFilter}` : ''}${q ? `&q=${encodeURIComponent(q)}` : ''}`

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold uppercase tracking-tight text-neutral-900">Orders</h1>
          {toPack > 0 && <p className="mt-0.5 text-sm font-medium text-brand-500">{toPack} paid {toPack === 1 ? 'order' : 'orders'} to pack</p>}
        </div>
        <form method="GET" action="/admin/orders" className="flex gap-2">
          {statusFilter && <input type="hidden" name="status" value={statusFilter} />}
          <input name="q" defaultValue={q} placeholder="Order no., name, email, phone" className="w-64 rounded border border-neutral-300 px-3 py-1.5 text-sm" />
          <button type="submit" className="rounded border border-neutral-300 px-3 py-1.5 text-sm hover:bg-neutral-50">Search</button>
        </form>
      </div>

      {dbError && (
        <div className="mb-6 rounded border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
          <strong>Database not connected.</strong> Orders will appear here once your database is set up.
        </div>
      )}

      <div className="mb-4 flex flex-wrap gap-1 border-b border-neutral-200">
        {FILTERS.map((f) => (
          <Link
            key={f.value || 'default'}
            href={f.value ? `/admin/orders?status=${f.value}` : '/admin/orders'}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              statusFilter === f.value ? 'border-b-2 border-brand-500 text-brand-600' : 'text-neutral-500 hover:text-neutral-700'
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      <div className="overflow-x-auto rounded border border-neutral-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-neutral-600">Order</th>
              <th className="px-4 py-3 text-left font-semibold text-neutral-600">Customer</th>
              <th className="px-4 py-3 text-left font-semibold text-neutral-600">Ship to</th>
              <th className="px-4 py-3 text-right font-semibold text-neutral-600">Total</th>
              <th className="px-4 py-3 text-left font-semibold text-neutral-600">Status</th>
              <th className="px-4 py-3 text-right font-semibold text-neutral-600">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-neutral-400">
                  {dbError ? 'Connect your database.' : 'No orders here yet.'}
                </td>
              </tr>
            ) : (
              orders.map((o) => (
                <tr key={o.id} className={`hover:bg-neutral-50 ${o.status === 'PAID' ? 'font-medium' : ''}`}>
                  <td className="px-4 py-3">
                    <p className="text-neutral-900">{o.orderNumber}</p>
                    <p className="text-xs text-neutral-400">{formatDate(o.createdAt)} · {o._count.items} {o._count.items === 1 ? 'item' : 'items'}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-neutral-900">{o.customerName}</p>
                    <p className="text-xs text-neutral-400">{o.email}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-neutral-600">{o.city}, {o.state}</td>
                  <td className="px-4 py-3 text-right text-neutral-900">{formatPrice(Number(o.total))}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded px-2 py-0.5 text-xs font-semibold uppercase ${ORDER_STATUS_BADGE[o.status] ?? ''}`}>
                      {o.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/orders/${o.id}`} className="rounded border border-neutral-200 px-2.5 py-1 text-xs text-neutral-600 hover:border-brand-400 hover:text-brand-600">
                      View →
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm">
          <p className="text-neutral-500">Page {page} of {totalPages}</p>
          <div className="flex gap-2">
            {page > 1 && <Link href={qs(page - 1)} className="rounded border border-neutral-300 px-3 py-1.5 hover:bg-neutral-50">← Previous</Link>}
            {page < totalPages && <Link href={qs(page + 1)} className="rounded border border-neutral-300 px-3 py-1.5 hover:bg-neutral-50">Next →</Link>}
          </div>
        </div>
      )}
    </div>
  )
}
