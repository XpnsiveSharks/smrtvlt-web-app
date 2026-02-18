import { useMemo, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  ActivitySquare,
  Briefcase,
  ChartLine,
  ChevronRight,
  Circle,
  ClipboardList,
  Gauge,
  KeyRound,
  LayoutGrid,
  LineChart,
  ListChecks,
  Mail,
  Menu,
  ShieldAlert,
  X,
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { clearAdminToken } from '../auth/tokenStore'

export function AdminLayout() {
  const [isNavOpen, setIsNavOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const navigate = useNavigate()

  const navSections = useMemo(
    () => [
      {
        heading: 'Operations',
        items: [
          { label: 'Ops Summary', to: '/ops/summary', icon: LayoutGrid },
          { label: 'Diagnostics', to: '/ops/diagnostics', icon: ActivitySquare },
          { label: 'Rate Limits', to: '/ops/rate-limits', icon: Gauge },
          { label: 'Sessions', to: '/ops/sessions', icon: ListChecks },
          { label: 'Email Status', to: '/ops/notifications/email', icon: Mail },
          { label: 'Audit Logs', to: '/ops/audit', icon: ClipboardList },
          { label: 'API Keys', to: '/ops/api-keys', icon: KeyRound },
        ],
      },
      {
        heading: 'Business',
        items: [
          { label: 'Overview', to: '/business/overview', icon: Briefcase },
          { label: 'Trends', to: '/business/trends', icon: LineChart },
          { label: 'Activity', to: '/business/activity', icon: ChartLine },
        ],
      },
      {
        heading: 'Security',
        items: [{ label: 'Alerts', to: '/security/alerts', icon: ShieldAlert }],
      },
    ],
    []
  )

  function handleSignOut() {
    clearAdminToken()
    navigate('/login', { replace: true })
  }

  const mobileNavOpen = isNavOpen
  const desktopCollapsed = isCollapsed

  return (
    <div className="relative flex min-h-screen bg-app-bg text-app-text">
      {mobileNavOpen && (
        <div
          className="fixed inset-0 z-30 bg-app-bg/80 backdrop-blur-[1px] md:hidden"
          onClick={() => setIsNavOpen(false)}
          aria-label="Close navigation overlay"
        />
      )}

      <aside
        className={`relative fixed inset-0 z-40 w-full transform border-app-border bg-app-surface px-4 py-6 shadow-lg transition-[transform,width] duration-300 ease-in-out md:static md:inset-auto md:h-auto ${
          mobileNavOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:border-r ${desktopCollapsed ? 'md:w-20 md:px-3' : 'md:w-64 md:px-4'}`}
        aria-label="Primary navigation drawer"
      >
        <div
          className={`flex h-full flex-col ${
            desktopCollapsed ? 'items-center justify-center gap-8' : ''
          }`}
        >
          <div className={`flex items-center ${desktopCollapsed ? 'justify-center gap-3' : 'justify-between'}`}>
            <div className="flex items-center gap-3">
              {desktopCollapsed ? (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-app-surface-2 transition-colors duration-200">
                  <Circle className="h-3.5 w-3.5 text-brand" strokeWidth={2.5} />
                </div>
              ) : (
                <div>
                  <p className="font-display text-xs uppercase tracking-[0.2em] text-brand">SmartVault</p>
                  <p className="mt-1 font-display text-xl leading-tight">Internal Console</p>
                </div>
              )}
            </div>
          </div>

          <nav className={desktopCollapsed ? 'flex flex-col items-center gap-2.5' : 'mt-8 flex-1 space-y-6'}>
            {navSections.map((section) => (
              <div key={section.heading} className={desktopCollapsed ? 'flex flex-col items-center gap-1.5' : 'space-y-1'}>
                {!desktopCollapsed && (
                  <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-app-muted/90">
                    {section.heading}
                  </p>
                )}
                {section.items.map((item) => {
                  const Icon = item.icon
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={() => setIsNavOpen(false)}
                      className={({ isActive }) =>
                        `${desktopCollapsed ? 'inline-flex' : 'block'} ${desktopCollapsed ? 'rounded-full' : 'rounded-lg'} ${
                          desktopCollapsed ? 'h-9 w-9 items-center justify-center' : 'px-3 py-2'
                        } text-sm font-medium transition-colors duration-150 ${
                          isActive
                            ? 'bg-brand text-app-bg'
                            : 'text-app-text hover:bg-app-surface-2 hover:text-brand'
                        }`
                      }
                    >
                      {desktopCollapsed ? (
                        <Icon className="h-4 w-4 shrink-0" strokeWidth={2.25} />
                      ) : (
                        <span className="flex h-11 items-center gap-3 text-sm">
                          <Icon className="h-5 w-5 shrink-0" strokeWidth={2.25} />
                          <span>{item.label}</span>
                        </span>
                      )}
                    </NavLink>
                  )
                })}
              </div>
            ))}
          </nav>

          {desktopCollapsed && (
            <div className="flex justify-center">
              <button
                type="button"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-app-border bg-app-surface-2 text-app-text transition hover:bg-app-surface"
                onClick={() => setIsCollapsed(false)}
                aria-label="Open navigation"
              >
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          )}

          {(!desktopCollapsed || mobileNavOpen) && (
            <div className="absolute bottom-4 right-4 md:right-3">
              <button
                type="button"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-app-border bg-app-surface-2 text-app-text transition hover:bg-app-surface"
                onClick={() => {
                  if (typeof window !== 'undefined' && window.innerWidth < 768) {
                    setIsNavOpen(false)
                  } else {
                    setIsCollapsed(true)
                  }
                }}
                aria-label="Close navigation"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-app-border px-6 py-4">
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              className="px-3 py-2 text-sm md:hidden"
              onClick={() => {
                setIsCollapsed(false)
                setIsNavOpen(true)
              }}
              aria-label="Open navigation"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <p className="text-sm text-app-muted">Authenticated internal admin area</p>
          </div>
          <Button variant="secondary" onClick={handleSignOut}>
            Sign out
          </Button>
        </header>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
