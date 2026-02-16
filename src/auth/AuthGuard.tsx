import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { hasAdminToken } from './tokenStore'

export function AuthGuard() {
  const location = useLocation()

  if (!hasAdminToken()) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}