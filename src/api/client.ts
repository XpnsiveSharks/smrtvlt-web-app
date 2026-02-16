import { config } from '../config'

// ---------------------------------------------------------------------------
// Base fetch — attaches auth header, throws on non-2xx
// ---------------------------------------------------------------------------

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${config.apiBaseUrl}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Admin-Token': config.adminToken,
      ...options?.headers,
    },
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({ detail: res.statusText }))
    const error = new ApiError(res.status, body.detail ?? res.statusText)
    throw error
  }

  // 204 No Content — return empty object
  if (res.status === 204) return {} as T

  return res.json() as Promise<T>
}

export class ApiError extends Error {
  readonly status: number

  constructor(
    status: number,
    message: string,
  ) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

// ---------------------------------------------------------------------------
// Response types
// ---------------------------------------------------------------------------

export interface BusinessOverviewResponse {
  generated_at: string
  users: {
    total: number
    new_today: number
    new_this_week: number
  }
  vaults: {
    total: number
    with_pin: number
    by_status: Record<string, number>
  }
  members: {
    total_authorizations: number
    by_role: Record<string, number>
  }
}

export interface DailyCount {
  date: string
  count: number
}

export interface TrendSeries {
  daily: DailyCount[]
  total: number
  average_per_day: number
  peak_date: string | null
  peak_count: number
  change_pct: number | null
}

export interface BusinessTrendsResponse {
  generated_at: string
  period_days: number
  period_start: string
  period_end: string
  user_signups: TrendSeries
  vault_provisioning: TrendSeries
}

export interface SecurityAlert {
  type: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  count: number
  threshold: number
  window: string
}

export interface SecurityAlertsResponse {
  generated_at: string
  status: 'ok' | 'warning' | 'critical'
  active_alerts: SecurityAlert[]
  last_24h: {
    failed_unlocks_1h: number
    failed_unlocks_24h: number
    pin_lockouts_24h: number
  }
}

export interface OpsSummaryResponse {
  generated_at: string
  overall_status: 'ok' | 'warning' | 'critical'
  business: {
    users: { total: number; new_today: number; new_this_week: number }
    vaults: { total: number; with_pin: number; by_status: Record<string, number> }
    members: { total_authorizations: number; by_role: Record<string, number> }
  }
  security: {
    status: 'ok' | 'warning' | 'critical'
    failed_unlocks_1h: number
    failed_unlocks_24h: number
    pin_lockouts_24h: number
    alert_count: number
  }
  activity: {
    period_hours: number
    total_events: number
    vault_unlocks: number
    failed_unlocks: number
    pin_operations: number
    member_changes: number
    state_changes: number
  }
}

export interface SessionStatsResponse {
  total_active_tokens: number
  top_users: { user_id: string; token_count: number }[]
  checked_at: string
}

export interface RevokeSessionsResponse {
  user_id: string
  sessions_revoked: number
}

export interface RateLimitsResponse {
  total_active_keys: number
  top_violators: { key: string; current_count: number; ttl_seconds: number }[]
  by_category: Record<string, number>
  checked_at: string
}

export interface DiagnosticsRedisResponse {
  status: string
  connected: boolean
  memory_used_mb: number
  total_keys: number
  uptime_seconds: number
  checked_at: string
}

export interface DiagnosticsWebSocketResponse {
  total_users: number
  total_user_connections: number
  total_vaults: number
  subscriptions: number
  online_vaults: string[]
  checked_at: string
}

export interface DiagnosticsDatabaseResponse {
  status: string
  pool_size: number
  checked_out: number
  overflow: number
  checked_at: string
}

export interface EmailStatusResponse {
  service: string
  status: string
  sent_today: number
  failed_today: number
  note: string
  checked_at: string
}

export interface AuditLogItem {
  id: number
  action: string
  target_type: string
  target_id: string | null
  details: Record<string, unknown> | null
  ip_address: string | null
  created_at: string
}

export interface AuditLogsResponse {
  items: AuditLogItem[]
  total: number
  page: number
  pages: number
}

export interface ApiKeyItem {
  id: number
  name: string
  created_by: string
  last_used_at: string | null
  expires_at: string | null
  is_active: boolean
  created_at: string
}

export interface ApiKeysListResponse {
  items: ApiKeyItem[]
}

export interface CreatedApiKeyResponse {
  id: number
  key: string
  name: string
  expires_at: string | null
}

// ---------------------------------------------------------------------------
// API client methods
// ---------------------------------------------------------------------------

export const client = {
  // Business
  getBusinessOverview: () =>
    apiFetch<BusinessOverviewResponse>('/internal/business/overview'),

  getBusinessTrends: (days = 30) =>
    apiFetch<BusinessTrendsResponse>(`/internal/business/trends?days=${days}`),

  getActivity: (hours = 24, limit = 50) =>
    apiFetch<unknown>(`/internal/business/activity?hours=${hours}&limit=${limit}`),

  // Security
  getSecurityAlerts: () =>
    apiFetch<SecurityAlertsResponse>('/internal/security/alerts'),

  // Ops
  getOpsSummary: () =>
    apiFetch<OpsSummaryResponse>('/internal/ops/summary'),

  getSessionStats: () =>
    apiFetch<SessionStatsResponse>('/internal/ops/sessions/stats'),

  revokeUserSessions: (userId: string) =>
    apiFetch<RevokeSessionsResponse>(`/internal/ops/sessions/${userId}`, {
      method: 'DELETE',
    }),

  getRateLimits: () =>
    apiFetch<RateLimitsResponse>('/internal/ops/rate-limits'),

  getRedisDignostics: () =>
    apiFetch<DiagnosticsRedisResponse>('/internal/ops/diagnostics/redis'),

  getWebSocketDiagnostics: () =>
    apiFetch<DiagnosticsWebSocketResponse>('/internal/ops/diagnostics/websockets'),

  getDatabaseDiagnostics: () =>
    apiFetch<DiagnosticsDatabaseResponse>('/internal/ops/diagnostics/database'),

  getEmailStatus: () =>
    apiFetch<EmailStatusResponse>('/internal/ops/notifications/email'),

  getAuditLogs: (page = 1, limit = 50, action?: string) => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) })
    if (action) params.set('action', action)
    return apiFetch<AuditLogsResponse>(`/internal/ops/audit?${params}`)
  },

  listApiKeys: (activeOnly = true) =>
    apiFetch<ApiKeysListResponse>(`/internal/ops/api-keys?active_only=${activeOnly}`),

  createApiKey: (name: string, expiresInDays?: number) =>
    apiFetch<CreatedApiKeyResponse>('/internal/ops/api-keys', {
      method: 'POST',
      body: JSON.stringify({
        name,
        ...(expiresInDays !== undefined && { expires_in_days: expiresInDays }),
      }),
    }),

  revokeApiKey: (keyId: number) =>
    apiFetch<void>(`/internal/ops/api-keys/${keyId}`, { method: 'DELETE' }),
}
