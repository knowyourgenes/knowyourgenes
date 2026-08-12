import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,

  // This list held temporary 302s for the tests that were dropped with the old
  // fixed-shape renderer (Men's Health, Ancestry, My Wellness). All three have
  // since been rebuilt on the section-array layout under lib/tests/, so the
  // redirects are gone - keeping any of them would shadow its real route.
  // Restore an entry here only if a test page is withdrawn again.
  async redirects() {
    return [];
  },
};

export default nextConfig;
