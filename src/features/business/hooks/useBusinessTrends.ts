import { useCallback, useEffect, useState } from 'react'
import { getBusinessTrends, type BusinessTrendsResponse } from '../../../api/internal/business'
import { normalizeApiError, type EnhancedApiError } from '../../../api/http'

interface UseBusinessTrendsResult {
  data: BusinessTrendsResponse | null
  loading: boolean
  error: EnhancedApiError | null
  refetch: (days?: number) => Promise<void>
  days: number
}

export function useBusinessTrends(initialDays = 30): UseBusinessTrendsResult {
  const [data, setData] = useState<BusinessTrendsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<EnhancedApiError | null>(null)
  const [days, setDays] = useState(initialDays)

  const fetchData = useCallback(async (newDays?: number) => {
    const targetDays = newDays ?? days
    setDays(targetDays)
    setLoading(true)
    setError(null)

    try {
      const response = await getBusinessTrends(targetDays)
      if (response) {
        setData(response)
      }
    } catch (fetchError) {
      setError(normalizeApiError(fetchError))
    } finally {
      setLoading(false)
    }
  }, [days])

  useEffect(() => {
    void fetchData()
  }, [fetchData])

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    days,
  }
}
