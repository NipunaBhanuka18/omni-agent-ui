import React, { useState } from 'react';
import { Code2, Plus, Settings, AlertTriangle, CheckCircle2, RefreshCw, Activity, ArrowUpRight, Building2, ArrowLeft, Power } from 'lucide-react';
import Button from '@/components/Button';
import InputField from '@/components/InputField';

export default function Api() {
  const [selectedOrg, setSelectedOrg] = useState<string | null>('ABC Company (pvt) Ltd');
  const [apiMasterEnabled, setApiMasterEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState<'billing' | 'package' | 'account' | 'fault'>('billing');
  const [showModal, setShowModal] = useState(false);
  const [newApiName, setNewApiName] = useState('');
  const [newApiEndpoint, setNewApiEndpoint] = useState('');

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

  const tabs = [
    { id: 'billing', label: 'Billing API' },
    { id: 'package', label: 'Package API' },
    { id: 'account', label: 'Account API' },
    { id: 'fault', label: 'Fault API' },
  ];

  const endpointsMap = {
    billing: [
      { id: 'EP-1', name: 'Billing Services', version: 'v2.4 /api/billing', status: 'Active', latency: '42ms', throughput: '1.2k req/s', errorRate: '0.02%' },
      { id: 'EP-2', name: 'UserSync Gateway', version: 'v1.0 /api/users', status: 'Active', latency: '128ms', throughput: '840 req/s', errorRate: '0.15%' },
      { id: 'EP-3', name: 'Network Monitoring', version: 'v3.5 /api/telemetry', status: 'Critical', latency: '1500ms', throughput: '12 req/s', errorRate: '24.5%' },
      { id: 'EP-4', name: 'Network Monitoring', version: 'v3.0 /api/v3/telemetry', status: 'Active', latency: '234ms', throughput: '16 req/s', errorRate: '24.5%' },
    ],
    package: [
      { id: 'EP-5', name: 'Package Catalog API', version: 'v1.2 /api/packages', status: 'Active', latency: '35ms', throughput: '2.4k req/s', errorRate: '0.01%' },
      { id: 'EP-6', name: 'Subscription Router', version: 'v2.0 /api/subscriptions', status: 'Active', latency: '92ms', throughput: '1.1k req/s', errorRate: '0.08%' },
    ],
    account: [
      { id: 'EP-7', name: 'Account Auth Service', version: 'v3.0 /api/auth', status: 'Active', latency: '48ms', throughput: '3.8k req/s', errorRate: '0.03%' },
      { id: 'EP-8', name: 'Tenant Profile Gateway', version: 'v1.5 /api/tenants', status: 'Active', latency: '65ms', throughput: '920 req/s', errorRate: '0.04%' },
    ],
    fault: [
      { id: 'EP-9', name: 'Fault Diagnostics', version: 'v1.0 /api/faults', status: 'Active', latency: '110ms', throughput: '340 req/s', errorRate: '0.12%' },
      { id: 'EP-10', name: 'Telemetry Log Collector', version: 'v2.2 /api/logs', status: 'Critical', latency: '1850ms', throughput: '45 req/s', errorRate: '18.2%' },
    ],
  };

  const currentEndpoints = endpointsMap[activeTab];

  const handleRegisterApi = (e: React.FormEvent) => {
    e.preventDefault();
    setShowModal(false);
    setNewApiName('');
    setNewApiEndpoint('');
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* If No Organization is Selected -> Show Organization Selector Grid */}
      {!selectedOrg ? (
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Select The Organization</h1>
            <p className="text-xs text-slate-500">Select the Organization (Company) to manage the API of key.</p>
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
        /* API Gateway Management View for Selected Organization (Matching API 5, 6, 7, 8) */
        <div className="space-y-6">
          
          {/* Top Banner with Company Header Badge */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-3xl shadow-xl border border-indigo-900/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <button
                onClick={() => setSelectedOrg(null)}
                className="text-xs font-bold text-cyan-400 hover:underline flex items-center gap-1 mb-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Switch Organization</span>
              </button>
              <h1 className="text-2xl font-black tracking-tight">API Overview</h1>
              <p className="text-xs text-slate-300 mt-0.5">Real-time infrastructure health and user growth metrics for SLT Global.</p>
            </div>

            {/* Selected Organization Header Badge */}
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

          {/* Master API Enable/Disable Card (Matching API 5) */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3 max-w-md">
            <span className="text-xs font-bold text-slate-500 block">API Enable or Disable for company's</span>
            <div className="p-4 rounded-2xl bg-indigo-950 text-white flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <Power className={`w-5 h-5 ${apiMasterEnabled ? 'text-emerald-400' : 'text-slate-500'}`} />
                <span className="text-xs font-bold">{apiMasterEnabled ? 'API Enable' : 'API Disable'}</span>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={apiMasterEnabled}
                  onChange={(e) => setApiMasterEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
          </div>

          {/* API Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-3">
            {tabs.map((t) => {
              const active = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id as any)}
                  className={`px-6 py-3 rounded-2xl text-xs font-bold transition-all ${
                    active
                      ? 'bg-indigo-950 text-white shadow-lg ring-2 ring-indigo-500/50'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>

          {/* API Gateway Management Table Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            
            {/* Table Header Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">API Gateway Management</h2>
                <p className="text-xs text-slate-500">Active endpoints and real-time performance metrics</p>
              </div>

              <button
                onClick={() => setShowModal(true)}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>+ Create New API</span>
              </button>
            </div>

            {/* Endpoints Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-cyan-100/60 border-y border-cyan-200 text-slate-800 font-bold uppercase tracking-wider">
                    <th className="py-3 px-4 rounded-l-xl">Endpoint</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Latency</th>
                    <th className="py-3 px-4">Throughput</th>
                    <th className="py-3 px-4">Error Rate</th>
                    <th className="py-3 px-4 text-right rounded-r-xl">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {currentEndpoints.map((ep) => (
                    <tr key={ep.id} className="hover:bg-slate-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                            <Code2 className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block">{ep.name}</span>
                            <span className="text-[11px] font-mono text-slate-400">{ep.version}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 w-fit ${
                          ep.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${ep.status === 'Active' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                          {ep.status}
                        </span>
                      </td>

                      <td className="py-4 px-4 font-semibold text-slate-800">{ep.latency}</td>
                      <td className="py-4 px-4 font-semibold text-slate-800">{ep.throughput}</td>

                      <td className="py-4 px-4">
                        <span className={`font-bold ${parseFloat(ep.errorRate) > 5 ? 'text-red-600' : 'text-slate-700'}`}>
                          {ep.errorRate}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-right">
                        <button className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                          <Settings className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

        </div>
      )}

      {/* Register New API Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-slate-200 shadow-2xl space-y-4">
            <h3 className="text-xl font-bold text-slate-900">Create New API Endpoint</h3>

            <form onSubmit={handleRegisterApi} className="space-y-4">
              <InputField
                label="API Service Name"
                placeholder="e.g. Payment Gateway Service"
                value={newApiName}
                onChange={(e) => setNewApiName(e.target.value)}
                required
              />

              <InputField
                label="Endpoint Route URL"
                placeholder="e.g. /api/v1/payments"
                value={newApiEndpoint}
                onChange={(e) => setNewApiEndpoint(e.target.value)}
                required
              />

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className="rounded-xl px-6 py-2 bg-indigo-600 text-white font-bold text-xs"
                >
                  Register Endpoint
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
