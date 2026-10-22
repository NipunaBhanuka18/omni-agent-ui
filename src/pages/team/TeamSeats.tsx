import React, { useState } from 'react';
import { Users, UserPlus, Shield, Headset, CheckCircle2, Clock, AlertCircle, Plus, Send, ChevronRight, Sparkles } from 'lucide-react';
import ToastContainer, { type ToastMessage } from '@/components/Toast';

export interface WorkspaceMember {
  userId: string;
  name: string;
  email: string;
  role: 'COMPANY_ADMIN' | 'LIVE_AGENT';
  status: 'ACTIVE' | 'INVITED';
  joinedDate: string;
}

export interface SeatRequest {
  requestId: string;
  adminSeats: number;
  liveAgentSeats: number;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

export default function TeamSeats() {
  const [workspace, setWorkspace] = useState({
    companyName: 'SLT-Mobitel Digital Solutions',
    tenantSlug: 'slt-digital',
    tenantId: 'ten_slt_9921',
    plan: 'STARTER WORKSPACE',
    adminSeatLimit: 2,
    usedAdminSeats: 1,
    liveAgentSeatLimit: 5,
    usedLiveAgentSeats: 2,
  });

  const [members, setMembers] = useState<WorkspaceMember[]>([
    {
      userId: 'usr-admin-1',
      name: 'Kasun Kalhara',
      email: 'admin@sltdigital.lk',
      role: 'COMPANY_ADMIN',
      status: 'ACTIVE',
      joinedDate: 'Sep 01, 2026',
    },
    {
      userId: 'usr-agent-1',
      name: 'Sam Taylor',
      email: 'sam.t@sltdigital.lk',
      role: 'LIVE_AGENT',
      status: 'ACTIVE',
      joinedDate: 'Sep 02, 2026',
    },
    {
      userId: 'usr-agent-2',
      name: 'Dilani Perera',
      email: 'dilani.p@sltdigital.lk',
      role: 'LIVE_AGENT',
      status: 'INVITED',
      joinedDate: 'Oct 15, 2026',
    },
  ]);

  const [seatRequests, setSeatRequests] = useState<SeatRequest[]>([
    {
      requestId: 'req-9841',
      adminSeats: 1,
      liveAgentSeats: 3,
      reason: 'Expanding customer support coverage for the new Fiber ONU rollout.',
      status: 'PENDING',
      createdAt: '2 days ago',
    },
  ]);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
  };
  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Modals
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isSeatRequestModalOpen, setIsSeatRequestModalOpen] = useState(false);

  // Invite Form
  const [inviteData, setInviteData] = useState({
    name: '',
    email: '',
    role: 'LIVE_AGENT' as 'COMPANY_ADMIN' | 'LIVE_AGENT',
  });

  // Seat Request Form
  const [requestData, setRequestData] = useState({
    adminSeats: 0,
    liveAgentSeats: 2,
    reason: '',
  });

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteData.name || !inviteData.email) {
      addToast('Please provide member name and work email', 'error');
      return;
    }

    // Check seat limits
    if (inviteData.role === 'COMPANY_ADMIN' && workspace.usedAdminSeats >= workspace.adminSeatLimit) {
      addToast('Company Admin seat limit reached. Please request additional seats first.', 'error');
      return;
    }
    if (inviteData.role === 'LIVE_AGENT' && workspace.usedLiveAgentSeats >= workspace.liveAgentSeatLimit) {
      addToast('Live Agent seat limit reached. Please request additional seats first.', 'error');
      return;
    }

    const newMember: WorkspaceMember = {
      userId: `usr-${Date.now()}`,
      name: inviteData.name,
      email: inviteData.email,
      role: inviteData.role,
      status: 'INVITED',
      joinedDate: 'Just now',
    };

    setMembers((prev) => [...prev, newMember]);
    setWorkspace((prev) => ({
      ...prev,
      usedAdminSeats: inviteData.role === 'COMPANY_ADMIN' ? prev.usedAdminSeats + 1 : prev.usedAdminSeats,
      usedLiveAgentSeats: inviteData.role === 'LIVE_AGENT' ? prev.usedLiveAgentSeats + 1 : prev.usedLiveAgentSeats,
    }));

    setIsInviteModalOpen(false);
    setInviteData({ name: '', email: '', role: 'LIVE_AGENT' });
    addToast(`Invitation sent to ${newMember.email} with temporary credentials!`, 'success');
  };

  const handleSeatRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestData.reason.trim()) {
      addToast('Please explain the business reason for additional seats', 'error');
      return;
    }

    const newReq: SeatRequest = {
      requestId: `req-${Date.now().toString().slice(-4)}`,
      adminSeats: Number(requestData.adminSeats) || 0,
      liveAgentSeats: Number(requestData.liveAgentSeats) || 0,
      reason: requestData.reason,
      status: 'PENDING',
      createdAt: 'Just now',
    };

    setSeatRequests((prev) => [newReq, ...prev]);
    setIsSeatRequestModalOpen(false);
    setRequestData({ adminSeats: 0, liveAgentSeats: 2, reason: '' });
    addToast('Seat expansion request submitted to Super Admin for approval.', 'success');
  };

  const adminPercent = Math.min(100, Math.round((workspace.usedAdminSeats / workspace.adminSeatLimit) * 100));
  const livePercent = Math.min(100, Math.round((workspace.usedLiveAgentSeats / workspace.liveAgentSeatLimit) * 100));

  return (
    <div className="space-y-6 font-sans max-w-7xl mx-auto w-full">
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* Workspace Plan Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-3xl border border-indigo-900/50 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/30 text-cyan-300 border border-indigo-400/30 text-[10px] font-black uppercase tracking-wider">
              {workspace.plan}
            </span>
            <span className="font-mono text-xs text-slate-400">ID: {workspace.tenantId}</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight mt-1">{workspace.companyName}</h1>
          <p className="text-xs text-slate-300 mt-0.5">
            Role-based workspace access is tenant-isolated with verified Cognito boundaries.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsSeatRequestModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs transition-all cursor-pointer"
          >
            Request Seats
          </button>
          <button
            onClick={() => setIsInviteModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Invite Member</span>
          </button>
        </div>
      </div>

      {/* Seat Allocation Meter Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Company Admin Seat Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">Company Admin Seats</h3>
                <p className="text-xs text-slate-500">Full control over agents, tools, knowledge, and settings</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-slate-900">{workspace.usedAdminSeats}</span>
              <span className="text-xs font-bold text-slate-400"> / {workspace.adminSeatLimit}</span>
            </div>
          </div>

          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                adminPercent >= 100 ? 'bg-amber-500' : 'bg-indigo-600'
              }`}
              style={{ width: `${adminPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
            <span>{workspace.adminSeatLimit - workspace.usedAdminSeats} seats remaining</span>
            <span>{adminPercent}% allocated</span>
          </div>
        </div>

        {/* Live Agent Seat Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600">
                <Headset className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">Live Agent Seats</h3>
                <p className="text-xs text-slate-500">Customer escalation queue and live chat agent console</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-slate-900">{workspace.usedLiveAgentSeats}</span>
              <span className="text-xs font-bold text-slate-400"> / {workspace.liveAgentSeatLimit}</span>
            </div>
          </div>

          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                livePercent >= 100 ? 'bg-amber-500' : 'bg-emerald-600'
              }`}
              style={{ width: `${livePercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
            <span>{workspace.liveAgentSeatLimit - workspace.usedLiveAgentSeats} seats remaining</span>
            <span>{livePercent}% allocated</span>
          </div>
        </div>
      </div>

      {/* Workspace Members Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-slate-900">Workspace Members</h3>
            <p className="text-xs text-slate-500">Users authorized under this company tenant</p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-black">
            {members.length} Total Users
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-5">Member</th>
                <th className="py-3 px-5">Work Email</th>
                <th className="py-3 px-5">Role</th>
                <th className="py-3 px-5">Account Status</th>
                <th className="py-3 px-5">Added</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {members.map((m) => (
                <tr key={m.userId} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-black flex items-center justify-center text-xs">
                        {m.name.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="font-bold text-slate-900">{m.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-5 text-slate-600 font-mono text-[11px]">{m.email}</td>
                  <td className="py-4 px-5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        m.role === 'COMPANY_ADMIN'
                          ? 'bg-purple-100 text-purple-700 border border-purple-200'
                          : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {m.role === 'COMPANY_ADMIN' ? 'Company Admin' : 'Live Agent'}
                    </span>
                  </td>
                  <td className="py-4 px-5">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        m.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {m.status}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-slate-400">{m.joinedDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Seat Expansion Requests History */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h3 className="text-base font-black text-slate-900">Seat Expansion Requests</h3>
          <p className="text-xs text-slate-500">History of quota increase requests</p>
        </div>

        {seatRequests.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-5">Request ID</th>
                  <th className="py-3 px-5">Admin Seats</th>
                  <th className="py-3 px-5">Live Seats</th>
                  <th className="py-3 px-5">Business Reason</th>
                  <th className="py-3 px-5">Status</th>
                  <th className="py-3 px-5">Submitted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {seatRequests.map((req) => (
                  <tr key={req.requestId}>
                    <td className="py-3 px-5 font-mono font-bold text-slate-800">{req.requestId}</td>
                    <td className="py-3 px-5 text-indigo-600 font-bold">+{req.adminSeats}</td>
                    <td className="py-3 px-5 text-emerald-600 font-bold">+{req.liveAgentSeats}</td>
                    <td className="py-3 px-5 text-slate-600 max-w-xs truncate">{req.reason}</td>
                    <td className="py-3 px-5">
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black uppercase">
                        {req.status}
                      </span>
                    </td>
                    <td className="py-3 px-5 text-slate-400">{req.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-slate-400">No seat requests submitted yet.</div>
        )}
      </div>

      {/* === MODAL: INVITE MEMBER === */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Invite Workspace Member</h3>
                  <p className="text-xs text-slate-500">Send an invitation to join this company workspace</p>
                </div>
              </div>
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg p-1"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleInviteSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sam Taylor"
                  value={inviteData.name}
                  onChange={(e) => setInviteData({ ...inviteData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Work Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="support@sltdigital.lk"
                  value={inviteData.email}
                  onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Workspace Role *
                </label>
                <select
                  value={inviteData.role}
                  onChange={(e) => setInviteData({ ...inviteData, role: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                >
                  <option value="LIVE_AGENT">Live Agent (Human Assistance Queue)</option>
                  <option value="COMPANY_ADMIN">Company Admin (Full Management)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* === MODAL: REQUEST SEATS === */}
      {isSeatRequestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900">Request Additional Seats</h3>
                <p className="text-xs text-slate-500">Expand your admin or live agent seat quota</p>
              </div>
              <button
                onClick={() => setIsSeatRequestModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg p-1"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSeatRequestSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Additional Admin Seats
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={requestData.adminSeats}
                    onChange={(e) => setRequestData({ ...requestData, adminSeats: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Additional Live Seats
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={requestData.liveAgentSeats}
                    onChange={(e) => setRequestData({ ...requestData, liveAgentSeats: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Business Reason *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Expected team growth, support volume, or rollout schedule..."
                  value={requestData.reason}
                  onChange={(e) => setRequestData({ ...requestData, reason: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsSeatRequestModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
