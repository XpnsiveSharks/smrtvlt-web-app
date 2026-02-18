import { useCallback, useEffect, useState } from 'react'
import { getBusinessOverview, type BusinessOverviewResponse } from '../../../api/internal/business'
import { normalizeApiError, type EnhancedApiError } from '../../../api/http'

interface UseBusinessOverviewResult {
  data: BusinessOverviewResponse | null
  loading: boolean
  error: EnhancedApiError | null
  refetch: () => Promise<void>
}

export function useBusinessOverview(): UseBusinessOverviewResult {
  const [data, setData] = useState<BusinessOverviewResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<EnhancedApiError | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await getBusinessOverview()
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
