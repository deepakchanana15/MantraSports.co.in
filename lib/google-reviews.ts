import 'server-only'
import { getSiteSettings } from '@/lib/utils/settings'

// ─── Google reviews from the Google Business Profile ─────────────────────────
// Uses the Places API (New) Place Details endpoint. Needs:
//   - GOOGLE_PLACES_API_KEY env var (server-side only)
//   - google_place_id + google_reviews_enabled = 'true' in /admin/settings
// Google returns up to 5 reviews. Reviews are shown unedited with author
// attribution and a link back to Google, as Google's policies require.

export interface GoogleReview {
  author: string
  authorUrl: string | null
  authorPhotoUrl: string | null
  rating: number
  text: string
  relativeTime: string
}

export interface GoogleReviewsData {
  rating: number | null
  total: number
  url: string | null
  reviews: GoogleReview[]
}

interface PlacesResponse {
  rating?: number
  userRatingCount?: number
  googleMapsUri?: string
  reviews?: Array<{
    rating?: number
    relativePublishTimeDescription?: string
    text?: { text?: string }
    originalText?: { text?: string }
    authorAttribution?: { displayName?: string; uri?: string; photoUri?: string }
  }>
}

export async function getGoogleReviews(): Promise<GoogleReviewsData | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  const settings = await getSiteSettings(['google_place_id', 'google_reviews_enabled', 'google_reviews_url'])
  const placeId = settings.google_place_id.trim()
  if (!apiKey || !placeId || settings.google_reviews_enabled !== 'true') return null

  try {
    const res = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?languageCode=en`, {
      headers: {
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'rating,userRatingCount,googleMapsUri,reviews',
      },
      next: { revalidate: 21600 }, // refresh every 6 hours
    })
    if (!res.ok) {
      console.error('[google-reviews] Places API error', res.status)
      return null
    }
    const data = (await res.json()) as PlacesResponse

    return {
      rating: data.rating ?? null,
      total: data.userRatingCount ?? 0,
      url: settings.google_reviews_url.trim() || data.googleMapsUri || null,
      reviews: (data.reviews ?? [])
        .map((r) => ({
          author: r.authorAttribution?.displayName ?? 'Google user',
          authorUrl: r.authorAttribution?.uri ?? null,
          authorPhotoUrl: r.authorAttribution?.photoUri ?? null,
          rating: r.rating ?? 0,
          text: r.text?.text ?? r.originalText?.text ?? '',
          relativeTime: r.relativePublishTimeDescription ?? '',
        }))
        .filter((r) => r.text.length > 0),
    }
  } catch (err) {
    console.error('[google-reviews] fetch failed', err)
    return null
  }
}
