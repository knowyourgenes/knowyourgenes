import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,

  async redirects() {
    return [
      // Ancestry and My Wellness were removed together with the old fixed-shape
      // test renderer and have not been rebuilt on the section-array layout yet.
      // The homepage, the nav dropdown and the draft homepages still link to
      // them, so send those to the category page instead of 404-ing.
      //
      // TEMPORARY (302, not 301): delete each entry as its test page is rebuilt,
      // so search engines never cache these as permanent moves. Men's Health has
      // been rebuilt (lib/tests/mens-health.ts), so its entry is gone - leaving
      // it would shadow the real route.
      { source: '/categories/wellness/ancestry', destination: '/categories/wellness', permanent: false },
      { source: '/categories/wellness/my-wellness', destination: '/categories/wellness', permanent: false },
    ];
  },
};

export default nextConfig;
