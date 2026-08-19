import { prisma } from '@/server/prisma';
import { fail, handle, isResponse, ok, requireApiRole } from '@/server/api';
import { addressUpdate } from '@/lib/validators';

const CUSTOMER_ROLES = ['USER', 'ADMIN', 'AGENT', 'COUNSELLOR', 'PARTNER'] as const;

type Ctx = { params: Promise<{ id: string }> };

function normalisePhone(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  return digits.length > 10 ? digits.slice(-10) : digits;
}

/** PATCH /api/addresses/:id - edit one of your own addresses. */
export async function PATCH(req: Request, { params }: Ctx) {
  return handle(async () => {
    const guard = await requireApiRole([...CUSTOMER_ROLES]);
    if (isResponse(guard)) return guard;

    const { id } = await params;
    const existing = await prisma.address.findUnique({ where: { id } });
    // Same response for "not yours" and "not found" - an id probe must not
    // reveal that someone else's address exists.
    if (!existing || existing.userId !== guard.id) return fail('Address not found', 404);

    const input = addressUpdate.parse(await req.json());

    const address = await prisma.$transaction(async (tx) => {
      if (input.isDefault) {
        await tx.address.updateMany({ where: { userId: guard.id }, data: { isDefault: false } });
      }
      return tx.address.update({
        where: { id },
        data: {
          ...input,
          phone: input.phone ? normalisePhone(input.phone) : undefined,
        },
      });
    });

    return ok(address);
  });
}

/**
 * DELETE /api/addresses/:id
 *
 * Refuses if any order still points at it - an order's delivery address is part
 * of its record, and Address.orders has no cascade. Users can add a new address
 * instead.
 */
export async function DELETE(_req: Request, { params }: Ctx) {
  return handle(async () => {
    const guard = await requireApiRole([...CUSTOMER_ROLES]);
    if (isResponse(guard)) return guard;

    const { id } = await params;
    const existing = await prisma.address.findUnique({
      where: { id },
      include: { _count: { select: { orders: true } } },
    });
    if (!existing || existing.userId !== guard.id) return fail('Address not found', 404);
    if (existing._count.orders > 0) {
      return fail('This address is attached to an order and cannot be deleted', 409);
    }

    await prisma.address.delete({ where: { id } });

    // Never leave the user with addresses but no default.
    if (existing.isDefault) {
      const next = await prisma.address.findFirst({
        where: { userId: guard.id },
        orderBy: { createdAt: 'desc' },
      });
      if (next) await prisma.address.update({ where: { id: next.id }, data: { isDefault: true } });
    }

    return ok({ id, deleted: true });
  });
}
