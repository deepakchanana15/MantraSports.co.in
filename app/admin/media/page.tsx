'use client'

import { useState, useRef, useCallback } from 'react'
import { Upload, Copy, Check, Trash2, Image as ImageIcon } from 'lucide-react'

interface MediaItem {
  url: string
  filename: string
  uploadedAt: string
}

const STORAGE_KEY = 'mantra_media_library'

function loadMedia(): MediaItem[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
  } catch {
    return []
  }
}

function saveMedia(items: MediaItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {}
}

export default function MediaPage() {
  const [items, setItems] = useState<MediaItem[]>(() => {
    if (typeof window === 'undefined') return []
    return loadMedia()
  })
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return
    setUploading(true)
    setError('')

    const newItems: MediaItem[] = []
    for (const file of Array.from(files)) {
      const fd = new FormData()
      fd.append('file', file)
      try {
        const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
        const data = await res.json()
        if (!res.ok) {
          setError(data.error ?? 'Upload failed')
          continue
        }
        newItems.push({ url: data.url, filename: file.name, uploadedAt: new Date().toISOString() })
      } catch {
        setError('Upload failed. Check your network connection.')
      }
    }

    if (newItems.length > 0) {
      setItems((prev) => {
        const updated = [...newItems, ...prev]
        saveMedia(updated)
        return updated
      })
    }
    setUploading(false)
    if (fileRef.current) fileRef.current.value = ''
  }, [])

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(url)
      setTimeout(() => setCopied(null), 2000)
    })
  }

  const remove = (url: string) => {
    setItems((prev) => {
      const updated = prev.filter((i) => i.url !== url)
      saveMedia(updated)
      return updated
    })
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Media Library</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Upload images to Cloudinary and copy their URLs for use in products, blog posts, or settings.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 rounded bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-60"
          >
            <Upload className="h-4 w-4" />
            {uploading ? 'Uploading…' : 'Upload Images'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      {/* Drop zone hint when empty */}
      {items.length === 0 && !uploading && (
        <button
          onClick={() => fileRef.current?.click()}
          className="flex w-full flex-col items-center justify-center gap-3 rounded border-2 border-dashed border-neutral-300 bg-neutral-50 py-20 text-center transition-colors hover:border-brand-400 hover:bg-orange-50"
        >
          <ImageIcon className="h-12 w-12 text-neutral-300" />
          <p className="font-medium text-neutral-500">No images yet</p>
          <p className="text-sm text-neutral-400">Click to upload JPG, PNG, WebP or GIF — max 10 MB each</p>
        </button>
      )}

      {/* Image grid */}
      {items.length > 0 && (
        <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
          {items.map((item) => (
            <div key={item.url} className="group relative overflow-hidden rounded border border-neutral-200 bg-white">
              {/* Thumbnail */}
              <div className="relative bg-neutral-100" style={{ aspectRatio: '1' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.url}
                  alt={item.filename}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* Info + actions */}
              <div className="p-3">
                <p className="mb-2 truncate text-xs font-medium text-neutral-700" title={item.filename}>
                  {item.filename}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => copyUrl(item.url)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded border border-neutral-200 py-1.5 text-xs font-semibold text-neutral-600 hover:border-brand-500 hover:text-brand-600 transition-colors"
                  >
                    {copied === item.url ? (
                      <><Check className="h-3 w-3 text-green-600" /> Copied!</>
                    ) : (
                      <><Copy className="h-3 w-3" /> Copy URL</>
                    )}
                  </button>
                  <button
                    onClick={() => remove(item.url)}
                    className="flex items-center justify-center rounded border border-neutral-200 px-2 py-1.5 text-xs text-red-400 hover:border-red-300 hover:text-red-600 transition-colors"
                    title="Remove from library"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="mt-6 text-xs text-neutral-400">
        Images are uploaded to Cloudinary. The library list is stored in your browser — clearing browser data will reset it, but the images remain on Cloudinary and their URLs stay valid.
      </p>
    </div>
  )
}
