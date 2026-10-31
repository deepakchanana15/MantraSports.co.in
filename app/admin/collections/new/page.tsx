import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { prisma } from '@/lib/db/prisma'
import { CollectionForm } from '@/components/admin/CollectionForm'

export const metadata: Metadata = { title: 'New Collection' }

export default async function NewCollectionPage() {
  let allProducts: { id: string; name: string }[] = []
  try {
    allProducts = await prisma.product.findMany({
      where: { status: 'ACTIVE' },
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    })
  } catch { /* DB not connected */ }

  return (
    <div>
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-neutral-500">
        <Link href="/admin/collections" className="hover:text-neutral-700">Collections</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-neutral-900">New Collection</span>
      </nav>
      <h1 className="mb-6 font-display text-2xl font-bold uppercase tracking-tight text-neutral-900">
        New Collection
      </h1>
      <CollectionForm allProducts={allProducts} />
    </div>
  )
}
