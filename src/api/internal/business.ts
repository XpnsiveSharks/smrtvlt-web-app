import { httpRequest } from '../http'

// ── Business Overview ──
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

export function getBusinessOverview(): Promise<BusinessOverviewResponse | null> {
  return httpRequest<BusinessOverviewResponse>('/api/internal/business/overview', {
    method: 'GET',
  })
}

// ── Business Trends ──
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

export function getBusinessTrends(days = 30): Promise<BusinessTrendsResponse | null> {
  return httpRequest<BusinessTrendsResponse>(`/api/internal/business/trends?days=${days}`, {
    method: 'GET',
  })
}

// ── Business Activity ──
export interface ActivityEntry {
  id: string
  vault_id: string
  user_id: string | null
  action: string
  method: string
  metadata: Record<string, unknown> | null
  created_at: string
}

export interface ActivitySummary {
  total_events: number
  vault_unlocks: number
  failed_unlocks: number
  pin_operations: number
  member_changes: number
  state_changes: number
}

export interface BusinessActivityResponse {
  generated_at: string
  period_hours: number
  summary: ActivitySummary
  entries: ActivityEntry[]
}

export function getBusinessActivity(hours = 24, limit = 50): Promise<BusinessActivityResponse | null> {
  return httpRequest<BusinessActivityResponse>(
    `/api/internal/business/activity?hours=${hours}&limit=${limit}`,
    {
      method: 'GET',
    },
  )
}
