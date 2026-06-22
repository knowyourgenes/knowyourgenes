import { buildLlmsTxt } from '@/lib/llms';

// Regenerate at most hourly; serve stale for a day while revalidating.
export const revalidate = 3600;

export async function GET() {
  const body = await buildLlmsTxt();
  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
