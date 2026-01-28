export type DeviceStatus = 'online' | 'offline';
export type LockState = 'locked' | 'unlocked';

export interface Device {
  id: string;
  name: string;
  location: string;
  mac: string;
  ip: string;
  firmware: string;
  status: DeviceStatus;
  lockState: LockState;
  signal: number; // RSSI value
  signalLabel: string;
  battery: number; // percentage
  lastHeartbeat: string;
  lastSeen: string;
}
