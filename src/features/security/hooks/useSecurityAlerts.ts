import { useCallback, useEffect, useState } from 'react'
import { getSecurityAlerts, type SecurityAlertsResponse } from '../../../api/internal/security'
import { normalizeApiError, type EnhancedApiError } from '../../../api/http'

interface UseSecurityAlertsResult {
  data: SecurityAlertsResponse | null
  loading: boolean
  error: EnhancedApiError | null
  refetch: () => Promise<void>
}

export function useSecurityAlerts(): UseSecurityAlertsResult {
  const [data, setData] = useState<SecurityAlertsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<EnhancedApiError | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await getSecurityAlerts()
      if (response) {
        setData(response)
      }
    } catch (fetchError) {
      setError(normalizeApiError(fetchError))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchData()
  }, [fetchData])

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  }
}
