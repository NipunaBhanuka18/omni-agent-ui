import React, { useState, useEffect } from 'react';
import { Building2, Search, CheckCircle2, XCircle, Filter, Download, ArrowLeft, Eye, Edit3, Trash2, ShieldCheck, Clock, UserCheck, AlertTriangle, Key, LogOut } from 'lucide-react';
import InputField from '@/components/InputField';
import Button from '@/components/Button';

import ToastContainer, { type ToastMessage } from '@/components/Toast';

const API = 'http://localhost:3001';

export default function OrganizationManagement() {
  const [activeTab, setActiveTab] = useState<'tech' | 'finance' | 'edu' | 'healthcare' | 'manufacturing' | 'other'>('tech');
  const [viewMode, setViewMode] = useState<'active' | 'detail'>('active');
  const [selectedOrg, setSelectedOrg] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingOrg, setDeletingOrg] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Toasts state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
  };
  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const initialCompaniesByIndustry: Record<string, any[]> = {
    tech: [
      {
        id: 'comp-dialog',
        name: 'Dialog Axiata PLC',
        email: 'admin@dialog.lk',
        adminName: 'Dialog Admin',
        status: 'ACTIVE',
        lastLogin: 'Today, 11:30 AM',
        industry: 'Telecommunications & Tech',
        phone: '+94 77 733 3333',
        location: 'Colombo, Sri Lanka',
        website: 'www.dialog.lk',
      },
      {
        id: 'comp-slt',
        name: 'SLT Global (Telecom PLC)',
        email: 'admin@slt.lk',
        adminName: 'SLT Admin',
        status: 'ACTIVE',
        lastLogin: 'Today, 09:15 AM',
        industry: 'Telecommunications & Tech',
        phone: '+94 11 202 1000',
        location: 'Colombo, Sri Lanka',
        website: 'www.slt.lk',
      },
      {
        id: 'comp-apex',
        name: 'ABC Company (pvt) Ltd',
        email: 'admin@abccompany.com',
        adminName: 'Apex Staff',
        status: 'ACTIVE',
        lastLogin: 'Yesterday',
        industry: 'Enterprise Software',
        phone: '+94 11 555 8899',
        location: 'Colombo, Sri Lanka',
        website: 'www.abccompany.com',
      },
    ],
    finance: [
      {
        id: 'comp-combank',
        name: 'Commercial Bank PLC',
        email: 'contact@combank.net',
        adminName: 'Bank Admin',
        status: 'ACTIVE',
        lastLogin: '2 days ago',
        industry: 'Banking & Finance',
        phone: '+94 11 244 8448',
        location: 'Colombo, Sri Lanka',
        website: 'www.combank.lk',
      },
    ],
    edu: [],
    healthcare: [],
    manufacturing: [],
    other: [],
  };

  const [companies, setCompanies] = useState<Record<string, any[]>>(initialCompaniesByIndustry);

  // Fetch active company workspaces from backend
  const fetchCompanies = async () => {
    try {
      const rawToken = (typeof window !== 'undefined' && localStorage.getItem('omni_token')) || '';
      const authHeader = rawToken ? (rawToken.startsWith('Bearer ') ? rawToken : `Bearer ${rawToken}`) : '';
      const headers: Record<string, string> = authHeader ? { Authorization: authHeader } : {};

      const res = await fetch(`${API}/api/registrations`, { headers });
      const data = await res.json();
      const list = Array.isArray(data) ? data : (data.registrations || []);

      const freshCompanies: Record<string, any[]> = {
        tech: [
          {
            id: 'comp-dialog',
            name: 'Dialog Axiata PLC',
            email: 'admin@dialog.lk',
            adminName: 'Dialog Admin',
            status: 'ACTIVE',
            lastLogin: 'Today, 11:30 AM',
            industry: 'Telecommunications & Tech',
            phone: '+94 77 733 3333',
            location: 'Colombo, Sri Lanka',
            website: 'www.dialog.lk',
          },
          {
            id: 'comp-slt',
            name: 'SLT Global (Telecom PLC)',
            email: 'admin@slt.lk',
            adminName: 'SLT Admin',
            status: 'ACTIVE',
            lastLogin: 'Today, 09:15 AM',
            industry: 'Telecommunications & Tech',
            phone: '+94 11 202 1000',
            location: 'Colombo, Sri Lanka',
            website: 'www.slt.lk',
          },
          {
            id: 'comp-apex',
            name: 'ABC Company (pvt) Ltd',
            email: 'admin@abccompany.com',
            adminName: 'Apex Staff',
            status: 'ACTIVE',
            lastLogin: 'Yesterday',
            industry: 'Enterprise Software',
            phone: '+94 11 555 8899',
            location: 'Colombo, Sri Lanka',
            website: 'www.abccompany.com',
          },
        ],
        finance: [
          {
            id: 'comp-combank',
            name: 'Commercial Bank PLC',
            email: 'contact@combank.net',
            adminName: 'Bank Admin',
            status: 'ACTIVE',
            lastLogin: '2 days ago',
            industry: 'Banking & Finance',
            phone: '+94 11 244 8448',
            location: 'Colombo, Sri Lanka',
            website: 'www.combank.lk',
          },
        ],
        edu: [],
        healthcare: [],
        manufacturing: [],
        other: [],
      };

      if (Array.isArray(list) && list.length > 0) {
        list.forEach((req: any) => {
          const rawInd = (req.industry || req.companyType || 'tech').toLowerCase();
          let targetTab = 'tech';
          if (rawInd.includes('finance')) targetTab = 'finance';
          else if (rawInd.includes('edu')) targetTab = 'edu';
          else if (rawInd.includes('health')) targetTab = 'healthcare';
          else if (rawInd.includes('manuf')) targetTab = 'manufacturing';
          else if (rawInd.includes('tech')) targetTab = 'tech';
          else targetTab = 'other';

          const compObj = {
            id: req.id,
            name: req.companyName || req.name,
            email: req.companyEmail || req.email,
            adminName: req.adminName || 'Admin',
            status: 'ACTIVE',
            lastLogin: 'Active',
            industry: req.industry || req.companyType || 'Technology',
            phone: req.phone || req.adminPhone || '-',
            location: req.city || req.country || 'Sri Lanka',
            website: req.website || '-',
          };

          if (!freshCompanies[targetTab].some((c) => c.name.toLowerCase() === compObj.name.toLowerCase())) {
            freshCompanies[targetTab].push(compObj);
          }
        });
      }
      setCompanies(freshCompanies);
    } catch {
      console.warn('Backend not reachable');
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const currentCompanies = companies[activeTab] || [];

  const handleOpenDelete = (company: any) => {
    setDeletingOrg(company);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (deletingOrg) {
      setCompanies((prev) => ({
        ...prev,
        [activeTab]: (prev[activeTab] || []).filter((c: any) => c.id !== deletingOrg.id),
      }));
    }
    setShowDeleteModal(false);
    addToast(`Organization "${deletingOrg?.name}" has been deleted.`, 'error');
  };

  const handleOpenDetail = (company: any) => {
    setSelectedOrg(company);
    setViewMode('detail');
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Organization Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">Configure and manage active company workspaces, user access, and roles.</p>
        </div>

        <button
          onClick={() => addToast('Exporting Full Organization List Report...', 'info')}
          className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold shadow-xs hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export List Report</span>
        </button>
      </div>

      {/* Industry Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setActiveTab('tech')}
          className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'tech' ? 'bg-indigo-950 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Technology
        </button>
        <button
          onClick={() => setActiveTab('finance')}
          className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'finance' ? 'bg-indigo-950 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Finance
        </button>
        <button
          onClick={() => setActiveTab('edu')}
          className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'edu' ? 'bg-indigo-950 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Education
        </button>
        <button
          onClick={() => setActiveTab('healthcare')}
          className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'healthcare' ? 'bg-indigo-950 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Health Care
        </button>
        <button
          onClick={() => setActiveTab('manufacturing')}
          className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'manufacturing' ? 'bg-indigo-950 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Manufacturing
        </button>
        <button
          onClick={() => setActiveTab('other')}
          className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'other' ? 'bg-indigo-950 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Other
        </button>
      </div>

      {/* Active Company Container */}
      {viewMode !== 'detail' && (
        <div className="space-y-4">
          {/* Active Company Table Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-2xl bg-indigo-100 border border-indigo-200 flex items-center gap-3">
                <Building2 className="w-4 h-4 text-indigo-700" />
                <h3 className="text-xs font-black text-indigo-950">Active Company</h3>
              </div>

              <button
                onClick={() => setViewMode('active')}
                className="px-4 py-1.5 rounded-xl bg-purple-900 text-white font-bold text-xs shadow-xs"
              >
                See all
              </button>
            </div>

            {/* Filter Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Filter by name, email or role..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-3">
                <select className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none">
                  <option>All Roles</option>
                  <option>Super Admin</option>
                  <option>Org Admin</option>
                </select>
                <button className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5" />
                  <span>More Filters</span>
                </button>
              </div>
            </div>

            {/* Table View (Matching Images 1-6) */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-purple-100/60 text-purple-950 font-bold uppercase tracking-wider">
                    <th className="py-3 px-4 rounded-l-xl">Company Identity</th>
                    <th className="py-3 px-4">Admin Name</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Last Login</th>
                    <th className="py-3 px-4 text-center rounded-r-xl">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {currentCompanies.map((comp) => (
                    <tr key={comp.id} className="hover:bg-slate-50">
                      <td className="py-4 px-4 font-bold text-slate-900 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                          {comp.name.charAt(0)}
                        </div>
                        <div>
                          <span className="block font-black text-slate-900">{comp.name}</span>
                          <span className="text-[10px] font-mono text-slate-400">{comp.email}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-semibold text-slate-700">{comp.adminName}</td>
                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 w-fit ${
                          comp.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${comp.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                          {comp.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-500 font-mono">{comp.lastLogin}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() => handleOpenDetail(comp)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
                            title="View Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenDetail(comp)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50"
                            title="Edit Organization"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenDelete(comp)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                            title="Delete Company"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {currentCompanies.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-12 text-center space-y-3">
                        <Building2 className="w-10 h-10 text-slate-300 mx-auto" />
                        <span className="text-xs font-bold text-slate-400 block">No Companies Registered Yet</span>
                        <button className="px-4 py-2 rounded-xl bg-purple-900 text-white font-bold text-xs shadow-md">
                          + Add Company
                        </button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>

          {/* Bottom Stats Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">TOTAL COMPANY</span>
              <div className="flex items-baseline justify-between">
                <h3 className="text-2xl font-black text-slate-900">
                  {Object.values(companies).reduce((sum, arr) => sum + arr.length, 0)}
                </h3>
                <span className="text-xs font-bold text-emerald-600">Dynamic</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">ACTIVE NOW</span>
              <div className="flex items-baseline justify-between">
                <h3 className="text-2xl font-black text-slate-900">
                  {Object.values(companies).reduce((sum, arr) => sum + arr.length, 0)}
                </h3>
                <span className="text-[10px] font-bold text-slate-400">On-duty</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">AVG. APPROVAL TIME</span>
              <div className="flex items-baseline justify-between">
                <h3 className="text-2xl font-black text-slate-900">14h</h3>
                <span className="text-[10px] font-bold text-emerald-600">-2h trend</span>
              </div>
            </div>

            <div className="bg-emerald-50 p-4 rounded-3xl border border-emerald-100 shadow-sm space-y-1">
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">SECURITY HEALTH</span>
              <h3 className="text-2xl font-black text-emerald-700">Optimal</h3>
            </div>
          </div>

        </div>
      )}

      {/* 3. Detailed Super Admin Organization Profile View (Matching Image 4 Bottom) */}
      {viewMode === 'detail' && selectedOrg && (
        <div className="space-y-6">
          
          <button
            onClick={() => setViewMode('active')}
            className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Organization Directory</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Organization Identity (6 cols) */}
            <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-xl flex items-center justify-center shadow-lg">
                  {selectedOrg.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900">{selectedOrg.name}</h2>
                  <span className="text-xs font-bold text-indigo-600">{selectedOrg.industry} Company</span>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-400 font-bold">Admin Name</span>
                  <span className="font-bold text-slate-900">{selectedOrg.adminName}</span>
                </div>

                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-400 font-bold">Email</span>
                  <span className="font-mono font-bold text-indigo-600">{selectedOrg.email}</span>
                </div>

                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-400 font-bold">Web site</span>
                  <span className="font-mono text-slate-700">{selectedOrg.website}</span>
                </div>

                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-400 font-bold">Location</span>
                  <span className="font-bold text-slate-900">{selectedOrg.location}</span>
                </div>

                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-400 font-bold">Contact No</span>
                  <span className="font-mono font-bold text-slate-900">{selectedOrg.phone}</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-extrabold text-slate-900 mb-1">About The Organization</h4>
                <p className="text-xs text-slate-500 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  {selectedOrg.name} is a leading technology-driven organization focusing on creating smarter, faster, and more reliable solutions. Connected to SLT Global AI Router node.
                </p>
              </div>

              <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100">
                <button
                  onClick={() => addToast('Session Terminated for Admin User!', 'info')}
                  className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-md cursor-pointer"
                >
                  Session Terminate This User
                </button>
                <button
                  onClick={() => addToast('Changes Updated Successfully!', 'success')}
                  className="px-6 py-2.5 rounded-xl bg-purple-900 hover:bg-purple-950 text-white font-bold text-xs shadow-md cursor-pointer"
                >
                  Update Changes
                </button>
              </div>
            </div>

            {/* Right Column: Account Metadata, Permissions, Login History (6 cols) */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* Account Metadata Card */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">ACCOUNT METADATA</h3>
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1 rounded-xl bg-indigo-950 text-white text-[10px] font-bold">Deactivate User</button>
                    <button className="px-3 py-1 rounded-xl border border-slate-300 text-slate-700 text-[10px] font-bold">Reset Access</button>
                    <button className="px-3 py-1 rounded-xl border border-red-300 text-red-600 text-[10px] font-bold">Remove User</button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold">Created On</span>
                    <span className="font-bold text-slate-900">October 12, 2021</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold">Last Password Change</span>
                    <span className="font-bold text-slate-900">15 days ago</span>
                  </div>
                </div>
              </div>

              {/* Permissions Card */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">Permissions</h3>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 block">Profile Settings</span>
                      <span className="text-[9px] text-slate-400">Create and delete system folders</span>
                    </div>
                    <input type="checkbox" defaultChecked className="rounded text-purple-600" />
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 block">View Analytics</span>
                      <span className="text-[9px] text-slate-400">Access usage data dashboards</span>
                    </div>
                    <input type="checkbox" defaultChecked className="rounded text-purple-600" />
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 block">Configure Omni Channel</span>
                      <span className="text-[9px] text-slate-400">Edit routing and load balancing</span>
                    </div>
                    <input type="checkbox" defaultChecked className="rounded text-purple-600" />
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 block">User Deletion</span>
                      <span className="text-[9px] text-slate-400">Capability to remove other admins</span>
                    </div>
                    <input type="checkbox" defaultChecked className="rounded text-purple-600" />
                  </div>
                </div>
              </div>

              {/* Login History Table */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">Login History</h3>
                  <button className="text-[10px] font-bold text-indigo-600 hover:underline">Export Log Report</button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[11px]">
                    <thead>
                      <tr className="text-slate-400 font-bold uppercase border-b border-slate-100">
                        <th className="py-2 px-2">DATE &amp; TIME</th>
                        <th className="py-2 px-2">LOCATION</th>
                        <th className="py-2 px-2">DEVICE ID</th>
                        <th className="py-2 px-2">STATUS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      <tr>
                        <td className="py-2 px-2 font-mono">2023-11-24 10:45 AM</td>
                        <td className="py-2 px-2">Colombo, SL</td>
                        <td className="py-2 px-2 font-mono text-slate-400">UM-PR1-12-KMC-AS</td>
                        <td className="py-2 px-2"><span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[9px]">Success</span></td>
                      </tr>
                      <tr>
                        <td className="py-2 px-2 font-mono">2023-11-23 09:12 PM</td>
                        <td className="py-2 px-2">Kandy, SL</td>
                        <td className="py-2 px-2 font-mono text-slate-400">UM-PR1-12-NEN-XS</td>
                        <td className="py-2 px-2"><span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[9px]">Success</span></td>
                      </tr>
                      <tr>
                        <td className="py-2 px-2 font-mono">2023-11-22 03:33 AM</td>
                        <td className="py-2 px-2 text-red-500 font-bold">Unrecognized</td>
                        <td className="py-2 px-2 font-mono text-slate-400">UM-PR1-12-UNK-ZZ</td>
                        <td className="py-2 px-2"><span className="px-2 py-0.5 rounded-full bg-red-100 text-red-800 font-bold text-[9px]">Blocked</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* Delete Confirmation Modal (Matching Image 4 Top) */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full border border-slate-200 shadow-2xl text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-red-100 text-red-600 flex items-center justify-center">
              <Trash2 className="w-8 h-8" />
            </div>

            <h3 className="text-lg font-black text-slate-900">DELETE COMPANY</h3>
            <p className="text-xs text-slate-500">Do you really want to delete this Company? This process can not be undone.</p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="py-2.5 px-4 rounded-xl border border-red-400 text-red-600 font-bold text-xs hover:bg-red-50"
              >
                CANCEL
              </button>
              <button
                onClick={handleConfirmDelete}
                className="py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md"
              >
                DELETE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Render Toast Notifications */}
      <ToastContainer toasts={toasts} onClose={removeToast} />

    </div>
  );
}
