import { useEffect, useState } from 'react';
import { reportList } from '../data/mockData';

const ReportsView = () => {
  const [reports, setReports] = useState(reportList);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [form, setForm] = useState({ type: 'ماهانه', plain: 'دشت سمنان', range: 'فروردین ۱۴۰۳' });
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(''), 3000);
    return () => clearTimeout(id);
  }, [toast]);

  const handleCreate = () => {
    const newReport = {
      id: Date.now(),
      name: `گزارش ${form.type} ${form.plain} – ${form.range}`,
      date: 'امروز',
      creator: 'demo',
    };
    setReports((prev) => [newReport, ...prev]);
    setDrawerOpen(false);
    setToast('گزارش نمونه با موفقیت ایجاد شد (حالت نمایشی)');
  };

  return (
    <div className="relative">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-800">گزارش‌های ذخیره شده</h3>
            <p className="text-sm text-slate-500">لیست گزارش‌های تولید شده توسط تیم پایش و تحلیل</p>
          </div>
          <button className="bg-primary text-white rounded-xl px-5 py-2.5 shadow-lg shadow-primary/20" onClick={() => setDrawerOpen(true)}>
            ایجاد گزارش جدید
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead>
              <tr className="text-slate-500 border-b">
                <th className="py-2">عنوان گزارش</th>
                <th className="py-2">تاریخ</th>
                <th className="py-2">ایجادکننده</th>
                <th className="py-2">دانلود</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id} className="border-b last:border-b-0">
                  <td className="py-3 font-medium text-slate-800">{report.name}</td>
                  <td className="py-3 text-slate-500">{report.date}</td>
                  <td className="py-3 text-slate-500">{report.creator}</td>
                  <td className="py-3 text-primary text-lg">⬇️</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {drawerOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-start" onClick={() => setDrawerOpen(false)}>
          <div
            className="bg-white w-full sm:w-96 h-full p-6 shadow-2xl"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <h4 className="text-lg font-semibold text-slate-800 mb-4">فرم ایجاد گزارش</h4>
            <label className="text-sm text-slate-600 flex flex-col gap-2 mb-4">
              نوع گزارش
              <select className="border border-slate-200 rounded-xl px-3 py-2" value={form.type} onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value }))}>
                <option>ماهانه</option>
                <option>فصلی</option>
                <option>سالانه</option>
              </select>
            </label>
            <label className="text-sm text-slate-600 flex flex-col gap-2 mb-4">
              انتخاب دشت
              <select className="border border-slate-200 rounded-xl px-3 py-2" value={form.plain} onChange={(e) => setForm((prev) => ({ ...prev, plain: e.target.value }))}>
                <option>دشت سمنان</option>
                <option>دشت گرمسار</option>
                <option>دشت دامغان</option>
              </select>
            </label>
            <label className="text-sm text-slate-600 flex flex-col gap-2 mb-6">
              بازه زمانی
              <input type="text" className="border border-slate-200 rounded-xl px-3 py-2" value={form.range} onChange={(e) => setForm((prev) => ({ ...prev, range: e.target.value }))} />
            </label>
            <button className="w-full bg-primary text-white rounded-xl py-3 font-semibold" onClick={handleCreate}>
              ایجاد
            </button>
          </div>
        </div>
      )}

      {toast && <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-full shadow-lg">{toast}</div>}
    </div>
  );
};

export default ReportsView;
