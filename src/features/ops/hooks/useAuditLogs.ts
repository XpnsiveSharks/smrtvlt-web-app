import { useCallback, useEffect, useState } from 'react'
import { getAuditLogs, type AuditLogsResponse } from '../../../api/internal/ops'
import { normalizeApiError } from '../../../api/http'

interface UseAuditLogsParams {
  page: number
  limit: number
  action?: string
}

interface UseAuditLogsResult {
  data: AuditLogsResponse | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useAuditLogs({ page, limit, action }: UseAuditLogsParams): UseAuditLogsResult {
  const [data, setData] = useState<AuditLogsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAuditLogs = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await getAuditLogs(page, limit, action)
      setData(response)
    } catch (fetchError) {
      const normalizedError = normalizeApiError(fetchError)
      setError(normalizedError.detail)
    } finally {
      setLoading(false)
    }
  }, [action, limit, page])

  useEffect(() => {
    void fetchAuditLogs()
  }, [fetchAuditLogs])

  return {
    data,
    loading,
    error,
    refetch: fetchAuditLogs,
  }
}
