import 'server-only';

import { prisma } from '@/server/prisma';
import { ApiError } from '@/server/api';

/**
 * Which orders a lab operator is allowed to see.
 *
 * THE WHOLE SECURITY MODEL OF THE LAB DASHBOARD IS THIS FILE. A PARTNER login is
 * a third party - an outside company with its own staff - and the orders it must
 * never see are other customers' genetic tests. Role alone does not answer that
 * question: every lab operator has the same role, so a check that stops at
 * `requireApiRole(['PARTNER'])` admits every lab to every order.
 *
 * The chain is User.id -> Lab.userId -> Order.labId. It has to be resolved
 * against the database on each request rather than read off the session, because
 * the session is a JWT: a lab deactivated an hour ago still carries a valid
 * token saying PARTNER.
 *
 * The same shape already guards report downloads
 * (app/api/admin/reports/[id]/download/route.ts) - this lifts it out so the
 * second and third caller cannot drift from the first.
 */

/** The lab ids this user operates. Empty when they operate none. */
export async function labIdsFor(userId: string): Promise<string[]> {
  const labs = await prisma.lab.findMany({
    where: { userId, active: true },
    select: { id: true },
  });
  return labs.map((l) => l.id);
}

/**
 * The lab ids to scope a query by, or `null` meaning "no scope - see everything".
 *
 * ADMIN and COUNSELLOR are internal and see every order; that is what the admin
 * panel is. PARTNER is scoped. Returning null rather than "all ids" matters: a
 * caller that forgets to handle it gets a Prisma error, not a silent unfiltered
 * read.
 */
export async function orderScopeFor(role: string, userId: string): Promise<{ labIds: string[] } | null> {
  if (role === 'ADMIN' || role === 'COUNSELLOR') return null;

  if (role === 'PARTNER') {
    const labIds = await labIdsFor(userId);
    if (labIds.length === 0) {
      throw new ApiError('No active lab is linked to this account. Contact KYG.', 403);
    }
    return { labIds };
  }

  throw new ApiError('Forbidden', 403);
}

/**
 * Loads an order and refuses it unless this user may act on it.
 *
 * 404 rather than 403 on a lab that does not own the order, deliberately: a 403
 * confirms the order exists, which lets someone walk ids and learn how many
 * orders a competitor lab is processing.
 */
export async function requireOrderInScope(
  role: string,
  userId: string,
  orderId: string
): Promise<{ id: string; orderNumber: string; labId: string | null; status: string }> {
  const scope = await orderScopeFor(role, userId);

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { id: true, orderNumber: true, labId: true, status: true },
  });
  if (!order) throw new ApiError('Order not found', 404);

  if (scope && (!order.labId || !scope.labIds.includes(order.labId))) {
    throw new ApiError('Order not found', 404);
  }

  return order;
}
