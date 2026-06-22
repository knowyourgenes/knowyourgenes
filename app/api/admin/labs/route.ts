import bcrypt from 'bcryptjs';
import { prisma } from '@/server/prisma';
import { created, handle, isResponse, ok, requireApiRole } from '@/server/api';
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
        partnerId: true,
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
        userId: true,
        createdAt: true,
        updatedAt: true,
        partner: { select: { id: true, slug: true, name: true } },
        user: { select: { id: true, email: true, name: true } },
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

    // Optional per-lab login. When provided, create a PARTNER user first and
    // attach it via Lab.userId.
    let userId: string | undefined;
    if (data.login) {
      const passwordHash = await bcrypt.hash(data.login.password, 12);
      const user = await prisma.user.create({
        data: {
          name: data.login.name ?? `${data.name} Lab`,
          email: data.login.email.toLowerCase(),
          passwordHash,
          role: 'PARTNER',
          emailVerified: new Date(),
        },
      });
      userId = user.id;
    }

    const createData = {
      partnerId: data.partnerId,
      name: data.name,
      slug: data.slug,
      addressLine: data.addressLine,
      city: data.city,
      state: data.state,
      pincode: data.pincode,
      phone: data.phone,
      contactEmail: data.contactEmail,
      pickupLocationName: data.pickupLocationName,
      isDefault: data.isDefault,
      active: data.active,
      userId,
    };

    const lab = data.isDefault
      ? (
          await prisma.$transaction([
            prisma.lab.updateMany({ where: { isDefault: true }, data: { isDefault: false } }),
            prisma.lab.create({ data: createData }),
          ])
        )[1]
      : await prisma.lab.create({ data: createData });
    return created(lab);
  });
}
