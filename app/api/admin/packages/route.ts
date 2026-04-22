import { prisma } from '@/lib/prisma';
import { created, handle, isResponse, ok, requireApiRole } from '@/lib/api';
import { packageCreate } from '@/lib/validators';

export async function GET() {
  return handle(async () => {
    const guard = await requireApiRole(['ADMIN']);
    if (isResponse(guard)) return guard;

    const items = await prisma.package.findMany({
      orderBy: [{ active: 'desc' }, { position: 'asc' }, { createdAt: 'desc' }],
    });
    return ok(items);
  });
}

export async function POST(req: Request) {
  return handle(async () => {
    const guard = await requireApiRole(['ADMIN']);
    if (isResponse(guard)) return guard;

    const body = await req.json();
    const data = packageCreate.parse(body);
    const pkg = await prisma.package.create({ data });
    return created(pkg);
  });
}
