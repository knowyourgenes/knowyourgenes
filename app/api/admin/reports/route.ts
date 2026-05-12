import { prisma } from '@/lib/prisma';
import { handle, isResponse, ok, requireApiRole } from '@/lib/api';
import type { Prisma } from '@prisma/client';

/**
 * GET /api/admin/reports
 *   ?q=&orderId=&userId=&delivered=true|false&take=&skip=
 */
export async function GET(req: Request) {
  return handle(async () => {
    const guard = await requireApiRole(['ADMIN', 'COUNSELLOR']);
    if (isResponse(guard)) return guard;

    const url = new URL(req.url);
    const q = url.searchParams.get('q') ?? '';
    const orderId = url.searchParams.get('orderId');
    const userId = url.searchParams.get('userId');
    const delivered = url.searchParams.get('delivered');
    const take = Math.min(Number(url.searchParams.get('take') ?? 50), 100);
    const skip = Number(url.searchParams.get('skip') ?? 0);

    const where: Prisma.ReportWhereInput = {};
    if (orderId) where.orderId = orderId;
    if (userId) where.userId = userId;
    if (delivered === 'true') where.deliveredAt = { not: null };
    if (delivered === 'false') where.deliveredAt = null;
    if (q) {
      where.OR = [
        { reportNumber: { contains: q, mode: 'insensitive' } },
        { packageName: { contains: q, mode: 'insensitive' } },
        { order: { orderNumber: { contains: q, mode: 'insensitive' } } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.report.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take,
        include: {
          order: { select: { orderNumber: true, status: true } },
          user: { select: { name: true, email: true, phone: true } },
        },
      }),
      prisma.report.count({ where }),
    ]);

    return ok({ items, total, skip, take });
  });
}
