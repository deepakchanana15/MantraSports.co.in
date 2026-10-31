'use client'

import { useState } from 'react'

type GalleryImage = {
  url: string
  altText: string | null
}

export function ImageGallery({ images, name }: { images: GalleryImage[]; name: string }) {
  const [selected, setSelected] = useState(0)
  const current = images[selected]

  return (
    <div>
      {/* Main image */}
      <div
        className="overflow-hidden bg-[#F8F7F4]"
        style={{ minHeight: 480, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        {current ? (
          <img
            key={current.url}
            src={current.url}
            alt={current.altText ?? name}
            style={{ maxWidth: '100%', maxHeight: 640, width: 'auto', height: 'auto', objectFit: 'contain', display: 'block' }}
            className="transition-opacity duration-300"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center" style={{ minHeight: 480 }}>
            <svg width="96" height="96" viewBox="0 0 64 64" fill="none" className="opacity-15">
              <rect x="8" y="24" width="48" height="16" rx="4" fill="#111" />
              <rect x="28" y="8" width="8" height="48" rx="4" fill="#111" />
            </svg>
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              aria-label={`Bild ${i + 1} anzeigen`}
              className={`h-20 w-20 shrink-0 overflow-hidden border-2 bg-[#F8F7F4] transition-colors ${
                selected === i ? 'border-[#E85D1A]' : 'border-transparent hover:border-[#ccc]'
              }`}
            >
              <img src={img.url} alt={img.altText ?? ''} className="h-full w-full object-contain" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
