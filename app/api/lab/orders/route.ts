import type { Prisma } from '@prisma/client';

import { prisma } from '@/server/prisma';
import { handle, isResponse, ok, requireApiRole } from '@/server/api';
import { orderScopeFor } from '@/features/lab/server/lab-scope';

/**
 * GET /api/lab/orders
 *
 * The work queue for a lab operator: the orders routed to their own lab, with
 * the detail they need to process a sample and nothing else.
 *
 * A SEPARATE ROUTE FROM /api/admin/orders, not a widened one. That route serves
 * the internal panel and returns every order with the full customer record; the
 * moment it also has to serve an outside company, one forgotten `where` clause
 * is a data breach rather than a bug. Two routes with two audiences keeps the
 * scoping impossible to omit - here it is applied before the query is built.
 *
 * ADMIN and COUNSELLOR may call this too, unscoped, so an operator can see
 * exactly what a lab sees when a lab says something is missing.
 */
export async function GET(req: Request) {
  return handle(async () => {
    const guard = await requireApiRole(['PARTNER', 'ADMIN', 'COUNSELLOR']);
    if (isResponse(guard)) return guard;

    const scope = await orderScopeFor(guard.role, guard.id!);

    const url = new URL(req.url);
    const q = (url.searchParams.get('q') ?? '').trim();
    const status = url.searchParams.get('status');
    const take = Math.min(Number(url.searchParams.get('take') ?? 50), 100);
    const skip = Number(url.searchParams.get('skip') ?? 0);

    const where: Prisma.OrderWhereInput = {
      // Unpaid orders are not work. They are also not the lab's business - an
      // abandoned checkout should never appear in an outside company's queue.
      paidAt: { not: null },
      ...(scope ? { labId: { in: scope.labIds } } : { labId: { not: null } }),
      ...(status && status !== 'ALL' ? { status: status as Prisma.EnumOrderStatusFilter } : {}),
      ...(q
        ? {
            OR: [
              { orderNumber: { contains: q, mode: 'insensitive' } },
              { user: { name: { contains: q, mode: 'insensitive' } } },
            ],
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: { paidAt: 'desc' },
        skip,
        take,
        select: {
          id: true,
          orderNumber: true,
          status: true,
          paidAt: true,
          slotDate: true,
          slotWindow: true,
          fulfillmentMode: true,
          // WHAT THE LAB GETS OF THE CUSTOMER: a name to put on the sample and a
          // delivery address, because they post the kit. Not the email, not the
          // account, not what was paid - none of which help them run an assay.
          user: { select: { name: true } },
          address: {
            select: {
              fullName: true,
              phone: true,
              line1: true,
              line2: true,
              area: true,
              city: true,
              pincode: true,
            },
          },
          items: { select: { nameSnapshot: true, slugSnapshot: true } },
          lab: { select: { id: true, name: true } },
          // So the queue can show what still needs a report, and what is waiting
          // on KYG rather than on them.
          report: {
            select: { id: true, reportNumber: true, createdAt: true, deliveredAt: true },
          },
        },
      }),
      prisma.order.count({ where }),
    ]);

    return ok({ items, total, scoped: scope !== null });
  });
}
