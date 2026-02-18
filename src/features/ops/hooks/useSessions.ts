import { useCallback, useEffect, useState } from 'react'
import { getSessionStats, revokeUserSessions } from '../../../api/internal/ops'
import type { SessionStatsResponse, RevokeSessionsResponse } from '../../../api/internal/ops'
import { normalizeApiError } from '../../../api/http'

export function useSessionStats() {
  const [data, setData] = useState<SessionStatsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setData(await getSessionStats())
    } catch (err) {
      setError(normalizeApiError(err).detail)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { void fetch() }, [fetch])
  return { data, loading, error, refetch: fetch }
}

export function useRevokeSessions() {
  const [result, setResult] = useState<RevokeSessionsResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const revoke = useCallback(async (userId: string) => {
    setLoading(true)
    setError(null)
    try {
      setResult(await revokeUserSessions(userId))
    } catch (err) {
      setError(normalizeApiError(err).detail)
    } finally {
      setLoading(false)
    }
  }, [])

  return { result, loading, error, revoke }
}
