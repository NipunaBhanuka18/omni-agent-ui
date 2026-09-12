import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import InputField from '@/components/InputField';
import Button from '@/components/Button';
import { useAuthStore } from '@/store/authStore';
import { Bot, Mail, Lock, Building2, Layers, Cpu, ArrowRight, Shield } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { email?: string; password?: string } = {};

    if (!formData.email) {
      newErrors.email = 'Work email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid work email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      let res;
      try {
        res = await fetch('http://localhost:3001/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email, password: formData.password }),
        });
      } catch {
        res = await fetch('http://127.0.0.1:3001/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email, password: formData.password }),
        });
      }

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrors({ email: data.error || 'Invalid credentials or registration pending approval' });
        return;
      }

      login(data.user, data.token);
      navigate(data.user.role === 'superadmin' ? '/admin/dashboard' : '/dashboard');
    } catch {
      setErrors({ email: 'Backend server unreachable. Ensure server is running.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between p-4 sm:p-6 md:p-10 font-sans relative overflow-hidden">
      
      {/* Dynamic Background Glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl" />
      </div>

      {/* Top Navbar Header */}
      <header className="relative z-10 max-w-7xl mx-auto w-full flex items-center justify-between py-2 px-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 p-0.5 shadow-md">
            <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
              <Bot className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <span className="text-xl font-black text-white">OmniAI</span>
        </Link>

        <div className="flex items-center gap-4 text-xs font-semibold text-slate-300">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <Link to="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link>
          <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
          <Link to="/about" className="hover:text-white transition-colors">About</Link>
          <Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link>
          <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
        </div>
      </header>

      {/* Main Container Card */}
      <div className="relative z-10 max-w-5xl w-full mx-auto my-auto bg-slate-900/80 backdrop-blur-2xl rounded-3xl border border-indigo-900/50 shadow-2xl shadow-indigo-950/80 overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[580px]">
        
        {/* Left Side Visual Promo Section (Matching Figma) */}
        <div className="md:col-span-5 bg-gradient-to-b from-indigo-950/90 via-slate-950 to-indigo-950 p-8 flex flex-col justify-between border-r border-indigo-900/40 relative">
          
          <div className="flex flex-col items-center text-center space-y-4 pt-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 p-1 shadow-lg shadow-indigo-500/30">
              <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
                <Bot className="w-8 h-8 text-cyan-400" />
              </div>
            </div>

            <div>
              <h2 className="text-xl font-extrabold text-white tracking-tight">Empower Your Workspace</h2>
              <p className="text-xs text-indigo-300 font-semibold mt-1">
                SLT Digital Lab Omni Channel AI Platform
              </p>
            </div>
          </div>

          {/* 3 Interactive Feature Pills matching Figma left side list */}
          <div className="space-y-3 my-6">
            <div className="bg-indigo-900/40 border border-indigo-700/50 p-3.5 rounded-2xl flex items-center gap-3">
              <Building2 className="w-5 h-5 text-cyan-400 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-white">Own Workspace</h4>
                <p className="text-[11px] text-slate-300">Manage your own organization workspace, add customers, and manage users.</p>
              </div>
            </div>

            <div className="bg-indigo-900/40 border border-indigo-700/50 p-3.5 rounded-2xl flex items-center gap-3">
              <Layers className="w-5 h-5 text-purple-400 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-white">Omni Channels</h4>
                <p className="text-[11px] text-slate-300">Connect with customers through WhatsApp, Messenger, Email, and Web channels.</p>
              </div>
            </div>

            <div className="bg-indigo-900/40 border border-indigo-700/50 p-3.5 rounded-2xl flex items-center gap-3">
              <Cpu className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-white">AI Agent Support</h4>
                <p className="text-[11px] text-slate-300">Deploy your own AI Agent to connect with customers through Omni Channels.</p>
              </div>
            </div>
          </div>

          <div className="text-center text-[11px] text-slate-400">
            Powered by SLT Digital Lab Omni Platform
          </div>
        </div>

        {/* Right Side Form Section (Matching Figma Login Page) */}
        <div className="md:col-span-7 bg-white p-8 sm:p-10 flex flex-col justify-between">
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Welcome to Omni Channel Agent
              </h2>
              <p className="text-xs text-slate-500 mt-1 font-normal">
                Sign in with your company work email to access your workspace
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <InputField
                label="Work Email"
                type="email"
                placeholder="admin@company.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                error={errors.email}
                icon={<Mail className="w-4 h-4 text-slate-400" />}
              />

              <InputField
                label="Password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                error={errors.password}
                icon={<Lock className="w-4 h-4 text-slate-400" />}
              />

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  isLoading={isLoading}
                  className="rounded-xl py-3 font-bold text-xs bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/20"
                >
                  SIGN IN
                </Button>
              </div>
            </form>

            {/* Divider */}
            <div className="relative flex items-center justify-center my-6">
              <div className="border-t border-slate-200 w-full" />
              <span className="bg-white px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest shrink-0">
                OR
              </span>
            </div>

            {/* Super Admin Login Action Button (Matching Figma) */}
            <Link
              to="/login-admin"
              className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs text-center flex items-center justify-center gap-2 shadow-md transition-all"
            >
              <Shield className="w-4 h-4 text-cyan-400" />
              <span>SUPER ADMIN LOGIN</span>
            </Link>

            {/* New Company Registration Link */}
            <div className="mt-6 text-center text-xs font-semibold text-slate-600">
              New company?{' '}
              <Link to="/register" className="text-indigo-600 hover:underline font-bold">
                Register your company
              </Link>
            </div>
          </div>

          <div className="pt-4 text-center text-[11px] text-slate-400 border-t border-slate-100">
            Privacy Policy • Terms of Service • Support • © 2026 Omni Agent
          </div>
        </div>

      </div>

      <footer className="relative z-10 text-center text-xs text-slate-500 pt-4">
        © 2026 OmniAI Corp. All rights reserved.
      </footer>
    </div>
  );
}
