'use client';

import { SidebarLayout } from '@repo/ui/sidebar-layout';
import { Sidebar, SidebarBody, SidebarHeader, SidebarSection, SidebarItem } from '@repo/ui/sidebar';
import { Navbar, NavbarItem } from '@repo/ui/navbar';
import {
  HomeIcon,
  CpuChipIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ClockIcon,
  BeakerIcon,
} from '@heroicons/react/20/solid';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <SidebarLayout
      navbar={
        <Navbar>
          <NavbarItem href="/">Home</NavbarItem>
        </Navbar>
      }
      sidebar={
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-3 px-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-900 text-white">
                <CpuChipIcon className="h-6 w-6" />
              </div>
              <div>
                <div className="text-sm font-semibold text-zinc-950 dark:text-white">
                  Blog Writer
                </div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400">
                  Admin Dashboard
                </div>
              </div>
            </div>
          </SidebarHeader>

          <SidebarBody>
            <SidebarSection>
              <SidebarItem href="/" current={pathname === '/'}>
                <HomeIcon />
                <span>Dashboard</span>
              </SidebarItem>
              
              <SidebarItem href="/providers" current={pathname.startsWith('/providers')}>
                <CpuChipIcon />
                <span>AI Providers</span>
              </SidebarItem>
              
              <SidebarItem href="/monitoring" current={pathname.startsWith('/monitoring')}>
                <ChartBarIcon />
                <span>Monitoring</span>
              </SidebarItem>
              
              <SidebarItem href="/configuration" current={pathname.startsWith('/configuration')}>
                <Cog6ToothIcon />
                <span>Configuration</span>
              </SidebarItem>
            </SidebarSection>

            <SidebarSection className="mt-auto">
              <SidebarItem href="/testing">
                <BeakerIcon />
                <span>Testing</span>
              </SidebarItem>
            </SidebarSection>
          </SidebarBody>
        </Sidebar>
      }
    >
      <div className="mx-auto max-w-7xl p-6 lg:p-8">
        {children}
      </div>
    </SidebarLayout>
  );
}

