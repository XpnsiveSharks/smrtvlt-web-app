import type { AccessEventStatus, Device } from '../types';

export const formatSignal = (signal: number): string => `${signal} dBm`;

export const signalIconColor = (signal: number): string => {
  if (signal >= -50) return 'text-emerald-500';
  if (signal >= -70) return 'text-yellow-500';
  return 'text-zinc-600';
};

export const batteryBarClass = (battery: number): string => {
  if (battery >= 75) return 'bg-emerald-500';
  if (battery >= 40) return 'bg-yellow-500';
  return 'bg-red-500';
};

export const statusBadgeVariant = (status: AccessEventStatus): string => {
  if (status === 'success') return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
  if (status === 'warning') return 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20';
  return 'bg-red-500/10 text-red-400 border border-red-500/20';
};

export const deviceStateLabel = (device: Device): string => {
  if (device.status === 'offline') return 'Offline';
  return device.lockState === 'locked' ? 'Locked' : 'Unlocked';
};
