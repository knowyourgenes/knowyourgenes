import NewHomepage from '@/features/home/components/NewHomepage';
import SiteHeader from '@/components/shared/SiteHeader';
import SiteFooter from '@/components/shared/SiteFooter';

// Test harness for the rebuilt, pure-Tailwind homepage. Once verified this can
// replace app/page.tsx.
export default function Page() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader overlay />
      <main className="flex-1">
        <NewHomepage />
      </main>
      <SiteFooter />
    </div>
  );
}
