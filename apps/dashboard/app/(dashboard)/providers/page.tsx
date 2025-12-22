'use client';

import { Heading } from '@repo/ui/heading';
import { Badge } from '@repo/ui/badge';
import { Button } from '@repo/ui/button';
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '@repo/ui/table';
import { Switch } from '@repo/ui/switch';
import { useProviders, useProviderHealth, useTestProvider, useSwitchProvider } from '@/lib/api/hooks';
import { formatRelativeTime, formatNumber, formatCurrency } from '@/lib/utils/format';
import { 
  CheckCircleIcon, 
  XCircleIcon,
  ClockIcon,
} from '@heroicons/react/20/solid';
import { useState } from 'react';

export default function ProvidersPage() {
  const { data: providers, isLoading, error, refetch } = useProviders();
  const { data: health } = useProviderHealth();
  const testProvider = useTestProvider();
  const switchProvider = useSwitchProvider();
  const [testingProvider, setTestingProvider] = useState<string | null>(null);

  // Mock data for when API is not available
  const mockProviders = {
    providers: [
      {
        provider_type: 'openai',
        enabled: true,
        default_model: 'gpt-4-turbo-preview',
        priority: 1,
        total_requests: 1248,
        total_cost: 45.67,
        last_used: new Date().toISOString(),
      },
      {
        provider_type: 'anthropic',
        enabled: true,
        default_model: 'claude-3-5-sonnet-20241022',
        priority: 2,
        total_requests: 892,
        total_cost: 32.45,
        last_used: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        provider_type: 'google',
        enabled: false,
        default_model: 'gemini-pro',
        priority: 3,
        total_requests: 0,
        total_cost: 0,
        last_used: null,
      },
    ],
    active_provider: 'openai',
  };

  const mockHealth = [
    {
      provider_type: 'openai',
      api_key_valid: true,
      rate_limit_ok: true,
      response_time_ms: 245,
    },
    {
      provider_type: 'anthropic',
      api_key_valid: true,
      rate_limit_ok: true,
      response_time_ms: 312,
    },
  ];

  // Use mock data if API is not available
  const displayProviders = error ? mockProviders : providers;
  const displayHealth = error ? mockHealth : health;

  const handleTest = async (providerType: string) => {
    setTestingProvider(providerType);
    try {
      await testProvider.mutateAsync({
        provider_type: providerType,
        api_key: 'test', // Backend will use stored key
        test_prompt: 'Hello, this is a test.',
      });
    } finally {
      setTestingProvider(null);
    }
  };

  const handleSwitch = async (providerType: string) => {
    await switchProvider.mutateAsync({
      provider_type: providerType,
      reason: 'User switched via dashboard',
    });
    refetch();
  };

  return (
    <div className="space-y-8">
      {/* API Connection Status */}
      {error && (
        <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 dark:bg-amber-900/20 dark:border-amber-800">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-amber-600 dark:text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-amber-900 dark:text-amber-100">
                Demo Mode - Backend API Not Connected
              </h3>
              <p className="mt-1 text-sm text-amber-800 dark:text-amber-200">
                Showing demo data. Connect to your backend API to see live provider information.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Heading>AI Providers</Heading>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Configure and manage LLM provider connections
          </p>
        </div>
        <Button color="blue" href="/providers/configure">
          Add Provider
        </Button>
      </div>

      {/* Providers Table */}
      <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-zinc-800">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900 dark:border-white"></div>
            <p className="mt-2 text-sm text-zinc-500">Loading providers...</p>
          </div>
        ) : displayProviders && displayProviders.providers && displayProviders.providers.length > 0 ? (
          <Table striped>
            <TableHead>
              <TableRow>
                <TableHeader>Provider</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Default Model</TableHeader>
                <TableHeader>Priority</TableHeader>
                <TableHeader>Requests</TableHeader>
                <TableHeader>Cost</TableHeader>
                <TableHeader>Last Used</TableHeader>
                <TableHeader>Actions</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayProviders.providers.map((provider: any) => {
                const providerHealth = Array.isArray(displayHealth) ? displayHealth.find((h: any) => h.provider_type === provider.provider_type) : null;
                const isActive = provider.provider_type === displayProviders.active_provider;
                
                return (
                  <TableRow key={provider.provider_type}>
                    <TableCell className="font-medium capitalize">
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-2 w-2 rounded-full ${
                            provider.enabled && providerHealth?.api_key_valid
                              ? 'bg-green-500'
                              : 'bg-gray-400'
                          }`}
                        />
                        {provider.provider_type}
                        {isActive && (
                          <Badge color="blue" className="ml-2">Active</Badge>
                        )}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <Badge color={provider.enabled ? 'green' : 'zinc'}>
                        {provider.enabled ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </TableCell>
                    
                    <TableCell className="text-sm text-zinc-600 dark:text-zinc-400">
                      {provider.default_model || 'Not set'}
                    </TableCell>
                    
                    <TableCell>
                      <Badge color="zinc">{provider.priority}</Badge>
                    </TableCell>
                    
                    <TableCell className="text-sm">
                      {formatNumber(provider.total_requests || 0)}
                    </TableCell>
                    
                    <TableCell className="text-sm">
                      {formatCurrency(provider.total_cost || 0)}
                    </TableCell>
                    
                    <TableCell className="text-sm text-zinc-500">
                      {provider.last_used ? formatRelativeTime(provider.last_used) : 'Never'}
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          color="zinc"
                          onClick={() => handleTest(provider.provider_type)}
                          disabled={testingProvider === provider.provider_type || !provider.enabled}
                        >
                          {testingProvider === provider.provider_type ? 'Testing...' : 'Test'}
                        </Button>
                        {!isActive && provider.enabled && (
                          <Button
                            color="blue"
                            onClick={() => handleSwitch(provider.provider_type)}
                          >
                            Set Active
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <div className="p-8 text-center">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              No providers configured yet
            </p>
            <Button color="blue" href="/providers/configure" className="mt-4">
              Configure First Provider
            </Button>
          </div>
        )}
      </div>

      {/* Provider Health Details */}
      {displayHealth && Array.isArray(displayHealth) && displayHealth.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-white">
            Health Checks
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {displayHealth.map((h: any) => (
              <div
                key={h.provider_type}
                className="rounded-lg bg-white p-4 shadow dark:bg-zinc-800"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-medium capitalize text-zinc-900 dark:text-white">
                    {h.provider_type}
                  </h3>
                  {h.api_key_valid ? (
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircleIcon className="h-5 w-5 text-red-500" />
                  )}
                </div>
                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-600 dark:text-zinc-400">API Key:</span>
                    <Badge color={h.api_key_valid ? 'green' : 'red'}>
                      {h.api_key_valid ? 'Valid' : 'Invalid'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-600 dark:text-zinc-400">Rate Limit:</span>
                    <Badge color={h.rate_limit_ok ? 'green' : 'yellow'}>
                      {h.rate_limit_ok ? 'OK' : 'Limited'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-600 dark:text-zinc-400">Response Time:</span>
                    <span className="text-zinc-900 dark:text-white">
                      {h.response_time_ms ? `${h.response_time_ms.toFixed(0)}ms` : 'N/A'}
                    </span>
                  </div>
                  {h.error_message && (
                    <div className="mt-2 rounded bg-red-50 p-2 dark:bg-red-900/20">
                      <p className="text-xs text-red-600 dark:text-red-400">
                        {h.error_message}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info Card */}
      <div className="rounded-lg bg-blue-50 p-6 dark:bg-blue-900/20">
        <h3 className="font-semibold text-blue-900 dark:text-blue-100">
          Provider Management
        </h3>
        <p className="mt-2 text-sm text-blue-800 dark:text-blue-200">
          Configure API keys and settings for each LLM provider. The active provider is used for all blog generation requests. 
          Set priority levels for automatic failover when the primary provider is unavailable.
        </p>
      </div>
    </div>
  );
}

