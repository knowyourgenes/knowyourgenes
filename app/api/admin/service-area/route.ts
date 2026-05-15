import type { Prisma } from '@prisma/client';

import { prisma } from '@/lib/prisma';
import { created, handle, isResponse, ok, requireApiRole } from '@/lib/api';
import { serviceAreaBulk, serviceAreaCreate, serviceAreaQuery } from '@/lib/validators';

// GET /api/admin/service-area?q=&state=&district=&active=true&skip=0&take=100
// Returns { items, total }.
export async function GET(req: Request) {
  return handle(async () => {
    const guard = await requireApiRole(['ADMIN']);
    if (isResponse(guard)) return guard;

    const url = new URL(req.url);
    const params = serviceAreaQuery.parse(Object.fromEntries(url.searchParams));

    const where: Prisma.ServiceAreaWhereInput = {};
    if (params.q) {
      // Pincodes are digits-only; an alphabetic query like "delhi" can never
      // match the pincode column, so don't include that branch in the OR —
      // it forces the planner to consider a third index that returns 0 rows.
      // Area / district searches go through the pg_trgm GIN indexes.
      const hasDigits = /\d/.test(params.q);
      const isPincodePrefix = /^\d{1,6}$/.test(params.q);
      const branches: Prisma.ServiceAreaWhereInput[] = [];
      if (hasDigits) {
        // For all-digit queries do a fast prefix match (uses the pincode
        // btree index). For mixed-content queries fall back to contains.
        branches.push(
          isPincodePrefix ? { pincode: { startsWith: params.q } } : { pincode: { contains: params.q } }
        );
      }
      // Only do the expensive ILIKE branches when the query has at least one
      // alphabetic character.
      const hasAlpha = /[a-zA-Z]/.test(params.q);
      if (hasAlpha) {
        branches.push(
          { area: { contains: params.q, mode: 'insensitive' } },
          { district: { contains: params.q, mode: 'insensitive' } }
        );
      }
      if (branches.length > 0) where.OR = branches;
    }
    if (params.state) where.state = params.state;
    if (params.district) where.district = params.district;
    if (params.active !== undefined) where.active = params.active;

    const [items, total] = await Promise.all([
      prisma.serviceArea.findMany({
        where,
        orderBy: [{ state: 'asc' }, { district: 'asc' }, { pincode: 'asc' }],
        skip: params.skip,
        take: params.take,
      }),
      prisma.serviceArea.count({ where }),
    ]);

    return ok({ items, total });
  });
}

export async function POST(req: Request) {
  return handle(async () => {
    const guard = await requireApiRole(['ADMIN']);
    if (isResponse(guard)) return guard;
    const body = await req.json();

    // Bulk upsert: { pincodes: [{pincode, area, district?, state?, city?}, ...] }
    // Composite-keyed on (pincode, area) — same pincode with different areas
    // becomes separate rows.
    if (Array.isArray(body?.pincodes)) {
      const { pincodes } = serviceAreaBulk.parse(body);
      const results = await prisma.$transaction(
        pincodes.map((p) =>
          prisma.serviceArea.upsert({
            where: { pincode_area: { pincode: p.pincode, area: p.area } },
            update: {
              district: p.district ?? '',
              state: p.state ?? '',
              city: p.city ?? p.district ?? '',
              active: p.active,
            },
            create: {
              pincode: p.pincode,
              area: p.area,
              district: p.district ?? '',
              state: p.state ?? '',
              city: p.city ?? p.district ?? '',
              active: p.active,
            },
          })
        )
      );
      return created({ inserted: results.length });
    }

    // Single create
    const data = serviceAreaCreate.parse(body);
    const row = await prisma.serviceArea.create({
      data: {
        pincode: data.pincode,
        area: data.area,
        district: data.district,
        state: data.state,
        city: data.city || data.district,
        active: data.active,
      },
    });
    return created(row);
  });
}
