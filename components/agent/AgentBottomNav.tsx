'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ClipboardList, Calendar, User } from 'lucide-react';

const ITEMS = [
  { href: '/agent', label: 'Today', icon: Home, exact: true },
  { href: '/agent/collections', label: 'Jobs', icon: ClipboardList },
  { href: '/agent/schedule', label: 'Schedule', icon: Calendar },
  { href: '/agent/profile', label: 'Profile', icon: User },
];

export default function AgentBottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 inset-x-0 z-30 border-t bg-background">
      <ul className="grid grid-cols-4 max-w-2xl mx-auto">
        {ITEMS.map((it) => {
          const active = it.exact ? pathname === it.href : pathname === it.href || pathname.startsWith(it.href + '/');
          const Icon = it.icon;
          return (
            <li key={it.href}>
              <Link
                href={it.href}
                className={`flex flex-col items-center justify-center gap-0.5 py-2 text-[11px] ${
                  active ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{it.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
