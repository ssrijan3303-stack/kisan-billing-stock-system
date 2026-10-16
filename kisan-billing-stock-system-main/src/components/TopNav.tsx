import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Search,
  Bell,
  Calendar,
  ChevronDown,
  User,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  X
} from 'lucide-react';
import { Transaction, Farmer } from '../types';
import { NavTab } from './Sidebar';

interface TopNavProps {
  onToggleSidebar: () => void;
  onNavigate: (tab: NavTab) => void;
  transactions: Transaction[];
  farmers: Farmer[];
  onSelectTransaction?: (tx: Transaction) => void;
  onSelectFarmer?: (farmer: Farmer) => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  onToggleSidebar,
  onNavigate,
  transactions,
  farmers,
  onSelectTransaction,
  onSelectFarmer
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchDropdown(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter items based on query
  const trimmedQuery = searchQuery.trim().toLowerCase();
  const matchedTransactions = trimmedQuery
    ? transactions.filter(
        (t) =>
          t.name.toLowerCase().includes(trimmedQuery) ||
          t.invoiceNo.toLowerCase().includes(trimmedQuery) ||
          t.product.toLowerCase().includes(trimmedQuery) ||
          t.amount.toString().includes(trimmedQuery)
      )
    : [];

  const matchedFarmers = trimmedQuery
    ? farmers.filter(
        (f) =>
          f.name.toLowerCase().includes(trimmedQuery) ||
          f.village.toLowerCase().includes(trimmedQuery) ||
          f.phone.includes(trimmedQuery)
      )
    : [];

  const totalResults = matchedTransactions.length + matchedFarmers.length;

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200/80 px-4 sm:px-6 py-2.5">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger & Search bar */}
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          <button
            onClick={onToggleSidebar}
            className="p-1.5 -ml-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg lg:hidden"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search Bar matching screenshot */}
          <div ref={searchRef} className="relative w-full max-w-md">
            <div className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchDropdown(true);
                }}
                onFocus={() => setShowSearchDropdown(true)}
                placeholder="Search farmers, bills, invoices..."
                className="w-full pl-4 pr-10 py-1.5 text-xs sm:text-sm bg-[#f8f9fa] border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#10b981] focus:ring-2 focus:ring-[#10b981]/15 transition-all placeholder:text-slate-400 font-normal"
              />
              <div className="absolute right-3 text-slate-400">
                {searchQuery ? (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setShowSearchDropdown(false);
                    }}
                    className="hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                ) : (
                  <Search className="w-4 h-4" />
                )}
              </div>
            </div>

            {/* Live Search Dropdown */}
            {showSearchDropdown && trimmedQuery && (
              <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden divide-y divide-slate-100">
                <div className="p-2.5 bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex justify-between">
                  <span>Search Results ({totalResults})</span>
                  <span>Press Esc to close</span>
                </div>

                {totalResults === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-500">
                    No farmers or transactions found for "{searchQuery}"
                  </div>
                ) : (
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {/* Farmers Matches */}
                    {matchedFarmers.length > 0 && (
                      <div className="p-2">
                        <div className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1">
                          Farmers & Traders
                        </div>
                        {matchedFarmers.slice(0, 3).map((f) => (
                          <div
                            key={f.id}
                            onClick={() => {
                              onNavigate('farmers');
                              if (onSelectFarmer) onSelectFarmer(f);
                              setShowSearchDropdown(false);
                              setSearchQuery('');
                            }}
                            className="flex items-center justify-between p-2 hover:bg-emerald-50 rounded-lg cursor-pointer text-xs"
                          >
                            <div>
                              <p className="font-semibold text-slate-800">{f.name}</p>
                              <p className="text-[11px] text-slate-500">
                                {f.village}, {f.district} • {f.phone}
                              </p>
                            </div>
                            {f.balanceDue > 0 ? (
                              <span className="text-[11px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                                Due ₹{f.balanceDue.toLocaleString('en-IN')}
                              </span>
                            ) : (
                              <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                                Clear
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Transaction Matches */}
                    {matchedTransactions.length > 0 && (
                      <div className="p-2">
                        <div className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1">
                          Bills & Transactions
                        </div>
                        {matchedTransactions.slice(0, 4).map((tx) => (
                          <div
                            key={tx.id}
                            onClick={() => {
                              onNavigate(tx.type === 'Sale' ? 'sales' : 'purchase');
                              if (onSelectTransaction) onSelectTransaction(tx);
                              setShowSearchDropdown(false);
                              setSearchQuery('');
                            }}
                            className="flex items-center justify-between p-2 hover:bg-emerald-50 rounded-lg cursor-pointer text-xs"
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                  tx.type === 'Sale'
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-emerald-100 text-emerald-700'
                                }`}
                              >
                                {tx.type}
                              </span>
                              <div>
                                <p className="font-medium text-slate-800">
                                  {tx.name} — {tx.product} ({tx.qtyKg} kg)
                                </p>
                                <p className="text-[11px] text-slate-400">
                                  {tx.invoiceNo} • {tx.date}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-slate-800">
                                ₹ {tx.amount.toLocaleString('en-IN')}
                              </p>
                              <span
                                className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                                  tx.payment === 'Paid'
                                    ? 'bg-emerald-50 text-emerald-700'
                                    : 'bg-amber-50 text-amber-700'
                                }`}
                              >
                                {tx.payment}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Section: Notification, Date, Admin Profile */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          {/* Notification Bell with Badge 5 */}
          <div ref={notifRef} className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                5
              </span>
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden">
                <div className="p-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-800">Notifications</span>
                    <span className="text-[10px] bg-rose-100 text-rose-700 font-semibold px-1.5 py-0.5 rounded-full">
                      5 new
                    </span>
                  </div>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-[11px] text-[#10b981] hover:underline font-medium"
                  >
                    Mark read
                  </button>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 text-xs">
                  <div
                    onClick={() => {
                      onNavigate('farmers');
                      setShowNotifications(false);
                    }}
                    className="p-3 hover:bg-slate-50 cursor-pointer flex gap-2.5 items-start"
                  >
                    <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-800">Payment Due: Mahesh Singh</p>
                      <p className="text-[11px] text-slate-500">
                        ₹ 9,200 pending for 400 kg Paddy. 7 days credit deadline.
                      </p>
                      <span className="text-[10px] text-slate-400">19 May 2025</span>
                    </div>
                  </div>

                  <div
                    onClick={() => {
                      onNavigate('farmers');
                      setShowNotifications(false);
                    }}
                    className="p-3 hover:bg-slate-50 cursor-pointer flex gap-2.5 items-start"
                  >
                    <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-800">Payment Due: Anita Devi</p>
                      <p className="text-[11px] text-slate-500">
                        ₹ 10,800 due for Wheat batch delivery #137.
                      </p>
                      <span className="text-[10px] text-slate-400">17 May 2025</span>
                    </div>
                  </div>

                  <div
                    onClick={() => {
                      onNavigate('stock');
                      setShowNotifications(false);
                    }}
                    className="p-3 hover:bg-slate-50 cursor-pointer flex gap-2.5 items-start"
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-800">Stock Reorder Alert</p>
                      <p className="text-[11px] text-slate-500">
                        Paddy stock at 3,300 kg. Approaching threshold.
                      </p>
                      <span className="text-[10px] text-slate-400">Today</span>
                    </div>
                  </div>

                  <div
                    onClick={() => {
                      onNavigate('purchase');
                      setShowNotifications(false);
                    }}
                    className="p-3 hover:bg-slate-50 cursor-pointer flex gap-2.5 items-start"
                  >
                    <CheckCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-800">Procurement Logged</p>
                      <p className="text-[11px] text-slate-500">
                        600 kg Wheat purchased from Om Prakash at ₹24/kg.
                      </p>
                      <span className="text-[10px] text-slate-400">19 May 2025</span>
                    </div>
                  </div>

                  <div
                    onClick={() => {
                      onNavigate('settings');
                      setShowNotifications(false);
                    }}
                    className="p-3 hover:bg-slate-50 cursor-pointer flex gap-2.5 items-start"
                  >
                    <CheckCircle className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-800">Dharamkanta Scale Calibrated</p>
                      <p className="text-[11px] text-slate-500">
                        Annual electronic test certificate renewed.
                      </p>
                      <span className="text-[10px] text-slate-400">14 May 2025</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Date Widget matching screenshot */}
          <div className="hidden sm:flex items-center gap-2.5 pl-2 pr-3 py-1 bg-slate-50 border border-slate-200/80 rounded-lg text-xs">
            <Calendar className="w-4 h-4 text-slate-600" />
            <div className="text-left leading-tight">
              <span className="font-semibold text-slate-800 text-[12px] block">
                20 May 2025
              </span>
              <span className="text-[11px] text-slate-500 block">Tuesday</span>
            </div>
          </div>

          {/* User Profile Pill matching screenshot */}
          <div ref={userRef} className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-slate-100 transition-colors text-left"
            >
              {/* Avatar circle with green online dot */}
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-600">
                  <User className="w-4 h-4" />
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
              </div>
              <div className="hidden md:block leading-tight">
                <span className="font-bold text-xs text-slate-800 block">Admin</span>
                <span className="text-[11px] text-slate-500 block">Owner</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* User Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-1.5 text-xs">
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="font-bold text-slate-800">Admin Owner</p>
                  <p className="text-[11px] text-slate-400">admin@kisanmandi.in</p>
                </div>
                <button
                  onClick={() => {
                    onNavigate('settings');
                    setShowUserMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-lg transition-colors flex items-center justify-between"
                >
                  <span>Mandi Settings</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
                <button
                  onClick={() => {
                    onNavigate('users');
                    setShowUserMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-lg transition-colors flex items-center justify-between"
                >
                  <span>Staff & Roles</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
                <div className="border-t border-slate-100 mt-1 pt-1">
                  <button
                    onClick={() => {
                      alert('Session is active as Primary Owner (Admin).');
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-rose-600 hover:bg-rose-50 rounded-lg font-medium"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
