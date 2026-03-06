import { useMemo, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  ActivitySquare,
  ChartLine,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
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
    Operations: true,
    Business: true,
    Security: true,
  })
  const navigate = useNavigate()

  const toggleSection = (heading: string) => {
    setExpandedSections((prev) => ({ ...prev, [heading]: !prev[heading] }))
  }

  const navSections = useMemo(
    () => [
      {
        heading: 'Operations',
        items: [
          { label: 'Summary', to: '/ops/summary', icon: LayoutGrid },
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
      { label: 'Summary', to: '/ops/summary', icon: LayoutGrid },
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
    <div className="relative flex min-h-screen bg-app-bg text-app-text selection:bg-brand/30">
      {mobileNavOpen && (
        <div
          className="fixed inset-0 z-30 bg-app-bg/60 backdrop-blur-sm md:hidden animate-in fade-in duration-300"
          onClick={() => setIsNavOpen(false)}
          aria-label="Close navigation overlay"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 transform border-app-border bg-app-surface shadow-2xl transition-all duration-300 ease-in-out md:sticky md:top-0 md:h-screen md:flex-shrink-0 md:translate-x-0 md:border-r ${
          mobileNavOpen ? 'translate-x-0 w-72' : '-translate-x-full w-72'
        } ${desktopCollapsed ? 'md:w-20' : 'md:w-64'}`}
        aria-label="Primary navigation drawer"
      >
        <div className="flex h-full flex-col overflow-hidden">
          <div className={`flex items-center min-h-[80px] px-6 border-b border-white/[0.03] ${desktopCollapsed ? 'justify-center px-0' : 'justify-between'}`}>
            <div className="flex items-center gap-3">
              {desktopCollapsed ? (
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 border border-brand/20 shadow-[0_0_15px_rgba(var(--color-brand),0.1)] group transition-all duration-300 hover:scale-110">
                  <span className="font-display font-black text-brand text-xs">SV</span>
                </div>
              ) : (
                <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                  <p className="font-display text-[10px] font-black uppercase tracking-[0.3em] text-brand opacity-80 leading-none mb-1.5">SmartVault</p>
                  <p className="font-display text-lg font-bold leading-tight tracking-tight text-app-text">Internal Console</p>
                </div>
              )}
            </div>
          </div>

          <nav className={`flex-1 overflow-y-auto py-6 custom-scrollbar ${desktopCollapsed ? 'flex flex-col items-center gap-4' : 'px-4 space-y-6'}`}>
            {desktopCollapsed ? (
              collapsedNavItems.map((item) => {
                const Icon = item.icon
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setIsNavOpen(false)}
                    className={({ isActive }) =>
                      `inline-flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200 ${
                        isActive
                          ? 'bg-brand text-app-bg shadow-[0_0_20px_rgba(var(--color-brand),0.3)] scale-110'
                          : 'text-app-muted hover:bg-white/5 hover:text-brand'
                      }`
                    }
                  >
                    <Icon className="h-5 w-5" strokeWidth={2.5} />
                  </NavLink>
                )
              })
            ) : (
              navSections.map((section) => (
                <div key={section.heading} className="space-y-2">
                  <button
                    type="button"
                    onClick={() => toggleSection(section.heading)}
                    className="group flex w-full items-center justify-between px-2 text-[10px] font-black uppercase tracking-[0.3em] text-app-muted/40 transition-all hover:text-brand focus:outline-none"
                  >
                    <span className="mb-1">{section.heading}</span>
                    <ChevronDown
                      className={`h-3 w-3 transition-transform duration-300 ${
                        expandedSections[section.heading] ? 'rotate-0 text-brand' : '-rotate-90'
                      }`}
                      strokeWidth={3}
                    />
                  </button>
                  <div
                    className={`space-y-1 overflow-hidden transition-all duration-300 ${
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
                            transitionDelay: expandedSections[section.heading] ? `${index * 20}ms` : '0ms',
                          }}
                          className={({ isActive }) =>
                            `group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-bold transition-all duration-200 ${
                              isActive
                                ? 'bg-brand/10 text-brand border-l-2 border-brand rounded-l-none -ml-4 pl-[calc(1rem+2px)] shadow-[inset_10px_0_15px_-10px_rgba(var(--color-brand),0.1)]'
                                : 'text-app-muted/80 hover:bg-white/5 hover:text-app-text hover:translate-x-1'
                            }`
                          }
                        >
                          {({ isActive }) => (
                            <>
                              <Icon className={`h-4 w-4 shrink-0 transition-colors ${isActive ? 'text-brand' : 'group-hover:text-brand'}`} strokeWidth={2.5} />
                              <span className="truncate">{item.label}</span>
                            </>
                          )}
                        </NavLink>
                      )
                    })}
                  </div>
                </div>
              ))
            )}
          </nav>

          <div className="p-4 border-t border-white/[0.03] bg-white/[0.01]">
            <div className={`flex items-center ${desktopCollapsed ? 'justify-center' : 'justify-between'}`}>
              {!desktopCollapsed && (
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-app-muted opacity-40">System Node</span>
                  <span className="text-[11px] font-mono text-emerald-500 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    ONLINE
                  </span>
                </div>
              )}
              
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/5 bg-app-surface-2 text-app-muted transition-all duration-300 hover:bg-brand hover:text-app-bg hover:border-brand shadow-sm"
                onClick={() => desktopCollapsed ? setIsCollapsed(false) : (isNavOpen ? setIsNavOpen(false) : setIsCollapsed(true))}
                aria-label={desktopCollapsed ? "Expand navigation" : "Collapse navigation"}
              >
                {desktopCollapsed ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  isNavOpen ? <X className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-app-border bg-app-bg/80 px-6 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <button
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-app-surface-2 text-app-text border border-white/5 md:hidden active:scale-95 transition-transform"
              onClick={() => setIsNavOpen(true)}
              aria-label="Open navigation"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-brand/40 animate-pulse" />
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-app-muted">Authenticated Ops Node</p>
            </div>
          </div>
          <Button 
            variant="secondary" 
            onClick={handleSignOut}
            className="h-9 px-4 text-xs font-bold uppercase tracking-widest border-white/5 hover:bg-app-danger hover:text-white hover:border-app-danger transition-all"
          >
            Sign out
          </Button>
        </header>
        <main className="flex-1 p-6 lg:p-10 max-w-[1600px] mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
