import { FC } from 'react';
import DatePicker, { DateObject } from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import { dayjsJalali } from '../utils/date';

type PickerValue = string | [string, string];

interface JalaliDatePickerProps {
  label?: string;
  value: PickerValue;
  onChange: (value: PickerValue) => void;
  range?: boolean;
}

const toDateObject = (value: string): DateObject => {
  const safeValue = value || new Date().toISOString();
  return new DateObject({
    date: dayjsJalali(safeValue).toDate(),
    calendar: persian,
    locale: persian_fa,
  });
};

const JalaliDatePicker: FC<JalaliDatePickerProps> = ({ label, value, onChange, range }) => {
  const pickerValue = Array.isArray(value) ? value.map((v) => toDateObject(v)) : toDateObject(value);

  const handleChange = (val: DateObject | DateObject[]) => {
    if (Array.isArray(val)) {
      const [start, end] = val;
      onChange([
        start ? dayjsJalali(start.toDate()).toDate().toISOString() : '',
        end ? dayjsJalali(end.toDate()).toDate().toISOString() : '',
      ]);
    } else {
      onChange(dayjsJalali(val?.toDate()).toDate().toISOString());
    }
  };

  return (
    <label className="text-sm text-slate-600 flex flex-col gap-2">
      {label}
      <DatePicker
        value={pickerValue}
        onChange={handleChange}
        range={range}
        calendar={persian}
        locale={persian_fa}
        containerClassName="w-full"
        inputClass="w-full border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        calendarPosition="bottom-right"
      />
    </label>
  );
};

export default JalaliDatePicker;
