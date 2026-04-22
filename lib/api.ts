import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import type { Session } from 'next-auth';
import { auth } from '@/auth';
import type { Role } from '@prisma/client';

// ---------------------------------------------------------------------------
// Response helpers — consistent JSON shape across every admin endpoint.
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
    if (err instanceof Error) return fail(err.message, 400);
    return fail('Unknown error', 500);
  }
}
