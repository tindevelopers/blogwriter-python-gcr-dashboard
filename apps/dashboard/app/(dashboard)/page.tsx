'use client'

import { Stat } from '@/app/stat'
import { Avatar } from '@repo/ui/avatar'
import { Badge } from '@repo/ui/badge'
import { Heading, Subheading } from '@repo/ui/heading'
import { Select } from '@repo/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@repo/ui/table'
import { useHealth, useProviderStats, useCosts } from '@/lib/api/hooks'

// Mock data for demo mode
const mockProviderStats = [
  {
    provider_type: 'openai',
    enabled: true,
    total_requests: 1248,
    total_cost: 45.67,
    avg_latency: 245,
    success_rate: 99.2,
  },
  {
    provider_type: 'anthropic',
    enabled: true,
    total_requests: 892,
    total_cost: 32.45,
    avg_latency: 312,
    success_rate: 98.8,
  },
  {
    provider_type: 'google',
    enabled: false,
    total_requests: 0,
    total_cost: 0,
    avg_latency: 0,
    success_rate: 0,
  },
]

const mockRecentRequests = [
  {
    id: 'req-001',
    timestamp: '2 min ago',
    provider: 'openai',
    model: 'gpt-4-turbo',
    tokens: 2450,
    cost: '$0.12',
    status: 'success',
  },
  {
    id: 'req-002',
    timestamp: '5 min ago',
    provider: 'anthropic',
    model: 'claude-3-sonnet',
    tokens: 1890,
    cost: '$0.08',
    status: 'success',
  },
  {
    id: 'req-003',
    timestamp: '8 min ago',
    provider: 'openai',
    model: 'gpt-4-turbo',
    tokens: 3200,
    cost: '$0.15',
    status: 'success',
  },
  {
    id: 'req-004',
    timestamp: '12 min ago',
    provider: 'anthropic',
    model: 'claude-3-sonnet',
    tokens: 1250,
    cost: '$0.05',
    status: 'success',
  },
  {
    id: 'req-005',
    timestamp: '15 min ago',
    provider: 'openai',
    model: 'gpt-4-turbo',
    tokens: 980,
    cost: '$0.04',
    status: 'success',
  },
]

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value)
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value)
}

export default function DashboardPage() {
  const { data: health, error: healthError } = useHealth()
  const { data: providerStats, error: statsError } = useProviderStats()
  const { data: costs } = useCosts()

  // Use mock data if API is not available
  const displayProviderStats = statsError ? mockProviderStats : providerStats || mockProviderStats
  const isDemo = !!statsError || !providerStats

  // Calculate metrics
  const totalRequests = Array.isArray(displayProviderStats)
    ? displayProviderStats.reduce((sum: number, p: any) => sum + (p.total_requests || 0), 0)
    : 2140
  const totalCost = costs?.total_cost || 78.12
  const activeProviders = Array.isArray(displayProviderStats)
    ? displayProviderStats.filter((p: any) => p.enabled).length
    : 2
  const avgLatency = 278

  return (
    <>
      <Heading>Dashboard</Heading>

      {isDemo && (
        <div className="mt-4 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:bg-amber-900/20 dark:text-amber-200">
          <strong>Demo Mode</strong> — Showing sample data. Connect your backend API for live
          metrics.
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
        <Stat title="Total Requests" value={formatNumber(totalRequests)} change="+12.5%" />
        <Stat title="Total Cost" value={formatCurrency(totalCost)} change="-2.3%" />
        <Stat title="Active Providers" value={`${activeProviders}/3`} change="+1" />
        <Stat title="Avg. Latency" value={`${avgLatency}ms`} change="-15ms" />
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
          {(displayProviderStats as any[]).map((provider) => (
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
          ))}
        </TableBody>
      </Table>

      <Subheading className="mt-14">Recent Requests</Subheading>
      <Table className="mt-4 [--gutter:--spacing(6)] lg:[--gutter:--spacing(10)]">
        <TableHead>
          <TableRow>
            <TableHeader>Request ID</TableHeader>
            <TableHeader>Time</TableHeader>
            <TableHeader>Provider</TableHeader>
            <TableHeader>Model</TableHeader>
            <TableHeader className="text-right">Tokens</TableHeader>
            <TableHeader className="text-right">Cost</TableHeader>
            <TableHeader className="text-right">Status</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {mockRecentRequests.map((request) => (
            <TableRow key={request.id}>
              <TableCell className="font-medium">{request.id}</TableCell>
              <TableCell className="text-zinc-500">{request.timestamp}</TableCell>
              <TableCell className="capitalize">{request.provider}</TableCell>
              <TableCell className="text-zinc-500">{request.model}</TableCell>
              <TableCell className="text-right tabular-nums">
                {formatNumber(request.tokens)}
              </TableCell>
              <TableCell className="text-right tabular-nums">{request.cost}</TableCell>
              <TableCell className="text-right">
                <Badge color="lime">{request.status}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}
