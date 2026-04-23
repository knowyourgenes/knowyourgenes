"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type Item = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
};

export default function DashboardNav({ items }: { items: Item[] }) {
  const pathname = usePathname();

  return (
    <nav className="mx-auto w-full max-w-6xl overflow-x-auto px-4 md:px-6">
      <ul className="-mb-px flex gap-1">
        {items.map((it) => {
          const active = it.exact ? pathname === it.href : pathname.startsWith(it.href);
          const Icon = it.icon;
          return (
            <li key={it.href}>
              <Link
                href={it.href}
                className={cn(
                  "inline-flex items-center gap-2 border-b-2 px-3 py-3 text-sm font-medium transition",
                  active
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {it.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
