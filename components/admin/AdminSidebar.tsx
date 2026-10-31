'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard,
  Package,
  FolderOpen,
  MessageSquare,
  FileText,
  Image,
  Settings,
  LogOut,
  Mail,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'

const NAV = [
  { href: '/admin/dashboard',   label: 'Dashboard',   icon: LayoutDashboard },
  { href: '/admin/products',    label: 'Products',    icon: Package },
  { href: '/admin/collections', label: 'Collections', icon: FolderOpen },
  { href: '/admin/enquiries',   label: 'Enquiries',   icon: MessageSquare },
  { href: '/admin/newsletter',  label: 'Newsletter',  icon: Mail },
  { href: '/admin/blog',        label: 'Blog',        icon: FileText },
  { href: '/admin/media',       label: 'Media',       icon: Image },
  { href: '/admin/settings',    label: 'Settings',    icon: Settings },
]

export function AdminSidebar({ userName }: { userName?: string | null }) {
  const pathname = usePathname()

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-neutral-200 bg-white">
      {/* Brand */}
      <div className="flex h-16 items-center border-b border-neutral-200 px-6">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <span className="font-display text-sm font-bold uppercase tracking-widest text-brand-500">
            Mantra
          </span>
          <span className="rounded bg-neutral-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
            Admin
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-3" aria-label="Admin navigation">
        <ul className="space-y-0.5" role="list">
          {NAV.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || pathname.startsWith(href + '/')
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    'flex items-center gap-3 rounded px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-brand-50 text-brand-600'
                      : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                  )}
                >
                  <Icon
                    className={cn('h-4 w-4 shrink-0', isActive ? 'text-brand-500' : 'text-neutral-400')}
                    aria-hidden="true"
                  />
                  {label}
                  {/* Enquiries badge — could show count in future */}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer: user + sign out */}
      <div className="border-t border-neutral-200 p-3">
        {userName && (
          <p className="mb-2 truncate px-3 text-xs text-neutral-400">{userName}</p>
        )}
        <form action="/api/auth/signout" method="POST">
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded px-3 py-2 text-sm text-neutral-500 transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="h-4 w-4 shrink-0" aria-hidden="true" />
            Sign Out
          </button>
        </form>
        <Link
          href="/"
          target="_blank"
          className="mt-1 flex items-center gap-3 rounded px-3 py-2 text-xs text-neutral-400 transition-colors hover:text-brand-500"
        >
          ↗ View public site
        </Link>
      </div>
    </aside>
  )
}
