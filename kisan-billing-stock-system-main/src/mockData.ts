import { Transaction, Farmer, Product, Expense, StaffUser, BusinessProfile } from './types';

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    invoiceNo: 'KSN-2025-0142',
    date: '20 May 2025',
    isoDate: '2025-05-20',
    type: 'Sale',
    name: 'Ramesh Kumar',
    product: 'Wheat',
    qtyKg: 500,
    rate: 25.00,
    amount: 12500,
    payment: 'Paid',
    paymentMode: 'Cash',
    notes: 'Grade A Sharbati Wheat dispatched via tractor HR-06-A-4120'
  },
  {
    id: 'tx-2',
    invoiceNo: 'KSN-2025-0141',
    date: '20 May 2025',
    isoDate: '2025-05-20',
    type: 'Purchase',
    name: 'Suresh Yadav',
    product: 'Paddy',
    qtyKg: 300,
    rate: 22.00,
    amount: 6600,
    payment: 'Paid',
    paymentMode: 'UPI',
    notes: 'Paddy Basmati 1509 moisture 12% tested at dharamkanta'
  },
  {
    id: 'tx-3',
    invoiceNo: 'KSN-2025-0140',
    date: '19 May 2025',
    isoDate: '2025-05-19',
    type: 'Sale',
    name: 'Mahesh Singh',
    product: 'Paddy',
    qtyKg: 400,
    rate: 23.00,
    amount: 9200,
    payment: 'Due',
    paymentMode: 'Bank Transfer',
    notes: 'Credit term 7 days promised, bill copy signed by Mahesh'
  },
  {
    id: 'tx-4',
    invoiceNo: 'KSN-2025-0139',
    date: '19 May 2025',
    isoDate: '2025-05-19',
    type: 'Purchase',
    name: 'Om Prakash',
    product: 'Wheat',
    qtyKg: 600,
    rate: 24.00,
    amount: 14400,
    payment: 'Paid',
    paymentMode: 'Bank Transfer',
    notes: 'Direct farm gate procurement Karnal lot #42'
  },
  {
    id: 'tx-5',
    invoiceNo: 'KSN-2025-0138',
    date: '18 May 2025',
    isoDate: '2025-05-18',
    type: 'Sale',
    name: 'Vikram Patel',
    product: 'Wheat',
    qtyKg: 350,
    rate: 25.00,
    amount: 8750,
    payment: 'Paid',
    paymentMode: 'Cash',
    notes: 'Bulk flour mill supply sample approved'
  },
  {
    id: 'tx-6',
    invoiceNo: 'KSN-2025-0137',
    date: '17 May 2025',
    isoDate: '2025-05-17',
    type: 'Sale',
    name: 'Anita Devi',
    product: 'Wheat',
    qtyKg: 432,
    rate: 25.00,
    amount: 10800,
    payment: 'Due',
    paymentMode: 'Cash',
    notes: 'Pending payment - follow up next Monday'
  },
  {
    id: 'tx-7',
    invoiceNo: 'KSN-2025-0136',
    date: '16 May 2025',
    isoDate: '2025-05-16',
    type: 'Purchase',
    name: 'Harpreet Singh',
    product: 'Paddy',
    qtyKg: 850,
    rate: 22.50,
    amount: 19125,
    payment: 'Paid',
    paymentMode: 'Bank Transfer',
    notes: 'Grain trolley #PB-10-8832 weighed at Gate 2'
  },
  {
    id: 'tx-8',
    invoiceNo: 'KSN-2025-0135',
    date: '15 May 2025',
    isoDate: '2025-05-15',
    type: 'Sale',
    name: 'Baljit Agro Mills',
    product: 'Paddy',
    qtyKg: 1200,
    rate: 23.50,
    amount: 28200,
    payment: 'Paid',
    paymentMode: 'Bank Transfer',
    notes: 'Commercial delivery to processing unit'
  }
];

export const INITIAL_FARMERS: Farmer[] = [
  {
    id: 'frm-1',
    name: 'Ramesh Kumar',
    phone: '+91 98120 44512',
    village: 'Sampla',
    district: 'Rohtak, Haryana',
    type: 'Both',
    balanceDue: 0,
    totalVolumeKg: 8400,
    totalTransactionsCount: 14,
    lastActive: '20 May 2025'
  },
  {
    id: 'frm-2',
    name: 'Suresh Yadav',
    phone: '+91 94162 88301',
    village: 'Nilokheri',
    district: 'Karnal, Haryana',
    type: 'Farmer (Seller)',
    balanceDue: 0,
    totalVolumeKg: 6200,
    totalTransactionsCount: 9,
    lastActive: '20 May 2025'
  },
  {
    id: 'frm-3',
    name: 'Mahesh Singh',
    phone: '+91 98960 12094',
    village: 'Gohana',
    district: 'Sonipat, Haryana',
    type: 'Trader (Buyer)',
    balanceDue: 9200,
    totalVolumeKg: 5100,
    totalTransactionsCount: 8,
    lastActive: '19 May 2025'
  },
  {
    id: 'frm-4',
    name: 'Om Prakash',
    phone: '+91 97281 33456',
    village: 'Israna',
    district: 'Panipat, Haryana',
    type: 'Farmer (Seller)',
    balanceDue: 0,
    totalVolumeKg: 7800,
    totalTransactionsCount: 11,
    lastActive: '19 May 2025'
  },
  {
    id: 'frm-5',
    name: 'Vikram Patel',
    phone: '+91 98250 99821',
    village: 'Narela Mandi',
    district: 'North Delhi',
    type: 'Trader (Buyer)',
    balanceDue: 0,
    totalVolumeKg: 9500,
    totalTransactionsCount: 16,
    lastActive: '18 May 2025'
  },
  {
    id: 'frm-6',
    name: 'Anita Devi',
    phone: '+91 94165 77112',
    village: 'Shahabad',
    district: 'Kurukshetra, Haryana',
    type: 'Trader (Buyer)',
    balanceDue: 10800,
    totalVolumeKg: 3400,
    totalTransactionsCount: 5,
    lastActive: '17 May 2025'
  },
  {
    id: 'frm-7',
    name: 'Harpreet Singh',
    phone: '+91 98722 55431',
    village: 'Pehowa',
    district: 'Kurukshetra, Haryana',
    type: 'Farmer (Seller)',
    balanceDue: 0,
    totalVolumeKg: 12200,
    totalTransactionsCount: 18,
    lastActive: '16 May 2025'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-wheat',
    name: 'Wheat',
    variety: 'Sharbati & HD-2967',
    category: 'Grains',
    currentStockKg: 4200,
    openingStockKg: 2000,
    inKg: 2800,
    outKg: 2600,
    standardRate: 25.00,
    minAlertThresholdKg: 1000,
    bagsCount: 84
  },
  {
    id: 'prod-paddy',
    name: 'Paddy',
    variety: 'Basmati 1121 & 1509',
    category: 'Grains',
    currentStockKg: 3300,
    openingStockKg: 1500,
    inKg: 1800,
    outKg: 2000,
    standardRate: 23.00,
    minAlertThresholdKg: 800,
    bagsCount: 66
  },
  {
    id: 'prod-mustard',
    name: 'Mustard (Sarson)',
    variety: 'Pusa Bold',
    category: 'Oilseeds',
    currentStockKg: 1200,
    openingStockKg: 800,
    inKg: 900,
    outKg: 500,
    standardRate: 54.00,
    minAlertThresholdKg: 400,
    bagsCount: 24
  }
];

export const INITIAL_EXPENSES: Expense[] = [
  {
    id: 'exp-1',
    date: '20 May 2025',
    title: 'Labour Loading / Unloading Charges',
    category: 'Labour',
    amount: 6500,
    paidTo: 'Mukesh Palledar Union',
    paymentMode: 'Cash',
    notes: '120 quintal grain bags loading to Godown 2'
  },
  {
    id: 'exp-2',
    date: '18 May 2025',
    title: 'New Jute / Gunny Bags (Bori) 200 Pcs',
    category: 'Gunny Bags',
    amount: 7200,
    paidTo: 'Jindal Packaging Mills',
    paymentMode: 'UPI',
    notes: '50kg certified A-class jute sacks'
  },
  {
    id: 'exp-3',
    date: '16 May 2025',
    title: 'Tractor Trolley Transport Mandi Freight',
    category: 'Transport',
    amount: 3800,
    paidTo: 'Kartar Transport Co.',
    paymentMode: 'Cash',
    notes: 'Field haulage from Sampla to Mandi shed'
  },
  {
    id: 'exp-4',
    date: '14 May 2025',
    title: 'Electronic Weighbridge (Dharamkanta) Maintenance',
    category: 'Weighbridge',
    amount: 1500,
    paidTo: 'Precision Scales Service',
    paymentMode: 'UPI',
    notes: 'Weight sensor calibration test certification'
  },
  {
    id: 'exp-5',
    date: '10 May 2025',
    title: 'Mandi Shed Electricity & Lighting',
    category: 'Electricity',
    amount: 1000,
    paidTo: 'UHBVN Power Bill',
    paymentMode: 'Bank Transfer',
    notes: 'Monthly power consumption for shed fans & weighbridge'
  }
];

export const INITIAL_STAFF_USERS: StaffUser[] = [
  {
    id: 'usr-1',
    name: 'Admin',
    role: 'Owner',
    email: 'admin@kisanmandi.in',
    phone: '+91 98111 00001',
    status: 'Active',
    lastLogin: 'Today, 06:45 AM'
  },
  {
    id: 'usr-2',
    name: 'Rajinder Sharma',
    role: 'Accountant',
    email: 'accounts@kisanmandi.in',
    phone: '+91 98111 00002',
    status: 'Active',
    lastLogin: 'Today, 06:15 AM'
  },
  {
    id: 'usr-3',
    name: 'Devendra Chaudhary',
    role: 'Weighbridge Operator',
    email: 'scale@kisanmandi.in',
    phone: '+91 98111 00003',
    status: 'Active',
    lastLogin: 'Yesterday, 07:30 PM'
  }
];

export const INITIAL_BUSINESS_PROFILE: BusinessProfile = {
  businessName: 'KISAN — Billing & Stock System',
  tagline: 'Mandi Arthiya & Grain Merchant Management',
  licenseNo: 'APMC/ROH/2021/4892',
  gstin: '06AABCU9603R1ZM',
  mandiName: 'Grain Market Mandi Gate #2',
  address: 'Shop No. 44, New Grain Market, Rohtak, Haryana - 124001',
  contactPhone: '+91 98120 12345',
  email: 'support@kisanbilling.com',
  currency: '₹',
  invoicePrefix: 'KSN-2025'
};
