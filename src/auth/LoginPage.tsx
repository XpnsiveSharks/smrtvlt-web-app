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
    <div className="relative flex min-h-screen items-center justify-center px-4 overflow-hidden bg-app-bg">
      {/* P1: Atmospheric Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(191,255,0,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(191,255,0,0.01)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand/5 blur-[120px] pointer-events-none animate-in fade-in duration-1000" />
      
      <div className="w-full max-w-lg relative z-10 animate-in fade-in zoom-in-95 slide-in-from-bottom-8 duration-700">
        <Card className={`relative overflow-hidden border-app-border/30 shadow-2xl shadow-app-shadow/60 transition-all duration-500 focus-within:shadow-[0_0_40px_rgba(var(--color-brand),0.1)] focus-within:border-brand/20`}>
          {/* P5: State-Reactive Accent Border */}
          <div className={`absolute top-0 left-0 right-0 h-[2px] transition-all duration-700 ${
            errorDetail ? 'bg-app-danger shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 
            canContinue ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse' : 
            'bg-brand opacity-40'
          }`} />

          <div className="space-y-6 relative z-10">
            {/* P3: High-Signal Branding */}
            <div className="animate-in fade-in slide-in-from-left-4 duration-500 delay-200 fill-mode-both">
              <p className="font-display text-[10px] font-black uppercase tracking-[0.3em] text-brand opacity-80 leading-none mb-2">SmartVault Internal</p>
              <div className="flex items-center gap-4">
                <div className="h-8 w-1 bg-brand rounded-full" />
                <h1 className="font-display text-4xl font-black text-app-text tracking-tight">Admin Login</h1>
              </div>
              <p className="mt-3 text-sm text-app-muted opacity-60">
                Enter your secure admin token to initialize session.
              </p>
            </div>

            {/* P2: Elevated Input */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300 fill-mode-both">
              <div className="relative group">
                <input
                  id="admin-token"
                  type="password"
                  value={tokenInput}
                  onChange={event => {
                    setTokenInput(event.target.value)
                    setCanContinue(false)
                    setErrorDetail(null)
                  }}
                  className="w-full rounded-xl border border-app-border/40 bg-app-bg/50 px-4 py-3.5 font-mono text-lg text-app-text outline-none transition-all focus:border-brand/40 focus:ring-2 focus:ring-brand/20 shadow-inner placeholder:text-app-muted/30"
                  placeholder="••••••••••••••••"
                  autoComplete="off"
                />
                <div className="absolute inset-0 rounded-xl pointer-events-none border border-app-border/30 group-hover:border-app-border/50 transition-colors" />
              </div>
            </div>

            {isTesting && (
              <div className="animate-in fade-in duration-300">
                <LoadingState label="Validating node integrity..." />
              </div>
            )}

            {errorDetail && (
              <div className="animate-in shake-1 duration-300">
                <ErrorState title="Authorization Failed" detail={errorDetail} />
              </div>
            )}

            {canContinue && !errorDetail && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-center gap-3 animate-in zoom-in-95 duration-300">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-sm font-bold text-emerald-400 uppercase tracking-widest">Access Granted</p>
              </div>
            )}

            {/* P4: Staggered Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row pt-2 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-400 fill-mode-both">
              <Button 
                variant="secondary" 
                onClick={handleTestConnection} 
                isLoading={isTesting} 
                className="flex-1 h-12 text-[10px] font-black uppercase tracking-widest border-app-border/30 hover:bg-app-surface/50"
              >
                Test Node
              </Button>
              <Button 
                onClick={handleSaveAndContinue} 
                disabled={!canContinue || isTesting} 
                className={`flex-1 h-12 text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${
                  canContinue ? 'bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/20' : 'shadow-lg shadow-brand/10'
                }`}
              >
                Initialize Console
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
