import React, { useState } from 'react';
import {
  CircleDollarSign,
  Plus,
  Receipt,
  Download,
  Filter,
  Search,
  Truck,
  Users,
  Package,
  Zap,
  Scale
} from 'lucide-react';
import { Expense } from '../types';

interface ExpensesViewProps {
  expenses: Expense[];
  onOpenAddExpense: () => void;
}

export const ExpensesView: React.FC<ExpensesViewProps> = ({
  expenses,
  onOpenAddExpense
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  const filteredExpenses = expenses.filter((e) => {
    const matchesSearch =
      e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.paidTo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || e.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalExpenseAmount = 20000;

  const handleExportCSV = () => {
    const headers = ['Voucher Date', 'Expense Title', 'Category', 'Amount (INR)', 'Paid To', 'Payment Mode', 'Notes'];
    const rows = filteredExpenses.map((e) => [
      e.date,
      `"${e.title}"`,
      e.category,
      e.amount,
      `"${e.paidTo}"`,
      e.paymentMode,
      `"${e.notes || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `mandi_expenses_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <CircleDollarSign className="w-5 h-5 text-rose-600" />
            Mandi Operational Expenses & Palledar Vouchers
          </h2>
          <p className="text-xs text-slate-500">
            Track labour unloading charges, jute bags, transport haulage, and weighbridge maintenance
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-2 transition-colors shadow-2xs"
          >
            <Download className="w-4 h-4 text-slate-500" />
            Export CSV
          </button>
          <button
            onClick={onOpenAddExpense}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg flex items-center gap-2 shadow-sm transition-colors self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            📦 Add Expense Voucher
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs">
          <span className="text-xs text-slate-400 font-medium">Total Expenses (This Month)</span>
          <div className="text-xl font-bold text-rose-600 mt-1">
            ₹ {totalExpenseAmount.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Accounted in P&L Statement</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs">
          <span className="text-xs text-slate-400 font-medium">Labour & Palledari</span>
          <div className="text-xl font-bold text-slate-800 mt-1">₹ 6,500</div>
          <span className="text-[11px] text-slate-400 mt-1 block">Mukesh Palledar Union</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs">
          <span className="text-xs text-slate-400 font-medium">Gunny Bags (Bori)</span>
          <div className="text-xl font-bold text-slate-800 mt-1">₹ 7,200</div>
          <span className="text-[11px] text-slate-400 mt-1 block">200 certified A-grade bags</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs">
          <span className="text-xs text-slate-400 font-medium">Transport & Scales</span>
          <div className="text-xl font-bold text-slate-800 mt-1">₹ 6,300</div>
          <span className="text-[11px] text-slate-400 mt-1 block">Freight & annual scale checks</span>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by expense title or recipient name..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-rose-500 text-slate-800"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex bg-slate-100 p-1 rounded-lg text-xs overflow-x-auto">
          {['All', 'Labour', 'Gunny Bags', 'Transport', 'Weighbridge'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 rounded-md font-semibold whitespace-nowrap transition-all ${
                categoryFilter === cat
                  ? 'bg-white text-slate-800 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#fcfdfd] text-slate-400 font-semibold border-b border-slate-100 text-[11px]">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Expense Description</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Paid To</th>
                <th className="py-3 px-4">Mode</th>
                <th className="py-3 px-4 text-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[12px]">
              {filteredExpenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 text-slate-600 whitespace-nowrap">{exp.date}</td>
                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-800">{exp.title}</p>
                    {exp.notes && <p className="text-[11px] text-slate-400">{exp.notes}</p>}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold text-[10px]">
                      {exp.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-700 font-medium">{exp.paidTo}</td>
                  <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">{exp.paymentMode}</td>
                  <td className="py-3 px-4 text-right font-bold text-rose-600">
                    ₹ {exp.amount.toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
