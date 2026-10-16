import React, { useState } from 'react';
import {
  UserCog,
  Plus,
  Shield,
  Mail,
  Phone,
  CheckCircle,
  XCircle,
  X,
  UserCheck
} from 'lucide-react';
import { StaffUser } from '../types';

interface UsersViewProps {
  users: StaffUser[];
  onAddUser: (user: StaffUser) => void;
  onToggleUserStatus: (userId: string) => void;
}

export const UsersView: React.FC<UsersViewProps> = ({
  users,
  onAddUser,
  onToggleUserStatus
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState<StaffUser['role']>('Weighbridge Operator');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newUser: StaffUser = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      role,
      email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '')}@kisanmandi.in`,
      phone: phone.trim() || '+91 98111 00000',
      status: 'Active',
      lastLogin: 'Never'
    };

    onAddUser(newUser);
    setShowAddModal(false);
    setName('');
    setEmail('');
    setPhone('');
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <UserCog className="w-5 h-5 text-indigo-600" />
            Mandi Staff, Operators & Role Permissions
          </h2>
          <p className="text-xs text-slate-500">
            Control terminal access for Weighbridge operators, Munim accountants, and Admin owners
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg flex items-center gap-2 shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          + Add Staff Account
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#fcfdfd] text-slate-400 font-semibold border-b border-slate-100 text-[11px]">
              <tr>
                <th className="py-3 px-4">Staff Name</th>
                <th className="py-3 px-4">Assigned Role</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Last Activity</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Toggle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[12px]">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">{u.name}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        u.role === 'Owner' || u.role === 'Admin'
                          ? 'bg-purple-100 text-purple-800'
                          : u.role === 'Accountant'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{u.email}</td>
                  <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">{u.phone}</td>
                  <td className="py-3 px-4 text-slate-400 text-[11px]">{u.lastLogin}</td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        u.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {u.status === 'Active' ? (
                        <CheckCircle className="w-3 h-3 text-emerald-500" />
                      ) : (
                        <XCircle className="w-3 h-3 text-rose-500" />
                      )}
                      {u.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {u.role !== 'Owner' ? (
                      <button
                        onClick={() => onToggleUserStatus(u.id)}
                        className="text-[11px] font-medium text-slate-600 hover:text-indigo-600 hover:underline"
                      >
                        {u.status === 'Active' ? 'Deactivate' : 'Activate'}
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-400">Primary</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100">
            <div className="flex items-center justify-between px-6 py-4 bg-indigo-600 text-white">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Add Mandi Staff / Operator
              </h3>
              <button onClick={() => setShowAddModal(false)} className="hover:opacity-80">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateUser} className="p-6 space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Gurdeep Singh"
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Role & Responsibility</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                >
                  <option value="Weighbridge Operator">Weighbridge Operator (Scale & Parchi)</option>
                  <option value="Accountant">Accountant / Munim (Ledger & Cashier)</option>
                  <option value="Admin">Admin (Full System Controls)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mobile</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98111..."
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="operator@kisanmandi.in"
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
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
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow-sm transition-colors"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
