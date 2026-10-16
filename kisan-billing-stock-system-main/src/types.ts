export type TransactionType = 'Sale' | 'Purchase';
export type PaymentStatus = 'Paid' | 'Due';

export interface Transaction {
  id: string;
  invoiceNo: string;
  date: string; // e.g. "20 May 2025"
  isoDate: string; // "2025-05-20"
  type: TransactionType;
  farmerId?: string;
  name: string;
  product: 'Wheat' | 'Paddy' | string;
  qtyKg: number;
  rate: number;
  amount: number;
  payment: PaymentStatus;
  notes?: string;
  vehicleNo?: string;
  paymentMode?: 'Cash' | 'Bank Transfer' | 'UPI' | 'Cheque';
}

export interface Farmer {
  id: string;
  name: string;
  phone: string;
  village: string;
  district: string;
  type: 'Farmer (Seller)' | 'Trader (Buyer)' | 'Both';
  balanceDue: number; // positive means they owe money or money is pending
  totalVolumeKg: number;
  totalTransactionsCount: number;
  lastActive: string;
}

export interface Product {
  id: string;
  name: string;
  variety?: string;
  category: 'Grains' | 'Pulses' | 'Oilseeds';
  currentStockKg: number;
  openingStockKg: number;
  inKg: number;
  outKg: number;
  standardRate: number;
  minAlertThresholdKg: number;
  bagsCount?: number;
}

export interface Expense {
  id: string;
  date: string;
  title: string;
  category: 'Labour' | 'Transport' | 'Gunny Bags' | 'Electricity' | 'Weighbridge' | 'Maintenance' | 'Staff Tea' | 'Other';
  amount: number;
  paidTo: string;
  paymentMode: 'Cash' | 'Bank Transfer' | 'UPI';
  notes?: string;
}

export interface StaffUser {
  id: string;
  name: string;
  role: 'Owner' | 'Admin' | 'Accountant' | 'Weighbridge Operator';
  email: string;
  phone: string;
  status: 'Active' | 'Inactive';
  lastLogin: string;
}

export interface BusinessProfile {
  businessName: string;
  tagline: string;
  licenseNo: string;
  gstin: string;
  mandiName: string;
  address: string;
  contactPhone: string;
  email: string;
  currency: string;
  invoicePrefix: string;
}
