'use client'

import dynamic from 'next/dynamic'
import type { Product, ProductImage, Category } from '@prisma/client'

type ProductWithImages = Product & { images: ProductImage[] }

interface Props {
  product?: ProductWithImages | null
  categories: Pick<Category, 'id' | 'name'>[]
}

const ProductForm = dynamic(
  () => import('./ProductForm').then((m) => ({ default: m.ProductForm })),
  { ssr: false, loading: () => <p className="py-8 text-sm text-neutral-400">Loading form…</p> }
)

export function ProductFormLoader({ product, categories }: Props) {
  return <ProductForm product={product} categories={categories} />
}
