import { useState } from 'react';
import { users } from '../data/mockData';

const SettingsView = () => {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [threshold, setThreshold] = useState('-۱٫۰ متر/سال');

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">مدیریت کاربران</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right min-w-[520px]">
          <thead>
            <tr className="text-slate-500 border-b">
              <th className="py-2">نام کاربر</th>
              <th className="py-2">نقش</th>
              <th className="py-2">وضعیت</th>
              <th className="py-2">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b last:border-b-0">
                <td className="py-3 font-medium text-slate-800">{user.name}</td>
                <td className="py-3">{user.role}</td>
                <td className="py-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${user.status === 'فعال' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    {user.status}
                  </span>
                </td>
                <td className="py-3 space-x-2 space-x-reverse">
                  <button className="text-primary text-xs">ویرایش</button>
                  <button className="text-rose-500 text-xs">غیرفعال کردن</button>
                </td>
              </tr>
            ))}
          </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-6">
        <h3 className="text-lg font-semibold text-slate-800">تنظیمات سامانه</h3>
        <label className="flex items-center justify-between text-sm text-slate-700">
          ارسال هشدار ایمیلی فعال باشد
          <input type="checkbox" checked={emailAlerts} onChange={(e) => setEmailAlerts(e.target.checked)} />
        </label>
        <label className="flex items-center justify-between text-sm text-slate-700">
          ارسال پیامک به مدیران در وضعیت بحرانی
          <input type="checkbox" checked={smsAlerts} onChange={(e) => setSmsAlerts(e.target.checked)} />
        </label>
        <label className="flex flex-col text-sm text-slate-700 gap-2">
          آستانه هشدار افت سالانه (متر/سال)
          <select className="border border-slate-200 rounded-xl px-3 py-2" value={threshold} onChange={(e) => setThreshold(e.target.value)}>
            <option>-۰٫۸ متر/سال</option>
            <option>-۱٫۰ متر/سال</option>
            <option>-۱٫۵ متر/سال</option>
          </select>
        </label>
        <div className="bg-slate-50 rounded-2xl p-4 text-xs text-slate-500 leading-6">
          تنظیمات ذخیره‌سازی نمی‌شود و صرفاً برای ارائه رابط کاربری نمایشی استفاده شده است.
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
