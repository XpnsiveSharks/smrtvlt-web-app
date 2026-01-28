import { Shield, CheckCircle2 } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { InviteForm } from '../features/access/components/InviteForm';
import { MembersTable } from '../features/access/components/MembersTable';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useDevice } from '../hooks/useDevice';
import { useDeviceStore } from '../store/deviceStore';
import { useViewTitle } from '../hooks/useViewTitle';

export const AccessControlPage = () => {
  const params = useParams();
  const { members, roles } = useDeviceStore();
  const { device } = useDevice(params.deviceId);
  useViewTitle('Access Control');

  if (!device) {
    return <div className="text-zinc-400">Device not found.</div>;
  }

  return (
    <div className="page-section h-full flex flex-col space-y-8">
      <div className="flex justify-between items-start pb-6 border-b border-white/5">
        <div>
          <div className="flex items-center gap-4 mb-3">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight">Access Control</h1>
            <Badge variant="success">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" /> Active
            </Badge>
          </div>
          <p className="text-zinc-400 text-sm">
            Manage permissions for <strong className="text-white">{device.id} ({device.name})</strong>
          </p>
        </div>
        <Badge variant="neutral" className="cursor-pointer">
          <Shield className="w-3.5 h-3.5" /> Audit Logs
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-8">
          <InviteForm />

          <Card className="p-6 border-white/5 bg-zinc-900/30">
            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">Role Permissions</h4>
            <ul className="space-y-3">
              {roles.map((role) => (
                <li key={role.id} className="flex gap-3 items-start">
                  <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 text-[10px] font-bold uppercase border border-white/10 mt-0.5 w-20 text-center shrink-0">
                    {role.label}
                  </span>
                  <p className="text-xs text-zinc-400 leading-relaxed flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5" />
                    {role.description}
                  </p>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <MembersTable members={members} roles={roles} />
        </div>
      </div>
    </div>
  );
};
