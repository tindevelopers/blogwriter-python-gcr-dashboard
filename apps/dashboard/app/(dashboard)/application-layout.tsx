'use client'

import { Avatar } from '@repo/ui/avatar'
import {
  Dropdown,
  DropdownButton,
  DropdownDivider,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from '@repo/ui/dropdown'
import { Navbar, NavbarItem, NavbarSection, NavbarSpacer } from '@repo/ui/navbar'
import {
  Sidebar,
  SidebarBody,
  SidebarFooter,
  SidebarHeader,
  SidebarHeading,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
  SidebarSpacer,
} from '@repo/ui/sidebar'
import { SidebarLayout } from '@repo/ui/sidebar-layout'
import {
  ArrowRightStartOnRectangleIcon,
  ChevronUpIcon,
  Cog8ToothIcon,
  LightBulbIcon,
  ShieldCheckIcon,
  UserCircleIcon,
} from '@heroicons/react/16/solid'
import {
  ChartBarIcon,
  Cog6ToothIcon,
  CpuChipIcon,
  HomeIcon,
  QuestionMarkCircleIcon,
  SparklesIcon,
} from '@heroicons/react/20/solid'
import { usePathname } from 'next/navigation'
import { useProviderStats, useUsage } from '@/lib/api/hooks'

function AccountDropdownMenu({ anchor }: { anchor: 'top start' | 'bottom end' }) {
  return (
    <DropdownMenu className="min-w-64" anchor={anchor}>
      <DropdownItem href="#">
        <UserCircleIcon />
        <DropdownLabel>My account</DropdownLabel>
      </DropdownItem>
      <DropdownDivider />
      <DropdownItem href="#">
        <ShieldCheckIcon />
        <DropdownLabel>Privacy policy</DropdownLabel>
      </DropdownItem>
      <DropdownItem href="#">
        <LightBulbIcon />
        <DropdownLabel>Share feedback</DropdownLabel>
      </DropdownItem>
      <DropdownDivider />
      <DropdownItem href="#">
        <ArrowRightStartOnRectangleIcon />
        <DropdownLabel>Sign out</DropdownLabel>
      </DropdownItem>
    </DropdownMenu>
  )
}

export function ApplicationLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { data: providerStats } = useProviderStats()
  const { data: usageData } = useUsage()

  // Calculate active providers count from real data
  const activeProviders = Array.isArray(providerStats)
    ? providerStats.filter((p: any) => p.enabled).length
    : Array.isArray(providerStats?.providers)
      ? providerStats.providers.filter((p: any) => p.enabled).length
      : 0

  // Calculate total requests from real data
  const totalRequests = usageData?.total_requests_today ||
    usageData?.requests_today ||
    (Array.isArray(providerStats)
      ? providerStats.reduce((sum: number, p: any) => sum + (p.total_requests || 0), 0)
      : Array.isArray(providerStats?.providers)
        ? providerStats.providers.reduce((sum: number, p: any) => sum + (p.total_requests || 0), 0)
        : 0)

  return (
    <SidebarLayout
      navbar={
        <Navbar>
          <NavbarSpacer />
          <NavbarSection>
            <Dropdown>
              <DropdownButton as={NavbarItem}>
                <Avatar initials="AD" className="size-8 bg-zinc-900 text-white" square />
              </DropdownButton>
              <AccountDropdownMenu anchor="bottom end" />
            </Dropdown>
          </NavbarSection>
        </Navbar>
      }
      sidebar={
        <Sidebar>
          <SidebarHeader>
            <SidebarItem href="/">
              <Avatar initials="BW" className="bg-indigo-600 text-white" />
              <SidebarLabel>Blog Writer</SidebarLabel>
            </SidebarItem>
          </SidebarHeader>

          <SidebarBody>
            <SidebarSection>
              <SidebarItem href="/" current={pathname === '/'}>
                <HomeIcon />
                <SidebarLabel>Dashboard</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/providers" current={pathname.startsWith('/providers')}>
                <CpuChipIcon />
                <SidebarLabel>AI Providers</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/monitoring" current={pathname.startsWith('/monitoring')}>
                <ChartBarIcon />
                <SidebarLabel>Monitoring</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/configuration" current={pathname.startsWith('/configuration')}>
                <Cog6ToothIcon />
                <SidebarLabel>Configuration</SidebarLabel>
              </SidebarItem>
            </SidebarSection>

            <SidebarSection className="max-lg:hidden">
              <SidebarHeading>Quick Stats</SidebarHeading>
              <SidebarItem href="/providers">
                <span className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  <span>{activeProviders} Active Provider{activeProviders !== 1 ? 's' : ''}</span>
                </span>
              </SidebarItem>
              <SidebarItem href="/monitoring">
                <span className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-blue-500" />
                  <span>{totalRequests.toLocaleString()} Requests Today</span>
                </span>
              </SidebarItem>
            </SidebarSection>

            <SidebarSpacer />

            <SidebarSection>
              <SidebarItem href="/support" current={pathname.startsWith('/support')}>
                <QuestionMarkCircleIcon />
                <SidebarLabel>Support</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/changelog" current={pathname.startsWith('/changelog')}>
                <SparklesIcon />
                <SidebarLabel>Changelog</SidebarLabel>
              </SidebarItem>
            </SidebarSection>
          </SidebarBody>

          <SidebarFooter className="max-lg:hidden">
            <Dropdown>
              <DropdownButton as={SidebarItem}>
                <span className="flex min-w-0 items-center gap-3">
                  <Avatar initials="AD" className="size-10 bg-zinc-900 text-white" square />
                  <span className="min-w-0">
                    <span className="block truncate text-sm/5 font-medium text-zinc-950 dark:text-white">
                      Admin
                    </span>
                    <span className="block truncate text-xs/5 font-normal text-zinc-500 dark:text-zinc-400">
                      admin@example.com
                    </span>
                  </span>
                </span>
                <ChevronUpIcon />
              </DropdownButton>
              <AccountDropdownMenu anchor="top start" />
            </Dropdown>
          </SidebarFooter>
        </Sidebar>
      }
    >
      {children}
    </SidebarLayout>
  )
}

