import React, { useState } from 'react';
import { Wrench, Plus, Terminal, Globe, FileText, CheckCircle2, Power, Trash2, Edit2, Shield, Code, Sparkles, ExternalLink } from 'lucide-react';
import ToastContainer, { type ToastMessage } from '@/components/Toast';
import { ENV } from '@/config/env';

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
  const [tools, setTools] = useState<GovernedTool[]>(() => {
    const cached = typeof window !== 'undefined' ? localStorage.getItem('omni_tools') : null;
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}
    }
    return [
      {
        toolId: 'tool-ticket',
        name: 'create_ticket',
        displayName: 'Create support ticket',
        type: 'mcp',
        description: 'Creates a verified support ticket through AgentCore Gateway.',
        enabled: true,
        gatewayUrl: 'https://gateway.dialog.lk/mcp/v1',
        targetToolName: 'support___create_ticket',
      },
      {
        toolId: 'tool-order',
        name: 'check_order',
        displayName: 'Check order status',
        type: 'api',
        description: 'Checks an order using a reference number.',
        enabled: true,
        endpoint: 'https://api.dialog.lk/v2/orders/check',
        secretId: 'sec-dialog-orders-token',
      },
      {
        toolId: 'form-lead',
        name: 'sales_interest',
        displayName: 'Sales interest form',
        type: 'form',
        description: 'Collects contact details for a sales follow-up.',
        enabled: true,
        formSchema: {
          formId: 'sales_interest',
          title: 'Tell us what you need',
          description: 'Share your contact details so our sales specialist can assist with fiber packages.',
          fields: [
            { name: 'name', label: 'Your Full Name', type: 'text', required: true },
            { name: 'contact', label: 'Mobile or Email', type: 'text', required: true },
            { name: 'package', label: 'Desired Package', type: 'text', required: false },
          ],
        },
      },
    ];
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
  };
  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync tools with backend
  React.useEffect(() => {
    const fetchTools = async () => {
      try {
        const token = localStorage.getItem('omni_token') || 'dev-token-staff';
        const res = await fetch(`${ENV.API_BASE_URL}/api/dev/admin/tools`, {
          headers: {
            Authorization: token.startsWith('Bearer ') ? token : `Bearer ${token}`,
            'x-tenant-id': 'dialog',
          },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.items) && data.items.length > 0) {
            setTools(data.items);
            localStorage.setItem('omni_tools', JSON.stringify(data.items));
          }
        }
      } catch (err) {
        console.warn('Backend tools sync fallback to local state:', err);
      }
    };
    fetchTools();
  }, []);

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

  return (
    <div className="space-y-6 font-sans max-w-7xl mx-auto w-full">
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* Header and Action */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Tools & forms</h1>
          <p className="text-sm text-slate-300 mt-1">
            Connect approved APIs, AgentCore Gateway MCP tools, and customer forms.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <span>+ Create tool</span>
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <div
            key={tool.toolId}
            className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                  {tool.displayName}
                </h3>
                <span className="bg-sky-50 text-sky-700 border border-sky-100 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wide">
                  {tool.type.toUpperCase()}
                </span>
              </div>

              <p className="text-xs text-slate-500 font-normal leading-relaxed min-h-[36px]">
                {tool.description}
              </p>

              <div className="flex items-center gap-2 pt-1">
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[11px] font-medium px-2.5 py-0.5 rounded-full">
                  {tool.enabled ? 'Enabled' : 'Disabled'}
                </span>
                <span className="bg-sky-50 text-sky-700 border border-sky-100 font-mono text-[11px] font-medium px-2.5 py-0.5 rounded-md">
                  {tool.name}
                </span>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={() => openEditModal(tool)}
                className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteTool(tool.toolId)}
                className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-colors shadow-2xs cursor-pointer"
              >
                Delete
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
