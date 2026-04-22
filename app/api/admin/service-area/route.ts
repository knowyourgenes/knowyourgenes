import { prisma } from '@/lib/prisma';
import { created, handle, isResponse, ok, requireApiRole } from '@/lib/api';
import { serviceAreaCreate, serviceAreaBulk } from '@/lib/validators';

export async function GET() {
  return handle(async () => {
    const guard = await requireApiRole(['ADMIN']);
    if (isResponse(guard)) return guard;
    const items = await prisma.serviceArea.findMany({ orderBy: [{ city: 'asc' }, { pincode: 'asc' }] });
    return ok(items);
  });
}

export async function POST(req: Request) {
  return handle(async () => {
    const guard = await requireApiRole(['ADMIN']);
    if (isResponse(guard)) return guard;
    const body = await req.json();

    // Bulk upsert support: { pincodes: [{pincode, area, city}, ...] }
    if (Array.isArray(body?.pincodes)) {
      const { pincodes } = serviceAreaBulk.parse(body);
      const results = await prisma.$transaction(
        pincodes.map((p) =>
          prisma.serviceArea.upsert({
            where: { pincode: p.pincode },
            update: { area: p.area, city: p.city, active: p.active ?? true },
            create: p,
          })
        )
      );
      return created({ inserted: results.length });
    }

    // Single create
    const data = serviceAreaCreate.parse(body);
    const area = await prisma.serviceArea.create({ data });
    return created(area);
  });
}
