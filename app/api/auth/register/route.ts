import { NextResponse } from 'next/server';
import { registerUser } from '@/features/auth/server/auth-helpers';
import { ZodError } from 'zod';
import { clientIp, rateLimited } from '@/lib/rate-limit';

/**
 * POST /api/auth/register - public account creation.
 *
 * Public, so like /api/contact it has to defend itself: proxy.ts skips /api, and
 * an unthrottled signup endpoint is a free tool for anyone who wants to walk a
 * list of email addresses and learn which ones already have an account here.
 * On a site that stores genetic reports, "is this person a customer" is itself
 * the sensitive answer, so the rate limit is a privacy control and not only an
 * anti-spam one.
 *
 * The duplicate-account messages below are still specific, deliberately: someone
 * who genuinely forgot they had signed up needs to be told to sign in instead.
 * Closing that gap properly needs a verify-by-email flow - send the same
 * "check your inbox" response either way, and let the mail decide what happens
 * next - which cannot be built until SMTP is configured. The throttle is what
 * makes the remaining leak impractical to mine in the meantime.
 */
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_PER_WINDOW = 5;

/**
 * Messages registerUser raises that are safe to repeat to the caller. Anything
 * NOT in this set is an internal failure - a Prisma constraint, a dead
 * connection - and gets logged and replaced. Returning `err.message` verbatim,
 * as this route used to, hands out whatever text the database happened to
 * produce, which is a description of the schema nobody outside needs.
 */
const SAFE_ERRORS = new Set([
  'An account with this email already exists',
  'An account with this phone number already exists',
]);

export async function POST(req: Request) {
  if (rateLimited('register', clientIp(req), { windowMs: WINDOW_MS, max: MAX_PER_WINDOW })) {
    return NextResponse.json(
      { error: 'Too many attempts from this address. Please try again in a few minutes.' },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const user = await registerUser(body);
    return NextResponse.json({ user }, { status: 201 });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json({ error: 'Validation failed', issues: err.issues }, { status: 400 });
    }

    const message = err instanceof Error ? err.message : '';
    if (SAFE_ERRORS.has(message)) {
      // 409, not 400: the request was well-formed, it conflicts with what exists.
      return NextResponse.json({ error: message }, { status: 409 });
    }

    console.error('[api/auth/register] failed', err);
    return NextResponse.json({ error: 'We could not create your account. Please try again.' }, { status: 400 });
  }
}
