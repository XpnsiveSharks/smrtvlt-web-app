import { useCallback, useEffect, useState } from 'react'
import { getRedisDiagnostics, getWebSocketDiagnostics, getDatabaseDiagnostics, type RedisDiagnosticsResponse, type WebSocketDiagnosticsResponse, type DatabaseDiagnosticsResponse } from '../../../api/internal/ops'
import { normalizeApiError } from '../../../api/http'

export function useRedisDiagnostics() {
  const [data, setData] = useState<RedisDiagnosticsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setData(await getRedisDiagnostics())
    } catch (err) {
      setError(normalizeApiError(err).detail)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { void fetch() }, [fetch])
  return { data, loading, error, refetch: fetch }
}

export function useWebSocketDiagnostics() {
  const [data, setData] = useState<WebSocketDiagnosticsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setData(await getWebSocketDiagnostics())
    } catch (err) {
      setError(normalizeApiError(err).detail)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { void fetch() }, [fetch])
  return { data, loading, error, refetch: fetch }
}

export function useDatabaseDiagnostics() {
  const [data, setData] = useState<DatabaseDiagnosticsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setData(await getDatabaseDiagnostics())
    } catch (err) {
      setError(normalizeApiError(err).detail)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { void fetch() }, [fetch])
  return { data, loading, error, refetch: fetch }
}
