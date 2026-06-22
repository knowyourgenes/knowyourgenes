import { prisma } from '@/server/prisma';
import { created, handle, isResponse, ok, requireApiRole } from '@/server/api';
import { partnerCreate } from '@/lib/validators';

export const dynamic = 'force-dynamic';

export async function GET() {
  return handle(async () => {
    const guard = await requireApiRole(['ADMIN']);
    if (isResponse(guard)) return guard;
    const items = await prisma.labPartner.findMany({
      orderBy: [{ active: 'desc' }, { name: 'asc' }],
      include: {
        locations: {
          select: { id: true, slug: true, name: true, city: true, active: true },
        },
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
    const data = partnerCreate.parse(body);
    const partner = await prisma.labPartner.create({ data });
    return created(partner);
  });
}
