'use client'

import { useEffect } from 'react'

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[Admin Error]', error)
  }, [error])

  return (
    <div className="rounded border border-red-200 bg-red-50 p-6 text-sm text-red-800">
      <p className="mb-2 font-semibold">An error occurred</p>
      <p className="mb-1 font-mono">{error.message || 'Unknown error'}</p>
      {error.digest && (
        <p className="mb-3 text-xs text-red-500">Digest: {error.digest}</p>
      )}
      <button
        onClick={reset}
        className="mt-2 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
      >
        Try again
      </button>
    </div>
  )
}
