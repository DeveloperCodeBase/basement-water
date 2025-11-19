import type { GeoJsonObject } from 'geojson';
import { FC, useMemo } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, GeoJSON } from 'react-leaflet';
import { AquiferZone, GroundwaterWell } from '../types/groundwater';
import { formatJalali } from '../utils/date';
import { formatNumber } from '../utils/format';

type Props = {
  wells: GroundwaterWell[];
  aquifers?: AquiferZone[];
  showAquiferLayer: boolean;
  onSelect?: (wellId: string) => void;
};

const statusColor: Record<GroundwaterWell['status'], string> = {
  normal: '#22c55e',
  warning: '#f97316',
  critical: '#ef4444',
};

const GroundwaterMap: FC<Props> = ({ wells, aquifers, showAquiferLayer, onSelect }) => {
  const defaultCenter: [number, number] = [35.58, 53.39];
  const validWells = useMemo(
    () =>
      wells.filter(
        (well) => Number.isFinite(well.latitude) && Number.isFinite(well.longitude) && Math.abs(well.latitude) <= 90 && Math.abs(well.longitude) <= 180,
      ),
    [wells],
  );
  const center = validWells.length ? ([validWells[0].latitude, validWells[0].longitude] as [number, number]) : defaultCenter;

  return (
    <div className="relative w-full h-full min-h-[320px] rounded-2xl overflow-hidden shadow-sm border border-slate-100">
      <MapContainer center={center} zoom={7} className="h-full w-full" scrollWheelZoom>
        <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {showAquiferLayer &&
          aquifers?.map((aquifer) => (
            <GeoJSON
              key={aquifer.id}
              data={{
                type: 'Feature',
                properties: { name: aquifer.name },
                geometry: aquifer.geometry,
              } as GeoJsonObject}
              style={{
                color: aquiferColor(aquifer.status),
                weight: 1,
                fillOpacity: 0.2,
              }}
            />
          ))}
        {validWells.map((well) => (
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
      <div className="absolute bottom-4 end-4 bg-white/95 rounded-xl px-4 py-3 text-xs text-slate-700 shadow flex flex-col gap-2">
        <span className="font-semibold text-slate-900">راهنمای وضعیت</span>
        <div className="flex flex-col gap-1">
          <span className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full bg-emerald-500"></span> چاه عادی
          </span>
          <span className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full bg-orange-500"></span> نیاز به توجه
          </span>
          <span className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full bg-red-500"></span> بحرانی
          </span>
        </div>
        {showAquiferLayer && (
          <div className="mt-2 border-t border-slate-200 pt-2 flex flex-col gap-1">
            <span className="text-[11px] text-slate-500">لایه آبخوان‌ها</span>
            {[{ label: 'عادی', color: aquiferColor('normal') }, { label: 'هشدار', color: aquiferColor('warning') }, { label: 'بحرانی', color: aquiferColor('critical') }].map((item) => (
              <span key={item.label} className="flex items-center gap-2">
                <span className="inline-block w-4 h-2 rounded-full" style={{ backgroundColor: item.color }}></span>
                {item.label}
              </span>
            ))}
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

const aquiferColor = (status: AquiferZone['status']) => {
  switch (status) {
    case 'critical':
      return '#ef4444';
    case 'warning':
      return '#f97316';
    default:
      return '#22c55e';
  }
};

export default GroundwaterMap;
