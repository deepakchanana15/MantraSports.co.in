'use client'

import { useState } from 'react'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { submitEnquiry } from '@/lib/actions/enquiries'

const inputCls =
  'w-full rounded-[2px] border border-neutral-300 bg-white px-4 py-3 text-[14px] text-neutral-900 outline-none transition-colors focus:border-[#e85d1a] focus:ring-1 focus:ring-[#e85d1a] placeholder:text-neutral-400'

const labelCls = 'mb-1.5 block font-display text-[11px] font-semibold uppercase tracking-[0.12em]'

const PRODUCT_OPTIONS = [
  'English Willow Cricket Bats',
  'Batting Pads',
  'Batting Gloves',
  'Wicket-Keeping Gloves',
  'Helmets',
  'Leather Cricket Balls',
  'Teamwear',
  'Custom Apparel',
  'Kit Bags & Accessories',
]

export function WholesaleForm({ productName, heading = 'Request a B2B Quote' }: { productName?: string; heading?: string }) {
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState<string[]>([])

  const toggle = (item: string) =>
    setSelected((prev) => (prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]))

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    const fd = new FormData(e.currentTarget)
    fd.set('type', 'WHOLESALE')
    if (productName) fd.set('productName', productName)
    if (selected.length > 0) {
      const existing = (fd.get('message') as string) || ''
      fd.set('message', `Products of interest: ${selected.join(', ')}${existing ? '\n\n' + existing : ''}`)
    }

    const result = await submitEnquiry(fd)
    if (result.ok) {
      setSuccess(true)
    } else {
      setError(result.error ?? 'Could not send your enquiry.')
    }
    setSubmitting(false)
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center rounded-[2px] px-8 py-12 text-center" style={{ border: '1px solid #E0DFDB', background: '#ffffff' }}>
        <CheckCircle2 className="mb-4 h-12 w-12" style={{ color: '#059669' }} />
        <h3 className="mb-2 font-display text-[22px] font-bold uppercase tracking-[0.03em]" style={{ color: '#111111' }}>
          Enquiry Received!
        </h3>
        <p className="max-w-[360px] text-[15px] leading-relaxed" style={{ color: '#6B6B6B' }}>
          Thank you for your B2B enquiry. Our team will contact you by email or phone with pricing and next steps.
        </p>
        <p className="mt-4 font-display text-[13px] font-semibold uppercase tracking-wider" style={{ color: '#e85d1a' }}>
          Team Mantra Sports India
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-5 sm:p-9" style={{ border: '1px solid #E0DFDB', background: '#ffffff' }}>
      <h3 className="mb-6 font-display text-[20px] font-bold uppercase tracking-[0.04em]" style={{ color: '#111111' }}>
        {heading}
      </h3>

      {productName && (
        <p className="rounded-[2px] px-4 py-3 text-[13px]" style={{ background: '#FFF5ED', border: '1px solid #e85d1a', color: '#333333' }}>
          Quote for: <strong>{productName}</strong>
        </p>
      )}

      {error && (
        <div className="rounded-[2px] border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">{error}</div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="ws-name" className={labelCls} style={{ color: '#6B6B6B' }}>
            Name <span style={{ color: '#e85d1a' }}>*</span>
          </label>
          <input id="ws-name" type="text" name="name" required placeholder="Your full name" className={inputCls} />
        </div>
        <div>
          <label htmlFor="ws-email" className={labelCls} style={{ color: '#6B6B6B' }}>
            Email <span style={{ color: '#e85d1a' }}>*</span>
          </label>
          <input id="ws-email" type="email" name="email" required placeholder="you@example.com" className={inputCls} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="ws-phone" className={labelCls} style={{ color: '#6B6B6B' }}>
            Phone / WhatsApp <span style={{ color: '#e85d1a' }}>*</span>
          </label>
          <input id="ws-phone" type="tel" name="phone" required placeholder="+91 ..." className={inputCls} />
        </div>
        <div>
          <label htmlFor="ws-company" className={labelCls} style={{ color: '#6B6B6B' }}>
            Club / School / Business
          </label>
          <input id="ws-company" type="text" name="company" placeholder="Organisation name" className={inputCls} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="ws-country" className={labelCls} style={{ color: '#6B6B6B' }}>
            City / State
          </label>
          <input id="ws-country" type="text" name="country" placeholder="e.g. Pune, Maharashtra" className={inputCls} />
        </div>
        <div>
          <label htmlFor="ws-qty" className={labelCls} style={{ color: '#6B6B6B' }}>
            Estimated quantity
          </label>
          <input id="ws-qty" type="number" name="quantity" min="1" placeholder="e.g. 20" className={inputCls} />
        </div>
      </div>

      <fieldset>
        <legend className={`${labelCls} mb-2`} style={{ color: '#6B6B6B' }}>
          Products of interest
        </legend>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {PRODUCT_OPTIONS.map((opt) => (
            <label key={opt} className="flex cursor-pointer items-center gap-2 rounded-[2px] px-3 py-2 text-[13px] transition-colors" style={{ border: `1px solid ${selected.includes(opt) ? '#e85d1a' : '#E0DFDB'}`, background: selected.includes(opt) ? '#FFF5ED' : '#ffffff', color: '#111111' }}>
              <input
                type="checkbox"
                className="h-3.5 w-3.5 accent-[#e85d1a]"
                checked={selected.includes(opt)}
                onChange={() => toggle(opt)}
              />
              {opt}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="ws-message" className={labelCls} style={{ color: '#6B6B6B' }}>
          Message / other details
        </label>
        <textarea id="ws-message" name="message" rows={4} placeholder="Tell us what you need — sizes, specifications, delivery date, custom branding, etc." className={inputCls} />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="flex w-full items-center justify-center gap-2 rounded-[2px] font-display text-[14px] font-bold uppercase tracking-[0.1em] text-white transition-colors disabled:opacity-60"
        style={{ background: '#e85d1a', padding: '16px 32px', border: 'none', cursor: submitting ? 'wait' : 'pointer' }}
        onMouseEnter={(e) => { if (!submitting) e.currentTarget.style.background = '#c44b0f' }}
        onMouseLeave={(e) => { e.currentTarget.style.background = '#e85d1a' }}
      >
        {submitting ? 'Sending…' : <>Send Enquiry <ArrowRight className="h-4 w-4" /></>}
      </button>

      <p className="text-center text-[11px]" style={{ color: '#A0A0A0' }}>
        We use your details only to respond to your enquiry. See our <a href="/privacy-policy" className="underline">Privacy Policy</a>.
      </p>
    </form>
  )
}
