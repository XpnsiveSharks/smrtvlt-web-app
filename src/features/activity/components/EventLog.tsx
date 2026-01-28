import { Hash, History, ScanFace, AlertTriangle } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import type { AccessLog } from '../../../types';

interface Props {
  events: AccessLog[];
}

export const EventLog = ({ events }: Props) => (
  <Card className="p-5">
    <h3 className="text-lg font-display font-bold text-white mb-5 flex items-center gap-3">
      <History className="w-5 h-5 text-emerald-500" />
      Event Log
    </h3>
    <div className="space-y-3">
      {events.map((event) => (
        <div
          key={event.id}
          className={
            event.status === 'failed'
              ? 'card-secondary p-3 flex gap-4 items-center border-red-900/30 bg-red-900/10'
              : 'card-secondary p-3 flex gap-4 items-center'
          }
        >
          <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0 text-zinc-400">
            {event.status === 'failed' ? (
              <AlertTriangle className="w-5 h-5 text-red-500" />
            ) : event.event.toLowerCase().includes('bio') ? (
              <ScanFace className="w-5 h-5 text-emerald-500" />
            ) : (
              <Hash className="w-5 h-5" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center mb-0.5">
              <p className="text-sm font-semibold text-white">{event.event}</p>
              <span className="text-[10px] font-mono text-zinc-500">{event.timeLabel}</span>
            </div>
            <p className="text-xs text-zinc-500 truncate">{event.method}</p>
          </div>
        </div>
      ))}
    </div>
    <button className="btn-outline w-full mt-5 text-xs h-9 justify-center">View Full History</button>
  </Card>
);
