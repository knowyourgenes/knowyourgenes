import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { created, handle, isResponse, ok, requireApiRole } from '@/lib/api';
import { counsellorCreate } from '@/lib/validators';

export async function GET() {
  return handle(async () => {
    const guard = await requireApiRole(['ADMIN']);
    if (isResponse(guard)) return guard;
    const items = await prisma.user.findMany({
      where: { role: 'COUNSELLOR' },
      include: { counsellorProfile: true },
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
    const data = counsellorCreate.parse(body);
    const passwordHash = await bcrypt.hash(data.password, 12);
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email.toLowerCase(),
        phone: data.phone.replace(/\D/g, ''),
        passwordHash,
        role: 'COUNSELLOR',
        emailVerified: new Date(),
        counsellorProfile: {
          create: {
            credentials: data.credentials,
            specialty: data.specialty,
            languages: data.languages,
            experience: data.experience,
            photoUrl: data.photoUrl ?? null,
            bio: data.bio ?? null,
          },
        },
      },
      include: { counsellorProfile: true },
    });
    return created(user);
  });
}
