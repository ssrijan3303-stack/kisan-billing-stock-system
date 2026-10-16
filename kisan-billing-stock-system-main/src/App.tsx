/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  INITIAL_TRANSACTIONS,
  INITIAL_FARMERS,
  INITIAL_PRODUCTS,
  INITIAL_EXPENSES,
  INITIAL_STAFF_USERS,
  INITIAL_BUSINESS_PROFILE
} from './mockData';
import {
  Transaction,
  Farmer,
  Product,
  Expense,
  StaffUser,
  BusinessProfile
} from './types';
import { translations, Language } from './translations';
import { Sidebar, NavTab } from './components/Sidebar';
import { TopNav } from './components/TopNav';
import { DashboardView } from './components/DashboardView';
import { BillingView } from './components/BillingView';
import { SalesView } from './components/SalesView';
import { PurchaseView } from './components/PurchaseView';
import { FarmersView } from './components/FarmersView';
import { ProductsView } from './components/ProductsView';
import { StockView } from './components/StockView';
import { ReportsView, ReportSubTab } from './components/ReportsView';
import { ExpensesView } from './components/ExpensesView';
import { UsersView } from './components/UsersView';
import { SettingsView } from './components/SettingsView';
import {
  AddBillModal,
  AddPurchaseModal,
  AddFarmerModal,
  AddExpenseModal,
  StockEntryModal,
  InvoicePreviewModal
} from './components/Modals';

const STORAGE_KEY_PREFIX = 'kisan_billing_v1_';

export default function App() {
  // Navigation
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Language State (English / Hindi)
  const [lang, setLang] = useState<Language>('en');
  const t = translations[lang];

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'en' ? 'hi' : 'en'));
  };

  // Core State with localStorage fallback
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}transactions`);
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [farmers, setFarmers] = useState<Farmer[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}farmers`);
    return saved ? JSON.parse(saved) : INITIAL_FARMERS;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}products`);
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}expenses`);
    return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
  });

  const [staffUsers, setStaffUsers] = useState<StaffUser[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}staff`);
    return saved ? JSON.parse(saved) : INITIAL_STAFF_USERS;
  });

  const [businessProfile, setBusinessProfile] = useState<BusinessProfile>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}profile`);
    return saved ? JSON.parse(saved) : INITIAL_BUSINESS_PROFILE;
  });

  // Modal Visibility States
  const [isAddBillOpen, setIsAddBillOpen] = useState(false);
  const [isAddPurchaseOpen, setIsAddPurchaseOpen] = useState(false);
  const [isAddFarmerOpen, setIsAddFarmerOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isStockEntryOpen, setIsStockEntryOpen] = useState(false);
  const [activeInvoicePreview, setActiveInvoicePreview] = useState<Transaction | null>(null);
  const [selectedFarmerForLedger, setSelectedFarmerForLedger] = useState<Farmer | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}transactions`, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}farmers`, JSON.stringify(farmers));
  }, [farmers]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}products`, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}expenses`, JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}staff`, JSON.stringify(staffUsers));
  }, [staffUsers]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}profile`, JSON.stringify(businessProfile));
  }, [businessProfile]);

  // Handlers
  const handleAddTransaction = (newTx: Omit<Transaction, 'id' | 'invoiceNo'>) => {
    const nextInvoiceNo = `${businessProfile.invoicePrefix}-${(transactions.length + 143).toString().padStart(4, '0')}`;
    const tx: Transaction = {
      ...newTx,
      id: `tx-${Date.now()}`,
      invoiceNo: nextInvoiceNo
    };

    setTransactions((prev) => [tx, ...prev]);

    // Update Product Stock
    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.name.toLowerCase() === newTx.product.toLowerCase()) {
          const delta = newTx.type === 'Purchase' ? newTx.qtyKg : -newTx.qtyKg;
          const newStock = Math.max(0, prod.currentStockKg + delta);
          return {
            ...prod,
            currentStockKg: newStock,
            inKg: newTx.type === 'Purchase' ? prod.inKg + newTx.qtyKg : prod.inKg,
            outKg: newTx.type === 'Sale' ? prod.outKg + newTx.qtyKg : prod.outKg
          };
        }
        return prod;
      })
    );

    // Update or link Farmer balance if Due
    if (newTx.payment === 'Due') {
      setFarmers((prev) => {
        const found = prev.find((f) => f.name.toLowerCase() === newTx.name.toLowerCase());
        if (found) {
          return prev.map((f) =>
            f.id === found.id ? { ...f, balanceDue: f.balanceDue + newTx.amount } : f
          );
        } else {
          const newFarmer: Farmer = {
            id: `frm-${Date.now()}`,
            name: newTx.name,
            phone: '+91 98000 00000',
            village: 'Local Mandi',
            district: 'Haryana',
            type: newTx.type === 'Sale' ? 'Trader (Buyer)' : 'Farmer (Seller)',
            balanceDue: newTx.amount,
            totalVolumeKg: newTx.qtyKg,
            totalTransactionsCount: 1,
            lastActive: newTx.date
          };
          return [...prev, newFarmer];
        }
      });
    }

    // Auto open invoice preview for instant print
    setActiveInvoicePreview(tx);
  };

  const handleUpdateStock = (
    productId: string,
    type: 'in' | 'out' | 'audit',
    qtyKg: number
  ) => {
    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id === productId) {
          let updatedStock = prod.currentStockKg;
          let updatedIn = prod.inKg;
          let updatedOut = prod.outKg;

          if (type === 'in') {
            updatedStock += qtyKg;
            updatedIn += qtyKg;
          } else if (type === 'out') {
            updatedStock = Math.max(0, updatedStock - qtyKg);
            updatedOut += qtyKg;
          } else if (type === 'audit') {
            updatedStock = qtyKg;
          }

          return {
            ...prod,
            currentStockKg: updatedStock,
            inKg: updatedIn,
            outKg: updatedOut
          };
        }
        return prod;
      })
    );
  };

  const handleAddFarmer = (
    farmerData: Omit<Farmer, 'id' | 'totalVolumeKg' | 'totalTransactionsCount' | 'lastActive'>
  ) => {
    const newFarmer: Farmer = {
      ...farmerData,
      id: `frm-${Date.now()}`,
      totalVolumeKg: 0,
      totalTransactionsCount: 0,
      lastActive: 'Just registered'
    };
    setFarmers((prev) => [newFarmer, ...prev]);
  };

  const handleAddExpense = (expenseData: Omit<Expense, 'id'>) => {
    const newExp: Expense = {
      ...expenseData,
      id: `exp-${Date.now()}`
    };
    setExpenses((prev) => [newExp, ...prev]);
  };

  const handleSettleFarmerDue = (farmerId: string, amount: number) => {
    setFarmers((prev) =>
      prev.map((f) => {
        if (f.id === farmerId) {
          return {
            ...f,
            balanceDue: Math.max(0, f.balanceDue - amount)
          };
        }
        return f;
      })
    );
  };

  const handleTogglePaymentStatus = (txId: string, newStatus: 'Paid' | 'Due') => {
    setTransactions((prev) =>
      prev.map((tx) => (tx.id === txId ? { ...tx, payment: newStatus } : tx))
    );
  };

  const handleUpdateProductRate = (productId: string, newRate: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, standardRate: newRate } : p))
    );
  };

  const handleAddNewProduct = (newProd: Product) => {
    setProducts((prev) => [...prev, newProd]);
  };

  const handleAddStaffUser = (newUser: StaffUser) => {
    setStaffUsers((prev) => [...prev, newUser]);
  };

  const handleToggleUserStatus = (userId: string) => {
    setStaffUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' }
          : u
      )
    );
  };

  const handleResetDemoData = () => {
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}transactions`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}farmers`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}products`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}expenses`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}staff`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}profile`);

    setTransactions(INITIAL_TRANSACTIONS);
    setFarmers(INITIAL_FARMERS);
    setProducts(INITIAL_PRODUCTS);
    setExpenses(INITIAL_EXPENSES);
    setStaffUsers(INITIAL_STAFF_USERS);
    setBusinessProfile(INITIAL_BUSINESS_PROFILE);
    setCurrentTab('dashboard');
  };

  const handleExportAllData = () => {
    const data = {
      transactions,
      farmers,
      products,
      expenses,
      staffUsers,
      businessProfile,
      exportTimestamp: new Date().toISOString()
    };
    const jsonStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', jsonStr);
    dlAnchor.setAttribute('download', `kisan_billing_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
  };

  const handleImportAllData = (jsonStr: string) => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.transactions) setTransactions(parsed.transactions);
      if (parsed.farmers) setFarmers(parsed.farmers);
      if (parsed.products) setProducts(parsed.products);
      if (parsed.expenses) setExpenses(parsed.expenses);
      if (parsed.staffUsers) setStaffUsers(parsed.staffUsers);
      if (parsed.businessProfile) setBusinessProfile(parsed.businessProfile);
      alert('Data imported successfully!');
    } catch {
      alert('Invalid JSON file format. Please upload a valid Kisan backup file.');
    }
  };

  // Determine which subtab of Reports if applicable
  const isReportsTab = [
    'profit-loss',
    'stock-report',
    'daily-report',
    'monthly-report',
    'farmer-report'
  ].includes(currentTab);

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="flex flex-1 min-h-screen overflow-hidden">
        {/* Left Dark Forest Green Sidebar matching screenshot */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          isOpen={sidebarOpen}
          onCloseMobile={() => setSidebarOpen(false)}
          lang={lang}
          t={t}
        />

        {/* Right Main Content */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Top Header Nav */}
          <TopNav
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            onNavigate={(tab) => setCurrentTab(tab)}
            transactions={transactions}
            farmers={farmers}
            onSelectTransaction={(tx) => setActiveInvoicePreview(tx)}
            onSelectFarmer={(farmer) => {
              setSelectedFarmerForLedger(farmer);
              setCurrentTab('farmers');
            }}
            lang={lang}
            toggleLanguage={toggleLanguage}
            t={t}
          />

          {/* Main Canvas */}
          <main className="flex-1 p-4 sm:p-6 lg:p-7 max-w-7xl mx-auto w-full">
            {currentTab === 'dashboard' && (
              <DashboardView
                transactions={transactions}
                products={products}
                expenses={expenses}
                farmers={farmers}
                onOpenAddBill={() => setIsAddBillOpen(true)}
                onOpenAddPurchase={() => setIsAddPurchaseOpen(true)}
                onOpenAddFarmer={() => setIsAddFarmerOpen(true)}
                onOpenAddExpense={() => setIsAddExpenseOpen(true)}
                onOpenStockEntry={() => setIsStockEntryOpen(true)}
                onNavigateTab={(tab) => setCurrentTab(tab)}
                onViewInvoice={(tx) => setActiveInvoicePreview(tx)}
                lang={lang}
                t={t}
              />
            )}

            {currentTab === 'billing' && (
              <BillingView
                transactions={transactions}
                farmers={farmers}
                products={products}
                businessProfile={businessProfile}
                onAddTransaction={handleAddTransaction}
                onViewInvoice={(tx) => setActiveInvoicePreview(tx)}
                lang={lang}
                t={t}
              />
            )}

            {currentTab === 'sales' && (
              <SalesView
                transactions={transactions}
                onOpenAddBill={() => setIsAddBillOpen(true)}
                onViewInvoice={(tx) => setActiveInvoicePreview(tx)}
                onUpdatePaymentStatus={handleTogglePaymentStatus}
                lang={lang}
                t={t}
              />
            )}

            {currentTab === 'purchase' && (
              <PurchaseView
                transactions={transactions}
                onOpenAddPurchase={() => setIsAddPurchaseOpen(true)}
                onViewInvoice={(tx) => setActiveInvoicePreview(tx)}
                onUpdatePaymentStatus={handleTogglePaymentStatus}
                lang={lang}
                t={t}
              />
            )}

            {currentTab === 'farmers' && (
              <FarmersView
                farmers={farmers}
                transactions={transactions}
                onOpenAddFarmer={() => setIsAddFarmerOpen(true)}
                onSettleFarmerDue={handleSettleFarmerDue}
                selectedFarmerFromSearch={selectedFarmerForLedger}
                lang={lang}
                t={t}
              />
            )}

            {currentTab === 'products' && (
              <ProductsView
                products={products}
                onUpdateRate={handleUpdateProductRate}
                onAddNewProduct={handleAddNewProduct}
                lang={lang}
                t={t}
              />
            )}

            {currentTab === 'stock' && (
              <StockView
                products={products}
                transactions={transactions}
                onOpenStockEntry={() => setIsStockEntryOpen(true)}
                lang={lang}
                t={t}
              />
            )}

            {isReportsTab && (
              <ReportsView
                initialSubTab={currentTab as ReportSubTab}
                transactions={transactions}
                products={products}
                expenses={expenses}
                farmers={farmers}
                businessProfile={businessProfile}
                lang={lang}
                t={t}
              />
            )}

            {currentTab === 'expenses' && (
              <ExpensesView
                expenses={expenses}
                onOpenAddExpense={() => setIsAddExpenseOpen(true)}
                lang={lang}
                t={t}
              />
            )}

            {currentTab === 'users' && (
              <UsersView
                users={staffUsers}
                onAddUser={handleAddStaffUser}
                onToggleUserStatus={handleToggleUserStatus}
                lang={lang}
                t={t}
              />
            )}

            {currentTab === 'settings' && (
              <SettingsView
                businessProfile={businessProfile}
                onUpdateProfile={setBusinessProfile}
                onResetDemoData={handleResetDemoData}
                onExportAllData={handleExportAllData}
                onImportAllData={handleImportAllData}
                lang={lang}
                t={t}
              />
            )}
          </main>
        </div>
      </div>

      {/* Interactive Global Modals */}
      <AddBillModal
        isOpen={isAddBillOpen}
        onClose={() => setIsAddBillOpen(false)}
        farmers={farmers}
        products={products}
        onAddTransaction={handleAddTransaction}
        onOpenInvoicePreview={(tx) => setActiveInvoicePreview(tx)}
      />

      <AddPurchaseModal
        isOpen={isAddPurchaseOpen}
        onClose={() => setIsAddPurchaseOpen(false)}
        farmers={farmers}
        products={products}
        onAddTransaction={handleAddTransaction}
      />

      <AddFarmerModal
        isOpen={isAddFarmerOpen}
        onClose={() => setIsAddFarmerOpen(false)}
        onAddFarmer={handleAddFarmer}
      />

      <AddExpenseModal
        isOpen={isAddExpenseOpen}
        onClose={() => setIsAddExpenseOpen(false)}
        onAddExpense={handleAddExpense}
      />

      <StockEntryModal
        isOpen={isStockEntryOpen}
        onClose={() => setIsStockEntryOpen(false)}
        products={products}
        onUpdateStock={handleUpdateStock}
      />

      <InvoicePreviewModal
        transaction={activeInvoicePreview}
        businessProfile={businessProfile}
        onClose={() => setActiveInvoicePreview(null)}
      />
    </div>
  );
}