import { FC, ReactNode } from 'react';

interface Props {
  title: string;
  value: string;
  trend?: 'up' | 'down';
  trendText?: string;
  icon?: ReactNode;
  accent?: string;
}

const KpiCard: FC<Props> = ({ title, value, trend, trendText, icon, accent }) => {
  const trendColor = trend === 'up' ? 'text-emerald-600' : 'text-rose-600';
  const trendArrow = trend === 'up' ? '▲' : '▼';
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col gap-3">
      <div className="flex items-center justify-between text-slate-500 text-sm">
        <span>{title}</span>
        {icon && <span className="text-xl">{icon}</span>}
      </div>
      <p className="text-2xl font-semibold text-slate-900">{value}</p>
      {trendText && (
        <span className={`text-xs font-medium ${trendColor}`}>
          {trendArrow} {trendText}
        </span>
      )}
      {accent && <div className="h-1 rounded-full" style={{ backgroundColor: accent }}></div>}
    </div>
  );
};

export default KpiCard;
