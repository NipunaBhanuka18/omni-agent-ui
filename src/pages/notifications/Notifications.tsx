import React, { useState } from 'react';
import { Bell, CheckCircle2, ShieldAlert, Cpu, Layers, RefreshCw, Check, Download, Plus, Calendar, Activity, AlertTriangle, Eye, Copy, Edit2, Trash2, Zap, Send, Smartphone, Clock, Filter, Search, RotateCw, ArrowLeft, Building2 } from 'lucide-react';
import Button from '@/components/Button';
import InputField from '@/components/InputField';

import ToastContainer, { type ToastMessage } from '@/components/Toast';

export default function Notifications() {
  const [selectedOrg, setSelectedOrg] = useState<string | null>('ABC Company (pvt) Ltd');
  const [viewMode, setViewMode] = useState<'management' | 'personal'>('management');
  const [channelTab, setChannelTab] = useState<'whatsapp' | 'messenger' | 'sms' | 'email' | 'web'>('whatsapp');
  const [activeSubTab, setActiveSubTab] = useState<'dashboard' | 'compose' | 'templates' | 'logs'>('dashboard');

  // Toasts state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
  };
  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Broadcast Compose State
  const [broadcastHeadline, setBroadcastHeadline] = useState('');
  const [broadcastBody, setBroadcastBody] = useState('Hello {{User_Name}}, your balance is LKR {{Balance}}. Top up now to enjoy 5GB extra data for 3 days. Valid until {{Expiry_Date}}.');
  const [sendTiming, setSendTiming] = useState<'now' | 'later'>('now');
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [testPhoneNumber, setTestPhoneNumber] = useState('+94 77 123 4567');

  const [organizations, setOrganizations] = useState<any[]>([]);
  const [personalNotifications, setPersonalNotifications] = useState<any[]>([]);
  const [deliveryLogs, setDeliveryLogs] = useState<any[]>([]);

  React.useEffect(() => {
    // Fetch real organizations from backend API
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
        console.warn('Backend server unreachable for organizations list:', err);
      }
    };

    // Fetch delivery logs from backend API
    const fetchLogs = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/telemetry-logs');
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.logs)) {
            setDeliveryLogs(data.logs);
          }
        }
      } catch (err) {
        console.warn('Backend server unreachable for telemetry logs:', err);
      }
    };

    // Fetch personal notifications from backend API
    const fetchNotifications = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/notifications');
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.notifications)) {
            setPersonalNotifications(data.notifications);
          }
        }
      } catch (err) {
        console.warn('Backend server unreachable for notifications:', err);
      }
    };

    fetchOrgs();
    fetchLogs();
    fetchNotifications();
  }, []);

  const handleInsertTag = (tag: string) => {
    setBroadcastBody((prev) => prev + ` {{${tag}}}`);
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* 1. If No Organization Selected -> Show Organization Selector Grid (Matching Image 5) */}
      {!selectedOrg ? (
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Select The Organization</h1>
            <p className="text-xs text-slate-500">Select the Organization (Company) for manage the Notifications of its.</p>
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
      ) : (
        /* 2. Notification Management Dashboard */
        <div className="space-y-6">
          
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <button
                onClick={() => setSelectedOrg(null)}
                className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1 mb-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Switch Organization ({selectedOrg})</span>
              </button>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Notification Management</h1>
              <p className="text-xs text-slate-500 mt-0.5">Monitor and dispatch cross-channel communications for {selectedOrg}.</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-1 rounded-2xl bg-slate-100 border border-slate-200 flex items-center gap-1">
                <button
                  onClick={() => setViewMode('management')}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    viewMode === 'management' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Control Panel
                </button>
                <button
                  onClick={() => setViewMode('personal')}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    viewMode === 'personal' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Personal Alerts
                </button>
              </div>

              <button
                onClick={() => addToast('Exporting Notification List Report...', 'info')}
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4 text-indigo-600" />
                <span>Export List Report</span>
              </button>
            </div>
          </div>

          {viewMode === 'management' ? (
            <div className="space-y-6">
              
              {/* Channel Filter Tabs */}
              <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
                {(['whatsapp', 'messenger', 'sms', 'email', 'web'] as const).map((ch) => {
                  const active = channelTab === ch;
                  return (
                    <button
                      key={ch}
                      onClick={() => setChannelTab(ch)}
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

              {/* Sub Navigation Bar */}
              <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs font-bold">
                  <button
                    onClick={() => setActiveSubTab('dashboard')}
                    className={`px-4 py-2 rounded-xl transition-all ${
                      activeSubTab === 'dashboard' ? 'bg-indigo-50 text-indigo-700 shadow-xs' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => setActiveSubTab('templates')}
                    className={`px-4 py-2 rounded-xl transition-all ${
                      activeSubTab === 'templates' ? 'bg-indigo-50 text-indigo-700 shadow-xs' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Templates
                  </button>
                  <button
                    onClick={() => setActiveSubTab('logs')}
                    className={`px-4 py-2 rounded-xl transition-all ${
                      activeSubTab === 'logs' ? 'bg-indigo-50 text-indigo-700 shadow-xs' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Delivery Logs
                  </button>
                </div>

                <button
                  onClick={() => setActiveSubTab('compose')}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ New Broadcast</span>
                </button>
              </div>

              {/* 1. Dashboard View */}
              {activeSubTab === 'dashboard' && (
                <div className="space-y-6">
                  {/* Metrics Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Total Alerts Sent</span>
                      <div className="flex items-baseline justify-between">
                        <h2 className="text-2xl font-black text-slate-900">1.2M</h2>
                        <span className="text-xs font-bold text-emerald-600">+12%</span>
                      </div>
                    </div>

                    <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Active Schedules</span>
                      <div className="flex items-baseline justify-between">
                        <h2 className="text-2xl font-black text-slate-900">24</h2>
                        <Calendar className="w-5 h-5 text-indigo-500" />
                      </div>
                    </div>

                    <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Delivery Rate</span>
                      <div className="flex items-baseline justify-between">
                        <h2 className="text-2xl font-black text-emerald-600">99.8%</h2>
                        <span className="w-16 h-2 bg-emerald-100 rounded-full overflow-hidden inline-block">
                          <span className="w-full h-full bg-emerald-500 block" />
                        </span>
                      </div>
                    </div>

                    <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Failed Deliveries</span>
                        <h2 className="text-2xl font-black text-red-600">142</h2>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-red-100 text-red-800 text-[10px] font-bold uppercase">Critical</span>
                    </div>
                  </div>

                  {/* Main Grid: Broadcast Table + Automated Triggers */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                      <h3 className="text-sm font-bold text-slate-900">Recent Broadcast Activity</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                              <th className="pb-3 px-2">ALERT TITLE</th>
                              <th className="pb-3 px-2">AUDIENCE</th>
                              <th className="pb-3 px-2">STATUS</th>
                              <th className="pb-3 px-2">TIMESTAMP</th>
                              <th className="pb-3 px-2 text-right">ACTIONS</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                            <tr>
                              <td className="py-4 px-2 font-bold text-slate-900">Monthly Maintenance Notice</td>
                              <td className="py-4 px-2 text-slate-500">All</td>
                              <td className="py-4 px-2"><span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">● Sent</span></td>
                              <td className="py-4 px-2 text-slate-400">Oct 24, 09:00 AM</td>
                              <td className="py-4 px-2 text-right space-x-2">
                                <button className="text-slate-400 hover:text-indigo-600"><Eye className="w-4 h-4" /></button>
                              </td>
                            </tr>
                            <tr>
                              <td className="py-4 px-2 font-bold text-slate-900">5G Package Upgrade Promo</td>
                              <td className="py-4 px-2 text-slate-500">Postpaid</td>
                              <td className="py-4 px-2"><span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">● Scheduled</span></td>
                              <td className="py-4 px-2 text-slate-400">Oct 25, 11:30 AM</td>
                              <td className="py-4 px-2 text-right space-x-2">
                                <button className="text-slate-400 hover:text-indigo-600"><Edit2 className="w-4 h-4" /></button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-emerald-600" />
                        Automated Triggers
                      </h3>
                      <div className="space-y-3 text-xs">
                        <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-1">
                          <span className="font-bold text-slate-900 block">Low Balance Alert</span>
                          <span className="text-[10px] text-slate-500 block">Triggered at &lt; LKR 50.00</span>
                        </div>
                        <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-1">
                          <span className="font-bold text-slate-900 block">Package Expiry</span>
                          <span className="text-[10px] text-slate-500 block">Triggered 24h before expiry</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. Compose Broadcast View */}
              {activeSubTab === 'compose' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Form: Message Content */}
                  <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-1">MESSAGE CONTENT</h3>
                      <span className="text-xs text-slate-400">Compose broadcast content for {channelTab.toUpperCase()} subscribers.</span>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Broadcast Headline</label>
                        <input
                          type="text"
                          placeholder="e.g. Exclusive Weekend Offer"
                          value={broadcastHeadline}
                          onChange={(e) => setBroadcastHeadline(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-xs font-bold text-slate-700">Message Body</label>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleInsertTag('User_Name')}
                              className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-bold hover:bg-indigo-100"
                            >
                              + Name
                            </button>
                            <button
                              type="button"
                              onClick={() => handleInsertTag('Balance')}
                              className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-bold hover:bg-indigo-100"
                            >
                              + Balance
                            </button>
                            <button
                              type="button"
                              onClick={() => handleInsertTag('Expiry_Date')}
                              className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-bold hover:bg-indigo-100"
                            >
                              + Expiry
                            </button>
                          </div>
                        </div>

                        <textarea
                          rows={5}
                          value={broadcastBody}
                          onChange={(e) => setBroadcastBody(e.target.value)}
                          className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        />
                        <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                          <span>{broadcastBody.length} / 1000 characters</span>
                          <span>1 SMS Segment</span>
                        </div>
                      </div>

                      {/* Delivery Timing */}
                      <div className="pt-4 border-t border-slate-100 space-y-3">
                        <span className="block text-xs font-bold text-slate-700">Delivery Timing</span>
                        
                        <div className="flex items-center gap-6">
                          <label className="flex items-center gap-2 text-xs text-slate-700 font-semibold cursor-pointer">
                            <input
                              type="radio"
                              name="timing"
                              checked={sendTiming === 'now'}
                              onChange={() => setSendTiming('now')}
                              className="text-indigo-600"
                            />
                            <span>Send Now</span>
                          </label>

                          <label className="flex items-center gap-2 text-xs text-slate-700 font-semibold cursor-pointer">
                            <input
                              type="radio"
                              name="timing"
                              checked={sendTiming === 'later'}
                              onChange={() => setSendTiming('later')}
                              className="text-indigo-600"
                            />
                            <span>Schedule for later</span>
                          </label>
                        </div>

                        {sendTiming === 'later' && (
                          <div className="grid grid-cols-2 gap-4 pt-2">
                            <input
                              type="date"
                              value={scheduleDate}
                              onChange={(e) => setScheduleDate(e.target.value)}
                              className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                            />
                            <input
                              type="time"
                              value={scheduleTime}
                              onChange={(e) => setScheduleTime(e.target.value)}
                              className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                            />
                          </div>
                        )}
                      </div>

                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => addToast('Saved as Draft!', 'info')}
                        className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer"
                      >
                        Save as Draft
                      </button>

                      <button
                        type="button"
                        onClick={() => addToast('Dispatching Broadcast...', 'success')}
                        className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md cursor-pointer"
                      >
                        Dispatch Broadcast
                      </button>
                    </div>
                  </div>

                  {/* Right Panel: Test Broadcast & Smartphone Live Preview */}
                  <div className="lg:col-span-5 space-y-6">
                    
                    {/* Test Broadcast Box */}
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
                      <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">TEST BROADCAST</h4>
                      <p className="text-[11px] text-slate-400">Send a live test to your registered admin mobile number.</p>
                      
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={testPhoneNumber}
                          onChange={(e) => setTestPhoneNumber(e.target.value)}
                          className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                        />
                        <button
                          onClick={() => addToast(`Test message sent to ${testPhoneNumber}`, 'success')}
                          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                        >
                          Send Test
                        </button>
                      </div>
                    </div>

                    {/* Smartphone Live Preview Mockup */}
                    <div className="bg-slate-900 p-6 rounded-[40px] border-4 border-slate-800 shadow-2xl space-y-4 max-w-sm mx-auto text-white">
                      <div className="w-20 h-4 bg-slate-800 rounded-full mx-auto" />
                      
                      <div className="bg-slate-950 p-4 rounded-3xl space-y-4 border border-slate-800 min-h-[320px]">
                        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                          <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] font-bold">
                            OA
                          </div>
                          <div>
                            <h5 className="text-[11px] font-bold">Omni Agent</h5>
                            <span className="text-[9px] text-emerald-400">Official Account</span>
                          </div>
                        </div>

                        <div className="bg-indigo-950/80 border border-indigo-800/50 p-3 rounded-2xl text-xs space-y-2">
                          <p className="text-slate-200 font-medium text-[11px] leading-relaxed">
                            {broadcastBody || 'Type your message body to preview here...'}
                          </p>
                          <span className="text-[9px] text-indigo-400 block text-right">10:42 PM</span>
                        </div>
                      </div>
                    </div>

                  </div>

                </div>
              )}

              {/* 3. Templates View */}
              {activeSubTab === 'templates' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900">Message Templates</h3>
                    <button
                      onClick={() => addToast('Creating new template modal...', 'info')}
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md cursor-pointer"
                    >
                      + Create New Template
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">Maintenance Alert</h4>
                          <span className="text-[10px] font-mono text-slate-400">ID: TMP-4402</span>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">Active</span>
                      </div>
                      <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                        Dear {"{{User_Name}}"}, we are performing a scheduled maintenance on {"{{Service_Date}}"}.
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2">
                        <span>Used 1.2k times</span>
                        <span>Last used: 2h ago</span>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">Low Balance Warning</h4>
                          <span className="text-[10px] font-mono text-slate-400">ID: TMP-5621</span>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">Active</span>
                      </div>
                      <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                        Your account balance is below LKR 100.00. Please recharge to avoid service interruption.
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2">
                        <span>Used 10.2k times</span>
                        <span>Last used: 5m ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 4. Delivery Logs View */}
              {activeSubTab === 'logs' && (
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                  
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900">Delivery Telemetry Logs</h3>
                    <div className="flex items-center gap-3">
                      <button className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5">
                        <Download className="w-3.5 h-3.5" />
                        <span>Export Logs</span>
                      </button>
                      <button className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 flex items-center gap-1.5">
                        <RotateCw className="w-3.5 h-3.5" />
                        <span>Refresh</span>
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                          <th className="pb-3">MESSAGE ID</th>
                          <th className="pb-3">RECIPIENT</th>
                          <th className="pb-3">CHANNEL</th>
                          <th className="pb-3">STATUS</th>
                          <th className="pb-3">TIMESTAMP</th>
                          <th className="pb-3 text-right">ACTION</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                        {deliveryLogs.map((log) => (
                          <tr key={log.id} className="hover:bg-slate-50">
                            <td className="py-4 font-mono font-bold text-indigo-600">{log.id}</td>
                            <td className="py-4">
                              <span className="font-bold text-slate-900 block">{log.recipient}</span>
                              <span className="text-[10px] text-slate-400">User: {log.user}</span>
                            </td>
                            <td className="py-4 capitalize font-semibold">{channelTab}</td>
                            <td className="py-4">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${log.color}`}>
                                ● {log.status}
                              </span>
                            </td>
                            <td className="py-4 text-slate-500">{log.time}</td>
                            <td className="py-4 text-right">
                              <button
                                onClick={() => setDeliveryLogs(deliveryLogs.filter((d) => d.id !== log.id))}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                </div>
              )}

            </div>
          ) : (
            /* Personal Alerts View */
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <h2 className="text-sm font-bold text-slate-900">Workspace Alerts &amp; Audit Logs</h2>
                <button
                  onClick={() => setPersonalNotifications(personalNotifications.map((n) => ({ ...n, read: true })))}
                  className="text-xs font-bold text-indigo-600 hover:underline"
                >
                  Mark all as read
                </button>
              </div>

              {personalNotifications.map((n) => {
                const Icon = n.icon;
                return (
                  <div
                    key={n.id}
                    className={`p-6 rounded-3xl border transition-all flex items-start gap-4 shadow-sm ${
                      n.type === 'alert' ? 'bg-red-50/60 border-red-200' : !n.read ? 'bg-indigo-50/40 border-indigo-200' : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className={`p-3 rounded-2xl ${n.color} shrink-0 shadow-xs`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-sm font-extrabold text-slate-900">{n.title}</h3>
                        <span className="text-[11px] text-slate-400">{n.time}</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed font-normal">{n.message}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

      {/* Render Toast Notifications */}
      <ToastContainer toasts={toasts} onClose={removeToast} />

    </div>
  );
}
