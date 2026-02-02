'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/icons/logo';
import {
  LayoutDashboard,
  Package,
  FlaskConical,
  Settings,
  Shield,
  Map,
  TrendingUp,
  LogOut,
} from 'lucide-react';
import { useUser, useClerk } from '@clerk/nextjs';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/products', label: 'Products', icon: Package },
  { href: '/experiments', label: 'Experiments', icon: FlaskConical },
  { href: '/crisis', label: 'Crisis Mgmt', icon: Shield },
  { href: '/competitor-map', label: 'Competitor Map', icon: Map },
  { href: '/predictions', label: 'Predictions', icon: TrendingUp },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();

  const handleSignOut = async () => {
    await signOut({ redirectUrl: '/' });
  };

  return (
    <Sidebar collapsible="icon" variant="sidebar" side="left">
      <SidebarHeader className="h-16 items-center justify-center p-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Logo className="size-8 text-primary" />
          <span className="font-headline text-xl font-bold text-sidebar-foreground group-data-[collapsible=icon]:hidden">
            PriceWise
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href}>
                <SidebarMenuButton
                  isActive={pathname.startsWith(item.href)}
                  tooltip={item.label}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="flex-col items-start gap-2 p-3">
        <SidebarSeparator />
        {!isLoaded ? (
          <div className="flex w-full items-center gap-2">
            <Skeleton className="size-8 rounded-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : user ? (
          <div className="flex w-full min-w-0 items-center gap-2">
            <Avatar className="size-8">
              <AvatarImage src={user.imageUrl} alt={user.fullName ?? 'User'} />
              <AvatarFallback>{user.firstName?.charAt(0) ?? 'U'}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
              <p className="truncate text-sm font-medium">{user.fullName || user.firstName}</p>
              <p className="truncate text-xs text-sidebar-foreground/70">{user.primaryEmailAddress?.emailAddress}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 shrink-0 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:hidden"
              onClick={handleSignOut}
            >
              <LogOut className="size-4" />
            </Button>
          </div>
        ) : null}
      </SidebarFooter>
    </Sidebar>
  );
}
