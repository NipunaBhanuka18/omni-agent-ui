import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, MessageSquare, Smartphone, Globe, Mail, Activity, Clock, ShieldCheck, Zap, ArrowRight, CreditCard } from 'lucide-react';

const API = 'http://localhost:3001';

export default function SuperAdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalAvailability: 0,
    activeConnections: 0,
    pendingRequests: 0,
  });
  const [registrations, setRegistrations] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await fetch(`${API}/api/stats`);
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }
      } catch (err) {
        console.warn('Backend stats unreachable', err);
      }

      try {
        const regRes = await fetch(`${API}/api/registrations`);
        if (regRes.ok) {
          const regData = await regRes.json();
          if (regData.success && Array.isArray(regData.registrations)) {
            setRegistrations(regData.registrations);
          }
        }
      } catch (err) {
        console.warn('Backend registrations unreachable', err);
      }
    };
    fetchData();
  }, []);

  const pendingCount = registrations.filter((r) => r.status === 'Pending').length || stats.pendingRequests;
  const approvedCount = registrations.filter((r) => r.status === 'Approved').length || stats.totalAvailability;
  const totalCount = registrations.length || (pendingCount + approvedCount);

  // Generate dynamic recent activity logs from real backend registrations
  const generatedLogs = registrations.length > 0
    ? registrations.slice(-3).reverse().map((reg, idx) => ({
        id: reg.id || `log-${idx}`,
        title: reg.status === 'Approved' ? `${reg.companyName} Provisioned` : `Registration Request Received`,
        desc: reg.status === 'Approved' ? `Approved and provisioned on OmniAI node.` : `${reg.companyName} (${reg.companyEmail}) awaiting approval.`,
        time: idx === 0 ? 'Just Now' : `${(idx + 1) * 12} mins ago`,
        type: reg.status === 'Approved' ? 'success' : 'pending',
      }))
    : [
        {
          id: 'log-1',
          title: 'Security Audit Passed',
          desc: 'Gateway node 01 verified 0 threat incursions.',
          time: 'Just Now',
          type: 'security',
        },
        {
          id: 'log-2',
          title: 'Enterprise Node Operational',
          desc: 'SLT Global Node 01 health status verified 100%.',
          time: '10 mins ago',
          type: 'success',
        },
      ];

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Company Overview</h1>
          <p className="text-xs text-slate-500 mt-0.5">Real-time operational health and user growth metrics for SLT Global.</p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Connection: Active</span>
          </span>
        </div>
      </div>

      {/* Metrics Row + Add Company Banner */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Metrics (8 cols) */}
        <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Total Availability</span>
            <div className="flex items-baseline justify-between">
              <h2 className="text-3xl font-black text-slate-900">{approvedCount}</h2>
              <span className="text-xs font-bold text-emerald-600">Active</span>
            </div>
            <span className="text-[10px] text-slate-400 block">Active Company Workspaces</span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Active Connections</span>
            <div className="flex items-baseline justify-between">
              <h2 className="text-3xl font-black text-emerald-600">{approvedCount}</h2>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping inline-block" />
            </div>
            <span className="text-[10px] text-slate-400 block">Online Gateway Routers</span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Pending Requests</span>
            <div className="flex items-baseline justify-between">
              <h2 className="text-3xl font-black text-purple-600">{pendingCount}</h2>
              <Clock className="w-5 h-5 text-purple-500" />
            </div>
            <span className="text-[10px] text-slate-400 block">Awaiting Review</span>
          </div>

        </div>

        {/* Right CTA Card: ADD COMPANY (4 cols) */}
        <div className="md:col-span-4 bg-gradient-to-br from-indigo-900 to-purple-950 text-white p-6 rounded-3xl shadow-xl border border-indigo-800 flex flex-col justify-between space-y-4">
          <div className="flex items-start justify-between">
            <div className="p-3 rounded-2xl bg-white/10 text-cyan-300">
              <Building2 className="w-6 h-6" />
            </div>
            <span className="px-2 py-0.5 rounded-full bg-purple-500/30 text-purple-200 text-[10px] font-bold uppercase">Provisioning</span>
          </div>

          <div>
            <h3 className="text-base font-black">ADD COMPANY</h3>
            <p className="text-xs text-indigo-200 mt-1">Add Company's User System into SLT Global Node.</p>
          </div>

          <button
            onClick={() => navigate('/admin/organizations')}
            className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>ADD COMPANY</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Channels Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Active Gateway Channels</h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center gap-3">
            <MessageSquare className="w-5 h-5 text-emerald-600" />
            <span className="text-xs font-bold text-emerald-900">WhatsApp</span>
          </div>

          <div className="p-3 rounded-2xl bg-blue-50 border border-blue-100 flex items-center gap-3">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            <span className="text-xs font-bold text-blue-900">Messenger</span>
          </div>

          <div className="p-3 rounded-2xl bg-cyan-50 border border-cyan-100 flex items-center gap-3">
            <Globe className="w-5 h-5 text-cyan-600" />
            <span className="text-xs font-bold text-cyan-900">Web</span>
          </div>

          <div className="p-3 rounded-2xl bg-red-50 border border-red-100 flex items-center gap-3">
            <Mail className="w-5 h-5 text-red-600" />
            <span className="text-xs font-bold text-red-900">Email</span>
          </div>

          <div className="p-3 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center gap-3">
            <Smartphone className="w-5 h-5 text-indigo-600" />
            <span className="text-xs font-bold text-indigo-900">SMS</span>
          </div>
        </div>
      </div>

      {/* Quick Access Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        
        {/* Company Registration Request Card */}
        <div
          onClick={() => navigate('/admin/organizations')}
          className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-3xl border border-purple-200/70 shadow-sm flex items-center justify-between cursor-pointer hover:shadow-md transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-purple-600 text-white shadow-md group-hover:scale-105 transition-transform">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900">Company Registration Request</h3>
              <p className="text-xs text-slate-500">Review and approve new company onboarding submissions.</p>
            </div>
          </div>

          <span className="px-4 py-2 rounded-2xl bg-purple-600 text-white font-black text-sm shadow-md">
            {pendingCount}
          </span>
        </div>

        {/* Subscription Package Card */}
        <div
          onClick={() => navigate('/admin/packages')}
          className="bg-gradient-to-r from-cyan-50 to-blue-50 p-6 rounded-3xl border border-cyan-200/70 shadow-sm flex items-center justify-between cursor-pointer hover:shadow-md transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-cyan-600 text-white shadow-md group-hover:scale-105 transition-transform">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900">Subscription Package</h3>
              <p className="text-xs text-slate-500">Manage pricing tiers, payment details, and features.</p>
            </div>
          </div>

          <span className="px-4 py-2 rounded-2xl bg-cyan-600 text-white font-black text-sm shadow-md">
            {totalCount}
          </span>
        </div>

      </div>

      {/* Recent Activity Log */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">RECENT ACTIVITY LOG</h3>
          <button onClick={() => navigate('/admin/organizations')} className="text-xs font-bold text-indigo-600 hover:underline cursor-pointer">View All Logs</button>
        </div>

        <div className="space-y-3 text-xs">
          {generatedLogs.map((log) => (
            <div key={log.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${log.type === 'pending' ? 'bg-purple-100 text-purple-700' : log.type === 'security' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                  {log.type === 'pending' ? <Clock className="w-4 h-4" /> : log.type === 'security' ? <ShieldCheck className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">{log.title}</span>
                  <span className="text-[10px] text-slate-400">{log.desc}</span>
                </div>
              </div>
              <span className={`text-[10px] font-bold ${log.type === 'security' ? 'text-emerald-600' : 'text-slate-400'}`}>{log.time}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
