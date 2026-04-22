import { NextResponse } from 'next/server';
import { registerUser } from '@/lib/auth-helpers';
import { ZodError } from 'zod';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const user = await registerUser(body);
    return NextResponse.json({ user }, { status: 201 });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json({ error: 'Validation failed', issues: err.issues }, { status: 400 });
    }
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
