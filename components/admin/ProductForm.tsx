'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, X, GripVertical, Star, Plus } from 'lucide-react'
import { createProduct, updateProduct } from '@/lib/actions/products'
import { slugify } from '@/lib/utils/slugify'
import type { Product, ProductImage, Category } from '@prisma/client'

// ── Types ─────────────────────────────────────────────────────────────────────

type ProductWithImages = Product & { images: ProductImage[] }

interface ImageEntry {
  url: string
  altText: string
  isPrimary: boolean
  sortOrder: number
}

interface ProductFormProps {
  product?: ProductWithImages | null
  categories: Pick<Category, 'id' | 'name'>[]
}

// ── Reusable field wrapper ────────────────────────────────────────────────────

function Field({
  label,
  htmlFor,
  hint,
  required,
  children,
}: {
  label: string
  htmlFor: string
  hint?: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-neutral-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs text-neutral-400">{hint}</p>}
    </div>
  )
}

// ── Input / Textarea / Select components ─────────────────────────────────────

const inputCls =
  'w-full rounded border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 disabled:bg-neutral-50 disabled:text-neutral-400'

const sectionCls = 'rounded border border-neutral-200 bg-white p-6'

// ── Main Form ─────────────────────────────────────────────────────────────────

// Shell: only runs on SSR — returns skeleton, then renders inner component client-side
export function ProductForm(props: ProductFormProps) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  if (!mounted) {
    return <div className="py-12 text-center text-sm text-neutral-400">Loading form…</div>
  }
  return <ProductFormContent {...props} />
}

// Inner form: never executed on the server
function ProductFormContent({ product, categories }: ProductFormProps) {
  const router = useRouter()
  const isEdit = !!product

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Core fields
  const [name, setName] = useState(product?.name ?? '')
  const [slug, setSlug] = useState(product?.slug ?? '')
  const [slugManual, setSlugManual] = useState(isEdit)

  // Images
  const [images, setImages] = useState<ImageEntry[]>(
    product?.images
      ?.sort((a, b) => a.sortOrder - b.sortOrder)
      ?.map((img) => ({
        url: img.url,
        altText: img.altText ?? '',
        isPrimary: img.isPrimary,
        sortOrder: img.sortOrder,
      })) ?? []
  )
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  // Tags
  const [tagsInput, setTagsInput] = useState(product?.tags?.join(', ') ?? '')

  // ── Name → auto-slug ────────────────────────────────────────────────────────
  const handleNameChange = (val: string) => {
    setName(val)
    if (!slugManual) setSlug(slugify(val))
  }

  // ── File upload (direct to Cloudinary — bypasses Vercel 4.5MB limit) ────────
  const uploadFile = useCallback(async (file: File) => {
    setUploading(true)
    try {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? 'dgeaaga0s'
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? 'mantrasports_nl'
      if (!cloudName || !uploadPreset) throw new Error('Cloudinary is not configured.')
      const fd = new FormData()
      fd.append('file', file)
      fd.append('upload_preset', uploadPreset)
      fd.append('folder', 'mantrasports/products')
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: fd,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error?.message ?? 'Upload failed')
      setImages((prev) => [
        ...prev,
        {
          url: data.secure_url as string,
          altText: name || '',
          isPrimary: prev.length === 0,
          sortOrder: prev.length,
        },
      ])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }, [name])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    for (const file of files) await uploadFile(file)
    e.target.value = ''
  }

  const removeImage = (idx: number) => {
    setImages((prev) => {
      const updated = prev.filter((_, i) => i !== idx).map((img, i) => ({
        ...img,
        sortOrder: i,
        isPrimary: i === 0,
      }))
      return updated
    })
  }

  const setPrimary = (idx: number) => {
    setImages((prev) => prev.map((img, i) => ({ ...img, isPrimary: i === idx })))
  }

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    const fd = new FormData(e.currentTarget)
    fd.set('images', JSON.stringify(images))
    fd.set('tags', tagsInput)
    fd.set('name', name)
    fd.set('slug', slug)

    try {
      if (isEdit) {
        await updateProduct(product.id, fd)
        router.push('/admin/products')
      } else {
        const result = await createProduct(fd)
        router.push('/admin/products')
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      // Next.js sanitises server action errors in production — show a clear fallback
      const isGeneric = msg.includes('Server Components render') || msg.includes('omitted in production')
      setError(isGeneric ? 'Save failed. Check that the product name is unique and all required fields are filled in, then try again.' : msg)
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* ── Left column (2/3) ─────────────────────────────────────── */}
        <div className="space-y-6 lg:col-span-2">

          {/* Core details */}
          <div className={sectionCls}>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-neutral-500">
              Product Details
            </h2>
            <div className="space-y-4">
              <Field label="Product Name" htmlFor="name" required>
                <input
                  id="name"
                  name="name"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className={inputCls}
                  placeholder="e.g. Magnitude Legend Cricket Bat"
                  required
                />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Slug (URL)" htmlFor="slug" hint="Auto-generated from name. Edit to customise.">
                  <input
                    id="slug"
                    name="slug"
                    value={slug}
                    onChange={(e) => { setSlug(e.target.value); setSlugManual(true) }}
                    className={inputCls}
                    placeholder="magnitude-legend-cricket-bat"
                  />
                </Field>
                <Field label="SKU" htmlFor="sku">
                  <input
                    id="sku"
                    name="sku"
                    defaultValue={product?.sku ?? ''}
                    className={inputCls}
                    placeholder="ML-001"
                  />
                </Field>
              </div>

              <Field label="Category" htmlFor="categoryId">
                <select
                  id="categoryId"
                  name="categoryId"
                  defaultValue={product?.categoryId ?? ''}
                  className={inputCls}
                >
                  <option value="">— No category —</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </Field>

              <Field label="Description" htmlFor="description" hint="Displayed on the product page.">
                <textarea
                  id="description"
                  name="description"
                  rows={5}
                  defaultValue={product?.description ?? ''}
                  className={inputCls}
                  placeholder="Describe the product in detail..."
                />
              </Field>

              <Field label="Features & Specs" htmlFor="features" hint="Bullet-point features (one per line).">
                <textarea
                  id="features"
                  name="features"
                  rows={4}
                  defaultValue={product?.features ?? ''}
                  className={inputCls}
                  placeholder="English Willow Grade 1&#10;Professional grade blade&#10;Round/oval handle available"
                />
              </Field>

              <Field label="Tags" htmlFor="tags" hint="Comma-separated: cricket, bat, english willow">
                <input
                  id="tags"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className={inputCls}
                  placeholder="cricket, bat, english willow, premium"
                />
              </Field>
            </div>
          </div>

          {/* Images */}
          <div className={sectionCls}>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-neutral-500">
              Product Images
            </h2>

            {/* Upload button */}
            <div className="mb-4">
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-2 rounded border border-dashed border-neutral-300 px-4 py-3 text-sm text-neutral-600 transition-colors hover:border-brand-400 hover:text-brand-600 disabled:opacity-50"
              >
                <Upload className="h-4 w-4" />
                {uploading ? 'Uploading…' : 'Upload images (JPG, PNG, WebP — max 10 MB each)'}
              </button>
            </div>

            {/* Image grid */}
            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5">
                {images.map((img, idx) => (
                  <div key={img.url + idx} className="group relative">
                    <div className={`relative overflow-hidden rounded border-2 ${img.isPrimary ? 'border-brand-500' : 'border-neutral-200'}`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img.url}
                        alt={img.altText}
                        className="aspect-square w-full object-cover"
                        onError={(e) => { e.currentTarget.src = '/images/placeholder.png' }}
                      />
                      {img.isPrimary && (
                        <span className="absolute left-1 top-1 rounded bg-brand-500 px-1 py-0.5 text-[9px] font-bold uppercase text-white">
                          Primary
                        </span>
                      )}
                    </div>
                    {/* Actions */}
                    <div className="absolute inset-0 flex items-center justify-center gap-1 rounded opacity-0 transition-opacity group-hover:opacity-100" style={{ background: 'rgba(0,0,0,0.45)' }}>
                      {!img.isPrimary && (
                        <button
                          type="button"
                          onClick={() => setPrimary(idx)}
                          title="Set as primary"
                          className="rounded bg-white p-1 text-neutral-700 hover:text-brand-600"
                        >
                          <Star className="h-3.5 w-3.5" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        title="Remove"
                        className="rounded bg-white p-1 text-neutral-700 hover:text-red-600"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {images.length === 0 && !uploading && (
              <p className="text-sm text-neutral-400">No images yet. Upload at least one.</p>
            )}
          </div>

          {/* SEO */}
          <div className={sectionCls}>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-neutral-500">
              SEO (optional)
            </h2>
            <div className="space-y-4">
              <Field label="Meta Title" htmlFor="metaTitle" hint="Max 70 characters. Defaults to product name.">
                <input
                  id="metaTitle"
                  name="metaTitle"
                  defaultValue={product?.metaTitle ?? ''}
                  maxLength={70}
                  className={inputCls}
                />
              </Field>
              <Field label="Meta Description" htmlFor="metaDescription" hint="Max 160 characters.">
                <textarea
                  id="metaDescription"
                  name="metaDescription"
                  rows={2}
                  defaultValue={product?.metaDescription ?? ''}
                  maxLength={160}
                  className={inputCls}
                />
              </Field>
            </div>
          </div>
        </div>

        {/* ── Right column (1/3) ────────────────────────────────────── */}
        <div className="space-y-6">

          {/* Status */}
          <div className={sectionCls}>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-neutral-500">
              Status
            </h2>
            <div className="space-y-3">
              <Field label="Product Status" htmlFor="status">
                <select
                  id="status"
                  name="status"
                  defaultValue={product?.status ?? 'DRAFT'}
                  className={inputCls}
                >
                  <option value="DRAFT">Draft</option>
                  <option value="ACTIVE">Active (visible)</option>
                  <option value="HIDDEN">Hidden</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </Field>

              <div className="space-y-2 pt-1">
                {[
                  { name: 'isFeatured', label: 'Featured product', checked: product?.isFeatured },
                  { name: 'isNewArrival', label: 'New arrival', checked: product?.isNewArrival },
                  { name: 'isBestSeller', label: 'Best seller', checked: product?.isBestSeller },
                ].map(({ name: n, label, checked }) => (
                  <label key={n} className="flex cursor-pointer items-center gap-2.5 text-sm text-neutral-700">
                    <input
                      type="checkbox"
                      name={n}
                      defaultChecked={!!checked}
                      className="h-4 w-4 rounded border-neutral-300 accent-brand-500"
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className={sectionCls}>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-neutral-500">
              Pricing (EUR)
            </h2>
            <div className="space-y-3">
              <Field label="Regular Price" htmlFor="price">
                <div className="flex">
                  <span className="flex items-center rounded-l border border-r-0 border-neutral-300 bg-neutral-50 px-3 text-sm text-neutral-500 select-none">
                    €
                  </span>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    defaultValue={product?.price ? Number(product.price) : ''}
                    className="w-full rounded-r border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                    placeholder="0.00"
                  />
                </div>
              </Field>
              <Field label="Sale Price" htmlFor="salePrice" hint="Leave blank if not on sale.">
                <div className="flex">
                  <span className="flex items-center rounded-l border border-r-0 border-neutral-300 bg-neutral-50 px-3 text-sm text-neutral-500 select-none">
                    €
                  </span>
                  <input
                    id="salePrice"
                    name="salePrice"
                    type="number"
                    step="0.01"
                    min="0"
                    defaultValue={product?.salePrice ? Number(product.salePrice) : ''}
                    className="w-full rounded-r border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                    placeholder="0.00"
                  />
                </div>
              </Field>
            </div>
          </div>

          {/* Inventory */}
          <div className={sectionCls}>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-neutral-500">
              Inventory
            </h2>
            <div className="space-y-3">
              <Field label="Stock Status" htmlFor="stockStatus">
                <select
                  id="stockStatus"
                  name="stockStatus"
                  defaultValue={product?.stockStatus ?? 'IN_STOCK'}
                  className={inputCls}
                >
                  <option value="IN_STOCK">In Stock</option>
                  <option value="OUT_OF_STOCK">Out of Stock</option>
                  <option value="ON_REQUEST">On Request</option>
                </select>
              </Field>
              <Field label="Quantity" htmlFor="stockQty">
                <input
                  id="stockQty"
                  name="stockQty"
                  type="number"
                  min="0"
                  defaultValue={product?.stockQty ?? ''}
                  className={inputCls}
                  placeholder="e.g. 25"
                />
              </Field>
            </div>
          </div>

          {/* Submit */}
          <div className="flex flex-col gap-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded bg-brand-500 px-4 py-2.5 font-display text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-brand-600 disabled:opacity-60"
            >
              {submitting ? 'Saving…' : isEdit ? 'Update Product' : 'Create Product'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/admin/products')}
              className="w-full rounded border border-neutral-300 px-4 py-2.5 text-sm text-neutral-600 transition-colors hover:bg-neutral-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}
