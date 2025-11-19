export type GroundwaterStatus = 'normal' | 'warning' | 'critical';
export type GroundwaterWellType = 'monitoring' | 'extraction';

export interface GroundwaterWell {
  id: string;
  name: string;
  plain: string;
  latitude: number;
  longitude: number;
  type: GroundwaterWellType;
  depth_m?: number;
  static_water_level_m?: number;
  annual_decline_mpy?: number;
  status: GroundwaterStatus;
  latestMeasurementDate: string;
  qualityIndex?: number;
}

export interface GroundwaterMeasurement {
  wellId: string;
  timestamp: string;
  water_level_m: number;
  predicted_level_m?: number;
  rain_mm?: number;
  withdrawal_mcm?: number;
}
