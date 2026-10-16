import React, { useState } from 'react';
import {
  Sprout,
  Plus,
  Wheat,
  Edit2,
  AlertTriangle,
  TrendingUp,
  Boxes,
  Check,
  X
} from 'lucide-react';
import { Product } from '../types';

interface ProductsViewProps {
  products: Product[];
  onUpdateRate: (productId: string, newRate: number) => void;
  onAddNewProduct: (newProd: Product) => void;
}

export const ProductsView: React.FC<ProductsViewProps> = ({
  products,
  onUpdateRate,
  onAddNewProduct
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempRate, setTempRate] = useState<number>(0);
  const [showAddModal, setShowAddModal] = useState(false);

  // New product form
  const [newName, setNewName] = useState('');
  const [newVariety, setNewVariety] = useState('');
  const [newCategory, setNewCategory] = useState<'Grains' | 'Pulses' | 'Oilseeds'>('Grains');
  const [newOpeningStock, setNewOpeningStock] = useState<number>(1000);
  const [newRate, setNewRate] = useState<number>(24.0);

  const handleStartEdit = (p: Product) => {
    setEditingId(p.id);
    setTempRate(p.standardRate);
  };

  const handleSaveRate = (pId: string) => {
    if (tempRate <= 0) {
      alert('Please enter a valid rate');
      return;
    }
    onUpdateRate(pId, tempRate);
    setEditingId(null);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const prod: Product = {
      id: `prod-${Date.now()}`,
      name: newName.trim(),
      variety: newVariety.trim() || 'Standard Grade',
      category: newCategory,
      openingStockKg: newOpeningStock,
      inKg: 0,
      outKg: 0,
      currentStockKg: newOpeningStock,
      standardRate: newRate,
      minAlertThresholdKg: 500,
      bagsCount: Math.round(newOpeningStock / 50)
    };

    onAddNewProduct(prod);
    setShowAddModal(false);
    setNewName('');
    setNewVariety('');
  };

  return (
    <div className="space-y-6">
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Sprout className="w-5 h-5 text-emerald-600" />
            Products & Commodities (Wheat / Paddy)
          </h2>
          <p className="text-xs text-slate-500">
            Grain varieties, mandi market rates (MSP), and inventory threshold alerts
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center gap-2 shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          + Add New Commodity
        </button>
      </div>

      {/* Grid of Product Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {products.map((p) => {
          const isWheat = p.name.toLowerCase().includes('wheat');
          const isEditing = editingId === p.id;
          const isLowStock = p.currentStockKg < p.minAlertThresholdKg;

          return (
            <div
              key={p.id}
              className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        isWheat ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'
                      }`}
                    >
                      <Wheat className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">{p.name}</h3>
                      <p className="text-xs text-slate-500">{p.variety || 'Certified Variety'}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {p.category}
                  </span>
                </div>

                {/* Stock Level Display */}
                <div className="p-3 bg-slate-50 rounded-xl mb-4 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">Available Warehouse Stock</span>
                    <strong className="text-sm font-black text-slate-800">
                      {p.currentStockKg.toLocaleString('en-IN')} kg
                    </strong>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-slate-400">
                    <span>Approx. Bags (50kg)</span>
                    <span className="font-medium text-slate-600">
                      ≈ {Math.round(p.currentStockKg / 50)} bags
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${isWheat ? 'bg-amber-500' : 'bg-emerald-500'}`}
                      style={{
                        width: `${Math.min(100, Math.round((p.currentStockKg / 5000) * 100))}%`
                      }}
                    />
                  </div>
                </div>

                {/* Rate Section */}
                <div className="flex items-center justify-between p-3 border border-slate-100 rounded-xl mb-4">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                      Standard Market Rate
                    </span>
                    {isEditing ? (
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-xs font-bold text-slate-600">₹</span>
                        <input
                          type="number"
                          step="0.25"
                          value={tempRate}
                          onChange={(e) => setTempRate(parseFloat(e.target.value) || 0)}
                          className="w-20 px-2 py-0.5 border border-emerald-400 rounded text-xs font-bold text-slate-900"
                        />
                        <button
                          onClick={() => handleSaveRate(p.id)}
                          className="p-1 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="p-1 bg-slate-200 text-slate-600 rounded hover:bg-slate-300"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-base font-bold text-slate-800">
                        ₹ {p.standardRate.toFixed(2)}{' '}
                        <span className="text-xs text-slate-400 font-normal">/ kg</span>
                      </span>
                    )}
                  </div>
                  {!isEditing && (
                    <button
                      onClick={() => handleStartEdit(p)}
                      className="px-2.5 py-1 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg text-xs font-semibold flex items-center gap-1"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      Edit Rate
                    </button>
                  )}
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">
                  Alert threshold: {p.minAlertThresholdKg.toLocaleString('en-IN')} kg
                </span>
                {isLowStock ? (
                  <span className="text-rose-600 font-semibold flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Low Stock
                  </span>
                ) : (
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    <Check className="w-3 h-3" /> Stock Healthy
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100">
            <div className="flex items-center justify-between px-6 py-4 bg-emerald-600 text-white">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Sprout className="w-5 h-5" />
                Add New Mandi Crop / Grain
              </h3>
              <button onClick={() => setShowAddModal(false)} className="hover:opacity-80">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateProduct} className="p-6 space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Crop / Commodity Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Barley (Jau) or Gram (Chana)"
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Variety / Grade</label>
                <input
                  type="text"
                  value={newVariety}
                  onChange={(e) => setNewVariety(e.target.value)}
                  placeholder="e.g. Desi Grade A, moisture under 12%"
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
                  >
                    <option value="Grains">Grains (Anaj)</option>
                    <option value="Pulses">Pulses (Dal)</option>
                    <option value="Oilseeds">Oilseeds (Telhan)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Standard Rate (₹/kg)</label>
                  <input
                    type="number"
                    step="0.25"
                    required
                    value={newRate}
                    onChange={(e) => setNewRate(parseFloat(e.target.value) || 0)}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Opening Stock (kg)</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={newOpeningStock}
                  onChange={(e) => setNewOpeningStock(parseFloat(e.target.value) || 0)}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-sm transition-colors"
                >
                  Save Commodity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
