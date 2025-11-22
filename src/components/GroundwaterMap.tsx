import { useMemo } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, GeoJSON } from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';
import type { GeoJsonObject } from 'geojson';
import L from 'leaflet';
import { mockAquifers, mockWells } from '../data/mockData';
import type { GroundwaterWell, AquiferZone } from '../types/groundwater';
import { formatJalali } from '../utils/date';
import { formatNumber } from '../utils/format';

const statusColors: Record<GroundwaterWell['status'], string> = {
  normal: '#22c55e',
  warning: '#f59e0b',
  critical: '#ef4444',
};

const aquiferFill: Record<AquiferZone['status'], string> = {
  normal: '#22c55e',
  warning: '#f59e0b',
  critical: '#ef4444',
};

const defaultCenter: LatLngExpression = [35.57, 53.39];

// Ensure default marker icons load in bundlers like Vite
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const GroundwaterMap = () => {
  const mapCenter = useMemo<LatLngExpression>(() => {
    if (!mockWells.length) return defaultCenter;
    const valid = mockWells.filter(
      (w) => Number.isFinite(w.latitude) && Number.isFinite(w.longitude),
    );
    if (!valid.length) return defaultCenter;
    const avgLat =
      valid.reduce((sum, well) => sum + (well.latitude ?? 0), 0) / valid.length;
    const avgLon =
      valid.reduce((sum, well) => sum + (well.longitude ?? 0), 0) / valid.length;
    return [avgLat, avgLon];
  }, []);

  return (
    <div className="relative h-full w-full rounded-2xl border border-slate-800 bg-slate-900/60 min-h-[320px]">
      <MapContainer className="h-full w-full" center={mapCenter} zoom={8} scrollWheelZoom>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {mockAquifers.map((aquifer) => (
          <GeoJSON
            key={aquifer.id}
            data={aquifer.geometry as GeoJsonObject}
            style={{
              color: aquiferFill[aquifer.status],
              weight: 1.5,
              fillColor: aquiferFill[aquifer.status],
              fillOpacity: 0.18,
            }}
          >
            <Popup>
              <div className="space-y-1 text-xs">
                <p className="font-semibold">{aquifer.name}</p>
                <p>وضعیت: {aquifer.status === 'normal' ? 'عادی' : aquifer.status === 'warning' ? 'هشدار' : 'بحرانی'}</p>
              </div>
            </Popup>
          </GeoJSON>
        ))}

        {mockWells.map((well) => (
          <CircleMarker
            key={well.id}
            center={[well.latitude, well.longitude]}
            radius={10}
            weight={2}
            color={statusColors[well.status]}
            fillColor={statusColors[well.status]}
            fillOpacity={0.8}
          >
            <Popup>
              <div className="space-y-1 text-xs leading-5">
                <p className="text-sm font-semibold text-slate-900">{well.name}</p>
                <p className="text-slate-700">شناسه: {well.id}</p>
                <p className="text-slate-700">دشت: {well.plain}</p>
                <p className="text-slate-700">
                  آخرین قرائت: {formatJalali(well.latestMeasurementDate, 'YYYY/MM/DD')}
                </p>
                <p className="text-slate-700">
                  سطح آب: {formatNumber(well.static_water_level_m ?? 0)} متر
                </p>
                <p className="text-slate-700">
                  نرخ افت سالانه: {formatNumber(well.annual_decline_mpy ?? 0)} متر/سال
                </p>
                <p className="text-slate-700">
                  وضعیت: {well.status === 'normal' ? 'عادی' : well.status === 'warning' ? 'نیاز به توجه' : 'بحرانی'}
                </p>
                {well.qualityIndex && (
                  <p className="text-slate-700">شاخص کیفیت آب: {well.qualityIndex}</p>
                )}
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>

      <div className="pointer-events-none absolute bottom-4 left-4 flex flex-col gap-2 rounded-xl border border-white/20 bg-slate-900/80 px-3 py-2 text-xs text-white">
        <p className="text-[11px] font-semibold text-slate-200">راهنمای وضعیت چاه‌ها</p>
        {Object.entries(statusColors).map(([key, color]) => (
          <div key={key} className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
            <span>
              {key === 'normal' ? 'وضعیت عادی' : key === 'warning' ? 'نیاز به توجه' : 'وضعیت بحرانی'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroundwaterMap;
