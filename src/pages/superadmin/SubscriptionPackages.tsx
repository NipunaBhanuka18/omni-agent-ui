import React, { useState } from 'react';
import { CreditCard, DollarSign, Package, Check, Save, Download } from 'lucide-react';
import InputField from '@/components/InputField';
import Button from '@/components/Button';

import ToastContainer, { type ToastMessage } from '@/components/Toast';

export default function SubscriptionPackages() {
  const [activeTab, setActiveTab] = useState<'payments' | 'config'>('payments');

  // Toasts state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
  };
  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Transactions State
  const [transactions] = useState([
    { id: '1', companyName: 'Oceanview Logistics', packageName: 'Enterprise Plan', txnId: 'TXN-98114', amount: 'Rs.49,950.00 LKR', status: 'Completed', paymentDate: 'Sep 01, 2023 09:30 AM', expiryDate: 'Sep 01, 2024 09:30 AM' },
    { id: '2', companyName: 'Lanka SuperMarket', packageName: 'Enterprise Plan', txnId: 'TXN-98112', amount: 'Rs.49,950.00 LKR', status: 'Completed', paymentDate: 'Sep 01, 2023 08:30 AM', expiryDate: 'Sep 01, 2024 08:30 AM' },
    { id: '3', companyName: 'Chamaka Hardware Supplies', packageName: 'Enterprise Plan', txnId: 'TXN-98110', amount: 'Rs.49,950.00 LKR', status: 'Completed', paymentDate: 'Aug 31, 2023 05:00 PM', expiryDate: 'Aug 31, 2024 05:00 PM' },
  ]);

  // Packages Config Form State
  const [tierConfigs, setTierConfigs] = useState({
    freeTrial: { name: 'Free Trial', price: '0', channels: '5', messages: '100', agents: '1', customers: '50', kb: '1' },
    starter: { name: 'Starter', price: '4990', channels: '5', messages: '5000', agents: '3', customers: '500', kb: '5' },
    business: { name: 'Business', price: '19950', channels: '5', messages: '25000', agents: '10', customers: '5000', kb: '20' },
    enterprise: { name: 'Enterprise', price: '49950', channels: '5', messages: '100000', agents: '50', customers: '50000', kb: '100' },
  });

  const handleSaveConfigs = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('Subscription Package Configurations Saved Successfully!', 'success');
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Subscription Package</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage and Configure Subscription plans and Payments of Customer.</p>
        </div>

        {/* Tab Switcher Pills */}
        <div className="p-1.5 bg-slate-100 rounded-2xl border border-slate-200 flex items-center gap-2">
          <button
            onClick={() => setActiveTab('payments')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'payments'
                ? 'bg-cyan-500 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Payment Details
          </button>
          <button
            onClick={() => setActiveTab('config')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'config'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Subscription Package
          </button>
        </div>
      </div>

      {/* 1. Payment Details Tab (Matching Image 3 Right) */}
      {activeTab === 'payments' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-purple-900 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-purple-600" />
              <span>Payment Details ({transactions.length} transactions)</span>
            </h3>
            <button
              onClick={() => addToast('Exporting Payment Audit Records...', 'info')}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Audit</span>
            </button>
          </div>

          {/* Payment Transactions Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-purple-900 text-white font-bold uppercase tracking-wider">
                  <th className="py-3 px-4 rounded-l-xl">COMPANY NAME</th>
                  <th className="py-3 px-4">PACKAGE NAME</th>
                  <th className="py-3 px-4">TRANSACTION ID</th>
                  <th className="py-3 px-4">AMOUNT</th>
                  <th className="py-3 px-4">STATUS</th>
                  <th className="py-3 px-4">PAYMENT DATE</th>
                  <th className="py-3 px-4 rounded-r-xl">EXPIRY DATE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {transactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-slate-50">
                    <td className="py-4 px-4 font-bold text-slate-900">{txn.companyName}</td>
                    <td className="py-4 px-4 font-semibold text-purple-700">{txn.packageName}</td>
                    <td className="py-4 px-4 font-mono text-slate-500">{txn.txnId}</td>
                    <td className="py-4 px-4 font-bold text-emerald-600">{txn.amount}</td>
                    <td className="py-4 px-4">
                      <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        {txn.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-500 font-mono">{txn.paymentDate}</td>
                    <td className="py-4 px-4 text-slate-500 font-mono">{txn.expiryDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. Subscription Package Configuration Tab (Matching Image 4) */}
      {activeTab === 'config' && (
        <form onSubmit={handleSaveConfigs} className="space-y-6">
          
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-black text-purple-900 mb-1">Subscription Package Configuration</h3>
            <p className="text-xs text-slate-500">Configure Features, Pricing, and Resources allocated to customer groups across the platform.</p>
          </div>

          <div className="space-y-6">
            
            {/* Free Trial Tier Card */}
            <div className="bg-purple-50/70 p-6 rounded-3xl border border-purple-200 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-black text-purple-900">Free Trial</h4>
                <label className="flex items-center gap-2 text-xs font-bold text-purple-800 cursor-pointer">
                  <input type="checkbox" className="rounded text-purple-600" />
                  <span>Most Popular</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField
                  label="Display Name"
                  value={tierConfigs.freeTrial.name}
                  onChange={(e) => setTierConfigs({ ...tierConfigs, freeTrial: { ...tierConfigs.freeTrial, name: e.target.value } })}
                />
                <InputField
                  label="Monthly Price (LKR)"
                  value={tierConfigs.freeTrial.price}
                  onChange={(e) => setTierConfigs({ ...tierConfigs, freeTrial: { ...tierConfigs.freeTrial, price: e.target.value } })}
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <InputField label="Channels" value={tierConfigs.freeTrial.channels} />
                <InputField label="Monthly Messages" value={tierConfigs.freeTrial.messages} />
                <InputField label="Agents" value={tierConfigs.freeTrial.agents} />
                <InputField label="Customers" value={tierConfigs.freeTrial.customers} />
                <InputField label="Knowledge Base" value={tierConfigs.freeTrial.kb} />
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="px-3 py-1 rounded-full bg-white border border-purple-200 text-purple-700 text-xs font-bold">✓ Include API</span>
                <span className="px-3 py-1 rounded-full bg-white border border-purple-200 text-purple-700 text-xs font-bold">✓ Live Chat</span>
                <span className="px-3 py-1 rounded-full bg-white border border-purple-200 text-purple-700 text-xs font-bold">✓ Webhook</span>
              </div>
            </div>

            {/* Starter Tier Card */}
            <div className="bg-purple-50/70 p-6 rounded-3xl border border-purple-200 space-y-4 shadow-sm">
              <h4 className="text-sm font-black text-purple-900">Starter</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField label="Display Name" value={tierConfigs.starter.name} />
                <InputField label="Monthly Price (LKR)" value={tierConfigs.starter.price} />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <InputField label="Channels" value={tierConfigs.starter.channels} />
                <InputField label="Monthly Messages" value={tierConfigs.starter.messages} />
                <InputField label="Agents" value={tierConfigs.starter.agents} />
              </div>
            </div>

            {/* Business Tier Card */}
            <div className="bg-purple-50/70 p-6 rounded-3xl border border-purple-200 space-y-4 shadow-sm">
              <h4 className="text-sm font-black text-purple-900">Business</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField label="Display Name" value={tierConfigs.business.name} />
                <InputField label="Monthly Price (LKR)" value={tierConfigs.business.price} />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <InputField label="Channels" value={tierConfigs.business.channels} />
                <InputField label="Monthly Messages" value={tierConfigs.business.messages} />
                <InputField label="Agents" value={tierConfigs.business.agents} />
              </div>
            </div>

            {/* Enterprise Tier Card */}
            <div className="bg-purple-50/70 p-6 rounded-3xl border border-purple-200 space-y-4 shadow-sm">
              <h4 className="text-sm font-black text-purple-900">Enterprise</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField label="Display Name" value={tierConfigs.enterprise.name} />
                <InputField label="Monthly Price (LKR)" value={tierConfigs.enterprise.price} />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <InputField label="Channels" value={tierConfigs.enterprise.channels} />
                <InputField label="Monthly Messages" value={tierConfigs.enterprise.messages} />
                <InputField label="Agents" value={tierConfigs.enterprise.agents} />
              </div>
            </div>

          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="px-8 py-3 rounded-2xl bg-purple-900 hover:bg-purple-950 text-white font-black text-xs shadow-xl transition-all"
            >
              Save Package Configurations
            </button>
          </div>

        </form>
      )}

      {/* Render Toast Notifications */}
      <ToastContainer toasts={toasts} onClose={removeToast} />

    </div>
  );
}
