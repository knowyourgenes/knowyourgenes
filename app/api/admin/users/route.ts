import { prisma } from '@/lib/prisma';
import { handle, isResponse, ok, requireApiRole } from '@/lib/api';

export async function GET(req: Request) {
  return handle(async () => {
    const guard = await requireApiRole(['ADMIN']);
    if (isResponse(guard)) return guard;

    const url = new URL(req.url);
    const q = url.searchParams.get('q') ?? '';
    const role = url.searchParams.get('role') ?? undefined;
    const skip = Number(url.searchParams.get('skip') ?? 0);
    const take = Math.min(Number(url.searchParams.get('take') ?? 25), 100);

    const where = {
      ...(role ? { role: role as any } : {}),
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: 'insensitive' as const } },
              { email: { contains: q, mode: 'insensitive' as const } },
              { phone: { contains: q } },
            ],
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          createdAt: true,
          emailVerified: true,
          _count: { select: { orders: true } },
        },
      }),
      prisma.user.count({ where }),
    ]);
    return ok({ items, total });
  });
}
