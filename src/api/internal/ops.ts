import { httpRequest } from '../http'

export type InternalPingResponse = {
  status?: string
  detail?: string
  [key: string]: unknown
}

export interface OpsSummaryResponse {
  generated_at?: string
  overall_status?: string
  business?: {
    users?: {
      total?: number
      new_today?: number
      new_this_week?: number
    }
    vaults?: {
      total?: number
      with_pin?: number
    }
  }
  security?: {
    status?: string
    alert_count?: number
    failed_unlocks_1h?: number
    failed_unlocks_24h?: number
    pin_lockouts_24h?: number
  }
  activity?: {
    period_hours?: number
    total_events?: number
    vault_unlocks?: number
    failed_unlocks?: number
    pin_operations?: number
    member_changes?: number
    state_changes?: number
  }
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

export function getPing(authToken?: string): Promise<InternalPingResponse | null> {
  return httpRequest<InternalPingResponse>('/api/internal/ping', {
    method: 'GET',
    authToken,
  })
}

export function getOpsSummary(): Promise<OpsSummaryResponse | null> {
  return httpRequest<OpsSummaryResponse>('/api/internal/ops/summary', {
    method: 'GET',
  })
}

export function getAuditLogs(page = 1, limit = 50, action?: string): Promise<AuditLogsResponse | null> {
  const params = new URLSearchParams()
  params.set('page', String(page))
  params.set('limit', String(limit))
  if (action && action.trim()) {
    params.set('action', action.trim())
  }

  return httpRequest<AuditLogsResponse>(`/api/internal/ops/audit?${params.toString()}`, {
    method: 'GET',
  })
}

/* ── API Keys ── */

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

export interface CreateApiKeyRequest {
  name: string
  expires_in_days: number | null
}

export interface CreatedApiKeyResponse {
  id: number
  key: string
  name: string
  expires_at: string | null
}

export function getApiKeys(activeOnly = true): Promise<ApiKeysListResponse | null> {
  const params = new URLSearchParams()
  params.set('active_only', String(activeOnly))

  return httpRequest<ApiKeysListResponse>(`/api/internal/ops/api-keys?${params.toString()}`, {
    method: 'GET',
  })
}

export function createApiKey(body: CreateApiKeyRequest): Promise<CreatedApiKeyResponse | null> {
  return httpRequest<CreatedApiKeyResponse>('/api/internal/ops/api-keys', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export function revokeApiKey(keyId: number): Promise<null> {
  return httpRequest<null>(`/api/internal/ops/api-keys/${keyId}`, {
    method: 'DELETE',
  })
}

// ── Diagnostics ──
export interface RedisDiagnosticsResponse {
  status: string
  connected: boolean
  memory_used_mb: number
  total_keys: number
  uptime_seconds: number
  checked_at: string
}

export interface WebSocketDiagnosticsResponse {
  total_users: number
  total_user_connections: number
  total_vaults: number
  subscriptions: number
  online_vaults: string[]
  checked_at: string
}

export interface DatabaseDiagnosticsResponse {
  status: string
  pool_size: number
  checked_out: number
  overflow: number
  checked_at: string
}

export function getRedisDiagnostics() {
  return httpRequest<RedisDiagnosticsResponse>('/api/internal/ops/diagnostics/redis', { method: 'GET' })
}
export function getWebSocketDiagnostics() {
  return httpRequest<WebSocketDiagnosticsResponse>('/api/internal/ops/diagnostics/websockets', { method: 'GET' })
}
export function getDatabaseDiagnostics() {
  return httpRequest<DatabaseDiagnosticsResponse>('/api/internal/ops/diagnostics/database', { method: 'GET' })
}

// ── Rate Limits ──
export interface RateLimitViolator {
  key: string
  current_count: number
  ttl_seconds: number
}
export interface RateLimitsResponse {
  total_active_keys: number
  top_violators: RateLimitViolator[]
  by_category: Record<string, number>
  checked_at: string
}
export function getRateLimits() {
  return httpRequest<RateLimitsResponse>('/api/internal/ops/rate-limits', { method: 'GET' })
}

// ── Sessions ──
export interface SessionUser {
  user_id: string
  token_count: number
}
export interface SessionStatsResponse {
  total_active_tokens: number
  top_users: SessionUser[]
  checked_at: string
}
export interface RevokeSessionsResponse {
  user_id: string
  sessions_revoked: number
}
export function getSessionStats() {
  return httpRequest<SessionStatsResponse>('/api/internal/ops/sessions/stats', { method: 'GET' })
}
export function revokeUserSessions(userId: string) {
  return httpRequest<RevokeSessionsResponse>(`/api/internal/ops/sessions/${userId}`, { method: 'DELETE' })
}

// ── Email Status ──
export interface EmailStatusResponse {
  service: string
  status: string
  sent_today: number
  failed_today: number
  note: string
  checked_at: string
}
export function getEmailStatus() {
  return httpRequest<EmailStatusResponse>('/api/internal/ops/notifications/email', { method: 'GET' })
}


