import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronRight, Mail, Phone, Globe } from 'lucide-react'
import { prisma } from '@/lib/db/prisma'
import { formatDate } from '@/lib/utils/format'
import { EnquiryActions } from './EnquiryActions'

export const metadata: Metadata = { title: 'Enquiry' }

export default async function EnquiryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  let enquiry: any = null
  try {
    enquiry = await prisma.enquiry.findUnique({
      where: { id },
      include: { product: { select: { name: true, slug: true } } },
    })
    // Mark as READ automatically
    if (enquiry?.status === 'NEW') {
      await prisma.enquiry.update({ where: { id }, data: { status: 'READ' } })
      enquiry.status = 'READ'
    }
  } catch { /* DB not connected */ }

  if (!enquiry) notFound()

  return (
    <div className="max-w-3xl">
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-neutral-500">
        <Link href="/admin/enquiries" className="hover:text-neutral-700">Enquiries</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-neutral-900">{enquiry.name}</span>
      </nav>

      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold uppercase tracking-tight text-neutral-900">
            Enquiry from {enquiry.name}
          </h1>
          <p className="mt-0.5 text-sm text-neutral-500">{formatDate(enquiry.createdAt)}</p>
        </div>
        <EnquiryActions id={enquiry.id} currentStatus={enquiry.status} />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {/* Contact Details */}
        <div className="rounded border border-neutral-200 bg-white p-5">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">Contact</h2>
          <dl className="space-y-3">
            <div>
              <dt className="text-xs text-neutral-400">Name</dt>
              <dd className="font-medium text-neutral-900">{enquiry.name}</dd>
            </div>
            {enquiry.company && (
              <div>
                <dt className="text-xs text-neutral-400">Company</dt>
                <dd className="text-neutral-700">{enquiry.company}</dd>
              </div>
            )}
            {enquiry.country && (
              <div>
                <dt className="text-xs text-neutral-400">Country</dt>
                <dd className="text-neutral-700">{enquiry.country}</dd>
              </div>
            )}
            <div>
              <dt className="text-xs text-neutral-400">Email</dt>
              <dd>
                <a href={`mailto:${enquiry.email}`} className="font-medium text-brand-500 hover:underline flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" /> {enquiry.email}
                </a>
              </dd>
            </div>
            {enquiry.phone && (
              <div>
                <dt className="text-xs text-neutral-400">Phone</dt>
                <dd>
                  <a href={`tel:${enquiry.phone}`} className="flex items-center gap-1.5 text-neutral-700 hover:text-brand-500">
                    <Phone className="h-3.5 w-3.5" /> {enquiry.phone}
                  </a>
                </dd>
              </div>
            )}
            {enquiry.whatsapp && (
              <div>
                <dt className="text-xs text-neutral-400">WhatsApp</dt>
                <dd>
                  <a
                    href={`https://wa.me/${enquiry.whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-green-600 hover:underline"
                  >
                    <Globe className="h-3.5 w-3.5" /> {enquiry.whatsapp}
                  </a>
                </dd>
              </div>
            )}
          </dl>
        </div>

        {/* Enquiry Info */}
        <div className="rounded border border-neutral-200 bg-white p-5">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">Enquiry Info</h2>
          <dl className="space-y-3">
            <div>
              <dt className="text-xs text-neutral-400">Type</dt>
              <dd>
                <span className="rounded bg-neutral-100 px-2 py-0.5 text-xs font-semibold uppercase text-neutral-600">
                  {enquiry.type}
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-xs text-neutral-400">Status</dt>
              <dd>
                <span className={`rounded px-2 py-0.5 text-xs font-semibold uppercase ${
                  enquiry.status === 'NEW' ? 'bg-brand-100 text-brand-700'
                  : enquiry.status === 'REPLIED' ? 'bg-green-100 text-green-700'
                  : 'bg-neutral-100 text-neutral-600'
                }`}>
                  {enquiry.status}
                </span>
              </dd>
            </div>
            {enquiry.product && (
              <div>
                <dt className="text-xs text-neutral-400">Product</dt>
                <dd className="text-neutral-700">{enquiry.product.name}</dd>
              </div>
            )}
            {enquiry.productName && !enquiry.product && (
              <div>
                <dt className="text-xs text-neutral-400">Product (text)</dt>
                <dd className="text-neutral-700">{enquiry.productName}</dd>
              </div>
            )}
            {enquiry.quantity && (
              <div>
                <dt className="text-xs text-neutral-400">Quantity</dt>
                <dd className="text-neutral-700">{enquiry.quantity}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      {/* Message */}
      {enquiry.message && (
        <div className="mt-6 rounded border border-neutral-200 bg-white p-5">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">Message</h2>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-neutral-700">{enquiry.message}</p>
        </div>
      )}

      {/* Reply shortcut */}
      <div className="mt-6 rounded border border-brand-200 bg-brand-50 p-5">
        <h2 className="mb-2 text-sm font-semibold text-brand-700">Reply to this enquiry</h2>
        <p className="mb-3 text-sm text-brand-600">Open your email client to reply:</p>
        <a
          href={`mailto:${enquiry.email}?subject=Re: Mantra Sports Enquiry&body=Dear ${encodeURIComponent(enquiry.name)},%0A%0A`}
          className="inline-flex items-center gap-2 rounded bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600"
        >
          <Mail className="h-4 w-4" /> Reply via Email
        </a>
      </div>
    </div>
  )
}
