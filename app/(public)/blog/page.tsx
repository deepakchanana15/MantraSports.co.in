import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { prisma } from '@/lib/db/prisma'
import { ContentPage } from '@/components/layout/ContentPage'
import { formatDate } from '@/lib/utils/format'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Blog — Cricket Tips & Gidsen',
  description:
    'Tips, koopgidsen en advies over cricketbats, beschermende uitrusting en meer van de cricketspecialisten van Mantra Sports Nederland.',
}

export default async function BlogIndexPage() {
  let posts: { slug: string; title: string; excerpt: string | null; featuredImageUrl: string | null; publishedAt: Date | null }[] = []

  try {
    posts = await prisma.blogPost.findMany({
      where: { status: 'PUBLISHED', publishedAt: { lte: new Date() } },
      orderBy: { publishedAt: 'desc' },
      select: { slug: true, title: true, excerpt: true, featuredImageUrl: true, publishedAt: true },
    })
  } catch {
    // DB unavailable — show empty state
  }

  return (
    <ContentPage
      eyebrow="Tips & gidsen"
      title="Blog"
      intro="Advies van onze cricketspecialisten: van de juiste batmaat tot het onderhoud van je uitrusting."
      breadcrumb={[{ label: 'Blog' }]}
      prose={false}
    >
      {posts.length === 0 ? (
        <div className="py-16 text-center" style={{ border: '1px solid #E0DFDB' }}>
          <p className="font-display text-xl font-bold uppercase text-[#111]">Binnenkort meer artikelen</p>
          <p className="mt-2 text-sm text-[#999]">We werken aan nieuwe tips en gidsen — kom snel terug.</p>
        </div>
      ) : (
        <div className="grid gap-8" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group flex flex-col" style={{ border: '1px solid #E0DFDB' }}>
              {post.featuredImageUrl && (
                <div className="aspect-[16/9] overflow-hidden" style={{ background: '#F8F7F4' }}>
                  <img
                    src={post.featuredImageUrl}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
              )}
              <div className="flex flex-1 flex-col" style={{ padding: 24 }}>
                {post.publishedAt && (
                  <p className="mb-2 text-[12px] uppercase tracking-[0.12em]" style={{ color: '#999' }}>
                    {formatDate(post.publishedAt)}
                  </p>
                )}
                <h2 className="mb-3 font-display text-[20px] font-bold uppercase leading-tight tracking-[0.02em] text-[#111] group-hover:text-[#e85d1a]">
                  {post.title}
                </h2>
                {post.excerpt && <p className="mb-4 text-[14px] leading-relaxed" style={{ color: '#6B6B6B' }}>{post.excerpt}</p>}
                <span className="mt-auto inline-flex items-center gap-1.5 font-display text-[12px] font-bold uppercase tracking-wider" style={{ color: '#e85d1a' }}>
                  Lees meer <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </ContentPage>
  )
}
