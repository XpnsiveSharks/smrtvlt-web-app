import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { clearAdminToken } from '../auth/tokenStore'

export function AdminLayout() {
  const navigate = useNavigate()

  function handleSignOut() {
    clearAdminToken()
    navigate('/login', { replace: true })
  }

  return (
    <div className="flex min-h-screen bg-app-bg text-app-text">
      <aside className="w-64 border-r border-app-border bg-app-surface px-4 py-6">
        <p className="font-display text-xs uppercase tracking-[0.2em] text-brand">SmartVault</p>
        <p className="mt-2 font-display text-xl">Internal Console</p>

        <nav className="mt-8 space-y-2">
          <NavLink
            to="/ops/summary"
            className={({ isActive }) =>
              `block rounded-lg px-3 py-2 text-sm transition ${
                isActive
                  ? 'bg-brand text-black'
                  : 'text-app-muted hover:bg-app-surface-2 hover:text-app-text'
              }`
            }
          >
            Ops Summary
          </NavLink>
        </nav>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-app-border px-6 py-4">
          <p className="text-sm text-app-muted">Authenticated internal admin area</p>
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