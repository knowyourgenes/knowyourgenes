import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import authConfig from '@/auth.config';

// Login accepts EITHER email OR phone in the "identifier" field + password.
const credentialsSchema = z.object({
  identifier: z.string().min(1, 'Email or phone is required'),
  password: z.string().min(1, 'Password is required'),
});

const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
const normalizePhone = (s: string) => s.replace(/\D/g, '').replace(/^91/, '');

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  callbacks: {
    ...authConfig.callbacks,
    // Block deactivated users from signing in via any provider (Google included).
    // Credentials provider already checks deletedAt inside authorize(); this
    // covers OAuth sign-ins where authorize isn't called.
    async signIn({ user }) {
      if (!user?.id) return true; // new OAuth user being created - let adapter proceed
      const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: { deletedAt: true },
      });
      if (dbUser?.deletedAt) return false;
      return true;
    },
  },
  providers: [
    ...authConfig.providers,
    Credentials({
      credentials: {
        identifier: { label: 'Email or phone', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(raw) {
        const parsed = credentialsSchema.safeParse(raw);
        if (!parsed.success) return null;

        const { identifier, password } = parsed.data;

        const user = await prisma.user.findFirst({
          where: isEmail(identifier) ? { email: identifier.toLowerCase() } : { phone: normalizePhone(identifier) },
        });

        if (!user || !user.passwordHash) return null;

        // Deactivated accounts (deletedAt set) cannot sign in.
        if (user.deletedAt) return null;

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
          phone: user.phone,
        };
      },
    }),
  ],
  events: {
    async createUser({ user }) {
      // When a new user is created via Google OAuth, NextAuth/adapter creates
      // a row with default role=USER (via Prisma default). No extra work needed here.
      // This hook is a placeholder for side effects: send welcome email, etc.
      void user;
    },
  },
});
