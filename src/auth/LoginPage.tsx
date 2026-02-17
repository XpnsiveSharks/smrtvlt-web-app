import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPing } from '../api/internal/ops'
import { normalizeApiError } from '../api/http'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { ErrorState } from '../components/ui/ErrorState'
import { LoadingState } from '../components/ui/LoadingState'
import { hasAdminToken, setAdminToken } from './tokenStore'

export function LoginPage() {
  const navigate = useNavigate()
  const [tokenInput, setTokenInput] = useState('')
  const [isTesting, setIsTesting] = useState(false)
  const [canContinue, setCanContinue] = useState(false)
  const [errorDetail, setErrorDetail] = useState<string | null>(null)

  const trimmedToken = tokenInput.trim()

  useEffect(() => {
    if (hasAdminToken()) {
      navigate('/ops/summary', { replace: true })
    }
  }, [navigate])

  async function handleTestConnection() {
    if (!trimmedToken) {
      setCanContinue(false)
      setErrorDetail('Admin token is required.')
      return
    }

    setIsTesting(true)
    setCanContinue(false)
    setErrorDetail(null)

    try {
      await getPing(trimmedToken)
      setCanContinue(true)
    } catch (error) {
      const normalizedError = normalizeApiError(error)
      setErrorDetail(normalizedError.detail)
    } finally {
      setIsTesting(false)
    }
  }

  function handleSaveAndContinue() {
    if (!canContinue || !trimmedToken) {
      return
    }

    setAdminToken(trimmedToken)
    navigate('/ops/summary', { replace: true })
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-lg">
        <p className="font-display text-xs uppercase tracking-[0.2em] text-brand">SmartVault Internal</p>
        <h1 className="mt-2 font-display text-3xl text-app-text">Admin Login</h1>
        <p className="mt-2 text-sm text-app-muted">
          Enter your admin token, test it against <code>/internal/ping</code>, then continue.
        </p>

        <label className="mt-6 block text-sm text-app-muted" htmlFor="admin-token">
          X-Admin-Token
        </label>
        <input
          id="admin-token"
          type="password"
          value={tokenInput}
          onChange={event => {
            setTokenInput(event.target.value)
            setCanContinue(false)
            setErrorDetail(null)
          }}
          className="mt-2 w-full rounded-lg border border-app-border bg-app-surface-2 px-3 py-2 text-sm text-app-text outline-none transition focus:border-brand"
          placeholder="Paste admin token"
          autoComplete="off"
        />

        {isTesting && <LoadingState label="Testing connection..." />}

        {errorDetail && <ErrorState title="Connection failed" detail={errorDetail} />}

        {canContinue && !errorDetail && (
          <p className="rounded-lg border border-brand/40 bg-brand/10 p-3 text-sm text-lime-100">
            Connection succeeded. You can now save and continue.
          </p>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          <Button variant="secondary" onClick={handleTestConnection} isLoading={isTesting}>
            Test connection
          </Button>
          <Button onClick={handleSaveAndContinue} disabled={!canContinue || isTesting}>
            Save &amp; Continue
          </Button>
        </div>
      </Card>
    </div>
  )
}
