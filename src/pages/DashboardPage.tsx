import { ShieldAlert } from 'lucide-react';
import { DeviceSummaryCards } from '../features/devices/components/DeviceSummaryCards';
import { DeviceTable } from '../features/devices/components/DeviceTable';
import { RemoteCommandCard } from '../features/devices/components/RemoteCommandCard';
import { EventLog } from '../features/activity/components/EventLog';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useDeviceStore } from '../store/deviceStore';
import { useViewTitle } from '../hooks/useViewTitle';

export const DashboardPage = () => {
  useViewTitle('System Overview');
  const { devices, alerts, events } = useDeviceStore();
  const critical = alerts[0];

  return (
    <div className="page-section space-y-6">
      <div className="mb-2">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-2">
          IoT <span className="accent-text">Ecosystem</span>
        </h1>
        <p className="text-zinc-400 text-lg max-w-2xl">Real-time telemetry, device management, and security analytics for your smart infrastructure.</p>
      </div>

      <DeviceSummaryCards devices={devices} />

      {critical && (
        <Card className="p-1 mb-6">
          <div className="bg-red-500/5 rounded-[1.4rem] border border-red-500/10 p-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500/20 to-red-600/10 flex items-center justify-center text-red-400 shrink-0 border border-red-500/20">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-display font-bold text-white">{critical.title}</h3>
                <p className="text-sm text-zinc-400 mt-0.5">{critical.message}</p>
              </div>
            </div>
            <Button variant="danger" className="w-full md:w-auto py-2 text-sm">Lockdown Unit</Button>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-6">
        <div className="lg:col-span-8">
          <DeviceTable devices={devices} />
        </div>
        <div className="lg:col-span-4 space-y-6">
          <EventLog events={events} />
          <RemoteCommandCard devices={devices} />
        </div>
      </div>
    </div>
  );
};
