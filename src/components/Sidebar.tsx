import { FC } from 'react';
import clsx from 'clsx';

const menuItems = [
  { id: 'overview', label: 'نمای کلی', icon: '📊' },
  { id: 'map', label: 'نقشه چاه‌ها و آبخوان', icon: '🗺️' },
  { id: 'timeseries', label: 'نمودارهای زمانی', icon: '⏱️' },
  { id: 'ai', label: 'پیش‌بینی هوش مصنوعی', icon: '🤖' },
  { id: 'scenario', label: 'تحلیل سناریوها', icon: '🧮' },
  { id: 'wells', label: 'جدول چاه‌های مشاهده‌ای', icon: '💧' },
  { id: 'reports', label: 'گزارش‌ها', icon: '📄' },
  { id: 'settings', label: 'تنظیمات و کاربران', icon: '⚙️' },
];

interface Props {
  currentView: string;
  onNavigate: (view: string) => void;
}

const Sidebar: FC<Props> = ({ currentView, onNavigate }) => {
  return (
    <aside className="h-full flex flex-col" aria-label="منوی اصلی">
      <div className="px-4 py-4 border-b border-slate-100">
        <p className="text-sm font-medium text-slate-600">دسترسی سریع</p>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onNavigate(item.id)}
                className={clsx(
                  'w-full flex items-center gap-3 flex-row-reverse text-right px-4 py-3 rounded-xl text-sm font-medium',
                  currentView === item.id
                    ? 'bg-gradient-to-l from-primary/90 to-accent/80 text-white shadow'
                    : 'text-slate-600 hover:bg-slate-50'
                )}
                aria-current={currentView === item.id ? 'page' : undefined}
              >
                <span className="flex-1">{item.label}</span>
                <span className="text-lg" aria-hidden>
                  {item.icon}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="px-4 py-4 text-xs text-slate-500 border-t border-slate-100">نسخه نمایشی ۱٫۰</div>
    </aside>
  );
};

export default Sidebar;
