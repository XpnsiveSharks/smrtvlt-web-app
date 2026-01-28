import { Activity, Lock, LockOpen } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import type { Device } from '../../../types';

interface Props {
  device: Device;
}

export const TelemetryPanel = ({ device }: Props) => (
  <Card className="p-8">
    <h3 className="text-lg font-display font-bold text-white mb-6 flex items-center gap-3">
      <Activity className="w-5 h-5 text-emerald-500" /> Live Telemetry
    </h3>
    <div className="grid grid-cols-2 gap-4">
      <div className="card-secondary p-4 text-center">
        <div className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest mb-2">Battery</div>
        <div className="text-2xl font-display font-bold text-emerald-400">{device.battery}%</div>
        <div className="text-[10px] font-mono text-zinc-600">4.12 V</div>
      </div>
      <div className="card-secondary p-4 text-center">
        <div className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest mb-2">RSSI</div>
        <div className="text-2xl font-display font-bold text-zinc-300">{device.signal}</div>
        <div className="text-[10px] font-mono text-zinc-600">dBm ({device.signalLabel})</div>
      </div>
      <div className="card-secondary p-4 text-center col-span-2">
        <div className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest mb-2">Lock Mechanism</div>
        <div className="text-xl font-display font-bold text-emerald-400 flex items-center justify-center gap-2">
          {device.lockState === 'locked' ? <Lock className="w-5 h-5" /> : <LockOpen className="w-5 h-5" />}
          {device.lockState === 'locked' ? 'Engaged' : 'Released'}
        </div>
        <div className="text-[10px] font-mono text-zinc-600 mt-1">Solenoid State: LOW</div>
      </div>
    </div>
  </Card>
);
