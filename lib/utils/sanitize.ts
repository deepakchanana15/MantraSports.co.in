import DOMPurify from 'isomorphic-dompurify'

// Allowed HTML tags for rich text content (product descriptions, blog posts).
const ALLOWED_TAGS = [
  'p', 'br', 'strong', 'em', 'u', 's', 'ul', 'ol', 'li',
  'h2', 'h3', 'h4', 'blockquote', 'a', 'img',
]

const ALLOWED_ATTR = ['href', 'target', 'rel', 'src', 'alt', 'class']

// Sanitise rich HTML from the Tiptap editor before storing in the database
// and before rendering to the page. Run on every save operation.
export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ADD_ATTR: ['target'],
    FORCE_BODY: false,
  })
}

// Sanitise plain text — strips all HTML
export function sanitizeText(dirty: string): string {
  return DOMPurify.sanitize(dirty, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] })
}

// Sanitise a URL — only allow http/https/mailto
export function sanitizeUrl(url: string): string {
  try {
    const parsed = new URL(url)
    if (['http:', 'https:', 'mailto:'].includes(parsed.protocol)) {
      return url
    }
  } catch {
    // Invalid URL
  }
  return '#'
}

// Strip HTML tags from a string (for meta descriptions, excerpts)
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
}

// Truncate text to a maximum length with ellipsis
export function truncate(text: string, maxLength: number): string {
  const clean = stripHtml(text)
  if (clean.length <= maxLength) return clean
  return clean.slice(0, maxLength - 3).trimEnd() + '...'
}
