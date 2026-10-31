import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { BlogForm } from '@/components/admin/BlogForm'

export const metadata: Metadata = { title: 'New Blog Post' }

export default function NewBlogPostPage() {
  return (
    <div>
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-neutral-500">
        <Link href="/admin/blog" className="hover:text-neutral-700">Blog</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-neutral-900">New Post</span>
      </nav>
      <h1 className="mb-6 font-display text-2xl font-bold uppercase tracking-tight text-neutral-900">
        New Blog Post
      </h1>
      <BlogForm />
    </div>
  )
}
