import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { prisma } from '@/lib/db/prisma'
import { ProductForm } from '@/components/admin/ProductForm'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Add Product' }

export default async function NewProductPage() {
  let categories: { id: string; name: string }[] = []

  try {
    categories = await prisma.category.findMany({
      select: { id: true, name: true },
      orderBy: { sortOrder: 'asc' },
    })
  } catch {
    // DB not connected — form still renders, just no category list
  }

  return (
    <div>
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-neutral-500">
        <Link href="/admin/products" className="hover:text-neutral-700">Products</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-neutral-900">New Product</span>
      </nav>

      <h1 className="mb-6 font-display text-2xl font-bold uppercase tracking-tight text-neutral-900">
        Add New Product
      </h1>

      <ProductForm categories={categories} />
    </div>
  )
}
