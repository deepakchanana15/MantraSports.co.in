'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/db/prisma'
import { slugify } from '@/lib/utils/slugify'
import { revalidatePath } from 'next/cache'

export async function createCollection(formData: FormData): Promise<{ id: string }> {
  const session = await auth()
  if (!session) throw new Error('Unauthorized')

  const name = (formData.get('name') as string).trim()
  if (!name) throw new Error('Collection name is required')

  const slug = (formData.get('slug') as string || slugify(name)).trim()
  const productIds: string[] = JSON.parse((formData.get('productIds') as string) || '[]')

  const collection = await prisma.collection.create({
    data: {
      name,
      slug,
      description: (formData.get('description') as string) || null,
      bannerUrl: (formData.get('bannerUrl') as string) || null,
      isFeatured: formData.get('isFeatured') === 'on',
      metaTitle: (formData.get('metaTitle') as string) || null,
      metaDescription: (formData.get('metaDescription') as string) || null,
      collectionProducts: {
        create: productIds.map((productId, i) => ({ productId, sortOrder: i })),
      },
    },
  })

  revalidatePath('/admin/collections')
  revalidatePath('/collections')
  return { id: collection.id }
}

export async function updateCollection(id: string, formData: FormData): Promise<void> {
  const session = await auth()
  if (!session) throw new Error('Unauthorized')

  const name = (formData.get('name') as string).trim()
  if (!name) throw new Error('Collection name is required')

  const slug = (formData.get('slug') as string || slugify(name)).trim()
  const productIds: string[] = JSON.parse((formData.get('productIds') as string) || '[]')

  await prisma.$transaction([
    prisma.collectionProduct.deleteMany({ where: { collectionId: id } }),
    prisma.collection.update({
      where: { id },
      data: {
        name,
        slug,
        description: (formData.get('description') as string) || null,
        bannerUrl: (formData.get('bannerUrl') as string) || null,
        isFeatured: formData.get('isFeatured') === 'on',
        metaTitle: (formData.get('metaTitle') as string) || null,
        metaDescription: (formData.get('metaDescription') as string) || null,
        collectionProducts: {
          create: productIds.map((productId, i) => ({ productId, sortOrder: i })),
        },
      },
    }),
  ])

  revalidatePath('/admin/collections')
  revalidatePath('/collections')
}

export async function deleteCollection(id: string): Promise<void> {
  const session = await auth()
  if (!session) throw new Error('Unauthorized')

  await prisma.collection.delete({ where: { id } })
  revalidatePath('/admin/collections')
}
