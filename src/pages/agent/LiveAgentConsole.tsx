import React, { useState, useEffect, useRef } from 'react';
import { Headset, Power, MessageSquare, Send, User, CheckCircle2, Clock, Shield, Search, RefreshCw, AlertCircle } from 'lucide-react';
import { apiClient } from '@/api/apiClient';
import { ENV } from '@/config/env';
import { useAuthStore } from '@/store/authStore';

interface ChatSession {
  id: string;
  customerName: string;
  channel: 'web' | 'whatsapp' | 'messenger' | 'sms';
  tenantId: string;
  lastMessage: string;
  timestamp: string;
  status: 'QUEUED' | 'ACTIVE' | 'RESOLVED';
  unreadCount?: number;
}

interface ChatMessage {
  id: string;
  sender: 'customer' | 'agent' | 'system';
  text: string;
  timestamp: string;
}

export default function LiveAgentConsole() {
  const { user } = useAuthStore();
  const [isOnline, setIsOnline] = useState(true);
  const [presenceLoading, setPresenceLoading] = useState(false);
  const [sessions, setSessions] = useState<ChatSession[]>([
    {
      id: 'sess-001',
      customerName: 'Kamal Perera',
      channel: 'web',
      tenantId: user?.tenantId || 'slt',
      lastMessage: 'I need help setting up my Fiber ONU router.',
      timestamp: 'Just now',
      status: 'QUEUED',
      unreadCount: 1,
    },
    {
      id: 'sess-002',
      customerName: 'Dilini Fernando',
      channel: 'whatsapp',
      tenantId: user?.tenantId || 'slt',
      lastMessage: 'Can someone check my bill payment for September?',
      timestamp: '5m ago',
      status: 'ACTIVE',
      unreadCount: 0,
    },
  ]);

  const [activeSessionId, setActiveSessionId] = useState<string>('sess-001');
  const [messagesMap, setMessagesMap] = useState<Record<string, ChatMessage[]>>({
    'sess-001': [
      { id: 'm-1', sender: 'customer', text: 'Hello, the AI bot referred me to a human agent.', timestamp: '10:14 AM' },
      { id: 'm-2', sender: 'system', text: 'Escalation triggered by Customer. Session assigned to Live Agent Queue.', timestamp: '10:15 AM' },
      { id: 'm-3', sender: 'customer', text: 'I need help setting up my Fiber ONU router.', timestamp: '10:15 AM' },
    ],
    'sess-002': [
      { id: 'm-10', sender: 'customer', text: 'Can someone check my bill payment for September?', timestamp: '10:05 AM' },
      { id: 'm-11', sender: 'agent', text: 'Hello Dilini, I am checking your transaction ID TXN-88219482 now.', timestamp: '10:06 AM' },
    ],
  });

  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];
  const currentMessages = messagesMap[activeSessionId] || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages]);

  // Handle Presence Toggle (POST /agent/presence/online or /offline)
  const togglePresence = async () => {
    setPresenceLoading(true);
    const targetState = !isOnline;
    const endpoint = targetState ? '/agent/presence/online' : '/agent/presence/offline';

    try {
      await apiClient.post(endpoint, {
        agentId: user?.id || 'agent-01',
        tenantId: user?.tenantId || 'slt',
      });
      setIsOnline(targetState);
    } catch {
      // Simulation mode fallback
      setIsOnline(targetState);
    } finally {
      setPresenceLoading(false);
    }
  };

  // Send Live Chat Message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeSessionId) return;

    const newMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      sender: 'agent',
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessagesMap((prev) => ({
      ...prev,
      [activeSessionId]: [...(prev[activeSessionId] || []), newMsg],
    }));

    setSessions((prev) =>
      prev.map((s) =>
        s.id === activeSessionId ? { ...s, lastMessage: inputText.trim(), status: 'ACTIVE' } : s
      )
    );

    const sentText = inputText;
    setInputText('');

    try {
      await apiClient.post(`/tenant/${user?.tenantId || 'slt'}/agent/inbox/message`, {
        sessionId: activeSessionId,
        text: sentText,
        sender: 'agent',
      });
    } catch {
      // Request sent in simulation mode
    }
  };

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col font-sans space-y-4 max-w-7xl mx-auto w-full">
      {/* Top Banner Header with Presence Toggle */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-4 sm:p-5 rounded-3xl border border-indigo-900/50 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-cyan-400 shadow-md">
            <Headset className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight">Live Agent Inbox & Presence Console</h1>
            <p className="text-xs text-slate-300">
              Agent ID: <span className="font-mono text-cyan-300">{user?.email || 'live_agent@slt.lk'}</span> | Tenant: <span className="font-mono text-emerald-300">{user?.tenantId || 'slt'}</span>
            </p>
          </div>
        </div>

        {/* Online / Offline Presence Switcher */}
        <div className="flex items-center gap-3 bg-slate-800/80 p-2 rounded-2xl border border-slate-700">
          <div className="flex items-center gap-2 px-2">
            <span className={`w-3 h-3 rounded-full ${isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
              {isOnline ? 'ONLINE (READY FOR CHATS)' : 'OFFLINE (INACTIVE)'}
            </span>
          </div>

          <button
            onClick={togglePresence}
            disabled={presenceLoading}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md ${
              isOnline
                ? 'bg-rose-600 hover:bg-rose-700 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            <Power className="w-3.5 h-3.5" />
            <span>{presenceLoading ? 'Updating...' : isOnline ? 'Go Offline' : 'Go Online'}</span>
          </button>
        </div>
      </div>

      {/* Main Console Split View */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 min-h-0">
        
        {/* Left Column: Queued & Active Customer Sessions List */}
        <div className="md:col-span-4 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase text-slate-700 tracking-wider">Incoming Queues</h3>
              <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-black">
                {sessions.length} Active
              </span>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search customers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {sessions.map((s) => {
              const active = s.id === activeSessionId;
              return (
                <div
                  key={s.id}
                  onClick={() => setActiveSessionId(s.id)}
                  className={`p-3.5 transition-all cursor-pointer flex items-start justify-between gap-2 ${
                    active ? 'bg-indigo-50/80 border-l-4 border-indigo-600' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900 truncate">{s.customerName}</span>
                      <span className="px-1.5 py-0.2 rounded bg-slate-200 text-slate-600 text-[9px] font-mono uppercase">
                        {s.channel}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">{s.lastMessage}</p>
                  </div>

                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-[10px] text-slate-400">{s.timestamp}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        s.status === 'QUEUED'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {s.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Live Chat Window */}
        <div className="md:col-span-8 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          {/* Active Chat Header */}
          {activeSession ? (
            <>
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white font-black flex items-center justify-center text-sm shadow-sm">
                    {activeSession.customerName.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-slate-900">{activeSession.customerName}</h3>
                    <span className="text-[10px] text-slate-400 block font-mono">
                      Session ID: {activeSession.id} | Channel: {activeSession.channel.toUpperCase()}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSessions((prev) =>
                      prev.map((s) => (s.id === activeSessionId ? { ...s, status: 'RESOLVED' } : s))
                    );
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-xs font-bold border border-emerald-300 transition-colors"
                >
                  Mark Session Resolved
                </button>
              </div>

              {/* Chat Messages List */}
              <div className="flex-1 p-4 bg-slate-50 overflow-y-auto space-y-3">
                {currentMessages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex ${m.sender === 'agent' ? 'justify-end' : m.sender === 'customer' ? 'justify-start' : 'justify-center'}`}
                  >
                    {m.sender === 'system' ? (
                      <div className="px-3 py-1 rounded-full bg-slate-200 text-slate-600 text-[10px] font-semibold">
                        {m.text}
                      </div>
                    ) : (
                      <div
                        className={`p-3 rounded-2xl max-w-[80%] text-xs shadow-xs ${
                          m.sender === 'agent'
                            ? 'bg-indigo-600 text-white rounded-br-none font-medium'
                            : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                        }`}
                      >
                        <p className="leading-relaxed">{m.text}</p>
                        <span className={`text-[9px] block text-right mt-1 ${m.sender === 'agent' ? 'text-indigo-200' : 'text-slate-400'}`}>
                          {m.timestamp}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Bar */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 bg-white flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Type message to customer..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md flex items-center gap-1.5"
                >
                  <span>Send</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-slate-400 text-xs">
              <MessageSquare className="w-10 h-10 mb-2" />
              <span>Select a customer session to start live chat.</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
