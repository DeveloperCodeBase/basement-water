import dayjs, { Dayjs } from 'dayjs';
import jalaliday from 'jalaliday';

dayjs.extend(jalaliday);
dayjs.locale('fa');

type InputValue = string | number | Date | Dayjs;

export const dayjsJalali = (value?: InputValue) => dayjs(value).calendar('jalali');

export const formatJalali = (value: InputValue, format = 'YYYY/MM/DD') => {
  return dayjsJalali(value).format(format);
};

export const nowJalaliIso = () => dayjsJalali().toDate().toISOString();

export const addDays = (value: InputValue, days: number) => dayjsJalali(value).add(days, 'day').toDate().toISOString();
