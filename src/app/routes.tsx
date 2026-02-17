import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthGuard } from '../auth/AuthGuard'
import { LoginPage } from '../auth/LoginPage'
import { OpsApiKeysPage } from '../features/ops/OpsApiKeysPage'
import { OpsAuditLogsPage } from '../features/ops/OpsAuditLogsPage'
import { OpsSummaryPage } from '../features/ops/OpsSummaryPage'
import { AdminLayout } from '../layouts/AdminLayout'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<AuthGuard />}>
        <Route element={<AdminLayout />}>
          <Route path="/" element={<Navigate to="/ops/summary" replace />} />
          <Route path="/ops/summary" element={<OpsSummaryPage />} />
          <Route path="/ops/audit" element={<OpsAuditLogsPage />} />
          <Route path="/ops/api-keys" element={<OpsApiKeysPage />} />
          <Route path="*" element={<Navigate to="/ops/summary" replace />} />
        </Route>
      </Route>
    </Routes>
  )
}
