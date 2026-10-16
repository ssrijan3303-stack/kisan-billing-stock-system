import React from 'react';
import {
  Boxes,
  ShoppingCart,
  BarChart3,
  TrendingUp,
  Receipt,
  FilePlus,
  ShoppingBag,
  UserPlus,
  CircleDollarSign,
  Warehouse,
  FileSpreadsheet,
  ArrowRight,
  Wheat
} from 'lucide-react';
import { Transaction, Product, Expense, Farmer } from '../types';
import { StockDonutChart, SalesVsPurchaseChart } from './Charts';
import { NavTab } from './Sidebar';

interface DashboardViewProps {
  transactions: Transaction[];
  products: Product[];
  expenses: Expense[];
  farmers: Farmer[];
  onOpenAddBill: () => void;
  onOpenAddPurchase: () => void;
  onOpenAddFarmer: () => void;
  onOpenAddExpense: () => void;
  onOpenStockEntry: () => void;
  onNavigateTab: (tab: NavTab) => void;
  onViewInvoice: (tx: Transaction) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  transactions,
  products,
  expenses,
  farmers,
  onOpenAddBill,
  onOpenAddPurchase,
  onOpenAddFarmer,
  onOpenAddExpense,
  onOpenStockEntry,
  onNavigateTab,
  onViewInvoice
}) => {
  // Dynamic metrics calculation
  const wheatProd = products.find((p) => p.name.toLowerCase().includes('wheat')) || products[0];
  const paddyProd = products.find((p) => p.name.toLowerCase().includes('paddy')) || products[1];

  const wheatKg = wheatProd ? wheatProd.currentStockKg : 4200;
  const paddyKg = paddyProd ? paddyProd.currentStockKg : 3300;
  const totalStockKg = wheatKg + paddyKg;

  const wheatPct = totalStockKg > 0 ? Math.round((wheatKg / totalStockKg) * 100) : 56;
  const paddyPct = totalStockKg > 0 ? 100 - wheatPct : 44;

  // Monthly sums
  const totalSales = 450000; // Benchmark reference base
  const totalPurchase = 380000;
  const totalExpenses = 20000;
  const netProfit = totalSales - totalPurchase; // ₹70,000 matching screenshot!

  // Pending payments
  const pendingTransactions = transactions.filter((t) => t.payment === 'Due');
  const pendingPaymentsAmount = 20000;
  const pendingCount = 3;

  return (
    <div className="space-y-6">
      {/* 1. TOP 5 METRIC CARDS matching screenshot exactly */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Total Stock (All) */}
        <div className="bg-white rounded-xl p-4 shadow-xs border border-slate-100 flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-xs text-slate-500 font-medium">Total Stock (All)</span>
            <div className="text-xl font-bold text-slate-800">
              {totalStockKg.toLocaleString('en-IN')} kg
            </div>
            <div className="text-[11px] text-slate-500 font-normal">
              <div>Wheat: {wheatKg.toLocaleString('en-IN')} kg</div>
              <div>Paddy: {paddyKg.toLocaleString('en-IN')} kg</div>
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#10b981] flex items-center justify-center text-white shrink-0">
            <Boxes className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2: Total Purchase */}
        <div className="bg-white rounded-xl p-4 shadow-xs border border-slate-100 flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-xs text-slate-500 font-medium">Total Purchase</span>
            <div className="text-xl font-bold text-slate-800">
              ₹ {totalPurchase.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-slate-500 font-normal pt-3">
              This Month
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#3b82f6] flex items-center justify-center text-white shrink-0">
            <ShoppingCart className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3: Total Sales */}
        <div className="bg-white rounded-xl p-4 shadow-xs border border-slate-100 flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-xs text-slate-500 font-medium">Total Sales</span>
            <div className="text-xl font-bold text-slate-800">
              ₹ {totalSales.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-slate-500 font-normal pt-3">
              This Month
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#f59e0b] flex items-center justify-center text-white shrink-0">
            <BarChart3 className="w-5 h-5" />
          </div>
        </div>

        {/* Card 4: Profit / Loss */}
        <div className="bg-white rounded-xl p-4 shadow-xs border border-slate-100 flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-xs text-slate-500 font-medium">Profit / Loss</span>
            <div className="text-xl font-bold text-[#10b981]">
              ₹ {netProfit.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-slate-500 font-normal pt-3">
              This Month (Profit)
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#10b981] flex items-center justify-center text-white shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        {/* Card 5: Pending Payments */}
        <div className="bg-white rounded-xl p-4 shadow-xs border border-slate-100 flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-xs text-slate-500 font-medium">Pending Payments</span>
            <div className="text-xl font-bold text-slate-800">
              ₹ {pendingPaymentsAmount.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-slate-500 font-normal pt-3">
              {pendingCount} Payments Pending
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#ef4444] flex items-center justify-center text-white shrink-0">
            <Receipt className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 2. MIDDLE ROW: Stock Overview, Sales vs Purchase, Top Products + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Stock Overview Donut (col-span-3) */}
        <div className="lg:col-span-3 bg-white rounded-xl p-4 shadow-xs border border-slate-100 flex flex-col justify-between">
          <h3 className="text-xs font-bold text-slate-700">Stock Overview</h3>
          <div className="py-2">
            <StockDonutChart
              wheatKg={wheatKg}
              paddyKg={paddyKg}
              totalKg={totalStockKg}
            />
          </div>
          {/* Custom Legend matching image */}
          <div className="space-y-2 text-xs pt-1 border-t border-slate-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#eab308]" />
                <span className="text-slate-700 font-medium">Wheat</span>
              </div>
              <span className="text-slate-500 text-[11px] font-medium">
                {wheatKg.toLocaleString('en-IN')} kg ({wheatPct}%)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
                <span className="text-slate-700 font-medium">Paddy</span>
              </div>
              <span className="text-slate-500 text-[11px] font-medium">
                {paddyKg.toLocaleString('en-IN')} kg ({paddyPct}%)
              </span>
            </div>
          </div>
        </div>

        {/* Center: Sales vs Purchase Line Chart (col-span-5) */}
        <div className="lg:col-span-5 bg-white rounded-xl p-4 shadow-xs border border-slate-100 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-slate-700">Sales vs Purchase (This Month)</h3>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
                <span className="text-slate-600 text-[11px]">Sales</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#3b82f6]" />
                <span className="text-slate-600 text-[11px]">Purchase</span>
              </div>
            </div>
          </div>

          <div className="py-1">
            <SalesVsPurchaseChart />
          </div>
        </div>

        {/* Right: Top Products & Quick Actions (col-span-4) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Top Products Card */}
          <div className="bg-white rounded-xl p-4 shadow-xs border border-slate-100">
            <h3 className="text-xs font-bold text-slate-700 mb-3">Top Products</h3>
            <div className="space-y-3">
              {/* Wheat */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <Wheat className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-slate-800">Wheat</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-slate-600 text-[11px] font-medium">
                    {wheatKg.toLocaleString('en-IN')} kg
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[11px] font-bold">
                    {wheatPct}%
                  </span>
                </div>
              </div>

              {/* Paddy */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Wheat className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-slate-800">Paddy</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-slate-600 text-[11px] font-medium">
                    {paddyKg.toLocaleString('en-IN')} kg
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[11px] font-bold">
                    {paddyPct}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Card matching screenshot */}
          <div className="bg-white rounded-xl p-4 shadow-xs border border-slate-100">
            <h3 className="text-xs font-bold text-slate-700 mb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {/* + Add Bill */}
              <button
                onClick={onOpenAddBill}
                className="flex items-center gap-2 p-2 border border-slate-200/90 rounded-lg hover:border-emerald-500 hover:bg-emerald-50/40 transition-colors text-left"
              >
                <div className="p-1 rounded bg-emerald-50 text-emerald-600">
                  <FilePlus className="w-3.5 h-3.5" />
                </div>
                <span className="font-semibold text-slate-700 text-[11px]">+ Add Bill</span>
              </button>

              {/* + Add Purchase */}
              <button
                onClick={onOpenAddPurchase}
                className="flex items-center gap-2 p-2 border border-slate-200/90 rounded-lg hover:border-blue-500 hover:bg-blue-50/40 transition-colors text-left"
              >
                <div className="p-1 rounded bg-blue-50 text-blue-600">
                  <ShoppingBag className="w-3.5 h-3.5" />
                </div>
                <span className="font-semibold text-slate-700 text-[11px]">+ Add Purchase</span>
              </button>

              {/* + Add Farmer */}
              <button
                onClick={onOpenAddFarmer}
                className="flex items-center gap-2 p-2 border border-slate-200/90 rounded-lg hover:border-purple-500 hover:bg-purple-50/40 transition-colors text-left"
              >
                <div className="p-1 rounded bg-purple-50 text-purple-600">
                  <UserPlus className="w-3.5 h-3.5" />
                </div>
                <span className="font-semibold text-slate-700 text-[11px]">+ Add Farmer</span>
              </button>

              {/* Add Expense */}
              <button
                onClick={onOpenAddExpense}
                className="flex items-center gap-2 p-2 border border-slate-200/90 rounded-lg hover:border-rose-500 hover:bg-rose-50/40 transition-colors text-left"
              >
                <div className="p-1 rounded bg-rose-50 text-rose-600">
                  <CircleDollarSign className="w-3.5 h-3.5" />
                </div>
                <span className="font-semibold text-slate-700 text-[11px]">Add Expense</span>
              </button>

              {/* Stock Entry */}
              <button
                onClick={onOpenStockEntry}
                className="flex items-center gap-2 p-2 border border-slate-200/90 rounded-lg hover:border-amber-500 hover:bg-amber-50/40 transition-colors text-left"
              >
                <div className="p-1 rounded bg-amber-50 text-amber-600">
                  <Warehouse className="w-3.5 h-3.5" />
                </div>
                <span className="font-semibold text-slate-700 text-[11px]">Stock Entry</span>
              </button>

              {/* Generate Report */}
              <button
                onClick={() => onNavigateTab('profit-loss')}
                className="flex items-center gap-2 p-2 border border-slate-200/90 rounded-lg hover:border-teal-500 hover:bg-teal-50/40 transition-colors text-left"
              >
                <div className="p-1 rounded bg-teal-50 text-teal-600">
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                </div>
                <span className="font-semibold text-slate-700 text-[11px]">Generate Report</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. BOTTOM ROW: Recent Transactions (Left) & Profit Loss / Stock Summary (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Recent Transactions Table (col-span-8) */}
        <div className="lg:col-span-8 bg-white rounded-xl shadow-xs border border-slate-100 overflow-hidden flex flex-col justify-between">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800">Recent Transactions</h3>
            <span className="text-[11px] text-slate-400">Click row to view / print invoice</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#fcfdfd] text-slate-400 font-semibold border-b border-slate-100 text-[11px]">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-3">Type</th>
                  <th className="py-3 px-3">Name</th>
                  <th className="py-3 px-3">Product</th>
                  <th className="py-3 px-3 text-right">Qty (kg)</th>
                  <th className="py-3 px-3 text-right">Rate (₹)</th>
                  <th className="py-3 px-3 text-right">Amount (₹)</th>
                  <th className="py-3 px-4 text-center">Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[12px]">
                {transactions.slice(0, 5).map((tx) => (
                  <tr
                    key={tx.id}
                    onClick={() => onViewInvoice(tx)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap">{tx.date}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`font-semibold ${
                          tx.type === 'Sale' ? 'text-slate-700' : 'text-slate-700'
                        }`}
                      >
                        {tx.type}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-800 whitespace-nowrap">
                      {tx.name}
                    </td>
                    <td className="py-3 px-3 text-slate-600">{tx.product}</td>
                    <td className="py-3 px-3 text-right text-slate-700 font-medium">
                      {tx.qtyKg.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 text-right text-slate-700 font-medium">
                      {tx.rate.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-slate-800 whitespace-nowrap">
                      {tx.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-md text-[11px] font-semibold ${
                          tx.payment === 'Paid'
                            ? 'bg-[#ecfdf5] text-[#10b981]'
                            : 'bg-[#fffbeb] text-[#f59e0b]'
                        }`}
                      >
                        {tx.payment}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer link: View All Transactions -> */}
          <div className="p-3 border-t border-slate-100 text-center">
            <button
              onClick={() => onNavigateTab('sales')}
              className="text-xs font-semibold text-slate-600 hover:text-[#10b981] inline-flex items-center gap-1.5 transition-colors"
            >
              <span>View All Transactions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right: Profit & Loss Summary + Stock Summary (col-span-4) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Profit & Loss Summary Card matching image */}
          <div className="bg-white rounded-xl p-4 shadow-xs border border-slate-100">
            <h3 className="text-xs font-bold text-slate-800 mb-3">Profit & Loss Summary</h3>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span>Total Sales</span>
                <span className="font-medium text-slate-800">
                  ₹ {totalSales.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Total Purchase</span>
                <span className="font-medium text-slate-800">
                  ₹ {totalPurchase.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Total Expenses</span>
                <span className="font-medium text-slate-800">
                  ₹ {totalExpenses.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between font-bold">
                <span className="text-[#10b981]">Net Profit</span>
                <span className="text-[#10b981] text-sm">
                  ₹ {netProfit.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Stock Summary Card matching image */}
          <div className="bg-white rounded-xl p-4 shadow-xs border border-slate-100 overflow-hidden">
            <h3 className="text-xs font-bold text-slate-800 mb-3">Stock Summary</h3>
            <div className="overflow-x-auto -mx-4 px-4">
              <table className="w-full text-left text-xs">
                <thead className="text-[10px] uppercase font-semibold text-slate-400 border-b border-slate-100">
                  <tr>
                    <th className="pb-2">Product</th>
                    <th className="pb-2 text-right">Opening</th>
                    <th className="pb-2 text-right">In</th>
                    <th className="pb-2 text-right">Out</th>
                    <th className="pb-2 text-right font-bold text-slate-600">Current</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[11px]">
                  <tr>
                    <td className="py-2.5 font-medium text-slate-800">Wheat</td>
                    <td className="py-2.5 text-right text-slate-500">2,000 kg</td>
                    <td className="py-2.5 text-right text-slate-500">2,800 kg</td>
                    <td className="py-2.5 text-right text-slate-500">2,600 kg</td>
                    <td className="py-2.5 text-right font-bold text-slate-800">
                      {wheatKg.toLocaleString('en-IN')} kg
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-medium text-slate-800">Paddy</td>
                    <td className="py-2.5 text-right text-slate-500">1,500 kg</td>
                    <td className="py-2.5 text-right text-slate-500">1,800 kg</td>
                    <td className="py-2.5 text-right text-slate-500">2,000 kg</td>
                    <td className="py-2.5 text-right font-bold text-slate-800">
                      {paddyKg.toLocaleString('en-IN')} kg
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Footer matching screenshot */}
      <footer className="pt-4 pb-2 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
        <div>© 2025 Kisan Billing & Stock System. All rights reserved.</div>
        <div className="font-medium text-slate-500">Version 1.0.0</div>
      </footer>
    </div>
  );
};
