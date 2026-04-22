import { prisma } from '@/lib/prisma';
import { handle, isResponse, ok, requireApiRole } from '@/lib/api';
import { orderQuery } from '@/lib/validators';

export async function GET(req: Request) {
  return handle(async () => {
    const guard = await requireApiRole(['ADMIN', 'COUNSELLOR']);
    if (isResponse(guard)) return guard;

    const url = new URL(req.url);
    const parsed = orderQuery.parse(Object.fromEntries(url.searchParams));

    const where = {
      ...(parsed.status ? { status: parsed.status } : {}),
      ...(parsed.agentId ? { agentId: parsed.agentId } : {}),
      ...(parsed.from || parsed.to
        ? {
            slotDate: {
              ...(parsed.from ? { gte: new Date(parsed.from) } : {}),
              ...(parsed.to ? { lte: new Date(parsed.to) } : {}),
            },
          }
        : {}),
      ...(parsed.q
        ? {
            OR: [
              { orderNumber: { contains: parsed.q, mode: 'insensitive' as const } },
              { user: { name: { contains: parsed.q, mode: 'insensitive' as const } } },
              { user: { email: { contains: parsed.q, mode: 'insensitive' as const } } },
            ],
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip: parsed.skip,
        take: parsed.take,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { name: true, email: true, phone: true } },
          package: { select: { name: true } },
          agent: { select: { user: { select: { name: true } } } },
        },
      }),
      prisma.order.count({ where }),
    ]);
    return ok({ items, total });
  });
}
