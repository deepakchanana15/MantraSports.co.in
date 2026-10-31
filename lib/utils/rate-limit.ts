// In-memory rate limiter for API routes.
// For production at scale, replace with Upstash Redis.
// This implementation is sufficient for a VPS/Firebase deployment.

interface RateLimitEntry {
  count: number
  resetAt: number
}

const store = new Map<string, RateLimitEntry>()

// Cleanup expired entries every 5 minutes to prevent memory leaks.
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt < now) store.delete(key)
  }
}, 5 * 60 * 1000)

interface RateLimitOptions {
  maxRequests: number
  windowMs: number
}

interface RateLimitResult {
  success: boolean
  remaining: number
  resetAt: number
}

export function rateLimit(key: string, options: RateLimitOptions): RateLimitResult {
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || entry.resetAt < now) {
    const newEntry: RateLimitEntry = {
      count: 1,
      resetAt: now + options.windowMs,
    }
    store.set(key, newEntry)
    return {
      success: true,
      remaining: options.maxRequests - 1,
      resetAt: newEntry.resetAt,
    }
  }

  if (entry.count >= options.maxRequests) {
    return {
      success: false,
      remaining: 0,
      resetAt: entry.resetAt,
    }
  }

  entry.count++
  return {
    success: true,
    remaining: options.maxRequests - entry.count,
    resetAt: entry.resetAt,
  }
}

// Pre-configured limiters for common routes
export const enquiryLimiter = (ip: string) =>
  rateLimit(`enquiry:${ip}`, { maxRequests: 5, windowMs: 60 * 60 * 1000 }) // 5/hr

export const loginLimiter = (ip: string) =>
  rateLimit(`login:${ip}`, { maxRequests: 5, windowMs: 15 * 60 * 1000 }) // 5/15min
