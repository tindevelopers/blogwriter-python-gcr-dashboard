import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  query, 
  where, 
  orderBy,
  limit,
  getDocs,
  Timestamp,
  DocumentData 
} from 'firebase/firestore';
import { db } from './config';

// Types for Firestore documents
export interface AIProviderConfig {
  provider_type: 'openai' | 'anthropic' | 'deepseek' | 'google' | 'cohere' | 'dataforseo';
  enabled: boolean;
  default_model: string;
  priority: number;
  max_concurrent_requests?: number;
  secret_name: string;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface LiteLLMConfig {
  enabled: boolean;
  proxy_url: string;
  master_key_secret: string;
  cache_enabled: boolean;
  cache_ttl: number;
  fallback_enabled: boolean;
  load_balancing: 'round-robin' | 'weighted' | 'least-busy';
  updated_at: Timestamp;
}

export interface GeneralConfig {
  default_mode: 'quick_generate' | 'multi_phase';
  default_word_count: number;
  default_tone: string;
  max_concurrent_jobs: number;
  enable_fact_checking: boolean;
  enable_citations: boolean;
}

export interface DailyUsage {
  date: string;
  total_requests: number;
  total_tokens: number;
  total_cost: number;
  by_provider: Record<string, {
    requests: number;
    tokens: number;
    cost: number;
    avg_latency_ms: number;
  }>;
}

export interface AuditLog {
  timestamp: Timestamp;
  user_id: string;
  action: string;
  details: DocumentData;
  ip_address?: string;
}

// AI Provider Configuration
export async function getAIProviderConfig(provider: string): Promise<AIProviderConfig | null> {
  const docRef = doc(db, 'backend_config', 'ai_providers', provider, 'config');
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() as AIProviderConfig : null;
}

export async function getAllAIProviders(): Promise<Record<string, AIProviderConfig>> {
  const providers: Record<string, AIProviderConfig> = {};
  const providerTypes = ['openai', 'anthropic', 'deepseek', 'google', 'cohere', 'dataforseo'];
  
  for (const provider of providerTypes) {
    const config = await getAIProviderConfig(provider);
    if (config) {
      providers[provider] = config;
    }
  }
  
  return providers;
}

export async function saveAIProviderConfig(provider: string, config: Partial<AIProviderConfig>): Promise<void> {
  const docRef = doc(db, 'backend_config', 'ai_providers', provider, 'config');
  await setDoc(docRef, {
    ...config,
    updated_at: Timestamp.now()
  }, { merge: true });
}

// LiteLLM Configuration
export async function getLiteLLMConfig(): Promise<LiteLLMConfig | null> {
  const docRef = doc(db, 'backend_config', 'litellm');
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() as LiteLLMConfig : null;
}

export async function saveLiteLLMConfig(config: Partial<LiteLLMConfig>): Promise<void> {
  const docRef = doc(db, 'backend_config', 'litellm');
  await setDoc(docRef, {
    ...config,
    updated_at: Timestamp.now()
  }, { merge: true });
}

// General Configuration
export async function getGeneralConfig(): Promise<GeneralConfig | null> {
  const docRef = doc(db, 'backend_config', 'general');
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() as GeneralConfig : null;
}

export async function saveGeneralConfig(config: Partial<GeneralConfig>): Promise<void> {
  const docRef = doc(db, 'backend_config', 'general');
  await setDoc(docRef, config, { merge: true });
}

// Usage Metrics
export async function getDailyUsage(date: string): Promise<DailyUsage | null> {
  const docRef = doc(db, 'usage_metrics', 'daily', date, 'data');
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() as DailyUsage : null;
}

export async function getUsageRange(startDate: string, endDate: string): Promise<DailyUsage[]> {
  const usageRef = collection(db, 'usage_metrics', 'daily');
  const q = query(
    usageRef,
    where('date', '>=', startDate),
    where('date', '<=', endDate),
    orderBy('date', 'desc')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data() as DailyUsage);
}

// Audit Logs
export async function createAuditLog(log: Omit<AuditLog, 'timestamp'>): Promise<void> {
  const logsRef = collection(db, 'audit_logs');
  await setDoc(doc(logsRef), {
    ...log,
    timestamp: Timestamp.now()
  });
}

export async function getRecentAuditLogs(count: number = 50): Promise<AuditLog[]> {
  const logsRef = collection(db, 'audit_logs');
  const q = query(
    logsRef,
    orderBy('timestamp', 'desc'),
    limit(count)
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data() as AuditLog);
}

