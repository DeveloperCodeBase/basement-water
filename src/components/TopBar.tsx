import { FC } from 'react';

interface TopBarProps {
  onToggleMenu: () => void;
}

const TopBar: FC<TopBarProps> = ({ onToggleMenu }) => {
  return (
    <header className="bg-white shadow-sm border-b border-slate-100 px-4 md:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3 text-right">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-semibold">
          💧
        </div>
        <div>
          <p className="text-lg font-semibold text-slate-800">شبکه هوشمند ابتکار ویستا</p>
          <p className="text-xs text-slate-500">سامانه پایش منابع آب استان سمنان</p>
        </div>
      </div>
      <div className="flex items-center gap-3 ms-auto">
        <button
          className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-full border border-slate-200 text-slate-600"
          onClick={onToggleMenu}
          aria-label="باز کردن منو"
        >
          ☰
        </button>
        <div className="sm:hidden text-xs text-emerald-600 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          آنلاین
        </div>
        <div className="hidden sm:flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-emerald-600">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            سامانه آنلاین است
          </div>
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
