import React, { useState } from 'react';
import {
  ShoppingBag,
  Plus,
  Download,
  Search,
  Filter,
  Eye,
  TrendingDown,
  Warehouse,
  CheckCircle2
} from 'lucide-react';
import { Transaction } from '../types';

interface PurchaseViewProps {
  transactions: Transaction[];
  onOpenAddPurchase: () => void;
  onViewInvoice: (tx: Transaction) => void;
  onUpdatePaymentStatus: (txId: string, newStatus: 'Paid' | 'Due') => void;
}

export const PurchaseView: React.FC<PurchaseViewProps> = ({
  transactions,
  onOpenAddPurchase,
  onViewInvoice,
  onUpdatePaymentStatus
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Paid' | 'Due'>('All');
  const [productFilter, setProductFilter] = useState<string>('All');

  // Filter purchases
  const purchases = transactions.filter((t) => t.type === 'Purchase');

  const filteredPurchases = purchases.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.product.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || item.payment === statusFilter;
    const matchesProduct = productFilter === 'All' || item.product === productFilter;

    return matchesSearch && matchesStatus && matchesProduct;
  });

  const totalPurchaseAmount = 380000;
  const totalVolumeKg = purchases.reduce((sum, p) => sum + p.qtyKg, 0);

  const handleExportCSV = () => {
    const headers = ['Purchase Slip #', 'Date', 'Farmer Name', 'Product', 'Quantity (kg)', 'Rate (INR)', 'Amount (INR)', 'Disbursement Status', 'Mode'];
    const rows = filteredPurchases.map((p) => [
      p.invoiceNo,
      p.date,
      `"${p.name}"`,
      p.product,
      p.qtyKg,
      p.rate,
      p.amount,
      p.payment,
      p.paymentMode || 'UPI'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `kisan_purchase_register_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Title & Top Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-blue-600" />
            Crop Purchase & Farmer Inward Register
          </h2>
          <p className="text-xs text-slate-500">
            Direct harvest procurement from farmers at mandi yard and farm gates
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
            onClick={onOpenAddPurchase}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg flex items-center gap-2 shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            + New Purchase Entry
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs">
          <span className="text-xs text-slate-400 font-medium">Total Purchase (This Month)</span>
          <div className="text-xl font-bold text-slate-800 mt-1">
            ₹ {totalPurchaseAmount.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-blue-600 font-medium mt-1 block">
            Procured across 18 farmers
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs">
          <span className="text-xs text-slate-400 font-medium">Procured Volume Inward</span>
          <div className="text-xl font-bold text-slate-800 mt-1">
            {totalVolumeKg.toLocaleString('en-IN')} kg
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Direct warehouse stock additions
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs">
          <span className="text-xs text-slate-400 font-medium">Avg Purchase Rate</span>
          <div className="text-xl font-bold text-slate-800 mt-1">₹ 22.80 / kg</div>
          <span className="text-[11px] text-emerald-600 font-medium mt-1 block">
            ₹ 2.00 / kg gross gross trading margin
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs">
          <span className="text-xs text-slate-400 font-medium">Direct Farmer Settlements</span>
          <div className="text-xl font-bold text-emerald-600 mt-1">100% On-Time</div>
          <span className="text-[11px] text-slate-400 mt-1 block">Instant UPI & NEFT payment</span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by farmer name, slip #, product..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 text-slate-800"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2 flex-wrap text-xs">
          <div className="flex bg-slate-100 p-1 rounded-lg">
            {(['All', 'Paid', 'Due'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-md font-semibold transition-all ${
                  statusFilter === st
                    ? 'bg-white text-slate-800 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <select
            value={productFilter}
            onChange={(e) => setProductFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-700"
          >
            <option value="All">All Commodities</option>
            <option value="Wheat">Wheat Only</option>
            <option value="Paddy">Paddy Only</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#fcfdfd] text-slate-400 font-semibold border-b border-slate-100 text-[11px]">
              <tr>
                <th className="py-3 px-4">Purchase Slip #</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Farmer (Seller)</th>
                <th className="py-3 px-4">Commodity</th>
                <th className="py-3 px-4 text-right">Net Wt (kg)</th>
                <th className="py-3 px-4 text-right">Rate (₹/kg)</th>
                <th className="py-3 px-4 text-right">Total (₹)</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[12px]">
              {filteredPurchases.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    No purchase records found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredPurchases.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-slate-600">
                      {tx.invoiceNo}
                    </td>
                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap">{tx.date}</td>
                    <td className="py-3 px-4 font-bold text-slate-800">{tx.name}</td>
                    <td className="py-3 px-4 text-slate-700">{tx.product}</td>
                    <td className="py-3 px-4 text-right font-medium text-slate-700">
                      {tx.qtyKg.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-slate-700">
                      ₹ {tx.rate.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900">
                      ₹ {tx.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() =>
                          onUpdatePaymentStatus(
                            tx.id,
                            tx.payment === 'Paid' ? 'Due' : 'Paid'
                          )
                        }
                        title="Click to toggle status"
                        className={`inline-block px-2.5 py-0.5 rounded-md text-[11px] font-semibold transition-all hover:ring-2 hover:ring-offset-1 ${
                          tx.payment === 'Paid'
                            ? 'bg-[#ecfdf5] text-[#10b981] hover:ring-emerald-400'
                            : 'bg-[#fffbeb] text-[#f59e0b] hover:ring-amber-400'
                        }`}
                      >
                        {tx.payment} ⇄
                      </button>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => onViewInvoice(tx)}
                        className="px-2.5 py-1 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg text-xs font-semibold inline-flex items-center gap-1 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Voucher
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
