import { FC } from 'react';

interface TopBarProps {
  onToggleMenu: () => void;
}

const TopBar: FC<TopBarProps> = ({ onToggleMenu }) => {
  return (
    <header className="sticky top-0 z-30 bg-white shadow-sm border-b border-slate-100 px-4 md:px-6 py-3 flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-3 text-right flex-1 min-w-0">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-semibold flex-shrink-0">
          💧
        </div>
        <div className="min-w-0">
          <p className="text-lg font-semibold text-slate-800 truncate">شبکه هوشمند ابتکار ویستا</p>
          <p className="text-xs text-slate-500">سامانه پایش منابع آب استان سمنان</p>
        </div>
      </div>
      <div className="flex items-center gap-3 ms-auto">
        <button
          className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-full border border-slate-200 text-slate-600"
          onClick={onToggleMenu}
          aria-label="باز کردن منوی اصلی"
        >
          ☰
        </button>
        <div className="flex items-center gap-2 text-xs sm:text-sm text-emerald-600">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="hidden sm:inline">سامانه آنلاین است</span>
          <span className="sm:hidden">آنلاین</span>
        </div>
        <div className="hidden sm:flex items-center gap-3">
          <div className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-100">مدیر</div>
          <img
            src="https://avatars.githubusercontent.com/u/9919?s=40&v=4"
            alt="کاربر"
            className="w-10 h-10 rounded-full border border-slate-200"
          />
        </div>
      </div>
    </header>
  );
};

export default TopBar;
