'use client'

import { useEffect, useMemo, useState } from 'react'
import { X, Check, Search } from 'lucide-react'

type CloudinaryImage = { url: string; thumbUrl: string; name: string; width: number; height: number }

interface Props {
  open: boolean
  onClose: () => void
  /** Called with the chosen image URLs, in the order they were clicked. */
  onSelect: (urls: string[]) => void
  /** URLs already on the product — shown as "Added". */
  existingUrls?: string[]
  multiple?: boolean
}

const LAST_FOLDER_KEY = 'mantra_cloudinary_folder'

export default function CloudinaryPicker({ open, onClose, onSelect, existingUrls = [], multiple = true }: Props) {
  const [folders, setFolders] = useState<string[]>([])
  const [folder, setFolder] = useState('')
  const [images, setImages] = useState<CloudinaryImage[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<string[]>([])

  // Load folders the first time the picker opens
  useEffect(() => {
    if (!open || folders.length) return
    setLoading(true)
    fetch('/api/admin/cloudinary')
      .then(async (r) => {
        const data = await r.json()
        if (!r.ok) throw new Error(data.error ?? 'Could not load folders.')
        const list: string[] = data.folders
        setFolders(list)
        let last = ''
        try { last = localStorage.getItem(LAST_FOLDER_KEY) ?? '' } catch {}
        setFolder(list.includes(last) ? last : list[0] ?? '')
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [open, folders.length])

  // Load images whenever the folder changes
  useEffect(() => {
    if (!open || !folder) return
    setLoading(true)
    setError('')
    setImages([])
    try { localStorage.setItem(LAST_FOLDER_KEY, folder) } catch {}
    fetch(`/api/admin/cloudinary?folder=${encodeURIComponent(folder)}`)
      .then(async (r) => {
        const data = await r.json()
        if (!r.ok) throw new Error(data.error ?? 'Could not load pictures.')
        setImages(data.images)
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [open, folder])

  // Reset the selection each time the picker is reopened
  useEffect(() => {
    if (open) { setSelected([]); setQuery('') }
  }, [open])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return q ? images.filter((img) => img.name.toLowerCase().includes(q)) : images
  }, [images, query])

  const toggle = (url: string) => {
    if (!multiple) { setSelected([url]); return }
    setSelected((prev) => (prev.includes(url) ? prev.filter((u) => u !== url) : [...prev, url]))
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.55)' }} onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Choose pictures from Cloudinary"
        className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-lg bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex flex-wrap items-center gap-3 border-b border-neutral-200 px-5 py-4">
          <h2 className="mr-auto text-base font-semibold text-neutral-900">Choose from Cloudinary</h2>
          <select
            value={folder}
            onChange={(e) => setFolder(e.target.value)}
            className="rounded border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none focus:border-brand-500"
            aria-label="Folder"
          >
            {folders.map((f) => (
              <option key={f} value={f}>{f}{f.startsWith('mantrasports-in/') ? ' (India)' : ''}</option>
            ))}
          </select>
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name…"
              className="w-48 rounded border border-neutral-300 py-2 pl-8 pr-3 text-sm outline-none focus:border-brand-500"
            />
          </div>
          <button type="button" onClick={onClose} className="rounded p-1.5 text-neutral-500 hover:bg-neutral-100" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Grid */}
        <div className="min-h-[300px] flex-1 overflow-y-auto p-5">
          {error && <p className="text-sm text-red-600">{error}</p>}
          {loading && <p className="text-sm text-neutral-500">Loading…</p>}
          {!loading && !error && visible.length === 0 && (
            <p className="text-sm text-neutral-500">
              {images.length === 0 ? 'No pictures in this folder.' : 'No pictures match your search.'}
            </p>
          )}
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
            {visible.map((img) => {
              const order = selected.indexOf(img.url)
              const added = existingUrls.includes(img.url)
              return (
                <button
                  key={img.url}
                  type="button"
                  onClick={() => toggle(img.url)}
                  title={img.name}
                  className={`group relative overflow-hidden rounded border-2 bg-neutral-50 text-left transition-colors ${order >= 0 ? 'border-brand-500' : 'border-neutral-200 hover:border-neutral-400'}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.thumbUrl} alt={img.name} loading="lazy" className="aspect-square w-full object-contain" />
                  <span className="block truncate px-1.5 py-1 text-[11px] text-neutral-600">{img.name}</span>
                  {order >= 0 && (
                    <span className="absolute right-1 top-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-brand-500 px-1 text-xs font-bold text-white">
                      {multiple ? order + 1 : <Check className="h-3.5 w-3.5" />}
                    </span>
                  )}
                  {added && order < 0 && (
                    <span className="absolute left-1 top-1 rounded bg-neutral-800 px-1 py-0.5 text-[9px] font-bold uppercase text-white">Added</span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 border-t border-neutral-200 px-5 py-3">
          <p className="text-xs text-neutral-500">
            {images.length > 0 && `${visible.length} of ${images.length} pictures`}
            {multiple && images.length > 0 && ' · Click pictures in the order you want them shown'}
          </p>
          <div className="flex gap-2">
            <button type="button" onClick={onClose} className="rounded border border-neutral-300 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50">
              Cancel
            </button>
            <button
              type="button"
              disabled={selected.length === 0}
              onClick={() => { onSelect(selected); onClose() }}
              className="rounded bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-40"
            >
              {multiple ? `Add ${selected.length || ''} picture${selected.length === 1 ? '' : 's'}` : 'Use picture'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
