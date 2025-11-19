import dayjs, { Dayjs } from 'dayjs';
import jalaliday from 'jalaliday';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(jalaliday);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('fa');
dayjs.tz.setDefault('Asia/Tehran');

type InputValue = string | number | Date | Dayjs;

export const dayjsJalali = (value?: InputValue) => dayjs(value).tz('Asia/Tehran').calendar('jalali');

export const formatJalali = (value: InputValue, format = 'YYYY/MM/DD') => dayjsJalali(value).format(format);

export const nowJalaliIso = () => dayjsJalali().toDate().toISOString();

export const addDays = (value: InputValue, days: number) => dayjsJalali(value).add(days, 'day').toDate().toISOString();
