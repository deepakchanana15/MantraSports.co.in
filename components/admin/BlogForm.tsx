'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBlogPost, updateBlogPost, deleteBlogPost } from '@/lib/actions/blog'
import { slugify } from '@/lib/utils/slugify'
import type { BlogPost } from '@prisma/client'

const inputCls = 'w-full rounded border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500'

export function BlogForm({ post }: { post?: BlogPost | null }) {
  const router = useRouter()
  const isEdit = !!post

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [title, setTitle] = useState(post?.title ?? '')
  const [slug, setSlug] = useState(post?.slug ?? '')
  const [slugManual, setSlugManual] = useState(isEdit)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleTitleChange = (val: string) => {
    setTitle(val)
    if (!slugManual) setSlug(slugify(val))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    const fd = new FormData(e.currentTarget)
    fd.set('title', title)
    fd.set('slug', slug)

    try {
      if (isEdit) {
        await updateBlogPost(post.id, fd)
      } else {
        await createBlogPost(fd)
      }
      router.push('/admin/blog')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error saving post.')
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    await deleteBlogPost(post!.id)
    router.push('/admin/blog')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">

          <div className="rounded border border-neutral-200 bg-white p-6">
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className={inputCls}
                  placeholder="Blog post title"
                  required
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700">Slug</label>
                <input
                  value={slug}
                  onChange={(e) => { setSlug(e.target.value); setSlugManual(true) }}
                  className={inputCls}
                  placeholder="url-friendly-slug"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700">Excerpt</label>
                <textarea
                  name="excerpt"
                  rows={2}
                  defaultValue={post?.excerpt ?? ''}
                  className={inputCls}
                  placeholder="Short summary shown on blog listing page…"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700">Content</label>
                <textarea
                  name="content"
                  rows={16}
                  defaultValue={post?.content ?? ''}
                  className={inputCls}
                  placeholder="Write your blog post here. Markdown is supported."
                />
                <p className="mt-1 text-xs text-neutral-400">Markdown supported: **bold**, _italic_, ## headings, - lists</p>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700">Featured Image URL</label>
                <input
                  name="featuredImageUrl"
                  defaultValue={post?.featuredImageUrl ?? ''}
                  className={inputCls}
                  placeholder="https://... or /uploads/..."
                />
              </div>
            </div>
          </div>

          <div className="rounded border border-neutral-200 bg-white p-6">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-neutral-500">SEO</h2>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs text-neutral-500">Meta Title (max 70)</label>
                <input name="metaTitle" defaultValue={post?.metaTitle ?? ''} maxLength={70} className={inputCls} />
              </div>
              <div>
                <label className="mb-1 block text-xs text-neutral-500">Meta Description (max 160)</label>
                <textarea name="metaDescription" rows={2} defaultValue={post?.metaDescription ?? ''} maxLength={160} className={inputCls} />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded border border-neutral-200 bg-white p-6">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-neutral-500">Publish</h2>
            <div className="space-y-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700">Status</label>
                <select name="status" defaultValue={post?.status ?? 'DRAFT'} className={inputCls}>
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded bg-brand-500 px-4 py-2.5 font-display text-sm font-bold uppercase tracking-wider text-white hover:bg-brand-600 disabled:opacity-60"
            >
              {submitting ? 'Saving…' : isEdit ? 'Update Post' : 'Create Post'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/admin/blog')}
              className="w-full rounded border border-neutral-300 px-4 py-2.5 text-sm text-neutral-600 hover:bg-neutral-50"
            >
              Cancel
            </button>

            {isEdit && (
              <div className="border-t border-neutral-200 pt-3">
                {confirmDelete ? (
                  <div className="flex flex-col gap-1">
                    <button
                      type="button"
                      onClick={handleDelete}
                      disabled={deleting}
                      className="w-full rounded bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-50"
                    >
                      {deleting ? 'Deleting…' : 'Confirm Delete'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(false)}
                      className="w-full rounded border border-neutral-200 px-4 py-2 text-sm text-neutral-500 hover:bg-neutral-50"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(true)}
                    className="w-full rounded border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    Delete Post
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </form>
  )
}
