import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, RefreshCw, MessageSquare, Clock, UserCheck, CheckCircle2, AlertCircle, ArrowUpRight, Search, Filter } from 'lucide-react';
import ToastContainer, { type ToastMessage } from '@/components/Toast';

export interface MonitoredChat {
  sessionId: string;
  publicAgentKey: string;
  customerName: string;
  channel: 'web' | 'whatsapp' | 'messenger' | 'sms';
  status: 'HANDOFF_REQUESTED' | 'HUMAN_ACTIVE' | 'CLOSED';
  lastMessage: string;
  assignedAgent?: string;
  updatedAt: string;
}

export default function ChatMonitor() {
  const navigate = useNavigate();
  const [chats, setChats] = useState<MonitoredChat[]>([
    {
      sessionId: 'sess-a20c71b1',
      publicAgentKey: 'customer-care',
      customerName: 'Kamal Perera',
      channel: 'web',
      status: 'HANDOFF_REQUESTED',
      lastMessage: 'I need help setting up my Fiber ONU router.',
      updatedAt: '2 mins ago',
    },
    {
      sessionId: 'sess-73b122d1',
      publicAgentKey: 'customer-care',
      customerName: 'Dilini Fernando',
      channel: 'whatsapp',
      status: 'HUMAN_ACTIVE',
      lastMessage: 'Checking transaction ID TXN-88219482 now.',
      assignedAgent: 'Sam Taylor',
      updatedAt: '5 mins ago',
    },
    {
      sessionId: 'sess-9ec1d1f8',
      publicAgentKey: 'sales-guide',
      customerName: 'Roshan Silva',
      channel: 'web',
      status: 'CLOSED',
      lastMessage: 'Customer package selected and inquiry resolved.',
      assignedAgent: 'Kasun Kalhara',
      updatedAt: '1 hour ago',
    },
  ]);

  const [filter, setFilter] = useState<'ALL' | 'HANDOFF_REQUESTED' | 'HUMAN_ACTIVE' | 'CLOSED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
  };
  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      addToast('Chat monitor sessions refreshed', 'info');
    }, 600);
  };

  const filteredChats = chats.filter((c) => {
    if (filter !== 'ALL' && c.status !== filter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        c.sessionId.toLowerCase().includes(q) ||
        c.customerName.toLowerCase().includes(q) ||
        c.publicAgentKey.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const waitingCount = chats.filter((c) => c.status === 'HANDOFF_REQUESTED').length;
  const activeCount = chats.filter((c) => c.status === 'HUMAN_ACTIVE').length;
  const closedCount = chats.filter((c) => c.status === 'CLOSED').length;

  return (
    <div className="space-y-6 font-sans max-w-7xl mx-auto w-full">
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-3xl border border-indigo-900/50 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-cyan-400 shadow-md">
            <Eye className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-tight">Live Chat Monitor</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-cyan-300 border border-indigo-500/30 text-[10px] font-black uppercase tracking-wider">
                Audited Sessions
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Review waiting, active, and recently closed human-assistance customer sessions in real-time.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            className="px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => navigate('/agent/console')}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>Open Live Agent Console</span>
          </button>
        </div>
      </div>

      {/* Stats Counter Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Waiting Handoffs</span>
            <div className="text-2xl font-black text-amber-600 mt-0.5">{waitingCount}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            ⏳
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Human Chats</span>
            <div className="text-2xl font-black text-indigo-600 mt-0.5">{activeCount}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            💬
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Resolved Today</span>
            <div className="text-2xl font-black text-emerald-600 mt-0.5">{closedCount}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            ✓
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {[
            { id: 'ALL', label: `All Chats (${chats.length})` },
            { id: 'HANDOFF_REQUESTED', label: `Waiting (${waitingCount})` },
            { id: 'HUMAN_ACTIVE', label: `Active (${activeCount})` },
            { id: 'CLOSED', label: `Closed (${closedCount})` },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilter(item.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                filter === item.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by session or customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
          />
        </div>
      </div>

      {/* Sessions Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-5">Session ID</th>
                <th className="py-3 px-5">Customer & Channel</th>
                <th className="py-3 px-5">Target Agent</th>
                <th className="py-3 px-5">Latest Activity</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5">Assigned</th>
                <th className="py-3 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredChats.map((c) => (
                <tr key={c.sessionId} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-4 px-5 font-mono text-[11px] text-slate-700 font-bold">{c.sessionId}</td>
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{c.customerName}</span>
                      <span className="px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded text-[9px] uppercase font-mono">
                        {c.channel}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-5 font-mono text-indigo-600 font-semibold">{c.publicAgentKey}</td>
                  <td className="py-4 px-5 max-w-xs text-slate-500 truncate">{c.lastMessage}</td>
                  <td className="py-4 px-5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 w-max ${
                        c.status === 'HANDOFF_REQUESTED'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200 animate-pulse'
                          : c.status === 'HUMAN_ACTIVE'
                          ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          c.status === 'HANDOFF_REQUESTED'
                            ? 'bg-amber-500'
                            : c.status === 'HUMAN_ACTIVE'
                            ? 'bg-indigo-500'
                            : 'bg-slate-400'
                        }`}
                      />
                      {c.status === 'HANDOFF_REQUESTED'
                        ? 'Waiting Handoff'
                        : c.status === 'HUMAN_ACTIVE'
                        ? 'Human Active'
                        : 'Closed'}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-slate-700">{c.assignedAgent || '—'}</td>
                  <td className="py-4 px-5 text-right">
                    <button
                      onClick={() => navigate('/agent/console')}
                      className="px-3 py-1 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition-colors cursor-pointer"
                    >
                      Console
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
