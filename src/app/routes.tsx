import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthGuard } from '../auth/AuthGuard'
import { LoginPage } from '../auth/LoginPage'
import { OpsApiKeysPage } from '../features/ops/OpsApiKeysPage'
import { OpsAuditLogsPage } from '../features/ops/OpsAuditLogsPage'
import { OpsSummaryPage } from '../features/ops/OpsSummaryPage'
import { OpsDiagnosticsPage } from '../features/ops/OpsDiagnosticsPage'
import { OpsRateLimitsPage } from '../features/ops/OpsRateLimitsPage'
import { OpsSessionsPage } from '../features/ops/OpsSessionsPage'
import { OpsEmailStatusPage } from '../features/ops/OpsEmailStatusPage'
import { BusinessTrendsPage } from '../features/business/BusinessTrendsPage'
import { BusinessActivityPage } from '../features/business/BusinessActivityPage'
import { SecurityAlertsPage } from '../features/security/SecurityAlertsPage'
import { AdminLayout } from '../layouts/AdminLayout'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<AuthGuard />}>
        <Route element={<AdminLayout />}>
          <Route path="/" element={<Navigate to="/ops/summary" replace />} />
          
          {/* Ops routes */}
          <Route path="/ops/summary" element={<OpsSummaryPage />} />
          <Route path="/ops/audit" element={<OpsAuditLogsPage />} />
          <Route path="/ops/diagnostics" element={<OpsDiagnosticsPage />} />
          <Route path="/ops/rate-limits" element={<OpsRateLimitsPage />} />
          <Route path="/ops/sessions" element={<OpsSessionsPage />} />
          <Route path="/ops/notifications/email" element={<OpsEmailStatusPage />} />
          <Route path="/ops/api-keys" element={<OpsApiKeysPage />} />
          
          {/* Business routes */}
          <Route path="/business/trends" element={<BusinessTrendsPage />} />
          <Route path="/business/activity" element={<BusinessActivityPage />} />
          
          {/* Security routes */}
          <Route path="/security/alerts" element={<SecurityAlertsPage />} />
          
          <Route path="*" element={<Navigate to="/ops/summary" replace />} />
        </Route>
      </Route>
    </Routes>
  )
}
