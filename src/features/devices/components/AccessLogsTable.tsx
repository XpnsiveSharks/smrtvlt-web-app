import { Badge } from '../../../components/ui/Badge';
import { Card } from '../../../components/ui/Card';
import { Table, THead, TBody, TH, TD } from '../../../components/ui/Table';
import type { AccessLog } from '../../../types';
import { statusBadgeVariant } from '../../../utils/format';
import { cn } from '../../../lib/cn';

interface Props {
  logs: AccessLog[];
  title?: string;
}

export const AccessLogsTable = ({ logs, title = 'Access Logs' }: Props) => (
  <Card className="p-8 h-full flex flex-col">
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-lg font-display font-bold text-white flex items-center gap-3">
        <span className="w-10 h-10 rounded-lg bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-500 text-sm font-mono">
          LOG
        </span>
        {title}
      </h3>
      <div className="flex gap-3">
        <Badge variant="neutral" className="text-[10px] h-8 items-center uppercase tracking-wide">Filter</Badge>
        <Badge variant="neutral" className="text-[10px] h-8 items-center uppercase tracking-wide">Export</Badge>
      </div>
    </div>
    <div className="overflow-auto flex-1">
      <Table>
        <THead>
          <tr>
            <TH>Time</TH>
            <TH>Event</TH>
            <TH>Method</TH>
            <TH className="text-right">User</TH>
          </tr>
        </THead>
        <TBody>
          {logs.map((log) => (
            <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
              <TD className="text-zinc-500 text-xs font-mono">{log.timeLabel}</TD>
              <TD className={cn('font-bold text-sm', log.status === 'failed' ? 'text-red-400' : 'text-emerald-400')}>
                {log.event}
              </TD>
              <TD className="text-zinc-400 text-sm">{log.method}</TD>
              <TD className="text-right">
                <Badge className={statusBadgeVariant(log.status)} pill={false}>
                  {log.user}
                </Badge>
              </TD>
            </tr>
          ))}
        </TBody>
      </Table>
    </div>
  </Card>
);
