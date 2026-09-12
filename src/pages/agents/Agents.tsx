import React, { useState } from 'react';
import { Bot, Shield, Play, Terminal, Cpu, Database, CheckCircle2, AlertTriangle, RefreshCw, Send, Plus, ArrowLeft, Building2 } from 'lucide-react';
import Button from '@/components/Button';
import InputField from '@/components/InputField';

export default function Agents() {
  const [selectedOrg, setSelectedOrg] = useState<string | null>('ABC Company (pvt) Ltd');
  const [activeChannelTab, setActiveChannelTab] = useState<'whatsapp' | 'messenger' | 'sms' | 'email'>('whatsapp');
  const [showTestDrawer, setShowTestDrawer] = useState(false);
  const [showKnowledgeModal, setShowKnowledgeModal] = useState(false);
  const [selectedBaseModel, setSelectedBaseModel] = useState('gpt4');

  // Test Chat Drawer State
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: 'Hello! I am Omni Agent WhatsApp v3.0. How can I assist you with SLT services today?' }
  ]);
  const [inputMessage, setInputMessage] = useState('');

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

  const agentConfigByChannel = {
    whatsapp: { name: 'Omni Whatsapp Agent v.3.0', status: 'Online', model: 'SLT-LLM-v3.0' },
    messenger: { name: 'Omni Messenger Agent v.2.0', status: 'Online', model: 'SLT-LLM-v2.0' },
    sms: { name: 'Omni SMS Agent v.1.0', status: 'Online', model: 'SLT-LLM-v1.0' },
    email: { name: 'Omni Email Agent v.2.4', status: 'Online', model: 'SLT-LLM-v2.4' },
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMsg = { id: Date.now(), sender: 'user', text: inputMessage };
    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');

    setTimeout(() => {
      const botReply = {
        id: Date.now() + 1,
        sender: 'bot',
        text: `[AI Agent ${agentConfigByChannel[activeChannelTab].name} Response]: Processed request for "${inputMessage}". All systems operating nominally.`
      };
      setMessages((prev) => [...prev, botReply]);
    }, 600);
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* 1. If No Organization Selected -> Show Organization Selector Grid (Matching Image 3 Top) */}
      {!selectedOrg ? (
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Select The Organization</h1>
            <p className="text-xs text-slate-500">Select the Organization (Company) to manage the AI Agent of its.</p>
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
        /* 2. Super Admin AI Agent Management View (Matching Images 3, 4, 5) */
        <div className="space-y-6">
          
          {/* Top Banner with Selected Org Header Badge */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-3xl shadow-xl border border-indigo-900/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <button
                onClick={() => setSelectedOrg(null)}
                className="text-xs font-bold text-cyan-400 hover:underline flex items-center gap-1 mb-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Switch Organization</span>
              </button>
              <h1 className="text-2xl font-black tracking-tight">AI Agent</h1>
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

          {/* Channel AI Agent Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs">
            <button
              onClick={() => setActiveChannelTab('whatsapp')}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeChannelTab === 'whatsapp'
                  ? 'bg-purple-900 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              Whatsapp Agent
            </button>
            <button
              onClick={() => setActiveChannelTab('messenger')}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeChannelTab === 'messenger'
                  ? 'bg-purple-900 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              Messenger Agent
            </button>
            <button
              onClick={() => setActiveChannelTab('sms')}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeChannelTab === 'sms'
                  ? 'bg-purple-900 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              SMS Agent
            </button>
            <button
              onClick={() => setActiveChannelTab('email')}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeChannelTab === 'email'
                  ? 'bg-purple-900 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              Email Agent
            </button>
          </div>

          {/* AI Agent Fleet Cards Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900">AI Agent Fleet</h3>
              <button
                onClick={() => setShowKnowledgeModal(true)}
                className="text-xs font-bold text-purple-600 hover:underline"
              >
                Manage Knowledge Base
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Nexus-1 Support Bot Card */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-cyan-50 text-cyan-600">
                      <Bot className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900">Nexus-1 Support Bot</h4>
                      <span className="text-[10px] text-slate-400">Model: SLT-LLM-v3.0 + RAG</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">ACTIVE</span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-slate-500">Response Accuracy</span>
                    <span className="text-emerald-600">97.8%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full w-[97.8%]" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold">Active Chats</span>
                    <span className="font-bold text-slate-900">142</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold">Avg Latency</span>
                    <span className="font-bold text-slate-900">0.8s</span>
                  </div>
                </div>
              </div>

              {/* Sentinel Guard Card */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-purple-50 text-purple-600">
                      <Shield className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900">Sentinel Guard</h4>
                      <span className="text-[10px] text-slate-400">Model: SLT-Guard-v1.5</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">ACTIVE</span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-slate-500">Threat Protection</span>
                    <span className="text-purple-600">99.4%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="bg-purple-600 h-full w-[99.4%]" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold">Scanned Intent</span>
                    <span className="font-bold text-slate-900">2,201</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold">True Positive</span>
                    <span className="font-bold text-slate-900">100%</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Channel Agent Test Control Bar */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-purple-600 text-white">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">{agentConfigByChannel[activeChannelTab].name}</h3>
                <span className="text-[10px] font-bold text-emerald-600">● {agentConfigByChannel[activeChannelTab].status} ({agentConfigByChannel[activeChannelTab].model})</span>
              </div>
            </div>

            <button
              onClick={() => setShowTestDrawer(true)}
              className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-xs shadow-md flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              <span>Test Agent</span>
            </button>
          </div>

          {/* System Runtime Logs & Base Model Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* System Runtime Logs Terminal (8 cols) */}
            <div className="lg:col-span-8 bg-slate-900 text-slate-200 p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">SYSTEM RUNTIME LOGS</h4>
                </div>
                <span className="text-[10px] font-mono text-slate-500">Node: slt-edge-colombo-01</span>
              </div>

              <div className="font-mono text-[11px] leading-relaxed space-y-1.5 h-44 overflow-y-auto pr-2 text-slate-400">
                <p><span className="text-emerald-400">[2023-11-20 14:22:01]</span> <span className="text-cyan-400">INFO:</span> Initializing Gateway Node 01 Router...</p>
                <p><span className="text-emerald-400">[2023-11-20 14:22:05]</span> <span className="text-cyan-400">INFO:</span> WhatsApp webhook live connection established.</p>
                <p><span className="text-emerald-400">[2023-11-20 14:22:12]</span> <span className="text-amber-400">ACTION:</span> Download index key embedding from SLT_RAG_Base_v2.</p>
                <p><span className="text-emerald-400">[2023-11-20 14:22:20]</span> <span className="text-cyan-400">INFO:</span> Messenger AI Agent Model slt-llm-v2.0 re-eval completed.</p>
                <p><span className="text-emerald-400">[2023-11-20 14:22:31]</span> <span className="text-cyan-400">INFO:</span> Security Audit verified. 0 vulnerability incursions.</p>
              </div>
            </div>

            {/* Base Model Selection Card (4 cols) */}
            <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-slate-900">Base Model</h4>
                <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[9px] font-bold">SLT-LLM</span>
              </div>

              <div className="space-y-3">
                <div
                  onClick={() => setSelectedBaseModel('gpt4')}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    selectedBaseModel === 'gpt4' ? 'bg-purple-50 border-purple-300 ring-2 ring-purple-500/20' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">GPT-4-Turbo</h5>
                    <span className="text-[10px] text-slate-400 block">Fast fine-tuned model for SLT</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-700">3.25/t</span>
                </div>

                <div
                  onClick={() => setSelectedBaseModel('llama')}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    selectedBaseModel === 'llama' ? 'bg-purple-50 border-purple-300 ring-2 ring-purple-500/20' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">Llama-3 70B</h5>
                    <span className="text-[10px] text-slate-400 block">Open-weights on-prem model</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-700">0.85/t</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* Live Agent Test Drawer */}
      {showTestDrawer && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex justify-end">
          <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bot className="w-6 h-6 text-cyan-400" />
                <div>
                  <h3 className="text-sm font-bold">{agentConfigByChannel[activeChannelTab].name}</h3>
                  <span className="text-[10px] text-emerald-400">● Live Test Mode Active</span>
                </div>
              </div>
              <button onClick={() => setShowTestDrawer(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="p-6 flex-1 overflow-y-auto space-y-4 bg-slate-50">
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-3.5 rounded-2xl max-w-[80%] text-xs ${
                    m.sender === 'user' ? 'bg-purple-600 text-white rounded-br-none' : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-xs'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200 bg-white flex gap-2">
              <input
                type="text"
                placeholder="Type test message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
              />
              <button type="submit" className="p-2.5 rounded-xl bg-purple-600 text-white hover:bg-purple-700">
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Knowledge Base Modal */}
      {showKnowledgeModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full border border-slate-200 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Manage Knowledge Base Documents</h3>
            <p className="text-xs text-slate-500">Upload PDF, Docx, or CSV files to enrich your AI Agent's RAG knowledge embeddings.</p>

            <div className="border-2 border-dashed border-slate-300 p-8 rounded-2xl text-center space-y-2 hover:border-purple-500 transition-colors cursor-pointer bg-slate-50">
              <Database className="w-8 h-8 text-purple-600 mx-auto" />
              <span className="text-xs font-bold text-slate-700 block">Click to upload files</span>
              <span className="text-[10px] text-slate-400 block">PDF, DOCX, CSV up to 25MB</span>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                onClick={() => setShowKnowledgeModal(false)}
                className="px-5 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs"
              >
                Close Modal
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
