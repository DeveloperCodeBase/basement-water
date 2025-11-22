import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

type RainfallPoint = {
  month: string;
  rainfall_mm: number;
};

const rainfallData: RainfallPoint[] = [
  { month: 'مهر', rainfall_mm: 8 },
  { month: 'آبان', rainfall_mm: 15 },
  { month: 'آذر', rainfall_mm: 32 },
  { month: 'دی', rainfall_mm: 40 },
  { month: 'بهمن', rainfall_mm: 52 },
  { month: 'اسفند', rainfall_mm: 38 },
  { month: 'فروردین', rainfall_mm: 45 },
  { month: 'اردیبهشت', rainfall_mm: 26 },
  { month: 'خرداد', rainfall_mm: 5 },
  { month: 'تیر', rainfall_mm: 1 },
  { month: 'مرداد', rainfall_mm: 0 },
  { month: 'شهریور', rainfall_mm: 2 },
];

const RainfallChart = () => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">نمودار بارش ماهانه (میلی‌متر)</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={rainfallData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="month" label={{ value: 'ماه', position: 'insideBottom', offset: -5 }} />
            <YAxis tickFormatter={(value) => `${value} میلی‌متر`} label={{ value: 'بارش (میلی‌متر)', angle: -90, position: 'insideLeft' }} />
            <Tooltip formatter={(value: number) => `${value} میلی‌متر`} contentStyle={{ borderRadius: '12px' }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="rainfall_mm" fill="#0891b2" radius={[6, 6, 0, 0]} name="بارش (میلی‌متر)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RainfallChart;
