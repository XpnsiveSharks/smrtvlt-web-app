import { AlertTriangle, ArrowUpCircle, Box, Cpu, ScanFace, Siren } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import type { Device } from '../../../types';

interface Props {
  devices: Device[];
}

export const DeviceSummaryCards = ({ devices }: Props) => {
  const online = devices.filter((d) => d.status === 'online').length;
  const total = devices.length || 1;
  const onlinePct = Math.round((online / total) * 100);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
      <Card className="p-5 group">
        <div className="flex justify-between items-start mb-6">
          <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 group-hover:text-emerald-300 transition-colors">
            <Box className="w-6 h-6" />
          </div>
          <AlertTriangle className="text-zinc-600 w-5 h-5 opacity-0 group-hover:opacity-100 transition" />
        </div>
        <div className="text-3xl font-display font-bold text-white mb-1 tracking-tight">124</div>
        <div className="text-sm text-zinc-400 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" /> {onlinePct}% Online
        </div>
      </Card>

      <Card className="p-5 group border-red-500/20 bg-red-500/5">
        <div className="flex justify-between items-start mb-6">
          <div className="p-3 bg-red-500/10 rounded-xl text-red-400">
            <Siren className="w-6 h-6" />
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400 uppercase tracking-wider">Alert</span>
        </div>
        <div className="text-3xl font-display font-bold text-white mb-1 tracking-tight">2</div>
        <div className="text-sm text-red-300 font-medium">Tamper Events Detected</div>
      </Card>

      <Card className="p-5 group">
        <div className="flex justify-between items-start mb-6">
          <div className="p-3 bg-zinc-800 rounded-xl text-zinc-300 group-hover:text-white transition-colors">
            <ScanFace className="w-6 h-6" />
          </div>
        </div>
        <div className="text-3xl font-display font-bold text-white mb-1 tracking-tight">1,042</div>
        <div className="text-sm text-zinc-500 font-medium">Auths in last 24h</div>
      </Card>

      <Card className="p-5 group">
        <div className="flex justify-between items-start mb-6">
          <div className="p-3 bg-zinc-800 rounded-xl text-zinc-300 group-hover:text-white transition-colors">
            <Cpu className="w-6 h-6" />
          </div>
        </div>
        <div className="text-3xl font-display font-bold text-white mb-1 tracking-tight">v2.4.1</div>
        <div className="text-sm text-emerald-400 font-medium flex items-center gap-1.5">
          <ArrowUpCircle className="w-4 h-4" /> 12 Pending OTA
        </div>
      </Card>
    </div>
  );
};
