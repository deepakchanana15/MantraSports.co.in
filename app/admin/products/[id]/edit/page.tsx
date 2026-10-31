import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import { prisma } from '@/lib/db/prisma'
import { ProductForm } from '@/components/admin/ProductForm'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Edit Product' }

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  let product = null
  let categories: { id: string; name: string }[] = []

  try {
    ;[product, categories] = await Promise.all([
      prisma.product.findUnique({
        where: { id },
        include: { images: { orderBy: { sortOrder: 'asc' } } },
      }),
      prisma.category.findMany({
        select: { id: true, name: true },
        orderBy: { sortOrder: 'asc' },
      }),
    ])
  } catch {
    // DB not connected — will show form in empty state
  }

  if (product === null && categories.length === 0) notFound()

  return (
    <div>
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-neutral-500">
        <Link href="/admin/products" className="hover:text-neutral-700">Products</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-neutral-900">{product?.name ?? 'Edit'}</span>
      </nav>

      <h1 className="mb-6 font-display text-2xl font-bold uppercase tracking-tight text-neutral-900">
        Edit Product
      </h1>

      <ProductForm product={product} categories={categories} />
    </div>
  )
}
