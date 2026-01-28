import { Copy, RefreshCw, Unlock } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useDeviceStore } from '../store/deviceStore';
import { useDevice } from '../hooks/useDevice';
import { useViewTitle } from '../hooks/useViewTitle';
import { TelemetryPanel } from '../features/devices/components/TelemetryPanel';
import { DeviceConfig } from '../features/devices/components/DeviceConfig';
import { AccessLogsTable } from '../features/devices/components/AccessLogsTable';

export const DeviceDetailPage = () => {
  const params = useParams();
  const { logs } = useDeviceStore();
  const { device } = useDevice(params.deviceId);
  useViewTitle('Device Details');

  if (!device) {
    return <div className="text-zinc-400">Device not found.</div>;
  }

  const deviceLogs = logs.filter((log) => log.deviceId === device.id);

  return (
    <div className="page-section h-full flex flex-col space-y-8">
      <div className="flex justify-between items-start pb-6 border-b border-white/5">
        <div>
          <div className="flex items-center gap-4 mb-3">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight">{device.id} ({device.name})</h1>
            <Badge variant={device.status === 'online' ? 'success' : 'muted'}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
              {device.status === 'online' ? 'Online' : 'Offline'}
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-zinc-500 text-sm font-mono">
            <span>FW: {device.firmware}</span>
            <span>•</span>
            <span>IP: {device.ip}</span>
            <button className="hover:text-white transition-colors" title="Copy Info">
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>Reboot</Button>
          <Button leftIcon={<Unlock className="w-3.5 h-3.5" />}>Remote Unlock</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-8">
          <TelemetryPanel device={device} />
          <DeviceConfig />
        </div>
        <div className="lg:col-span-2">
          <AccessLogsTable logs={deviceLogs.length ? deviceLogs : logs} />
        </div>
      </div>
    </div>
  );
};