'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/db/prisma'
import { slugify } from '@/lib/utils/slugify'
import { revalidatePath } from 'next/cache'
import type { BlogStatus } from '@prisma/client'

export async function createBlogPost(formData: FormData): Promise<{ id: string }> {
  const session = await auth()
  if (!session) throw new Error('Unauthorized')

  const title = (formData.get('title') as string).trim()
  if (!title) throw new Error('Title is required')

  const slug = (formData.get('slug') as string || slugify(title)).trim()
  const status = (formData.get('status') as BlogStatus) || 'DRAFT'

  const post = await prisma.blogPost.create({
    data: {
      title,
      slug,
      excerpt: (formData.get('excerpt') as string) || null,
      content: (formData.get('content') as string) || null,
      featuredImageUrl: (formData.get('featuredImageUrl') as string) || null,
      status,
      publishedAt: status === 'PUBLISHED' ? new Date() : null,
      metaTitle: (formData.get('metaTitle') as string) || null,
      metaDescription: (formData.get('metaDescription') as string) || null,
    },
  })

  revalidatePath('/admin/blog')
  revalidatePath('/blog')
  revalidatePath('/blog/[slug]', 'page')
  return { id: post.id }
}

export async function updateBlogPost(id: string, formData: FormData): Promise<void> {
  const session = await auth()
  if (!session) throw new Error('Unauthorized')

  const title = (formData.get('title') as string).trim()
  if (!title) throw new Error('Title is required')

  const slug = (formData.get('slug') as string || slugify(title)).trim()
  const status = (formData.get('status') as BlogStatus) || 'DRAFT'
  const existing = await prisma.blogPost.findUnique({ where: { id }, select: { publishedAt: true, status: true } })
  const publishedAt =
    status === 'PUBLISHED' && existing?.status !== 'PUBLISHED'
      ? new Date()
      : (existing?.publishedAt ?? null)

  await prisma.blogPost.update({
    where: { id },
    data: {
      title,
      slug,
      excerpt: (formData.get('excerpt') as string) || null,
      content: (formData.get('content') as string) || null,
      featuredImageUrl: (formData.get('featuredImageUrl') as string) || null,
      status,
      publishedAt,
      metaTitle: (formData.get('metaTitle') as string) || null,
      metaDescription: (formData.get('metaDescription') as string) || null,
    },
  })

  revalidatePath('/admin/blog')
  revalidatePath('/blog')
  revalidatePath('/blog/[slug]', 'page')
}

export async function deleteBlogPost(id: string): Promise<void> {
  const session = await auth()
  if (!session) throw new Error('Unauthorized')

  await prisma.blogPost.delete({ where: { id } })
  revalidatePath('/admin/blog')
  revalidatePath('/blog')
  revalidatePath('/blog/[slug]', 'page')
}
