'use client'

import { Stat } from '@/app/stat'
import { Avatar } from '@repo/ui/avatar'
import { Badge } from '@repo/ui/badge'
import { Heading, Subheading } from '@repo/ui/heading'
import { Select } from '@repo/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@repo/ui/table'
import { useProviderStats, useCosts, useUsage } from '@/lib/api/hooks'


function formatCurrency(value: number | undefined | null): string {
  if (value === undefined || value === null || isNaN(value)) return '$0.00'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value)
}

function formatNumber(value: number | undefined | null): string {
  if (value === undefined || value === null || isNaN(value)) return '0'
  return new Intl.NumberFormat('en-US').format(value)
}

export default function DashboardPage() {
  const { data: providerStats, error: statsError, isLoading: isLoadingStats } = useProviderStats()
  const { data: costs, error: costsError } = useCosts()
  const { data: usageData, error: usageError } = useUsage()

  // Extract real data from API responses
  const displayProviderStats = Array.isArray(providerStats) ? providerStats : []

  // Calculate metrics from real data
  const totalRequests = displayProviderStats.reduce(
    (sum: number, p: any) => sum + (p.total_requests || 0),
    0
  )
  const totalCost = costs?.total_cost || 0
  const activeProviders = displayProviderStats.filter((p: any) => p.enabled).length
  
  // Calculate average latency from provider stats
  const avgLatency = displayProviderStats.length > 0
    ? Math.round(
        displayProviderStats.reduce((sum: number, p: any) => sum + (p.avg_latency || 0), 0) /
        displayProviderStats.filter((p: any) => p.avg_latency > 0).length || 1
      )
    : 0

  return (
    <>
      <Heading>Dashboard</Heading>

      {(statsError || costsError || usageError) && (
        <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-200">
          <strong>Error</strong> — Unable to load dashboard data. Please check your API connection.
        </div>
      )}

      <div className="mt-8 flex items-end justify-between">
        <Subheading>Overview</Subheading>
        <div>
          <Select name="period">
            <option value="today">Today</option>
            <option value="last_week">Last week</option>
            <option value="last_month">Last month</option>
            <option value="last_quarter">Last quarter</option>
          </Select>
        </div>
      </div>

      <div className="mt-4 grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
        <Stat title="Total Requests" value={formatNumber(totalRequests)} change="—" />
        <Stat title="Total Cost" value={formatCurrency(totalCost)} change="—" />
        <Stat title="Active Providers" value={`${activeProviders}`} change="—" />
        <Stat title="Avg. Latency" value={avgLatency > 0 ? `${avgLatency}ms` : '—'} change="—" />
      </div>

      <Subheading className="mt-14">Provider Performance</Subheading>
      <Table className="mt-4 [--gutter:--spacing(6)] lg:[--gutter:--spacing(10)]">
        <TableHead>
          <TableRow>
            <TableHeader>Provider</TableHeader>
            <TableHeader>Status</TableHeader>
            <TableHeader className="text-right">Requests</TableHeader>
            <TableHeader className="text-right">Cost</TableHeader>
            <TableHeader className="text-right">Latency</TableHeader>
            <TableHeader className="text-right">Success Rate</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoadingStats ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-zinc-500">
                Loading provider statistics...
              </TableCell>
            </TableRow>
          ) : statsError ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-red-500">
                Error loading provider statistics: {statsError.message || 'Unknown error'}
              </TableCell>
            </TableRow>
          ) : displayProviderStats.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-zinc-500">
                No provider statistics available
              </TableCell>
            </TableRow>
          ) : (
            displayProviderStats.map((provider: any) => (
            <TableRow key={provider.provider_type} href={`/providers/${provider.provider_type}`}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar
                    initials={provider.provider_type.substring(0, 2).toUpperCase()}
                    className={`size-8 ${
                      provider.provider_type === 'openai'
                        ? 'bg-emerald-600 text-white'
                        : provider.provider_type === 'anthropic'
                          ? 'bg-orange-600 text-white'
                          : 'bg-blue-600 text-white'
                    }`}
                  />
                  <span className="font-medium capitalize">{provider.provider_type}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge color={provider.enabled ? 'lime' : 'zinc'}>
                  {provider.enabled ? 'Active' : 'Inactive'}
                </Badge>
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {formatNumber(provider.total_requests)}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {formatCurrency(provider.total_cost)}
              </TableCell>
              <TableCell className="text-right tabular-nums text-zinc-500">
                {provider.avg_latency}ms
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {provider.success_rate > 0 ? `${provider.success_rate}%` : '—'}
              </TableCell>
            </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </>
  )
}
