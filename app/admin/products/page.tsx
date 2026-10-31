import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/db/prisma'
import { formatPrice } from '@/lib/utils/format'
import { Plus, Pencil, Eye, EyeOff } from 'lucide-react'
import { DeleteProductButton } from './DeleteProductButton'

export const metadata: Metadata = { title: 'Products' }

const STATUS_BADGE: Record<string, string> = {
  ACTIVE:   'bg-green-100 text-green-700',
  DRAFT:    'bg-neutral-100 text-neutral-600',
  HIDDEN:   'bg-yellow-100 text-yellow-700',
  ARCHIVED: 'bg-red-100 text-red-600',
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>
}) {
  const params = await searchParams
  const q = params.q ?? ''
  const statusFilter = params.status ?? ''
  const page = Math.max(1, parseInt(params.page ?? '1'))
  const PER_PAGE = 20

  let products: Awaited<ReturnType<typeof fetchProducts>> = []
  let total = 0
  let dbError = false

  try {
    const where = {
      ...(q ? { name: { contains: q, mode: 'insensitive' as const } } : {}),
      ...(statusFilter ? { status: statusFilter as any } : {}),
    }
    ;[products, total] = await Promise.all([
      fetchProducts(where, page, PER_PAGE),
      prisma.product.count({ where }),
    ])
  } catch {
    dbError = true
  }

  const totalPages = Math.ceil(total / PER_PAGE)

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold uppercase tracking-tight text-neutral-900">Products</h1>
          {!dbError && <p className="mt-0.5 text-sm text-neutral-500">{total} product{total !== 1 ? 's' : ''}</p>}
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 rounded bg-brand-500 px-4 py-2 font-display text-sm font-bold uppercase tracking-wider text-white hover:bg-brand-600"
        >
          <Plus className="h-4 w-4" /> Add Product
        </Link>
      </div>

      {dbError && (
        <div className="mb-6 rounded border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
          <strong>Database not connected.</strong> Set up your PostgreSQL database and run{' '}
          <code className="rounded bg-amber-100 px-1 py-0.5 font-mono text-xs">npx prisma migrate deploy</code>{' '}
          to start managing products.
        </div>
      )}

      {/* Filters */}
      <form method="GET" className="mb-4 flex flex-wrap gap-3">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search products…"
          className="rounded border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
        />
        <select
          name="status"
          defaultValue={statusFilter}
          className="rounded border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
        >
          <option value="">All statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="DRAFT">Draft</option>
          <option value="HIDDEN">Hidden</option>
          <option value="ARCHIVED">Archived</option>
        </select>
        <button type="submit" className="rounded border border-neutral-300 bg-white px-3 py-2 text-sm hover:bg-neutral-50">
          Filter
        </button>
        {(q || statusFilter) && (
          <Link href="/admin/products" className="rounded border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-500 hover:bg-neutral-50">
            Clear
          </Link>
        )}
      </form>

      {/* Table */}
      <div className="overflow-hidden rounded border border-neutral-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-neutral-600">Product</th>
              <th className="px-4 py-3 text-left font-semibold text-neutral-600">Category</th>
              <th className="px-4 py-3 text-left font-semibold text-neutral-600">Price</th>
              <th className="px-4 py-3 text-left font-semibold text-neutral-600">Stock</th>
              <th className="px-4 py-3 text-left font-semibold text-neutral-600">Status</th>
              <th className="px-4 py-3 text-right font-semibold text-neutral-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {products.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-neutral-400">
                  {dbError ? 'Connect your database to manage products.' : q ? 'No products match your search.' : 'No products yet. Add your first product.'}
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p.id} className="hover:bg-neutral-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {p.images[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.images[0].url} alt={p.name} className="h-10 w-10 rounded object-cover" />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded bg-neutral-100 text-lg">🏏</div>
                      )}
                      <div>
                        <p className="font-medium text-neutral-900">{p.name}</p>
                        <p className="text-xs text-neutral-400">{p.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-neutral-600">{p.category?.name ?? '—'}</td>
                  <td className="px-4 py-3">
                    {p.price ? (
                      <span className="font-medium text-neutral-900">{formatPrice(Number(p.price))}</span>
                    ) : (
                      <span className="text-neutral-400">—</span>
                    )}
                    {p.salePrice && (
                      <span className="ml-1 text-xs text-brand-500">→ {formatPrice(Number(p.salePrice))}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      p.stockStatus === 'IN_STOCK' ? 'bg-green-100 text-green-700'
                      : p.stockStatus === 'OUT_OF_STOCK' ? 'bg-red-100 text-red-600'
                      : 'bg-blue-100 text-blue-700'
                    }`}>
                      {p.stockStatus.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded px-2 py-0.5 text-xs font-semibold uppercase ${STATUS_BADGE[p.status] ?? ''}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/products/${p.id}/edit`}
                        className="rounded border border-neutral-200 p-1.5 text-neutral-500 hover:border-brand-400 hover:text-brand-600"
                        title="Edit"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Link>
                      <DeleteProductButton id={p.id} name={p.name} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm">
          <p className="text-neutral-500">Page {page} of {totalPages}</p>
          <div className="flex gap-2">
            {page > 1 && (
              <Link href={`/admin/products?page=${page - 1}&q=${q}&status=${statusFilter}`}
                className="rounded border border-neutral-300 px-3 py-1.5 hover:bg-neutral-50">
                ← Previous
              </Link>
            )}
            {page < totalPages && (
              <Link href={`/admin/products?page=${page + 1}&q=${q}&status=${statusFilter}`}
                className="rounded border border-neutral-300 px-3 py-1.5 hover:bg-neutral-50">
                Next →
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

async function fetchProducts(where: object, page: number, perPage: number) {
  return prisma.product.findMany({
    where,
    include: { images: { where: { isPrimary: true }, take: 1 }, category: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
    skip: (page - 1) * perPage,
    take: perPage,
  })
}
