import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { api } from './client';
import { toast } from 'react-hot-toast';

// Query keys
export const queryKeys = {
  health: ['health'],
  status: ['status'],
  providers: ['providers'],
  providerHealth: ['provider-health'],
  providerStats: ['provider-stats'],
  usage: ['usage'],
  costs: ['costs'],
  cacheStats: ['cache-stats'],
  jobs: (params?: any) => ['jobs', params],
  job: (id: string) => ['job', id],
  logs: (params?: any) => ['logs', params],
  secrets: ['secrets'],
  envVars: ['env-vars'],
};

// Health & Status
export function useHealth() {
  return useQuery({
    queryKey: queryKeys.health,
    queryFn: async () => (await api.health()).data,
    refetchInterval: 30000, // Refetch every 30s
  });
}

export function useStatus() {
  return useQuery({
    queryKey: queryKeys.status,
    queryFn: async () => (await api.status()).data,
    refetchInterval: 10000, // Refetch every 10s
  });
}

// AI Providers
export function useProviders() {
  return useQuery({
    queryKey: queryKeys.providers,
    queryFn: async () => (await api.providers.list()).data,
    staleTime: 60000, // Consider fresh for 1 minute
  });
}

export function useProviderHealth() {
  return useQuery({
    queryKey: queryKeys.providerHealth,
    queryFn: async () => (await api.providers.health()).data,
    refetchInterval: 30000,
  });
}

export function useProviderStats() {
  return useQuery({
    queryKey: queryKeys.providerStats,
    queryFn: async () => (await api.providers.stats()).data,
    refetchInterval: 10000,
  });
}

export function useConfigureProvider() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: any) => api.providers.configure(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.providers });
      queryClient.invalidateQueries({ queryKey: queryKeys.providerHealth });
      toast.success('Provider configured successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to configure provider: ${error.response?.data?.detail || error.message}`);
    },
  });
}

export function useTestProvider() {
  return useMutation({
    mutationFn: (data: any) => api.providers.test(data),
    onSuccess: (response) => {
      if (response.data.success) {
        toast.success('Provider test successful');
      } else {
        toast.error(`Provider test failed: ${response.data.error_message}`);
      }
    },
    onError: (error: any) => {
      toast.error(`Provider test error: ${error.response?.data?.detail || error.message}`);
    },
  });
}

export function useSwitchProvider() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: any) => api.providers.switch(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.providers });
      queryClient.invalidateQueries({ queryKey: queryKeys.providerStats });
      toast.success('Provider switched successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to switch provider: ${error.response?.data?.detail || error.message}`);
    },
  });
}

// Usage & Costs
export function useUsage() {
  return useQuery({
    queryKey: queryKeys.usage,
    queryFn: async () => (await api.usage()).data,
    refetchInterval: 30000,
  });
}

export function useCosts() {
  return useQuery({
    queryKey: queryKeys.costs,
    queryFn: async () => (await api.costs()).data,
    refetchInterval: 30000,
  });
}

export function useCacheStats() {
  return useQuery({
    queryKey: queryKeys.cacheStats,
    queryFn: async () => (await api.cacheStats()).data,
    refetchInterval: 10000,
  });
}

// Jobs
export function useJobs(params?: any) {
  return useQuery({
    queryKey: queryKeys.jobs(params),
    queryFn: async () => (await api.jobs.list(params)).data,
    refetchInterval: 5000, // Refetch every 5s for real-time updates
  });
}

export function useJob(jobId: string, options?: Omit<UseQueryOptions, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: queryKeys.job(jobId),
    queryFn: async () => (await api.jobs.get(jobId)).data,
    refetchInterval: 2000, // Refetch every 2s for job status
    enabled: !!jobId,
    ...options,
  });
}

export function useCancelJob() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (jobId: string) => api.jobs.cancel(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast.success('Job cancelled');
    },
    onError: (error: any) => {
      toast.error(`Failed to cancel job: ${error.response?.data?.detail || error.message}`);
    },
  });
}

export function useRetryJob() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (jobId: string) => api.jobs.retry(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast.success('Job retried');
    },
    onError: (error: any) => {
      toast.error(`Failed to retry job: ${error.response?.data?.detail || error.message}`);
    },
  });
}

// Logs
export function useLogs(params?: any) {
  return useQuery({
    queryKey: queryKeys.logs(params),
    queryFn: async () => (await api.logs(params)).data,
    refetchInterval: 5000,
  });
}

// Secrets
export function useSecrets() {
  return useQuery({
    queryKey: queryKeys.secrets,
    queryFn: async () => (await api.secrets.list()).data,
  });
}

// Environment Variables
export function useEnvVars() {
  return useQuery({
    queryKey: queryKeys.envVars,
    queryFn: async () => (await api.envVars.get()).data,
  });
}

// Cache
export function useClearCache() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => api.cache.clear(),
    onSuccess: () => {
      queryClient.invalidateQueries();
      toast.success('Cache cleared successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to clear cache: ${error.response?.data?.detail || error.message}`);
    },
  });
}

