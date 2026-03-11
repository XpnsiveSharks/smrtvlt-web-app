import { type FormEvent, useCallback, useState, type JSX } from 'react'
import { Check, Copy, CheckCircle2, Key } from 'lucide-react'
import {
  createApiKey,
  revokeApiKey,
  type CreatedApiKeyResponse,
} from '../../api/internal/ops'
import { normalizeApiError } from '../../api/http'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { ErrorState } from '../../components/ui/ErrorState'
import { LoadingState } from '../../components/ui/LoadingState'
import { useApiKeys } from './hooks/useApiKeys'

function formatRelativeTime(isoString: string): string {
  try {
    const date = new Date(isoString)
    const now = new Date()
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (seconds < 0) return 'just now'
    if (seconds < 60) return `${seconds}s ago`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  } catch {
    return isoString
  }
}

function formatDate(value: string | null | undefined, showRelative = false): JSX.Element | string {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  
  const isoFormat = date.toISOString()
  const relativeTime = formatRelativeTime(isoFormat)
  const displayText = showRelative ? relativeTime : date.toLocaleString()
  
  // Return a tooltip-enabled element for relative time
  if (showRelative) {
    return (
      <span 
        className="cursor-help hover:text-brand transition-colors"
        title={isoFormat}
      >
        {displayText}
      </span>
    )
  }
  
  return displayText
}

/* ── Create Key Modal ── */

interface CreateKeyModalProps {
  onClose: () => void
  onCreated: (result: CreatedApiKeyResponse) => void
}

function CreateKeyModal({ onClose, onCreated }: CreateKeyModalProps) {
  const [name, setName] = useState('')
  const [expiresInDays, setExpiresInDays] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const trimmedName = name.trim()
    if (!trimmedName) return

    setSubmitting(true)
    setError(null)

    try {
      const parsed = expiresInDays.trim() ? Number.parseInt(expiresInDays, 10) : null
      const expires = parsed && !Number.isNaN(parsed) && parsed > 0 ? parsed : null

      const result = await createApiKey({ name: trimmedName, expires_in_days: expires })
      if (result) {
        onCreated(result)
      }
    } catch (err) {
      setError(normalizeApiError(err).detail)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-app-bg/60 backdrop-blur-md" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-2xl border border-app-border border-t-app-border/50 bg-gradient-to-b from-app-surface to-app-surface-2 p-8 shadow-2xl shadow-black/60"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
            <Key size={20} />
          </div>
          <h2 className="font-display text-xl text-app-text">Create API Key</h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={(e) => void handleSubmit(e)}>
          <label className="flex flex-col gap-2">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-app-muted opacity-70">Name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. mobile-app-prod"
              required
                className="rounded-xl border border-app-border/30 bg-app-surface-2 px-4 py-3 text-app-text outline-none transition-all duration-200 placeholder:text-app-muted/40 focus:border-brand/50 focus:ring-2 focus:ring-brand/20"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-app-muted opacity-70">Expires in (days, optional)</span>
            <input
              type="number"
              min="1"
              value={expiresInDays}
              onChange={(e) => setExpiresInDays(e.target.value)}
              placeholder="Leave empty for no expiry"
                className="rounded-xl border border-app-border/30 bg-app-surface-2 px-4 py-3 font-mono text-app-text outline-none transition-all duration-200 placeholder:text-app-muted/40 focus:border-brand/50 focus:ring-2 focus:ring-brand/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </label>

          {error && <ErrorState title="Failed to create key" detail={error} />}

          <div className="flex items-center justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={submitting}
               className="hover:bg-app-surface/50 border-transparent"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={submitting}
              className="min-w-[120px] shadow-lg shadow-brand/10"
            >
              Create
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

/* ── One-Time Key Dialog ── */

interface KeyRevealDialogProps {
  result: CreatedApiKeyResponse
  onClose: () => void
}

function KeyRevealDialog({ result, onClose }: KeyRevealDialogProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(result.key)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback: select the text for manual copy
    }
  }, [result.key])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-app-bg/60 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-app-border border-t-app-border/50 bg-gradient-to-b from-app-surface to-app-surface-2 p-8 shadow-2xl shadow-black/60">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand/10 text-brand">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="font-display text-2xl text-app-text">API Key Created</h2>
          <p className="mt-2 text-sm text-app-muted">
            Copy this key now. It will not be shown again.
          </p>
        </div>

        <div className="group relative mt-6 flex items-center gap-2">
          <code className="flex-1 break-all rounded-xl border border-brand/30 bg-brand/5 px-4 py-3 font-mono text-sm text-brand transition-colors group-hover:bg-brand/10">
            {result.key}
          </code>
          <Button
            variant="secondary"
            onClick={() => void handleCopy()}
            className={`min-w-[100px] transition-all active:scale-95 ${copied ? 'border-brand/50 bg-brand/10 text-brand' : ''}`}
          >
            {copied ? (
              <>
                <Check size={16} className="mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Copy size={16} className="mr-2" />
                Copy
              </>
            )}
          </Button>
        </div>

        <div className="mt-8 rounded-xl border border-app-border bg-app-surface/30 p-4">
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="font-medium text-app-muted">Name</dt>
              <dd className="mt-1 font-semibold text-app-text">{result.name}</dd>
            </div>
            <div>
              <dt className="font-medium text-app-muted">Expires</dt>
              <dd className="mt-1 font-semibold text-app-text">
                {result.expires_at ? formatDate(result.expires_at, true) : 'Never'}
              </dd>
            </div>
          </dl>
        </div>

        <div className="mt-8 flex justify-center">
          <Button onClick={onClose} className="min-w-[120px]">
            Done
          </Button>
        </div>
      </div>
    </div>
  )
}

/* ── Revoke Confirmation Dialog ── */

interface RevokeDialogProps {
  keyName: string
  onConfirm: () => void
  onCancel: () => void
  revoking: boolean
}

function RevokeDialog({ keyName, onConfirm, onCancel, revoking }: RevokeDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-app-bg/60 backdrop-blur-sm" onClick={onCancel}>
      <div
        className="w-full max-w-sm rounded-2xl border border-app-border border-t-app-border/50 bg-gradient-to-b from-app-surface to-app-surface-2 p-6 shadow-2xl shadow-black/60"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-display text-xl text-app-text text-app-danger">Revoke API Key</h2>
        <p className="mt-2 text-sm text-app-muted">
          Are you sure you want to revoke <strong className="text-app-text">{keyName}</strong>? This cannot be undone.
        </p>

        <div className="mt-6 flex items-center justify-end gap-2">
          <Button variant="secondary" onClick={onCancel} disabled={revoking}>
            Cancel
          </Button>
          <Button
            className="bg-app-danger text-white hover:bg-red-600"
            onClick={onConfirm}
            isLoading={revoking}
          >
            Revoke
          </Button>
        </div>
      </div>
    </div>
  )
}

/* ── Main Page ── */

export function OpsApiKeysPage() {
  const { data, loading, error, refetch } = useApiKeys(true)

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [createdKey, setCreatedKey] = useState<CreatedApiKeyResponse | null>(null)
  const [revokeTarget, setRevokeTarget] = useState<{ id: number; name: string } | null>(null)
  const [revoking, setRevoking] = useState(false)
  const [revokeError, setRevokeError] = useState<string | null>(null)

  function handleCreated(result: CreatedApiKeyResponse) {
    setShowCreateModal(false)
    setCreatedKey(result)
    void refetch()
  }

  function handleKeyRevealClose() {
    setCreatedKey(null)
  }

  async function handleRevoke() {
    if (!revokeTarget) return

    setRevoking(true)
    setRevokeError(null)

    try {
      await revokeApiKey(revokeTarget.id)
      setRevokeTarget(null)
      void refetch()
    } catch (err) {
      setRevokeError(normalizeApiError(err).detail)
    } finally {
      setRevoking(false)
    }
  }

  return (
    <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl tracking-tight text-app-text border-l-2 border-brand pl-4">API Keys</h1>
          <p className="mt-1 text-sm text-app-muted ml-4 opacity-80">
            Manage API keys for programmatic access.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={() => void refetch()} isLoading={loading} className="border-app-border/30 hover:bg-app-surface/50">
            Refresh
          </Button>
          <Button onClick={() => setShowCreateModal(true)} className="shadow-lg shadow-brand/10">Create Key</Button>
        </div>
      </header>

      {revokeError && (
        <ErrorState title="Failed to revoke key" detail={revokeError} />
      )}

      <div className="relative group/card">
        {/* Decorative Gradient Bleed */}
        <div className="absolute -top-[1px] left-10 right-10 h-[2px] bg-gradient-to-r from-transparent via-brand/40 to-transparent z-10 opacity-0 group-hover/card:opacity-100 transition-opacity duration-1000" />
        
        <Card className="p-0 overflow-hidden border-app-border/30 shadow-2xl shadow-black/60">
          {loading && <LoadingState label="Loading API keys..." />}

          {!loading && error && (
            <div className="p-8 space-y-4 flex flex-col items-center">
              <ErrorState title="Failed to load API keys" detail={error} />
              <Button variant="secondary" onClick={() => void refetch()}>
                Retry
              </Button>
            </div>
          )}

          {!loading && !error && (
            <>
              {(data?.items?.length ?? 0) === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-app-bg/20">
                  <div className="w-12 h-12 rounded-full bg-brand/5 border border-brand/10 flex items-center justify-center mb-4">
                    <div className="w-2 h-2 rounded-full bg-brand/40" />
                  </div>
                  <div className="mb-1 text-app-text font-semibold">No API keys found</div>
                  <p className="text-sm text-app-muted/70">Create your first API key to get started.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-app-border/30 text-sm">
                    <thead className="bg-app-surface/20">
                      <tr className="text-left">
                        <th className="px-6 py-4 font-bold tracking-[0.2em] text-[10px] uppercase text-app-muted opacity-60">Name</th>
                        <th className="px-6 py-4 font-bold tracking-[0.2em] text-[10px] uppercase text-app-muted opacity-60">Created By</th>
                        <th className="px-6 py-4 font-bold tracking-[0.2em] text-[10px] uppercase text-app-muted opacity-60">Created</th>
                        <th className="px-6 py-4 font-bold tracking-[0.2em] text-[10px] uppercase text-app-muted opacity-60">Last Used</th>
                        <th className="px-6 py-4 font-bold tracking-[0.2em] text-[10px] uppercase text-app-muted opacity-60">Expires</th>
                        <th className="px-6 py-4 font-bold tracking-[0.2em] text-[10px] uppercase text-app-muted opacity-60 text-center">Status</th>
                        <th className="px-6 py-4 font-bold tracking-[0.2em] text-[10px] uppercase text-app-muted opacity-60" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-app-border/30">
                      {data?.items.map((item) => (
                        <tr key={item.id} className="group hover:bg-app-surface-2/30 transition-colors duration-200">
                          <td className="px-6 py-4 font-bold text-brand">{item.name}</td>
                          <td className="px-6 py-4 text-app-text/80">{item.created_by}</td>
                          <td className="whitespace-nowrap px-6 py-4 text-app-muted text-xs">
                            {formatDate(item.created_at, true)}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            {item.last_used_at ? (
                              <span className="text-app-text/80 text-xs">{formatDate(item.last_used_at, true)}</span>
                            ) : (
                               <span className="inline-block rounded border border-app-border/30 bg-app-surface/30 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-app-muted/60 italic">
                                Never
                              </span>
                            )}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-app-muted text-xs">
                            {formatDate(item.expires_at, true)}
                          </td>
                          <td className="px-6 py-4 text-center">
                            {item.is_active ? (
                              <span className="inline-flex items-center gap-1.5 rounded-full border border-brand/30 bg-brand/5 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-brand shadow-[0_0_10px_rgba(var(--color-brand),0.1)]">
                                <span className="relative flex h-1.5 w-1.5">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand"></span>
                                </span>
                                Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 rounded-full border border-app-danger/30 bg-app-danger/5 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-app-danger opacity-60">
                                <span className="h-1.5 w-1.5 rounded-full bg-app-danger" />
                                Revoked
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            {item.is_active && (
                              <button
                                type="button"
                                className="text-[10px] font-black uppercase tracking-widest text-app-danger opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 active:scale-95 px-3 py-1 border border-app-danger/20 rounded hover:bg-app-danger/10 shadow-lg shadow-app-danger/5"
                                onClick={() => setRevokeTarget({ id: item.id, name: item.name })}
                              >
                                Revoke
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </Card>
      </div>
      {/* Modals */}
      {showCreateModal && (
        <CreateKeyModal
          onClose={() => setShowCreateModal(false)}
          onCreated={handleCreated}
        />
      )}

      {createdKey && (
        <KeyRevealDialog result={createdKey} onClose={handleKeyRevealClose} />
      )}

      {revokeTarget && (
        <RevokeDialog
          keyName={revokeTarget.name}
          onConfirm={() => void handleRevoke()}
          onCancel={() => {
            setRevokeTarget(null)
            setRevokeError(null)
          }}
          revoking={revoking}
        />
      )}
    </section>
  )
}
