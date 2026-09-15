import React, { useState } from 'react';
import { Users, UserPlus, ShieldCheck, Search, Check, Smartphone, MessageSquare, Globe, Mail, Building2, Download, Eye, Edit2, Trash2, Shield, Filter, ChevronLeft, ChevronRight, X, AlertTriangle, RefreshCw, Lock, Clock, MapPin, Laptop } from 'lucide-react';
import InputField from '@/components/InputField';
import Button from '@/components/Button';
import ToastContainer, { type ToastMessage } from '@/components/Toast';
import { apiClient } from '@/api/apiClient';

export default function UserManagement() {
  const [activeTab, setActiveTab] = useState<'whatsapp' | 'messenger' | 'sms' | 'email' | 'web'>('whatsapp');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [userToDelete, setUserToDelete] = useState<any | null>(null);
  const [selectedUserView, setSelectedUserView] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Toasts State
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
  };
  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Form State
  const [fullName, setFullName] = useState('Jane A. Doe');
  const [orgName, setOrgName] = useState('Acme Corp');
  const [phone, setPhone] = useState('+94 77 123 4567');
  const [email, setEmail] = useState('jane@acme.com');
  const [azureId, setAzureId] = useState('52a1e-7b5c-43f1-a1b9-8c9dfa41209e');
  const [azureVerified, setAzureVerified] = useState(true);

  // User Details Profile Edit State (for selectedUserView)
  const [profilePhone, setProfilePhone] = useState('+94 73 5634 567');
  const [permissions, setPermissions] = useState({
    profile: true,
    analytics: true,
    channel: true,
    deletion: true,
    azureAuth: true,
  });
  const [selectedRole, setSelectedRole] = useState<'employee' | 'customer'>('customer');

  // Users Data Map by Channel
  const [usersByChannel, setUsersByChannel] = useState({
    whatsapp: [
      { id: '1', initials: 'ID', name: 'Isuru Dissanayake', email: 'arjuna.s@slt.com.lk', empId: 'SLT-99234', role: 'External Customer', status: 'ACTIVE', lastLogin: '2 hours ago', location: 'Colombo' },
      { id: '2', initials: 'KP', name: 'Kasun Perera', email: 'kasun.p@coorp.lk', empId: 'SLT-99235', role: 'External Customer', status: 'ACTIVE', lastLogin: 'Yesterday, 14:20', location: 'Kandy' },
      { id: '3', initials: 'NM', name: 'Nimal Mendis', email: 'nimal.m@partner.lk', empId: 'SLT-99236', role: 'External Customer', status: 'DEACTIVATED', lastLogin: '12 Days ago', location: 'Galle' },
    ],
    messenger: [
      { id: '4', initials: 'TM', name: 'Theekshana Mendis', email: 'theekshanamendis@slt.lk', empId: 'SLT-99237', role: 'External Customer', status: 'ACTIVE', lastLogin: '2 hours ago', location: 'Colombo' },
      { id: '5', initials: 'KA', name: 'Kasun Adikari', email: 'kasun.a@coorp.lk', empId: 'SLT-99238', role: 'External Customer', status: 'DEACTIVATED', lastLogin: '12 Days ago', location: 'Kurunegala' },
      { id: '6', initials: 'NM', name: 'Nimal Mahanama', email: 'nimal.m@partner.lk', empId: 'SLT-99239', role: 'External Customer', status: 'ACTIVE', lastLogin: 'Yesterday, 14:20', location: 'Negombo' },
    ],
    sms: [
      { id: '7', initials: 'NR', name: 'Nadun Randeera', email: 'nadunrandeera@gmail.com', empId: 'SLT-99240', role: 'External Customer', status: 'DEACTIVATED', lastLogin: 'Yesterday, 14:20', location: 'Colombo' },
      { id: '8', initials: 'UD', name: 'Upul Dinusha', email: 'upuldinusha@coorp.lk', empId: 'SLT-99241', role: 'External Customer', status: 'ACTIVE', lastLogin: '12 Days ago', location: 'Matara' },
      { id: '9', initials: 'KS', name: 'Kanishka Sampath', email: 'nimal.m@partner.lk', empId: 'SLT-99242', role: 'External Customer', status: 'ACTIVE', lastLogin: '2 hours ago', location: 'Gampaha' },
    ],
    email: [
      { id: '10', initials: 'SM', name: 'Sanduni Madushika', email: 'sandunimadushika343@gmail.com', empId: 'SLT-99243', role: 'External Customer', status: 'DEACTIVATED', lastLogin: 'Yesterday, 14:20', location: 'Colombo' },
      { id: '11', initials: 'UD', name: 'Upul Dinusha', email: 'upuldinusha@coorp.lk', empId: 'SLT-99244', role: 'External Customer', status: 'ACTIVE', lastLogin: '12 Days ago', location: 'Kandy' },
      { id: '12', initials: 'KS', name: 'Kanishka Sampath', email: 'nimal.m@partner.lk', empId: 'SLT-99245', role: 'External Customer', status: 'ACTIVE', lastLogin: '2 hours ago', location: 'Colombo' },
    ],
    web: [
      { id: '13', initials: 'DS', name: 'Dasun Shanaka', email: 'dasunshanaka@gmail.com', empId: 'SLT-99246', role: 'External Customer', status: 'DEACTIVATED', lastLogin: 'Yesterday, 14:20', location: 'Colombo' },
      { id: '14', initials: 'UD', name: 'Upul Dinusha', email: 'upuldinusha@coorp.lk', empId: 'SLT-99247', role: 'External Customer', status: 'ACTIVE', lastLogin: '12 Days ago', location: 'Jaffna' },
      { id: '15', initials: 'KS', name: 'Kanishka Sampath', email: 'nimal.m@partner.lk', empId: 'SLT-99248', role: 'External Customer', status: 'ACTIVE', lastLogin: '2 hours ago', location: 'Colombo' },
    ],
  });

  const channelStats = {
    whatsapp: { total: '1,248', active: '42', approval: '14h' },
    messenger: { total: '976', active: '38', approval: '12h' },
    sms: { total: '865', active: '26', approval: '10h' },
    email: { total: '865', active: '26', approval: '10h' },
    web: { total: '865', active: '26', approval: '10h' },
  };

  const currentUsers = usersByChannel[activeTab].filter(
    (u) => u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteConfirm = () => {
    if (userToDelete) {
      setUsersByChannel({
        ...usersByChannel,
        [activeTab]: usersByChannel[activeTab].filter((u) => u.id !== userToDelete.id),
      });
      setUserToDelete(null);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* If a User Profile Details view is open (Matching Images 2, 3, 4) */}
      {selectedUserView ? (
        <div className="space-y-6">
          
          {/* Top Actions Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
            <button
              onClick={() => setSelectedUserView(null)}
              className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to User Directory</span>
            </button>

            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => {
                  setUserToDelete(selectedUserView);
                }}
                className="px-4 py-2 rounded-xl border border-red-300 text-red-600 hover:bg-red-50 text-xs font-bold transition-colors"
              >
                Remove User
              </button>

              <button
                onClick={() => addToast('Password reset email sent to user.', 'info')}
                className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-xs cursor-pointer"
              >
                Reset Access
              </button>

              <button
                onClick={() => addToast('User account deactivated.', 'info')}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md cursor-pointer"
              >
                Deactivate User
              </button>
            </div>
          </div>

          {/* User Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Card: Profile & Metadata */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Main Profile Card */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-slate-900 text-cyan-400 text-xl font-black flex items-center justify-center border-2 border-indigo-500 shadow-md">
                      {selectedUserView.initials}
                    </div>
                    <span className="w-4 h-4 rounded-full bg-emerald-500 border-2 border-white absolute bottom-0 right-0" />
                  </div>

                  <div>
                    <h2 className="text-xl font-black text-slate-900">{selectedUserView.name}</h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold">
                      {selectedUserView.role}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs pt-4 border-t border-slate-100">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Employee ID</span>
                    <span className="font-mono font-bold text-slate-800">{selectedUserView.empId}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Email</span>
                    <span className="font-bold text-slate-800 truncate block">{selectedUserView.email}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Azure Sync</span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold inline-block">
                      Active (1min ago)
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Location</span>
                    <span className="font-bold text-slate-800">{selectedUserView.location}</span>
                  </div>
                </div>
              </div>

              {/* Login History */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">Login History</h3>
                  <button className="text-xs font-bold text-indigo-600 hover:underline">Export Log Report</button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                        <th className="pb-2">DATE & TIME</th>
                        <th className="pb-2">LOCATION</th>
                        <th className="pb-2">DEVICE ID</th>
                        <th className="pb-2 text-right">STATUS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      <tr>
                        <td className="py-2.5">2023-11-24 10:42:02 AM</td>
                        <td className="py-2.5">Colombo, SL</td>
                        <td className="py-2.5 font-mono text-[11px] text-slate-400">UR-FR-02-MAC-XX</td>
                        <td className="py-2.5 text-right font-bold text-emerald-600">Success</td>
                      </tr>
                      <tr>
                        <td className="py-2.5">2023-11-23 09:12:00 PM</td>
                        <td className="py-2.5">Kandy, SL</td>
                        <td className="py-2.5 font-mono text-[11px] text-slate-400">UR-FR-02-WIN-XX</td>
                        <td className="py-2.5 text-right font-bold text-emerald-600">Success</td>
                      </tr>
                      <tr>
                        <td className="py-2.5">2023-11-22 03:33:10 AM</td>
                        <td className="py-2.5 text-red-600">Unrecognized</td>
                        <td className="py-2.5 font-mono text-[11px] text-slate-400">UR-FR-02-UNK-XX</td>
                        <td className="py-2.5 text-right font-bold text-red-600">Blocked</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <button className="text-xs font-bold text-slate-500 hover:text-slate-800 block text-center w-full pt-2">
                  View All Logs
                </button>
              </div>

            </div>

            {/* Right Card: Azure Sync, Permissions, Roles */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Account Metadata & Azure Sync Management */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
                  <span className="text-[10px] font-bold uppercase text-slate-400">ACCOUNT METADATA</span>
                  <div className="text-xs text-slate-700">
                    <p><span className="text-slate-400">Created On:</span> Oct 12, 2021</p>
                    <p><span className="text-slate-400">Last Password Change:</span> 14 days ago</p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-5 rounded-3xl border border-indigo-100 shadow-sm space-y-2">
                  <span className="text-[10px] font-bold uppercase text-indigo-900">Azure Sync Management</span>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs font-bold text-slate-800">Azure Auth</span>
                    <input
                      type="checkbox"
                      checked={permissions.azureAuth}
                      onChange={(e) => setPermissions({ ...permissions, azureAuth: e.target.checked })}
                      className="w-4 h-4 text-indigo-600 rounded"
                    />
                  </div>
                </div>
              </div>

              {/* Permissions List */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900">Permissions</h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Profile Settings</span>
                      <span className="text-[10px] text-slate-400">Create and delete system tokens</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={permissions.profile}
                      onChange={(e) => setPermissions({ ...permissions, profile: e.target.checked })}
                      className="w-4 h-4 text-indigo-600 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">View Analytics</span>
                      <span className="text-[10px] text-slate-400">Access usage data dashboards</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={permissions.analytics}
                      onChange={(e) => setPermissions({ ...permissions, analytics: e.target.checked })}
                      className="w-4 h-4 text-indigo-600 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Configure {activeTab.toUpperCase()} Channel</span>
                      <span className="text-[10px] text-slate-400">Edit routing and load balancing</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={permissions.channel}
                      onChange={(e) => setPermissions({ ...permissions, channel: e.target.checked })}
                      className="w-4 h-4 text-indigo-600 rounded"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <label className="text-xs font-bold text-slate-700 block mb-1">Connected Contact Phone</label>
                  <input
                    type="text"
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-indigo-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Roles Management & Session Actions */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900">Roles Management</h3>

                <div className="grid grid-cols-2 gap-3">
                  <label
                    onClick={() => setSelectedRole('employee')}
                    className={`p-3 rounded-2xl border text-xs font-bold cursor-pointer transition-all ${
                      selectedRole === 'employee' ? 'bg-indigo-50 border-indigo-500 text-indigo-900' : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    <span className="block font-bold">Internal Employee User</span>
                    <span className="text-[10px] font-normal text-slate-400">Network controls</span>
                  </label>

                  <label
                    onClick={() => setSelectedRole('customer')}
                    className={`p-3 rounded-2xl border text-xs font-bold cursor-pointer transition-all ${
                      selectedRole === 'customer' ? 'bg-indigo-50 border-indigo-500 text-indigo-900' : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    <span className="block font-bold">External Customer User</span>
                    <span className="text-[10px] font-normal text-slate-400">View-only analytics</span>
                  </label>
                </div>

                <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => addToast('Active user session terminated.', 'info')}
                    className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-xs shadow-md cursor-pointer"
                  >
                    Session Terminate This User
                  </button>

                  <button
                    type="button"
                    onClick={() => addToast('User Changes Saved Successfully!', 'success')}
                    className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md cursor-pointer"
                  >
                    Update Changes
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>
      ) : (
        /* Regular Directory Table View */
        <div className="space-y-6">
          
          {/* Top Header & Export Action */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">User Management</h1>
              <p className="text-xs text-slate-500 mt-0.5">Manage customer profiles, details, and interactions from one centralized workspace.</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => addToast('Exporting user directory report...', 'info')}
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4 text-indigo-600" />
                <span>Export List Report</span>
              </button>
            </div>
          </div>

          {/* Channel Switcher Tabs */}
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
            {(['whatsapp', 'messenger', 'sms', 'email', 'web'] as const).map((ch) => {
              const active = activeTab === ch;
              return (
                <button
                  key={ch}
                  onClick={() => setActiveTab(ch)}
                  className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all capitalize ${
                    active
                      ? 'bg-emerald-500 text-white shadow-md'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {ch} Users
                </button>
              );
            })}
          </div>

          {/* Registration Requests Pill (for Messenger/SMS/Email tabs) */}
          {(activeTab === 'messenger' || activeTab === 'sms' || activeTab === 'email' || activeTab === 'web') && (
            <div className="p-3 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-ping" />
              <span className="text-xs font-bold text-indigo-900">Registration Requests</span>
              <span className="px-2 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-black">12</span>
            </div>
          )}

          {/* Create User Toggle Bar */}
          <div className="flex items-center justify-between">
            <div className="px-4 py-2 rounded-2xl bg-emerald-100 text-emerald-900 text-xs font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              <span>Active Users ({currentUsers.length})</span>
            </div>

            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>{showCreateForm ? 'Close Form' : 'Invite Live Agent'}</span>
            </button>
          </div>

          {/* Create / Invite Live Agent Form Card */}
          {showCreateForm && (
            <div className="bg-white p-6 rounded-3xl border border-indigo-200 shadow-lg space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900">Invite New Live Agent (`POST /tenants/agents/invite`)</h3>
                <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[10px] font-bold">Cognito Group: live_agent</span>
              </div>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    await apiClient.post('/tenants/agents/invite', {
                      fullName,
                      email,
                      phone,
                      role: 'live_agent',
                    });
                    addToast(`Live agent ${fullName} invited successfully!`, 'success');
                  } catch (err: any) {
                    addToast(`Invited ${fullName} (Mock response fallback)`, 'success');
                  }
                  setShowCreateForm(false);
                }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs"
              >
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Work Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Assigned Role</label>
                  <input
                    type="text"
                    value="live_agent"
                    disabled
                    className="w-full px-3.5 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-purple-700"
                  />
                </div>

                <div className="sm:col-span-2 flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-md"
                  >
                    Send Invitation
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Directory Table */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative flex-1 w-full max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Filter by name, email or role..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <select className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none">
                  <option>All Roles</option>
                  <option>External Customer</option>
                  <option>Admin</option>
                </select>

                <button className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5" />
                  <span>More Filters</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-indigo-50/70 border-y border-indigo-100 text-indigo-900 font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">User Identity</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Last Login</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {currentUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-2xl bg-indigo-100 text-indigo-700 font-black flex items-center justify-center text-xs shrink-0 shadow-xs">
                            {u.initials}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block">{u.name}</span>
                            <span className="text-[11px] text-slate-400">{u.email}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 font-semibold text-slate-600">{u.role}</td>

                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 w-fit ${
                          u.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                          {u.status}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-slate-500 font-normal">{u.lastLogin}</td>

                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedUserView(u)}
                            className="p-2 rounded-xl text-blue-600 hover:bg-blue-50 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => setSelectedUserView(u)}
                            className="p-2 rounded-xl text-indigo-600 hover:bg-indigo-50 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => setUserToDelete(u)}
                            className="p-2 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs text-slate-500">
              <span>Showing 1-3 of {channelStats[activeTab].total} active users</span>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50">
                  <ChevronLeft className="w-4 h-4 text-slate-600" />
                </button>
                <button className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50">
                  <ChevronRight className="w-4 h-4 text-slate-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">TOTAL USERS</span>
              <div className="flex items-baseline justify-between">
                <h2 className="text-2xl font-black text-slate-900">{channelStats[activeTab].total}</h2>
                <span className="text-xs font-bold text-emerald-600">+12%</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">ACTIVE NOW</span>
              <div className="flex items-baseline justify-between">
                <h2 className="text-2xl font-black text-slate-900">{channelStats[activeTab].active}</h2>
                <span className="text-xs font-semibold text-slate-400">On duty</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">AVG. APPROVAL TIME</span>
              <div className="flex items-baseline justify-between">
                <h2 className="text-2xl font-black text-slate-900">{channelStats[activeTab].approval}</h2>
                <span className="text-xs font-semibold text-emerald-600">-2h trend</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">SECURITY HEALTH</span>
                <h2 className="text-lg font-black text-emerald-600">Optimal</h2>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600">
                <Shield className="w-6 h-6" />
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Delete User Modal */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-slate-200 shadow-2xl text-center space-y-6 relative overflow-hidden">
            <div className="w-20 h-20 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto ring-8 ring-red-50">
              <Trash2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">DELETE USER</h3>
              <p className="text-xs text-slate-500 font-medium max-w-xs mx-auto">
                Do you really want to delete this user <span className="font-bold text-slate-800">({userToDelete.name})</span>? This process can not be undone.
              </p>
            </div>

            <div className="flex items-center justify-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                className="px-8 py-3 rounded-xl border border-red-300 text-red-600 font-bold text-xs hover:bg-red-50 transition-colors"
              >
                CANCEL
              </button>

              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="px-8 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition-all"
              >
                DELETE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Render Toast Notifications */}
      <ToastContainer toasts={toasts} onClose={removeToast} />

    </div>
  );
}
