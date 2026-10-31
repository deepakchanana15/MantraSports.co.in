'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/db/prisma'
import { slugify } from '@/lib/utils/slugify'
import { revalidatePath } from 'next/cache'
import type { ProductStatus, StockStatus } from '@prisma/client'

function requireAuth() {
  // Auth is checked server-side; this is defence-in-depth
}

interface ImageData {
  url: string
  altText: string
  isPrimary: boolean
  sortOrder: number
}

export async function createProduct(formData: FormData): Promise<{ id: string }> {
  const session = await auth()
  if (!session) throw new Error('Unauthorized')

  const name = (formData.get('name') as string).trim()
  if (!name) throw new Error('Product name is required')

  const rawSlug = (formData.get('slug') as string || '').trim()
  const slug = rawSlug || slugify(name)

  const images: ImageData[] = JSON.parse((formData.get('images') as string) || '[]')
  const tags = (formData.get('tags') as string || '')
    .split(',').map((t) => t.trim()).filter(Boolean)

  // If slug conflicts, append a counter
  let finalSlug = slug
  const existing = await prisma.product.findUnique({ where: { slug } })
  if (existing) {
    let counter = 2
    while (await prisma.product.findUnique({ where: { slug: `${slug}-${counter}` } })) {
      counter++
    }
    finalSlug = `${slug}-${counter}`
  }

  const product = await prisma.product.create({
    data: {
      name,
      slug: finalSlug,
      sku: (formData.get('sku') as string) || null,
      categoryId: (formData.get('categoryId') as string) || null,
      description: (formData.get('description') as string) || null,
      features: (formData.get('features') as string) || null,
      price: formData.get('price') ? parseFloat(formData.get('price') as string) : null,
      salePrice: formData.get('salePrice') ? parseFloat(formData.get('salePrice') as string) : null,
      status: (formData.get('status') as ProductStatus) || 'DRAFT',
      stockStatus: (formData.get('stockStatus') as StockStatus) || 'IN_STOCK',
      stockQty: formData.get('stockQty') ? parseInt(formData.get('stockQty') as string) : null,
      isFeatured: formData.get('isFeatured') === 'on',
      isNewArrival: formData.get('isNewArrival') === 'on',
      isBestSeller: formData.get('isBestSeller') === 'on',
      tags,
      metaTitle: (formData.get('metaTitle') as string) || null,
      metaDescription: (formData.get('metaDescription') as string) || null,
      images: {
        create: images.map((img, i) => ({
          url: img.url,
          altText: img.altText || name,
          isPrimary: i === 0,
          sortOrder: i,
        })),
      },
    },
  })

  revalidatePath('/admin/products')
  revalidatePath('/')
  return { id: product.id }
}

export async function updateProduct(id: string, formData: FormData): Promise<void> {
  const session = await auth()
  if (!session) throw new Error('Unauthorized')

  const name = (formData.get('name') as string).trim()
  if (!name) throw new Error('Product name is required')

  const slug = (formData.get('slug') as string || slugify(name)).trim()
  const images: ImageData[] = JSON.parse((formData.get('images') as string) || '[]')
  const tags = (formData.get('tags') as string || '')
    .split(',').map((t) => t.trim()).filter(Boolean)

  await prisma.$transaction([
    // Delete old images
    prisma.productImage.deleteMany({ where: { productId: id } }),
    // Update product + recreate images
    prisma.product.update({
      where: { id },
      data: {
        name,
        slug,
        sku: (formData.get('sku') as string) || null,
        categoryId: (formData.get('categoryId') as string) || null,
        description: (formData.get('description') as string) || null,
        features: (formData.get('features') as string) || null,
        price: formData.get('price') ? parseFloat(formData.get('price') as string) : null,
        salePrice: formData.get('salePrice') ? parseFloat(formData.get('salePrice') as string) : null,
        status: (formData.get('status') as ProductStatus) || 'DRAFT',
        stockStatus: (formData.get('stockStatus') as StockStatus) || 'IN_STOCK',
        stockQty: formData.get('stockQty') ? parseInt(formData.get('stockQty') as string) : null,
        isFeatured: formData.get('isFeatured') === 'on',
        isNewArrival: formData.get('isNewArrival') === 'on',
        isBestSeller: formData.get('isBestSeller') === 'on',
        tags,
        metaTitle: (formData.get('metaTitle') as string) || null,
        metaDescription: (formData.get('metaDescription') as string) || null,
        images: {
          create: images.map((img, i) => ({
            url: img.url,
            altText: img.altText || name,
            isPrimary: i === 0,
            sortOrder: i,
          })),
        },
      },
    }),
  ])

  revalidatePath('/admin/products')
  revalidatePath(`/admin/products/${id}/edit`)
  revalidatePath('/')
}

export async function deleteProduct(id: string): Promise<void> {
  const session = await auth()
  if (!session) throw new Error('Unauthorized')

  await prisma.product.delete({ where: { id } })

  revalidatePath('/admin/products')
  revalidatePath('/')
}

export async function toggleProductStatus(id: string, status: ProductStatus): Promise<void> {
  const session = await auth()
  if (!session) throw new Error('Unauthorized')

  await prisma.product.update({ where: { id }, data: { status } })
  revalidatePath('/admin/products')
  revalidatePath('/')
}
