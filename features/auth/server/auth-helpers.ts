import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '@/server/prisma';
import { auth } from '@/features/auth';
import type { Role } from '@prisma/client';

// ---------------------------------------------------------------------------
// Password hashing
// ---------------------------------------------------------------------------

const SALT_ROUNDS = 12;

export async function hashPassword(plain: string) {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

export async function verifyPassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash);
}

// ---------------------------------------------------------------------------
// Registration (email+phone+password)
// ---------------------------------------------------------------------------

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Valid email required'),
  /**
   * OPTIONAL. The sign-up screen (Figma 1078:3000) collects name, email and
   * password only, and User.phone is `String? @unique` so null is a legal
   * state. Guest checkout already creates users with no phone, so phone-less
   * accounts are not new here - requiring one at signup would have made the
   * designed form impossible to submit.
   *
   * An empty string is normalised to undefined so a blank input is "not given"
   * rather than a phone number of "".
   */
  phone: z
    .string()
    .max(15)
    .transform((v) => v.replace(/\D/g, '').replace(/^91/, ''))
    .refine((v) => v === '' || v.length >= 10, 'Enter at least 10 digits')
    .transform((v) => (v === '' ? undefined : v))
    .optional(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[0-9]/, 'Must contain a number'),
});

export type RegisterInput = z.input<typeof registerSchema>;

export async function registerUser(raw: RegisterInput) {
  const parsed = registerSchema.parse(raw);
  const normalizedEmail = parsed.email.toLowerCase();

  // The phone clause is only added when a phone was actually given. Passing
  // `{ phone: undefined }` inside an OR makes Prisma drop the condition, which
  // would silently turn this into an email-only check - harmless today, but the
  // kind of thing that looks deliberate later and is not.
  const or: { email?: string; phone?: string }[] = [{ email: normalizedEmail }];
  if (parsed.phone) or.push({ phone: parsed.phone });

  const existing = await prisma.user.findFirst({
    where: { OR: or },
    select: { id: true, email: true, phone: true },
  });

  if (existing) {
    if (existing.email === normalizedEmail) {
      throw new Error('An account with this email already exists');
    }
    throw new Error('An account with this phone number already exists');
  }

  const passwordHash = await hashPassword(parsed.password);

  return prisma.user.create({
    data: {
      name: parsed.name,
      email: normalizedEmail,
      phone: parsed.phone ?? null,
      passwordHash,
      role: 'USER',
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
    },
  });
}

// ---------------------------------------------------------------------------
// Server-side helpers for route handlers & server components
// ---------------------------------------------------------------------------

export async function getCurrentUser() {
  const session = await auth();
  return session?.user ?? null;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) throw new Error('UNAUTHORIZED');
  return user;
}

export async function requireRole(allowed: Role[]) {
  const user = await requireAuth();
  if (!allowed.includes(user.role)) throw new Error('FORBIDDEN');
  return user;
}
