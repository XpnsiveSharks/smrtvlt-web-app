import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useDeviceStore } from '../store/deviceStore';

export const useDevice = (explicitId?: string) => {
  const { getDeviceById, devices } = useDeviceStore();
  const params = useParams();
  const deviceId = explicitId ?? params.deviceId ?? devices[0]?.id;

  const device = useMemo(() => getDeviceById(deviceId), [deviceId, getDeviceById]);

  return { device, deviceId, devices };
};
