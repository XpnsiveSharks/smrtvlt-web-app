// src/App.tsx

import { useState } from 'react'
import { Shell, type ScreenId } from './components/layout/Shell'
import { OverviewScreen } from './screens/Overview'
import { TrendsScreen } from './screens/Trends'

function Placeholder({ name }: { name: string }) {
  return (
    <div className="flex h-64 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
      <p className="text-slate-500">{name} — coming soon</p>
    </div>
  )
}

function ActiveScreen({ id }: { id: ScreenId }) {
  switch (id) {
    case 'overview':
      return <OverviewScreen />
    case 'trends':
      return <TrendsScreen />
    case 'security':
      return <Placeholder name="Security Alerts" />
    case 'ops-summary':
      return <Placeholder name="Ops Summary" />
    case 'sessions':
      return <Placeholder name="Sessions" />
    case 'rate-limits':
      return <Placeholder name="Rate Limits" />
    case 'diagnostics':
      return <Placeholder name="Diagnostics" />
    case 'notifications':
      return <Placeholder name="Notifications" />
    case 'audit':
      return <Placeholder name="Audit Log" />
    case 'api-keys':
      return <Placeholder name="API Keys" />
  }
}

export default function App() {
  const [screen, setScreen] = useState<ScreenId>('overview')

  return (
    <Shell active={screen} onNavigate={setScreen}>
      <ActiveScreen id={screen} />
    </Shell>
  )
}