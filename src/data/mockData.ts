import { GroundwaterMeasurement, GroundwaterWell } from '../types/groundwater';
import { addDays, nowJalaliIso } from '../utils/date';
import { AlertRecord } from '../types/alerts';
import { formatNumber } from '../utils/format';

export type TrendDirection = 'up' | 'down';

export interface OverviewKpi {
  title: string;
  value: string;
  trend?: TrendDirection;
  trendText: string;
}

export const mockWells: GroundwaterWell[] = [
  {
    id: 'well-001',
    name: 'چاه پایش سمنان ۱',
    plain: 'دشت سمنان',
    latitude: 35.576,
    longitude: 53.395,
    type: 'monitoring',
    static_water_level_m: -23.4,
    annual_decline_mpy: -0.7,
    status: 'normal',
    latestMeasurementDate: nowJalaliIso(),
    qualityIndex: 78,
  },
  {
    id: 'well-002',
    name: 'چاه پایش گرمسار ۲',
    plain: 'دشت گرمسار',
    latitude: 35.218,
    longitude: 52.348,
    type: 'monitoring',
    static_water_level_m: -28.1,
    annual_decline_mpy: -1.1,
    status: 'warning',
    latestMeasurementDate: nowJalaliIso(),
    qualityIndex: 65,
  },
  {
    id: 'well-003',
    name: 'چاه بهره‌برداری دامغان ۵',
    plain: 'دشت دامغان',
    latitude: 36.162,
    longitude: 54.343,
    type: 'extraction',
    static_water_level_m: -31.8,
    annual_decline_mpy: -1.6,
    status: 'critical',
    latestMeasurementDate: nowJalaliIso(),
    qualityIndex: 55,
  },
];

export const mockMeasurements: GroundwaterMeasurement[] = mockWells.flatMap((well, wellIndex) => {
  return Array.from({ length: 24 }, (_, idx) => {
    const timestamp = addDays(new Date().toISOString(), idx * -30);
    const baseLevel = -20 - wellIndex * 3 - idx * 0.25;
    return {
      wellId: well.id,
      timestamp,
      water_level_m: parseFloat((baseLevel + Math.sin(idx / 4)).toFixed(2)),
      predicted_level_m: parseFloat((baseLevel - 0.4).toFixed(2)),
      rain_mm: Math.max(0, 40 + Math.sin(idx / 3) * 15 + wellIndex * 5),
      withdrawal_mcm: Math.max(20, 70 + Math.cos(idx / 2) * 10 + wellIndex * 3),
    };
  });
});

export const mockCriticalZones: GeoJSON.FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { name: 'منطقه بحرانی سمنان' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [53.1, 35.5],
            [53.5, 35.5],
            [53.6, 35.8],
            [53.2, 35.9],
            [53.1, 35.5],
          ],
        ],
      },
    },
  ],
};

export const alerts: AlertRecord[] = [
  {
    id: 1,
    title: 'افزایش سرعت افت سطح آب',
    description: 'سرعت افت آبخوان در ایستگاه سمنان از حد آستانه تعیین‌شده عبور کرده است.',
    plain: 'دشت سمنان',
    severity: 'warning',
    timestamp: addDays(new Date().toISOString(), -1),
  },
  {
    id: 2,
    title: 'افت بحرانی در چاه پایش ۲۳',
    description: 'سطح آب این چاه ۰٫۸ متر پایین‌تر از مقدار میانگین ماه گذشته ثبت شده است.',
    plain: 'دشت گرمسار',
    severity: 'critical',
    timestamp: addDays(new Date().toISOString(), -2),
  },
  {
    id: 3,
    title: 'به‌روزرسانی داده‌های بارش',
    description: 'داده‌های بارش ماهانه از سازمان هواشناسی دریافت و همگام شد.',
    plain: 'سراسر استان',
    severity: 'info',
    timestamp: addDays(new Date().toISOString(), -3),
  },
  {
    id: 4,
    title: 'نیاز به بازدید میدانی',
    description: 'پیشنهاد می‌شود تجهیزات برداشت در چاه ۴۱ دامغان بازبینی شوند.',
    plain: 'دشت دامغان',
    severity: 'warning',
    timestamp: addDays(new Date().toISOString(), -4),
  },
  {
    id: 5,
    title: 'اتمام سهمیه برداشت مجاز',
    description: 'مصرف تجمعی بهره‌برداران این دشت به سقف مجاز سالانه رسید.',
    plain: 'دشت آرادان',
    severity: 'critical',
    timestamp: addDays(new Date().toISOString(), -5),
  },
];

const formatKpiValue = (value: number, unit: string, options?: Intl.NumberFormatOptions) =>
  `${formatNumber(value, options)} ${unit}`;

export const overviewStats: { kpis: OverviewKpi[]; declineByPlain: { name: string; value: number }[] } = {
  kpis: [
    {
      title: 'میانگین سطح آب زیرزمینی',
      value: formatKpiValue(-23.4, 'متر'),
      trend: 'down',
      trendText: 'روند کاهشی نسبت به ماه گذشته',
    },
    {
      title: 'افت متوسط سالانه',
      value: formatKpiValue(-0.65, 'متر/سال'),
      trend: 'down',
      trendText: 'افت کنترل‌شده در بازه سالانه',
    },
    {
      title: 'تعداد چاه‌های پایش فعال',
      value: formatKpiValue(mockWells.length, 'چاه', { maximumFractionDigits: 0, minimumFractionDigits: 0 }),
      trend: 'up',
      trendText: 'افزایش چاه‌های فعال نسبت به فصل قبل',
    },
    {
      title: 'مناطق در وضعیت بحرانی',
      value: formatKpiValue(5, 'منطقه', { maximumFractionDigits: 0, minimumFractionDigits: 0 }),
      trendText: 'ثابت نسبت به ماه پیش',
    },
  ],
  declineByPlain: [
    { name: 'دشت سمنان', value: -0.9 },
    { name: 'دشت گرمسار', value: -1.3 },
    { name: 'دشت دامغان', value: -0.7 },
    { name: 'دشت شاهرود', value: -1.1 },
    { name: 'دشت آرادان', value: -0.5 },
  ],
};

export const scenarioTable = [
  { name: 'وضعیت فعلی', decline: -5.2, deficit: 180 },
  { name: 'سناریوی پیشنهادی', decline: -3.4, deficit: 120 },
  { name: 'سناریوی بدبینانه', decline: -7.1, deficit: 260 },
];

export const reportList = [
  { id: 1, name: 'گزارش ماهانه وضعیت دشت سمنان – فروردین ۱۴۰۳', creator: 'حسام سمنانی', timestamp: addDays(new Date().toISOString(), -10) },
  { id: 2, name: 'گزارش فصلی پایش دشت گرمسار – بهار ۱۴۰۳', creator: 'لیلا رحیمی', timestamp: addDays(new Date().toISOString(), -20) },
  { id: 3, name: 'گزارش سالانه وضعیت آبخوان دامغان – ۱۴۰۲', creator: 'مهدی مرادی', timestamp: addDays(new Date().toISOString(), -40) },
];

export const users = [
  { id: 1, name: 'زهرا احمدی', role: 'مدیر سیستم', status: 'فعال' },
  { id: 2, name: 'محمدرضا کریمی', role: 'کارشناس پایش', status: 'فعال' },
  { id: 3, name: 'سارا جعفری', role: 'کارشناس تحلیل', status: 'معلق' },
];
