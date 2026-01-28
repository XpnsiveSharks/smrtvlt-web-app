export const ROUTES = {
  dashboard: '/dashboard',
  devices: '/devices',
  deviceDetail: (id = ':deviceId') => `/devices/${id}`,
  access: (id = ':deviceId') => `/devices/${id}/access`,
};
