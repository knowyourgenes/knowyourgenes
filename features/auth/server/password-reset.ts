import 'server-only';

import { randomBytes, createHash, timingSafeEqual } from 'node:crypto';

import { prisma } from '@/server/prisma';
import { notifyCustomer } from '@/features/notifications';

import { hashPassword } from './auth-helpers';

/**
 * Setting a password on an account that has none, and resetting one that does.
 *
 * WHY THIS EXISTS. Guest checkout creates a User row with no passwordHash, which
 * is correct - minting a session from an email typed into a form would hand any
 * stranger someone else's genetic reports. But it left the buyer permanently
 * locked out: credentials login refuses an account with no hash, registration
 * 409s because the row already exists, and there was no reset route at all. The
 * only fix was a direct database write. Their order, their address and
 * eventually their report sat in an account nobody could open.
 *
 * STORED HASHED, NEVER RAW. The token in the database is a SHA-256 of the one in
 * the link, so a leaked database backup cannot be replayed into account access.
 * The comparison is timing-safe.
 *
 * REUSES NextAuth's `VerificationToken` table rather than adding a model, but
 * namespaces the identifier as `pwset:<email>` so it can never collide with
 * NextAuth's own use of the same table for email sign-in links.
 */

const TTL_HOURS = 2;
const IDENTIFIER_PREFIX = 'pwset:';

function identifierFor(email: string): string {
  return IDENTIFIER_PREFIX + email.trim().toLowerCase();
}

function hashToken(raw: string): string {
  return createHash('sha256').update(raw).digest('hex');
}

/**
 * Issues a token and emails the link.
 *
 * ALWAYS REPORTS THE SAME THING to the caller, whether or not the address is
 * registered. Anything else turns this endpoint into an account-existence
 * oracle - the exact thing /api/checkout takes care to avoid one route over.
 */
export async function requestPasswordSetup(rawEmail: string): Promise<void> {
  const email = rawEmail.trim().toLowerCase();

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, name: true, deletedAt: true },
  });

  // Silent no-op for an unknown or closed account. The caller has already been
  // told the same thing it tells everyone.
  if (!user || user.deletedAt) return;

  const raw = randomBytes(32).toString('base64url');
  const expires = new Date(Date.now() + TTL_HOURS * 60 * 60 * 1000);
  const identifier = identifierFor(email);

  // One live link per address: issuing a new one invalidates any earlier link,
  // so a forwarded old email cannot be used after a fresh request.
  await prisma.$transaction([
    prisma.verificationToken.deleteMany({ where: { identifier } }),
    prisma.verificationToken.create({ data: { identifier, token: hashToken(raw), expires } }),
  ]);

  const base = (process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000').replace(/\/$/, '');
  await notifyCustomer({
    template: 'SET_PASSWORD',
    to: email,
    userId: user.id,
    data: {
      customerName: user.name,
      link: `${base}/set-password?token=${encodeURIComponent(raw)}&email=${encodeURIComponent(email)}`,
      expiresInHours: TTL_HOURS,
    },
  });
}

export type ConsumeResult = { ok: true } | { ok: false; reason: 'invalid' | 'expired' };

/**
 * Verifies a token and sets the password, consuming the token either way it
 * succeeds. A used link is dead; there is no second attempt with the same one.
 */
export async function completePasswordSetup(
  rawEmail: string,
  rawToken: string,
  newPassword: string
): Promise<ConsumeResult> {
  const email = rawEmail.trim().toLowerCase();
  const identifier = identifierFor(email);

  const candidates = await prisma.verificationToken.findMany({ where: { identifier } });
  if (candidates.length === 0) return { ok: false, reason: 'invalid' };

  const presented = Buffer.from(hashToken(rawToken), 'hex');
  const match = candidates.find((c) => {
    const stored = Buffer.from(c.token, 'hex');
    return stored.length === presented.length && timingSafeEqual(stored, presented);
  });

  if (!match) return { ok: false, reason: 'invalid' };

  if (match.expires < new Date()) {
    await prisma.verificationToken.deleteMany({ where: { identifier } });
    return { ok: false, reason: 'expired' };
  }

  const user = await prisma.user.findUnique({ where: { email }, select: { id: true, deletedAt: true } });
  if (!user || user.deletedAt) {
    await prisma.verificationToken.deleteMany({ where: { identifier } });
    return { ok: false, reason: 'invalid' };
  }

  const passwordHash = await hashPassword(newPassword);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      // A working link proves control of the mailbox, which is the same thing an
      // email verification proves - so record it rather than asking twice.
      data: { passwordHash, emailVerified: new Date() },
    }),
    prisma.verificationToken.deleteMany({ where: { identifier } }),
  ]);

  return { ok: true };
}
