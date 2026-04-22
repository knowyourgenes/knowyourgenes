import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { created, handle, isResponse, ok, requireApiRole } from '@/lib/api';
import { agentCreate } from '@/lib/validators';

export async function GET() {
  return handle(async () => {
    const guard = await requireApiRole(['ADMIN']);
    if (isResponse(guard)) return guard;
    const items = await prisma.user.findMany({
      where: { role: 'AGENT' },
      include: { agentProfile: true },
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
    const data = agentCreate.parse(body);
    const passwordHash = await bcrypt.hash(data.password, 12);
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email.toLowerCase(),
        phone: data.phone.replace(/\D/g, ''),
        passwordHash,
        role: 'AGENT',
        emailVerified: new Date(),
        agentProfile: {
          create: {
            zone: data.zone,
            aadhaarVerified: data.aadhaarVerified,
            policeVerified: data.policeVerified,
            dmltCertUrl: data.dmltCertUrl ?? null,
          },
        },
      },
      include: { agentProfile: true },
    });
    return created(user);
  });
}
