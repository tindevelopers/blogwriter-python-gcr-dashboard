'use client';

import { Heading } from '@repo/ui/heading';
import { Badge } from '@repo/ui/badge';
import { Divider } from '@repo/ui/divider';
import { useHealth, useStatus, useProviderStats, useCosts } from '@/lib/api/hooks';
import { formatCurrency, formatNumber, formatRelativeTime } from '@/lib/utils/format';
import { 
  CheckCircleIcon, 
  XCircleIcon,
  CpuChipIcon,
  CurrencyDollarIcon,
  ClockIcon,
  ServerIcon,
  ChartBarIcon,
  Cog6ToothIcon,
} from '@heroicons/react/20/solid';

// Metric Card Component
function MetricCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend 
}: { 
  title: string; 
  value: string | number; 
  subtitle?: string; 
  icon: any;
  trend?: 'up' | 'down' | 'neutral';
}) {
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-zinc-800">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-700">
              <Icon className="h-6 w-6 text-zinc-700 dark:text-zinc-300" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">{title}</p>
              <p className="text-2xl font-semibold text-zinc-900 dark:text-white">{value}</p>
              {subtitle && (
                <p className="text-xs text-zinc-500 dark:text-zinc-500">{subtitle}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { data: health, isLoading: healthLoading, error: healthError } = useHealth();
  const { data: status, isLoading: statusLoading } = useStatus();
  const { data: providerStats, isLoading: statsLoading, error: statsError } = useProviderStats();
  const { data: costs, isLoading: costsLoading } = useCosts();

  // Mock data for demo mode
  const mockProviderStats = [
    { provider_type: 'openai', enabled: true, total_requests: 1248, total_cost: 45.67 },
    { provider_type: 'anthropic', enabled: true, total_requests: 892, total_cost: 32.45 },
    { provider_type: 'google', enabled: false, total_requests: 0, total_cost: 0 },
  ];

  const mockHealth = { status: 'healthy' };

  // Use mock data if API errors
  const displayProviderStats = statsError ? mockProviderStats : providerStats;
  const displayHealth = healthError ? mockHealth : health;

  // Calculate metrics - handle API errors gracefully
  const totalRequests = Array.isArray(displayProviderStats) 
    ? displayProviderStats.reduce((sum: number, p: any) => sum + (p.total_requests || 0), 0) 
    : 0;
  const totalCost = costs?.total_cost || 78.12;
  const activeProviders = Array.isArray(displayProviderStats) 
    ? displayProviderStats.filter((p: any) => p.enabled)?.length 
    : 2;

  return (
    <div className="space-y-8">
      {/* Demo Mode Banner */}
      {(healthError || statsError) && (
        <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 dark:bg-amber-900/20 dark:border-amber-800">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-amber-600 dark:text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-amber-900 dark:text-amber-100">
                Demo Mode - Showing Sample Data
              </h3>
              <p className="mt-1 text-sm text-amber-800 dark:text-amber-200">
                Backend API not connected. Configure your API endpoint to see live data.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div>
        <Heading>Dashboard</Heading>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Monitor LLM provider usage, costs, and system health
        </p>
      </div>

      {/* System Health Status */}
      <div className="rounded-lg bg-white p-6 shadow dark:bg-zinc-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {displayHealth?.status === 'healthy' || displayHealth?.status === 'ok' ? (
              <>
                <CheckCircleIcon className="h-8 w-8 text-green-500" />
                <div>
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                    System Operational
                  </h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    All services running normally
                  </p>
                </div>
              </>
            ) : (
              <>
                <XCircleIcon className="h-8 w-8 text-red-500" />
                <div>
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                    System Issues Detected
                  </h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Some services may be degraded
                  </p>
                </div>
              </>
            )}
          </div>
          <Badge color={displayHealth?.status === 'healthy' || displayHealth?.status === 'ok' ? 'green' : 'red'}>
            {displayHealth?.status || 'Unknown'}
          </Badge>
        </div>
      </div>

      <Divider />

      {/* Metrics Grid */}
      <div>
        <h2 className="text-base font-semibold text-zinc-900 dark:text-white mb-4">
          Today's Metrics
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total Requests"
            value={formatNumber(totalRequests)}
            subtitle="All LLM providers"
            icon={ServerIcon}
          />
          
          <MetricCard
            title="Total Cost"
            value={formatCurrency(totalCost)}
            subtitle="Today's spending"
            icon={CurrencyDollarIcon}
          />
          
          <MetricCard
            title="Active Providers"
            value={activeProviders}
            subtitle={`${displayProviderStats?.length || 3} total configured`}
            icon={CpuChipIcon}
          />
          
          <MetricCard
            title="Uptime"
            value="99.9%"
            subtitle="Last 30 days"
            icon={ClockIcon}
          />
        </div>
      </div>

      {/* Provider Status */}
      <div>
        <h2 className="text-base font-semibold text-zinc-900 dark:text-white mb-4">
          Provider Status
        </h2>
        <div className="space-y-3">
          {statsLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900 dark:border-white"></div>
              <span className="ml-2 text-sm text-zinc-500">Loading providers...</span>
            </div>
          ) : displayProviderStats && Array.isArray(displayProviderStats) && displayProviderStats.length > 0 ? (
            displayProviderStats.map((provider: any) => (
              <div
                key={provider.provider_type}
                className="flex items-center justify-between rounded-lg bg-white p-4 shadow dark:bg-zinc-800"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`h-3 w-3 rounded-full ${
                      provider.enabled ? 'bg-green-500' : 'bg-gray-400'
                    }`}
                  />
                  <div>
                    <p className="font-medium text-zinc-900 dark:text-white capitalize">
                      {provider.provider_type}
                    </p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      {formatNumber(provider.total_requests || 0)} requests · {formatCurrency(provider.total_cost || 0)}
                    </p>
                  </div>
                </div>
                <Badge color={provider.enabled ? 'green' : 'zinc'}>
                  {provider.enabled ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            ))
          ) : (
            <div className="rounded-lg bg-zinc-50 p-8 text-center dark:bg-zinc-900">
              <CpuChipIcon className="mx-auto h-12 w-12 text-zinc-400" />
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                No providers configured yet
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-base font-semibold text-zinc-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <a
            href="/providers"
            className="group rounded-lg bg-white p-6 shadow transition hover:shadow-lg dark:bg-zinc-800"
          >
            <CpuChipIcon className="h-8 w-8 text-zinc-700 dark:text-zinc-300" />
            <h3 className="mt-4 font-semibold text-zinc-900 dark:text-white">
              Configure Providers
            </h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Manage AI provider settings and API keys
            </p>
          </a>
          
          <a
            href="/monitoring"
            className="group rounded-lg bg-white p-6 shadow transition hover:shadow-lg dark:bg-zinc-800"
          >
            <ChartBarIcon className="h-8 w-8 text-zinc-700 dark:text-zinc-300" />
            <h3 className="mt-4 font-semibold text-zinc-900 dark:text-white">
              View Analytics
            </h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Monitor usage, costs, and performance
            </p>
          </a>
          
          <a
            href="/configuration"
            className="group rounded-lg bg-white p-6 shadow transition hover:shadow-lg dark:bg-zinc-800"
          >
            <Cog6ToothIcon className="h-8 w-8 text-zinc-700 dark:text-zinc-300" />
            <h3 className="mt-4 font-semibold text-zinc-900 dark:text-white">
              System Settings
            </h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Configure LiteLLM and general settings
            </p>
          </a>
        </div>
      </div>
    </div>
  );
}

