import { FC } from 'react';

const TopBar: FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-slate-100 px-6 py-3 flex items-center justify-between flex-row-reverse">
      <div className="flex items-center gap-3 text-right">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-semibold">
          💧
        </div>
        <div>
          <p className="text-lg font-semibold text-slate-800">شبکه هوشمند ابتکار ویستا</p>
          <p className="text-xs text-slate-500">سامانه پایش منابع آب استان سمنان</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-emerald-600">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          سامانه آنلاین است
        </div>
        <div className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-100">مدیر</div>
        <img
          src="https://avatars.githubusercontent.com/u/9919?s=40&v=4"
          alt="user"
          className="w-10 h-10 rounded-full border border-slate-200"
        />
      </div>
    </header>
  );
};

export default TopBar;
