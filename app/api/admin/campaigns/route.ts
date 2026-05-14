import { prisma } from '@/lib/prisma';
import { created, handle, isResponse, ok, requireApiRole } from '@/lib/api';
import { campaignCreate, campaignQuery } from '@/lib/validators';

export async function GET(req: Request) {
  return handle(async () => {
    const guard = await requireApiRole(['ADMIN']);
    if (isResponse(guard)) return guard;

    const url = new URL(req.url);
    const q = campaignQuery.parse(Object.fromEntries(url.searchParams));

    const where: Record<string, unknown> = {};
    if (q.source) where.source = q.source;
    if (typeof q.active === 'boolean') where.active = q.active;
    if (q.q) {
      where.OR = [
        { name: { contains: q.q, mode: 'insensitive' } },
        { slug: { contains: q.q, mode: 'insensitive' } },
        { source: { contains: q.q, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.campaign.findMany({
        where,
        orderBy: [{ active: 'desc' }, { createdAt: 'desc' }],
        skip: q.skip,
        take: q.take,
        include: {
          _count: { select: { orders: true } },
        },
      }),
      prisma.campaign.count({ where }),
    ]);

    return ok({ items, total });
  });
}

export async function POST(req: Request) {
  return handle(async () => {
    const guard = await requireApiRole(['ADMIN']);
    if (isResponse(guard)) return guard;

    const body = await req.json();
    const data = campaignCreate.parse(body);

    // Slug uniqueness is enforced at the DB level; surface a friendlier error.
    const existing = await prisma.campaign.findUnique({ where: { slug: data.slug } });
    if (existing) throw new Error(`A campaign with slug "${data.slug}" already exists`);

    const campaign = await prisma.campaign.create({
      data: {
        ...data,
        createdById: guard.id ?? null,
      },
    });
    return created(campaign);
  });
}
