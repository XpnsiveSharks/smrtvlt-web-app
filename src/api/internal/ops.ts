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

export function getPing(authToken?: string): Promise<InternalPingResponse | null> {
  return httpRequest<InternalPingResponse>('/internal/ping', {
    method: 'GET',
    authToken,
  })
}

export function getOpsSummary(): Promise<OpsSummaryResponse | null> {
  return httpRequest<OpsSummaryResponse>('/internal/ops/summary', {
    method: 'GET',
  })
}
