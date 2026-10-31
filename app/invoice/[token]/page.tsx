import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db/prisma'
import { SITE_CONFIG } from '@/lib/config/site'
import { getSiteSettings } from '@/lib/utils/settings'
import { formatDate } from '@/lib/utils/format'
import { PrintButton } from './PrintButton'

export const metadata: Metadata = {
  title: { absolute: 'Tax Invoice | Mantra Sports India' },
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

const inr = (n: number) =>
  new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)

const round2 = (n: number) => Math.round(n * 100) / 100

export default async function InvoicePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  if (!/^[A-Za-z0-9_-]{20,64}$/.test(token)) notFound()

  const order = await prisma.order.findUnique({ where: { accessToken: token }, include: { items: true } })
  if (!order || !order.paidAt) notFound()

  const { default_gst_rate, default_hsn_code } = await getSiteSettings(['default_gst_rate', 'default_hsn_code'])
  const fallbackRate = default_gst_rate.trim() ? Number(default_gst_rate) : null
  const { company } = SITE_CONFIG
  const intraState = order.state === company.region

  const lines = order.items.map((item) => {
    const rate = item.gstRate != null ? Number(item.gstRate) : fallbackRate
    const gross = Number(item.lineTotal)
    const taxable = rate != null ? round2(gross / (1 + rate / 100)) : null
    const tax = taxable != null ? round2(gross - taxable) : null
    return { ...item, rate, gross, taxable, tax, hsn: item.hsnCode || default_hsn_code || '—' }
  })
  const hasTaxBreakdown = lines.every((l) => l.rate != null)
  const totalTaxable = round2(lines.reduce((n, l) => n + (l.taxable ?? 0), 0))
  const totalTax = round2(lines.reduce((n, l) => n + (l.tax ?? 0), 0))
  const total = Number(order.total)

  const cell = 'border border-[#ccc] px-2 py-1.5 align-top'

  return (
    <div className="min-h-screen bg-[#F8F7F4] py-8 print:bg-white print:py-0">
      <div className="mx-auto mb-4 flex max-w-[860px] justify-end px-4 print:hidden">
        <PrintButton />
      </div>
      <article className="mx-auto max-w-[860px] bg-white p-8 text-[12px] text-[#111] shadow-sm print:max-w-none print:p-0 print:shadow-none">
        <header className="mb-6 flex flex-wrap items-start justify-between gap-6 border-b-2 border-[#111] pb-4">
          <div>
            <p className="font-display text-2xl font-bold tracking-[0.04em]">MANTRA SPORTS</p>
            <p className="mt-2 font-semibold">{company.legalName}</p>
            <p className="max-w-[320px] leading-relaxed">{SITE_CONFIG.contact.address}</p>
            <p>GSTIN: <strong>{company.gstin}</strong></p>
            <p>{SITE_CONFIG.contact.email} · {SITE_CONFIG.contact.phone}</p>
          </div>
          <div className="text-right">
            <p className="font-display text-xl font-bold uppercase">{hasTaxBreakdown ? 'Tax Invoice' : 'Invoice'}</p>
            <p className="mt-2">Invoice no: <strong>{order.orderNumber}</strong></p>
            <p>Invoice date: {formatDate(order.paidAt)}</p>
            <p>Order date: {formatDate(order.createdAt)}</p>
            <p>Payment: Prepaid (Razorpay)</p>
            {order.razorpayPaymentId && <p className="text-[10px] text-[#666]">Ref: {order.razorpayPaymentId}</p>}
          </div>
        </header>

        <section className="mb-6 grid grid-cols-2 gap-6">
          <div>
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#666]">Bill to / Ship to</p>
            {order.buyerCompany && <p className="font-semibold">{order.buyerCompany}</p>}
            <p className={order.buyerCompany ? '' : 'font-semibold'}>{order.customerName}</p>
            <p>{order.addressLine1}</p>
            {order.addressLine2 && <p>{order.addressLine2}</p>}
            <p>{order.city}, {order.state} {order.pincode}, India</p>
            <p>{order.phone} · {order.email}</p>
            {order.buyerGstin && <p>GSTIN: <strong>{order.buyerGstin}</strong></p>}
          </div>
          <div className="text-right">
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#666]">Place of supply</p>
            <p>{order.state}</p>
          </div>
        </section>

        <table className="mb-4 w-full border-collapse">
          <thead>
            <tr className="bg-[#F2F1EE] text-left">
              <th className={cell}>#</th>
              <th className={cell}>Item</th>
              <th className={cell}>HSN</th>
              <th className={`${cell} text-right`}>Qty</th>
              {hasTaxBreakdown && <th className={`${cell} text-right`}>Taxable value (₹)</th>}
              {hasTaxBreakdown && (intraState
                ? <><th className={`${cell} text-right`}>CGST (₹)</th><th className={`${cell} text-right`}>SGST (₹)</th></>
                : <th className={`${cell} text-right`}>IGST (₹)</th>)}
              <th className={`${cell} text-right`}>Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            {lines.map((l, i) => (
              <tr key={l.id}>
                <td className={cell}>{i + 1}</td>
                <td className={cell}>
                  {l.productName}
                  {l.option && <span className="block text-[10px] text-[#666]">{l.option}</span>}
                  {l.sku && <span className="block text-[10px] text-[#666]">SKU {l.sku}</span>}
                </td>
                <td className={cell}>{l.hsn}</td>
                <td className={`${cell} text-right`}>{l.quantity}</td>
                {hasTaxBreakdown && <td className={`${cell} text-right`}>{inr(l.taxable!)}</td>}
                {hasTaxBreakdown && (intraState
                  ? <>
                      <td className={`${cell} text-right`}>{inr(round2(l.tax! / 2))}<span className="block text-[10px] text-[#666]">@{l.rate! / 2}%</span></td>
                      <td className={`${cell} text-right`}>{inr(round2(l.tax! - round2(l.tax! / 2)))}<span className="block text-[10px] text-[#666]">@{l.rate! / 2}%</span></td>
                    </>
                  : <td className={`${cell} text-right`}>{inr(l.tax!)}<span className="block text-[10px] text-[#666]">@{l.rate}%</span></td>)}
                <td className={`${cell} text-right`}>{inr(l.gross)}</td>
              </tr>
            ))}
            <tr>
              <td className={cell} colSpan={hasTaxBreakdown ? (intraState ? 7 : 6) : 4}>Delivery charges</td>
              <td className={`${cell} text-right`}>{inr(Number(order.shippingFee))}</td>
            </tr>
          </tbody>
        </table>

        <div className="ml-auto w-full max-w-[320px] space-y-1">
          {hasTaxBreakdown && (
            <>
              <div className="flex justify-between"><span>Total taxable value</span><span>₹{inr(totalTaxable)}</span></div>
              <div className="flex justify-between"><span>Total GST</span><span>₹{inr(totalTax)}</span></div>
            </>
          )}
          <div className="flex justify-between border-t-2 border-[#111] pt-1 text-[14px] font-bold"><span>Grand total</span><span>₹{inr(total)}</span></div>
          <p className="text-right text-[10px] text-[#666]">All prices inclusive of GST</p>
        </div>

        <footer className="mt-10 border-t border-[#ccc] pt-4 text-[10px] leading-relaxed text-[#666]">
          <p>This is a computer-generated invoice and does not require a signature.</p>
          <p>Returns &amp; refunds: {SITE_CONFIG.url}/returns-policy · Grievance Officer: {SITE_CONFIG.grievanceOfficer.name}, {SITE_CONFIG.grievanceOfficer.phone}, {SITE_CONFIG.grievanceOfficer.email}</p>
        </footer>
      </article>
    </div>
  )
}
