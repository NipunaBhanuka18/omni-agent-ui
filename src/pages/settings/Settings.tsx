import React, { useState } from 'react';
import {
  User, Mail, Calendar, Briefcase,
  Shield, Smartphone, Key, Lock, Monitor, Database,
  Trash2, Link2, GitBranch, Globe2, AlertTriangle, Check,
  Camera, Sun, Moon, Download, LogOut, ChevronRight, ShieldCheck
} from 'lucide-react';

type SettingsTab = 'personal' | 'security';

import ToastContainer, { type ToastMessage } from '@/components/Toast';
import { useAuthStore } from '@/store/authStore';

export default function Settings() {
  const user = useAuthStore((state) => state.user);
  const [activeTab, setActiveTab] = useState<SettingsTab>('personal');

  // Toasts state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
  };
  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    confirmText: string;
    variant: 'danger' | 'warning' | 'primary';
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    description: '',
    confirmText: 'Confirm',
    variant: 'primary',
    onConfirm: () => {},
  });

  const openConfirmModal = (
    title: string,
    description: string,
    confirmText: string,
    variant: 'danger' | 'warning' | 'primary',
    onConfirm: () => void
  ) => {
    setConfirmModal({
      isOpen: true,
      title,
      description,
      confirmText,
      variant,
      onConfirm,
    });
  };

  const closeConfirmModal = () => {
    setConfirmModal((prev) => ({ ...prev, isOpen: false }));
  };

  // Avatar Upload State & Ref
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(user?.avatar || null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatarUrl(event.target?.result as string);
        addToast('Profile photo updated successfully!', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  // Personal Info State
  const [fullName, setFullName] = useState(user?.name || user?.fullName || (user?.email ? user.email.split('@')[0] : ''));
  const [username, setUsername] = useState(user?.username || (user?.email ? `@${user.email.split('@')[0]}` : ''));
  const [email, setEmail] = useState(user?.email || '');
  const [dateOfBirth, setDateOfBirth] = useState(user?.dateOfBirth || '');
  const [role, setRole] = useState(user?.role === 'super_admin' ? 'Super Administrator' : (user?.role || 'System Admin'));
  const [bio, setBio] = useState(user?.bio || '');

  // Linked Accounts State
  const [linkedAccounts, setLinkedAccounts] = useState([
    { id: 'google', label: 'Google Account', hint: user?.email || 'superadmin@slt.lk', linked: true, color: 'text-red-500', icon: Globe2 },
    { id: 'github', label: 'GitHub', hint: 'Not Connected', linked: false, color: 'text-slate-800', icon: GitBranch },
  ]);

  // Active Sessions State
  const [sessions, setSessions] = useState([
    { id: '1', device: 'Windows PC — Chrome', location: 'Colombo, Sri Lanka', time: 'Current Session', active: true },
    { id: '2', device: 'iPhone 14 — Safari', location: 'Colombo, Sri Lanka', time: '2 hours ago', active: false },
  ]);

  // Display Preferences
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true' || document.documentElement.classList.contains('dark');
  });

  const [compactView, setCompactView] = useState(() => {
    return localStorage.getItem('compactView') === 'true' || document.body.classList.contains('compact-view');
  });

  const toggleDarkMode = (value: boolean) => {
    setDarkMode(value);
    localStorage.setItem('darkMode', String(value));
    if (value) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    addToast(value ? 'Dark Mode Enabled' : 'Light Mode Enabled', 'info');
  };

  const toggleCompactView = (value: boolean) => {
    setCompactView(value);
    localStorage.setItem('compactView', String(value));
    if (value) {
      document.body.classList.add('compact-view');
    } else {
      document.body.classList.remove('compact-view');
    }
    addToast(value ? 'Compact View Enabled' : 'Standard View Enabled', 'info');
  };

  // Security State
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [smsAuthEnabled, setSmsAuthEnabled] = useState(true);
  const [appAuthEnabled, setAppAuthEnabled] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSavePersonal = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('Personal information saved successfully!', 'success');
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      addToast('Please enter your current password.', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      addToast('New passwords do not match!', 'error');
      return;
    }
    addToast('Password changed successfully!', 'success');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const tabs: { id: SettingsTab; label: string; icon: React.ElementType }[] = [
    { id: 'personal', label: 'Personal Information', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  return (
    <div className="space-y-6 font-sans">

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Settings</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage your account preferences and security settings.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-3 h-3" />
            Super Admin
          </span>
          <button
            onClick={handleSavePersonal}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white font-bold text-xs shadow-md transition-all"
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* Left Sidebar: Tab Navigation */}
        <div className="lg:col-span-3 space-y-2">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-3 space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all text-left ${
                    active
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${active ? 'bg-white/20' : 'bg-slate-100'}`}>
                    <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-600'}`} />
                  </div>
                  <span>{tab.label}</span>
                  {active && <ChevronRight className="w-3.5 h-3.5 ml-auto" />}
                </button>
              );
            })}
          </div>

          {/* Quick Stats Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 space-y-3">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Account Status</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">Account Type</span>
                <span className="font-bold text-indigo-700">Super Admin</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">2FA Status</span>
                <span className={`font-bold ${twoFactorEnabled ? 'text-emerald-600' : 'text-red-600'}`}>
                  {twoFactorEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">Member Since</span>
                <span className="font-bold text-slate-700">Jan 2024</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Tab Content */}
        <div className="lg:col-span-9 space-y-6">

          {/* ========== PERSONAL INFORMATION TAB ========== */}
          {activeTab === 'personal' && (
            <>
              {/* Profile Card */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-5">
                  <User className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Personal Information</h3>
                </div>

                <form onSubmit={handleSavePersonal}>
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* Avatar Section */}
                    <div className="lg:col-span-3 flex flex-col items-center gap-4">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handlePhotoUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      <div className="relative group">
                        {avatarUrl ? (
                          <img
                            src={avatarUrl}
                            alt="Profile Avatar"
                            className="w-28 h-28 rounded-3xl object-cover shadow-xl shadow-indigo-500/25 border-2 border-indigo-500"
                          />
                        ) : (
                          <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-black text-3xl flex items-center justify-center shadow-xl shadow-indigo-500/25">
                            {fullName ? fullName.substring(0, 2).toUpperCase() : (email ? email.substring(0, 2).toUpperCase() : 'US')}
                          </div>
                        )}
                        <button
                          type="button"
                          className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Camera className="w-6 h-6 text-white" />
                        </button>
                      </div>
                      <div className="text-center space-y-0.5">
                        <p className="text-xs font-bold text-slate-900">{fullName}</p>
                        <p className="text-[10px] text-slate-400">{username}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] flex items-center gap-1.5 cursor-pointer"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        Change Photo
                      </button>
                    </div>

                    {/* Form Fields */}
                    <div className="lg:col-span-9 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Name</label>
                          <div className="relative">
                            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                              type="text"
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">Username</label>
                          <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">@</span>
                            <input
                              type="text"
                              value={username.replace('@', '')}
                              onChange={(e) => setUsername('@' + e.target.value)}
                              className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">Date of Birth</label>
                          <div className="relative">
                            <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                              type="date"
                              value={dateOfBirth}
                              onChange={(e) => setDateOfBirth(e.target.value)}
                              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">Role / Position</label>
                          <div className="relative">
                            <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                              type="text"
                              value={role}
                              onChange={(e) => setRole(e.target.value)}
                              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Bio</label>
                        <textarea
                          rows={3}
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        />
                        <span className="text-[10px] text-slate-400 mt-1 block text-right">{bio.length} / 300 characters</span>
                      </div>

                      <div className="flex justify-end pt-2">
                        <button
                          type="submit"
                          className="px-8 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-md transition-all"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              {/* Display Preferences */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Display Preferences</h3>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-3">
                      {darkMode ? <Moon className="w-4 h-4 text-indigo-600" /> : <Sun className="w-4 h-4 text-amber-500" />}
                      <div>
                        <p className="text-xs font-bold text-slate-900">Dark Mode</p>
                        <p className="text-[10px] text-slate-400">Switch to a darker interface for low-light environments</p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleDarkMode(!darkMode)}
                      className={`relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none ${darkMode ? 'bg-indigo-600' : 'bg-slate-300'}`}
                    >
                      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${darkMode ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div>
                      <p className="text-xs font-bold text-slate-900">Compact View</p>
                      <p className="text-[10px] text-slate-400">Reduce spacing for a denser, information-rich layout</p>
                    </div>
                    <button
                      onClick={() => toggleCompactView(!compactView)}
                      className={`relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none ${compactView ? 'bg-indigo-600' : 'bg-slate-300'}`}
                    >
                      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${compactView ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Data & Privacy */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Data & Privacy</h3>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-blue-50/60 border border-blue-100">
                    <div>
                      <p className="text-xs font-bold text-slate-900">Export User Data</p>
                      <p className="text-[10px] text-slate-400">Download a copy of all your account data and activity</p>
                    </div>
                    <button
                      onClick={() => addToast('Data export initiated. Download link sent to email.', 'info')}
                      className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-indigo-600" />
                      Export Data
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-2xl bg-red-50/60 border border-red-100">
                    <div>
                      <AlertTriangle className="w-4 h-4 text-red-500 mb-1" />
                      <p className="text-xs font-bold text-red-900">Delete Account</p>
                      <p className="text-[10px] text-red-400">Permanently remove your account and all associated data</p>
                    </div>
                    <button
                      onClick={() =>
                        openConfirmModal(
                          'Delete Account',
                          'Are you sure you want to permanently delete your account? All associated workspace data, channels, and logs will be permanently removed. This action cannot be undone.',
                          'Delete Account',
                          'danger',
                          () => {
                            closeConfirmModal();
                            addToast('Account deletion request processed successfully.', 'error');
                          }
                        )
                      }
                      className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md flex items-center gap-1.5 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>

              {/* Linked Accounts */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <Link2 className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Linked Accounts</h3>
                </div>

                <div className="space-y-3">
                  {linkedAccounts.map((acct) => (
                    <div key={acct.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-3">
                        <acct.icon className={`w-5 h-5 ${acct.color}`} />
                        <div>
                          <p className="text-xs font-bold text-slate-900">{acct.label}</p>
                          <p className="text-[10px] text-slate-400">{acct.hint}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          if (acct.linked) {
                            openConfirmModal(
                              `Unlink ${acct.label}`,
                              `Are you sure you want to unlink ${acct.label} (${acct.hint}) from your OmniAI account?`,
                              'Unlink Account',
                              'warning',
                              () => {
                                closeConfirmModal();
                                setLinkedAccounts((prev) =>
                                  prev.map((a) => (a.id === acct.id ? { ...a, linked: false, hint: 'Not Connected' } : a))
                                );
                                addToast(`${acct.label} unlinked successfully.`, 'info');
                              }
                            );
                          } else {
                            setLinkedAccounts((prev) =>
                              prev.map((a) => (a.id === acct.id ? { ...a, linked: true, hint: email || 'Connected' } : a))
                            );
                            addToast(`${acct.label} connected successfully.`, 'success');
                          }
                        }}
                        className={`px-4 py-1.5 rounded-xl text-[11px] font-bold border cursor-pointer transition-all ${
                          acct.linked
                            ? 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100'
                            : 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100'
                        }`}
                      >
                        {acct.linked ? 'Unlink' : 'Connect'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ========== SECURITY TAB ========== */}
          {activeTab === 'security' && (
            <>
              {/* Two-Factor Authentication */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-5">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Two-Factor Authentication</h3>
                </div>

                {/* Master Toggle */}
                <div className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-colors ${twoFactorEnabled ? 'bg-emerald-50/60 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${twoFactorEnabled ? 'bg-emerald-100' : 'bg-slate-200'}`}>
                      <Shield className={`w-5 h-5 ${twoFactorEnabled ? 'text-emerald-700' : 'text-slate-500'}`} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Two-Factor Authentication (2FA)</p>
                      <p className="text-[10px] text-slate-400">Add an extra layer of security to your account</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setTwoFactorEnabled(!twoFactorEnabled);
                      addToast(!twoFactorEnabled ? '2FA Enabled' : '2FA Disabled', 'info');
                    }}
                    className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${twoFactorEnabled ? 'bg-emerald-500' : 'bg-slate-300'}`}
                  >
                    <span className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${twoFactorEnabled ? 'translate-x-7' : 'translate-x-0'}`} />
                  </button>
                </div>

                {/* 2FA Methods */}
                {twoFactorEnabled && (
                  <div className="space-y-3 pl-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Authentication Methods</p>

                    {/* SMS Auth */}
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center">
                          <Smartphone className="w-4 h-4 text-blue-700" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">SMS Authentication</p>
                          <p className="text-[10px] text-slate-400">Receive OTP codes via SMS to your mobile number</p>
                          <p className="text-[10px] text-blue-600 font-bold mt-0.5">+94 77 ••• ••• 67</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setSmsAuthEnabled(!smsAuthEnabled);
                          addToast(!smsAuthEnabled ? 'SMS Auth Enabled' : 'SMS Auth Disabled', 'info');
                        }}
                        className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${smsAuthEnabled ? 'bg-indigo-600' : 'bg-slate-300'}`}
                      >
                        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${smsAuthEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                      </button>
                    </div>

                    {/* Authenticator App */}
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center">
                          <Key className="w-4 h-4 text-purple-700" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">Authenticator App</p>
                          <p className="text-[10px] text-slate-400">Use Google Authenticator or similar TOTP apps</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setAppAuthEnabled(!appAuthEnabled);
                          addToast(!appAuthEnabled ? 'Authenticator App Enabled' : 'Authenticator App Disabled', 'info');
                        }}
                        className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${appAuthEnabled ? 'bg-indigo-600' : 'bg-slate-300'}`}
                      >
                        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${appAuthEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Change Password */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-5">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Change Password</h3>
                </div>

                <form onSubmit={handleSavePassword} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Current Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter current password"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">New Password</label>
                      <div className="relative">
                        <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Enter new password"
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Confirm New Password</label>
                      <div className="relative">
                        <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Re-enter new password"
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Password Strength Hint */}
                  <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-100 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-amber-800 font-medium">
                      Password must be at least 8 characters, include uppercase, lowercase, and a number.
                    </p>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-8 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-md flex items-center gap-2 cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      Update Password
                    </button>
                  </div>
                </form>
              </div>

              {/* Session Management */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <LogOut className="w-4 h-4 text-red-500" />
                  <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Active Sessions</h3>
                </div>

                <div className="space-y-3">
                  {sessions.map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <div>
                        <p className="text-xs font-bold text-slate-900">{session.device}</p>
                        <p className="text-[10px] text-slate-400">{session.location} · {session.time}</p>
                      </div>
                      {session.active ? (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">● Active</span>
                      ) : (
                        <button
                          onClick={() =>
                            openConfirmModal(
                              'Revoke Session',
                              `Are you sure you want to revoke the active session on ${session.device}? The session will be ended immediately.`,
                              'Revoke Session',
                              'warning',
                              () => {
                                closeConfirmModal();
                                setSessions((prev) => prev.filter((s) => s.id !== session.id));
                                addToast(`Session on ${session.device} revoked successfully.`, 'info');
                              }
                            )
                          }
                          className="px-3 py-1.5 rounded-xl bg-red-50 border border-red-200 text-red-700 font-bold text-[11px] hover:bg-red-100 cursor-pointer transition-all"
                        >
                          Revoke
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  onClick={() =>
                    openConfirmModal(
                      'Revoke All Other Sessions',
                      'Are you sure you want to log out all other active sessions across all devices? Only your current session will remain active.',
                      'Revoke All Sessions',
                      'danger',
                      () => {
                        closeConfirmModal();
                        setSessions((prev) => prev.filter((s) => s.active));
                        addToast('All other active sessions have been revoked.', 'success');
                      }
                    )
                  }
                  className="w-full py-2.5 rounded-xl border border-red-200 text-red-600 font-bold text-xs hover:bg-red-50 flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  Revoke All Other Sessions
                </button>
              </div>
            </>
          )}

        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-200">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${
                confirmModal.variant === 'danger'
                  ? 'bg-red-100 text-red-600'
                  : confirmModal.variant === 'warning'
                  ? 'bg-amber-100 text-amber-600'
                  : 'bg-indigo-100 text-indigo-600'
              }`}
            >
              <AlertTriangle className="w-7 h-7" />
            </div>

            <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-2">
              {confirmModal.title}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-6 font-normal">
              {confirmModal.description}
            </p>

            <div className="w-full flex items-center gap-3">
              <button
                type="button"
                onClick={closeConfirmModal}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmModal.onConfirm}
                className={`flex-1 py-2.5 rounded-xl text-white font-bold text-xs shadow-md transition-all cursor-pointer ${
                  confirmModal.variant === 'danger'
                    ? 'bg-red-600 hover:bg-red-700 shadow-red-500/20'
                    : confirmModal.variant === 'warning'
                    ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-500/20'
                    : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20'
                }`}
              >
                {confirmModal.confirmText}
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
