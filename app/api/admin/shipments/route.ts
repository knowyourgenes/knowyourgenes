import { prisma } from '@/lib/prisma';
import { handle, isResponse, ok, requireApiRole } from '@/lib/api';
import { shipmentQuery } from '@/lib/validators';
import type { Prisma } from '@prisma/client';

/**
 * GET /api/admin/shipments
 *   ?orderId=&leg=&status=&awb=&q=&skip=&take=
 *
 * Lists shipments with filters. Used by /admin/shipments and the per-order
 * shipments tab.
 */
export async function GET(req: Request) {
  return handle(async () => {
    const guard = await requireApiRole(['ADMIN']);
    if (isResponse(guard)) return guard;

    const url = new URL(req.url);
    const params = Object.fromEntries(url.searchParams.entries());
    const q = shipmentQuery.parse(params);

    const where: Prisma.ShipmentWhereInput = {};
    if (q.orderId) where.orderId = q.orderId;
    if (q.leg) where.leg = q.leg;
    if (q.status) where.status = q.status;
    if (q.awb) where.awb = q.awb;
    if (q.q) {
      where.OR = [
        { awb: { contains: q.q, mode: 'insensitive' } },
        { refNumber: { contains: q.q, mode: 'insensitive' } },
        { order: { orderNumber: { contains: q.q, mode: 'insensitive' } } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.shipment.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: q.skip,
        take: q.take,
        include: {
          order: {
            select: {
              id: true,
              orderNumber: true,
              status: true,
              fulfillmentMode: true,
              user: { select: { name: true, email: true, phone: true } },
            },
          },
        },
      }),
      prisma.shipment.count({ where }),
    ]);

    return ok({ items, total, skip: q.skip, take: q.take });
  });
}
