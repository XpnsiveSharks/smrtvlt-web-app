import { Unlock } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import type { Device } from '../../../types';

interface Props {
  devices: Device[];
}

export const RemoteCommandCard = ({ devices }: Props) => (
  <Card className="p-5">
    <h3 className="text-lg font-display font-bold text-white mb-5">Remote Command</h3>
    <div className="relative">
      <div className="mb-4">
        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Target Device</label>
        <select className="w-full glass-input p-3 text-sm font-medium">
          {devices.map((device) => (
            <option key={device.id}>{`${device.id} (${device.name})`}</option>
          ))}
        </select>
      </div>
      <Button className="w-full justify-center bg-blue-600 hover:bg-blue-500 shadow-blue-500/20" leftIcon={<Unlock className="w-4 h-4" />}>
        One-Time Remote Unlock
      </Button>
      <p className="text-[10px] font-mono text-zinc-600 mt-4 text-center">ACTION_ID: admin_remote_unlock</p>
    </div>
  </Card>
);
