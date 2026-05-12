import { prisma } from '@/lib/prisma';
import { created, handle, isResponse, ok, requireApiRole } from '@/lib/api';
import { labCreate } from '@/lib/validators';

export async function GET() {
  return handle(async () => {
    const guard = await requireApiRole(['ADMIN']);
    if (isResponse(guard)) return guard;

    const items = await prisma.lab.findMany({
      orderBy: [{ isDefault: 'desc' }, { active: 'desc' }, { name: 'asc' }],
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
    // transaction so we never have two defaults.
    const lab = await prisma.$transaction(async (tx) => {
      if (data.isDefault) {
        await tx.lab.updateMany({ where: { isDefault: true }, data: { isDefault: false } });
      }
      return tx.lab.create({ data });
    });
    return created(lab);
  });
}
