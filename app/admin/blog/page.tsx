import type { Metadata } from 'next'
import Link from 'next/link'
import { Plus, Pencil } from 'lucide-react'
import { prisma } from '@/lib/db/prisma'
import { formatDate } from '@/lib/utils/format'

export const metadata: Metadata = { title: 'Blog' }

const STATUS_BADGE: Record<string, string> = {
  DRAFT:     'bg-neutral-100 text-neutral-600',
  PUBLISHED: 'bg-green-100 text-green-700',
  ARCHIVED:  'bg-red-100 text-red-600',
}

export default async function BlogPage() {
  let posts: any[] = []
  let dbError = false

  try {
    posts = await prisma.blogPost.findMany({
      include: { author: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    })
  } catch {
    dbError = true
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold uppercase tracking-tight text-neutral-900">Blog Posts</h1>
        <Link
          href="/admin/blog/new"
          className="flex items-center gap-2 rounded bg-brand-500 px-4 py-2 font-display text-sm font-bold uppercase tracking-wider text-white hover:bg-brand-600"
        >
          <Plus className="h-4 w-4" /> New Post
        </Link>
      </div>

      {dbError && (
        <div className="mb-6 rounded border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
          <strong>Database not connected.</strong> Set up your database to manage blog posts.
        </div>
      )}

      <div className="overflow-hidden rounded border border-neutral-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-neutral-600">Title</th>
              <th className="px-4 py-3 text-left font-semibold text-neutral-600">Status</th>
              <th className="px-4 py-3 text-left font-semibold text-neutral-600">Author</th>
              <th className="px-4 py-3 text-left font-semibold text-neutral-600">Date</th>
              <th className="px-4 py-3 text-right font-semibold text-neutral-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {posts.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-neutral-400">
                  {dbError ? 'Connect your database.' : 'No blog posts yet.'}
                </td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr key={post.id} className="hover:bg-neutral-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-neutral-900">{post.title}</p>
                    <p className="text-xs text-neutral-400">/blog/{post.slug}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded px-2 py-0.5 text-xs font-semibold uppercase ${STATUS_BADGE[post.status] ?? ''}`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-neutral-600">{post.author?.name ?? '—'}</td>
                  <td className="px-4 py-3 text-xs text-neutral-500">
                    {post.publishedAt ? formatDate(post.publishedAt) : formatDate(post.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/blog/${post.id}/edit`}
                      className="inline-flex items-center gap-1.5 rounded border border-neutral-200 px-2.5 py-1 text-xs text-neutral-600 hover:border-brand-400 hover:text-brand-600"
                    >
                      <Pencil className="h-3 w-3" /> Edit
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
