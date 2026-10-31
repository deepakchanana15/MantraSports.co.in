import { Star } from 'lucide-react'
import type { GoogleReviewsData } from '@/lib/google-reviews'

function StarRating({ rating }: { rating: number }) {
  const rounded = Math.round(rating)
  return (
    <div className="flex" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="h-3.5 w-3.5" fill={i < rounded ? '#e85d1a' : 'none'} stroke={i < rounded ? '#e85d1a' : '#D0CFC8'} />
      ))}
    </div>
  )
}

export function GoogleReviews({ data }: { data: GoogleReviewsData }) {
  const reviews = data.reviews.slice(0, 3)

  return (
    <section aria-labelledby="reviews-heading" className="px-4 py-14 sm:px-8 lg:px-[60px] lg:py-20" style={{ background: '#F8F7F4', borderBottom: '1px solid #E0DFDB' }}>
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 font-display text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: '#e85d1a' }}>Customer Reviews</p>
          <h2 id="reviews-heading" className="font-display font-bold uppercase leading-tight tracking-[0.01em]" style={{ fontSize: 'clamp(30px, 4vw, 52px)', color: '#111111' }}>
            Reviewed on Google
          </h2>
          {data.rating !== null && data.total > 0 && (
            <div className="mt-3 flex items-center gap-3">
              <StarRating rating={data.rating} />
              <span className="text-[13px]" style={{ color: '#333333' }}>
                <strong>{data.rating.toFixed(1)}</strong> from {data.total} Google {data.total === 1 ? 'review' : 'reviews'}
              </span>
            </div>
          )}
        </div>
        {data.url && (
          <a href={data.url} target="_blank" rel="noopener noreferrer" className="font-display text-[13px] font-semibold uppercase tracking-widest" style={{ color: '#e85d1a' }}>
            Read all reviews on Google →
          </a>
        )}
      </div>

      <div className="grid grid-cols-1 gap-px md:grid-cols-3" style={{ border: '1px solid #E0DFDB', background: '#E0DFDB' }}>
        {reviews.map((review, i) => (
          <figure key={i} className="flex flex-col" style={{ padding: '32px', background: '#ffffff' }}>
            <StarRating rating={review.rating} />
            <blockquote className="mt-4 flex-1 text-[14px] leading-relaxed" style={{ color: '#333333' }}>
              {review.text.length > 320 ? `${review.text.slice(0, 317)}…` : review.text}
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-3">
              {review.authorPhotoUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={review.authorPhotoUrl} alt="" width={36} height={36} className="h-9 w-9 rounded-full" referrerPolicy="no-referrer" />
              )}
              <div>
                {review.authorUrl ? (
                  <a href={review.authorUrl} target="_blank" rel="noopener noreferrer" className="font-display text-[13px] font-semibold uppercase tracking-[0.06em]" style={{ color: '#111111' }}>
                    {review.author}
                  </a>
                ) : (
                  <span className="font-display text-[13px] font-semibold uppercase tracking-[0.06em]" style={{ color: '#111111' }}>{review.author}</span>
                )}
                <p className="text-[11px]" style={{ color: '#999999' }}>{review.relativeTime} · via Google</p>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
