import { FC } from 'react';
import clsx from 'clsx';
import { AlertSeverity } from '../types/alerts';
import { formatJalali } from '../utils/date';

interface AlertItemProps {
  title: string;
  description: string;
  plain: string;
  severity: AlertSeverity;
  timestamp: string;
}

const severityStyles: Record<AlertSeverity, { wrapper: string; text: string; dot: string; label: string }> = {
  info: {
    wrapper: 'border-blue-100 bg-blue-50/60',
    text: 'text-blue-700',
    dot: 'bg-blue-500',
    label: 'اطلاع‌رسانی',
  },
  warning: {
    wrapper: 'border-amber-100 bg-amber-50/70',
    text: 'text-amber-700',
    dot: 'bg-amber-500',
    label: 'هشدار',
  },
  critical: {
    wrapper: 'border-red-100 bg-red-50/70',
    text: 'text-red-700',
    dot: 'bg-red-500',
    label: 'بحرانی',
  },
};

const AlertItem: FC<AlertItemProps> = ({ title, description, plain, severity, timestamp }) => {
  const styles = severityStyles[severity];

  return (
    <div className={clsx('rounded-2xl p-4 border flex flex-col gap-2 min-w-0', styles.wrapper)}>
      <div className="flex items-center justify-between text-xs">
        <span className={clsx('font-semibold', styles.text)}>{styles.label}</span>
        <span className="text-slate-500">{formatJalali(timestamp, 'YYYY/MM/DD')}</span>
      </div>
      <h4 className="text-sm font-semibold text-slate-800">{title}</h4>
      <p className="text-xs text-slate-600 leading-6 flex-1">{description}</p>
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <span className={clsx('inline-flex w-2 h-2 rounded-full', styles.dot)}></span>
        {plain}
      </div>
    </div>
  );
};

export default AlertItem;
