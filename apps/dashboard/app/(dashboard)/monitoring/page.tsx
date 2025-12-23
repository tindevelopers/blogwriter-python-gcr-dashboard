'use client'

import { useState } from 'react'
import { Avatar } from '@repo/ui/avatar'
import { Badge } from '@repo/ui/badge'
import { Button } from '@repo/ui/button'
import { DescriptionDetails, DescriptionList, DescriptionTerm } from '@repo/ui/description-list'
import { Divider } from '@repo/ui/divider'
import { Field, FieldLabel, Fieldset, Legend } from '@repo/ui/fieldset'
import { Heading, Subheading } from '@repo/ui/heading'
import { Input } from '@repo/ui/input'
import { Select } from '@repo/ui/select'
import { Switch } from '@repo/ui/switch'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@repo/ui/table'
import { Textarea } from '@repo/ui/textarea'
import {
  useJobs,
  useJob,
  useCancelJob,
  useRetryJob,
  useLogs,
  useStatus,
  useCacheStats,
  useClearCache,
} from '@/lib/api/hooks'
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ArrowPathIcon,
  XMarkIcon,
} from '@heroicons/react/20/solid'

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

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  if (days > 0) return `${days}d ${hours}h`
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m`
}

function getJobStatusBadge(status: string) {
  switch (status) {
    case 'completed':
      return <Badge color="lime">Completed</Badge>
    case 'running':
      return <Badge color="blue">Running</Badge>
    case 'failed':
      return <Badge color="red">Failed</Badge>
    case 'cancelled':
      return <Badge color="zinc">Cancelled</Badge>
    case 'pending':
      return <Badge color="amber">Pending</Badge>
    default:
      return <Badge color="zinc">{status}</Badge>
  }
}

function getLogLevelBadge(level: string) {
  switch (level) {
    case 'error':
      return <Badge color="red">Error</Badge>
    case 'warning':
      return <Badge color="amber">Warning</Badge>
    case 'info':
      return <Badge color="blue">Info</Badge>
    default:
      return <Badge color="zinc">{level}</Badge>
  }
}

export default function MonitoringPage() {
  const { data: jobsData, error: jobsError, isLoading: isLoadingJobs } = useJobs()
  const { data: logsData, error: logsError, isLoading: isLoadingLogs } = useLogs()
  const { data: statusData, error: statusError } = useStatus()
  const { data: cacheStatsData, error: cacheStatsError } = useCacheStats()
  const cancelJobMutation = useCancelJob()
  const retryJobMutation = useRetryJob()
  const clearCacheMutation = useClearCache()

  const [logLevel, setLogLevel] = useState<string>('all')
  const [logSearch, setLogSearch] = useState<string>('')
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true)

  // Extract real data from API responses
  const displayJobs = Array.isArray(jobsData?.jobs)
    ? jobsData.jobs
    : Array.isArray(jobsData)
      ? jobsData
      : []
  const displayLogs = Array.isArray(logsData?.logs)
    ? logsData.logs
    : Array.isArray(logsData)
      ? logsData
      : []
  const displayStatus = statusData || {}
  const displayCacheStats = cacheStatsData || {}

  const filteredLogs = displayLogs.filter((log: any) => {
    if (logLevel !== 'all' && log.level !== logLevel) return false
    if (logSearch && !log.message?.toLowerCase().includes(logSearch.toLowerCase())) return false
    return true
  })

  const handleCancelJob = async (jobId: string) => {
    if (confirm(`Are you sure you want to cancel job ${jobId}?`)) {
      await cancelJobMutation.mutateAsync(jobId)
    }
  }

  const handleRetryJob = async (jobId: string) => {
    await retryJobMutation.mutateAsync(jobId)
  }

  const handleClearCache = async () => {
    if (confirm('Are you sure you want to clear the cache? This action cannot be undone.')) {
      await clearCacheMutation.mutateAsync()
    }
  }

  return (
    <>
      <Heading>Monitoring</Heading>

      {(statusError || jobsError || logsError || cacheStatsError) && (
        <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-200">
          <strong>Error</strong> — Unable to load monitoring data. Please check your API connection.
        </div>
      )}

      {/* System Status Section */}
      <Subheading className="mt-8">System Status</Subheading>
      <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-zinc-950/10 bg-white p-6 dark:border-white/10 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-500">API Health</span>
            {displayStatus.api_health === 'healthy' ? (
              <CheckCircleIcon className="h-6 w-6 text-green-500" />
            ) : (
              <XCircleIcon className="h-6 w-6 text-red-500" />
            )}
          </div>
          <div className="mt-2">
            {statusError ? (
              <Badge color="red">Error</Badge>
            ) : displayStatus.api_health ? (
              <Badge color={displayStatus.api_health === 'healthy' ? 'lime' : 'red'}>
                {displayStatus.api_health}
              </Badge>
            ) : (
              <Badge color="zinc">Loading...</Badge>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-zinc-950/10 bg-white p-6 dark:border-white/10 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-500">Active Jobs</span>
            <ClockIcon className="h-6 w-6 text-blue-500" />
          </div>
          <div className="mt-2 text-2xl font-semibold">
            {statusError ? '—' : displayStatus.active_jobs ?? (isLoadingJobs ? '...' : 0)}
          </div>
        </div>

        <div className="rounded-xl border border-zinc-950/10 bg-white p-6 dark:border-white/10 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-500">Cache Status</span>
            {statusError ? (
              <XCircleIcon className="h-6 w-6 text-red-500" />
            ) : displayStatus.cache_status === 'operational' ? (
              <CheckCircleIcon className="h-6 w-6 text-green-500" />
            ) : displayStatus.cache_status ? (
              <XCircleIcon className="h-6 w-6 text-red-500" />
            ) : (
              <ClockIcon className="h-6 w-6 text-zinc-400" />
            )}
          </div>
          <div className="mt-2">
            {statusError ? (
              <Badge color="red">Error</Badge>
            ) : displayStatus.cache_status ? (
              <Badge color={displayStatus.cache_status === 'operational' ? 'lime' : 'red'}>
                {displayStatus.cache_status}
              </Badge>
            ) : (
              <Badge color="zinc">Loading...</Badge>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-zinc-950/10 bg-white p-6 dark:border-white/10 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-500">Uptime</span>
            <ClockIcon className="h-6 w-6 text-zinc-500" />
          </div>
          <div className="mt-2 text-lg font-semibold">
            {statusError
              ? '—'
              : displayStatus.uptime_seconds
                ? formatUptime(displayStatus.uptime_seconds)
                : '—'}
          </div>
        </div>
      </div>

      {/* Jobs Management Section */}
      <Subheading className="mt-14">Jobs Management</Subheading>
      <Table className="mt-4 [--gutter:--spacing(6)] lg:[--gutter:--spacing(10)]">
        <TableHead>
          <TableRow>
            <TableHeader>Job ID</TableHeader>
            <TableHeader>Type</TableHeader>
            <TableHeader>Status</TableHeader>
            <TableHeader>Created</TableHeader>
            <TableHeader>Updated</TableHeader>
            <TableHeader className="text-right">Actions</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoadingJobs ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-zinc-500">
                Loading jobs...
              </TableCell>
            </TableRow>
          ) : jobsError ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-red-500">
                Error loading jobs: {jobsError.message || 'Unknown error'}
              </TableCell>
            </TableRow>
          ) : displayJobs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-zinc-500">
                No jobs found
              </TableCell>
            </TableRow>
          ) : (
            displayJobs.map((job: any) => (
              <TableRow key={job.id}>
                <TableCell className="font-medium font-mono text-sm">{job.id}</TableCell>
                <TableCell className="capitalize">{job.type?.replace(/_/g, ' ') || 'Unknown'}</TableCell>
                <TableCell>{getJobStatusBadge(job.status)}</TableCell>
                <TableCell className="text-zinc-500">{formatRelativeTime(job.created_at)}</TableCell>
                <TableCell className="text-zinc-500">{formatRelativeTime(job.updated_at)}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    {job.status === 'running' && (
                      <Button
                        plain
                        onClick={() => handleCancelJob(job.id)}
                        disabled={cancelJobMutation.isPending}
                      >
                        <XMarkIcon className="h-4 w-4" />
                        Cancel
                      </Button>
                    )}
                    {job.status === 'failed' && (
                      <Button
                        plain
                        onClick={() => handleRetryJob(job.id)}
                        disabled={retryJobMutation.isPending}
                      >
                        <ArrowPathIcon className="h-4 w-4" />
                        Retry
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Logs Viewer Section */}
      <Subheading className="mt-14">Logs Viewer</Subheading>
      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end">
        <Field className="flex-1">
          <FieldLabel>Filter by Level</FieldLabel>
          <Select name="logLevel" value={logLevel} onChange={(e) => setLogLevel(e.target.value)}>
            <option value="all">All Levels</option>
            <option value="error">Error</option>
            <option value="warning">Warning</option>
            <option value="info">Info</option>
          </Select>
        </Field>
        <Field className="flex-1">
          <FieldLabel>Search</FieldLabel>
          <Input
            name="logSearch"
            type="search"
            value={logSearch}
            onChange={(e) => setLogSearch(e.target.value)}
            placeholder="Search logs..."
          />
        </Field>
        <div className="flex items-center gap-2">
          <Switch checked={autoRefresh} onChange={setAutoRefresh} />
          <span className="text-sm text-zinc-500">Auto-refresh</span>
        </div>
      </div>

        <div className="mt-4 rounded-lg border border-zinc-950/10 bg-zinc-950 p-4 dark:border-white/10 dark:bg-zinc-900">
        <div className="max-h-96 overflow-y-auto font-mono text-sm">
          {isLoadingLogs ? (
            <div className="text-zinc-500">Loading logs...</div>
          ) : logsError ? (
            <div className="text-red-500">Error loading logs: {logsError.message || 'Unknown error'}</div>
          ) : filteredLogs.length === 0 ? (
            <div className="text-zinc-500">No logs found</div>
          ) : (
            filteredLogs.map((log: any, index: number) => (
              <div key={index} className="mb-2 flex gap-4">
                <span className="text-zinc-500">
                  {log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : '—'}
                </span>
                <span>{getLogLevelBadge(log.level)}</span>
                <span className="flex-1 text-zinc-300">{log.message || JSON.stringify(log)}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Cache Statistics Section */}
      <Subheading className="mt-14">Cache Statistics</Subheading>
      <div className="mt-4">
        {cacheStatsError ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-900/20 dark:text-red-200">
            Error loading cache statistics: {cacheStatsError.message || 'Unknown error'}
          </div>
        ) : (
          <>
            <DescriptionList>
              <DescriptionTerm>Cache Hits</DescriptionTerm>
              <DescriptionDetails>
                {displayCacheStats.hits !== undefined ? displayCacheStats.hits.toLocaleString() : '—'}
              </DescriptionDetails>
              <DescriptionTerm>Cache Misses</DescriptionTerm>
              <DescriptionDetails>
                {displayCacheStats.misses !== undefined ? displayCacheStats.misses.toLocaleString() : '—'}
              </DescriptionDetails>
              <DescriptionTerm>Hit Rate</DescriptionTerm>
              <DescriptionDetails>
                {displayCacheStats.hit_rate !== undefined
                  ? `${displayCacheStats.hit_rate.toFixed(1)}%`
                  : '—'}
              </DescriptionDetails>
              <DescriptionTerm>Cache Size</DescriptionTerm>
              <DescriptionDetails>
                {displayCacheStats.size_mb !== undefined
                  ? `${displayCacheStats.size_mb.toFixed(1)} MB`
                  : '—'}
              </DescriptionDetails>
            </DescriptionList>
            <div className="mt-6">
              <Button onClick={handleClearCache} disabled={clearCacheMutation.isPending}>
                {clearCacheMutation.isPending ? 'Clearing...' : 'Clear Cache'}
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  )
}

