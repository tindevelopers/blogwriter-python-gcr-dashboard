import axios, { AxiosInstance } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://blog-writer-api-dev-613248238610.europe-west9.run.app';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Request interceptor for authentication
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - just log in development
      console.warn('API returned 401 - authentication may be required');
      // TODO: Implement proper auth flow
      // For now, allow dashboard to load without backend auth
    }
    return Promise.reject(error);
  }
);

export default apiClient;

// API endpoints
export const api = {
  // Health & Status
  health: () => apiClient.get('/'),
  status: () => apiClient.get('/api/v1/admin/status'),
  
  // AI Providers
  providers: {
    list: () => apiClient.get('/api/v1/ai/providers/list'),
    configure: (data: any) => apiClient.post('/api/v1/ai/providers/configure', data),
    test: (data: any) => apiClient.post('/api/v1/ai/providers/test', data),
    health: () => apiClient.get('/api/v1/ai/providers/health'),
    stats: () => apiClient.get('/api/v1/ai/providers/stats'),
    switch: (data: any) => apiClient.post('/api/v1/ai/providers/switch', data),
    getProvider: (provider: string) => apiClient.get(`/api/v1/ai/providers/${provider}`),
  },
  
  // Usage & Costs
  usage: () => apiClient.get('/api/v1/admin/ai/usage'),
  costs: () => apiClient.get('/api/v1/admin/ai/costs'),
  cacheStats: () => apiClient.get('/api/v1/admin/ai/cache-stats'),
  
  // Jobs
  jobs: {
    list: (params?: any) => apiClient.get('/api/v1/admin/jobs', { params }),
    get: (jobId: string) => apiClient.get(`/api/v1/admin/jobs/${jobId}`),
    cancel: (jobId: string) => apiClient.post(`/api/v1/admin/jobs/${jobId}/cancel`),
    retry: (jobId: string) => apiClient.post(`/api/v1/admin/jobs/${jobId}/retry`),
  },
  
  // Logs
  logs: (params?: any) => apiClient.get('/api/v1/admin/logs', { params }),
  logsStream: () => apiClient.get('/api/v1/admin/logs/stream'),
  
  // Secrets
  secrets: {
    list: () => apiClient.get('/api/v1/admin/secrets'),
    get: (name: string) => apiClient.get(`/api/v1/admin/secrets/${name}`),
    create: (data: any) => apiClient.post('/api/v1/admin/secrets', data),
    update: (name: string, data: any) => apiClient.put(`/api/v1/admin/secrets/${name}`, data),
    delete: (name: string) => apiClient.delete(`/api/v1/admin/secrets/${name}`),
    sync: () => apiClient.post('/api/v1/admin/secrets/sync'),
  },
  
  // Environment Variables
  envVars: {
    get: () => apiClient.get('/api/v1/admin/env-vars'),
    update: (data: any) => apiClient.put('/api/v1/admin/env-vars', data),
  },
  
  // Cache
  cache: {
    stats: () => apiClient.get('/api/v1/cache/stats'),
    clear: () => apiClient.post('/api/v1/cache/clear'),
  },
  
  // Blog Generation (for testing)
  blog: {
    generateEnhanced: (data: any, async_mode = true) => 
      apiClient.post('/api/v1/blog/generate-enhanced', data, { params: { async_mode } }),
    getJobStatus: (jobId: string) => apiClient.get(`/api/v1/blog/jobs/${jobId}`),
  },
};

