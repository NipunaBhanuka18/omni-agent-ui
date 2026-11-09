import React, { useState } from 'react';
import { Bot, Shield, Play, Terminal, Cpu, Database, CheckCircle2, AlertTriangle, RefreshCw, Send, Plus, ArrowLeft, Building2, X } from 'lucide-react';
import Button from '@/components/Button';
import InputField from '@/components/InputField';
import { apiClient } from '@/api/apiClient';

export default function Agents() {
  const [selectedOrg, setSelectedOrg] = useState<string | null>('ABC Company (pvt) Ltd');
  const [activeChannelTab, setActiveChannelTab] = useState<'whatsapp' | 'messenger' | 'sms' | 'email'>('whatsapp');
  const [showTestDrawer, setShowTestDrawer] = useState(false);
  const [showKnowledgeModal, setShowKnowledgeModal] = useState(false);
  const [showCreateAgentModal, setShowCreateAgentModal] = useState(false);
  const [newAgentName, setNewAgentName] = useState('');
  const [newAgentPrompt, setNewAgentPrompt] = useState('You are an helpful AI customer support agent for SLT.');
  const [selectedBaseModel, setSelectedBaseModel] = useState('gpt4');

  // Create AI agent form state (matching MVP console specification)
  const initialAgentForm = {
    displayName: '',
    publicAgentKey: '',
    brandName: '',
    modelId: 'amazon.nova-lite-v1:0',
    knowledgeBaseRef: '',
    suggestedPrompts: '',
    toolIds: [] as string[],
    enabledSubAgents: ['general', 'sales', 'billing', 'technical', 'lead'] as string[],
    welcomeMessage: '',
    systemPrompt: '',
  };

  const [createAgentForm, setCreateAgentForm] = useState(initialAgentForm);
  const [isSavingAgent, setIsSavingAgent] = useState(false);

  // Dynamic Fleet State (persisted in local storage and synced with backend)
  const [agentFleet, setAgentFleet] = useState<any[]>(() => {
    const cached = typeof window !== 'undefined' ? localStorage.getItem('omni_agent_fleet') : null;
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}
    }
    return [
      {
        agentId: 'agent-nexus-1',
        displayName: 'Nexus-1 Support Bot',
        modelId: 'SLT-LLM-v3.0 + RAG',
        brandName: 'SLT Global',
        publicAgentKey: 'nexus-support',
        status: 'ACTIVE',
        accuracy: '97.8%',
        activeChats: 142,
        avgLatency: '0.8s',
        toolsCount: 3,
        subAgentsCount: 5,
      },
      {
        agentId: 'agent-sentinel',
        displayName: 'Sentinel Guard',
        modelId: 'SLT-Guard-v1.5',
        brandName: 'SLT Global',
        publicAgentKey: 'sentinel-guard',
        status: 'ACTIVE',
        accuracy: '99.4%',
        activeChats: 2201,
        avgLatency: '0.2s',
        toolsCount: 2,
        subAgentsCount: 3,
      },
    ];
  });

  const availableTools = [
    { id: 'create_ticket', label: 'Create support ticket · mcp' },
    { id: 'check_order', label: 'Check order status · api' },
    { id: 'sales_form', label: 'Sales interest form · form' },
  ];

  const availableSubAgents = [
    { id: 'general', label: 'general' },
    { id: 'sales', label: 'sales' },
    { id: 'billing', label: 'billing' },
    { id: 'technical', label: 'technical' },
    { id: 'lead', label: 'lead' },
  ];

  const toggleTool = (toolId: string) => {
    setCreateAgentForm((prev) => ({
      ...prev,
      toolIds: prev.toolIds.includes(toolId)
        ? prev.toolIds.filter((id) => id !== toolId)
        : [...prev.toolIds, toolId],
    }));
  };

  const toggleSubAgent = (agentKey: string) => {
    setCreateAgentForm((prev) => ({
      ...prev,
      enabledSubAgents: prev.enabledSubAgents.includes(agentKey)
        ? prev.enabledSubAgents.filter((key) => key !== agentKey)
        : [...prev.enabledSubAgents, agentKey],
    }));
  };

  const handleSaveAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingAgent(true);

    const payload = {
      displayName: createAgentForm.displayName.trim() || 'Customer Support Agent',
      publicAgentKey: (
        createAgentForm.publicAgentKey.trim() ||
        createAgentForm.displayName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') ||
        'agent-draft'
      ).toLowerCase(),
      brandName: createAgentForm.brandName.trim(),
      modelId: createAgentForm.modelId.trim() || 'amazon.nova-lite-v1:0',
      knowledgeBaseRef: createAgentForm.knowledgeBaseRef.trim(),
      suggestedPrompts: createAgentForm.suggestedPrompts
        ? createAgentForm.suggestedPrompts.split(',').map((s) => s.trim()).filter(Boolean)
        : [],
      toolIds: createAgentForm.toolIds,
      enabledSubAgents: createAgentForm.enabledSubAgents.length > 0
        ? createAgentForm.enabledSubAgents
        : ['general', 'sales', 'billing', 'technical', 'lead'],
      welcomeMessage: createAgentForm.welcomeMessage.trim(),
      systemPrompt: createAgentForm.systemPrompt.trim(),
    };

    const newAgentItem = {
      agentId: `agent-${Date.now()}`,
      displayName: payload.displayName,
      publicAgentKey: payload.publicAgentKey,
      brandName: payload.brandName || 'Dialog Axiata',
      modelId: payload.modelId,
      status: 'DRAFT',
      accuracy: '98.5%',
      activeChats: 0,
      avgLatency: '0.4s',
      toolsCount: payload.toolIds.length,
      subAgentsCount: payload.enabledSubAgents.length,
      welcomeMessage: payload.welcomeMessage,
      systemPrompt: payload.systemPrompt,
      createdAt: new Date().toISOString(),
    };

    // Immediately display newly created agent in UI
    setAgentFleet((prev) => {
      const filtered = prev.filter((a) => a.displayName !== newAgentItem.displayName);
      const updated = [newAgentItem, ...filtered];
      if (typeof window !== 'undefined') {
        localStorage.setItem('omni_agent_fleet', JSON.stringify(updated));
      }
      return updated;
    });

    try {
      const token = localStorage.getItem('omni_token') || 'dev-token-staff';
      const userJson = localStorage.getItem('omni_user');
      let tenantId = 'slt';
      if (userJson) {
        try {
          const u = JSON.parse(userJson);
          tenantId = u.tenantId || u['custom:tenant_id'] || 'slt';
        } catch { }
      }

      await fetch('http://localhost:3001/api/dev/admin/agents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token.startsWith('Bearer ') ? token : `Bearer ${token}`,
          'x-tenant-id': tenantId,
        },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.warn('Agent creation fallback to session state:', err);
    } finally {
      setIsSavingAgent(false);
      setShowCreateAgentModal(false);
      setCreateAgentForm(initialAgentForm);
    }
  };

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

  const handleSendMessage = async (e: React.FormEvent, intentOverride?: string, customText?: string) => {
    if (e) e.preventDefault();
    const textToSend = (customText || inputMessage).trim();
    if (!textToSend && !intentOverride) return;

    let intentToRun = intentOverride;
    if (!intentToRun) {
      const lower = textToSend.toLowerCase();
      if (lower.includes('usage') || lower.includes('data') || lower.includes('gb') || lower.includes('package')) {
        intentToRun = 'check_usage';
      } else if (lower.includes('router') || lower.includes('internet') || lower.includes('slow') || lower.includes('troubleshoot') || lower.includes('wifi') || lower.includes('light') || lower.includes('los')) {
        intentToRun = 'troubleshoot_router';
      } else if (lower.includes('pay') || lower.includes('payment')) {
        intentToRun = 'pay_bill';
      } else {
        intentToRun = 'check_balance';
      }
    }

    const userMsg = { id: Date.now(), sender: 'user', text: textToSend || `Run: ${intentToRun}` };
    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');

    try {
      const token = localStorage.getItem('omni_token') || 'dev-token-staff';
      const userJson = localStorage.getItem('omni_user');
      let tenantId = 'slt';
      if (userJson) {
        try {
          const u = JSON.parse(userJson);
          tenantId = u.tenantId || u['custom:tenant_id'] || 'slt';
        } catch {}
      }

      const res = await fetch('http://localhost:3001/api/agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token.startsWith('Bearer ') ? token : `Bearer ${token}`,
          'x-tenant-id': tenantId,
          'x-channel': activeChannelTab,
        },
        body: JSON.stringify({
          intent: intentToRun,
          params: { query: textToSend }
        })
      });

      const resData = await res.json();
      if (resData.success) {
        let replyStr = `[Backend Agent ${agentConfigByChannel[activeChannelTab].name}]: Intent '${intentToRun}' executed successfully.`;
        if (intentToRun === 'check_balance') {
          const bal = resData.data?.balance !== undefined ? resData.data.balance : resData.data?.currentBalance;
          replyStr = `[Billing Specialist]: Account ${resData.data?.accountNumber || 'SLT-9982-555'} balance is ${resData.data?.currency || 'LKR'} ${bal}. Due Date: ${resData.data?.dueDate || '2026-09-15'}.`;
        } else if (intentToRun === 'pay_bill') {
          replyStr = `[Billing Specialist]: Payment confirmed! Transaction ID: ${resData.data?.transactionId || 'TXN-88219482'}.`;
        } else if (intentToRun === 'check_usage') {
          const used = resData.data?.dataUsedGb !== undefined ? resData.data.dataUsedGb : resData.data?.usedDataGB;
          const total = resData.data?.dataTotalGb !== undefined ? resData.data.dataTotalGb : resData.data?.totalDataGB;
          replyStr = `[Usage Specialist]: Used ${used || '45.2'} GB of ${total || '100'} GB (${resData.data?.packageName || 'Unlimited Data Pro'}). Voice: ${resData.data?.voiceUsedMins || resData.data?.voiceMinutesUsed || '150'} mins.`;
        } else if (intentToRun === 'troubleshoot_router') {
          replyStr = `[Support Specialist RAG]:\n${typeof resData.data?.result === 'string' ? resData.data.result : (resData.data?.result?.title || 'Power cycle router and check LAN cabling.')}`;
        }

        setMessages((prev) => [...prev, { id: Date.now() + 1, sender: 'bot', text: replyStr }]);
      } else {
        setMessages((prev) => [...prev, { id: Date.now() + 1, sender: 'bot', text: `⚠️ Agent Error: ${resData.error?.message || resData.error || 'Action failed'}` }]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: `[AI Agent ${agentConfigByChannel[activeChannelTab].name} Response]: Processed intent '${intentToRun}' (Simulated fallback).`
        }
      ]);
    }
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
              className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${activeChannelTab === 'whatsapp'
                  ? 'bg-purple-900 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-50'
                }`}
            >
              Whatsapp Agent
            </button>
            <button
              onClick={() => setActiveChannelTab('messenger')}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${activeChannelTab === 'messenger'
                  ? 'bg-purple-900 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-50'
                }`}
            >
              Messenger Agent
            </button>
            <button
              onClick={() => setActiveChannelTab('sms')}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${activeChannelTab === 'sms'
                  ? 'bg-purple-900 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-50'
                }`}
            >
              SMS Agent
            </button>
            <button
              onClick={() => setActiveChannelTab('email')}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${activeChannelTab === 'email'
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
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setCreateAgentForm(initialAgentForm);
                    setShowCreateAgentModal(true);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Agent</span>
                </button>
                <button
                  onClick={() => setShowKnowledgeModal(true)}
                  className="text-xs font-bold text-purple-600 hover:underline"
                >
                  Manage Knowledge Base
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {agentFleet.map((agent) => (
                <div
                  key={agent.agentId}
                  className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 hover:border-indigo-300 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600">
                        <Bot className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-slate-900">{agent.displayName}</h4>
                        <span className="text-[10px] text-slate-400 block font-mono">
                          Model: {agent.modelId || 'amazon.nova-lite-v1:0'}
                        </span>
                        {agent.publicAgentKey && (
                          <span className="text-[9px] text-indigo-600 font-semibold block">
                            Key: /{agent.publicAgentKey}
                          </span>
                        )}
                      </div>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        agent.status === 'ACTIVE' || agent.status === 'PUBLISHED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {agent.status || 'DRAFT'}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-bold">
                      <span className="text-slate-500">Configured Capabilities</span>
                      <span className="text-indigo-600 font-semibold">
                        {agent.subAgentsCount || agent.enabledSubAgents?.length || 5} specialists · {agent.toolsCount || agent.toolIds?.length || 0} tools
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full w-[95%]" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">Brand</span>
                      <span className="font-bold text-slate-900">{agent.brandName || 'Dialog Axiata'}</span>
                    </div>
                    <button
                      onClick={() => {
                        setMessages([
                          {
                            id: Date.now(),
                            sender: 'bot',
                            text: agent.welcomeMessage || `Hello! I am ${agent.displayName}. How can I assist you today?`,
                          },
                        ]);
                        setShowTestDrawer(true);
                      }}
                      className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-colors"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Test Agent</span>
                    </button>
                  </div>
                </div>
              ))}
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
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${selectedBaseModel === 'gpt4' ? 'bg-purple-50 border-purple-300 ring-2 ring-purple-500/20' : 'bg-slate-50 border-slate-200'
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
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${selectedBaseModel === 'llama' ? 'bg-purple-50 border-purple-300 ring-2 ring-purple-500/20' : 'bg-slate-50 border-slate-200'
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
                  <div className={`p-3.5 rounded-2xl max-w-[80%] text-xs ${m.sender === 'user' ? 'bg-purple-600 text-white rounded-br-none' : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-xs'
                    }`}>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Intent Test Chips */}
            <div className="px-4 py-2 bg-slate-100/80 border-t border-slate-200 flex flex-wrap gap-1.5 text-[11px]">
              <span className="text-[10px] font-bold text-slate-400 w-full mb-0.5">Quick Test Intents:</span>
              <button
                type="button"
                onClick={() => handleSendMessage(undefined as any, 'check_balance', 'Check my current balance')}
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 font-semibold hover:border-purple-400 hover:text-purple-600 transition-colors"
              >
                💳 Check Balance
              </button>
              <button
                type="button"
                onClick={() => handleSendMessage(undefined as any, 'check_usage', 'Check my data usage')}
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 font-semibold hover:border-purple-400 hover:text-purple-600 transition-colors"
              >
                📊 Check Usage
              </button>
              <button
                type="button"
                onClick={() => handleSendMessage(undefined as any, 'troubleshoot_router', 'My internet is slow')}
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 font-semibold hover:border-purple-400 hover:text-purple-600 transition-colors"
              >
                🔧 Troubleshoot
              </button>
              <button
                type="button"
                onClick={() => handleSendMessage(undefined as any, 'pay_bill', 'Pay my monthly bill')}
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 font-semibold hover:border-purple-400 hover:text-purple-600 transition-colors"
              >
                💵 Pay Bill
              </button>
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

      {/* Create AI agent Modal */}
      {showCreateAgentModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
          <div className="bg-white rounded-2xl w-full max-w-2xl sm:max-w-3xl border border-slate-200 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">Create AI agent</h2>
              <button
                type="button"
                onClick={() => setShowCreateAgentModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Body & Form */}
            <form onSubmit={handleSaveAgent} className="flex-1 overflow-y-auto px-6 py-5 space-y-5 text-slate-800">
              {/* Local demo status note */}
              <p className="text-slate-700 text-sm leading-relaxed">
                Local demo: this form saves a DRAFT record to LocalStack only. It does not deploy a Bedrock agent, publish a chat URL, or activate tools.
              </p>

              {/* 2-Column Fields Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                {/* Row 1 */}
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1.5">Display name</label>
                  <input
                    type="text"
                    value={createAgentForm.displayName}
                    onChange={(e) => setCreateAgentForm((prev) => ({ ...prev, displayName: e.target.value }))}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1.5">Public URL key</label>
                  <input
                    type="text"
                    value={createAgentForm.publicAgentKey}
                    onChange={(e) => setCreateAgentForm((prev) => ({ ...prev, publicAgentKey: e.target.value }))}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800"
                  />
                </div>

                {/* Row 2 */}
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1.5">Brand name</label>
                  <input
                    type="text"
                    value={createAgentForm.brandName}
                    onChange={(e) => setCreateAgentForm((prev) => ({ ...prev, brandName: e.target.value }))}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1.5">Bedrock model ID</label>
                  <input
                    type="text"
                    value={createAgentForm.modelId}
                    onChange={(e) => setCreateAgentForm((prev) => ({ ...prev, modelId: e.target.value }))}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800"
                  />
                </div>

                {/* Row 3 */}
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1.5">Knowledge base</label>
                  <select
                    value={createAgentForm.knowledgeBaseRef}
                    onChange={(e) => setCreateAgentForm((prev) => ({ ...prev, knowledgeBaseRef: e.target.value }))}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800"
                  >
                    <option value="">None</option>
                    <option value="kb-products">Products & Packages (kb-products)</option>
                    <option value="kb-support">Support Guides (kb-support)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1.5">Suggested prompts (comma separated)</label>
                  <input
                    type="text"
                    value={createAgentForm.suggestedPrompts}
                    onChange={(e) => setCreateAgentForm((prev) => ({ ...prev, suggestedPrompts: e.target.value }))}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800"
                  />
                </div>
              </div>

              {/* Enabled tools */}
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-2">Enabled tools</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {availableTools.map((tool) => (
                    <label
                      key={tool.id}
                      className="flex items-center justify-between px-4 py-3 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer bg-white"
                    >
                      <input
                        type="checkbox"
                        checked={createAgentForm.toolIds.includes(tool.id)}
                        onChange={() => toggleTool(tool.id)}
                        className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-600"
                      />
                      <span className="text-xs font-semibold text-slate-900">{tool.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Specialist sub-agents */}
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-2">Specialist sub-agents</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {availableSubAgents.map((agent) => (
                    <label
                      key={agent.id}
                      className="flex items-center justify-between px-4 py-3 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer bg-white"
                    >
                      <input
                        type="checkbox"
                        checked={createAgentForm.enabledSubAgents.includes(agent.id)}
                        onChange={() => toggleSubAgent(agent.id)}
                        className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-600"
                      />
                      <span className="text-xs font-bold text-slate-900">{agent.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Welcome message */}
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1.5">Welcome message</label>
                <textarea
                  rows={3}
                  value={createAgentForm.welcomeMessage}
                  onChange={(e) => setCreateAgentForm((prev) => ({ ...prev, welcomeMessage: e.target.value }))}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 resize-y min-h-[85px]"
                />
              </div>

              {/* System instruction */}
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1.5">System instruction</label>
                <textarea
                  rows={4}
                  value={createAgentForm.systemPrompt}
                  onChange={(e) => setCreateAgentForm((prev) => ({ ...prev, systemPrompt: e.target.value }))}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 resize-y min-h-[90px]"
                />
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 bg-white">
                <button
                  type="button"
                  onClick={() => setShowCreateAgentModal(false)}
                  className="px-5 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingAgent}
                  className="px-6 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-colors disabled:opacity-50"
                >
                  {isSavingAgent ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
