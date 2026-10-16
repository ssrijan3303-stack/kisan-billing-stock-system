import React, { useState } from 'react';
import {
  Receipt,
  Plus,
  Printer,
  FileCheck,
  Search,
  ShoppingCart,
  User,
  Wheat,
  Clock,
  ArrowRight
} from 'lucide-react';
import { Transaction, Farmer, Product, BusinessProfile } from '../types';

interface BillingViewProps {
  transactions: Transaction[];
  farmers: Farmer[];
  products: Product[];
  businessProfile: BusinessProfile;
  onAddTransaction: (tx: Omit<Transaction, 'id' | 'invoiceNo'>) => void;
  onViewInvoice: (tx: Transaction) => void;
}

export const BillingView: React.FC<BillingViewProps> = ({
  transactions,
  farmers,
  products,
  businessProfile,
  onAddTransaction,
  onViewInvoice
}) => {
  // Billing form state
  const [partyName, setPartyName] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(products[0]?.name || 'Wheat');
  const [weightKg, setWeightKg] = useState<number>(500);
  const [ratePerKg, setRatePerKg] = useState<number>(25.0);
  const [billType, setBillType] = useState<'Sale' | 'Purchase'>('Sale');
  const [paymentStatus, setPaymentStatus] = useState<'Paid' | 'Due'>('Paid');
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Bank Transfer' | 'UPI' | 'Cheque'>('Cash');
  const [vehicleNo, setVehicleNo] = useState('');
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [mandiTaxPct, setMandiTaxPct] = useState<number>(0); // APMC cess
  const [notes, setNotes] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Calculations
  const subTotal = Math.round(weightKg * ratePerKg);
  const taxAmount = Math.round((subTotal * mandiTaxPct) / 100);
  const grandTotal = Math.max(0, subTotal + taxAmount - discountAmount);

  const handleProductChange = (prodName: string) => {
    setSelectedProduct(prodName);
    const prod = products.find((p) => p.name === prodName);
    if (prod) {
      setRatePerKg(billType === 'Sale' ? prod.standardRate : prod.standardRate - 1.5);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partyName.trim()) {
      alert('Please enter party (farmer/buyer) name.');
      return;
    }
    if (weightKg <= 0 || ratePerKg <= 0) {
      alert('Please enter valid weight and rate.');
      return;
    }

    const today = new Date();
    const dateFormatted = `${today.getDate()} ${today.toLocaleString('en-US', { month: 'short' })} ${today.getFullYear()}`;
    const isoDate = today.toISOString().split('T')[0];

    const noteDetails = [
      vehicleNo ? `Vehicle: ${vehicleNo}` : '',
      discountAmount > 0 ? `Discount: ₹${discountAmount}` : '',
      notes
    ]
      .filter(Boolean)
      .join(' | ');

    const newTx: Omit<Transaction, 'id' | 'invoiceNo'> = {
      date: dateFormatted,
      isoDate,
      type: billType,
      name: partyName.trim(),
      product: selectedProduct,
      qtyKg: weightKg,
      rate: ratePerKg,
      amount: grandTotal,
      payment: paymentStatus,
      paymentMode: paymentMethod,
      vehicleNo: vehicleNo.trim(),
      notes: noteDetails || 'Billed at Mandi Counter'
    };

    onAddTransaction(newTx);
    setSuccessMsg(`Invoice generated successfully for ${partyName}!`);
    setTimeout(() => setSuccessMsg(''), 4000);

    // Reset some form fields
    setPartyName('');
    setVehicleNo('');
    setNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-emerald-600" />
            Mandi Billing & Parchi Generation
          </h2>
          <p className="text-xs text-slate-500">
            Generate digital sale slips and procurement vouchers with automatic ledger updates
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-lg flex items-center gap-1.5">
            <FileCheck className="w-3.5 h-3.5" />
            APMC Lic: {businessProfile.licenseNo}
          </span>
        </div>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-sm flex items-center justify-between animate-in fade-in">
          <span>{successMsg}</span>
          <button onClick={() => setSuccessMsg('')} className="underline text-emerald-100">
            Dismiss
          </button>
        </div>
      )}

      {/* Main Billing Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Billing Terminal (col-span-7) */}
        <div className="lg:col-span-7 bg-white rounded-xl shadow-xs border border-slate-200/80 p-5">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              New Bill Entry
            </span>
            {/* Bill Type Selector: Sale vs Purchase */}
            <div className="flex items-center bg-slate-100 p-1 rounded-lg text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  setBillType('Sale');
                  const prod = products.find((p) => p.name === selectedProduct);
                  if (prod) setRatePerKg(prod.standardRate);
                }}
                className={`px-3 py-1 rounded-md transition-all ${
                  billType === 'Sale'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sale (Bikri Parchi)
              </button>
              <button
                type="button"
                onClick={() => {
                  setBillType('Purchase');
                  const prod = products.find((p) => p.name === selectedProduct);
                  if (prod) setRatePerKg(prod.standardRate - 1.5);
                }}
                className={`px-3 py-1 rounded-md transition-all ${
                  billType === 'Purchase'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Purchase (Kharid)
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
            {/* Party Name */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {billType === 'Sale' ? 'Buyer / Merchant / Trader' : 'Farmer / Seller'}{' '}
                <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                list="billing-parties-list"
                value={partyName}
                onChange={(e) => setPartyName(e.target.value)}
                placeholder="Enter party name or select from directory..."
                className="w-full px-3.5 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-800"
              />
              <datalist id="billing-parties-list">
                {farmers.map((f) => (
                  <option key={f.id} value={f.name}>
                    {f.name} • {f.village} {f.balanceDue > 0 ? `(Due: ₹${f.balanceDue})` : ''}
                  </option>
                ))}
              </datalist>
            </div>

            {/* Product & Rate */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Commodity / Grain</label>
                <select
                  value={selectedProduct}
                  onChange={(e) => handleProductChange(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name} (Stock: {p.currentStockKg.toLocaleString('en-IN')} kg)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Rate (₹ per kg)</label>
                <input
                  type="number"
                  step="0.10"
                  min="1"
                  required
                  value={ratePerKg}
                  onChange={(e) => setRatePerKg(parseFloat(e.target.value) || 0)}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold"
                />
              </div>
            </div>

            {/* Net Weight & Bags */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Net Weight (in kg) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={weightKg}
                  onChange={(e) => setWeightKg(parseFloat(e.target.value) || 0)}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-bold"
                />
                <span className="text-[11px] text-slate-400 mt-0.5 block">
                  Approx {Math.round(weightKg / 50)} bags (50kg standard)
                </span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Vehicle / Tractor No.</label>
                <input
                  type="text"
                  value={vehicleNo}
                  onChange={(e) => setVehicleNo(e.target.value)}
                  placeholder="e.g. HR-06-AA-9988"
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Payment Status & Payment Mode */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Payment Status</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentStatus('Paid')}
                    className={`py-2 px-3 rounded-lg border text-xs font-bold transition-all ${
                      paymentStatus === 'Paid'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-700 ring-1 ring-emerald-500'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Paid
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentStatus('Due')}
                    className={`py-2 px-3 rounded-lg border text-xs font-bold transition-all ${
                      paymentStatus === 'Due'
                        ? 'bg-amber-50 border-amber-500 text-amber-700 ring-1 ring-amber-500'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Due (Credit)
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Payment Mode</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
                >
                  <option value="Cash">Cash at Counter</option>
                  <option value="UPI">UPI / Online QR</option>
                  <option value="Bank Transfer">Bank RTGS / NEFT</option>
                  <option value="Cheque">Bank Cheque</option>
                </select>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Remarks / Mandi Notes</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Fair average quality, bag count, weighbridge slip number..."
                className="w-full px-3.5 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            {/* Action Submit */}
            <div className="pt-2">
              <button
                type="submit"
                className={`w-full py-3 rounded-xl font-bold text-white shadow-sm transition-all flex items-center justify-center gap-2 ${
                  billType === 'Sale'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                <Printer className="w-4 h-4" />
                Generate & Save {billType} Bill (₹ {grandTotal.toLocaleString('en-IN')})
              </button>
            </div>
          </form>
        </div>

        {/* Right: Live Bill Slip Preview (col-span-5) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <span className="text-xs font-bold text-slate-700">Live Slip Preview</span>
              <span className="text-[10px] bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded">
                Draft
              </span>
            </div>

            {/* Bill Receipt Card */}
            <div className="border border-dashed border-slate-300 rounded-xl p-4 bg-slate-50/60 font-mono text-xs space-y-3">
              <div className="text-center pb-2 border-b border-dashed border-slate-300">
                <h4 className="font-bold text-slate-800 text-sm">{businessProfile.businessName}</h4>
                <p className="text-[10px] text-slate-500">{businessProfile.address}</p>
                <p className="text-[10px] text-slate-400">Lic: {businessProfile.licenseNo}</p>
              </div>

              <div className="flex justify-between text-[11px] text-slate-600">
                <span>Party: <strong>{partyName || '— (Select party)'}</strong></span>
                <span>Type: <strong>{billType}</strong></span>
              </div>

              <div className="flex justify-between text-[11px] text-slate-600">
                <span>Date: <strong>20 May 2025</strong></span>
                <span>Vehicle: <strong>{vehicleNo || 'Self'}</strong></span>
              </div>

              <div className="border-t border-b border-dashed border-slate-300 py-2 space-y-1">
                <div className="flex justify-between text-slate-700">
                  <span>{selectedProduct} ({weightKg} kg @ ₹{ratePerKg}/kg)</span>
                  <span className="font-bold">₹ {subTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="pt-1 flex justify-between items-center text-sm font-bold text-slate-900">
                <span>Net Total:</span>
                <span className="text-base text-emerald-700 font-black">
                  ₹ {grandTotal.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex items-center justify-between pt-1 text-[11px]">
                <span className="text-slate-500">Status:</span>
                <span
                  className={`font-bold px-2 py-0.5 rounded ${
                    paymentStatus === 'Paid'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {paymentStatus} ({paymentMethod})
                </span>
              </div>
            </div>
          </div>

          {/* Quick List of Recent Bills */}
          <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 p-5">
            <h3 className="text-xs font-bold text-slate-700 mb-3 flex items-center justify-between">
              <span>Recently Generated Bills</span>
              <span className="text-[11px] text-slate-400 font-normal">Last 4 entries</span>
            </h3>

            <div className="space-y-2 text-xs">
              {transactions.slice(0, 4).map((tx) => (
                <div
                  key={tx.id}
                  onClick={() => onViewInvoice(tx)}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 hover:border-emerald-300 hover:bg-emerald-50/30 cursor-pointer transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                          tx.type === 'Sale'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {tx.type}
                      </span>
                      <p className="font-semibold text-slate-800">{tx.name}</p>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {tx.product} • {tx.qtyKg} kg @ ₹{tx.rate}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-800">
                      ₹ {tx.amount.toLocaleString('en-IN')}
                    </p>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.2 rounded ${
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
          </div>
        </div>
      </div>
    </div>
  );
};
