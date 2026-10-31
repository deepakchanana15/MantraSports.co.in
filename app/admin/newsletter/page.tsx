import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db/prisma'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Newsletter Subscribers — Admin' }
export const dynamic = 'force-dynamic'

export default async function NewsletterAdminPage() {
  const session = await auth()
  if (!session) redirect('/admin/login')

  const subscribers = await prisma.newsletterSubscriber.findMany({
    orderBy: { subscribedAt: 'desc' },
  })

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Newsletter Subscribers</h1>
          <p className="mt-1 text-sm text-neutral-500">{subscribers.length} subscriber{subscribers.length !== 1 ? 's' : ''} total</p>
        </div>
        {subscribers.length > 0 && (
          <a
            href={`data:text/csv;charset=utf-8,Email,Subscribed At\n${subscribers.map((s) => `${s.email},${s.subscribedAt.toISOString()}`).join('\n')}`}
            download="newsletter-subscribers.csv"
            className="rounded bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-700"
          >
            Export CSV
          </a>
        )}
      </div>

      {subscribers.length === 0 ? (
        <div className="rounded border border-neutral-200 bg-white py-16 text-center">
          <p className="text-neutral-500">No subscribers yet.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded border border-neutral-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="px-4 py-3 text-left font-semibold text-neutral-600">#</th>
                <th className="px-4 py-3 text-left font-semibold text-neutral-600">Email</th>
                <th className="px-4 py-3 text-left font-semibold text-neutral-600">Subscribed</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((sub, i) => (
                <tr key={sub.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50">
                  <td className="px-4 py-3 text-neutral-400">{i + 1}</td>
                  <td className="px-4 py-3 font-medium text-neutral-900">{sub.email}</td>
                  <td className="px-4 py-3 text-neutral-500">
                    {sub.subscribedAt.toLocaleDateString('nl-NL', {
                      day: '2-digit', month: '2-digit', year: 'numeric',
                      hour: '2-digit', minute: '2-digit',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
