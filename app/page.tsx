import Link from 'next/link';
import { FlaskConical, ArrowRight } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function HomePage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-16">
      {/* subtle bg gradient */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,var(--color-brand-soft),transparent_70%)]"
      />
      <div className="mx-auto w-full max-w-3xl text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
          <FlaskConical className="h-7 w-7" />
        </div>

        <Badge variant="secondary" className="mb-4">
          Launching 14 May 2026 · Delhi NCR
        </Badge>

        <h1 className="text-balance text-5xl font-semibold tracking-tight sm:text-6xl">Know Your Genes</h1>
        <p className="mx-auto mt-4 max-w-xl text-balance text-lg text-muted-foreground">
          DNA testing, simplified. A trained phlebotomist visits your home, collects the sample, and your plain-English
          report arrives in 7–14 days.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link href="/login" className={buttonVariants({ size: 'lg' })}>
            Sign in <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="/studio"
            target="_blank"
            rel="noreferrer"
            className={buttonVariants({ size: 'lg', variant: 'outline' })}
          >
            Sanity Studio
          </a>
          <a
            href="/api-docs"
            target="_blank"
            rel="noreferrer"
            className={buttonVariants({ size: 'lg', variant: 'outline' })}
          >
            API docs
          </a>
        </div>

        <p className="mt-12 text-xs text-muted-foreground">
          Backend sprint in progress — consumer frontend ships from May 1 per the dev calendar.
        </p>
      </div>
    </main>
  );
}
