'use client'

import { useState, useRef } from 'react'
import { saveSettings } from '@/lib/actions/settings'

const inputCls = 'w-full rounded border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 disabled:bg-neutral-50 disabled:text-neutral-400'

function HeroImageField({ currentUrl, disabled }: { currentUrl: string; disabled?: boolean }) {
  const [url, setUrl] = useState(currentUrl)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
      if (!cloudName || !uploadPreset) throw new Error('Cloudinary is not configured.')
      const fd = new FormData()
      fd.append('file', file)
      fd.append('upload_preset', uploadPreset)
      fd.append('folder', 'mantrasports/hero')
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: fd,
      })
      const data = await res.json()
      if (res.ok && data.secure_url) setUrl(data.secure_url)
    } finally {
      setUploading(false)
      if (e.target) e.target.value = ''
    }
  }

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-neutral-700">Hero Image</label>
      {url && (
        <div className="mb-3 overflow-hidden rounded border border-neutral-200 bg-neutral-50" style={{ height: '160px' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt="Hero preview" className="h-full w-full object-cover" />
        </div>
      )}
      <div className="flex gap-2">
        <input
          type="text"
          name="setting_hero_image_url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste a Cloudinary URL or use the Upload button"
          disabled={disabled}
          className={inputCls + ' flex-1'}
        />
        <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleUpload} />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={disabled || uploading}
          className="shrink-0 rounded border border-neutral-300 px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-50 disabled:opacity-50"
        >
          {uploading ? 'Uploading…' : 'Upload image'}
        </button>
      </div>
      <p className="mt-1.5 text-xs text-neutral-400">
        Shown in the right panel of the homepage hero section. Best size: 800×800 px or larger. JPG, PNG, WebP.
      </p>
    </div>
  )
}

type FieldDef = { key: string; label: string; type: string; placeholder?: string; hint?: string; options?: { value: string; label: string }[] }

const FIELDS: { section: string; items: FieldDef[] }[] = [
  { section: 'Branding', items: [
    { key: 'site_name',    label: 'Site Name',    type: 'text',     placeholder: 'Mantra Sports India' },
    { key: 'site_tagline', label: 'Tagline',      type: 'text',     placeholder: 'Performance. Got. Simplified.' },
    { key: 'announcement_text', label: 'Announcement Bar Text', type: 'text', placeholder: 'Free delivery across India on all orders', hint: 'Shown in the black bar at the top of every page. Leave empty to hide it.' },
  ]},
  { section: 'Contact', items: [
    { key: 'contact_email',   label: 'Contact Email',   type: 'email',  placeholder: 'support@mantrasports.com.au' },
    { key: 'contact_phone',   label: 'Phone Number',    type: 'tel',    placeholder: '+91 83689 15399' },
    { key: 'contact_address', label: 'Address',         type: 'text',   placeholder: 'Street, City, State PIN, India' },
  ]},
  { section: 'Shipping & Returns', items: [
    { key: 'shipping_processing_time', label: 'Order Processing Time', type: 'text', placeholder: '1–2 business days', hint: 'Shown on the Shipping Policy and FAQ.' },
    { key: 'shipping_delivery_time',   label: 'Delivery Time',         type: 'text', placeholder: '3–7 business days within India', hint: 'Shown on product pages, checkout, order emails and policies.' },
    { key: 'return_window_days',       label: 'Return Window (days, numbers only)', type: 'text', placeholder: '7' },
    { key: 'response_time_hours',      label: 'Enquiry Response Time (hours, numbers only)', type: 'text', placeholder: '24' },
  ]},
  { section: 'GST Invoices', items: [
    { key: 'default_gst_rate', label: 'Default GST Rate (%)', type: 'text', placeholder: 'e.g. 5', hint: 'Used on tax invoices for products without their own GST rate. Prices on the site are GST-inclusive. Confirm the rate with your CA.' },
    { key: 'default_hsn_code', label: 'Default HSN Code', type: 'text', placeholder: 'e.g. 9506', hint: 'Used on tax invoices for products without their own HSN code.' },
  ]},
  { section: 'Google Reviews', items: [
    { key: 'google_reviews_enabled', label: 'Show Google reviews on the homepage', type: 'select', options: [{ value: 'false', label: 'No' }, { value: 'true', label: 'Yes' }], hint: 'Needs the GOOGLE_PLACES_API_KEY environment variable on the server.' },
    { key: 'google_place_id',        label: 'Google Place ID', type: 'text', placeholder: 'ChIJ…', hint: 'Find it at developers.google.com/maps/documentation/places/web-service/place-id by searching your business name.' },
    { key: 'google_reviews_url',     label: 'Google Reviews Link (optional)', type: 'url', placeholder: 'https://g.page/r/…', hint: 'Where "Read all reviews on Google" points. Defaults to your Google Maps listing.' },
  ]},
  { section: 'Social Media', items: [
    { key: 'social_instagram',  label: 'Instagram URL',  type: 'url', placeholder: 'https://instagram.com/mantrasports' },
    { key: 'social_facebook',   label: 'Facebook URL',   type: 'url', placeholder: 'https://facebook.com/mantrasports' },
    { key: 'social_linkedin',   label: 'LinkedIn URL',   type: 'url', placeholder: 'https://linkedin.com/company/mantrasports' },
    { key: 'social_youtube',    label: 'YouTube URL',    type: 'url', placeholder: 'https://youtube.com/@mantrasports' },
  ]},
  { section: 'SEO', items: [
    { key: 'meta_title',       label: 'Default Meta Title',       type: 'text',     placeholder: 'Mantra Sports India — Premium Cricket' },
    { key: 'meta_description', label: 'Default Meta Description', type: 'textarea', placeholder: '160 chars max...' },
  ]},
]

export function SettingsForm({
  settings,
  disabled,
}: {
  settings: Record<string, string>
  disabled?: boolean
}) {
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    setError(null)

    const fd = new FormData(e.currentTarget)
    try {
      await saveSettings(fd)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error saving settings.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      {FIELDS.map(({ section, items }) => (
        <div key={section} className="rounded border border-neutral-200 bg-white p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-neutral-500">{section}</h2>
          <div className="space-y-4">
            {items.map(({ key, label, type, placeholder, hint, options }) => (
              <div key={key}>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700">{label}</label>
                {type === 'select' ? (
                  <select
                    name={`setting_${key}`}
                    defaultValue={settings[key] ?? ''}
                    disabled={disabled}
                    className={inputCls}
                  >
                    {options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                ) : type === 'textarea' ? (
                  <textarea
                    name={`setting_${key}`}
                    defaultValue={settings[key] ?? ''}
                    rows={2}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={inputCls}
                  />
                ) : (
                  <input
                    type={type}
                    name={`setting_${key}`}
                    defaultValue={settings[key] ?? ''}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={inputCls}
                  />
                )}
                {hint && <p className="mt-1 text-xs text-neutral-400">{hint}</p>}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Homepage hero image */}
      <div className="rounded border border-neutral-200 bg-white p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-neutral-500">Homepage</h2>
        <HeroImageField currentUrl={settings['hero_image_url'] ?? ''} disabled={disabled} />
      </div>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={saving || disabled}
          className="rounded bg-brand-500 px-6 py-2.5 font-display text-sm font-bold uppercase tracking-wider text-white hover:bg-brand-600 disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save Settings'}
        </button>
        {saved && (
          <span className="text-sm font-medium text-green-600">✓ Settings saved</span>
        )}
      </div>
    </form>
  )
}
