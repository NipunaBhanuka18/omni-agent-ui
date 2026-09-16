import React, { useState } from 'react';
import { MessageSquare, Smartphone, Globe, Mail, CheckCircle2, AlertTriangle, RefreshCw, Settings, ChevronRight, Power, ArrowLeft, ShieldCheck, BarChart2 } from 'lucide-react';
import InputField from '@/components/InputField';
import Button from '@/components/Button';

import ToastContainer, { type ToastMessage } from '@/components/Toast';

export default function Channels() {
  const [selectedOrg, setSelectedOrg] = useState<string | null>('ABC Company (pvt) Ltd');
  const [selectedChannel, setSelectedChannel] = useState<string | null>('whatsapp');
  const [channelEnabled, setChannelEnabled] = useState(true);

  // Toasts State
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
  };
  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Form State for WhatsApp Config
  const [accountSid, setAccountSid] = useState('AC77892X00884L1299843-SLT');
  const [webhookUrl, setWebhookUrl] = useState('https://your-domain.com/callback');
  const [authToken, setAuthToken] = useState('••••••••••••••••••••');
  const [autoReplyEnabled, setAutoReplyEnabled] = useState(true);
  const [aiHandoffThreshold, setAiHandoffThreshold] = useState('85%');
  const [offlineMessagingEnabled, setOfflineMessagingEnabled] = useState(false);

  const [organizations, setOrganizations] = useState<any[]>([]);

  React.useEffect(() => {
    const fetchOrgs = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/registrations');
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.registrations)) {
            const activeOrgs = data.registrations
              .filter((r: any) => r.status === 'Approved')
              .map((r: any, idx: number) => ({
                id: r.id || String(idx + 1),
                name: r.companyName,
                logo: r.companyName.substring(0, 2).toUpperCase(),
                color: 'from-blue-600 to-indigo-600',
              }));
            setOrganizations(activeOrgs);
            if (activeOrgs.length > 0 && !selectedOrg) {
              setSelectedOrg(activeOrgs[0].name);
            }
          }
        }
      } catch (err) {
        console.warn('Backend unreachable:', err);
      }
    };
    fetchOrgs();
  }, []);

  const handleSaveChannelConfig = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('WhatsApp Channel Configuration Saved Successfully!', 'success');
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* 1. If No Organization Selected -> Show Select The Organization Grid (Matching Image 4) */}
      {!selectedOrg ? (
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Select The Organization</h1>
            <p className="text-xs text-slate-500">Select the Organization (Company) for manage the Omni Channels of its.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {organizations.map((org) => (
              <div
                key={org.id}
                onClick={() => setSelectedOrg(org.name)}
                className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-400 transition-all cursor-pointer text-center space-y-4 group"
              >
                <div className={`w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br ${org.color} text-white font-black text-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform`}>
                  {org.logo}
                </div>
                <h3 className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{org.name}</h3>
              </div>
            ))}
          </div>
        </div>
      ) : !selectedChannel ? (
        /* 2. Organization Channels Overview with Donut Chart (Matching Image 5 Top) */
        <div className="space-y-6">
          
          {/* Top Banner with Company Header Badge */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-3xl shadow-xl border border-indigo-900/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <button
                onClick={() => setSelectedOrg(null)}
                className="text-xs font-bold text-cyan-400 hover:underline flex items-center gap-1 mb-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Switch Organization</span>
              </button>
              <h1 className="text-2xl font-black tracking-tight">Channel Configuration</h1>
              <p className="text-xs text-slate-300 mt-0.5">Real-time infrastructure health and user growth metrics for SLT Global.</p>
            </div>

            <div className="bg-white text-slate-900 p-3.5 rounded-2xl border border-slate-200 shadow-md flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white font-black flex items-center justify-center text-xs shadow-xs">
                Abc
              </div>
              <div>
                <h4 className="text-xs font-black">{selectedOrg}</h4>
                <span className="text-[9px] text-slate-400 block">50 APIs Management System</span>
              </div>
              <span className="ml-2 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                ● Connection: Active
              </span>
            </div>
          </div>

          {/* Channels Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* WhatsApp Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">WhatsApp</h3>
                  <span className="text-[10px] font-bold text-emerald-600 block">✓ Operational</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedChannel('whatsapp')}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md"
              >
                Configure
              </button>
            </div>

            {/* Messenger Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-blue-50 text-blue-600">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Messenger</h3>
                  <span className="text-[10px] font-bold text-amber-600 block">▲ Rechecking</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedChannel('messenger')}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md"
              >
                Configure
              </button>
            </div>

            {/* SMS Hub Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-purple-50 text-purple-600">
                  <Smartphone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">SMS Hub</h3>
                  <span className="text-[10px] font-bold text-purple-600 block">● Online</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedChannel('sms')}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md"
              >
                Configure
              </button>
            </div>

            {/* SMTP/Email Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-red-50 text-red-600">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">SMTP/Email</h3>
                  <span className="text-[10px] font-bold text-emerald-600 block">▲ Healthy</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedChannel('email')}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md"
              >
                Configure
              </button>
            </div>

            {/* Web Channel Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-cyan-50 text-cyan-600">
                  <Globe className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Web Channel</h3>
                  <span className="text-[10px] font-bold text-cyan-600 block">● Healthy</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedChannel('web')}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs shadow-md"
              >
                Configure
              </button>
            </div>

          </div>

          {/* Donut Chart: Channel Distribution Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 max-w-sm">
            <h3 className="text-xs font-bold text-slate-900">Channel Distribution</h3>
            
            <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
              <div className="w-36 h-36 rounded-full border-8 border-indigo-600 border-t-cyan-400 border-r-purple-500 border-b-emerald-400 animate-spin-slow" />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-black text-slate-900">12.4k</span>
                <span className="text-[9px] text-slate-400 font-bold uppercase">Total</span>
              </div>
            </div>
          </div>

        </div>
      ) : (
        /* 3. WhatsApp Channel Management Detailed View (Matching Image 5 Bottom) */
        <div className="space-y-6">
          
          {/* Breadcrumb Header */}
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-1">
              <button onClick={() => setSelectedChannel(null)} className="hover:text-slate-700">Channels</button>
              <span>&gt;</span>
              <span className="text-indigo-600 capitalize">{selectedChannel} Configuration</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight capitalize">{selectedChannel} Channel Management</h1>
                <p className="text-xs text-slate-500 mt-0.5">Configure API endpoints, automate messaging thresholds, and monitor real-time delivery performance.</p>
              </div>

              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                ● Connection: Active
              </span>
            </div>
          </div>

          {/* Top Control Bar: Active Router & Channel Enable Toggle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900">Omni Agent Whatsapp</h4>
                  <span className="text-[10px] text-slate-400">Mobile, v4.1.0+v4.0</span>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">ONLINE</span>
            </div>

            {/* Channel Enable Toggle Switch Card */}
            <div className="p-4 rounded-3xl bg-purple-900 text-white flex items-center justify-between shadow-md">
              <span className="text-xs font-bold">Channel Enable</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={channelEnabled}
                  onChange={(e) => setChannelEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>

          </div>

          {/* Main Form Grid: Left Configuration Details + Right Overview Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Configuration Details (7 cols) */}
            <form onSubmit={handleSaveChannelConfig} className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div>
                <h3 className="text-sm font-black text-slate-900">Configuration Details</h3>
                <p className="text-xs text-slate-400">Manage your connection settings and security handshakes.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Account SID</label>
                  <input
                    type="text"
                    value={accountSid}
                    onChange={(e) => setAccountSid(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Webhook URL (Production)</label>
                  <input
                    type="text"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700">Auth Token</label>
                    <button
                      type="button"
                      onClick={() => addToast('Credentials Verified!', 'success')}
                      className="text-[11px] font-bold text-indigo-600 hover:underline cursor-pointer"
                    >
                      Verify Credentials
                    </button>
                  </div>
                  <input
                    type="password"
                    value={authToken}
                    onChange={(e) => setAuthToken(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none"
                  />
                </div>

                {/* AUTOMATED RESPONSE SETTINGS */}
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">AUTOMATED RESPONSE SETTINGS</h4>

                  <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-xs font-bold text-slate-700">Enable Auto-Reply</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={autoReplyEnabled}
                        onChange={(e) => setAutoReplyEnabled(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <div>
                      <span className="text-xs font-bold text-slate-700 block">AI Agent Handoff</span>
                      <span className="text-[10px] text-purple-600 font-bold">{aiHandoffThreshold} Threshold</span>
                    </div>
                    <input
                      type="text"
                      value={aiHandoffThreshold}
                      onChange={(e) => setAiHandoffThreshold(e.target.value)}
                      className="w-16 px-2 py-1 bg-white border border-slate-200 rounded-xl text-xs font-bold text-center text-slate-900"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-xs font-bold text-slate-700">Offline Messaging</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={offlineMessagingEnabled}
                        onChange={(e) => setOfflineMessagingEnabled(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>

                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </form>

            {/* Right Column: OVERVIEW & WHATSAPP STATS (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">OVERVIEW</h4>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100">
                    <span className="text-[10px] text-slate-400 font-bold block">Success</span>
                    <h3 className="text-lg font-black text-emerald-600">99.98%</h3>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100">
                    <span className="text-[10px] text-slate-400 font-bold block">Uptime</span>
                    <h3 className="text-xs font-bold text-emerald-700 mt-1">✓ Healthy</h3>
                    <span className="text-[9px] text-slate-400 block">0 Pending</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[10px] font-mono text-slate-500 block break-all">
                    {webhookUrl}
                  </span>
                </div>
              </div>

              {/* WHATSAPP STATS */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">WHATSAPP STATS</h4>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">REALTIME</span>
                </div>

                <div className="space-y-1">
                  <h2 className="text-2xl font-black text-slate-900">124.5k</h2>
                  <span className="text-[10px] text-slate-400 font-bold block">Messages (Sent/Recv)</span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs pt-2">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Avg Response</span>
                    <span className="font-bold text-slate-900">1.2s</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Success Rate</span>
                    <span className="font-bold text-emerald-600">99.4%</span>
                  </div>
                </div>

                {/* Bar Chart Visualization */}
                <div className="h-16 flex items-end gap-2 pt-4 border-t border-slate-100">
                  <div className="flex-1 bg-purple-200 h-[40%] rounded-t-sm" />
                  <div className="flex-1 bg-purple-300 h-[65%] rounded-t-sm" />
                  <div className="flex-1 bg-purple-400 h-[80%] rounded-t-sm" />
                  <div className="flex-1 bg-purple-600 h-[100%] rounded-t-sm" />
                  <div className="flex-1 bg-purple-400 h-[70%] rounded-t-sm" />
                  <div className="flex-1 bg-purple-300 h-[50%] rounded-t-sm" />
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* Render Toast Notifications */}
      <ToastContainer toasts={toasts} onClose={removeToast} />

    </div>
  );
}
