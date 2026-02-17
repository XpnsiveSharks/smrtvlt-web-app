import { useCallback, useEffect, useState } from 'react'
import { getApiKeys, type ApiKeysListResponse } from '../../../api/internal/ops'
import { normalizeApiError } from '../../../api/http'

interface UseApiKeysResult {
  data: ApiKeysListResponse | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useApiKeys(activeOnly = true): UseApiKeysResult {
  const [data, setData] = useState<ApiKeysListResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchApiKeys = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await getApiKeys(activeOnly)
      setData(response)
    } catch (fetchError) {
      const normalizedError = normalizeApiError(fetchError)
      setError(normalizedError.detail)
    } finally {
      setLoading(false)
    }
  }, [activeOnly])

  useEffect(() => {
    void fetchApiKeys()
  }, [fetchApiKeys])

  return {
    data,
    loading,
    error,
    refetch: fetchApiKeys,
  }
}
