import { Lock, LockOpen, Wifi, WifiOff, CloudOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Table, THead, TBody, TH, TD } from '../../../components/ui/Table';
import type { Device } from '../../../types';
import { batteryBarClass, deviceStateLabel, formatSignal, signalIconColor } from '../../../utils/format';
import { cn } from '../../../lib/cn';

interface Props {
  devices: Device[];
  onRowClick?: (device: Device) => void;
}

export const DeviceTable = ({ devices, onRowClick }: Props) => {
  const navigate = useNavigate();

  const handleRowClick = (device: Device) => {
    if (onRowClick) onRowClick(device);
    else navigate(`/devices/${device.id}`);
  };

  return (
    <Card className="flex flex-col">
      <div className="px-6 py-5 border-b border-white/5 flex justify-between items-center bg-zinc-900/30">
        <h3 className="text-lg font-display font-bold text-white">Device Status</h3>
        <Badge variant="neutral" className="text-[11px] uppercase tracking-wide">Manage Fleet</Badge>
      </div>
      <div className="overflow-x-auto">
        <Table className="text-left">
          <THead>
            <tr className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">
              <TH className="px-6 py-3">Device ID / Name</TH>
              <TH className="px-6 py-3">State</TH>
              <TH className="px-6 py-3">Signal</TH>
              <TH className="px-6 py-3">Battery</TH>
              <TH className="px-6 py-3 text-right">Heartbeat</TH>
            </tr>
          </THead>
          <TBody className="text-sm">
            {devices.map((device) => (
              <tr
                key={device.id}
                className="group hover:bg-white/[0.02] transition-colors cursor-pointer"
                onClick={() => handleRowClick(device)}
              >
                <TD className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        'w-2 h-2 rounded-full',
                        device.status === 'offline' ? 'bg-zinc-700' : 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]',
                      )}
                    />
                    <div>
                      <div className="font-bold text-zinc-200 group-hover:text-emerald-400 transition-colors">
                        {device.id} ({device.name})
                      </div>
                      <div className="text-xs text-zinc-500 font-mono">MAC: {device.mac}</div>
                    </div>
                  </div>
                </TD>
                <TD className="px-6 py-4">
                  <Badge
                    variant={device.status === 'offline' ? 'muted' : device.lockState === 'locked' ? 'neutral' : 'success'}
                    className="status-badge"
                  >
                    {device.status === 'offline' ? (
                      <CloudOff className="w-3 h-3" />
                    ) : device.lockState === 'locked' ? (
                      <Lock className="w-3 h-3" />
                    ) : (
                      <LockOpen className="w-3 h-3" />
                    )}
                    {deviceStateLabel(device)}
                  </Badge>
                </TD>
                <TD className="px-6 py-4">
                  <div className="flex items-center gap-2 text-zinc-400 text-xs font-medium">
                    {device.status === 'offline' ? (
                      <WifiOff className="w-4 h-4" />
                    ) : (
                      <Wifi className={cn('w-4 h-4', signalIconColor(device.signal))} />
                    )}
                    {device.status === 'offline' ? 'No Signal' : formatSignal(device.signal)}
                  </div>
                </TD>
                <TD className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                      <div className={`h-full ${batteryBarClass(device.battery)}`} style={{ width: `${device.battery}%` }} />
                    </div>
                    <span className="text-xs font-mono text-zinc-400">{device.battery}%</span>
                  </div>
                </TD>
                <TD className="px-6 py-4 text-zinc-500 text-right font-mono text-xs">{device.lastHeartbeat}</TD>
              </tr>
            ))}
          </TBody>
        </Table>
      </div>
    </Card>
  );
};
