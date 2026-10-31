import type { Metadata } from 'next'
import { auth } from '@/auth'
import { prisma } from '@/lib/db/prisma'
import { Package, FolderOpen, MessageSquare, FileText } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Dashboard',
}

async function getDashboardStats() {
  try {
    const [products, collections, enquiries, blogPosts] = await Promise.all([
      prisma.product.count(),
      prisma.collection.count(),
      prisma.enquiry.count({ where: { status: 'NEW' } }),
      prisma.blogPost.count(),
    ])
    return { products, collections, enquiries, blogPosts, dbConnected: true }
  } catch {
    return { products: 0, collections: 0, enquiries: 0, blogPosts: 0, dbConnected: false }
  }
}

export default async function DashboardPage() {
  const session = await auth()
  const stats = await getDashboardStats()

  const statCards = [
    {
      label: 'Total Products',
      value: stats.products,
      icon: Package,
      href: '/admin/products',
      description: 'Manage product catalogue',
    },
    {
      label: 'Collections',
      value: stats.collections,
      icon: FolderOpen,
      href: '/admin/collections',
      description: 'Curated product groups',
    },
    {
      label: 'New Enquiries',
      value: stats.enquiries,
      icon: MessageSquare,
      href: '/admin/enquiries',
      description: 'Unread customer enquiries',
      highlight: stats.enquiries > 0,
    },
    {
      label: 'Blog Posts',
      value: stats.blogPosts,
      icon: FileText,
      href: '/admin/blog',
      description: 'Published & draft articles',
    },
  ]

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold uppercase tracking-tight text-neutral-900 dark:text-white">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          Welcome back, {session?.user?.name ?? 'Admin'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <a
              key={card.label}
              href={card.href}
              className={`group block rounded border p-6 transition-all hover:shadow-md ${
                card.highlight
                  ? 'border-brand-200 bg-brand-50 dark:border-brand-900/50 dark:bg-brand-950/20'
                  : 'border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">{card.label}</p>
                  <p className={`mt-1 font-display text-4xl font-bold ${
                    card.highlight ? 'text-brand-500' : 'text-neutral-900 dark:text-white'
                  }`}>
                    {card.value}
                  </p>
                  <p className="mt-1 text-xs text-neutral-400 dark:text-neutral-600">
                    {card.description}
                  </p>
                </div>
                <div className={`rounded p-2 ${
                  card.highlight
                    ? 'bg-brand-100 dark:bg-brand-900/30'
                    : 'bg-neutral-100 dark:bg-neutral-800'
                }`}>
                  <Icon
                    className={`h-5 w-5 ${card.highlight ? 'text-brand-500' : 'text-neutral-500'}`}
                    aria-hidden="true"
                  />
                </div>
              </div>
            </a>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="mb-10">
        <h2 className="mb-4 font-display text-sm font-bold uppercase tracking-widest text-neutral-400">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          {[
            { label: 'Add Product', href: '/admin/products/new' },
            { label: 'New Collection', href: '/admin/collections/new' },
            { label: 'View Enquiries', href: '/admin/enquiries' },
            { label: 'New Blog Post', href: '/admin/blog/new' },
            { label: 'Site Settings', href: '/admin/settings' },
          ].map((action) => (
            <a
              key={action.label}
              href={action.href}
              className="inline-flex items-center border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:border-brand-500 hover:text-brand-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-brand-500 dark:hover:text-brand-400"
            >
              {action.label}
            </a>
          ))}
        </div>
      </div>

      {/* Database status */}
      {!stats.dbConnected && (
        <div className="rounded border border-amber-200 bg-amber-50 p-5">
          <p className="mb-1 font-semibold text-amber-800">Database not connected</p>
          <p className="text-sm text-amber-700">
            You are logged in, but no database is connected yet. Product management, collections,
            enquiries and blog posts require a PostgreSQL database.
          </p>
          <div className="mt-3 rounded bg-amber-100 p-3 font-mono text-xs text-amber-800">
            <p className="mb-1 font-bold">Quick setup with Neon (free):</p>
            <p>1. Sign up at neon.tech → create a project → copy the connection string</p>
            <p>2. Paste it into .env.local as DATABASE_URL=...</p>
            <p>3. Run: <strong>npx prisma migrate dev --name init</strong></p>
            <p>4. Run: <strong>npm run db:seed</strong></p>
          </div>
        </div>
      )}

      {stats.dbConnected && (
        <div className="rounded border border-green-200 bg-green-50 p-4">
          <p className="text-sm text-green-700">
            <strong>Database connected.</strong> All admin features are available.
          </p>
        </div>
      )}
    </div>
  )
}
