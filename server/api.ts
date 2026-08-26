import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import type { Session } from 'next-auth';
import { auth } from '@/features/auth';
import type { Role } from '@prisma/client';

/**
 * An error whose message is safe to show the caller, carrying its own status.
 *
 * `handle` below surfaces a plain Error's message as a 400, which is right for
 * the deliberate `throw new Error('Agent not found')` style used across these
 * routes - but it means any error that reaches it is quoted verbatim, including
 * ones written by Prisma. Throw this when the status matters (409 for a
 * precondition, 404 for a missing row) and when you have chosen the wording.
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number = 400,
    public readonly extra?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// ---------------------------------------------------------------------------
// Response helpers - consistent JSON shape across every admin endpoint.
// ---------------------------------------------------------------------------

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ ok: true, data }, init);
}

export function created<T>(data: T) {
  return ok(data, { status: 201 });
}

export function fail(error: string, status = 400, extra?: Record<string, unknown>) {
  return NextResponse.json({ ok: false, error, ...extra }, { status });
}

export function zodFail(err: ZodError) {
  return fail('Validation failed', 422, { issues: err.issues });
}

// ---------------------------------------------------------------------------
// Auth guard for API routes.
// Returns the session user on success, or a Response on failure.
// ---------------------------------------------------------------------------

export type SessionUser = Session['user'];

export async function requireApiRole(allowed: Role[]): Promise<SessionUser | NextResponse> {
  const session = (await auth()) as Session | null;
  if (!session?.user) return fail('Unauthenticated', 401);
  if (!allowed.includes(session.user.role)) return fail('Forbidden', 403);
  return session.user;
}

export function isResponse(x: unknown): x is NextResponse {
  return x instanceof NextResponse;
}

// ---------------------------------------------------------------------------
// Wrapper to handle thrown errors uniformly.
// ---------------------------------------------------------------------------

export async function handle<T>(fn: () => Promise<T>): Promise<NextResponse> {
  try {
    const result = await fn();
    if (result instanceof NextResponse) return result;
    return ok(result);
  } catch (err) {
    if (err instanceof ZodError) return zodFail(err);
    if (err instanceof ApiError) return fail(err.message, err.status, err.extra);

    // Prisma writes its own messages, and they are not written for customers -
    // a unique-constraint violation reads "Unique constraint failed on the
    // fields: (`orderNumber`)" and used to be rendered verbatim in a checkout
    // toast. Log the real thing, tell the caller nothing about our schema.
    if (isPrismaError(err)) {
      console.error('[api] prisma error', err);
      return fail('Something went wrong. Please try again.', 500);
    }

    if (err instanceof Error) return fail(err.message, 400);
    return fail('Unknown error', 500);
  }
}

/**
 * Prisma's known-request errors carry a `P`-prefixed code. Detected structurally
 * rather than with `instanceof` so this does not depend on which Prisma runtime
 * entrypoint the caller happened to import.
 */
function isPrismaError(err: unknown): err is Error & { code: string } {
  if (!(err instanceof Error)) return false;
  const code = (err as unknown as { code?: unknown }).code;
  return typeof code === 'string' && /^P\d{4}$/.test(code);
}

/**
 * An AGENT whose profile is still active.
 *
 * `requireApiRole(['AGENT'])` reads the JWT and nothing else, so deactivating an
 * agent stopped nothing: the role stays AGENT, the session survives (Auth.js
 * defaults to 30 days and no maxAge is configured), and every agent endpoint
 * kept serving them - including the customer name, phone and full address of
 * every order they still held. Deactivation has to be checked against the
 * database on each request, because that is where it is recorded.
 */
export async function requireActiveAgent(): Promise<(SessionUser & { id: string }) | NextResponse> {
  const guard = await requireApiRole(['AGENT']);
  if (isResponse(guard)) return guard;

  const { prisma } = await import('@/server/prisma');
  const profile = await prisma.agentProfile.findUnique({
    where: { userId: guard.id! },
    select: { status: true },
  });

  if (!profile) return fail('No agent profile for this account', 403);
  if (profile.status === 'INACTIVE') {
    return fail('Your agent account has been deactivated. Please contact your KYG coordinator.', 403);
  }

  return guard as SessionUser & { id: string };
}
