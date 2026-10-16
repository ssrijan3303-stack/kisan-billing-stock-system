import React, { useState } from 'react';
import {
  X,
  Printer,
  Check,
  Plus,
  Wheat,
  User,
  ShoppingBag,
  ShoppingCart,
  CircleDollarSign,
  Warehouse,
  FileText
} from 'lucide-react';
import {
  Transaction,
  Farmer,
  Product,
  Expense,
  BusinessProfile
} from '../types';

/* ----------------------------------------------------
 * 1. ADD BILL (SALE) MODAL
 * ---------------------------------------------------- */
interface AddBillModalProps {
  isOpen: boolean;
  onClose: () => void;
  farmers: Farmer[];
  products: Product[];
  onAddTransaction: (tx: Omit<Transaction, 'id' | 'invoiceNo'>) => void;
  onOpenInvoicePreview: (tx: Transaction) => void;
}

export const AddBillModal: React.FC<AddBillModalProps> = ({
  isOpen,
  onClose,
  farmers,
  products,
  onAddTransaction,
  onOpenInvoicePreview
}) => {
  const [name, setName] = useState('');
  const [product, setProduct] = useState('Wheat');
  const [qtyKg, setQtyKg] = useState<number>(500);
  const [rate, setRate] = useState<number>(25.0);
  const [payment, setPayment] = useState<'Paid' | 'Due'>('Paid');
  const [paymentMode, setPaymentMode] = useState<'Cash' | 'Bank Transfer' | 'UPI' | 'Cheque'>('Cash');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const totalAmount = Math.round(qtyKg * rate);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter or select a buyer/farmer name.');
      return;
    }
    if (qtyKg <= 0 || rate <= 0) {
      alert('Please enter valid quantity and rate.');
      return;
    }

    const today = new Date();
    const dateFormatted = `${today.getDate()} ${today.toLocaleString('en-US', { month: 'short' })} ${today.getFullYear()}`;
    const isoDate = today.toISOString().split('T')[0];

    const newTx: Omit<Transaction, 'id' | 'invoiceNo'> = {
      date: dateFormatted,
      isoDate,
      type: 'Sale',
      name: name.trim(),
      product,
      qtyKg,
      rate,
      amount: totalAmount,
      payment,
      paymentMode,
      notes: notes.trim() || 'Dispatched from mandi inventory'
    };

    onAddTransaction(newTx);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 bg-emerald-600 text-white">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-white/20 rounded-lg">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">+ New Sale Bill / Invoice</h3>
              <p className="text-xs text-emerald-100">Record grain sale to buyer or trader</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/20 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs sm:text-sm">
          {/* Buyer / Farmer Name */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Buyer / Trader / Farmer Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                list="farmer-buyer-options"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Select or enter full name..."
                className="w-full px-3.5 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-800"
              />
              <datalist id="farmer-buyer-options">
                {farmers.map((f) => (
                  <option key={f.id} value={f.name}>
                    {f.name} ({f.village})
                  </option>
                ))}
              </datalist>
            </div>
          </div>

          {/* Product and Rate */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Grain Product</label>
              <select
                value={product}
                onChange={(e) => {
                  setProduct(e.target.value);
                  const selectedProd = products.find((p) => p.name === e.target.value);
                  if (selectedProd) setRate(selectedProd.standardRate);
                }}
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
                step="0.25"
                min="1"
                required
                value={rate}
                onChange={(e) => setRate(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Quantity & Bag Calculation */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Quantity (in kg)</label>
              <input
                type="number"
                min="1"
                required
                value={qtyKg}
                onChange={(e) => setQtyKg(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
              <span className="text-[11px] text-slate-400 mt-0.5 block">
                ≈ {Math.round(qtyKg / 50)} bags of 50kg
              </span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Payment Status</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPayment('Paid')}
                  className={`py-2 px-3 rounded-lg border text-xs font-semibold text-center transition-all ${
                    payment === 'Paid'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-700 ring-1 ring-emerald-500'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Paid
                </button>
                <button
                  type="button"
                  onClick={() => setPayment('Due')}
                  className={`py-2 px-3 rounded-lg border text-xs font-semibold text-center transition-all ${
                    payment === 'Due'
                      ? 'bg-amber-50 border-amber-500 text-amber-700 ring-1 ring-amber-500'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Due (Credit)
                </button>
              </div>
            </div>
          </div>

          {/* Payment Mode & Vehicle/Gate */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Payment Mode</label>
              <select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value as any)}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
              >
                <option value="Cash">Cash</option>
                <option value="UPI">UPI / QR</option>
                <option value="Bank Transfer">NEFT / Bank Transfer</option>
                <option value="Cheque">Cheque</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Gate Pass / Vehicle No.</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Trolley HR-06-B-9912"
                className="w-full px-3.5 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Total Calculation Card */}
          <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/60 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-xs text-emerald-800 font-medium">Total Bill Amount</span>
              <p className="text-xl font-bold text-emerald-900">
                ₹ {totalAmount.toLocaleString('en-IN')}
              </p>
            </div>
            <div className="text-right text-[11px] text-emerald-700">
              <span>{qtyKg} kg @ ₹{rate}/kg</span>
              <p className="font-semibold">{payment === 'Paid' ? 'Payment Received' : 'Added to Dues'}</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold shadow-sm transition-colors flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Save Bill & Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ----------------------------------------------------
 * 2. ADD PURCHASE MODAL (GRAIN PROCUREMENT)
 * ---------------------------------------------------- */
interface AddPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  farmers: Farmer[];
  products: Product[];
  onAddTransaction: (tx: Omit<Transaction, 'id' | 'invoiceNo'>) => void;
}

export const AddPurchaseModal: React.FC<AddPurchaseModalProps> = ({
  isOpen,
  onClose,
  farmers,
  products,
  onAddTransaction
}) => {
  const [name, setName] = useState('');
  const [product, setProduct] = useState('Paddy');
  const [qtyKg, setQtyKg] = useState<number>(300);
  const [rate, setRate] = useState<number>(22.0);
  const [payment, setPayment] = useState<'Paid' | 'Due'>('Paid');
  const [paymentMode, setPaymentMode] = useState<'Cash' | 'Bank Transfer' | 'UPI' | 'Cheque'>('UPI');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const totalAmount = Math.round(qtyKg * rate);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter or select a farmer name.');
      return;
    }
    if (qtyKg <= 0 || rate <= 0) {
      alert('Please enter valid quantity and rate.');
      return;
    }

    const today = new Date();
    const dateFormatted = `${today.getDate()} ${today.toLocaleString('en-US', { month: 'short' })} ${today.getFullYear()}`;
    const isoDate = today.toISOString().split('T')[0];

    const newTx: Omit<Transaction, 'id' | 'invoiceNo'> = {
      date: dateFormatted,
      isoDate,
      type: 'Purchase',
      name: name.trim(),
      product,
      qtyKg,
      rate,
      amount: totalAmount,
      payment,
      paymentMode,
      notes: notes.trim() || 'Purchased directly from farmer at mandi yard'
    };

    onAddTransaction(newTx);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 bg-blue-600 text-white">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-white/20 rounded-lg">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">+ New Grain Purchase Entry</h3>
              <p className="text-xs text-blue-100">Procure harvest from farmer & increase inventory</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/20 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs sm:text-sm">
          {/* Farmer Name */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Farmer (Seller) Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              list="farmers-purchase-list"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Suresh Yadav or enter new farmer..."
              className="w-full px-3.5 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800"
            />
            <datalist id="farmers-purchase-list">
              {farmers.map((f) => (
                <option key={f.id} value={f.name}>
                  {f.name} - {f.village} ({f.phone})
                </option>
              ))}
            </datalist>
          </div>

          {/* Product and Rate */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Product Purchased</label>
              <select
                value={product}
                onChange={(e) => {
                  setProduct(e.target.value);
                  const selectedProd = products.find((p) => p.name === e.target.value);
                  if (selectedProd) setRate(selectedProd.standardRate - 1.0);
                }}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Purchase Rate (₹/kg)</label>
              <input
                type="number"
                step="0.25"
                min="1"
                required
                value={rate}
                onChange={(e) => setRate(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Quantity and Payment Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Procured Weight (kg)</label>
              <input
                type="number"
                min="1"
                required
                value={qtyKg}
                onChange={(e) => setQtyKg(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              <span className="text-[11px] text-slate-400 mt-0.5 block">
                Stock will automatically increase by {qtyKg} kg
              </span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Payment to Farmer</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPayment('Paid')}
                  className={`py-2 px-3 rounded-lg border text-xs font-semibold text-center transition-all ${
                    payment === 'Paid'
                      ? 'bg-blue-50 border-blue-500 text-blue-700 ring-1 ring-blue-500'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Paid
                </button>
                <button
                  type="button"
                  onClick={() => setPayment('Due')}
                  className={`py-2 px-3 rounded-lg border text-xs font-semibold text-center transition-all ${
                    payment === 'Due'
                      ? 'bg-amber-50 border-amber-500 text-amber-700 ring-1 ring-amber-500'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Due (Pending)
                </button>
              </div>
            </div>
          </div>

          {/* Payment Mode & Dharamkanta Note */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Disbursement Mode</label>
              <select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value as any)}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
              >
                <option value="UPI">UPI / Instant Online</option>
                <option value="Cash">Cash at Counter</option>
                <option value="Bank Transfer">Direct Bank RTGS/NEFT</option>
                <option value="Cheque">Bank Cheque</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Weighbridge Slip / Notes</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Slip #WB-991, moisture 12%"
                className="w-full px-3.5 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Total Purchase Card */}
          <div className="p-3.5 bg-blue-50/70 border border-blue-200/60 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-xs text-blue-800 font-medium">Payable Amount</span>
              <p className="text-xl font-bold text-blue-900">
                ₹ {totalAmount.toLocaleString('en-IN')}
              </p>
            </div>
            <div className="text-right text-[11px] text-blue-700">
              <span>{qtyKg} kg @ ₹{rate}/kg</span>
              <p className="font-semibold">{payment === 'Paid' ? 'Paid to Farmer' : 'Added to Payable Balance'}</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-sm transition-colors flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Save Purchase & Stock In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ----------------------------------------------------
 * 3. ADD FARMER MODAL
 * ---------------------------------------------------- */
interface AddFarmerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddFarmer: (farmer: Omit<Farmer, 'id' | 'totalVolumeKg' | 'totalTransactionsCount' | 'lastActive'>) => void;
}

export const AddFarmerModal: React.FC<AddFarmerModalProps> = ({
  isOpen,
  onClose,
  onAddFarmer
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [village, setVillage] = useState('');
  const [district, setDistrict] = useState('Rohtak, Haryana');
  const [type, setType] = useState<'Farmer (Seller)' | 'Trader (Buyer)' | 'Both'>('Farmer (Seller)');
  const [balanceDue, setBalanceDue] = useState<number>(0);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter farmer/trader name');
      return;
    }

    onAddFarmer({
      name: name.trim(),
      phone: phone.trim() || '+91 98000 00000',
      village: village.trim() || 'Local Mandi',
      district: district.trim() || 'Haryana',
      type,
      balanceDue: balanceDue || 0
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 bg-purple-600 text-white">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-white/20 rounded-lg">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">+ Add New Farmer / Trader</h3>
              <p className="text-xs text-purple-100">Register contact, village, and ledger balance</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/20 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ramesh Kumar"
              className="w-full px-3.5 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Mobile Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98120 00000"
                className="w-full px-3.5 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Profile Category</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 bg-white"
              >
                <option value="Farmer (Seller)">Farmer (Seller)</option>
                <option value="Trader (Buyer)">Trader (Buyer)</option>
                <option value="Both">Both (Seller & Buyer)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Village / Town</label>
              <input
                type="text"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                placeholder="e.g. Sampla"
                className="w-full px-3.5 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">District, State</label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="Rohtak, Haryana"
                className="w-full px-3.5 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Opening Pending Due (₹)</label>
            <input
              type="number"
              min="0"
              value={balanceDue}
              onChange={(e) => setBalanceDue(parseFloat(e.target.value) || 0)}
              placeholder="0 if all settled"
              className="w-full px-3.5 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
            />
            <span className="text-[11px] text-slate-400 mt-0.5 block">
              Set starting balance owed by this party
            </span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold shadow-sm transition-colors flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Save Farmer Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ----------------------------------------------------
 * 4. ADD EXPENSE MODAL
 * ---------------------------------------------------- */
interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddExpense: (expense: Omit<Expense, 'id'>) => void;
}

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  isOpen,
  onClose,
  onAddExpense
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Expense['category']>('Labour');
  const [amount, setAmount] = useState<number>(2500);
  const [paidTo, setPaidTo] = useState('');
  const [paymentMode, setPaymentMode] = useState<Expense['paymentMode']>('Cash');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || amount <= 0) {
      alert('Please enter valid expense details.');
      return;
    }

    const today = new Date();
    const dateFormatted = `${today.getDate()} ${today.toLocaleString('en-US', { month: 'short' })} ${today.getFullYear()}`;

    onAddExpense({
      date: dateFormatted,
      title: title.trim(),
      category,
      amount,
      paidTo: paidTo.trim() || 'Vendor',
      paymentMode,
      notes: notes.trim()
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 bg-rose-600 text-white">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-white/20 rounded-lg">
              <CircleDollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">📦 Record Mandi Expense</h3>
              <p className="text-xs text-rose-100">Labour, packaging, transport & utility costs</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/20 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Expense Description <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Labour loading charges for 100 bags"
              className="w-full px-3.5 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 bg-white"
              >
                <option value="Labour">Labour / Palledar</option>
                <option value="Gunny Bags">Gunny Bags / Bori</option>
                <option value="Transport">Transport / Freight</option>
                <option value="Weighbridge">Weighbridge / Dharamkanta</option>
                <option value="Electricity">Electricity / Diesel</option>
                <option value="Staff Tea">Staff Tea / Refreshment</option>
                <option value="Maintenance">Maintenance & Repair</option>
                <option value="Other">Other Miscellaneous</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Amount (₹) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                required
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Paid To / Recipient</label>
              <input
                type="text"
                value={paidTo}
                onChange={(e) => setPaidTo(e.target.value)}
                placeholder="Worker union, vendor, etc."
                className="w-full px-3.5 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Payment Mode</label>
              <select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value as any)}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 bg-white"
              >
                <option value="Cash">Cash</option>
                <option value="UPI">UPI</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Receipt / Voucher Notes</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Voucher #V-882, signed receipt kept in drawer"
              className="w-full px-3.5 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold shadow-sm transition-colors flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Save Expense Entry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ----------------------------------------------------
 * 5. STOCK ENTRY MODAL
 * ---------------------------------------------------- */
interface StockEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onUpdateStock: (productId: string, type: 'in' | 'out' | 'audit', qtyKg: number, reason: string) => void;
}

export const StockEntryModal: React.FC<StockEntryModalProps> = ({
  isOpen,
  onClose,
  products,
  onUpdateStock
}) => {
  const [productId, setProductId] = useState(products[0]?.id || 'prod-wheat');
  const [entryType, setEntryType] = useState<'in' | 'out' | 'audit'>('in');
  const [qtyKg, setQtyKg] = useState<number>(500);
  const [location, setLocation] = useState('Godown 1 (Main Yard)');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const currentProd = products.find((p) => p.id === productId) || products[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (qtyKg <= 0) {
      alert('Please enter a valid quantity.');
      return;
    }

    const reason = `${location}: ${notes.trim() || 'Manual stock adjustment'}`;
    onUpdateStock(productId, entryType, qtyKg, reason);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 bg-amber-600 text-white">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-white/20 rounded-lg">
              <Warehouse className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">🌾 Grain Stock Entry & Transfer</h3>
              <p className="text-xs text-amber-100">Log warehouse in/out movement and audit</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/20 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Select Grain</label>
            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="w-full px-3.5 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (Current: {p.currentStockKg.toLocaleString('en-IN')} kg)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Entry Movement Type</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setEntryType('in')}
                className={`py-2 px-2 text-xs font-semibold rounded-lg border text-center transition-all ${
                  entryType === 'in'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-700 ring-1 ring-emerald-500'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                + Inward (Add)
              </button>
              <button
                type="button"
                onClick={() => setEntryType('out')}
                className={`py-2 px-2 text-xs font-semibold rounded-lg border text-center transition-all ${
                  entryType === 'out'
                    ? 'bg-rose-50 border-rose-500 text-rose-700 ring-1 ring-rose-500'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                - Outward (Deduct)
              </button>
              <button
                type="button"
                onClick={() => setEntryType('audit')}
                className={`py-2 px-2 text-xs font-semibold rounded-lg border text-center transition-all ${
                  entryType === 'audit'
                    ? 'bg-amber-50 border-amber-500 text-amber-700 ring-1 ring-amber-500'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Audit Set
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {entryType === 'audit' ? 'New Exact Stock (kg)' : 'Quantity (kg)'}
              </label>
              <input
                type="number"
                min="1"
                required
                value={qtyKg}
                onChange={(e) => setQtyKg(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Warehouse Location</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white"
              >
                <option value="Godown 1 (Main Yard)">Godown 1 (Main Yard)</option>
                <option value="Godown 2 (Storage Shed)">Godown 2 (Storage Shed)</option>
                <option value="Silo C (Fumigated)">Silo C (Fumigated)</option>
                <option value="Transit Platform #4">Transit Platform #4</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Reason / Batch Notes</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Moisture shrinkage adjustment or lot transfer"
              className="w-full px-3.5 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>

          {currentProd && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex justify-between">
              <span>Current Stock: <strong>{currentProd.currentStockKg.toLocaleString('en-IN')} kg</strong></span>
              <span>
                Projected:{' '}
                <strong>
                  {(
                    entryType === 'in'
                      ? currentProd.currentStockKg + qtyKg
                      : entryType === 'out'
                      ? Math.max(0, currentProd.currentStockKg - qtyKg)
                      : qtyKg
                  ).toLocaleString('en-IN')}{' '}
                  kg
                </strong>
              </span>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold shadow-sm transition-colors flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Confirm Movement
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ----------------------------------------------------
 * 6. INVOICE PREVIEW & PRINT MODAL
 * ---------------------------------------------------- */
interface InvoicePreviewModalProps {
  transaction: Transaction | null;
  businessProfile: BusinessProfile;
  onClose: () => void;
}

export const InvoicePreviewModal: React.FC<InvoicePreviewModalProps> = ({
  transaction,
  businessProfile,
  onClose
}) => {
  if (!transaction) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="no-print flex items-center justify-between px-6 py-3.5 bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-sm">Invoice / Mandi Parchi Preview</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Parchi / Bill
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Bill Paper */}
        <div id="printable-invoice" className="p-8 bg-white text-slate-800 font-sans">
          {/* Header */}
          <div className="border-b-2 border-emerald-600 pb-4 mb-6 flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Wheat className="w-6 h-6 text-emerald-600" />
                <h2 className="text-xl font-black tracking-tight text-[#062314]">
                  {businessProfile.businessName}
                </h2>
              </div>
              <p className="text-xs text-slate-500 font-medium">{businessProfile.tagline}</p>
              <p className="text-xs text-slate-500">{businessProfile.address}</p>
              <p className="text-xs text-slate-500 font-medium">
                Mandi Lic: <span className="text-slate-700">{businessProfile.licenseNo}</span> • GSTIN:{' '}
                <span className="text-slate-700">{businessProfile.gstin}</span>
              </p>
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 rounded-md text-xs font-bold uppercase tracking-wider mb-1">
                {transaction.type === 'Sale' ? 'Sales Voucher (Bikri Parchi)' : 'Procurement Bill'}
              </span>
              <p className="text-sm font-bold text-slate-800">{transaction.invoiceNo}</p>
              <p className="text-xs text-slate-500">Date: {transaction.date}</p>
            </div>
          </div>

          {/* Party Details */}
          <div className="grid grid-cols-2 gap-6 mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Billed To (Party)
              </span>
              <h4 className="text-base font-bold text-slate-900 mt-0.5">{transaction.name}</h4>
              <p className="text-xs text-slate-600">Category: {transaction.type === 'Sale' ? 'Buyer / Merchant' : 'Farmer (Kisan)'}</p>
              <p className="text-xs text-slate-500">Payment Mode: {transaction.paymentMode || 'Cash / Mandi Account'}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Transaction Status
              </span>
              <div className="mt-1">
                <span
                  className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${
                    transaction.payment === 'Paid'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {transaction.payment === 'Paid' ? 'PAID & SETTLED' : 'PAYMENT DUE / PENDING'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">{transaction.notes}</p>
            </div>
          </div>

          {/* Item Table */}
          <table className="w-full text-left text-xs mb-6 border border-slate-200 rounded-lg overflow-hidden">
            <thead className="bg-slate-100 text-slate-700 font-semibold uppercase text-[10px]">
              <tr>
                <th className="p-3">#</th>
                <th className="p-3">Commodity / Item</th>
                <th className="p-3 text-right">Net Weight</th>
                <th className="p-3 text-right">Rate (₹)</th>
                <th className="p-3 text-right">Total Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="p-3 font-medium">1</td>
                <td className="p-3">
                  <div className="font-bold text-slate-800">{transaction.product}</div>
                  <div className="text-[11px] text-slate-500">Fair Average Quality (FAQ) Grade A</div>
                </td>
                <td className="p-3 text-right font-medium">{transaction.qtyKg.toLocaleString('en-IN')} kg</td>
                <td className="p-3 text-right font-medium">₹ {transaction.rate.toFixed(2)}</td>
                <td className="p-3 text-right font-bold text-slate-900">
                  ₹ {transaction.amount.toLocaleString('en-IN')}
                </td>
              </tr>
            </tbody>
            <tfoot className="bg-slate-50 font-semibold text-slate-800">
              <tr>
                <td colSpan={3} className="p-3 text-slate-500 text-right">
                  Subtotal:
                </td>
                <td colSpan={2} className="p-3 text-right font-bold">
                  ₹ {transaction.amount.toLocaleString('en-IN')}
                </td>
              </tr>
              <tr className="border-t border-slate-200 text-sm">
                <td colSpan={3} className="p-3 font-bold text-emerald-800 text-right">
                  Grand Total Payable:
                </td>
                <td colSpan={2} className="p-3 text-right font-black text-emerald-700 text-base">
                  ₹ {transaction.amount.toLocaleString('en-IN')}
                </td>
              </tr>
            </tfoot>
          </table>

          {/* Terms & Signature */}
          <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-200 text-xs">
            <div>
              <p className="font-bold text-slate-700 mb-1">Mandi Conditions:</p>
              <ul className="text-slate-500 space-y-0.5 text-[11px] list-disc pl-4">
                <li>Goods weighed on electronic dharamkanta as per APMC bylaws.</li>
                <li>Settlement terms strictly adhere to regulated grain market norms.</li>
                <li>Computer generated parchi; requires no manual alter.</li>
              </ul>
            </div>
            <div className="text-right flex flex-col justify-end items-end">
              <div className="w-40 border-b border-slate-400 pb-1 mb-1"></div>
              <p className="font-bold text-slate-800">For {businessProfile.businessName}</p>
              <p className="text-[11px] text-slate-400">Authorized Mandi Signatory</p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="no-print p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
