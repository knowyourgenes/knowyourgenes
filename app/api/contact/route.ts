import { NextResponse } from 'next/server';
import { contactSchema, submitContactMessage } from '@/features/contact';
import { created, fail, zodFail } from '@/server/api';

/**
 * POST /api/contact - public contact-form intake.
 *
 * Public by design, so it does its own defending rather than relying on the
 * proxy (which skips /api entirely):
 *   • Zod validation, re-run server-side even though the form validates too.
 *   • Honeypot: `website` must be empty. Bots that fill every field get a 201
 *     with no side effect, so they cannot distinguish success from rejection.
 *   • Best-effort per-IP rate limit, in memory.
 *
 * NOTE: the rate limiter is per-instance and resets on redeploy. It stops naive
 * floods, not a distributed one. Move it to Redis/Upstash if this endpoint ever
 * attracts real abuse.
 */

const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  // Opportunistic sweep so the map cannot grow without bound.
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (!v.some((t) => now - t < WINDOW_MS)) hits.delete(k);
  }
  return recent.length > MAX_PER_WINDOW;
}

function clientIp(req: Request): string {
  const fwd = req.headers.get('x-forwarded-for');
  return fwd?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown';
}

export async function POST(req: Request): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return fail('Invalid JSON body', 400);
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) return zodFail(parsed.error);

  // Honeypot tripped - pretend it worked, do nothing.
  if (parsed.data.website) return created({ id: null, notified: false });

  if (rateLimited(clientIp(req))) {
    return fail('Too many messages from this address. Please try again later, or email hello@kyg.in.', 429);
  }

  try {
    const result = await submitContactMessage(parsed.data);
    return created(result);
  } catch (err) {
    console.error('[api/contact] submit failed', err);
    return fail('We could not save your message. Please email hello@kyg.in instead.', 500);
  }
}
