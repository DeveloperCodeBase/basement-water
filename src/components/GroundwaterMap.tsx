import { FC } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { GroundwaterWell } from '../types/groundwater';
import { formatJalali } from '../utils/date';
import { formatNumber } from '../utils/format';

type Props = {
  wells: GroundwaterWell[];
  criticalZones?: GeoJSON.FeatureCollection;
  showCriticalLayer: boolean;
  onSelect?: (wellId: string) => void;
};

const statusColor: Record<GroundwaterWell['status'], string> = {
  normal: '#22c55e',
  warning: '#f97316',
  critical: '#ef4444',
};

const GroundwaterMap: FC<Props> = ({ wells, criticalZones, showCriticalLayer, onSelect }) => {
  const center: [number, number] = [35.58, 53.39];

  return (
    <div className="relative w-full h-[320px] md:h-[480px] rounded-2xl overflow-hidden shadow-sm border border-slate-100">
      <MapContainer center={center} zoom={7} className="w-full h-full" scrollWheelZoom>
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {showCriticalLayer && criticalZones && <GeoJSON data={criticalZones} style={{ color: '#f97316', weight: 1, fillOpacity: 0.2 }} />}
        {wells.map((well) => (
          <CircleMarker
            key={well.id}
            center={[well.latitude, well.longitude]}
            radius={8}
            pathOptions={{ color: statusColor[well.status], fillColor: statusColor[well.status], fillOpacity: 0.8 }}
            eventHandlers={{
              click: () => onSelect?.(well.id),
            }}
          >
            <Popup>
              <div className="space-y-1 text-right">
                <p className="font-semibold">{well.name}</p>
                <p className="text-xs text-slate-600">{well.plain}</p>
                {typeof well.static_water_level_m === 'number' && (
                  <p className="text-xs">آخرین سطح آب: {formatNumber(well.static_water_level_m)} متر</p>
                )}
                <p className="text-xs">وضعیت: {statusLabel(well.status)}</p>
                <p className="text-xs">تاریخ: {formatJalali(well.latestMeasurementDate)}</p>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
      <div className="absolute bottom-4 end-4 bg-white/90 rounded-xl px-3 py-2 text-xs text-slate-700 shadow flex flex-col gap-1">
        <span className="font-semibold text-slate-900">راهنمای وضعیت</span>
        <span className="flex items-center gap-2"><span className="inline-block w-3 h-3 rounded-full bg-emerald-500"></span> عادی</span>
        <span className="flex items-center gap-2"><span className="inline-block w-3 h-3 rounded-full bg-orange-500"></span> نیاز به توجه</span>
        <span className="flex items-center gap-2"><span className="inline-block w-3 h-3 rounded-full bg-red-500"></span> بحرانی</span>
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

export default GroundwaterMap;
