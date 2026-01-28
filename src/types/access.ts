export type AccessEventStatus = 'success' | 'failed' | 'warning';

export interface AccessLog {
  id: string;
  deviceId: string;
  timeLabel: string;
  event: string;
  method: string;
  user: string;
  status: AccessEventStatus;
  relativeTime?: string;
}

export type RoleId = 'owner' | 'admin' | 'editor' | 'viewer';

export interface Role {
  id: RoleId;
  label: string;
  description: string;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  initials: string;
  role: RoleId;
  added: string;
  accent?: string;
}

export type AlertSeverity = 'critical' | 'warning' | 'info';

export interface Alert {
  id: string;
  deviceId: string;
  title: string;
  message: string;
  severity: AlertSeverity;
}
