import { NextResponse } from 'next/server';
import { getOpenApiSpec } from '@/lib/openapi';

export const dynamic = 'force-static';

export function GET() {
  return NextResponse.json(getOpenApiSpec());
}
