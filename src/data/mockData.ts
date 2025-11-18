export const initialWaterLevelSeries = Array.from({ length: 12 }, (_, idx) => {
  const monthNames = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
  const base = -20 - idx * 0.8 + Math.sin(idx / 2) * 0.7;
  return {
    name: `${monthNames[idx]} ۱۴۰۲`,
    observed: parseFloat(base.toFixed(2)),
    ai: parseFloat((base - 0.3 + Math.random() * 0.4).toFixed(2)),
  };
});

export const alerts = [
  { id: 1, text: 'افزایش سرعت افت در دشت سمنان', time: '۵ دقیقه پیش', type: 'warning' },
  { id: 2, text: 'افت بیش از حد آستانه در چاه شماره ۲۳', time: '۲۰ دقیقه پیش', type: 'danger' },
  { id: 3, text: 'به‌روزرسانی موفق داده‌های پایش', time: '۱ ساعت پیش', type: 'info' },
  { id: 4, text: 'نیاز به بررسی مجدد پمپ چاه ۴۱', time: '۲ ساعت پیش', type: 'warning' },
  { id: 5, text: 'اتمام حجم برداشت مجاز در دشت دامغان', time: '۳ ساعت پیش', type: 'danger' },
];

export const declineByPlain = [
  { name: 'دشت سمنان', value: -0.9 },
  { name: 'دشت گرمسار', value: -1.3 },
  { name: 'دشت دامغان', value: -0.7 },
  { name: 'دشت شاهرود', value: -1.1 },
  { name: 'دشت آرادان', value: -0.5 },
];

export const wellMarkers = [
  { id: 'SMN-01', aquifer: 'دشت سمنان', type: 'monitor', status: 'normal', waterLevel: -24.5, decline: -0.8, x: 40, y: 35 },
  { id: 'SMN-05', aquifer: 'دشت سمنان', type: 'extraction', status: 'warning', waterLevel: -28.1, decline: -1.3, x: 55, y: 30 },
  { id: 'GRM-12', aquifer: 'دشت گرمسار', type: 'monitor', status: 'critical', waterLevel: -31.4, decline: -1.8, x: 30, y: 45 },
  { id: 'DMG-03', aquifer: 'دشت دامغان', type: 'monitor', status: 'normal', waterLevel: -22.0, decline: -0.6, x: 60, y: 55 },
  { id: 'SHR-07', aquifer: 'دشت شاهرود', type: 'extraction', status: 'warning', waterLevel: -27.3, decline: -1.1, x: 45, y: 65 },
  { id: 'ARD-09', aquifer: 'دشت آرادان', type: 'monitor', status: 'critical', waterLevel: -33.2, decline: -2.0, x: 25, y: 60 },
];

export const wellsTable = Array.from({ length: 32 }, (_, idx) => {
  const plains = ['دشت سمنان', 'دشت گرمسار', 'دشت دامغان', 'دشت شاهرود'];
  const statuses = ['عادی', 'هشدار', 'بحرانی'];
  const type = idx % 2 === 0 ? 'پایش' : 'بهره‌برداری';
  const status = statuses[idx % statuses.length];
  return {
    id: `چاه-${idx + 1}`,
    aquifer: plains[idx % plains.length],
    type,
    level: parseFloat((-20 - Math.random() * 15).toFixed(1)),
    decline: parseFloat((-0.3 - Math.random() * 1.2).toFixed(2)),
    status,
  };
});

export const reportList = [
  {
    id: 1,
    name: 'گزارش ماهانه وضعیت دشت سمنان – فروردین ۱۴۰۳',
    date: '۱۴۰۳/۰۲/۱۰',
    creator: 'sameni',
  },
  {
    id: 2,
    name: 'گزارش فصلی پایش دشت گرمسار – بهار ۱۴۰۳',
    date: '۱۴۰۳/۰۴/۰۲',
    creator: 'rahimi',
  },
  {
    id: 3,
    name: 'گزارش سالانه وضعیت آبخوان دامغان – ۱۴۰۲',
    date: '۱۴۰۳/۰۱/۲۵',
    creator: 'moradi',
  },
];

export const scenarioTable = [
  { name: 'وضعیت فعلی', decline: -5.2, deficit: 180 },
  { name: 'سناریوی پیشنهادی', decline: -3.4, deficit: 120 },
  { name: 'سناریوی بدبینانه', decline: -7.1, deficit: 260 },
];

export const users = [
  { id: 1, name: 'زهرا احمدی', role: 'مدیر سیستم', status: 'فعال' },
  { id: 2, name: 'محمدرضا کریمی', role: 'کارشناس پایش', status: 'فعال' },
  { id: 3, name: 'سارا جعفری', role: 'کارشناس تحلیل', status: 'معلق' },
];
