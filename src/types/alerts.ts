export type AlertSeverity = 'info' | 'warning' | 'critical';

export interface AlertRecord {
  id: number;
  title: string;
  description: string;
  plain: string;
  severity: AlertSeverity;
  timestamp: string;
}
