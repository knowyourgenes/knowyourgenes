import { prisma } from '@/lib/prisma';
import { created, handle, isResponse, ok, requireApiRole } from '@/lib/api';
import { labCreate } from '@/lib/validators';

export const dynamic = 'force-dynamic';

export async function GET() {
  return handle(async () => {
    const guard = await requireApiRole(['ADMIN']);
    if (isResponse(guard)) return guard;

    const items = await prisma.lab.findMany({
      orderBy: [{ isDefault: 'desc' }, { active: 'desc' }, { name: 'asc' }],
      select: {
        id: true,
        name: true,
        slug: true,
        addressLine: true,
        city: true,
        state: true,
        pincode: true,
        phone: true,
        contactEmail: true,
        pickupLocationName: true,
        isDefault: true,
        active: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return ok(items);
  });
}

export async function POST(req: Request) {
  return handle(async () => {
    const guard = await requireApiRole(['ADMIN']);
    if (isResponse(guard)) return guard;

    const body = await req.json();
    const data = labCreate.parse(body);

    // If creating a new default, demote any existing default in the same
    // transaction so we never have two defaults. Batched form avoids the
    // interactive-transaction startup timeout under contended pools.
    const lab = data.isDefault
      ? (
          await prisma.$transaction([
            prisma.lab.updateMany({ where: { isDefault: true }, data: { isDefault: false } }),
            prisma.lab.create({ data }),
          ])
        )[1]
      : await prisma.lab.create({ data });
    return created(lab);
  });
}
