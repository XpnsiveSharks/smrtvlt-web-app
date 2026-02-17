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
