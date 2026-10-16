import React, { useState } from 'react';
import {
  Settings,
  Save,
  RotateCcw,
  Download,
  Upload,
  CheckCircle2,
  Building,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { BusinessProfile } from '../types';

interface SettingsViewProps {
  businessProfile: BusinessProfile;
  onUpdateProfile: (updated: BusinessProfile) => void;
  onResetDemoData: () => void;
  onExportAllData: () => void;
  onImportAllData: (jsonData: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  businessProfile,
  onUpdateProfile,
  onResetDemoData,
  onExportAllData,
  onImportAllData
}) => {
  const [profile, setProfile] = useState<BusinessProfile>(businessProfile);
  const [savedMsg, setSavedMsg] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(profile);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        onImportAllData(content);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Settings className="w-5 h-5 text-slate-700" />
            Mandi Trade & System Settings
          </h2>
          <p className="text-xs text-slate-500">
            Configure APMC mandi license, GSTIN, invoice numbering prefix, and database backups
          </p>
        </div>
        {savedMsg && (
          <div className="px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold flex items-center gap-1.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Settings saved successfully!
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Form (col-span-8) */}
        <div className="lg:col-span-8 bg-white rounded-xl shadow-xs border border-slate-100 p-6">
          <h3 className="font-bold text-slate-800 text-sm mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Building className="w-4 h-4 text-slate-500" />
            Mandi Arthiya & Firm Profile
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Firm / Shop Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={profile.businessName}
                  onChange={(e) => setProfile({ ...profile, businessName: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tagline / Subtitle</label>
                <input
                  type="text"
                  value={profile.tagline}
                  onChange={(e) => setProfile({ ...profile, tagline: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  APMC Mandi License No. <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={profile.licenseNo}
                  onChange={(e) => setProfile({ ...profile, licenseNo: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">GSTIN Number</label>
                <input
                  type="text"
                  value={profile.gstin}
                  onChange={(e) => setProfile({ ...profile, gstin: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Mandi Shop Physical Address</label>
              <input
                type="text"
                value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={profile.contactPhone}
                  onChange={(e) => setProfile({ ...profile, contactPhone: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Invoice Prefix</label>
                <input
                  type="text"
                  value={profile.invoicePrefix}
                  onChange={(e) => setProfile({ ...profile, invoicePrefix: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-sm transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Business Profile
              </button>
            </div>
          </form>
        </div>

        {/* Database & Backup Card (col-span-4) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-xl shadow-xs border border-slate-100 p-5">
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-3">
              Data Backup & Portability
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Export all transactions, farmers ledger, and products to a JSON file or restore from a previous backup.
            </p>

            <div className="space-y-3">
              <button
                onClick={onExportAllData}
                className="w-full py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 shadow-2xs transition-colors"
              >
                <Download className="w-4 h-4" />
                Backup / Download Database JSON
              </button>

              <label className="w-full py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-colors border border-slate-200">
                <Upload className="w-4 h-4" />
                Restore from JSON File
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Reset Demo Data Card */}
          <div className="bg-rose-50/60 rounded-xl border border-rose-200/80 p-5">
            <h3 className="font-bold text-rose-900 text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
              Reset Reference Data
            </h3>
            <p className="text-xs text-rose-700 mb-4">
              Restore the exact numbers from the reference screenshot (7,500 kg Stock, ₹ 4,50,000 Sales, ₹ 3,80,000 Purchase, ₹ 70,000 Profit).
            </p>
            <button
              onClick={() => {
                if (confirm('Are you sure you want to restore original benchmark data?')) {
                  onResetDemoData();
                }
              }}
              className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg shadow-2xs transition-colors"
            >
              Reset to Screenshot Benchmark
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
