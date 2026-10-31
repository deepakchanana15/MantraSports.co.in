// ─── Formatting Utilities ─────────────────────────────────────────────────────

/**
 * Format a price with currency symbol.
 * Designed to support multi-region expansion (AU, UK, US, IN).
 */
export function formatPrice(
  amount: number | null | undefined,
  currency: string = 'EUR',
  locale: string = 'nl-NL'
): string {
  if (amount === null || amount === undefined) return 'Prijs op aanvraag'

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Calculate discount percentage between regular and sale price.
 */
export function calculateDiscount(price: number, salePrice: number): number {
  if (price <= 0 || salePrice >= price) return 0
  return Math.round(((price - salePrice) / price) * 100)
}

/**
 * Format a date for display.
 */
export function formatDate(
  date: Date | string,
  options?: Intl.DateTimeFormatOptions
): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('nl-NL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    ...options,
  }).format(d)
}

/**
 * Format a file size in bytes to human-readable string.
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/**
 * Convert a number to a compact representation for display (e.g. 1200 → 1.2K).
 */
export function formatCompact(value: number): string {
  return new Intl.NumberFormat('nl-NL', { notation: 'compact' }).format(value)
}

/**
 * Pluralise a word based on count.
 */
export function pluralise(count: number, singular: string, plural: string): string {
  return count === 1 ? singular : plural
}
