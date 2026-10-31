import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import { prisma } from '@/lib/db/prisma'
import { BlogForm } from '@/components/admin/BlogForm'

export const metadata: Metadata = { title: 'Edit Post' }

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  let post = null
  try {
    post = await prisma.blogPost.findUnique({ where: { id } })
  } catch { /* DB not connected */ }

  if (!post) notFound()

  return (
    <div>
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-neutral-500">
        <Link href="/admin/blog" className="hover:text-neutral-700">Blog</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-neutral-900">{post.title}</span>
      </nav>
      <h1 className="mb-6 font-display text-2xl font-bold uppercase tracking-tight text-neutral-900">
        Edit Post
      </h1>
      <BlogForm post={post} />
    </div>
  )
}
