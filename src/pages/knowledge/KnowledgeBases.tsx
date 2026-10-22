import React, { useState } from 'react';
import { Database, Plus, Upload, RefreshCw, Trash2, FileText, CheckCircle2, AlertCircle, Clock, ExternalLink, ShieldCheck, Sparkles, Folder } from 'lucide-react';
import ToastContainer, { type ToastMessage } from '@/components/Toast';

export interface KnowledgeBaseItem {
  kbId: string;
  name: string;
  description: string;
  bedrockKnowledgeBaseId: string;
  dataSourceId: string;
  status: 'READY' | 'SYNCING' | 'FAILED';
  lastSync?: string;
  documentsCount: number;
}

export default function KnowledgeBases() {
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBaseItem[]>([
    {
      kbId: 'kb-products',
      name: 'Products & Packages',
      description: 'Approved package, pricing, tariff, and SLT-Mobitel service information.',
      bedrockKnowledgeBaseId: 'KB-SLT-PROD-001',
      dataSourceId: 'DS-SLT-001',
      status: 'READY',
      lastSync: '10 mins ago',
      documentsCount: 14,
    },
    {
      kbId: 'kb-support',
      name: 'Support & Troubleshooting Guides',
      description: 'Technical troubleshooting, router setup, ONU configurations, and customer help articles.',
      bedrockKnowledgeBaseId: 'KB-SLT-SUPP-002',
      dataSourceId: 'DS-SLT-002',
      status: 'READY',
      lastSync: '1 hour ago',
      documentsCount: 28,
    },
    {
      kbId: 'kb-billing',
      name: 'Billing Policies & FAQs',
      description: 'Payment channels, billing cycles, VAT/SSCL rules, and overdue disconnection policies.',
      bedrockKnowledgeBaseId: 'KB-SLT-BILL-003',
      dataSourceId: 'DS-SLT-003',
      status: 'READY',
      lastSync: 'Yesterday',
      documentsCount: 9,
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

  // Add KB Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    kbId: '',
    bedrockKnowledgeBaseId: '',
    dataSourceId: '',
    description: '',
  });

  // Upload Document Modal State
  const [activeUploadKb, setActiveUploadKb] = useState<KnowledgeBaseItem | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleAddKb = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.kbId) {
      addToast('Please fill in required fields', 'error');
      return;
    }

    const newKb: KnowledgeBaseItem = {
      kbId: formData.kbId.toLowerCase().replace(/\s+/g, '-'),
      name: formData.name,
      description: formData.description || 'Tenant isolated knowledge base.',
      bedrockKnowledgeBaseId: formData.bedrockKnowledgeBaseId || `KB-${Date.now().toString().slice(-6)}`,
      dataSourceId: formData.dataSourceId || `DS-${Date.now().toString().slice(-6)}`,
      status: 'READY',
      lastSync: 'Just now',
      documentsCount: 0,
    };

    setKnowledgeBases((prev) => [newKb, ...prev]);
    setIsAddModalOpen(false);
    setFormData({ name: '', kbId: '', bedrockKnowledgeBaseId: '', dataSourceId: '', description: '' });
    addToast(`Knowledge Base '${newKb.name}' created successfully!`, 'success');
  };

  const handleDeleteKb = (kbId: string) => {
    if (confirm('Are you sure you want to delete this Knowledge Base? Connected agents will lose access to its documents.')) {
      setKnowledgeBases((prev) => prev.filter((k) => k.kbId !== kbId));
      addToast('Knowledge base deleted', 'info');
    }
  };

  const handleSyncKb = (kbId: string) => {
    setKnowledgeBases((prev) =>
      prev.map((k) => (k.kbId === kbId ? { ...k, status: 'SYNCING' } : k))
    );
    addToast('Bedrock Knowledge Base sync initiated...', 'info');

    setTimeout(() => {
      setKnowledgeBases((prev) =>
        prev.map((k) =>
          k.kbId === kbId ? { ...k, status: 'READY', lastSync: 'Just now' } : k
        )
      );
      addToast('Bedrock Knowledge Base synchronized successfully!', 'success');
    }, 2200);
  };

  const handleUploadFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !activeUploadKb) return;

    setIsUploading(true);
    setTimeout(() => {
      setKnowledgeBases((prev) =>
        prev.map((k) =>
          k.kbId === activeUploadKb.kbId
            ? { ...k, documentsCount: k.documentsCount + 1, lastSync: 'Pending sync' }
            : k
        )
      );
      setIsUploading(false);
      addToast(`Document '${selectedFile.name}' uploaded to ${activeUploadKb.name}! Click 'Sync' to index.`, 'success');
      setActiveUploadKb(null);
      setSelectedFile(null);
    }, 1500);
  };

  return (
    <div className="space-y-6 font-sans max-w-7xl mx-auto w-full">
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-3xl border border-indigo-900/50 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-cyan-400 shadow-md">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-tight">Bedrock Knowledge Bases</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black uppercase tracking-wider">
                Tenant Isolated
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Manage Amazon Bedrock Knowledge Bases, tenant-scoped S3 data sources, and vector embeddings.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Knowledge Base</span>
        </button>
      </div>

      {/* Tenant Boundary Notice Box */}
      <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0" />
          <p className="text-xs text-slate-700 font-medium">
            <strong className="text-indigo-900 font-bold">Vector Data Isolation:</strong> Every document uploaded is stored under this tenant's dedicated S3 prefix (<code className="bg-indigo-100 px-1.5 py-0.5 rounded font-mono text-[11px] text-indigo-800">s3://omni-kb/ten_slt/</code>) and indexed with company-specific metadata filters.
          </p>
        </div>
      </div>

      {/* Knowledge Base Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {knowledgeBases.map((kb) => (
          <div
            key={kb.kbId}
            className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-base font-black text-slate-900 tracking-tight">{kb.name}</h3>
                  <span className="font-mono text-[10px] text-slate-400 block mt-0.5">{kb.kbId}</span>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 ${
                    kb.status === 'READY'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : kb.status === 'SYNCING'
                      ? 'bg-amber-100 text-amber-800 border border-amber-200 animate-pulse'
                      : 'bg-rose-100 text-rose-800 border border-rose-200'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${kb.status === 'READY' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  {kb.status}
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-medium line-clamp-3">
                {kb.description}
              </p>

              {/* Bedrock & S3 Metadata Pill Badges */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-semibold">Bedrock KB ID:</span>
                  <span className="font-mono font-bold text-slate-700">{kb.bedrockKnowledgeBaseId}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-semibold">Data Source:</span>
                  <span className="font-mono font-bold text-slate-700">{kb.dataSourceId}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-semibold">Documents Indexed:</span>
                  <span className="font-bold text-indigo-600">{kb.documentsCount} source files</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-semibold">Last Synced:</span>
                  <span className="text-slate-500 flex items-center gap-1 font-medium">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {kb.lastSync || 'Never'}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions Toolbar */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveUploadKb(kb)}
                  className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Files</span>
                </button>
                <button
                  onClick={() => handleSyncKb(kb.kbId)}
                  disabled={kb.status === 'SYNCING'}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${kb.status === 'SYNCING' ? 'animate-spin' : ''}`} />
                  <span>Sync</span>
                </button>
              </div>

              <button
                onClick={() => handleDeleteKb(kb.kbId)}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                title="Delete Knowledge Base"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* === MODAL: ADD KNOWLEDGE BASE === */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Add Knowledge Base</h3>
                  <p className="text-xs text-slate-500">Connect a Bedrock RAG vector store</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg p-1"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddKb} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Knowledge Base Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Products & Tariffs"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Internal ID *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="kb-products"
                    value={formData.kbId}
                    onChange={(e) => setFormData({ ...formData, kbId: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Bedrock KB ID
                  </label>
                  <input
                    type="text"
                    placeholder="KB-SLT-001"
                    value={formData.bedrockKnowledgeBaseId}
                    onChange={(e) => setFormData({ ...formData, bedrockKnowledgeBaseId: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Bedrock Data Source ID
                </label>
                <input
                  type="text"
                  placeholder="DS-SLT-DATA-01"
                  value={formData.dataSourceId}
                  onChange={(e) => setFormData({ ...formData, dataSourceId: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Description & Grounding Purpose
                </label>
                <textarea
                  rows={3}
                  placeholder="What company knowledge does this knowledge base provide to the AI agent?"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md cursor-pointer"
                >
                  Save Knowledge Base
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* === MODAL: UPLOAD FILE TO KB === */}
      {activeUploadKb && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900">Upload Source Documents</h3>
                <p className="text-xs text-indigo-600 font-bold">{activeUploadKb.name}</p>
              </div>
              <button
                onClick={() => setActiveUploadKb(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg p-1"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleUploadFile} className="space-y-4">
              <div className="border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-2xl p-6 text-center bg-slate-50/50 transition-colors cursor-pointer relative">
                <input
                  type="file"
                  required
                  accept=".pdf,.docx,.txt,.md,.csv,.html"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <Folder className="w-10 h-10 text-indigo-500 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-800">
                  {selectedFile ? selectedFile.name : 'Choose a file or drag & drop'}
                </p>
                <p className="text-[10px] text-slate-400 mt-1">
                  Supported formats: PDF, DOCX, TXT, MD, CSV, HTML (Max 25MB)
                </p>
              </div>

              {selectedFile && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-emerald-800 text-xs font-medium">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span className="truncate">Ready: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)</span>
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveUploadKb(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedFile || isUploading}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md disabled:opacity-50 flex items-center gap-2"
                >
                  {isUploading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Uploading to S3...</span>
                    </>
                  ) : (
                    <span>Upload & Queue Ingestion</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
