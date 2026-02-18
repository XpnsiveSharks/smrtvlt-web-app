import { httpRequest } from '../http'

// ── Security Alerts ──
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

export function getSecurityAlerts(): Promise<SecurityAlertsResponse | null> {
  return httpRequest<SecurityAlertsResponse>('/api/internal/security/alerts', {
    method: 'GET',
  })
}
