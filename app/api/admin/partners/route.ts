import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { created, handle, isResponse, ok, requireApiRole } from '@/lib/api';
import { partnerCreate } from '@/lib/validators';

export async function GET() {
  return handle(async () => {
    const guard = await requireApiRole(['ADMIN']);
    if (isResponse(guard)) return guard;
    const items = await prisma.user.findMany({
      where: { role: 'PARTNER' },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
        labPartnerProfile: {
          select: {
            labName: true,
            accreditation: true,
            contactEmail: true,
            contactPhone: true,
            addressLine: true,
            city: true,
            pincode: true,
            active: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
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
    const passwordHash = await bcrypt.hash(data.password, 12);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email.toLowerCase(),
        phone: data.phone.replace(/\D/g, ''),
        passwordHash,
        role: 'PARTNER',
        emailVerified: new Date(),
        labPartnerProfile: {
          create: {
            labName: data.labName,
            accreditation: data.accreditation,
            contactEmail: data.contactEmail,
            contactPhone: data.contactPhone,
            addressLine: data.addressLine,
            city: data.city,
            pincode: data.pincode,
          },
        },
      },
      include: { labPartnerProfile: true },
    });
    return created(user);
  });
}
