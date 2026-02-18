import { useMemo, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  ActivitySquare,
  Briefcase,
  ChartLine,
  ChevronDown,
  ChevronLeft,
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
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    Operations: false,
    Business: false,
    Security: false,
  })
  const navigate = useNavigate()

  const toggleSection = (heading: string) => {
    setExpandedSections((prev) => {
      const isCurrentlyExpanded = prev[heading]
      // Close all sections
      const allClosed = Object.keys(prev).reduce((acc, key) => {
        acc[key] = false
        return acc
      }, {} as Record<string, boolean>)
      // If the clicked section was closed, open it; otherwise keep all closed
      return { ...allClosed, [heading]: !isCurrentlyExpanded }
    })
  }

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

  // Filter navigation for collapsed state: show only Ops Summary and Overview
  const collapsedNavItems = useMemo(
    () => [
      { label: 'Ops Summary', to: '/ops/summary', icon: LayoutGrid },
      { label: 'Overview', to: '/business/overview', icon: Briefcase },
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
            desktopCollapsed ? 'items-center' : ''
          }`}
        >
          <div className={`flex items-center min-h-[56px] ${desktopCollapsed ? 'justify-center' : 'justify-between'}`}>
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

          <nav className={desktopCollapsed ? 'mt-6 flex flex-col items-center gap-2.5' : 'mt-8 flex-1 space-y-4'}>
            {desktopCollapsed ? (
              // Collapsed state: show only Ops Summary and Overview
              collapsedNavItems.map((item) => {
                const Icon = item.icon
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setIsNavOpen(false)}
                    className={({ isActive }) =>
                      `inline-flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium transition-all duration-150 ${
                        isActive
                          ? 'bg-brand text-app-bg'
                          : 'text-app-text hover:bg-app-surface-2 hover:text-brand'
                      }`
                    }
                  >
                    <Icon className="h-4 w-4 shrink-0" strokeWidth={2} />
                  </NavLink>
                )
              })
            ) : (
              // Expanded state: show all sections
              navSections.map((section) => (
                <div key={section.heading} className="space-y-1">
                  <button
                    type="button"
                    onClick={() => toggleSection(section.heading)}
                    className="flex w-full items-center justify-between px-3 text-[11px] font-bold uppercase tracking-[0.22em] text-app-muted/90 transition-colors hover:text-app-text focus:outline-none"
                  >
                    <span className="mb-1.5">{section.heading}</span>
                    <ChevronDown
                      className={`h-3 w-3 transition-transform duration-200 ${
                        expandedSections[section.heading] ? 'rotate-0' : '-rotate-90'
                      }`}
                      strokeWidth={2}
                    />
                  </button>
                  <div
                    className={`space-y-1 overflow-hidden transition-all duration-200 ${
                      expandedSections[section.heading]
                        ? 'max-h-[1000px] opacity-100'
                        : 'max-h-0 opacity-0'
                    }`}
                  >
                    {section.items.map((item, index) => {
                      const Icon = item.icon
                      return (
                        <NavLink
                          key={item.to}
                          to={item.to}
                          onClick={() => setIsNavOpen(false)}
                          style={{
                            transitionDelay: expandedSections[section.heading] ? `${index * 30}ms` : '0ms',
                          }}
                          className={({ isActive }) =>
                            `block rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-150 ${
                              isActive
                                ? 'bg-brand text-app-bg'
                                : 'text-app-text hover:bg-app-surface-2 hover:text-brand'
                            }`
                          }
                        >
                          <span className="flex h-9 items-center gap-3 text-sm">
                            <Icon className="h-4 w-4 shrink-0" strokeWidth={2} />
                            <span>{item.label}</span>
                          </span>
                        </NavLink>
                      )
                    })}
                  </div>
                </div>
              ))
            )}
          </nav>

          <div className="absolute bottom-4 right-4 md:right-3">
            {desktopCollapsed ? (
              <button
                type="button"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-app-border bg-app-surface-2 text-app-text transition-all duration-300 hover:bg-app-surface"
                onClick={() => setIsCollapsed(false)}
                aria-label="Open navigation"
              >
                <ChevronRight className="h-3 w-3 transition-transform duration-300" />
              </button>
            ) : (
              <button
                type="button"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-app-border bg-app-surface-2 text-app-text transition-all duration-300 hover:bg-app-surface md:hidden"
                onClick={() => setIsNavOpen(false)}
                aria-label="Close navigation"
              >
                <X className="h-4 w-4 transition-transform duration-300" />
              </button>
            )}
          </div>

          {!desktopCollapsed && (
            <div className="absolute bottom-4 right-4 hidden md:block md:right-3">
              <button
                type="button"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-app-border bg-app-surface-2 text-app-text transition-all duration-300 hover:bg-app-surface"
                onClick={() => setIsCollapsed(true)}
                aria-label="Collapse navigation"
              >
                <ChevronLeft className="h-3 w-3 transition-transform duration-300" />
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
