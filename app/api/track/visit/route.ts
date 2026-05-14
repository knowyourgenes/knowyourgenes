import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

// Public endpoint — no auth required. Called by the AttributionBeacon client
// component when a visitor lands on any page carrying UTM params (or via
// /?attr_refresh=1 for testing). Writes a single AttributionVisit row.
//
// Rate-limiting: trivial — we accept one POST per request. If you start
// getting spam, slot in a tiny in-memory or Redis bucket here.

const visitSchema = z.object({
  source: z.string().max(120).nullable().optional(),
  medium: z.string().max(120).nullable().optional(),
  campaign: z.string().max(120).nullable().optional(),
  term: z.string().max(120).nullable().optional(),
  content: z.string().max(120).nullable().optional(),
  referrer: z.string().max(500).nullable().optional(),
  landingPath: z.string().max(500).nullable().optional(),
  sessionId: z.string().max(64).nullable().optional(),
});

function maskIp(raw: string | null): string | null {
  if (!raw) return null;
  const ip = raw.split(',')[0].trim();
  if (!ip) return null;
  // IPv4 — keep first three octets.
  if (ip.includes('.')) {
    const parts = ip.split('.');
    if (parts.length === 4) return `${parts[0]}.${parts[1]}.${parts[2]}.0`;
    return null;
  }
  // IPv6 — keep first /64.
  const parts = ip.split(':');
  if (parts.length >= 4) return parts.slice(0, 4).join(':') + '::/64';
  return null;
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const parsed = visitSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: 'Invalid body' }, { status: 400 });
    }

    // Skip writing a visit if there's no marketing signal at all — would be
    // noise. We only persist visits with at least a source or campaign.
    const hasSignal = !!(parsed.data.source || parsed.data.campaign);
    if (!hasSignal) return NextResponse.json({ ok: true, skipped: true });

    // Best-effort attach to logged-in user if there's a session.
    const session = await auth().catch(() => null);
    const userId = session?.user?.id ?? null;

    const userAgent = req.headers.get('user-agent')?.slice(0, 200) ?? null;
    // Vercel sets x-forwarded-for; behind Cloudflare you'd also use cf-connecting-ip.
    const rawIp = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? null;
    const ipPrefix = maskIp(rawIp);

    await prisma.attributionVisit.create({
      data: {
        sessionId: parsed.data.sessionId ?? null,
        userId,
        source: parsed.data.source ?? null,
        medium: parsed.data.medium ?? null,
        campaign: parsed.data.campaign ?? null,
        term: parsed.data.term ?? null,
        content: parsed.data.content ?? null,
        referrer: parsed.data.referrer ?? null,
        landingPath: parsed.data.landingPath ?? null,
        userAgent,
        ipPrefix,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    // Never let a bad write break the page render — fail soft.
    // eslint-disable-next-line no-console
    console.error('[track/visit] error', err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
