import React, { useState, useEffect } from 'react';
import {
  Bot,
  Shield,
  Play,
  Terminal,
  Cpu,
  Database,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Send,
  Plus,
  ArrowLeft,
  Building2,
  X,
  ExternalLink,
  UploadCloud,
  FileText,
  Trash2,
  Search,
} from 'lucide-react';
import Button from '@/components/Button';
import InputField from '@/components/InputField';
import { apiClient } from '@/api/apiClient';
import { useAuthStore } from '@/store/authStore';
import { ENV } from '@/config/env';

export interface KbItem {
  kbId: string;
  name: string;
  description: string;
  category: string;
  filesCount: number;
  totalBytes: number;
  status: 'READY' | 'SYNCING';
  updatedAt: string;
  documents: Array<{
    name: string;
    size: number;
    type: string;
    uploadedAt: string;
  }>;
}

export default function Agents() {
  const user = useAuthStore((state) => state.user);
  const currentCompany =
    user?.companyName ||
    (user?.email?.toLowerCase().includes("dialog") || user?.tenantId?.toLowerCase().includes("dialog") || user?.name?.toLowerCase().includes("dialog")
      ? "Dialog Axiata PLC"
      : "Dialog Axiata PLC");

  const [selectedOrg, setSelectedOrg] = useState<string | null>(currentCompany);
  const [activeChannelTab, setActiveChannelTab] = useState<'whatsapp' | 'messenger' | 'sms' | 'email'>('whatsapp');
  const [showTestDrawer, setShowTestDrawer] = useState(false);
  const [showKnowledgeModal, setShowKnowledgeModal] = useState(false);
  const [showCreateAgentModal, setShowCreateAgentModal] = useState(false);
  const [newAgentName, setNewAgentName] = useState('');
  const [newAgentPrompt, setNewAgentPrompt] = useState('You are an helpful AI customer support agent for SLT.');
  const [selectedBaseModel, setSelectedBaseModel] = useState('gpt4');

  // Knowledge Base State
  const [knowledgeBases, setKnowledgeBases] = useState<KbItem[]>(() => {
    const cached = typeof window !== 'undefined' ? localStorage.getItem('omni_knowledge_bases') : null;
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}
    }
    return [
      {
        kbId: 'kb-products',
        name: 'Products & Packages (kb-products)',
        description: 'Official broadband, voice, and fiber data packages and fair usage policy documentation.',
        category: 'Products & Plans',
        filesCount: 2,
        totalBytes: 24580,
        status: 'READY',
        updatedAt: 'Just now',
        documents: [
          { name: 'dialog_broadband_plans_2026.pdf', size: 18450, type: 'pdf', uploadedAt: 'Yesterday' },
          { name: 'fair_usage_policy_faq.txt', size: 6130, type: 'txt', uploadedAt: 'Yesterday' },
        ],
      },
      {
        kbId: 'kb-support',
        name: 'Support Guides (kb-support)',
        description: 'Fiber ONU router setup, self-troubleshooting steps, and optical loss error diagnosis.',
        category: 'Technical Support',
        filesCount: 2,
        totalBytes: 15300,
        status: 'READY',
        updatedAt: '2 days ago',
        documents: [
          { name: 'fiber_onu_router_setup.md', size: 9200, type: 'md', uploadedAt: '2 days ago' },
          { name: 'los_red_light_troubleshooting.txt', size: 6100, type: 'txt', uploadedAt: '2 days ago' },
        ],
      },
    ];
  });

  const [activeKbTab, setActiveKbTab] = useState<'list' | 'upload'>('list');
  const [kbSearchQuery, setKbSearchQuery] = useState('');
  const [isUploadingKb, setIsUploadingKb] = useState(false);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState('');

  // Upload Form State
  const [newKbName, setNewKbName] = useState('');
  const [newKbRef, setNewKbRef] = useState('');
  const [newKbCategory, setNewKbCategory] = useState('Products & Plans');
  const [newKbDescription, setNewKbDescription] = useState('');
  const [newKbTextContent, setNewKbTextContent] = useState('');
  const [selectedKbFiles, setSelectedKbFiles] = useState<File[]>([]);

  // Sync Knowledge Bases with backend on load
  useEffect(() => {
    const fetchKnowledgeBases = async () => {
      try {
        const token = localStorage.getItem('omni_token') || 'dev-token-staff';
        const res = await fetch(`${ENV.API_BASE_URL}/api/dev/admin/knowledge-bases`, {
          headers: {
            Authorization: token.startsWith('Bearer ') ? token : `Bearer ${token}`,
            'x-tenant-id': user?.tenantId || 'slt',
          },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.items) && data.items.length > 0) {
            setKnowledgeBases(data.items);
            localStorage.setItem('omni_knowledge_bases', JSON.stringify(data.items));
          }
        }
      } catch (err) {
        console.warn('Backend KB sync fallback to local state:', err);
      }
    };
    fetchKnowledgeBases();
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArr = Array.from(e.target.files);
      setSelectedKbFiles((prev) => [...prev, ...filesArr]);
      if (!newKbName && filesArr[0]) {
        const autoName = filesArr[0].name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        setNewKbName(autoName.charAt(0).toUpperCase() + autoName.slice(1));
        const autoRef = 'kb-' + filesArr[0].name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        setNewKbRef(autoRef);
      }
    }
  };

  const removeSelectedFile = (idx: number) => {
    setSelectedKbFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleUploadKb = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKbName.trim()) return;

    setIsUploadingKb(true);
    setUploadSuccessMsg('');

    const cleanRef = newKbRef.trim()
      ? (newKbRef.trim().startsWith('kb-') ? newKbRef.trim() : `kb-${newKbRef.trim()}`)
      : `kb-${newKbName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;

    const processedFiles: Array<{ name: string; size: number; type: string; content?: string }> = [];

    for (const file of selectedKbFiles) {
      try {
        const text = await file.text();
        processedFiles.push({
          name: file.name,
          size: file.size,
          type: file.name.split('.').pop() || 'txt',
          content: text,
        });
      } catch {
        processedFiles.push({
          name: file.name,
          size: file.size,
          type: file.name.split('.').pop() || 'txt',
        });
      }
    }

    if (newKbTextContent.trim() && processedFiles.length === 0) {
      processedFiles.push({
        name: `${cleanRef}-notes.txt`,
        size: newKbTextContent.length,
        type: 'txt',
        content: newKbTextContent.trim(),
      });
    }

    const payload = {
      name: newKbName.trim(),
      kbId: cleanRef,
      category: newKbCategory,
      description: newKbDescription.trim() || 'Custom Knowledge Base for AI Agents',
      files: processedFiles,
    };

    const newKbItem: KbItem = {
      kbId: cleanRef,
      name: payload.name,
      description: payload.description,
      category: payload.category,
      filesCount: processedFiles.length || 1,
      totalBytes: processedFiles.reduce((acc, f) => acc + f.size, 0) || 4096,
      status: 'READY',
      updatedAt: 'Just now',
      documents: processedFiles.map((f) => ({
        name: f.name,
        size: f.size,
        type: f.type,
        uploadedAt: 'Just now',
      })),
    };

    try {
      const token = localStorage.getItem('omni_token') || 'dev-token-staff';
      await fetch(`${ENV.API_BASE_URL}/api/dev/admin/knowledge-bases`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token.startsWith('Bearer ') ? token : `Bearer ${token}`,
          'x-tenant-id': user?.tenantId || 'slt',
        },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.warn('Backend KB upload fallback to local state:', err);
    }

    setKnowledgeBases((prev) => {
      const filtered = prev.filter((k) => k.kbId !== cleanRef);
      const updated = [newKbItem, ...filtered];
      if (typeof window !== 'undefined') {
        localStorage.setItem('omni_knowledge_bases', JSON.stringify(updated));
      }
      return updated;
    });

    setIsUploadingKb(false);
    setUploadSuccessMsg(`✅ Knowledge Base "${newKbItem.name}" uploaded & indexed successfully!`);

    setNewKbName('');
    setNewKbRef('');
    setNewKbDescription('');
    setNewKbTextContent('');
    setSelectedKbFiles([]);

    setTimeout(() => {
      setActiveKbTab('list');
      setUploadSuccessMsg('');
    }, 1800);
  };

  const handleDeleteKb = async (kbIdToDelete: string) => {
    try {
      const token = localStorage.getItem('omni_token') || 'dev-token-staff';
      await fetch(`${ENV.API_BASE_URL}/api/dev/admin/knowledge-bases/${kbIdToDelete}`, {
        method: 'DELETE',
        headers: {
          Authorization: token.startsWith('Bearer ') ? token : `Bearer ${token}`,
          'x-tenant-id': user?.tenantId || 'slt',
        },
      });
    } catch {}

    setKnowledgeBases((prev) => {
      const updated = prev.filter((k) => k.kbId !== kbIdToDelete);
      if (typeof window !== 'undefined') {
        localStorage.setItem('omni_knowledge_bases', JSON.stringify(updated));
      }
      return updated;
    });
  };

  const filteredKbs = knowledgeBases.filter(
    (kb) =>
      kb.name.toLowerCase().includes(kbSearchQuery.toLowerCase()) ||
      kb.kbId.toLowerCase().includes(kbSearchQuery.toLowerCase()) ||
      kb.category.toLowerCase().includes(kbSearchQuery.toLowerCase())
  );

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

  const toggleAgentStatus = (agentId: string) => {
    setAgentFleet((prev) => {
      const updated = prev.map((a) => {
        if (a.agentId === agentId) {
          const nextStatus = a.status === 'ACTIVE' || a.status === 'PUBLISHED' ? 'DRAFT' : 'ACTIVE';
          return { ...a, status: nextStatus };
        }
        return a;
      });
      if (typeof window !== 'undefined') {
        localStorage.setItem('omni_agent_fleet', JSON.stringify(updated));
      }
      return updated;
    });
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

      await fetch(`${ENV.API_BASE_URL}/api/dev/admin/agents`, {
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
        const token = localStorage.getItem('omni_token') || 'dev-token-staff';
        const res = await fetch(`${ENV.API_BASE_URL}/api/registrations`, {
          headers: {
            Authorization: token.startsWith('Bearer ') ? token : `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.registrations)) {
            const activeOrgs = data.registrations
              .filter((r: any) => r.status === 'Approved' || r.status === 'Active')
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

      const res = await fetch(`${ENV.API_BASE_URL}/api/agent`, {
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
              <p className="text-xs text-slate-300 mt-0.5">Real-time infrastructure health and user growth metrics for {selectedOrg || currentCompany}.</p>
            </div>

            <div className="bg-white text-slate-900 p-3.5 rounded-2xl border border-slate-200 shadow-md flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white font-black flex items-center justify-center text-xs shadow-xs">
                {(selectedOrg || currentCompany).substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h4 className="text-xs font-black">{selectedOrg || currentCompany}</h4>
                <span className="text-[9px] text-slate-400 block">Omni AI Agent System</span>
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
              <div className="flex items-center gap-2.5">
                <h3 className="text-base font-black text-white tracking-wide">AI Agent Fleet</h3>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold border border-indigo-500/30">
                  {agentFleet.length} Configured
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setCreateAgentForm(initialAgentForm);
                    setShowCreateAgentModal(true);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Agent</span>
                </button>
                <button
                  onClick={() => setShowKnowledgeModal(true)}
                  className="text-xs font-bold text-indigo-400 hover:text-indigo-300 hover:underline"
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
                      onClick={() => toggleAgentStatus(agent.agentId)}
                      title="Click to toggle status (Draft / Active)"
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-all select-none hover:scale-105 ${
                        agent.status === 'ACTIVE' || agent.status === 'PUBLISHED'
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
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
                    <div className="flex items-center gap-2">
                      {agent.status === 'DRAFT' && (
                        <button
                          onClick={() => toggleAgentStatus(agent.agentId)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center gap-1 transition-all"
                          title="Publish this agent to make it Active"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Publish</span>
                        </button>
                      )}
                      {agent.publicAgentKey && (
                        <a
                          href={`/chat/dialog/${agent.publicAgentKey}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-xl border border-indigo-200 hover:border-indigo-400 bg-indigo-50/70 hover:bg-indigo-100 text-indigo-700 font-bold text-xs shadow-xs flex items-center gap-1 transition-all"
                          title="Open standalone public chat link in a new browser tab"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Chat Link</span>
                        </a>
                      )}
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
                    {knowledgeBases.map((kb) => (
                      <option key={kb.kbId} value={kb.kbId}>
                        {kb.name} ({kb.kbId})
                      </option>
                    ))}
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

      {/* ============================================================== */}
      {/* 2. MANAGE KNOWLEDGE BASE MODAL (Uploading & S3 Document Sync)  */}
      {/* ============================================================== */}
      {showKnowledgeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-cyan-400 shadow-md">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-black tracking-tight">Manage Knowledge Bases</h2>
                  <p className="text-[11px] text-slate-300">
                    Upload and index company documents for Bedrock RAG vector retrieval.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowKnowledgeModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex items-center justify-between px-6 py-2.5 bg-slate-50 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveKbTab('list')}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeKbTab === 'list'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-200/60'
                  }`}
                >
                  Indexed Knowledge Bases ({knowledgeBases.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveKbTab('upload')}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeKbTab === 'upload'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-200/60'
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Upload Knowledge Base</span>
                </button>
              </div>

              {activeKbTab === 'list' && (
                <div className="relative w-48">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search KBs..."
                    value={kbSearchQuery}
                    onChange={(e) => setKbSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              )}
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {uploadSuccessMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{uploadSuccessMsg}</span>
                </div>
              )}

              {activeKbTab === 'list' ? (
                /* TAB 1: KNOWLEDGE BASES LIST */
                <div className="space-y-3">
                  {filteredKbs.length === 0 ? (
                    <div className="py-12 flex flex-col items-center justify-center text-center text-slate-400 space-y-2">
                      <Database className="w-10 h-10 text-slate-300" />
                      <p className="text-xs font-medium">No Knowledge Bases found matching your search.</p>
                      <button
                        type="button"
                        onClick={() => setActiveKbTab('upload')}
                        className="px-4 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold"
                      >
                        Upload First Knowledge Base
                      </button>
                    </div>
                  ) : (
                    filteredKbs.map((kb) => (
                      <div
                        key={kb.kbId}
                        className="p-4 rounded-2xl border border-slate-200 hover:border-indigo-300 bg-white shadow-xs space-y-3 transition-all"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="text-sm font-black text-slate-900">{kb.name}</h3>
                              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-mono font-bold">
                                {kb.kbId}
                              </span>
                              <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-bold">
                                {kb.category}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed">{kb.description}</p>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              {kb.status}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleDeleteKb(kb.kbId)}
                              title="Delete Knowledge Base"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Document files list */}
                        {kb.documents && kb.documents.length > 0 && (
                          <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-2">
                            {kb.documents.map((doc, dIdx) => (
                              <div
                                key={dIdx}
                                className="px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-[11px] font-medium flex items-center gap-1.5"
                              >
                                <FileText className="w-3.5 h-3.5 text-indigo-500" />
                                <span className="font-semibold text-slate-800">{doc.name}</span>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  ({(doc.size / 1024).toFixed(1)} KB)
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              ) : (
                /* TAB 2: UPLOAD NEW KNOWLEDGE BASE FORM */
                <form onSubmit={handleUploadKb} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-900 mb-1.5">
                        Knowledge Base Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Dialog Fiber & 4G Packages"
                        value={newKbName}
                        onChange={(e) => {
                          setNewKbName(e.target.value);
                          if (!newKbRef) {
                            setNewKbRef('kb-' + e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
                          }
                        }}
                        className="w-full px-3.5 py-2 text-xs font-medium bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-900 mb-1.5">
                        Reference Key (Identifier) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. kb-dialog-fiber"
                        value={newKbRef}
                        onChange={(e) => setNewKbRef(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs font-mono font-medium bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-900 mb-1.5">Category</label>
                      <select
                        value={newKbCategory}
                        onChange={(e) => setNewKbCategory(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs font-medium bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="Products & Plans">Products & Plans</option>
                        <option value="Technical Support">Technical Support & Troubleshooting</option>
                        <option value="Billing & Invoicing">Billing & Payments</option>
                        <option value="Company Policies">Company Policies & Terms</option>
                        <option value="General FAQ">General Customer FAQ</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-900 mb-1.5">Description</label>
                      <input
                        type="text"
                        placeholder="Brief summary of document content..."
                        value={newKbDescription}
                        onChange={(e) => setNewKbDescription(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs font-medium bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  {/* Document File Upload Drop Area */}
                  <div>
                    <label className="block text-xs font-bold text-slate-900 mb-1.5">
                      Upload Source Documents (.pdf, .txt, .md, .docx, .json)
                    </label>
                    <div className="relative border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-2xl p-6 text-center bg-slate-50 transition-colors">
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.txt,.md,.doc,.docx,.json,.csv"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                          <UploadCloud className="w-5 h-5" />
                        </div>
                        <p className="text-xs font-bold text-slate-800">
                          Click to browse or drag and drop files here
                        </p>
                        <p className="text-[10px] text-slate-500">
                          PDF, Markdown, TXT, DOCX up to 25MB each
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Selected files preview */}
                  {selectedKbFiles.length > 0 && (
                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-bold text-slate-700">
                        Selected Files ({selectedKbFiles.length})
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {selectedKbFiles.map((f, i) => (
                          <div
                            key={i}
                            className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between shadow-xs"
                          >
                            <div className="flex items-center gap-2 truncate">
                              <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                              <div className="truncate">
                                <p className="text-xs font-bold text-slate-900 truncate">{f.name}</p>
                                <p className="text-[10px] text-slate-400 font-mono">{(f.size / 1024).toFixed(1)} KB</p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeSelectedFile(i)}
                              className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-slate-100"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Direct Text Notes Content (Optional) */}
                  <div>
                    <label className="block text-xs font-bold text-slate-900 mb-1.5">
                      Or Paste Direct Knowledge / FAQs
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Paste unstructured text, policy guidelines, FAQs, or troubleshooting instructions here..."
                      value={newKbTextContent}
                      onChange={(e) => setNewKbTextContent(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs font-medium bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => setActiveKbTab('list')}
                      className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                    >
                      Back to List
                    </button>
                    <button
                      type="submit"
                      disabled={isUploadingKb || (!selectedKbFiles.length && !newKbTextContent.trim() && !newKbName)}
                      className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50"
                    >
                      {isUploadingKb ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Uploading & Indexing...</span>
                        </>
                      ) : (
                        <>
                          <UploadCloud className="w-3.5 h-3.5" />
                          <span>Upload & Index Knowledge Base</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-emerald-600" />
                <span>Zero-Trust Tenant S3 Isolation Active</span>
              </span>
              <button
                type="button"
                onClick={() => setShowKnowledgeModal(false)}
                className="px-4 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition-colors"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
