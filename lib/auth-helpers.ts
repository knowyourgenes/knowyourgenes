import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
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
  phone: z
    .string()
    .min(10)
    .max(15)
    .transform((s) => s.replace(/\D/g, '').replace(/^91/, '')),
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

  const existing = await prisma.user.findFirst({
    where: {
      OR: [{ email: normalizedEmail }, { phone: parsed.phone }],
    },
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
      phone: parsed.phone,
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
