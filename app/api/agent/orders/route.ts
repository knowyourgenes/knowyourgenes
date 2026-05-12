import { prisma } from '@/lib/prisma';
import { handle, isResponse, ok, requireApiRole } from '@/lib/api';
import type { Prisma } from '@prisma/client';

/**
 * GET /api/agent/orders
 *   ?status=PENDING|EN_ROUTE|COLLECTED|AT_LAB|ALL
 *   &date=YYYY-MM-DD     (optional — defaults to today)
 *
 * Returns orders assigned to the calling agent. The "tabs" are convenience
 * groupings that map to multiple OrderStatus values:
 *   PENDING   -> AGENT_ASSIGNED
 *   EN_ROUTE  -> AGENT_EN_ROUTE
 *   COLLECTED -> SAMPLE_COLLECTED
 *   AT_LAB    -> AT_LAB, REPORT_READY
 */
const TAB_MAP: Record<
  string,
  ('AGENT_ASSIGNED' | 'AGENT_EN_ROUTE' | 'SAMPLE_COLLECTED' | 'AT_LAB' | 'REPORT_READY')[]
> = {
  PENDING: ['AGENT_ASSIGNED'],
  EN_ROUTE: ['AGENT_EN_ROUTE'],
  COLLECTED: ['SAMPLE_COLLECTED'],
  AT_LAB: ['AT_LAB', 'REPORT_READY'],
};

export async function GET(req: Request) {
  return handle(async () => {
    const guard = await requireApiRole(['AGENT']);
    if (isResponse(guard)) return guard;

    const url = new URL(req.url);
    const tab = url.searchParams.get('status') ?? 'ALL';
    const dateStr = url.searchParams.get('date');

    const where: Prisma.OrderWhereInput = { agentId: guard.id! };
    if (tab in TAB_MAP) where.status = { in: TAB_MAP[tab] };

    if (dateStr) {
      const d = new Date(dateStr);
      if (!isNaN(d.getTime())) {
        const start = new Date(d.getFullYear(), d.getMonth(), d.getDate());
        const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
        where.slotDate = { gte: start, lt: end };
      }
    }

    const orders = await prisma.order.findMany({
      where,
      orderBy: [{ slotDate: 'asc' }, { slotWindow: 'asc' }],
      include: {
        user: { select: { name: true, phone: true, email: true } },
        address: true,
        package: { select: { name: true, sampleType: true } },
      },
      take: 100,
    });
    return ok(orders);
  });
}
