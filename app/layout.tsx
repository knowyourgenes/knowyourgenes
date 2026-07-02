import type { Metadata } from 'next';
import { Geist, Geist_Mono, Figtree, Hind } from 'next/font/google';
import { auth } from '@/features/auth';
import Providers from '@/components/Providers';
import AttributionBeacon from '@/features/attribution/components/AttributionBeacon';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

// KYG warm-modern type system, loaded once here so the shared site chrome
// (and any public page) renders with the right faces in every route group.
const figtree = Figtree({
  variable: '--font-figtree',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const hind = Hind({
  variable: '--font-hind',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Know Your Genes - DNA Tests, At-Home Collection in Delhi NCR',
    template: '%s | Know Your Genes',
  },
  description:
    'Book a DNA test. We come to you. NABL-certified labs, plain-language reports, optional genetic counselling. Delhi NCR only.',
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch session once on the server and seed SessionProvider with it.
  // `auth()` is request-cached, so layouts/pages calling it again are free.
  // Avoids the dev-mode ClientFetchError when /api/auth/session is mid-compile.
  const session = await auth();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${figtree.variable} ${hind.variable} h-full antialiased`}
    >
      <head>
        {/* Material Symbols - subsetted to the 5 "How it works" step glyphs. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&icon_names=biotech,forum,local_shipping,outbox,science&display=block"
        />
      </head>
      <body className="min-h-full flex flex-col bg-white text-slate-900">
        <Providers session={session}>{children}</Providers>
        <AttributionBeacon />
      </body>
    </html>
  );
}
