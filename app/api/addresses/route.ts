import { prisma } from '@/server/prisma';
import { normalisePhone } from '@/lib/utils';
import { created, handle, isResponse, ok, requireApiRole } from '@/server/api';
import { addressCreate } from '@/lib/validators';

const CUSTOMER_ROLES = ['USER', 'ADMIN', 'AGENT', 'COUNSELLOR', 'PARTNER'] as const;

/** GET /api/addresses - the signed-in user's saved addresses, default first. */
export async function GET() {
  return handle(async () => {
    const guard = await requireApiRole([...CUSTOMER_ROLES]);
    if (isResponse(guard)) return guard;

    return ok(
      await prisma.address.findMany({
        where: { userId: guard.id },
        orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
      })
    );
  });
}

/**
 * POST /api/addresses - save a delivery address.
 *
 * The first address a user ever saves becomes their default automatically,
 * otherwise checkout would open with nothing selected.
 */
export async function POST(req: Request) {
  return handle(async () => {
    const guard = await requireApiRole([...CUSTOMER_ROLES]);
    if (isResponse(guard)) return guard;

    const input = addressCreate.parse(await req.json());
    const existingCount = await prisma.address.count({ where: { userId: guard.id } });
    const makeDefault = input.isDefault ?? existingCount === 0;

    const address = await prisma.$transaction(async (tx) => {
      if (makeDefault) {
        await tx.address.updateMany({ where: { userId: guard.id }, data: { isDefault: false } });
      }
      return tx.address.create({
        data: {
          userId: guard.id,
          fullName: input.fullName,
          phone: normalisePhone(input.phone),
          line1: input.line1,
          line2: input.line2 ?? null,
          area: input.area,
          city: input.city,
          pincode: input.pincode,
          landmark: input.landmark ?? null,
          isDefault: makeDefault,
        },
      });
    });

    return created(address);
  });
}
