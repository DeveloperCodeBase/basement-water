import type { Feature, FeatureCollection as GeoFeatureCollection, GeoJsonProperties, Geometry } from 'geojson';
import { AquiferZone, GroundwaterMeasurement, GroundwaterWell } from '../types/groundwater';
import { mockWells, mockMeasurements, mockAquifers, overviewStats } from '../data/mockData';

type FeatureCollection = GeoFeatureCollection<Geometry, GeoJsonProperties>;

type DataConfig = {
  wellsUrl?: string;
  measurementsUrl?: string;
  aquifersUrl?: string;
};

const dataConfig: DataConfig = {
  wellsUrl: '/data/semnan-wells.geojson',
  measurementsUrl: '/data/semnan-measurements.json',
  aquifersUrl: '/data/semnan-aquifers.geojson',
};

let hasLoggedDataFallback = false;

const logFallbackWarning = (error: unknown) => {
  if (hasLoggedDataFallback) return;
  console.warn('عدم دسترسی به داده‌های واقعی؛ از مجموعه ساختگی استفاده می‌شود.', error);
  hasLoggedDataFallback = true;
};

const fetchJson = async <T>(url?: string): Promise<T | null> => {
  if (!url) return null;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json') && !contentType.includes('geo+json')) {
      throw new Error(`Unsupported content-type: ${contentType || 'unknown'}`);
    }
    return (await response.json()) as T;
  } catch (error) {
    logFallbackWarning(error);
    return null;
  }
};

const featureToWell = (feature: Feature): GroundwaterWell | null => {
  if (!feature.geometry || feature.geometry.type !== 'Point') return null;
  const [longitude, latitude] = feature.geometry.coordinates as [number, number];
  const properties = feature.properties || {};
  return {
    id: (properties.id as string) || String(feature.id || Math.random()),
    name: (properties.name as string) || 'چاه بدون نام',
    plain: (properties.plain as string) || 'سمنان',
    latitude,
    longitude,
    type: (properties.type as 'monitoring' | 'extraction') || 'monitoring',
    depth_m: typeof properties.depth_m === 'number' ? properties.depth_m : undefined,
    static_water_level_m:
      typeof properties.static_water_level_m === 'number' ? properties.static_water_level_m : undefined,
    status: (properties.status as GroundwaterWell['status']) || 'normal',
    latestMeasurementDate: (properties.latestMeasurementDate as string) || new Date().toISOString(),
    qualityIndex: typeof properties.qualityIndex === 'number' ? properties.qualityIndex : undefined,
  };
};

const featureToAquifer = (feature: Feature): AquiferZone | null => {
  if (!feature.geometry) return null;
  if (feature.geometry.type !== 'Polygon' && feature.geometry.type !== 'MultiPolygon') return null;
  const properties = feature.properties || {};
  return {
    id: (properties.id as string) || String(feature.id || Math.random()),
    name: (properties.name as string) || 'آبخوان بدون نام',
    status: (properties.status as AquiferZone['status']) || 'normal',
    geometry: feature.geometry as AquiferZone['geometry'],
  };
};

export const getWells = async (): Promise<GroundwaterWell[]> => {
  const featureCollection = await fetchJson<FeatureCollection>(dataConfig.wellsUrl);
  if (featureCollection?.features?.length) {
    return featureCollection.features
      .map((feature) => featureToWell(feature) as GroundwaterWell | null)
      .filter((well): well is GroundwaterWell => Boolean(well));
  }
  return mockWells;
};

export const getWellTimeSeries = async (wellId: string): Promise<GroundwaterMeasurement[]> => {
  const remote = await fetchJson<GroundwaterMeasurement[]>(dataConfig.measurementsUrl);
  const source = remote?.length ? remote : mockMeasurements;
  return source.filter((item) => item.wellId === wellId);
};

export const getAquifers = async (): Promise<AquiferZone[]> => {
  const featureCollection = await fetchJson<FeatureCollection>(dataConfig.aquifersUrl);
  if (featureCollection?.features?.length) {
    return featureCollection.features
      .map((feature) => featureToAquifer(feature))
      .filter((item): item is AquiferZone => Boolean(item));
  }
  return mockAquifers;
};

export const getOverviewStats = () => overviewStats;
