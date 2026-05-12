import type { ReactNode } from 'react';

type LegalPageProps = {
  title: string;
  updated: string;
  children: ReactNode;
};

export function LegalPage({ title, updated, children }: LegalPageProps) {
  return (
    <article className="mx-auto w-full max-w-7xl px-4 py-12 md:px-6 md:py-16">
      <header className="mb-10 border-b pb-6">
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: {updated}</p>
      </header>
      <div className="space-y-5 text-[15px] leading-relaxed text-foreground/90 [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-foreground [&_h3]:mt-6 [&_h3]:font-semibold [&_h3]:text-foreground [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-6 [&_a]:underline [&_a]:underline-offset-2 [&_a]:text-foreground hover:[&_a]:text-foreground/70">
        {children}
      </div>
      <footer className="mt-16 border-t pt-6 text-xs text-muted-foreground">
        <p>
          BFG Market Consult Private Limited (operating the KnowYourGenes brand) &middot; CIN U74999DL2010PTC207582
          &middot; SU 18, Pitam Pura, Delhi 110034, India
        </p>
      </footer>
    </article>
  );
}
