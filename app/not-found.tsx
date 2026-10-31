import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: { absolute: '404 — Pagina niet gevonden | Mantra Sports NL' },
  robots: { index: false },
  alternates: { canonical: null },
}

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-6 py-24 text-center">
      <p className="font-display text-sm font-semibold uppercase tracking-[0.25em] text-brand-500">
        404
      </p>

      <h1 className="mt-4 font-display text-5xl font-bold uppercase text-neutral-950 dark:text-white sm:text-7xl">
        Pagina niet gevonden
      </h1>

      <p className="mt-6 max-w-md text-neutral-500 dark:text-neutral-400">
        De pagina die je zoekt bestaat niet of is verplaatst.
      </p>

      <div className="mt-10 flex flex-col gap-4 sm:flex-row">
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-brand-500 px-8 py-4 font-display text-sm font-bold uppercase tracking-widest text-white transition-colors hover:bg-brand-600"
        >
          Naar huis
        </Link>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 border border-neutral-300 px-8 py-4 font-display text-sm font-bold uppercase tracking-widest text-neutral-700 transition-colors hover:border-neutral-400 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-neutral-500"
        >
          Bekijk de shop
        </Link>
      </div>

      {/* Decorative */}
      <p
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center font-display text-[20rem] font-black text-neutral-950/[0.02] select-none dark:text-white/[0.02]"
      >
        404
      </p>
    </div>
  )
}
