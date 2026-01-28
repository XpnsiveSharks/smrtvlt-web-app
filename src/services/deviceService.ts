import { mockAccessLogs, mockAlerts, mockDevices } from '../features/devices/mockDevices';
import type { AccessLog, Alert, Device } from '../types';

const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchDevices(): Promise<Device[]> {
  await delay();
  return mockDevices;
}

export async function fetchDeviceById(id: string): Promise<Device | undefined> {
  await delay();
  return mockDevices.find((device) => device.id === id);
}

export async function fetchAccessLogs(deviceId?: string): Promise<AccessLog[]> {
  await delay();
  return deviceId ? mockAccessLogs.filter((log) => log.deviceId === deviceId) : mockAccessLogs;
}

export async function fetchAlerts(): Promise<Alert[]> {
  await delay();
  return mockAlerts;
}
