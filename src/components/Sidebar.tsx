import { FC } from 'react';
import clsx from 'clsx';

const menuItems = [
  { id: 'overview', label: 'نمای کلی' },
  { id: 'map', label: 'نقشه چاه‌ها و آبخوان' },
  { id: 'timeseries', label: 'نمودارهای زمانی' },
  { id: 'ai', label: 'پیش‌بینی هوش مصنوعی' },
  { id: 'scenario', label: 'تحلیل سناریوها' },
  { id: 'wells', label: 'جدول چاه‌های مشاهده‌ای' },
  { id: 'reports', label: 'گزارش‌ها' },
  { id: 'settings', label: 'تنظیمات و کاربران' },
];

interface Props {
  currentView: string;
  onNavigate: (view: string) => void;
  collapsed: boolean;
  onToggle: () => void;
}

const Sidebar: FC<Props> = ({ currentView, onNavigate, collapsed, onToggle }) => {
  return (
    <aside
      className={clsx(
        'bg-white shadow-lg border-s border-slate-100 flex flex-col transition-all duration-300',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      <button
        className="mx-4 my-4 py-2 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-50"
        onClick={onToggle}
      >
        {collapsed ? 'باز کردن' : 'جمع کردن'}
      </button>
      <nav className="flex-1 overflow-y-auto">
        <ul className="px-2 space-y-1">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onNavigate(item.id)}
                className={clsx(
                  'w-full flex items-center text-right px-4 py-3 rounded-xl text-sm font-medium',
                  currentView === item.id
                    ? 'bg-gradient-to-l from-primary/90 to-accent/80 text-white shadow'
                    : 'text-slate-600 hover:bg-slate-50'
                )}
              >
                <span className={collapsed ? 'text-[10px]' : undefined}>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="px-4 py-4 text-xs text-slate-500 border-t border-slate-100">
        نسخه نمایشی ۱٫۰
      </div>
    </aside>
  );
};

export default Sidebar;
