import { ENV } from '@/config/env';

export interface ApiOptions extends RequestInit {
  params?: Record<string, string>;
  tenantId?: string;
  channel?: string;
}

export async function apiRequest<T = any>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const { params, tenantId, channel = 'web', headers: customHeaders, ...fetchOptions } = options;

  let url = endpoint.startsWith('http') ? endpoint : `${ENV.API_BASE_URL.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;

  if (params) {
    const searchParams = new URLSearchParams(params);
    url += (url.includes('?') ? '&' : '?') + searchParams.toString();
  }

  const token = typeof window !== 'undefined' ? localStorage.getItem('omni_token') : null;
  const userJson = typeof window !== 'undefined' ? localStorage.getItem('omni_user') : null;
  let storedTenantId = tenantId;

  if (!storedTenantId && userJson) {
    try {
      const user = JSON.parse(userJson);
      storedTenantId = user.tenantId || user['custom:tenant_id'] || 'slt';
    } catch {
      storedTenantId = 'slt';
    }
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-channel': channel,
    ...(storedTenantId ? { 'x-tenant-id': storedTenantId } : {}),
    ...(token ? { Authorization: token.startsWith('Bearer ') ? token : `Bearer ${token}` } : {}),
    ...(customHeaders as Record<string, string>),
  };

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    });

    const data = await response.json();
    if (!response.ok) {
      const errorMsg = data?.error?.message || data?.error || `HTTP ${response.status} Error`;
      throw new Error(errorMsg);
    }
    return data as T;
  } catch (err: any) {
    console.warn(`[apiClient] Request to ${url} failed:`, err.message);
    throw err;
  }
}

export const apiClient = {
  get: <T = any>(endpoint: string, options?: ApiOptions) =>
    apiRequest<T>(endpoint, { ...options, method: 'GET' }),
  post: <T = any>(endpoint: string, body?: any, options?: ApiOptions) =>
    apiRequest<T>(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
  put: <T = any>(endpoint: string, body?: any, options?: ApiOptions) =>
    apiRequest<T>(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) }),
  delete: <T = any>(endpoint: string, options?: ApiOptions) =>
    apiRequest<T>(endpoint, { ...options, method: 'DELETE' }),
};
