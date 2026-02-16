import { useState, useEffect, useCallback, useRef } from 'react'
import { ApiError } from '../api/client'

interface UseApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
  isUnauthorized: boolean
}

interface UseApiResult<T> extends UseApiState<T> {
  refetch: () => void
  lastRefreshedAt: Date | null
}

/**
 * Shared data-fetching hook used by every screen.
 *
 * - Fetches on mount
 * - Exposes refetch() for manual refresh
 * - Optional intervalMs for auto-refresh
 * - Distinguishes 401 from other errors so screens can show the right message
 */
export function useApi<T>(
  fetchFn: () => Promise<T>,
  options?: { intervalMs?: number },
): UseApiResult<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: true,
    error: null,
    isUnauthorized: false,
  })
  const [lastRefreshedAt, setLastRefreshedAt] = useState<Date | null>(null)

  // Keep fetchFn stable across renders without requiring memo at call site
  const fetchFnRef = useRef(fetchFn)
  fetchFnRef.current = fetchFn

  const fetch = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null, isUnauthorized: false }))
    try {
      const data = await fetchFnRef.current()
      setState({ data, loading: false, error: null, isUnauthorized: false })
      setLastRefreshedAt(new Date())
    } catch (err) {
      const isUnauthorized = err instanceof ApiError && err.status === 401
      const message = err instanceof Error ? err.message : 'An unexpected error occurred'
      setState(prev => ({
        ...prev,
        loading: false,
        error: message,
        isUnauthorized,
      }))
    }
  }, [])

  // Initial fetch
  useEffect(() => {
    fetch()
  }, [fetch])

  // Auto-refresh
  useEffect(() => {
    if (!options?.intervalMs) return
    const id = setInterval(fetch, options.intervalMs)
    return () => clearInterval(id)
  }, [fetch, options?.intervalMs])

  return { ...state, refetch: fetch, lastRefreshedAt }
}