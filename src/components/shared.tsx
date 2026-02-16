// src/components/shared.tsx
// All shared components in one place — import what you need from here.

import { type ReactNode } from 'react'

// ---------------------------------------------------------------------------
// KpiCard
// ---------------------------------------------------------------------------

interface KpiCardProps {
  label: string
  value: string | number
  subtext?: string
  valueClassName?: string
}

export function KpiCard({ label, value, subtext, valueClassName }: KpiCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">{label}</p>
      <p className={`mt-2 text-3xl font-bold text-slate-50 ${valueClassName ?? ''}`}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>
      {subtext && <p className="mt-1 text-sm text-slate-400">{subtext}</p>}
    </div>
  )
}

// ---------------------------------------------------------------------------
// StatusBadge
// ---------------------------------------------------------------------------

type SystemStatus = 'ok' | 'warning' | 'critical'

interface StatusBadgeProps {
  status: SystemStatus
  className?: string
}

const statusStyles: Record<SystemStatus, string> = {
  ok: 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30',
  warning: 'bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/30',
  critical: 'bg-red-500/10 text-red-400 ring-1 ring-red-500/30',
}

const statusLabels: Record<SystemStatus, string> = {
  ok: 'All Clear',
  warning: 'Warning',
  critical: 'Critical',
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[status]} ${className ?? ''}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          status === 'ok'
            ? 'bg-emerald-400'
            : status === 'warning'
              ? 'bg-amber-400'
              : 'bg-red-400'
        }`}
      />
      {statusLabels[status]}
    </span>
  )
}

// ---------------------------------------------------------------------------
// StatusBanner — full-width coloured banner
// ---------------------------------------------------------------------------

interface StatusBannerProps {
  status: SystemStatus
  message: string
}

const bannerStyles: Record<SystemStatus, string> = {
  ok: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
  warning: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
  critical: 'bg-red-500/10 border-red-500/30 text-red-300',
}

export function StatusBanner({ status, message }: StatusBannerProps) {
  return (
    <div className={`rounded-xl border px-5 py-4 font-medium ${bannerStyles[status]}`}>
      {message}
    </div>
  )
}

// ---------------------------------------------------------------------------
// StatusDot — inline health indicator dot
// ---------------------------------------------------------------------------

interface StatusDotProps {
  status: string
}

export function StatusDot({ status }: StatusDotProps) {
  const isHealthy = status === 'healthy' || status === 'ok'
  return (
    <span
      className={`inline-block h-2.5 w-2.5 rounded-full ${
        isHealthy ? 'bg-emerald-400' : 'bg-red-400'
      }`}
    />
  )
}

// ---------------------------------------------------------------------------
// LoadingSpinner
// ---------------------------------------------------------------------------

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-24">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-600 border-t-sky-400" />
    </div>
  )
}

// ---------------------------------------------------------------------------
// ErrorMessage
// ---------------------------------------------------------------------------

interface ErrorMessageProps {
  message: string
  isUnauthorized?: boolean
  onRetry?: () => void
}

export function ErrorMessage({ message, isUnauthorized, onRetry }: ErrorMessageProps) {
  return (
    <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-4">
      <p className="text-sm font-medium text-red-300">
        {isUnauthorized
          ? 'Invalid admin token — check your VITE_ADMIN_TOKEN environment variable.'
          : message}
      </p>
      {!isUnauthorized && onRetry && (
        <button
          onClick={onRetry}
          className="mt-3 text-xs font-semibold text-red-400 underline hover:text-red-300"
        >
          Retry
        </button>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// RefreshBar — last updated + manual refresh button
// ---------------------------------------------------------------------------

interface RefreshBarProps {
  lastRefreshedAt: Date | null
  onRefresh: () => void
  isLoading: boolean
}

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`
  const hours = Math.floor(minutes / 60)
  return `${hours} hour${hours === 1 ? '' : 's'} ago`
}

export function RefreshBar({ lastRefreshedAt, onRefresh, isLoading }: RefreshBarProps) {
  return (
    <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
      <p className="text-xs text-slate-500">
        {lastRefreshedAt ? `Last updated: ${timeAgo(lastRefreshedAt)}` : 'Loading…'}
      </p>
      <button
        onClick={onRefresh}
        disabled={isLoading}
        className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-400 transition hover:bg-white/5 hover:text-slate-200 disabled:opacity-40"
      >
        <svg
          className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        Refresh
      </button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// SectionTitle
// ---------------------------------------------------------------------------

export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3">
      {children}
    </h2>
  )
}

// ---------------------------------------------------------------------------
// ChangePct — trend direction chip
// ---------------------------------------------------------------------------

interface ChangePctProps {
  value: number | null
}

export function ChangePct({ value }: ChangePctProps) {
  if (value === null) {
    return <span className="text-xs text-slate-500">no prior data</span>
  }
  const isUp = value > 0
  const isFlat = value === 0
  return (
    <span
      className={`text-sm font-semibold ${
        isFlat
          ? 'text-slate-400'
          : isUp
            ? 'text-emerald-400'
            : 'text-red-400'
      }`}
    >
      {isFlat ? '→' : isUp ? '▲' : '▼'} {Math.abs(value).toFixed(1)}%
    </span>
  )
}
