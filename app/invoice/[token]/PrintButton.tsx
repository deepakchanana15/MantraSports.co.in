'use client'

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-[2px] bg-[#111] px-5 py-2 font-display text-xs font-semibold uppercase tracking-[0.1em] text-white hover:bg-[#E85D1A]"
    >
      Print / Save as PDF
    </button>
  )
}
