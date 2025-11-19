import dayjs, { ConfigType, Dayjs } from 'dayjs';
import jalaliday from 'jalaliday';

// فعال‌سازی افزونه جلالی و تنظیم حالت پیش‌فرض
dayjs.extend(jalaliday);
const dayjsWithCalendar = dayjs as typeof dayjs & { calendar?: (calendar: string) => typeof dayjs };
dayjsWithCalendar.calendar?.('jalali');

type DayjsWithCalendar = Dayjs & { calendar: (calendar?: string) => Dayjs };

const toJalali = (input?: ConfigType): Dayjs => (dayjs(input) as DayjsWithCalendar).calendar('jalali');

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
