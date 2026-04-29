'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ClipboardList, FileText, LayoutDashboard, User as UserIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/dashboard', label: 'Overview', Icon: LayoutDashboard, exact: true },
  { href: '/dashboard/orders', label: 'Orders', Icon: ClipboardList, exact: false },
  { href: '/dashboard/reports', label: 'Reports', Icon: FileText, exact: false },
  { href: '/dashboard/profile', label: 'Profile', Icon: UserIcon, exact: false },
];

export default function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="mx-auto w-full max-w-6xl overflow-x-auto px-4 md:px-6">
      <ul className="-mb-px flex gap-1">
        {NAV.map((it) => {
          const active = it.exact ? pathname === it.href : pathname.startsWith(it.href);
          return (
            <li key={it.href}>
              <Link
                href={it.href}
                className={cn(
                  'inline-flex items-center gap-2 border-b-2 px-3 py-3 text-sm font-medium transition',
                  active
                    ? 'border-primary text-foreground'
                    : 'border-transparent text-muted-foreground hover:border-border hover:text-foreground'
                )}
              >
                <it.Icon className="h-4 w-4" />
                {it.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
