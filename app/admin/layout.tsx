import type { Metadata } from 'next'
import { auth } from '@/auth'
import { AdminSidebar } from '@/components/admin/AdminSidebar'

export const metadata: Metadata = {
  title: {
    default: 'Admin — Mantra Sports NL',
    template: '%s | Admin — Mantra Sports NL',
  },
  robots: { index: false, follow: false },
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  let session = null
  try {
    session = await auth()
  } catch {
    // If auth throws (e.g. misconfigured secret), treat as unauthenticated
  }

  // Login page is wrapped by this layout — render it standalone without admin chrome.
  // The middleware (proxy.ts) handles redirecting unauthenticated users on all other routes.
  if (!session) {
    return <>{children}</>
  }

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-50">
      {/* Sidebar — fixed height, scrollable inside */}
      <div className="hidden h-full lg:flex">
        <AdminSidebar userName={session.user?.name ?? session.user?.email} />
      </div>

      {/* Main column */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-neutral-200 bg-white px-6">
          <p className="font-display text-sm font-bold uppercase tracking-widest text-brand-500 lg:hidden">
            Mantra Admin
          </p>
          <div className="ml-auto flex items-center gap-4">
            <a
              href="/"
              target="_blank"
              className="hidden text-xs text-neutral-400 hover:text-brand-500 sm:block"
            >
              ↗ View site
            </a>
            <span className="text-sm text-neutral-500">{session.user?.name}</span>
            <form action="/api/auth/signout" method="POST">
              <button
                type="submit"
                className="text-sm text-neutral-500 underline-offset-2 hover:text-red-500 hover:underline"
              >
                Sign Out
              </button>
            </form>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
