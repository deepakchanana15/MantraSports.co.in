'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { X } from 'lucide-react'
import { createCollection, updateCollection } from '@/lib/actions/collections'
import { slugify } from '@/lib/utils/slugify'
import type { Collection, CollectionProduct, Product } from '@prisma/client'

type CollectionWithProducts = Collection & {
  collectionProducts: (CollectionProduct & { product: Pick<Product, 'id' | 'name'> })[]
}

interface CollectionFormProps {
  collection?: CollectionWithProducts | null
  allProducts: Pick<Product, 'id' | 'name'>[]
}

const inputCls = 'w-full rounded border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500'

export function CollectionForm({ collection, allProducts }: CollectionFormProps) {
  const router = useRouter()
  const isEdit = !!collection

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [name, setName] = useState(collection?.name ?? '')
  const [slug, setSlug] = useState(collection?.slug ?? '')
  const [slugManual, setSlugManual] = useState(isEdit)

  const [selectedIds, setSelectedIds] = useState<string[]>(
    collection?.collectionProducts.map((cp) => cp.productId) ?? []
  )
  const [productSearch, setProductSearch] = useState('')

  const handleNameChange = (val: string) => {
    setName(val)
    if (!slugManual) setSlug(slugify(val))
  }

  const toggleProduct = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const filteredProducts = allProducts.filter((p) =>
    p.name.toLowerCase().includes(productSearch.toLowerCase())
  )

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    const fd = new FormData(e.currentTarget)
    fd.set('name', name)
    fd.set('slug', slug)
    fd.set('productIds', JSON.stringify(selectedIds))

    try {
      if (isEdit) {
        await updateCollection(collection.id, fd)
      } else {
        await createCollection(fd)
      }
      router.push('/admin/collections')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error saving collection.')
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded border border-neutral-200 bg-white p-6">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-neutral-500">Details</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className={inputCls}
                  placeholder="e.g. New Arrivals 2025"
                  required
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700">Slug</label>
                <input
                  value={slug}
                  onChange={(e) => { setSlug(e.target.value); setSlugManual(true) }}
                  className={inputCls}
                  placeholder="new-arrivals-2025"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700">Description</label>
                <textarea
                  name="description"
                  rows={3}
                  defaultValue={collection?.description ?? ''}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700">Banner Image URL</label>
                <input
                  name="bannerUrl"
                  defaultValue={collection?.bannerUrl ?? ''}
                  className={inputCls}
                  placeholder="https://..."
                />
              </div>
              <label className="flex cursor-pointer items-center gap-2.5 text-sm text-neutral-700">
                <input
                  type="checkbox"
                  name="isFeatured"
                  defaultChecked={!!collection?.isFeatured}
                  className="h-4 w-4 rounded border-neutral-300 accent-brand-500"
                />
                Featured collection (shown on homepage)
              </label>
            </div>
          </div>

          {/* Product picker */}
          <div className="rounded border border-neutral-200 bg-white p-6">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-neutral-500">
              Products in Collection ({selectedIds.length})
            </h2>
            <input
              type="text"
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              placeholder="Search products…"
              className={`${inputCls} mb-3`}
            />
            <div className="max-h-64 overflow-y-auto rounded border border-neutral-200">
              {filteredProducts.length === 0 ? (
                <p className="p-4 text-sm text-neutral-400">No products found.</p>
              ) : (
                filteredProducts.map((p) => (
                  <label
                    key={p.id}
                    className="flex cursor-pointer items-center gap-3 border-b border-neutral-100 px-3 py-2 text-sm last:border-0 hover:bg-neutral-50"
                  >
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(p.id)}
                      onChange={() => toggleProduct(p.id)}
                      className="h-4 w-4 rounded border-neutral-300 accent-brand-500"
                    />
                    {p.name}
                  </label>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded border border-neutral-200 bg-white p-6">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-neutral-500">SEO</h2>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs text-neutral-500">Meta Title</label>
                <input name="metaTitle" defaultValue={collection?.metaTitle ?? ''} maxLength={70} className={inputCls} />
              </div>
              <div>
                <label className="mb-1 block text-xs text-neutral-500">Meta Description</label>
                <textarea name="metaDescription" rows={2} defaultValue={collection?.metaDescription ?? ''} maxLength={160} className={inputCls} />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded bg-brand-500 px-4 py-2.5 font-display text-sm font-bold uppercase tracking-wider text-white hover:bg-brand-600 disabled:opacity-60"
            >
              {submitting ? 'Saving…' : isEdit ? 'Update Collection' : 'Create Collection'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/admin/collections')}
              className="w-full rounded border border-neutral-300 px-4 py-2.5 text-sm text-neutral-600 hover:bg-neutral-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}
