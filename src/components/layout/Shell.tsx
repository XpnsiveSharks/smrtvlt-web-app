// src/components/layout/Shell.tsx

import { type ReactNode } from 'react'

export type ScreenId =
  | 'overview'
  | 'trends'
  | 'security'
  | 'ops-summary'
  | 'sessions'
  | 'rate-limits'
  | 'diagnostics'
  | 'notifications'
  | 'audit'
  | 'api-keys'

interface NavItem {
  id: ScreenId
  label: string
}

interface NavGroup {
  group: string
  items: NavItem[]
}

const NAV: NavGroup[] = [
  {
    group: 'Business',
    items: [
      { id: 'overview', label: 'Overview' },
      { id: 'trends', label: 'Trends' },
    ],
  },
  {
    group: 'Security',
    items: [{ id: 'security', label: 'Alerts' }],
  },
  {
    group: 'Ops',
    items: [
      { id: 'ops-summary', label: 'Summary' },
      { id: 'sessions', label: 'Sessions' },
      { id: 'rate-limits', label: 'Rate Limits' },
      { id: 'diagnostics', label: 'Diagnostics' },
      { id: 'notifications', label: 'Notifications' },
      { id: 'audit', label: 'Audit Log' },
    ],
  },
  {
    group: 'Admin',
    items: [{ id: 'api-keys', label: 'API Keys' }],
  },
]

interface ShellProps {
  active: ScreenId
  onNavigate: (id: ScreenId) => void
  children: ReactNode
}

export function Shell({ active, onNavigate, children }: ShellProps) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 border-r border-white/5 bg-slate-900/60 backdrop-blur">
        {/* Logo */}
        <div className="flex h-16 items-center gap-2.5 px-5 border-b border-white/5">
          <span className="h-7 w-7 rounded-lg bg-sky-500 flex items-center justify-center text-white font-bold text-sm">
            SV
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-100 leading-none">SmartVault</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Admin Console</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="p-3 space-y-5 mt-2">
          {NAV.map(({ group, items }) => (
            <div key={group}>
              <p className="px-2 mb-1 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
                {group}
              </p>
              <div className="space-y-0.5">
                {items.map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => onNavigate(id)}
                    className={`w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
                      active === id
                        ? 'bg-sky-500/15 text-sky-300'
                        : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-auto p-8">
        {children}
      </main>
    </div>
  )
}
