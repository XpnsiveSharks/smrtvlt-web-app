import { useCallback, useEffect, useState } from 'react'
import { getBusinessActivity, type BusinessActivityResponse } from '../../../api/internal/business'
import { normalizeApiError, type EnhancedApiError } from '../../../api/http'

interface UseBusinessActivityResult {
  data: BusinessActivityResponse | null
  loading: boolean
  error: EnhancedApiError | null
  refetch: (hours?: number, limit?: number) => Promise<void>
  hours: number
  limit: number
}

export function useBusinessActivity(initialHours = 24, initialLimit = 50): UseBusinessActivityResult {
  const [data, setData] = useState<BusinessActivityResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<EnhancedApiError | null>(null)
  const [hours, setHours] = useState(initialHours)
  const [limit, setLimit] = useState(initialLimit)

  const fetchData = useCallback(async (newHours?: number, newLimit?: number) => {
    const targetHours = newHours ?? hours
    const targetLimit = newLimit ?? limit
    setHours(targetHours)
    setLimit(targetLimit)
    setLoading(true)
    setError(null)

    try {
      const response = await getBusinessActivity(targetHours, targetLimit)
      if (response) {
        setData(response)
      }
    } catch (fetchError) {
      setError(normalizeApiError(fetchError))
    } finally {
      setLoading(false)
    }
  }, [hours, limit])

  useEffect(() => {
    void fetchData()
  }, [fetchData])

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    hours,
    limit,
  }
}
