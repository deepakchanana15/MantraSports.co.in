import SlugifyLib from 'slugify'

export function slugify(text: string): string {
  return SlugifyLib(text, {
    lower: true,
    strict: true,
    trim: true,
    locale: 'de', // German locale handles umlauts correctly
  })
}

export function generateUniqueSlug(base: string, existingSlugs: string[]): string {
  const slug = slugify(base)
  if (!existingSlugs.includes(slug)) return slug

  let counter = 2
  while (existingSlugs.includes(`${slug}-${counter}`)) {
    counter++
  }
  return `${slug}-${counter}`
}
