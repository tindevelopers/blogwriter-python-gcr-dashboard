'use client'

import { Avatar } from '@repo/ui/avatar'
import { Badge } from '@repo/ui/badge'
import { Button } from '@repo/ui/button'
import { Heading, Subheading } from '@repo/ui/heading'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@repo/ui/table'
import { useProviders, useProviderHealth } from '@/lib/api/hooks'
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/20/solid'

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

function formatRelativeTime(dateString: string | null): string {
  if (!dateString) return 'Never'
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  return `${diffDays}d ago`
}

function getProviderColor(provider: string): string {
  switch (provider) {
    case 'openai':
      return 'bg-emerald-600 text-white'
    case 'anthropic':
      return 'bg-orange-600 text-white'
    case 'google':
      return 'bg-blue-600 text-white'
    default:
      return 'bg-zinc-600 text-white'
  }
}

export default function ProvidersPage() {
  const { data: providersData, error: providersError } = useProviders()
  const { data: healthData, error: healthError } = useProviderHealth()

  // Extract providers array safely
  const displayProviders = Array.isArray(providersData?.providers)
    ? providersData.providers
    : Array.isArray(providersData)
      ? providersData
      : []

  const displayHealth = Array.isArray(healthData) ? healthData : []
  const activeProvider = providersData?.active_provider || null

  return (
    <>
      <div className="flex items-end justify-between gap-4">
        <Heading>AI Providers</Heading>
        <Button>Add Provider</Button>
      </div>

      {(providersError || healthError) && (
        <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-200">
          <strong>Error</strong> — Unable to load provider data. Please check your API connection.
        </div>
      )}

      <Subheading className="mt-14">Provider Configuration</Subheading>
      <Table className="mt-4 [--gutter:--spacing(6)] lg:[--gutter:--spacing(10)]">
        <TableHead>
          <TableRow>
            <TableHeader>Provider</TableHeader>
            <TableHeader>Status</TableHeader>
            <TableHeader>Default Model</TableHeader>
            <TableHeader>Priority</TableHeader>
            <TableHeader className="text-right">Requests</TableHeader>
            <TableHeader className="text-right">Cost</TableHeader>
            <TableHeader className="text-right">Last Used</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {displayProviders.map((provider: any) => {
            const isActive = provider.provider_type === activeProvider

            return (
              <TableRow key={provider.provider_type} href={`/providers/${provider.provider_type}`}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar
                      initials={provider.provider_type.substring(0, 2).toUpperCase()}
                      className={`size-8 ${getProviderColor(provider.provider_type)}`}
                    />
                    <div>
                      <span className="font-medium capitalize">{provider.provider_type}</span>
                      {isActive && (
                        <Badge color="blue" className="ml-2">
                          Active
                        </Badge>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge color={provider.enabled ? 'lime' : 'zinc'}>
                    {provider.enabled ? 'Enabled' : 'Disabled'}
                  </Badge>
                </TableCell>
                <TableCell className="text-zinc-500">{provider.default_model}</TableCell>
                <TableCell>
                  <Badge color="zinc">#{provider.priority}</Badge>
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatNumber(provider.total_requests)}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatCurrency(provider.total_cost)}
                </TableCell>
                <TableCell className="text-right text-zinc-500">
                  {formatRelativeTime(provider.last_used)}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      <Subheading className="mt-14">Health Status</Subheading>
      <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {displayHealth.length === 0 ? (
          <div className="col-span-full text-center text-zinc-500">No health data available</div>
        ) : (
          displayHealth.map((h: any) => (
          <div
            key={h.provider_type}
            className="rounded-xl border border-zinc-950/10 bg-white p-6 dark:border-white/10 dark:bg-zinc-900"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar
                  initials={h.provider_type.substring(0, 2).toUpperCase()}
                  className={`size-10 ${getProviderColor(h.provider_type)}`}
                />
                <span className="text-lg font-semibold capitalize">{h.provider_type}</span>
              </div>
              {h.api_key_valid ? (
                <CheckCircleIcon className="h-6 w-6 text-green-500" />
              ) : (
                <XCircleIcon className="h-6 w-6 text-red-500" />
              )}
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-500">API Key</span>
                <Badge color={h.api_key_valid ? 'lime' : 'red'}>
                  {h.api_key_valid ? 'Valid' : 'Invalid'}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-500">Rate Limit</span>
                <Badge color={h.rate_limit_ok ? 'lime' : 'amber'}>
                  {h.rate_limit_ok ? 'OK' : 'Limited'}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-500">Response Time</span>
                <span className="font-medium">
                  {h.response_time_ms > 0 ? `${h.response_time_ms}ms` : '—'}
                </span>
              </div>
            </div>
          </div>
        ))
        )}
      </div>

      <div className="mt-10 rounded-xl border border-blue-200 bg-blue-50 p-6 dark:border-blue-900 dark:bg-blue-900/20">
        <h3 className="font-semibold text-blue-900 dark:text-blue-100">Provider Management</h3>
        <p className="mt-2 text-sm text-blue-800 dark:text-blue-200">
          Configure API keys and settings for each LLM provider. The active provider is used for
          all blog generation requests. Set priority levels for automatic failover when the primary
          provider is unavailable.
        </p>
      </div>
    </>
  )
}
