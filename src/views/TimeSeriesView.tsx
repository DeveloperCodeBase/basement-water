import { useMemo, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';

const wellOptions = ['چاه-۱', 'چاه-۲', 'چاه-۳', 'چاه-۴'];
const metricOptions = [
  { key: 'level', label: 'سطح آب زیرزمینی', color: '#1C7ED6' },
  { key: 'rain', label: 'بارش', color: '#51CF66' },
  { key: 'withdraw', label: 'حجم برداشت', color: '#F59F00' },
];

const TimeSeriesView = () => {
  const [selectedWell, setSelectedWell] = useState(wellOptions[0]);
  const [startDate, setStartDate] = useState('2024-01-01');
  const [endDate, setEndDate] = useState('2024-12-31');
  const [activeMetrics, setActiveMetrics] = useState(['level', 'rain', 'withdraw']);

  const data = useMemo(() => {
    return Array.from({ length: 24 }, (_, idx) => {
      const base = -20 - Math.sin(idx / 3) * 3 - idx * 0.2;
      return {
        name: `ماه ${idx + 1}`,
        level: parseFloat((base + Math.random()).toFixed(2)),
        rain: Math.max(0, Math.sin(idx / 2) * 20 + 40 + Math.random() * 10),
        withdraw: 80 + Math.cos(idx / 3) * 15 + Math.random() * 5,
      };
    });
  }, [selectedWell, startDate, endDate]);

  const levelValues = data.map((d) => d.level);
  const stats = {
    min: Math.min(...levelValues).toFixed(2),
    max: Math.max(...levelValues).toFixed(2),
    avg: (levelValues.reduce((sum, v) => sum + v, 0) / levelValues.length).toFixed(2),
    decline: (levelValues[levelValues.length - 1] - levelValues[0]).toFixed(2),
  };

  const toggleMetric = (key: string) => {
    setActiveMetrics((prev) => (prev.includes(key) ? prev.filter((m) => m !== key) : [...prev, key]));
  };

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 grid grid-cols-1 md:grid-cols-4 gap-4">
        <label className="text-sm text-slate-600 flex flex-col">
          انتخاب چاه
          <select className="mt-2 border border-slate-200 rounded-xl px-3 py-2" value={selectedWell} onChange={(e) => setSelectedWell(e.target.value)}>
            {wellOptions.map((opt) => (
              <option key={opt}>{opt}</option>
            ))}
          </select>
        </label>
        <label className="text-sm text-slate-600 flex flex-col">
          تاریخ شروع
          <input type="date" className="mt-2 border border-slate-200 rounded-xl px-3 py-2" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </label>
        <label className="text-sm text-slate-600 flex flex-col">
          تاریخ پایان
          <input type="date" className="mt-2 border border-slate-200 rounded-xl px-3 py-2" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </label>
        <div className="flex flex-col text-sm text-slate-600">
          متغیرها
          <div className="mt-2 flex flex-wrap gap-2">
            {metricOptions.map((metric) => (
              <button
                key={metric.key}
                onClick={() => toggleMetric(metric.key)}
                className={`px-3 py-2 rounded-xl border text-xs ${
                  activeMetrics.includes(metric.key) ? 'bg-primary/10 border-primary text-primary' : 'border-slate-200'
                }`}
              >
                {metric.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">نمودارهای زمانی چاه انتخاب‌شده</h3>
        <div className="h-80">
          <ResponsiveContainer>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value: number) => value.toFixed(2)} labelFormatter={(label) => `زمان: ${label}`} />
              <Legend />
              {metricOptions.map(
                (metric) =>
                  activeMetrics.includes(metric.key) && (
                    <Line
                      key={metric.key}
                      type="monotone"
                      dataKey={metric.key}
                      name={metric.label}
                      stroke={metric.color}
                      strokeWidth={3}
                      dot={false}
                    />
                  )
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
          <p className="text-xs text-slate-500">کمترین سطح آب</p>
          <p className="text-xl font-semibold text-slate-800">{stats.min} متر</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
          <p className="text-xs text-slate-500">بیشترین سطح آب</p>
          <p className="text-xl font-semibold text-slate-800">{stats.max} متر</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
          <p className="text-xs text-slate-500">میانگین سطح آب</p>
          <p className="text-xl font-semibold text-slate-800">{stats.avg} متر</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
          <p className="text-xs text-slate-500">نرخ افت در بازه</p>
          <p className="text-xl font-semibold text-slate-800">{stats.decline} متر</p>
        </div>
      </div>
    </div>
  );
};

export default TimeSeriesView;
