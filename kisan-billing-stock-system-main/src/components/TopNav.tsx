import React from 'react';
import { Search, Bell, Calendar, ChevronDown, Globe } from 'lucide-react';
import { Transaction, Farmer } from './types';
import { Language } from '../translations';

interface TopNavProps {
  onToggleSidebar: () => void;
  onNavigate: (tab: any) => void;
  transactions: Transaction[];
  farmers: Farmer[];
  onSelectTransaction: (tx: Transaction) => void;
  onSelectFarmer: (farmer: Farmer) => void;
  lang: Language;
  toggleLanguage: () => void;
  t: any;
}

export const TopNav: React.FC<TopNavProps> = ({
  onToggleSidebar,
  onNavigate,
  transactions,
  farmers,
  onSelectTransaction,
  onSelectFarmer,
  lang,
  toggleLanguage,
  t
}) => {
  return (
    <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-20">
      {/* Left: Mobile Toggle & Search Bar */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="relative w-full">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder={lang === 'en' ? "Search farmers, bills, invoices..." : "किसान, बिल, या चालान खोजें..."}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
          />
        </div>
      </div>

      {/* Right: Language Toggle, Notifications, Date & Admin Profile */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Language Toggle Button */}
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold hover:bg-emerald-100 transition shadow-xs"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>{lang === 'en' ? '🇮🇳 हिंदी' : '🇺🇸 English'}</span>
        </button>

        {/* Notification Bell */}
        <div className="relative hidden sm:flex items-center justify-center w-9 h-9 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-100 transition cursor-pointer">
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full"></span>
        </div>

        {/* Date Display */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600">
          <Calendar className="w-3.5 h-3.5 text-emerald-600" />
          <span className="font-semibold">20 May 2025</span>
        </div>

        {/* Admin Profile */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs shadow-xs">
            A
          </div>
          <div className="hidden lg:block text-left">
            <div className="text-xs font-bold text-slate-800">Admin</div>
            <div className="text-[10px] text-slate-400 font-medium">Owner</div>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden lg:block" />
        </div>
      </div>
    </header>
  );
};