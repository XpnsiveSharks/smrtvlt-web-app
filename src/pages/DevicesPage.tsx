import { Plus } from 'lucide-react';
import { useDeviceStore } from '../store/deviceStore';
import { useViewTitle } from '../hooks/useViewTitle';
import { Button } from '../components/ui/Button';
import { SearchInput } from '../components/ui/SearchInput';
import { DeviceTable } from '../features/devices/components/DeviceTable';

export const DevicesPage = () => {
  useViewTitle('Device Management');
  const { devices } = useDeviceStore();

  return (
    <div className="page-section h-full flex flex-col">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-2">Device Management</h1>
          <p className="text-zinc-400">Provision, update, and monitor fleet status.</p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4" />}>Provision New ESP32</Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 max-w-md">
          <SearchInput placeholder="Search devices..." />
        </div>
        <div className="flex items-center gap-2 bg-zinc-900 p-1.5 rounded-xl border border-white/5">
          <button className="px-4 py-1.5 rounded-lg bg-zinc-800 text-white text-xs font-bold uppercase tracking-wide shadow-sm">All</button>
          <button className="px-4 py-1.5 rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-white text-xs font-bold uppercase tracking-wide transition-colors">Online</button>
          <button className="px-4 py-1.5 rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-white text-xs font-bold uppercase tracking-wide transition-colors">Offline</button>
          <button className="px-4 py-1.5 rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-white text-xs font-bold uppercase tracking-wide transition-colors">Alerts</button>
        </div>
      </div>

      <DeviceTable devices={devices} />
    </div>
  );
};
