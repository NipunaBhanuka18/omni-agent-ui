import React, { useState } from 'react';
import { Wrench, Plus, Terminal, Globe, FileText, CheckCircle2, Power, Trash2, Edit2, Shield, Code, Sparkles, ExternalLink } from 'lucide-react';
import ToastContainer, { type ToastMessage } from '@/components/Toast';

export interface GovernedTool {
  toolId: string;
  name: string;
  displayName: string;
  type: 'api' | 'mcp' | 'form';
  description: string;
  enabled: boolean;
  endpoint?: string;
  secretId?: string;
  gatewayUrl?: string;
  targetToolName?: string;
  formSchema?: {
    formId: string;
    title: string;
    description?: string;
    fields: Array<{ name: string; label: string; type: string; required: boolean }>;
  };
  inputSchema?: string;
}

export default function ToolsManagement() {
  const [tools, setTools] = useState<GovernedTool[]>([
    {
      toolId: 'tool-ticket',
      name: 'create_ticket',
      displayName: 'Create Support Ticket',
      type: 'mcp',
      description: 'Creates a verified SLT customer support ticket through AWS Bedrock AgentCore Gateway MCP.',
      enabled: true,
      gatewayUrl: 'https://gateway.slt.lk/mcp/v1',
      targetToolName: 'support___create_ticket',
      inputSchema: JSON.stringify({
        type: 'object',
        properties: {
          accountNo: { type: 'string', description: 'Customer SLT account number' },
          category: { type: 'string', enum: ['broadband', 'voice', 'peotv', 'billing'] },
          description: { type: 'string', description: 'Problem description' },
        },
        required: ['accountNo', 'category', 'description'],
      }, null, 2),
    },
    {
      toolId: 'tool-order',
      name: 'check_order',
      displayName: 'Check Order & Fault Status',
      type: 'api',
      description: 'Checks customer service activation order or reported fault status using a reference ticket number.',
      enabled: true,
      endpoint: 'https://api.slt.lk/v2/orders/check',
      secretId: 'sec-slt-orders-token',
      inputSchema: JSON.stringify({
        type: 'object',
        properties: {
          referenceNumber: { type: 'string', description: 'Order reference number' },
        },
        required: ['referenceNumber'],
      }, null, 2),
    },
    {
      toolId: 'form-lead',
      name: 'sales_interest',
      displayName: 'Sales & Package Interest Form',
      type: 'form',
      description: 'Presents an inline interactive customer form in the chat when high-intent packages are discussed.',
      enabled: true,
      formSchema: {
        formId: 'sales_interest',
        title: 'Tell us what you need',
        description: 'Share your contact details so our sales specialist can assist with fiber packages.',
        fields: [
          { name: 'name', label: 'Your Full Name', type: 'text', required: true },
          { name: 'contact', label: 'Mobile or Email', type: 'text', required: true },
          { name: 'package', label: 'Desired Package (Fiber/4G/PeoTV)', type: 'text', required: false },
        ],
      },
    },
    {
      toolId: 'tool-bill-lookup',
      name: 'fetch_billing_summary',
      displayName: 'Billing & Invoice Lookup',
      type: 'api',
      description: 'Securely looks up current bill balance, due dates, and last payment receipts.',
      enabled: true,
      endpoint: 'https://api.slt.lk/v1/billing/summary',
      secretId: 'sec-billing-credentials',
      inputSchema: JSON.stringify({
        type: 'object',
        properties: {
          telephoneNumber: { type: 'string', description: 'SLT landline or account number' },
        },
        required: ['telephoneNumber'],
      }, null, 2),
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

  const [filterType, setFilterType] = useState<'all' | 'api' | 'mcp' | 'form'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<GovernedTool | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    displayName: '',
    name: '',
    toolId: '',
    type: 'api' as 'api' | 'mcp' | 'form',
    description: '',
    endpoint: '',
    secretId: '',
    gatewayUrl: '',
    targetToolName: '',
    formTitle: '',
    formFields: '',
    inputSchema: '{\n  "type": "object",\n  "properties": {}\n}',
  });

  const openCreateModal = () => {
    setEditingTool(null);
    setFormData({
      displayName: '',
      name: '',
      toolId: `tool-${Date.now().toString().slice(-4)}`,
      type: 'api',
      description: '',
      endpoint: 'https://api.example.com/v1',
      secretId: '',
      gatewayUrl: 'https://gateway.example.com/mcp',
      targetToolName: '',
      formTitle: 'Customer Request Form',
      formFields: 'Full Name:name, Phone Number:phone',
      inputSchema: '{\n  "type": "object",\n  "properties": {}\n}',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (tool: GovernedTool) => {
    setEditingTool(tool);
    setFormData({
      displayName: tool.displayName,
      name: tool.name,
      toolId: tool.toolId,
      type: tool.type,
      description: tool.description,
      endpoint: tool.endpoint || '',
      secretId: tool.secretId || '',
      gatewayUrl: tool.gatewayUrl || '',
      targetToolName: tool.targetToolName || '',
      formTitle: tool.formSchema?.title || '',
      formFields: (tool.formSchema?.fields || []).map((f) => `${f.label}:${f.name}`).join(', '),
      inputSchema: tool.inputSchema || '{\n  "type": "object",\n  "properties": {}\n}',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.displayName || !formData.name) {
      addToast('Please fill in required fields', 'error');
      return;
    }

    let formSchemaObj = undefined;
    if (formData.type === 'form') {
      const parsedFields = formData.formFields
        .split(',')
        .map((item) => {
          const parts = item.trim().split(':');
          const label = parts[0]?.trim();
          const name = parts[1]?.trim() || label?.toLowerCase().replace(/\W+/g, '_');
          return { label, name, type: 'text', required: true };
        })
        .filter((f) => f.label);

      formSchemaObj = {
        formId: formData.name,
        title: formData.formTitle || formData.displayName,
        description: formData.description,
        fields: parsedFields,
      };
    }

    const newToolItem: GovernedTool = {
      toolId: editingTool ? editingTool.toolId : (formData.toolId || `tool-${Date.now()}`),
      name: formData.name.toLowerCase().replace(/[^a-z0-9_]/g, '_'),
      displayName: formData.displayName,
      type: formData.type,
      description: formData.description,
      enabled: editingTool ? editingTool.enabled : true,
      endpoint: formData.type === 'api' ? formData.endpoint : undefined,
      secretId: formData.type === 'api' ? formData.secretId : undefined,
      gatewayUrl: formData.type === 'mcp' ? formData.gatewayUrl : undefined,
      targetToolName: formData.type === 'mcp' ? formData.targetToolName : undefined,
      formSchema: formSchemaObj,
      inputSchema: formData.inputSchema,
    };

    if (editingTool) {
      setTools((prev) => prev.map((t) => (t.toolId === editingTool.toolId ? newToolItem : t)));
      addToast(`Tool '${newToolItem.displayName}' updated successfully!`, 'success');
    } else {
      setTools((prev) => [newToolItem, ...prev]);
      addToast(`Tool '${newToolItem.displayName}' created!`, 'success');
    }

    setIsModalOpen(false);
  };

  const toggleToolEnabled = (toolId: string) => {
    setTools((prev) =>
      prev.map((t) => (t.toolId === toolId ? { ...t, enabled: !t.enabled } : t))
    );
    addToast('Tool status updated', 'info');
  };

  const handleDeleteTool = (toolId: string) => {
    if (confirm('Delete this governed tool? Connected agents will no longer have access to run it.')) {
      setTools((prev) => prev.filter((t) => t.toolId !== toolId));
      addToast('Tool deleted', 'info');
    }
  };

  const filteredTools = tools.filter((t) => {
    if (filterType === 'all') return true;
    return t.type === filterType;
  });

  return (
    <div className="space-y-6 font-sans max-w-7xl mx-auto w-full">
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-3xl border border-indigo-900/50 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-cyan-400 shadow-md">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-tight">Governed Tools & Interactive Forms</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-[10px] font-black uppercase tracking-wider">
                MCP & API Ready
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Connect approved HTTPS APIs, Bedrock AgentCore MCP gateways, and inline customer data capture forms.
            </p>
          </div>
        </div>

        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create Governed Tool</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'all', label: `All Tools (${tools.length})` },
          { id: 'api', label: `HTTPS APIs (${tools.filter((t) => t.type === 'api').length})` },
          { id: 'mcp', label: `AgentCore MCP (${tools.filter((t) => t.type === 'mcp').length})` },
          { id: 'form', label: `Customer Forms (${tools.filter((t) => t.type === 'form').length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id as any)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              filterType === tab.id
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTools.map((tool) => (
          <div
            key={tool.toolId}
            className={`bg-white rounded-3xl border transition-all p-6 shadow-sm hover:shadow-md flex flex-col justify-between space-y-4 ${
              tool.enabled ? 'border-slate-200' : 'border-slate-200/60 opacity-70 bg-slate-50/50'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-black uppercase tracking-wider ${
                        tool.type === 'mcp'
                          ? 'bg-purple-100 text-purple-700 border border-purple-200'
                          : tool.type === 'api'
                          ? 'bg-blue-100 text-blue-700 border border-blue-200'
                          : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {tool.type === 'mcp' ? 'AgentCore MCP' : tool.type.toUpperCase()}
                    </span>
                    <span
                      className={`w-2 h-2 rounded-full ${tool.enabled ? 'bg-emerald-500' : 'bg-slate-300'}`}
                      title={tool.enabled ? 'Enabled' : 'Disabled'}
                    />
                  </div>
                  <h3 className="text-base font-black text-slate-900 tracking-tight pt-1">{tool.displayName}</h3>
                  <code className="text-[10px] text-slate-400 font-mono block">{tool.name}</code>
                </div>

                <button
                  onClick={() => toggleToolEnabled(tool.toolId)}
                  className={`p-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    tool.enabled
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                      : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                  }`}
                  title={tool.enabled ? 'Disable Tool' : 'Enable Tool'}
                >
                  <Power className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="text-xs text-slate-600 font-medium leading-relaxed line-clamp-3">
                {tool.description}
              </p>

              {/* Technical Parameter Details */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5 text-[11px]">
                {tool.type === 'api' && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-semibold">Endpoint:</span>
                      <span className="font-mono text-slate-700 truncate max-w-[170px]">{tool.endpoint}</span>
                    </div>
                    {tool.secretId && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 font-semibold">Secret ID:</span>
                        <span className="font-mono text-indigo-600">{tool.secretId}</span>
                      </div>
                    )}
                  </>
                )}

                {tool.type === 'mcp' && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-semibold">Gateway:</span>
                      <span className="font-mono text-slate-700 truncate max-w-[170px]">{tool.gatewayUrl}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-semibold">Target Tool:</span>
                      <span className="font-mono text-purple-700 font-bold">{tool.targetToolName}</span>
                    </div>
                  </>
                )}

                {tool.type === 'form' && tool.formSchema && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-semibold">Form Title:</span>
                      <span className="font-bold text-slate-800">{tool.formSchema.title}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-semibold">Inputs:</span>
                      <span className="font-mono text-emerald-700">
                        {tool.formSchema.fields.map((f) => f.name).join(', ')}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => openEditModal(tool)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Configure</span>
              </button>

              <button
                onClick={() => handleDeleteTool(tool.toolId)}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                title="Delete Tool"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* === MODAL: CONFIGURE GOVERNED TOOL === */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 space-y-5 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                  <Wrench className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    {editingTool ? 'Edit Governed Tool' : 'Create Governed Tool'}
                  </h3>
                  <p className="text-xs text-slate-500">Attach tools and structured actions to AI agents</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg p-1"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Display Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Create Support Ticket"
                    value={formData.displayName}
                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Tool Name (Identifier) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="create_ticket"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Tool Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                >
                  <option value="api">HTTPS REST API</option>
                  <option value="mcp">AgentCore Gateway / MCP Tool</option>
                  <option value="form">Customer Interactive Form</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Explain when and why the AI agent should invoke this tool."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Conditional Fields based on Tool Type */}
              {formData.type === 'api' && (
                <div className="space-y-3 p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                  <h4 className="text-xs font-black text-blue-900 uppercase tracking-wider">REST API Configuration</h4>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Endpoint URL</label>
                    <input
                      type="url"
                      placeholder="https://api.example.com/v1/resource"
                      value={formData.endpoint}
                      onChange={(e) => setFormData({ ...formData, endpoint: e.target.value })}
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">AWS Secrets Manager Secret ID</label>
                    <input
                      type="text"
                      placeholder="e.g. sec-api-auth-key"
                      value={formData.secretId}
                      onChange={(e) => setFormData({ ...formData, secretId: e.target.value })}
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono"
                    />
                  </div>
                </div>
              )}

              {formData.type === 'mcp' && (
                <div className="space-y-3 p-4 bg-purple-50/50 rounded-2xl border border-purple-100">
                  <h4 className="text-xs font-black text-purple-900 uppercase tracking-wider">AgentCore MCP Gateway Configuration</h4>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">MCP Gateway URL</label>
                    <input
                      type="url"
                      placeholder="https://gateway.example.com/mcp"
                      value={formData.gatewayUrl}
                      onChange={(e) => setFormData({ ...formData, gatewayUrl: e.target.value })}
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Target MCP Tool Function</label>
                    <input
                      type="text"
                      placeholder="service___function_name"
                      value={formData.targetToolName}
                      onChange={(e) => setFormData({ ...formData, targetToolName: e.target.value })}
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono"
                    />
                  </div>
                </div>
              )}

              {formData.type === 'form' && (
                <div className="space-y-3 p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                  <h4 className="text-xs font-black text-emerald-900 uppercase tracking-wider">Inline Chat Form Schema</h4>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Form Title</label>
                    <input
                      type="text"
                      placeholder="Customer Lead Capture"
                      value={formData.formTitle}
                      onChange={(e) => setFormData({ ...formData, formTitle: e.target.value })}
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Form Fields (Format: <code className="text-emerald-700">Label:name, Label:name</code>)
                    </label>
                    <input
                      type="text"
                      placeholder="Full Name:name, Phone Number:phone, Notes:notes"
                      value={formData.formFields}
                      onChange={(e) => setFormData({ ...formData, formFields: e.target.value })}
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Tool Input JSON Schema
                </label>
                <textarea
                  rows={4}
                  value={formData.inputSchema}
                  onChange={(e) => setFormData({ ...formData, inputSchema: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md cursor-pointer"
                >
                  {editingTool ? 'Save Changes' : 'Create Tool'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
