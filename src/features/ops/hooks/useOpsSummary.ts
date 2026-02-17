import { useCallback, useEffect, useState } from 'react'
import { getOpsSummary, type OpsSummaryResponse } from '../../../api/internal/ops'
import { normalizeApiError } from '../../../api/http'

interface UseOpsSummaryResult {
  data: OpsSummaryResponse | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useOpsSummary(): UseOpsSummaryResult {
  const [data, setData] = useState<OpsSummaryResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSummary = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await getOpsSummary()
      setData(response)
    } catch (fetchError) {
      const normalizedError = normalizeApiError(fetchError)
      setError(normalizedError.detail)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchSummary()
  }, [fetchSummary])

  return {
    data,
    loading,
    error,
    refetch: fetchSummary,
  }
}
