/**
 * Embedded Sanity Studio at /studio.
 * Studio is a fully client-rendered SPA — NextStudio lives behind a
 * "use client" boundary so it's not evaluated at build time.
 */

import Studio from './Studio';

export const dynamic = 'force-dynamic';
export { metadata, viewport } from 'next-sanity/studio';

export default function StudioPage() {
  return <Studio />;
}
