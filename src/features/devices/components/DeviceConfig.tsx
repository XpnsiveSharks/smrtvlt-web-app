import { Card } from '../../../components/ui/Card';

export const DeviceConfig = () => (
  <Card className="p-8">
    <h3 className="text-lg font-display font-bold text-white mb-6">Device Config</h3>
    <div className="space-y-4 text-sm font-medium">
      <div className="flex justify-between items-center pb-4 border-b border-white/5">
        <span className="text-zinc-400">Offline PIN Fallback</span>
        <span className="text-emerald-400 text-xs font-bold uppercase">Enabled</span>
      </div>
      <div className="flex justify-between items-center pb-4 border-b border-white/5">
        <span className="text-zinc-400">Biometric Liveness</span>
        <span className="text-emerald-400 text-xs font-bold uppercase">Strict</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-zinc-400">Auto-Lock Timer</span>
        <span className="text-zinc-200 font-mono text-xs">30s</span>
      </div>
    </div>
  </Card>
);
