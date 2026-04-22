'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
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
  LogOut,
  FlaskConical,
  BadgeCheck,
  Building2,
} from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
};
type NavGroup = { label: string; items: NavItem[] };

const GROUPS: NavGroup[] = [
  {
    label: 'Overview',
    items: [{ href: '/admin', label: 'Dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'COUNSELLOR', 'PARTNER'] }],
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

export default function AppSidebar({ role, name, email }: { role: Role; name: string; email: string }) {
  const pathname = usePathname();

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link href="/admin" />}>
              <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
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
                    const active = pathname === it.href || pathname.startsWith(it.href + '/');
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

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger render={<SidebarMenuButton size="lg" />}>
                <Avatar className="h-8 w-8 rounded-md">
                  <AvatarFallback className="rounded-md bg-primary/10 text-xs text-primary">{initials}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{name}</span>
                  <span className="truncate text-xs text-muted-foreground">{role}</span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="end" className="w-56" sideOffset={8}>
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{name}</p>
                      <p className="text-xs text-muted-foreground">{email}</p>
                    </div>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/login' })}>
                  <LogOut className="h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
