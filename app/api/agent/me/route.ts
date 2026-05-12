import { prisma } from '@/lib/prisma';
import { handle, isResponse, ok, requireApiRole } from '@/lib/api';

/**
 * GET /api/agent/me
 *
 * Returns the agent's profile + today's KPIs in a single call. Used to
 * hydrate /agent home and the layout header.
 */
export async function GET() {
  return handle(async () => {
    const guard = await requireApiRole(['AGENT']);
    if (isResponse(guard)) return guard;

    const userId = guard.id!;

    const [profile, availability] = await Promise.all([
      prisma.agentProfile.findUnique({
        where: { userId },
        include: { user: { select: { name: true, email: true, phone: true, image: true } } },
      }),
      prisma.agentAvailability.findMany({ where: { agentId: userId } }),
    ]);
    if (!profile) throw new Error('Agent profile not found — contact admin');

    // Today bounds (server local time — consider a tz lib in production)
    const now = new Date();
    const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);

    const [todayTotal, todayPending, todayDone, upcomingWeek] = await Promise.all([
      prisma.order.count({
        where: { agentId: userId, slotDate: { gte: dayStart, lt: dayEnd } },
      }),
      prisma.order.count({
        where: {
          agentId: userId,
          slotDate: { gte: dayStart, lt: dayEnd },
          status: { in: ['AGENT_ASSIGNED', 'AGENT_EN_ROUTE'] },
        },
      }),
      prisma.order.count({
        where: {
          agentId: userId,
          slotDate: { gte: dayStart, lt: dayEnd },
          status: { in: ['SAMPLE_COLLECTED', 'AT_LAB', 'REPORT_READY'] },
        },
      }),
      prisma.order.findMany({
        where: { agentId: userId, slotDate: { gte: dayStart } },
        orderBy: [{ slotDate: 'asc' }, { slotWindow: 'asc' }],
        take: 10,
        select: {
          id: true,
          orderNumber: true,
          status: true,
          slotDate: true,
          slotWindow: true,
          user: { select: { name: true, phone: true } },
          address: { select: { area: true, pincode: true } },
        },
      }),
    ]);

    return ok({
      profile,
      availability,
      today: { total: todayTotal, pending: todayPending, done: todayDone },
      upcoming: upcomingWeek,
    });
  });
}
