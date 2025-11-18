import { useMemo, useState } from 'react';
import { wellsTable } from '../data/mockData';
import { formatNumber, toPersianDigits } from '../utils/format';

const PAGE_SIZE = 8;

type SortKey = 'id' | 'aquifer' | 'type' | 'level' | 'decline' | 'status';

const WellsTableView = () => {
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('id');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    return wellsTable
      .filter((well) => well.id.includes(query) || well.aquifer.includes(query))
      .sort((a, b) => {
        const valueA = a[sortKey];
        const valueB = b[sortKey];
        if (valueA < valueB) return sortDir === 'asc' ? -1 : 1;
        if (valueA > valueB) return sortDir === 'asc' ? 1 : -1;
        return 0;
      });
  }, [query, sortKey, sortDir]);

  const paginated = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">جدول چاه‌های مشاهده‌ای</h3>
          <p className="text-sm text-slate-500">لیست کامل چاه‌های پایش و بهره‌برداری به همراه وضعیت لحظه‌ای</p>
        </div>
        <input
          type="text"
          className="border border-slate-200 rounded-xl px-4 py-2 text-sm"
          placeholder="جستجو بر اساس شناسه یا دشت..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(0);
          }}
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-right min-w-[800px]">
          <thead>
            <tr className="text-slate-500 border-b">
              {[
                { key: 'id', label: 'شناسه چاه' },
                { key: 'aquifer', label: 'نام دشت' },
                { key: 'type', label: 'نوع چاه' },
                { key: 'level', label: 'آخرین سطح آب (متر)' },
                { key: 'decline', label: 'نرخ افت سالانه (متر/سال)' },
                { key: 'status', label: 'وضعیت' },
              ].map((col) => (
                <th
                  key={col.key}
                  className="py-3 cursor-pointer select-none"
                  onClick={() => handleSort(col.key as SortKey)}
                >
                  {col.label}{' '}
                  {sortKey === col.key && (sortDir === 'asc' ? '▲' : '▼')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.map((well) => (
              <tr key={well.id} className={`border-b last:border-b-0 ${well.status === 'بحرانی' ? 'bg-rose-50/70' : ''}`}>
                <td className="py-3 font-semibold text-slate-800">{well.id}</td>
                <td className="py-3">{well.aquifer}</td>
                <td className="py-3">{well.type}</td>
                <td className="py-3">{formatNumber(well.level, { maximumFractionDigits: 1, minimumFractionDigits: 1 })}</td>
                <td className="py-3">{formatNumber(well.decline, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</td>
                <td className="py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      well.status === 'بحرانی'
                        ? 'bg-rose-100 text-rose-700'
                        : well.status === 'هشدار'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    {well.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between text-sm text-slate-600">
        <span>
          صفحه {toPersianDigits(page + 1)} از {toPersianDigits(totalPages)}
        </span>
        <div className="flex gap-2">
          <button
            className="px-3 py-1 rounded-lg border border-slate-200 disabled:opacity-40"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
          >
            قبلی
          </button>
          <button
            className="px-3 py-1 rounded-lg border border-slate-200 disabled:opacity-40"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
          >
            بعدی
          </button>
        </div>
      </div>
    </div>
  );
};

export default WellsTableView;
