import { useEffect, useMemo, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, BarChart, Bar } from 'recharts';
import { alerts } from '../data/mockData';
import KpiCard from '../components/KpiCard';
import { formatNumber } from '../utils/format';
import { getOverviewStats, getWellTimeSeries } from '../services/groundwaterData';
import { formatJalali } from '../utils/date';
import AlertItem from '../components/AlertItem';

const OverviewView = () => {
  const [series, setSeries] = useState<{ name: string; observed: number; ai: number }[]>([]);
  const overview = useMemo(() => getOverviewStats(), []);

  useEffect(() => {
    let active = true;
    getWellTimeSeries('well-001').then((data) => {
      if (!active) return;
      const mapped = data
        .slice(-12)
        .map((point) => ({
          name: formatJalali(point.timestamp, 'MMM YYYY'),
          observed: point.water_level_m,
          ai: point.predicted_level_m ?? point.water_level_m - 0.3,
        }))
        .reverse();
      setSeries(mapped);
    });
    const id = setInterval(() => {
      setSeries((prev) => {
        if (!prev.length) return prev;
        const last = prev[prev.length - 1];
        const nextValue = last.observed + (Math.random() * 0.6 - 0.3);
        const newItem = {
          name: formatJalali(new Date().toISOString(), 'MMM YYYY'),
          observed: parseFloat(nextValue.toFixed(2)),
          ai: parseFloat((nextValue - 0.4 + Math.random() * 0.5).toFixed(2)),
        };
        return [...prev.slice(-11), newItem];
      });
    }, 5000);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {overview.kpis.map((item) => (
          <KpiCard key={item.title} title={item.title} value={item.value} trend={item.trend} trendText={item.trendText} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-800">روند تغییرات سطح آب زیرزمینی در استان سمنان</h3>
              <p className="text-sm text-slate-500">مقایسه مشاهدات واقعی و پیش‌بینی مدل هوش مصنوعی</p>
            </div>
            <span className="text-xs text-slate-500">به‌روزرسانی هر ۵ ثانیه</span>
          </div>
          <div className="h-72">
            <ResponsiveContainer>
              <LineChart data={series}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" label={{ value: 'زمان', position: 'insideBottom', offset: -5 }} />
                <YAxis tickFormatter={(v) => `${formatNumber(v, { maximumFractionDigits: 1, minimumFractionDigits: 1 })} متر`} label={{ value: 'ارتفاع سطح آب (متر)', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value: number) => `${formatNumber(value, { maximumFractionDigits: 2, minimumFractionDigits: 2 })} متر`} />
                <Legend verticalAlign="top" />
                <Line type="monotone" dataKey="observed" name="مشاهدات واقعی" stroke="#1C7ED6" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="ai" name="پیش‌بینی مدل هوش مصنوعی" stroke="#15AABF" strokeDasharray="5 5" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800">هشدارهای اخیر</h3>
            <span className="text-xs text-slate-500">آخرین ۵ مورد ثبت‌شده</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {alerts.map((alert) => (
              <AlertItem key={alert.id} {...alert} />
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">افت متوسط سالانه به تفکیک دشت‌ها</h3>
        <div className="h-64">
          <ResponsiveContainer>
            <BarChart data={overview.declineByPlain}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" label={{ value: 'نام دشت', position: 'insideBottom', offset: -5 }} />
              <YAxis tickFormatter={(v) => `${formatNumber(v, { maximumFractionDigits: 1, minimumFractionDigits: 1 })} متر`} label={{ value: 'افت متوسط (متر)', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value: number) => `${formatNumber(value, { maximumFractionDigits: 1, minimumFractionDigits: 1 })} متر`} />
              <Bar dataKey="value" fill="#1C7ED6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default OverviewView;
