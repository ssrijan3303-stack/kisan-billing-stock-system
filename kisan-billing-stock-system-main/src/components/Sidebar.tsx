import React from 'react';
import {
  LayoutDashboard,
  Receipt,
  ShoppingCart,
  ShoppingBag,
  Users,
  Sprout,
  Warehouse,
  TrendingUp,
  PieChart,
  CalendarCheck,
  CalendarDays,
  UserCheck,
  CircleDollarSign,
  UserCog,
  Settings,
  X,
  Wheat
} from 'lucide-react';

export type NavTab =
  | 'dashboard'
  | 'billing'
  | 'sales'
  | 'purchase'
  | 'farmers'
  | 'products'
  | 'stock'
  | 'profit-loss'
  | 'stock-report'
  | 'daily-report'
  | 'monthly-report'
  | 'farmer-report'
  | 'expenses'
  | 'users'
  | 'settings';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  isOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isOpen,
  onCloseMobile
}) => {
  const mainNavItems = [
    { id: 'dashboard' as NavTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'billing' as NavTab, label: 'Billing', icon: Receipt },
    { id: 'sales' as NavTab, label: 'Sales', icon: ShoppingCart },
    { id: 'purchase' as NavTab, label: 'Purchase', icon: ShoppingBag },
    { id: 'farmers' as NavTab, label: 'Farmers', icon: Users },
    { id: 'products' as NavTab, label: 'Products (Wheat/Paddy)', icon: Sprout },
    { id: 'stock' as NavTab, label: 'Stock / Warehouse', icon: Warehouse }
  ];

  const reportsNavItems = [
    { id: 'profit-loss' as NavTab, label: 'Profit & Loss', icon: TrendingUp },
    { id: 'stock-report' as NavTab, label: 'Stock Report', icon: PieChart },
    { id: 'daily-report' as NavTab, label: 'Daily Report', icon: CalendarCheck },
    { id: 'monthly-report' as NavTab, label: 'Monthly Report', icon: CalendarDays },
    { id: 'farmer-report' as NavTab, label: 'Farmer Report', icon: UserCheck }
  ];

  const settingsNavItems = [
    { id: 'expenses' as NavTab, label: 'Expenses', icon: CircleDollarSign },
    { id: 'users' as NavTab, label: 'Users', icon: UserCog },
    { id: 'settings' as NavTab, label: 'Settings', icon: Settings }
  ];

  const handleNavClick = (tab: NavTab) => {
    onSelectTab(tab);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col w-[260px] bg-[#062314] text-slate-200 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#0f3d23]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#10b981]/20 border border-[#10b981]/40 flex items-center justify-center text-[#10b981]">
              <Sprout className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold tracking-wider text-white leading-tight">
                KISAN
              </h1>
              <p className="text-[11px] font-medium text-[#7fa38a]">
                Billing & Stock System
              </p>
            </div>
          </div>
          <button
            onClick={onCloseMobile}
            className="p-1 rounded-md text-slate-400 hover:text-white lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation */}
        <div className="flex-1 px-3 py-4 overflow-y-auto space-y-6 text-[13px] font-medium">
          {/* Main Top Shortcut */}
          <div>
            <button
              onClick={() => handleNavClick('dashboard')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-all duration-150 text-left font-semibold ${
                currentTab === 'dashboard'
                  ? 'bg-[#10b981] text-white shadow-sm'
                  : 'text-slate-300 hover:bg-[#0c3820] hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              <span>Dashboard</span>
            </button>
          </div>

          {/* MAIN Section */}
          <div>
            <div className="px-3.5 mb-2 text-[10px] font-bold tracking-wider text-[#638b72] uppercase">
              MAIN
            </div>
            <div className="space-y-1">
              {mainNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-lg transition-colors text-left ${
                      isActive
                        ? 'bg-[#10b981] text-white font-semibold'
                        : 'text-slate-300 hover:bg-[#0c3820] hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0 opacity-80" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* REPORTS Section */}
          <div>
            <div className="px-3.5 mb-2 text-[10px] font-bold tracking-wider text-[#638b72] uppercase">
              REPORTS
            </div>
            <div className="space-y-1">
              {reportsNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-lg transition-colors text-left ${
                      isActive
                        ? 'bg-[#10b981] text-white font-semibold'
                        : 'text-slate-300 hover:bg-[#0c3820] hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0 opacity-80" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SETTINGS Section */}
          <div>
            <div className="px-3.5 mb-2 text-[10px] font-bold tracking-wider text-[#638b72] uppercase">
              SETTINGS
            </div>
            <div className="space-y-1">
              {settingsNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-lg transition-colors text-left ${
                      isActive
                        ? 'bg-[#10b981] text-white font-semibold'
                        : 'text-slate-300 hover:bg-[#0c3820] hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0 opacity-80" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Banner Card */}
        <div className="p-3 m-3 rounded-xl bg-[#0c351f] border border-[#164a2d] flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <Wheat className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Good Day!</h4>
            <p className="text-[11px] text-[#86ab93]">Have a productive day</p>
          </div>
        </div>
      </aside>
    </>
  );
};
