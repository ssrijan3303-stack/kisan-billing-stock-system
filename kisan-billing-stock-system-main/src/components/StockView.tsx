import React from 'react';
import {
  Warehouse,
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  Boxes,
  Wheat,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { Product, Transaction } from '../types';

interface StockViewProps {
  products: Product[];
  transactions: Transaction[];
  onOpenStockEntry: () => void;
}

export const StockView: React.FC<StockViewProps> = ({
  products,
  transactions,
  onOpenStockEntry
}) => {
  const wheat = products.find((p) => p.name.toLowerCase().includes('wheat')) || products[0];
  const paddy = products.find((p) => p.name.toLowerCase().includes('paddy')) || products[1];

  const totalStockKg = (wheat ? wheat.currentStockKg : 4200) + (paddy ? paddy.currentStockKg : 3300);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Warehouse className="w-5 h-5 text-amber-600" />
            Stock & Mandi Warehouse Inventory (Godown Log)
          </h2>
          <p className="text-xs text-slate-500">
            Real-time silo capacities, godown stacking, inward/outward transfers, and bag counts
          </p>
        </div>
        <button
          onClick={onOpenStockEntry}
          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg flex items-center gap-2 shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          🌾 New Stock Movement / Transfer
        </button>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs">
          <span className="text-xs text-slate-400 font-medium">Total Current Stock (All)</span>
          <div className="text-xl font-bold text-slate-800 mt-1">
            {totalStockKg.toLocaleString('en-IN')} kg
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            ≈ {Math.round(totalStockKg / 50)} bags across all godowns
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs">
          <span className="text-xs text-slate-400 font-medium">Wheat Inventory</span>
          <div className="text-xl font-bold text-amber-600 mt-1">
            {(wheat?.currentStockKg || 4200).toLocaleString('en-IN')} kg
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Opening: 2,000 kg • In: 2,800 kg • Out: 2,600 kg
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs">
          <span className="text-xs text-slate-400 font-medium">Paddy Inventory</span>
          <div className="text-xl font-bold text-emerald-600 mt-1">
            {(paddy?.currentStockKg || 3300).toLocaleString('en-IN')} kg
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Opening: 1,500 kg • In: 1,800 kg • Out: 2,000 kg
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs">
          <span className="text-xs text-slate-400 font-medium">Storage Safety & Fumigation</span>
          <div className="text-xl font-bold text-emerald-600 mt-1 flex items-center gap-1.5">
            <ShieldCheck className="w-5 h-5" /> 100% Certified
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Zero pest infestation detected
          </span>
        </div>
      </div>

      {/* Stock Summary Detailed Table matching the screenshot structure */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-800">Mandi Stock Reconciliation Summary</h3>
          <span className="text-[11px] text-slate-400">Values in Kilograms (kg)</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#fcfdfd] text-slate-400 font-semibold border-b border-slate-100 text-[11px]">
              <tr>
                <th className="py-3 px-4">Product Commodity</th>
                <th className="py-3 px-4 text-right">Opening Stock</th>
                <th className="py-3 px-4 text-right text-blue-600">Inward (+)</th>
                <th className="py-3 px-4 text-right text-rose-600">Outward (-)</th>
                <th className="py-3 px-4 text-right font-bold text-slate-700">Current Stock</th>
                <th className="py-3 px-4 text-right">Bag Count (50kg)</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[12px]">
              <tr>
                <td className="py-3 px-4 font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  Wheat (Kanak)
                </td>
                <td className="py-3 px-4 text-right text-slate-600">2,000 kg</td>
                <td className="py-3 px-4 text-right font-medium text-blue-600">2,800 kg</td>
                <td className="py-3 px-4 text-right font-medium text-rose-600">2,600 kg</td>
                <td className="py-3 px-4 text-right font-black text-slate-900">
                  {(wheat?.currentStockKg || 4200).toLocaleString('en-IN')} kg
                </td>
                <td className="py-3 px-4 text-right text-slate-600">
                  {Math.round((wheat?.currentStockKg || 4200) / 50)} bags
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-[11px]">
                    Optimal
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  Paddy (Dhan)
                </td>
                <td className="py-3 px-4 text-right text-slate-600">1,500 kg</td>
                <td className="py-3 px-4 text-right font-medium text-blue-600">1,800 kg</td>
                <td className="py-3 px-4 text-right font-medium text-rose-600">2,000 kg</td>
                <td className="py-3 px-4 text-right font-black text-slate-900">
                  {(paddy?.currentStockKg || 3300).toLocaleString('en-IN')} kg
                </td>
                <td className="py-3 px-4 text-right text-slate-600">
                  {Math.round((paddy?.currentStockKg || 3300) / 50)} bags
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-[11px]">
                    Optimal
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Godown Warehouse Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-bold text-xs text-slate-800">Godown 1 (Main Yard)</h4>
            <span className="text-[10px] bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded">
              80% Capacity
            </span>
          </div>
          <p className="text-xs text-slate-500 mb-3">Primary covered warehouse with concrete flooring</p>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-600">Wheat HD-2967:</span>
              <strong className="text-slate-800">2,800 kg (56 bags)</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Paddy Basmati 1121:</span>
              <strong className="text-slate-800">1,400 kg (28 bags)</strong>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-bold text-xs text-slate-800">Godown 2 (Storage Shed B)</h4>
            <span className="text-[10px] bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded">
              55% Capacity
            </span>
          </div>
          <p className="text-xs text-slate-500 mb-3">Ventilated shed for commercial paddy lots</p>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-600">Paddy 1509:</span>
              <strong className="text-slate-800">1,900 kg (38 bags)</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Wheat Sharbati:</span>
              <strong className="text-slate-800">1,400 kg (28 bags)</strong>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-bold text-xs text-slate-800">Silo C (Fumigated Steel Silo)</h4>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded">
              Moisture 11.2%
            </span>
          </div>
          <p className="text-xs text-slate-500 mb-3">Airtight storage for premium seed grain</p>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-600">Mustard & Seeds:</span>
              <strong className="text-slate-800">1,200 kg (Bulk)</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Temperature:</span>
              <strong className="text-slate-800">22.4°C (Safe)</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
