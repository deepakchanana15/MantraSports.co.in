import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db/prisma'
import { ContentPage } from '@/components/layout/ContentPage'
import { ArticleSchema } from '@/components/seo/JsonLd'
import { formatDate } from '@/lib/utils/format'

export const revalidate = 3600

type Props = { params: Promise<{ slug: string }> }

async function getPost(slug: string) {
  try {
    return await prisma.blogPost.findFirst({
      where: { slug, status: 'PUBLISHED', publishedAt: { lte: new Date() } },
    })
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return {}
  return {
    title: post.metaTitle?.includes('Mantra Sports') ? { absolute: post.metaTitle } : (post.metaTitle ?? post.title),
    description: post.metaDescription ?? post.excerpt?.slice(0, 160) ?? undefined,
    openGraph: {
      type: 'article',
      title: post.metaTitle ?? post.title,
      description: post.metaDescription ?? post.excerpt ?? undefined,
      ...(post.featuredImageUrl && { images: [{ url: post.featuredImageUrl }] }),
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()

  return (
    <ContentPage
      eyebrow="Blog"
      title={post.title}
      intro={post.excerpt ?? undefined}
      breadcrumb={[{ label: 'Blog', href: '/blog' }, { label: post.title }]}
      meta={post.publishedAt ? `Published ${formatDate(post.publishedAt)}` : undefined}
    >
      <ArticleSchema
        title={post.title}
        description={post.metaDescription ?? post.excerpt ?? undefined}
        image={post.featuredImageUrl ?? undefined}
        publishedAt={post.publishedAt ?? post.createdAt}
        updatedAt={post.updatedAt}
        url={`/blog/${post.slug}`}
      />

      {post.featuredImageUrl && (
        <img src={post.featuredImageUrl} alt="" className="mb-10 w-full rounded-[2px] object-cover" style={{ maxHeight: 440 }} />
      )}

      {/* Content is authored by admins in the CMS (Tiptap HTML) */}
      <div dangerouslySetInnerHTML={{ __html: post.content ?? '' }} />

      <p style={{ marginTop: 48 }}>
        <Link href="/blog">← All articles</Link>
      </p>
    </ContentPage>
  )
}
