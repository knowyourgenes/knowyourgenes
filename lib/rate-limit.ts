/**
 * Best-effort per-IP rate limiting for public API routes.
 *
 * Lifted out of app/api/contact/route.ts, which had the only copy, once a
 * second and third endpoint needed the same defence. Public routes have to do
 * their own defending: proxy.ts skips /api entirely (see its matcher), so
 * nothing upstream is counting requests for them.
 *
 * DELIBERATELY IN MEMORY, and therefore per-instance and reset by a redeploy.
 * It stops a naive flood from one address - credential stuffing, signup spam,
 * someone walking a list of emails to see which ones are registered - and does
 * nothing against a distributed one. That is the honest limit of a counter that
 * lives in a process. Move the store to Redis/Upstash if any of these endpoints
 * attracts real abuse; the call sites will not need to change.
 */

interface Bucket {
  windowMs: number;
  max: number;
  hits: Map<string, number[]>;
}

const buckets = new Map<string, Bucket>();

/** The caller's IP, as far as the proxy in front of us reports it. */
export function clientIp(req: Request): string {
  const fwd = req.headers.get('x-forwarded-for');
  return fwd?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown';
}

/**
 * Records a hit and reports whether this caller has now exceeded the limit.
 *
 * `name` keeps each endpoint's budget separate, so signing in too often cannot
 * lock someone out of the contact form.
 */
export function rateLimited(name: string, ip: string, opts: { windowMs: number; max: number }): boolean {
  let bucket = buckets.get(name);
  if (!bucket) {
    bucket = { windowMs: opts.windowMs, max: opts.max, hits: new Map() };
    buckets.set(name, bucket);
  }

  const now = Date.now();
  const recent = (bucket.hits.get(ip) ?? []).filter((t) => now - t < bucket.windowMs);
  recent.push(now);
  bucket.hits.set(ip, recent);

  // Opportunistic sweep so the map cannot grow without bound.
  if (bucket.hits.size > 5000) {
    for (const [k, v] of bucket.hits) {
      if (!v.some((t) => now - t < bucket.windowMs)) bucket.hits.delete(k);
    }
  }

  return recent.length > bucket.max;
}
