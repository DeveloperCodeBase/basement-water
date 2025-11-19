import dayjs, { ConfigType, Dayjs } from 'dayjs';
import jalaliday from 'jalaliday';

// فعال‌سازی تقویم جلالی برای dayjs
dayjs.extend(jalaliday);

// برخی تایپ‌های dayjs متد calendar را روی نمونه‌ها پشتیبانی می‌کنند؛ برای ست کردن حالت پیش‌فرض در زمان اجرا از این کاست استفاده می‌کنیم.
type JalaliAwareDayjs = typeof dayjs & { calendar?: (cal: string) => void };
(dayjs as JalaliAwareDayjs).calendar?.('jalali');

const toJalali = (input?: ConfigType): Dayjs => dayjs(input).calendar('jalali');

export const dayjsJalali = (input?: ConfigType) => toJalali(input);

export function formatJalali(input: ConfigType, format: string = 'YYYY/MM/DD'): string {
  return toJalali(input).format(format);
}

export function nowJalaliIso(): string {
  return toJalali().toDate().toISOString();
}

export function addDays(value: ConfigType, days: number): string {
  return dayjs(value).add(days, 'day').toISOString();
}
