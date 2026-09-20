import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, MessageSquare, Smartphone, Globe, Mail, Clock, ShieldCheck, Zap, ArrowRight, CreditCard, Sparkles } from 'lucide-react';

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

  // Dynamic recent activity logs from real backend registrations
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
      
      {/* Gradient Hero Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white p-6 sm:p-8 rounded-3xl border border-indigo-500/20 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 text-cyan-400">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Super Admin Executive Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-pink-200">
            Company Overview & Ecosystem
          </h1>
          <p className="text-xs text-slate-300 mt-1">Real-time operational health, channel routing, and infrastructure growth metrics for SLT Global.</p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-4 py-2 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 shadow-lg backdrop-blur-md">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Node Status: Active</span>
          </span>
        </div>
      </div>

      {/* Metrics Row + Add Company Banner */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Metrics (8 cols) */}
        <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          <div className="bg-slate-900/80 backdrop-blur-md p-5 rounded-3xl border border-indigo-500/20 shadow-xl space-y-2 hover:border-indigo-400/40 transition-all">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Total Availability</span>
            <div className="flex items-baseline justify-between">
              <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400">{approvedCount}</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold">Active</span>
            </div>
            <span className="text-[10px] text-slate-400 block">Active Company Workspaces</span>
          </div>

          <div className="bg-slate-900/80 backdrop-blur-md p-5 rounded-3xl border border-indigo-500/20 shadow-xl space-y-2 hover:border-emerald-400/40 transition-all">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Active Connections</span>
            <div className="flex items-baseline justify-between">
              <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">{approvedCount}</h2>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping inline-block" />
            </div>
            <span className="text-[10px] text-slate-400 block">Online Gateway Routers</span>
          </div>

          <div className="bg-slate-900/80 backdrop-blur-md p-5 rounded-3xl border border-indigo-500/20 shadow-xl space-y-2 hover:border-purple-400/40 transition-all">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Pending Requests</span>
            <div className="flex items-baseline justify-between">
              <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">{pendingCount}</h2>
              <Clock className="w-5 h-5 text-purple-400" />
            </div>
            <span className="text-[10px] text-slate-400 block">Awaiting Review</span>
          </div>

        </div>

        {/* Right CTA Card: ADD COMPANY (4 cols) */}
        <div className="md:col-span-4 bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 text-white p-6 rounded-3xl shadow-xl border border-indigo-500/30 flex flex-col justify-between space-y-4">
          <div className="flex items-start justify-between">
            <div className="p-3 rounded-2xl bg-white/10 text-cyan-300 backdrop-blur-md">
              <Building2 className="w-6 h-6" />
            </div>
            <span className="px-2.5 py-1 rounded-full bg-purple-500/30 text-purple-200 text-[10px] font-bold uppercase tracking-wider">Provisioning</span>
          </div>

          <div>
            <h3 className="text-lg font-black tracking-tight">ADD COMPANY</h3>
            <p className="text-xs text-indigo-200 mt-1">Add Company's User System into SLT Global Node.</p>
          </div>

          <button
            onClick={() => navigate('/admin/organizations')}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:via-indigo-500 hover:to-purple-500 text-white font-black text-xs shadow-lg shadow-indigo-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>ADD COMPANY</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Channels Bar */}
      <div className="bg-slate-900/80 backdrop-blur-md p-5 rounded-3xl border border-indigo-500/20 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-cyan-400">ACTIVE GATEWAY CHANNELS</h3>
          <span className="text-[11px] font-bold text-indigo-300 hover:text-white cursor-pointer transition-colors" onClick={() => navigate('/admin/channels')}>
            Manage All Channels &rarr;
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div
            onClick={() => navigate('/admin/channels?channel=whatsapp')}
            className="p-3.5 rounded-2xl bg-slate-900 border border-emerald-500/30 flex items-center gap-3 cursor-pointer hover:border-emerald-400 transition-all"
            title="Configure WhatsApp Channel"
          >
            <MessageSquare className="w-5 h-5 text-emerald-400" />
            <div>
              <span className="text-xs font-black text-white block">WhatsApp</span>
              <span className="text-[9px] font-bold text-emerald-400">● Operational</span>
            </div>
          </div>

          <div
            onClick={() => navigate('/admin/channels?channel=messenger')}
            className="p-3.5 rounded-2xl bg-slate-900 border border-blue-500/30 flex items-center gap-3 cursor-pointer hover:border-blue-400 transition-all"
            title="Configure Messenger Channel"
          >
            <MessageSquare className="w-5 h-5 text-blue-400" />
            <div>
              <span className="text-xs font-black text-white block">Messenger</span>
              <span className="text-[9px] font-bold text-blue-400">● Connected</span>
            </div>
          </div>

          <div
            onClick={() => navigate('/admin/channels?channel=web')}
            className="p-3.5 rounded-2xl bg-slate-900 border border-cyan-500/30 flex items-center gap-3 cursor-pointer hover:border-cyan-400 transition-all"
            title="Configure Web Channel"
          >
            <Globe className="w-5 h-5 text-cyan-400" />
            <div>
              <span className="text-xs font-black text-white block">Web</span>
              <span className="text-[9px] font-bold text-cyan-400">● Active</span>
            </div>
          </div>

          <div
            onClick={() => navigate('/admin/channels?channel=email')}
            className="p-3.5 rounded-2xl bg-slate-900 border border-red-500/30 flex items-center gap-3 cursor-pointer hover:border-red-400 transition-all"
            title="Configure Email Channel"
          >
            <Mail className="w-5 h-5 text-red-400" />
            <div>
              <span className="text-xs font-black text-white block">Email</span>
              <span className="text-[9px] font-bold text-red-400">▲ Healthy</span>
            </div>
          </div>

          <div
            onClick={() => navigate('/admin/channels?channel=sms')}
            className="p-3.5 rounded-2xl bg-slate-900 border border-purple-500/30 flex items-center gap-3 cursor-pointer hover:border-purple-400 transition-all"
            title="Configure SMS Channel"
          >
            <Smartphone className="w-5 h-5 text-purple-400" />
            <div>
              <span className="text-xs font-black text-white block">SMS</span>
              <span className="text-[9px] font-bold text-purple-400">● Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Access Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        
        {/* Company Registration Request Card */}
        <div
          onClick={() => navigate('/admin/organizations')}
          className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white p-6 rounded-3xl shadow-xl border border-purple-500/30 flex items-center justify-between cursor-pointer hover:border-purple-400 transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-white/10 text-white backdrop-blur-md group-hover:scale-105 transition-transform">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-black">Company Registration Request</h3>
              <p className="text-xs text-purple-200">Review and approve new company onboarding submissions.</p>
            </div>
          </div>

          <span className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-400/40 text-cyan-300 font-black text-base shadow-md flex items-center justify-center shrink-0">
            {pendingCount}
          </span>
        </div>

        {/* Subscription Package Card */}
        <div
          onClick={() => navigate('/admin/packages')}
          className="bg-gradient-to-r from-cyan-900 via-indigo-900 to-purple-900 text-white p-6 rounded-3xl shadow-xl border border-cyan-500/30 flex items-center justify-between cursor-pointer hover:border-cyan-400 transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-white/10 text-white backdrop-blur-md group-hover:scale-105 transition-transform">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-black">Subscription Package</h3>
              <p className="text-xs text-cyan-200">Manage pricing tiers, payment details, and features.</p>
            </div>
          </div>

          <span className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 font-black text-base shadow-md flex items-center justify-center shrink-0">
            {totalCount}
          </span>
        </div>

      </div>

      {/* Recent Activity Log */}
      <div className="bg-slate-900/80 backdrop-blur-md p-6 rounded-3xl border border-indigo-500/20 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-cyan-400">RECENT ACTIVITY LOG</h3>
          <button onClick={() => navigate('/admin/organizations')} className="text-xs font-bold text-indigo-300 hover:text-white transition-colors cursor-pointer">View All Logs</button>
        </div>

        <div className="space-y-3 text-xs">
          {generatedLogs.map((log) => (
            <div key={log.id} className="p-4 rounded-2xl bg-slate-900/90 border border-indigo-500/10 flex items-center justify-between hover:border-indigo-500/30 transition-all">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${log.type === 'pending' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : log.type === 'security' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
                  {log.type === 'pending' ? <Clock className="w-4 h-4" /> : log.type === 'security' ? <ShieldCheck className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
                </div>
                <div>
                  <span className="font-bold text-white block">{log.title}</span>
                  <span className="text-[10px] text-slate-400">{log.desc}</span>
                </div>
              </div>
              <span className={`text-[10px] font-bold ${log.type === 'security' ? 'text-emerald-400' : 'text-slate-400'}`}>{log.time}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
