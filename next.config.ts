import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,

  async redirects() {
    return [
      // Men's Health, Ancestry and My Wellness were removed together with the
      // old fixed-shape test renderer; only Women's Health has been rebuilt on
      // the section-array layout so far. The homepage, the nav dropdown and the
      // draft homepages still link to all three, so send those to the category
      // page instead of 404-ing.
      //
      // TEMPORARY (302, not 301): delete each entry as its test page is rebuilt,
      // so search engines never cache these as permanent moves.
      { source: '/categories/wellness/mens-health', destination: '/categories/wellness', permanent: false },
      { source: '/categories/wellness/ancestry', destination: '/categories/wellness', permanent: false },
      { source: '/categories/wellness/my-wellness', destination: '/categories/wellness', permanent: false },
    ];
  },
};

export default nextConfig;
