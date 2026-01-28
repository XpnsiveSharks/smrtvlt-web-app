import { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import {
  dashboardEvents,
  mockAccessLogs,
  mockAlerts,
  mockDevices,
  mockMembers,
  mockRoles,
} from '../features/devices/mockDevices';
import type { AccessLog, Alert, Device, Member, Role } from '../types';

type DeviceStoreValue = {
  devices: Device[];
  selectedDeviceId: string | null;
  selectDevice: (id: string) => void;
  getDeviceById: (id?: string) => Device | undefined;
  logs: AccessLog[];
  alerts: Alert[];
  members: Member[];
  roles: Role[];
  events: AccessLog[];
};

const DeviceStoreContext = createContext<DeviceStoreValue | undefined>(undefined);

export const DeviceStoreProvider = ({ children }: { children: ReactNode }) => {
  const [devices] = useState<Device[]>(mockDevices);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(mockDevices[0]?.id ?? null);

  const value = useMemo<DeviceStoreValue>(() => {
    const getDeviceById = (id?: string) => {
      const targetId = id ?? selectedDeviceId;
      if (!targetId) return undefined;
      return devices.find((device) => device.id === targetId);
    };
    return {
      devices,
      selectedDeviceId,
      selectDevice: setSelectedDeviceId,
      getDeviceById,
      logs: mockAccessLogs,
      alerts: mockAlerts,
      members: mockMembers,
      roles: mockRoles,
      events: dashboardEvents,
    };
  }, [devices, selectedDeviceId]);

  return <DeviceStoreContext.Provider value={value}>{children}</DeviceStoreContext.Provider>;
};

export const useDeviceStore = (): DeviceStoreValue => {
  const ctx = useContext(DeviceStoreContext);
  if (!ctx) {
    throw new Error('useDeviceStore must be used within DeviceStoreProvider');
  }
  return ctx;
};
