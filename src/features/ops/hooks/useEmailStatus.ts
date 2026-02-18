import { useCallback, useEffect, useState } from 'react'
import { getEmailStatus } from '../../../api/internal/ops'
import type { EmailStatusResponse } from '../../../api/internal/ops'
import { normalizeApiError } from '../../../api/http'

export function useEmailStatus() {
  const [data, setData] = useState<EmailStatusResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setData(await getEmailStatus())
    } catch (err) {
      setError(normalizeApiError(err).detail)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { void fetch() }, [fetch])
  return { data, loading, error, refetch: fetch }
}
