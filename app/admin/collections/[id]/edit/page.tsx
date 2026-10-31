import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import { prisma } from '@/lib/db/prisma'
import { CollectionForm } from '@/components/admin/CollectionForm'

export const metadata: Metadata = { title: 'Edit Collection' }

export default async function EditCollectionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  let collection = null
  let allProducts: { id: string; name: string }[] = []

  try {
    ;[collection, allProducts] = await Promise.all([
      prisma.collection.findUnique({
        where: { id },
        include: {
          collectionProducts: {
            include: { product: { select: { id: true, name: true } } },
            orderBy: { sortOrder: 'asc' },
          },
        },
      }),
      prisma.product.findMany({
        where: { status: 'ACTIVE' },
        select: { id: true, name: true },
        orderBy: { name: 'asc' },
      }),
    ])
  } catch { /* DB not connected */ }

  if (!collection) notFound()

  return (
    <div>
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-neutral-500">
        <Link href="/admin/collections" className="hover:text-neutral-700">Collections</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-neutral-900">{collection.name}</span>
      </nav>
      <h1 className="mb-6 font-display text-2xl font-bold uppercase tracking-tight text-neutral-900">
        Edit Collection
      </h1>
      <CollectionForm collection={collection} allProducts={allProducts} />
    </div>
  )
}
