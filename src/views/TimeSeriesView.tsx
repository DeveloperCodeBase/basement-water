import { useEffect, useMemo, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';
import { GroundwaterMeasurement, GroundwaterWell } from '../types/groundwater';
import { getWellTimeSeries, getWells } from '../services/groundwaterData';
import { formatNumber } from '../utils/format';
import JalaliDatePicker from '../components/JalaliDatePicker';
import { addDays, formatJalali } from '../utils/date';

const metricOptions = [
  { key: 'water_level_m', label: 'سطح آب زیرزمینی', color: '#1C7ED6' },
  { key: 'rain_mm', label: 'بارش', color: '#51CF66' },
  { key: 'withdrawal_mcm', label: 'حجم برداشت', color: '#F59F00' },
] as const;

type MetricKey = typeof metricOptions[number]['key'];

const TimeSeriesView = () => {
  const [wells, setWells] = useState<GroundwaterWell[]>([]);
  const [selectedWell, setSelectedWell] = useState<string>('');
  const [range, setRange] = useState<[string, string]>([
    addDays(new Date().toISOString(), -365),
    new Date().toISOString(),
  ]);
  const [activeMetrics, setActiveMetrics] = useState<MetricKey[]>(['water_level_m', 'rain_mm', 'withdrawal_mcm']);
  const [measurements, setMeasurements] = useState<GroundwaterMeasurement[]>([]);

  useEffect(() => {
    getWells().then((data) => {
      setWells(data);
      if (!selectedWell && data.length) {
        setSelectedWell(data[0].id);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!selectedWell) return;
    getWellTimeSeries(selectedWell).then(setMeasurements);
  }, [selectedWell]);

  const filteredData = useMemo(() => {
    const [start, end] = range;
    return measurements
      .filter((item) => item.timestamp >= start && item.timestamp <= end)
      .sort((a, b) => (a.timestamp < b.timestamp ? -1 : 1))
      .map((item) => ({
        ...item,
        name: item.timestamp,
      }));
  }, [measurements, range]);

  const stats = useMemo(() => {
    if (!filteredData.length) {
      return { min: 0, max: 0, avg: 0, decline: 0 };
    }
    const levels = filteredData.map((d) => d.water_level_m);
    return {
      min: Math.min(...levels),
      max: Math.max(...levels),
      avg: levels.reduce((sum, value) => sum + value, 0) / levels.length,
      decline: levels[levels.length - 1] - levels[0],
    };
  }, [filteredData]);

  const toggleMetric = (key: MetricKey) => {
    setActiveMetrics((prev) => (prev.includes(key) ? prev.filter((metric) => metric !== key) : [...prev, key]));
  };

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 grid grid-cols-1 md:grid-cols-4 gap-4">
        <label className="text-sm text-slate-600 flex flex-col gap-2">
          انتخاب چاه
          <select
            className="border border-slate-200 rounded-xl px-3 py-2"
            value={selectedWell}
            onChange={(e) => setSelectedWell(e.target.value)}
          >
            {wells.map((well) => (
              <option key={well.id} value={well.id}>
                {well.name}
              </option>
            ))}
          </select>
        </label>
        <div className="md:col-span-2 grid grid-cols-1 gap-3">
          <JalaliDatePicker
            label="بازه زمانی"
            value={range}
            onChange={(val) => {
              if (Array.isArray(val)) {
                setRange(val as [string, string]);
              }
            }}
            range
          />
        </div>
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
            <LineChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="name"
                tickFormatter={(value) => formatJalali(value, 'YYYY/MM/DD')}
                label={{ value: 'زمان', position: 'insideBottom', offset: -5 }}
              />
              <YAxis tickFormatter={(value) => formatNumber(value, { maximumFractionDigits: 1, minimumFractionDigits: 1 })} label={{ value: 'مقدار', angle: -90, position: 'insideLeft' }} />
              <Tooltip
                formatter={(value: number) => formatNumber(value, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
                labelFormatter={(label) => `زمان: ${formatJalali(label, 'YYYY/MM/DD')}`}
              />
              <Legend />
              {metricOptions.map(
                (metric) =>
                  activeMetrics.includes(metric.key) && (
                    <Line key={metric.key} type="monotone" dataKey={metric.key} name={metric.label} stroke={metric.color} strokeWidth={3} dot={false} />
                  )
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="کمترین سطح آب" value={`${formatNumber(stats.min)} متر`} />
        <StatCard title="بیشترین سطح آب" value={`${formatNumber(stats.max)} متر`} />
        <StatCard title="میانگین سطح آب" value={`${formatNumber(stats.avg)} متر`} />
        <StatCard title="نرخ افت در بازه" value={`${formatNumber(stats.decline)} متر`} />
      </div>
    </div>
  );
};

const StatCard = ({ title, value }: { title: string; value: string }) => (
  <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
    <p className="text-xs text-slate-500">{title}</p>
    <p className="text-xl font-semibold text-slate-800">{value}</p>
  </div>
);

export default TimeSeriesView;
