import { prisma } from '@/server/prisma';
import { handle, isResponse, ok, requireApiRole } from '@/server/api';
import { campaignUpdate } from '@/lib/validators';

type Params = Promise<{ id: string }>;

export async function GET(_req: Request, { params }: { params: Params }) {
  return handle(async () => {
    const guard = await requireApiRole(['ADMIN']);
    if (isResponse(guard)) return guard;
    const { id } = await params;

    const campaign = await prisma.campaign.findUnique({
      where: { id },
      include: {
        _count: { select: { orders: true } },
      },
    });
    if (!campaign) throw new Error('Campaign not found');

    // Aggregate quick-look attribution stats for this campaign - orders and
    // revenue from non-cancelled non-refunded orders.
    const stats = await prisma.order.aggregate({
      where: {
        campaignId: id,
      // REVENUE IS MONEY THAT ARRIVED. Filtering on status alone counted every
      // booked-but-never-paid order as revenue - and an unpaid backlog is this
      // system's normal state, because the order row is written before the
      // Razorpay modal even opens. Worse, those abandoned checkouts carry the
      // UTM tags of whatever campaign brought them, so marketing spend was being
      // judged against money nobody ever sent. The admin dashboard already gets
      // this right; these two surfaces did not.
        paidAt: { not: null },
        status: { notIn: ['CANCELLED', 'REFUNDED'] },
      },
      _count: { _all: true },
      _sum: { total: true },
    });

    return ok({
      campaign,
      stats: {
        orders: stats._count._all,
        revenue: stats._sum.total ?? 0,
      },
    });
  });
}

export async function PATCH(req: Request, { params }: { params: Params }) {
  return handle(async () => {
    const guard = await requireApiRole(['ADMIN']);
    if (isResponse(guard)) return guard;
    const { id } = await params;
    const body = await req.json();
    const data = campaignUpdate.parse(body);

    // If the slug is being changed, guard against collision.
    if (data.slug) {
      const collide = await prisma.campaign.findFirst({
        where: { slug: data.slug, NOT: { id } },
        select: { id: true },
      });
      if (collide) throw new Error(`A campaign with slug "${data.slug}" already exists`);
    }

    const campaign = await prisma.campaign.update({ where: { id }, data });
    return ok(campaign);
  });
}

// DELETE: soft-delete (active=false). KYG policy - never hard-delete data
// that has Orders attributed to it, otherwise historical attribution breaks.
export async function DELETE(_req: Request, { params }: { params: Params }) {
  return handle(async () => {
    const guard = await requireApiRole(['ADMIN']);
    if (isResponse(guard)) return guard;
    const { id } = await params;
    const campaign = await prisma.campaign.update({
      where: { id },
      data: { active: false },
    });
    return ok(campaign);
  });
}
