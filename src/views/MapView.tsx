import { useMemo, useState } from 'react';
import { wellMarkers } from '../data/mockData';

const statusColors: Record<string, string> = {
  normal: '#2f9e44',
  warning: '#f08c00',
  critical: '#e03131',
};

const MapView = () => {
  const [selectedPlain, setSelectedPlain] = useState('همه دشت‌ها');
  const [typeFilter, setTypeFilter] = useState<'monitor' | 'extraction'>('monitor');
  const [showCriticalLayer, setShowCriticalLayer] = useState(true);
  const [selectedWell, setSelectedWell] = useState<typeof wellMarkers[0] | null>(null);

  const filtered = useMemo(() => {
    return wellMarkers.filter((well) => {
      const matchesPlain = selectedPlain === 'همه دشت‌ها' || well.aquifer === selectedPlain;
      const matchesType = well.type === typeFilter;
      const matchesCritical = showCriticalLayer ? true : well.status !== 'critical';
      return matchesPlain && matchesType && matchesCritical;
    });
  }, [selectedPlain, typeFilter, showCriticalLayer]);

  const plains = ['همه دشت‌ها', 'دشت سمنان', 'دشت گرمسار', 'دشت دامغان', 'دشت شاهرود', 'دشت آرادان'];

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <label className="flex flex-col text-sm text-slate-600">
            انتخاب دشت
            <select
              className="mt-2 border border-slate-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-primary/30"
              value={selectedPlain}
              onChange={(e) => setSelectedPlain(e.target.value)}
            >
              {plains.map((plain) => (
                <option key={plain}>{plain}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col text-sm text-slate-600">
            نوع چاه
            <div className="mt-2 grid grid-cols-2 gap-2">
              <button
                onClick={() => setTypeFilter('monitor')}
                className={`px-3 py-2 rounded-xl border text-sm ${
                  typeFilter === 'monitor' ? 'bg-primary/10 border-primary text-primary' : 'border-slate-200'
                }`}
              >
                نمایش چاه‌های پایش
              </button>
              <button
                onClick={() => setTypeFilter('extraction')}
                className={`px-3 py-2 rounded-xl border text-sm ${
                  typeFilter === 'extraction' ? 'bg-primary/10 border-primary text-primary' : 'border-slate-200'
                }`}
              >
                نمایش چاه‌های بهره‌برداری
              </button>
            </div>
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input type="checkbox" checked={showCriticalLayer} onChange={(e) => setShowCriticalLayer(e.target.checked)} />
            نمایش لایه مناطق بحرانی
          </label>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800">نقشه چاه‌ها و وضعیت آبخوان</h3>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: statusColors.normal }}></span> وضعیت عادی
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: statusColors.warning }}></span> نیاز به توجه
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: statusColors.critical }}></span> وضعیت بحرانی
            </span>
          </div>
        </div>
        <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl h-[450px] overflow-hidden border border-slate-200">
          {showCriticalLayer && (
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle,_rgba(255,99,99,0.4)_0%,_rgba(255,255,255,0)_70%)]"></div>
          )}
          {filtered.map((well) => (
            <button
              key={well.id}
              style={{ top: `${well.y}%`, left: `${well.x}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              onClick={() => setSelectedWell(well)}
            >
              <span
                className="w-5 h-5 rounded-full border-2 border-white shadow-lg block"
                style={{ backgroundColor: statusColors[well.status] }}
                title={well.id}
              ></span>
            </button>
          ))}
          {selectedWell && (
            <div className="absolute top-4 left-4 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 w-64 text-sm space-y-2">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-slate-800">{selectedWell.id}</p>
                <button className="text-xs text-slate-400" onClick={() => setSelectedWell(null)}>
                  بستن
                </button>
              </div>
              <p className="text-slate-500">{selectedWell.aquifer}</p>
              <p>آخرین سطح آب: {selectedWell.waterLevel} متر</p>
              <p>نرخ افت سالانه: {selectedWell.decline} متر</p>
              <div>
                <p className="text-xs text-slate-400 mb-1">روند ۱۲ ماه اخیر</p>
                <svg viewBox="0 0 100 30" className="w-full h-16 text-primary">
                  <polyline
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    points={Array.from({ length: 12 }, (_, i) => `${(i / 11) * 100},${15 + Math.sin(i) * 8}`).join(' ')}
                  />
                </svg>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapView;
