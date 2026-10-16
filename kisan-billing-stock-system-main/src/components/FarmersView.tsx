import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Phone,
  MapPin,
  FileText,
  DollarSign,
  Search,
  CheckCircle,
  AlertCircle,
  X,
  CreditCard
} from 'lucide-react';
import { Farmer, Transaction } from '../types';

interface FarmersViewProps {
  farmers: Farmer[];
  transactions: Transaction[];
  onOpenAddFarmer: () => void;
  onSettleFarmerDue: (farmerId: string, amount: number) => void;
  selectedFarmerFromSearch?: Farmer | null;
}

export const FarmersView: React.FC<FarmersViewProps> = ({
  farmers,
  transactions,
  onOpenAddFarmer,
  onSettleFarmerDue,
  selectedFarmerFromSearch
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [activeLedgerFarmer, setActiveLedgerFarmer] = useState<Farmer | null>(
    selectedFarmerFromSearch || null
  );
  const [settleAmount, setSettleAmount] = useState<number>(0);

  const filteredFarmers = farmers.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.village.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.phone.includes(searchTerm);
    const matchesType = typeFilter === 'All' || f.type.includes(typeFilter);
    return matchesSearch && matchesType;
  });

  const totalOutstandingDue = farmers.reduce((sum, f) => sum + f.balanceDue, 0);

  const handleSettleDue = (farmer: Farmer) => {
    if (settleAmount <= 0) {
      alert('Please enter a valid amount.');
      return;
    }
    onSettleFarmerDue(farmer.id, settleAmount);
    setSettleAmount(0);
    setActiveLedgerFarmer(null);
  };

  return (
    <div className="space-y-6">
      {/* Title & Top Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            Farmers & Mandi Traders Directory (Kisan Ledger)
          </h2>
          <p className="text-xs text-slate-500">
            Maintain farmer contacts, villages, procurement volume, and credit accounts
          </p>
        </div>
        <button
          onClick={onOpenAddFarmer}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg flex items-center gap-2 shadow-sm transition-colors self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4 stroke-[2.5]" />
          + Add New Farmer / Trader
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs">
          <span className="text-xs text-slate-400 font-medium">Registered Farmers & Parties</span>
          <div className="text-xl font-bold text-slate-800 mt-1">
            {farmers.length} Active Accounts
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Covering 14+ villages</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs">
          <span className="text-xs text-slate-400 font-medium">Total Pending Dues (Credit)</span>
          <div className="text-xl font-bold text-amber-600 mt-1">
            ₹ {totalOutstandingDue.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full inline-block mt-1 font-medium">
            3 Accounts Pending
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs">
          <span className="text-xs text-slate-400 font-medium">Total Lifetime Grain Traded</span>
          <div className="text-xl font-bold text-emerald-600 mt-1">
            52,600 kg
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Verified weight records</span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by farmer name, village, or phone number..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-purple-500 text-slate-800"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex bg-slate-100 p-1 rounded-lg text-xs">
          {['All', 'Farmer', 'Trader'].map((type) => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`px-3 py-1 rounded-md font-semibold transition-all ${
                typeFilter === type
                  ? 'bg-white text-slate-800 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {type === 'All' ? 'All Parties' : `${type}s`}
            </button>
          ))}
        </div>
      </div>

      {/* Farmers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFarmers.map((farmer) => {
          const farmerTx = transactions.filter(
            (t) => t.name.toLowerCase() === farmer.name.toLowerCase()
          );

          return (
            <div
              key={farmer.id}
              className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs hover:border-purple-300 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{farmer.name}</h3>
                    <span className="inline-block mt-0.5 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {farmer.type}
                    </span>
                  </div>
                  {farmer.balanceDue > 0 ? (
                    <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-1 rounded-lg">
                      Due ₹{farmer.balanceDue.toLocaleString('en-IN')}
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-emerald-500" /> Settled
                    </span>
                  )}
                </div>

                <div className="space-y-1.5 text-xs text-slate-500 mb-4">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{farmer.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {farmer.village}, {farmer.district}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 p-2.5 bg-slate-50 rounded-lg text-[11px] text-slate-600 mb-4">
                  <div>
                    <span className="text-slate-400 block">Total Volume</span>
                    <strong className="text-slate-800">{farmer.totalVolumeKg.toLocaleString('en-IN')} kg</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Transactions</span>
                    <strong className="text-slate-800">{farmer.totalTransactionsCount || farmerTx.length} bills</strong>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">Active: {farmer.lastActive}</span>
                <button
                  onClick={() => {
                    setActiveLedgerFarmer(farmer);
                    setSettleAmount(farmer.balanceDue);
                  }}
                  className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5" />
                  View Ledger / Khata
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Farmer Ledger Modal (Khata Passbook) */}
      {activeLedgerFarmer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-purple-700 text-white">
              <div>
                <h3 className="font-bold text-base flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Farmer Ledger (Khata): {activeLedgerFarmer.name}
                </h3>
                <p className="text-xs text-purple-200">
                  {activeLedgerFarmer.village}, {activeLedgerFarmer.district} • {activeLedgerFarmer.phone}
                </p>
              </div>
              <button
                onClick={() => setActiveLedgerFarmer(null)}
                className="p-1 rounded-lg hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 text-xs sm:text-sm">
              {/* Due settlement section if balance > 0 */}
              {activeLedgerFarmer.balanceDue > 0 && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs text-amber-800 font-semibold block">Outstanding Pending Balance</span>
                    <span className="text-xl font-black text-amber-900">
                      ₹ {activeLedgerFarmer.balanceDue.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={settleAmount}
                      onChange={(e) => setSettleAmount(parseFloat(e.target.value) || 0)}
                      className="w-28 px-3 py-1.5 bg-white border border-amber-300 rounded-lg text-xs font-bold"
                    />
                    <button
                      onClick={() => handleSettleDue(activeLedgerFarmer)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors"
                    >
                      Receive / Clear Due
                    </button>
                  </div>
                </div>
              )}

              {/* Transactions List */}
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                Transaction History with Mandi
              </h4>
              <div className="max-h-60 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100">
                {transactions.filter(
                  (t) => t.name.toLowerCase() === activeLedgerFarmer.name.toLowerCase()
                ).length === 0 ? (
                  <div className="p-4 text-center text-slate-400 text-xs">
                    No individual transactions recorded yet.
                  </div>
                ) : (
                  transactions
                    .filter((t) => t.name.toLowerCase() === activeLedgerFarmer.name.toLowerCase())
                    .map((t) => (
                      <div key={t.id} className="p-3 flex items-center justify-between text-xs hover:bg-slate-50">
                        <div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                t.type === 'Sale' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                              }`}
                            >
                              {t.type}
                            </span>
                            <span className="font-semibold text-slate-800">
                              {t.product} ({t.qtyKg.toLocaleString('en-IN')} kg @ ₹{t.rate})
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400">
                            {t.invoiceNo} • {t.date}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-slate-900 block">
                            ₹ {t.amount.toLocaleString('en-IN')}
                          </span>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.2 rounded ${
                              t.payment === 'Paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                            }`}
                          >
                            {t.payment}
                          </span>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setActiveLedgerFarmer(null)}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-300 transition-colors"
              >
                Close Khata
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
