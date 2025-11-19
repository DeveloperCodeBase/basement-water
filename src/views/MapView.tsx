import { useEffect, useMemo, useState } from 'react';
import GroundwaterMap from '../components/GroundwaterMap';
import { getCriticalZones, getWells } from '../services/groundwaterData';
import { GroundwaterWell, GroundwaterWellType } from '../types/groundwater';
import { formatJalali } from '../utils/date';
import { formatNumber } from '../utils/format';

const MapView = () => {
  const [wells, setWells] = useState<GroundwaterWell[]>([]);
  const [selectedPlain, setSelectedPlain] = useState('همه دشت‌ها');
  const [typeFilter, setTypeFilter] = useState<GroundwaterWellType>('monitoring');
  const [showCriticalLayer, setShowCriticalLayer] = useState(true);
  const [selectedWellId, setSelectedWellId] = useState<string | null>(null);
  const criticalZones = getCriticalZones();

  useEffect(() => {
    getWells().then(setWells);
  }, []);

  const plains = useMemo(() => ['همه دشت‌ها', ...Array.from(new Set(wells.map((well) => well.plain)))], [wells]);

  const filteredWells = useMemo(() => {
    return wells.filter((well) => {
      const matchesPlain = selectedPlain === 'همه دشت‌ها' || well.plain === selectedPlain;
      const matchesType = well.type === typeFilter;
      return matchesPlain && matchesType;
    });
  }, [wells, selectedPlain, typeFilter]);

  const selectedWell = wells.find((well) => well.id === selectedWellId);

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          <div className="flex flex-col text-sm text-slate-600">
            نوع چاه
            <div className="mt-2 flex flex-wrap gap-2">
              {[
                { key: 'monitoring', label: 'چاه‌های پایش' },
                { key: 'extraction', label: 'چاه‌های بهره‌برداری' },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => setTypeFilter(item.key as GroundwaterWellType)}
                  className={`px-3 py-2 rounded-xl border text-xs ${
                    typeFilter === item.key ? 'bg-primary/10 border-primary text-primary' : 'border-slate-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input type="checkbox" checked={showCriticalLayer} onChange={(e) => setShowCriticalLayer(e.target.checked)} />
            نمایش لایه مناطق بحرانی
          </label>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-6">
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold text-slate-800">نقشه چاه‌ها و وضعیت آبخوان</h3>
          <p className="text-sm text-slate-500">لایه پایه OSM با مختصات WGS84 (EPSG:4326)</p>
        </div>
        <GroundwaterMap
          wells={filteredWells}
          criticalZones={criticalZones}
          showCriticalLayer={showCriticalLayer}
          onSelect={setSelectedWellId}
        />
        {selectedWell && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-slate-100 p-4 bg-slate-50">
              <h4 className="text-base font-semibold text-slate-800 mb-2">اطلاعات چاه انتخاب‌شده</h4>
              <dl className="text-sm text-slate-600 space-y-1">
                <div className="flex justify-between">
                  <dt>نام چاه</dt>
                  <dd className="font-semibold text-slate-800">{selectedWell.name}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>دشت / آبخوان</dt>
                  <dd>{selectedWell.plain}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>نوع</dt>
                  <dd>{selectedWell.type === 'monitoring' ? 'پایش' : 'بهره‌برداری'}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>وضعیت</dt>
                  <dd>{statusLabel(selectedWell.status)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>آخرین سطح آب</dt>
                  <dd>{formatNumber(selectedWell.static_water_level_m ?? 0)} متر</dd>
                </div>
                <div className="flex justify-between">
                  <dt>تاریخ آخرین اندازه‌گیری</dt>
                  <dd>{formatJalali(selectedWell.latestMeasurementDate)}</dd>
                </div>
              </dl>
            </div>
            <div className="rounded-2xl border border-slate-100 p-4 flex flex-col gap-3">
              <h4 className="text-base font-semibold text-slate-800">مختصات ژئودتیک</h4>
              <div className="text-sm text-slate-600">
                <p>عرض جغرافیایی: {selectedWell.latitude.toFixed(4)}°</p>
                <p>طول جغرافیایی: {selectedWell.longitude.toFixed(4)}°</p>
                <p>سیستم مختصات: WGS84 (EPSG:4326)</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const statusLabel = (status: GroundwaterWell['status']) => {
  switch (status) {
    case 'warning':
      return 'نیاز به توجه';
    case 'critical':
      return 'بحرانی';
    default:
      return 'عادی';
  }
};

export default MapView;
