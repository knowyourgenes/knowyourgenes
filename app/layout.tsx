import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Providers from '@/components/Providers';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'Know Your Genes — DNA Tests, At-Home Collection in Delhi NCR',
    template: '%s | Know Your Genes',
  },
  description:
    'Book a DNA test. We come to you. NABL-certified labs, plain-language reports, optional genetic counselling. Delhi NCR only.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-slate-900">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
