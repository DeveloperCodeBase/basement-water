import { useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { scenarioTable } from '../data/mockData';

const ScenarioView = () => {
  const [withdrawChange, setWithdrawChange] = useState(0);
  const [rainChange, setRainChange] = useState(0);
  const [horizon, setHorizon] = useState('۵ سال آینده');
  const [summary, setSummary] = useState('برای مشاهده نتیجه، سناریو را اجرا کنید.');
  const [tableData, setTableData] = useState(scenarioTable);

  const handleRun = () => {
    const factor = 1 + withdrawChange / 100 - rainChange / 150;
    const newData = scenarioTable.map((row, idx) => ({
      ...row,
      decline: parseFloat((row.decline * factor * (idx === 1 ? 0.8 : idx === 2 ? 1.2 : 1)).toFixed(1)),
      deficit: Math.round(row.deficit * factor * (idx === 1 ? 0.85 : idx === 2 ? 1.3 : 1)),
    }));
    setTableData(newData);
    const declineText = (newData[1].decline * -1).toFixed(1);
    setSummary(
      `با کاهش ${withdrawChange}% در برداشت و تغییر ${rainChange}% در بارش، انتظار می‌رود سطح آب زیرزمینی به طور متوسط ${declineText} متر دیگر در ${horizon} تغییر کند.`
    );
  };

  const chartData = useMemo(() => tableData.map((row) => ({ name: row.name, value: row.decline })), [tableData]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-6">
        <h3 className="text-lg font-semibold text-slate-800">تعریف سناریو</h3>
        <label className="text-sm text-slate-600 flex flex-col gap-2">
          تغییر در برداشت آب زیرزمینی (%)
          <input type="range" min="-50" max="50" value={withdrawChange} onChange={(e) => setWithdrawChange(Number(e.target.value))} />
          <span className="text-xs text-slate-500">{withdrawChange}%</span>
        </label>
        <label className="text-sm text-slate-600 flex flex-col gap-2">
          تغییر در بارش سالانه (%)
          <input type="range" min="-30" max="30" value={rainChange} onChange={(e) => setRainChange(Number(e.target.value))} />
          <span className="text-xs text-slate-500">{rainChange}%</span>
        </label>
        <label className="text-sm text-slate-600 flex flex-col gap-2">
          افق زمانی سناریو
          <select className="border border-slate-200 rounded-xl px-3 py-2" value={horizon} onChange={(e) => setHorizon(e.target.value)}>
            <option>۵ سال آینده</option>
            <option>۱۰ سال آینده</option>
          </select>
        </label>
        <button onClick={handleRun} className="w-full bg-primary text-white rounded-xl py-3 font-semibold shadow-lg shadow-primary/20">
          اجرای سناریو
        </button>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 lg:col-span-2 space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">نتیجه کلی</h3>
          <p className="text-sm text-slate-600 mt-2 leading-7">{summary}</p>
        </div>
        <div className="h-72">
          <ResponsiveContainer>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(v) => `${v} متر`} />
              <Tooltip formatter={(value: number) => `${value} متر`} />
              <Bar dataKey="value" fill="#15AABF" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead>
              <tr className="text-slate-500 border-b">
                <th className="py-2">سناریو</th>
                <th className="py-2">افت تجمعی (متر)</th>
                <th className="py-2">کسری مخزن (میلیون مترمکعب)</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row) => (
                <tr key={row.name} className="border-b last:border-b-0">
                  <td className="py-3">{row.name}</td>
                  <td className="py-3">{row.decline}</td>
                  <td className="py-3">{row.deficit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ScenarioView;
