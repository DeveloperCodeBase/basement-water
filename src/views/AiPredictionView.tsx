import { useMemo, useState } from 'react';
import { Area, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { formatNumber } from '../utils/format';
import { addDays, formatJalali } from '../utils/date';

const wells = ['چاه-۱۱', 'چاه-۲۵', 'چاه-۳۲'];
const models = ['LSTM', 'Random Forest'];

const AiPredictionView = () => {
  const [selectedWell, setSelectedWell] = useState(wells[0]);
  const [selectedModel, setSelectedModel] = useState(models[0]);
  const [showUncertainty, setShowUncertainty] = useState(true);

  const data = useMemo(() => {
    return Array.from({ length: 24 }, (_, idx) => {
      const base = -20 - idx * 0.4 + Math.sin(idx / 2) * 0.7;
      const future = idx >= 15 ? base - 0.5 + Math.random() * 0.5 : base;
      const date = addDays(new Date().toISOString(), idx * 30);
      return {
        name: formatJalali(date, 'MMM YYYY'),
        observed: idx < 15 ? parseFloat(base.toFixed(2)) : null,
        predicted: parseFloat(future.toFixed(2)),
        bandBase: future - 0.7,
        bandHeight: 1.4,
      };
    });
  }, [selectedWell, selectedModel]);

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4">
        <label className="text-sm text-slate-600 flex flex-col">
          انتخاب چاه
          <select className="mt-2 border border-slate-200 rounded-xl px-3 py-2" value={selectedWell} onChange={(e) => setSelectedWell(e.target.value)}>
            {wells.map((well) => (
              <option key={well}>{well}</option>
            ))}
          </select>
        </label>
        <label className="text-sm text-slate-600 flex flex-col">
          انتخاب مدل
          <select className="mt-2 border border-slate-200 rounded-xl px-3 py-2" value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)}>
            {models.map((model) => (
              <option key={model}>{model}</option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input type="checkbox" checked={showUncertainty} onChange={(e) => setShowUncertainty(e.target.checked)} />
          نمایش عدم قطعیت
        </label>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 xl:col-span-3">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">پیش‌بینی سطح آب زیرزمینی</h3>
          <div className="h-80">
            <ResponsiveContainer>
              <ComposedChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" interval={1} label={{ value: 'زمان', position: 'insideBottom', offset: -5 }} />
                <YAxis
                  tickFormatter={(v) => `${formatNumber(v, { maximumFractionDigits: 1, minimumFractionDigits: 1 })} متر`}
                  label={{ value: 'سطح آب (متر)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip formatter={(value: number) => `${formatNumber(value, { maximumFractionDigits: 2, minimumFractionDigits: 2 })} متر`} />
                {showUncertainty && (
                  <>
                    <Area
                      type="monotone"
                      dataKey="bandBase"
                      stackId="uncertainty"
                      stroke="none"
                      fill="transparent"
                      isAnimationActive={false}
                      activeDot={false}
                      dot={false}
                    />
                    <Area
                      type="monotone"
                      dataKey="bandHeight"
                      stackId="uncertainty"
                      stroke="none"
                      fill="rgba(21,170,191,0.15)"
                      isAnimationActive={false}
                      activeDot={false}
                      dot={false}
                    />
                  </>
                )}
                <Line type="monotone" dataKey="observed" stroke="#1C7ED6" strokeWidth={3} name="مشاهدات گذشته" dot={false} />
                <Line type="monotone" dataKey="predicted" stroke="#F59F00" strokeDasharray="5 5" strokeWidth={3} name="پیش‌بینی مدل" dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col gap-4">
          <h4 className="text-base font-semibold text-slate-800">شاخص‌های عملکرد مدل</h4>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">خطای RMSE مدل</span>
              <span className="font-semibold text-slate-800">۰٫۳۵ متر</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">ضریب تعیین R²</span>
              <span className="font-semibold text-slate-800">۰٫۹۱</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">افق پیش‌بینی</span>
              <span className="font-semibold text-slate-800">۱۲ ماه آینده</span>
            </div>
          </div>
          <p className="text-xs text-slate-500 leading-6">
            مدل {selectedModel} پس از کالیبراسیون روی داده‌های پایش {selectedWell} قادر است روند افت را با دقت بالا پیش‌بینی کند و محدوده عدم
            قطعیت با استفاده از توزیع خطای تاریخی تخمین زده شده است.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AiPredictionView;
