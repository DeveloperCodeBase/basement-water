import { useEffect, useMemo, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  BarChart,
  Bar,
} from 'recharts';
import { alerts, declineByPlain, initialWaterLevelSeries } from '../data/mockData';
import KpiCard from '../components/KpiCard';
import { formatNumber, toPersianDigits } from '../utils/format';

const OverviewView = () => {
  const [series, setSeries] = useState(initialWaterLevelSeries);

  useEffect(() => {
    const id = setInterval(() => {
      setSeries((prev) => {
        const last = prev[prev.length - 1];
        const nextValue = last.observed + (Math.random() * 0.6 - 0.3);
        const newItem = {
          name: `بازه جدید ${toPersianDigits(prev.length + 1)}`,
          observed: parseFloat(nextValue.toFixed(2)),
          ai: parseFloat((nextValue - 0.4 + Math.random() * 0.5).toFixed(2)),
        };
        return [...prev.slice(-11), newItem];
      });
    }, 4000);
    return () => clearInterval(id);
  }, []);

  const kpiData = useMemo(
    () => [
      { title: 'میانگین سطح آب زیرزمینی', value: '-۲۳٫۴ متر', trend: 'down', trendText: '۰٫۳- متر نسبت به ماه قبل', icon: '📉' },
      { title: 'افت متوسط سالانه', value: '-۰٫۶۵ متر/سال', trend: 'down', trendText: '۰٫۰۵- نسبت به سال قبل', icon: '🌀' },
      { title: 'تعداد چاه‌های پایش فعال', value: '۱۲۸ چاه', trend: 'up', trendText: '۴+ چاه جدید', icon: '🛰️' },
      { title: 'مناطق در وضعیت بحرانی', value: '۵ منطقه', trend: 'down', trendText: '۱- نسبت به ماه قبل', icon: '⚠️' },
    ],
    []
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpiData.map((item) => (
          <KpiCard key={item.title} {...item} />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 xl:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-800">روند تغییرات سطح آب زیرزمینی در استان سمنان</h3>
              <p className="text-sm text-slate-500">مقایسه مشاهدات واقعی و پیش‌بینی مدل هوش مصنوعی</p>
            </div>
            <span className="text-xs text-slate-500">به‌روزرسانی هر ۴ ثانیه</span>
          </div>
          <div className="h-72">
            <ResponsiveContainer>
              <LineChart data={series}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={1} label={{ value: 'زمان', position: 'insideBottom', offset: -5 }} />
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
            <span className="text-xs text-slate-500">آخرین ۶ مورد</span>
          </div>
          <ul className="space-y-4">
            {alerts.map((alert) => (
              <li key={alert.id} className="flex items-start gap-3">
                <span
                  className={
                    alert.type === 'danger'
                      ? 'text-rose-500'
                      : alert.type === 'warning'
                      ? 'text-amber-500'
                      : 'text-sky-500'
                  }
                >
                  ●
                </span>
                <div>
                  <p className="text-sm text-slate-700">{alert.text}</p>
                  <p className="text-xs text-slate-400 mt-1">{alert.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">افت متوسط سالانه به تفکیک دشت‌ها</h3>
        <div className="h-64">
          <ResponsiveContainer>
            <BarChart data={declineByPlain}>
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
