'use client'

import { useEffect } from 'react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to monitoring service in production
    console.error('[Error Boundary]', error)
  }, [error])

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-6 py-24 text-center">
      <p className="font-display text-sm font-semibold uppercase tracking-[0.25em] text-brand-500">
        Error
      </p>

      <h1 className="mt-4 font-display text-5xl font-bold uppercase text-neutral-950 dark:text-white">
        Er is iets misgegaan
      </h1>

      <p className="mt-6 max-w-md text-neutral-500 dark:text-neutral-400">
        Er is een onverwachte fout opgetreden. Probeer het opnieuw of neem contact op als het probleem aanhoudt.
      </p>

      {process.env.NODE_ENV === 'development' && (
        <pre className="mt-6 max-w-2xl overflow-auto rounded border border-red-200 bg-red-50 p-4 text-left text-xs text-red-700 dark:border-red-900 dark:bg-red-950/20 dark:text-red-400">
          {error.message}
        </pre>
      )}

      <div className="mt-10 flex gap-4">
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 bg-brand-500 px-8 py-4 font-display text-sm font-bold uppercase tracking-widest text-white transition-colors hover:bg-brand-600"
        >
          Opnieuw proberen
        </button>
        <a
          href="/"
          className="inline-flex items-center gap-2 border border-neutral-300 px-8 py-4 font-display text-sm font-bold uppercase tracking-widest text-neutral-700 transition-colors hover:border-neutral-400 dark:border-neutral-700 dark:text-neutral-300"
        >
          Naar huis
        </a>
      </div>
    </div>
  )
}
