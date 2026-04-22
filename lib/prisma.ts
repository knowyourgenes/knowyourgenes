import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createClient() {
  // Defer DATABASE_URL failure until a query is actually made.
  // This lets Next.js build (page data collection) pass without a live DB.
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL ?? 'postgresql://noop',
  });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
