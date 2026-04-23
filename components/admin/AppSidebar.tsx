'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Role } from '@prisma/client';
import {
  LayoutDashboard,
  Package as PackageIcon,
  Users,
  Stethoscope,
  TruckIcon,
  ClipboardList,
  FileText,
  Ticket,
  MapPin,
  FlaskConical,
  BadgeCheck,
  Building2,
  ExternalLink,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: Role[];
  // Only match on exact path — use when href is a prefix of other items.
  exact?: boolean;
  external?: boolean;
};
type NavGroup = { label: string; items: NavItem[] };

const GROUPS: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'COUNSELLOR', 'PARTNER'] },
    ],
  },
  {
    label: 'Operations',
    items: [
      { href: '/admin/orders', label: 'Orders', icon: ClipboardList, roles: ['ADMIN', 'COUNSELLOR'] },
      { href: '/admin/assigned-orders', label: 'Assigned Orders', icon: ClipboardList, roles: ['PARTNER'] },
      { href: '/admin/reports', label: 'Reports', icon: FileText, roles: ['ADMIN', 'COUNSELLOR', 'PARTNER'] },
      { href: '/admin/review-queue', label: 'Review Queue', icon: BadgeCheck, roles: ['COUNSELLOR'] },
    ],
  },
  {
    label: 'People',
    items: [
      { href: '/admin/users', label: 'Users', icon: Users, roles: ['ADMIN'] },
      { href: '/admin/agents', label: 'Agents', icon: TruckIcon, roles: ['ADMIN'] },
      { href: '/admin/counsellors', label: 'Counsellors', icon: Stethoscope, roles: ['ADMIN'] },
      { href: '/admin/partners', label: 'Lab Partners', icon: Building2, roles: ['ADMIN'] },
    ],
  },
  {
    label: 'Catalog',
    items: [
      { href: '/admin/packages', label: 'Packages', icon: PackageIcon, roles: ['ADMIN'] },
      { href: '/admin/coupons', label: 'Coupons', icon: Ticket, roles: ['ADMIN'] },
    ],
  },
  {
    label: 'Config',
    items: [{ href: '/admin/service-area', label: 'Service Area', icon: MapPin, roles: ['ADMIN'] }],
  },
];

export default function AppSidebar({ role }: { role: Role; name?: string; email?: string }) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link href="/admin/dashboard" />}>
              <div className="flex aspect-square size-8 items-center justify-center rounded bg-primary text-primary-foreground">
                <FlaskConical className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">KYG Admin</span>
                <span className="truncate text-xs text-muted-foreground">Know Your Genes</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {GROUPS.map((group) => {
          const items = group.items.filter((it) => it.roles.includes(role));
          if (items.length === 0) return null;
          return (
            <SidebarGroup key={group.label}>
              <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map((it) => {
                    const active = it.exact
                      ? pathname === it.href
                      : pathname === it.href || pathname.startsWith(it.href + '/');
                    const Icon = it.icon;
                    return (
                      <SidebarMenuItem key={it.href}>
                        <SidebarMenuButton isActive={active} tooltip={it.label} render={<Link href={it.href} />}>
                          <Icon />
                          <span>{it.label}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
      </SidebarContent>

      {/* <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="API docs"
              render={<Link href="/api-docs" target="_blank" rel="noreferrer" />}
            >
              <ExternalLink />
              <span>API docs</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter> */}

      <SidebarRail />
    </Sidebar>
  );
}
