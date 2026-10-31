import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/db/prisma'
import { formatDate } from '@/lib/utils/format'

export const metadata: Metadata = { title: 'Enquiries' }

const STATUS_BADGE: Record<string, string> = {
  NEW:     'bg-brand-100 text-brand-700',
  READ:    'bg-neutral-100 text-neutral-600',
  REPLIED: 'bg-green-100 text-green-700',
  CLOSED:  'bg-neutral-100 text-neutral-400',
}

const TYPE_LABEL: Record<string, string> = {
  QUOTE:     'Quote',
  WHOLESALE: 'Wholesale',
  GENERAL:   'General',
}

export default async function EnquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>
}) {
  const params = await searchParams
  const statusFilter = params.status ?? ''
  const page = Math.max(1, parseInt(params.page ?? '1'))
  const PER_PAGE = 25

  let enquiries: any[] = []
  let total = 0
  let newCount = 0
  let dbError = false

  try {
    const where = statusFilter ? { status: statusFilter as any } : {}
    ;[enquiries, total, newCount] = await Promise.all([
      prisma.enquiry.findMany({
        where,
        include: { product: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * PER_PAGE,
        take: PER_PAGE,
      }),
      prisma.enquiry.count({ where }),
      prisma.enquiry.count({ where: { status: 'NEW' } }),
    ])
  } catch {
    dbError = true
  }

  const totalPages = Math.ceil(total / PER_PAGE)

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold uppercase tracking-tight text-neutral-900">Enquiries</h1>
          {newCount > 0 && (
            <p className="mt-0.5 text-sm font-medium text-brand-500">{newCount} new unread</p>
          )}
        </div>
      </div>

      {dbError && (
        <div className="mb-6 rounded border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
          <strong>Database not connected.</strong> Enquiries will appear here once your database is set up.
        </div>
      )}

      {/* Filter tabs */}
      <div className="mb-4 flex gap-1 border-b border-neutral-200">
        {['', 'NEW', 'READ', 'REPLIED', 'CLOSED'].map((s) => (
          <Link
            key={s || 'all'}
            href={s ? `/admin/enquiries?status=${s}` : '/admin/enquiries'}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              statusFilter === s
                ? 'border-b-2 border-brand-500 text-brand-600'
                : 'text-neutral-500 hover:text-neutral-700'
            }`}
          >
            {s || 'All'} {s === 'NEW' && newCount > 0 ? `(${newCount})` : ''}
          </Link>
        ))}
      </div>

      <div className="overflow-hidden rounded border border-neutral-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-neutral-600">From</th>
              <th className="px-4 py-3 text-left font-semibold text-neutral-600">Type</th>
              <th className="px-4 py-3 text-left font-semibold text-neutral-600">Product</th>
              <th className="px-4 py-3 text-left font-semibold text-neutral-600">Date</th>
              <th className="px-4 py-3 text-left font-semibold text-neutral-600">Status</th>
              <th className="px-4 py-3 text-right font-semibold text-neutral-600">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {enquiries.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-neutral-400">
                  {dbError ? 'Connect your database.' : 'No enquiries yet.'}
                </td>
              </tr>
            ) : (
              enquiries.map((enq) => (
                <tr key={enq.id} className={`hover:bg-neutral-50 ${enq.status === 'NEW' ? 'font-medium' : ''}`}>
                  <td className="px-4 py-3">
                    <p className="text-neutral-900">{enq.name}</p>
                    <p className="text-xs text-neutral-400">{enq.email}</p>
                    {enq.company && <p className="text-xs text-neutral-400">{enq.company}</p>}
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-600">
                      {TYPE_LABEL[enq.type] ?? enq.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-neutral-600 text-xs">
                    {enq.product?.name ?? enq.productName ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-neutral-500 text-xs">
                    {formatDate(enq.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded px-2 py-0.5 text-xs font-semibold uppercase ${STATUS_BADGE[enq.status] ?? ''}`}>
                      {enq.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/enquiries/${enq.id}`}
                      className="rounded border border-neutral-200 px-2.5 py-1 text-xs text-neutral-600 hover:border-brand-400 hover:text-brand-600"
                    >
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
            {page > 1 && (
              <Link href={`/admin/enquiries?page=${page - 1}&status=${statusFilter}`}
                className="rounded border border-neutral-300 px-3 py-1.5 hover:bg-neutral-50">← Previous</Link>
            )}
            {page < totalPages && (
              <Link href={`/admin/enquiries?page=${page + 1}&status=${statusFilter}`}
                className="rounded border border-neutral-300 px-3 py-1.5 hover:bg-neutral-50">Next →</Link>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
