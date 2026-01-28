import { LayoutDashboard, Server, Settings, ShieldCheck, Cpu, Users, Plus } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useDeviceStore } from '../../store/deviceStore';
import { Button } from '../ui/Button';
import { cn } from '../../lib/cn';
import logo from '../../assets/smrtvlt-logo.png';

const baseNavClass = ({ isActive }: { isActive: boolean }) =>
  cn('nav-item w-full', isActive && 'active');

export const Sidebar = () => {
  const { selectedDeviceId, devices } = useDeviceStore();
  const deviceForAccess = selectedDeviceId ?? devices[0]?.id ?? 'SV-001';

  return (
    <aside className="hidden md:flex w-72 flex-col border-r border-white/5 bg-glass-gradient backdrop-blur-xl pt-8 pb-6 h-full relative z-20 shadow-2xl">
      <div className="px-8 mb-8 flex items-center gap-3">
        <img
          src={logo}
          alt="SmartVault logo"
          className="w-9 h-9"
        />
        <div>
          <span className="font-display font-bold text-xl tracking-tight text-white block leading-none">SmartVault</span>
          <span className="text-[10px] text-zinc-500 font-medium tracking-wide">DATAFLOW PLATFORM</span>
        </div>
      </div>

      <div className="px-6 mb-6">
        <Button className="w-full" leftIcon={<Plus className="w-4 h-4" />}>Register Device</Button>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        <NavLink to="/dashboard" className={baseNavClass}>
          <LayoutDashboard className="w-4 h-4" />
          System Overview
        </NavLink>
        <NavLink to="/devices" className={baseNavClass}>
          <Server className="w-4 h-4" />
          Devices (ESP32)
        </NavLink>
        <NavLink to={`/devices/${deviceForAccess}/access`} className={baseNavClass}>
          <Users className="w-4 h-4" />
          Access Control
        </NavLink>
        <div className="my-4 border-t border-white/5 mx-4" />
        <button className="nav-item w-full">
          <Cpu className="w-4 h-4" />
          Firmware (OTA)
        </button>
        <button className="nav-item w-full">
          <ShieldCheck className="w-4 h-4" />
          Security Policy
        </button>
      </nav>

      <div className="mt-auto px-6 space-y-4">
        <div className="p-4 rounded-xl bg-zinc-900/50 border border-white/5 backdrop-blur-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase text-zinc-500 font-bold tracking-wider">System Status</span>
            <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
              ONLINE
            </span>
          </div>
          <div className="text-xs text-zinc-400 font-mono">WS: Connected (14ms)</div>
        </div>

        <div className="pt-4 border-t border-white/5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center text-xs text-zinc-300 font-medium border border-white/10">
            OP
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-zinc-200 truncate">SysOperator</p>
            <p className="text-[11px] text-zinc-500 truncate">Level 3 Access</p>
          </div>
          <Settings className="w-4 h-4 text-zinc-600 hover:text-white transition-colors cursor-pointer" />
        </div>
      </div>
    </aside>
  );
};
