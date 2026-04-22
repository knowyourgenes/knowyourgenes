// Studio has its own full-screen layout — override the root layout's container.

export const dynamic = 'force-dynamic';

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return children;
}
