import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Bot, Shield } from 'lucide-react';
import InputField from '@/components/InputField';
import Button from '@/components/Button';
import { useAuthStore } from '@/store/authStore';
import ToastContainer, { type ToastMessage } from '@/components/Toast';

export default function LoginAdmin() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [email, setEmail] = useState('superadmin@slt.lk');
  const [password, setPassword] = useState('admin123');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Toasts state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
  };
  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // SSO Account Picker Modal State
  const [ssoModal, setSsoModal] = useState<{
    isOpen: boolean;
    provider: 'google' | 'microsoft' | null;
  }>({
    isOpen: false,
    provider: null,
  });

  const openSSOModal = (provider: 'google' | 'microsoft') => {
    setSsoModal({ isOpen: true, provider });
  };

  const closeSSOModal = () => {
    setSsoModal({ isOpen: false, provider: null });
  };

  const handleSelectSSOAccount = (accountEmail: string, accountName: string) => {
    const provider = ssoModal.provider;
    closeSSOModal();
    setIsLoading(true);
    addToast(`Authenticating with ${provider === 'google' ? 'Google' : 'Microsoft'} as ${accountEmail}...`, 'info');
    setTimeout(() => {
      login(
        {
          name: accountName,
          email: accountEmail,
          role: 'super_admin',
          provider: provider,
        },
        `mock-${provider}-token`
      );
      addToast(`Signed in as ${accountEmail} successfully!`, 'success');
      navigate('/admin/dashboard');
    }, 700);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      let res;
      try {
        res = await fetch('http://localhost:3001/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
      } catch {
        res = await fetch('http://127.0.0.1:3001/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
      }

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Invalid credentials');
        return;
      }

      login(data.user, data.token);
      navigate('/admin/dashboard');
    } catch {
      setError('Unable to connect to backend server. Ensure backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans relative overflow-hidden">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Link */}
      <header className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between z-10 max-w-7xl mx-auto w-full">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center font-black text-white text-sm">
            E
          </div>
          <span className="font-extrabold text-lg tracking-tight">OmniAI <span className="text-xs text-purple-400 font-bold">SUPER ADMIN</span></span>
        </Link>

        <div className="flex items-center gap-4 text-xs font-semibold text-slate-300">
          <Link to="/" className="hover:text-white">Home</Link>
          <Link to="/terms" className="hover:text-white">Terms &amp; Conditions</Link>
          <Link to="/privacy" className="hover:text-white">Privacy</Link>
          <Link to="/contact" className="hover:text-white">Contact</Link>
        </div>
      </header>

      {/* Main Login Card (Matching Image 1) */}
      <div className="w-full max-w-4xl bg-white text-slate-900 rounded-3xl border border-slate-200 shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 relative z-10 my-16">
        
        {/* Left Column: Empower Your Workspace Promo */}
        <div className="md:col-span-5 bg-gradient-to-br from-indigo-50 via-purple-50 to-slate-50 p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-200">
          <div className="space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 text-purple-400 p-1 flex items-center justify-center shadow-lg">
              <Bot className="w-8 h-8" />
            </div>

            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Empower Your Workspace</h2>
              <p className="text-xs text-slate-500 mt-1">SLT Global Platform Super Admin Portal.</p>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-start gap-3">
                <span className="p-2 rounded-xl bg-blue-50 text-blue-600 shrink-0">
                  <Shield className="w-4 h-4" />
                </span>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Own Workspace</h4>
                  <p className="text-[10px] text-slate-500">Create your own organization workspace, add institutions, and manage users.</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-start gap-3">
                <span className="p-2 rounded-xl bg-purple-50 text-purple-600 shrink-0">
                  <Bot className="w-4 h-4" />
                </span>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Total Omnichannel</h4>
                  <p className="text-[10px] text-slate-500">Connect with customer via SLT WhatsApp, Messenger, Web, and SMS AI Gateway Router.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 text-[10px] text-slate-400 border-t border-slate-200/60">
            <span>Powered by SLT Global Platform Node 01</span>
          </div>
        </div>

        {/* Right Column: Super Admin Login Form */}
        <div className="md:col-span-7 p-8 md:p-10 flex flex-col justify-center space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Welcome Super Admin</h2>
            <p className="text-xs text-slate-500">Sign in with your company cloud to access your workspace.</p>
          </div>

          {error && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center justify-between">
              <span>⚠️ {error}</span>
              <button onClick={() => setError('')} className="text-red-500 font-bold hover:text-red-800">✕</button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              label="Work Email"
              type="email"
              placeholder="superadmin@slt.lk"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <InputField
              label="Password"
              type="password"
              placeholder="admin123"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-purple-600"
                />
                <span>Keep me logged in</span>
              </label>

              <Link to="/forget-password" className="font-bold text-purple-600 hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading}
              className="rounded-2xl py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 font-black text-xs uppercase tracking-wider text-white shadow-lg"
            >
              SIGN IN
            </Button>
          </form>

          <div className="relative text-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
            <span className="relative bg-white px-4 text-[10px] font-bold text-slate-400 uppercase">OR</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => openSSOModal('google')}
              className="py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Google</span>
            </button>
            <button
              type="button"
              onClick={() => openSSOModal('microsoft')}
              className="py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 23 23">
                <path fill="#f35325" d="M1 1h10v10H1z" />
                <path fill="#81bc06" d="M12 1h10v10H12z" />
                <path fill="#05a6f0" d="M1 12h10v10H1z" />
                <path fill="#ffba08" d="M12 12h10v10H1z" />
              </svg>
              <span>Microsoft</span>
            </button>
          </div>

          <div className="text-center text-xs text-slate-500 pt-2">
            <span>Don't have an admin account? </span>
            <Link to="/register-admin" className="font-bold text-purple-600 hover:underline">
              Register here
            </Link>
          </div>
        </div>

      </div>

      {/* OAuth Account Picker Modal */}
      {ssoModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 flex flex-col text-left animate-in fade-in zoom-in-95 duration-200">
            
            {/* Provider Header */}
            {ssoModal.provider === 'google' ? (
              <div className="flex flex-col items-center text-center pb-4 border-b border-slate-100">
                <svg className="w-9 h-9 mb-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <h3 className="text-lg font-extrabold text-slate-900">Sign in with Google</h3>
                <p className="text-xs text-slate-500 mt-0.5">Choose an account to continue to <span className="font-bold text-slate-800">OmniAI Platform</span></p>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center pb-4 border-b border-slate-100">
                <svg className="w-9 h-9 mb-2" viewBox="0 0 23 23">
                  <path fill="#f35325" d="M1 1h10v10H1z" />
                  <path fill="#81bc06" d="M12 1h10v10H12z" />
                  <path fill="#05a6f0" d="M1 12h10v10H1z" />
                  <path fill="#ffba08" d="M12 12h10v10H12z" />
                </svg>
                <h3 className="text-lg font-extrabold text-slate-900">Pick an account</h3>
                <p className="text-xs text-slate-500 mt-0.5">Select a Microsoft identity for <span className="font-bold text-slate-800">OmniAI Console</span></p>
              </div>
            )}

            {/* Account List */}
            <div className="py-4 space-y-2.5">
              <button
                type="button"
                onClick={() => handleSelectSSOAccount('superadmin@slt.lk', 'Super Admin')}
                className="w-full flex items-center gap-3.5 p-3 rounded-2xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 transition-all text-left cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-full bg-purple-600 text-white font-bold text-sm flex items-center justify-center shadow-sm">
                  SA
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-900 group-hover:text-purple-700 transition-colors">Super Admin</p>
                  <p className="text-[11px] text-slate-500 truncate">superadmin@slt.lk</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 group-hover:bg-purple-100 group-hover:text-purple-800">
                  Active
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectSSOAccount('kawya.dissanayaka@gmail.com', 'Kawya Dissanayaka')}
                className="w-full flex items-center gap-3.5 p-3 rounded-2xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 transition-all text-left cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold text-sm flex items-center justify-center shadow-sm">
                  KD
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-900 group-hover:text-purple-700 transition-colors">Kawya Dissanayaka</p>
                  <p className="text-[11px] text-slate-500 truncate">kawya.dissanayaka@gmail.com</p>
                </div>
              </button>
            </div>

            {/* Footer & Cancel */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <p className="text-[10px] text-slate-400">
                Protected by Enterprise SSO
              </p>
              <button
                type="button"
                onClick={closeSSOModal}
                className="px-4 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition-all cursor-pointer"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}

      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}
