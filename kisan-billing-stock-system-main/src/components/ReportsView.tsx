import React, { useState } from 'react';
import {
  TrendingUp,
  PieChart,
  CalendarCheck,
  CalendarDays,
  UserCheck,
  Printer,
  Download,
  FileSpreadsheet,
  CheckCircle2
} from 'lucide-react';
import { Transaction, Product, Expense, Farmer, BusinessProfile } from '../types';

export type ReportSubTab = 'profit-loss' | 'stock-report' | 'daily-report' | 'monthly-report' | 'farmer-report';

interface ReportsViewProps {
  initialSubTab?: ReportSubTab;
  transactions: Transaction[];
  products: Product[];
  expenses: Expense[];
  farmers: Farmer[];
  businessProfile: BusinessProfile;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  initialSubTab = 'profit-loss',
  transactions,
  products,
  expenses,
  farmers,
  businessProfile
}) => {
  const [activeReport, setActiveReport] = useState<ReportSubTab>(initialSubTab);

  const totalSales = 450000;
  const totalPurchase = 380000;
  const totalExpenses = 20000;
  const netProfit = 70000;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-teal-600" />
            Mandi Financial & Audit Reports
          </h2>
          <p className="text-xs text-slate-500">
            Exportable trading statements, tax breakdowns, daily dharamkanta logs, and farmer khatas
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center gap-2 shadow-sm transition-colors"
          >
            <Printer className="w-4 h-4" />
            Print Report
          </button>
        </div>
      </div>

      {/* Report Navigation Tabs */}
      <div className="no-print flex bg-slate-100 p-1 rounded-xl text-xs font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveReport('profit-loss')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
            activeReport === 'profit-loss' ? 'bg-white text-emerald-700 shadow-2xs font-bold' : 'text-slate-600'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Profit & Loss Statement
        </button>
        <button
          onClick={() => setActiveReport('stock-report')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
            activeReport === 'stock-report' ? 'bg-white text-emerald-700 shadow-2xs font-bold' : 'text-slate-600'
          }`}
        >
          <PieChart className="w-4 h-4" />
          Stock Valuation Report
        </button>
        <button
          onClick={() => setActiveReport('daily-report')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
            activeReport === 'daily-report' ? 'bg-white text-emerald-700 shadow-2xs font-bold' : 'text-slate-600'
          }`}
        >
          <CalendarCheck className="w-4 h-4" />
          Daily Mandi Sheet
        </button>
        <button
          onClick={() => setActiveReport('monthly-report')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
            activeReport === 'monthly-report' ? 'bg-white text-emerald-700 shadow-2xs font-bold' : 'text-slate-600'
          }`}
        >
          <CalendarDays className="w-4 h-4" />
          Monthly Comparison
        </button>
        <button
          onClick={() => setActiveReport('farmer-report')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
            activeReport === 'farmer-report' ? 'bg-white text-emerald-700 shadow-2xs font-bold' : 'text-slate-600'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          Farmer Ledger Khata
        </button>
      </div>

      {/* REPORT CONTENT AREA */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 p-6">
        {/* Mandi Letterhead Header for Print */}
        <div className="border-b border-slate-200 pb-4 mb-6 flex justify-between items-start">
          <div>
            <h3 className="font-extrabold text-base text-slate-900">{businessProfile.businessName}</h3>
            <p className="text-xs text-slate-500">{businessProfile.address}</p>
            <p className="text-[11px] text-slate-400">APMC Lic: {businessProfile.licenseNo} • GSTIN: {businessProfile.gstin}</p>
          </div>
          <div className="text-right text-xs">
            <span className="font-bold text-slate-700 uppercase tracking-wider block">
              {activeReport.replace('-', ' ')}
            </span>
            <span className="text-slate-400">Date: 20 May 2025 (Period: May 2025)</span>
          </div>
        </div>

        {/* 1. Profit & Loss Statement */}
        {activeReport === 'profit-loss' && (
          <div className="space-y-6 text-xs sm:text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                <span className="text-xs text-emerald-700 font-semibold">Total Revenue (Sales)</span>
                <p className="text-xl font-bold text-emerald-950 mt-1">₹ {totalSales.toLocaleString('en-IN')}</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                <span className="text-xs text-blue-700 font-semibold">Cost of Goods (Procurement)</span>
                <p className="text-xl font-bold text-blue-950 mt-1">₹ {totalPurchase.toLocaleString('en-IN')}</p>
              </div>
              <div className="p-4 bg-rose-50 rounded-xl border border-rose-100">
                <span className="text-xs text-rose-700 font-semibold">Operational Expenses</span>
                <p className="text-xl font-bold text-rose-950 mt-1">₹ {totalExpenses.toLocaleString('en-IN')}</p>
              </div>
              <div className="p-4 bg-emerald-600 text-white rounded-xl shadow-xs">
                <span className="text-xs text-emerald-100 font-semibold">Net Mandi Profit</span>
                <p className="text-2xl font-black mt-1">₹ {netProfit.toLocaleString('en-IN')}</p>
              </div>
            </div>

            <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
              <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-[11px]">
                <tr>
                  <th className="p-3">Accounting Head</th>
                  <th className="p-3 text-right">Debit (₹)</th>
                  <th className="p-3 text-right">Credit (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                <tr>
                  <td className="p-3 font-semibold text-slate-800">Gross Grain Sales (Wheat & Paddy)</td>
                  <td className="p-3 text-right text-slate-400">—</td>
                  <td className="p-3 text-right font-bold text-emerald-700">₹ 4,50,000</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-slate-700">Less: Grain Purchase Cost from Farmers</td>
                  <td className="p-3 text-right font-medium text-slate-800">₹ 3,80,000</td>
                  <td className="p-3 text-right text-slate-400">—</td>
                </tr>
                <tr className="bg-slate-50 font-bold">
                  <td className="p-3 text-slate-800">Gross Trading Margin</td>
                  <td className="p-3 text-right text-slate-400">—</td>
                  <td className="p-3 text-right text-slate-900">₹ 70,000</td>
                </tr>
                <tr>
                  <td className="p-3 text-slate-600">Less: Mandi Expenses (Labour, Transport, Gunny Bags)</td>
                  <td className="p-3 text-right text-slate-800">₹ 20,000</td>
                  <td className="p-3 text-right text-slate-400">—</td>
                </tr>
                <tr className="bg-emerald-50 text-emerald-900 font-black text-sm">
                  <td className="p-3">Net Profit for the Month (May 2025)</td>
                  <td className="p-3 text-right text-slate-400">—</td>
                  <td className="p-3 text-right text-emerald-700">₹ 70,000</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* 2. Stock Report */}
        {activeReport === 'stock-report' && (
          <div className="space-y-4 text-xs">
            <h4 className="font-bold text-slate-800 text-sm">Warehouse Stock Valuation Statement</h4>
            <table className="w-full text-left border border-slate-200 rounded-lg overflow-hidden">
              <thead className="bg-slate-50 text-slate-600 font-semibold text-[11px] uppercase">
                <tr>
                  <th className="p-3">Item Name</th>
                  <th className="p-3 text-right">Current Stock (kg)</th>
                  <th className="p-3 text-right">Standard Rate (₹/kg)</th>
                  <th className="p-3 text-right font-bold">Total Asset Value (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((p) => (
                  <tr key={p.id}>
                    <td className="p-3 font-bold text-slate-800">{p.name} ({p.variety})</td>
                    <td className="p-3 text-right">{p.currentStockKg.toLocaleString('en-IN')} kg</td>
                    <td className="p-3 text-right">₹ {p.standardRate.toFixed(2)}</td>
                    <td className="p-3 text-right font-bold text-slate-900">
                      ₹ {(p.currentStockKg * p.standardRate).toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 3. Daily Report */}
        {activeReport === 'daily-report' && (
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg flex justify-between items-center">
              <span className="font-bold text-slate-800">Daily Mandi Log for 20 May 2025 (Tuesday)</span>
              <span className="text-emerald-700 font-bold">2 Transactions Closed Today</span>
            </div>
            <table className="w-full text-left border border-slate-200 rounded-lg overflow-hidden">
              <thead className="bg-slate-50 text-slate-600 font-semibold text-[11px] uppercase">
                <tr>
                  <th className="p-3">Bill #</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Party Name</th>
                  <th className="p-3">Product</th>
                  <th className="p-3 text-right">Qty (kg)</th>
                  <th className="p-3 text-right">Amount (₹)</th>
                  <th className="p-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.slice(0, 2).map((t) => (
                  <tr key={t.id}>
                    <td className="p-3 font-mono">{t.invoiceNo}</td>
                    <td className="p-3 font-semibold">{t.type}</td>
                    <td className="p-3 font-bold">{t.name}</td>
                    <td className="p-3">{t.product}</td>
                    <td className="p-3 text-right">{t.qtyKg.toLocaleString('en-IN')} kg</td>
                    <td className="p-3 text-right font-bold">₹ {t.amount.toLocaleString('en-IN')}</td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-[10px]">
                        {t.payment}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 4. Monthly Report */}
        {activeReport === 'monthly-report' && (
          <div className="space-y-4 text-xs">
            <h4 className="font-bold text-slate-800 text-sm">Monthly Historical Comparison (2025)</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 border border-slate-200 rounded-xl">
                <span className="text-slate-400 font-medium">March 2025</span>
                <p className="text-lg font-bold text-slate-800 mt-1">₹ 3,90,000 Sales</p>
                <span className="text-emerald-600 font-semibold">Net Profit: ₹ 54,000</span>
              </div>
              <div className="p-4 border border-slate-200 rounded-xl">
                <span className="text-slate-400 font-medium">April 2025</span>
                <p className="text-lg font-bold text-slate-800 mt-1">₹ 4,15,000 Sales</p>
                <span className="text-emerald-600 font-semibold">Net Profit: ₹ 61,000</span>
              </div>
              <div className="p-4 border-2 border-emerald-500 bg-emerald-50/40 rounded-xl">
                <span className="text-emerald-700 font-bold">May 2025 (Current)</span>
                <p className="text-lg font-bold text-slate-900 mt-1">₹ 4,50,000 Sales</p>
                <span className="text-emerald-700 font-black">Net Profit: ₹ 70,000</span>
              </div>
            </div>
          </div>
        )}

        {/* 5. Farmer Report */}
        {activeReport === 'farmer-report' && (
          <div className="space-y-4 text-xs">
            <h4 className="font-bold text-slate-800 text-sm">Farmer Balances & Pending Dues Summary</h4>
            <table className="w-full text-left border border-slate-200 rounded-lg overflow-hidden">
              <thead className="bg-slate-50 text-slate-600 font-semibold text-[11px] uppercase">
                <tr>
                  <th className="p-3">Farmer Name</th>
                  <th className="p-3">Village / District</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3 text-right">Lifetime Volume</th>
                  <th className="p-3 text-right font-bold">Outstanding Balance (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {farmers.map((f) => (
                  <tr key={f.id}>
                    <td className="p-3 font-bold text-slate-800">{f.name}</td>
                    <td className="p-3 text-slate-600">{f.village}, {f.district}</td>
                    <td className="p-3 text-slate-500 font-mono">{f.phone}</td>
                    <td className="p-3 text-right">{f.totalVolumeKg.toLocaleString('en-IN')} kg</td>
                    <td className="p-3 text-right font-bold">
                      {f.balanceDue > 0 ? (
                        <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-bold">
                          Due ₹ {f.balanceDue.toLocaleString('en-IN')}
                        </span>
                      ) : (
                        <span className="text-emerald-600 font-medium">₹ 0 (Clear)</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
