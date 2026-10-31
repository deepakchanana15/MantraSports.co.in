import type { Metadata } from 'next'
import Link from 'next/link'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { prisma } from '@/lib/db/prisma'

export const metadata: Metadata = { title: 'Collections' }

export default async function CollectionsPage() {
  let collections: any[] = []
  let dbError = false

  try {
    collections = await prisma.collection.findMany({
      include: { _count: { select: { collectionProducts: true } } },
      orderBy: { sortOrder: 'asc' },
    })
  } catch {
    dbError = true
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold uppercase tracking-tight text-neutral-900">Collections</h1>
        <Link
          href="/admin/collections/new"
          className="flex items-center gap-2 rounded bg-brand-500 px-4 py-2 font-display text-sm font-bold uppercase tracking-wider text-white hover:bg-brand-600"
        >
          <Plus className="h-4 w-4" /> New Collection
        </Link>
      </div>

      {dbError && (
        <div className="mb-6 rounded border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
          <strong>Database not connected.</strong> Set up your database to manage collections.
        </div>
      )}

      <div className="overflow-hidden rounded border border-neutral-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-neutral-600">Name</th>
              <th className="px-4 py-3 text-left font-semibold text-neutral-600">Slug</th>
              <th className="px-4 py-3 text-left font-semibold text-neutral-600">Products</th>
              <th className="px-4 py-3 text-left font-semibold text-neutral-600">Featured</th>
              <th className="px-4 py-3 text-right font-semibold text-neutral-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {collections.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-neutral-400">
                  {dbError ? 'Connect your database.' : 'No collections yet.'}
                </td>
              </tr>
            ) : (
              collections.map((col) => (
                <tr key={col.id} className="hover:bg-neutral-50">
                  <td className="px-4 py-3 font-medium text-neutral-900">{col.name}</td>
                  <td className="px-4 py-3 font-mono text-xs text-neutral-500">{col.slug}</td>
                  <td className="px-4 py-3 text-neutral-600">{col._count.collectionProducts}</td>
                  <td className="px-4 py-3">
                    {col.isFeatured ? (
                      <span className="rounded bg-brand-100 px-2 py-0.5 text-xs font-semibold text-brand-600">Yes</span>
                    ) : (
                      <span className="text-neutral-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/collections/${col.id}/edit`}
                      className="inline-flex items-center gap-1.5 rounded border border-neutral-200 px-2.5 py-1 text-xs text-neutral-600 hover:border-brand-400 hover:text-brand-600"
                    >
                      <Pencil className="h-3 w-3" /> Edit
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
