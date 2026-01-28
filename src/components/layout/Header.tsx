import { Fragment } from 'react';
import { Bell, Wifi } from 'lucide-react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useDevice } from '../../hooks/useDevice';
import { cn } from '../../lib/cn';

interface Crumb {
  label: string;
  to?: string;
}

const useBreadcrumbs = (): { crumbs: Crumb[] } => {
  const location = useLocation();
  const params = useParams();
  const { device } = useDevice(params.deviceId);
  const path = location.pathname;

  const crumbs: Crumb[] = [{ label: 'Overview', to: '/dashboard' }];

  if (path.startsWith('/devices/') && path.includes('/access')) {
    crumbs.push({ label: 'Devices', to: '/devices' });
    crumbs.push({ label: 'Access Control' });
  } else if (path.startsWith('/devices/') && params.deviceId) {
    crumbs.push({ label: 'Devices', to: '/devices' });
    crumbs.push({ label: 'Device Details' });
  } else if (path.startsWith('/devices')) {
    crumbs.push({ label: 'Device Management' });
  } else {
    crumbs.push({ label: 'System Overview' });
  }

  if (device && path.startsWith('/devices/') && !path.endsWith('/access')) {
    crumbs[crumbs.length - 1].label = `${device.id} Details`;
  }

  return { crumbs };
};

export const Header = () => {
  const { crumbs } = useBreadcrumbs();

  return (
    <header className="h-24 flex items-center justify-between px-10 border-b border-white/5 z-10 shrink-0 bg-[#030303]/80 backdrop-blur-md">
      <div className="flex items-center gap-3 text-sm">
        {crumbs.map((crumb, idx) => (
          <Fragment key={crumb.label}>
            {idx > 0 && <span className="text-zinc-700">/</span>}
            {crumb.to ? (
              <Link to={crumb.to} className="text-zinc-500 hover:text-zinc-300 transition-colors">
                {crumb.label}
              </Link>
            ) : (
              <span className={cn('font-medium', idx === crumbs.length - 1 ? 'text-emerald-400 font-display' : 'text-zinc-500')}>
                {crumb.label}
              </span>
            )}
          </Fragment>
        ))}
      </div>
      <div className="flex items-center gap-4">
        <div className="px-3 py-1.5 rounded-full bg-zinc-900 border border-white/5 text-zinc-400 text-xs font-medium flex items-center gap-2">
          <Wifi className="w-3.5 h-3.5 text-emerald-500" />
          Gateway: Active
        </div>
        <div className="h-5 w-px bg-white/10" />
        <button className="text-zinc-400 hover:text-white transition-colors relative p-1">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-red-500 shadow-sm border border-black" />
        </button>
      </div>
    </header>
  );
};
