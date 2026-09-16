import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Bot, Shield, Mail, Lock, User } from 'lucide-react';
import InputField from '@/components/InputField';
import Button from '@/components/Button';

export default function RegisterAdmin() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('http://localhost:3001/api/auth/register-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Failed to register admin account');
        return;
      }

      navigate('/register-success');
    } catch {
      setError('Unable to connect to backend server.');
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

      {/* Main Register Card */}
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

        {/* Right Column: Super Admin Signup Form */}
        <div className="md:col-span-7 p-8 md:p-10 flex flex-col justify-center space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Create Your Account</h2>
            <p className="text-xs text-slate-500">Sign up as a platform super administrator for your organization.</p>
          </div>

          {error && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center justify-between">
              <span>⚠️ {error}</span>
              <button onClick={() => setError('')} className="text-red-500 font-bold hover:text-red-800">✕</button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              label="Full Name"
              type="text"
              placeholder="Arjuna Lakmal"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />

            <InputField
              label="Work Email"
              type="email"
              placeholder="admin@slt.lk"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <InputField
              label="Password"
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading}
              className="rounded-2xl py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 font-black text-xs uppercase tracking-wider text-white shadow-lg"
            >
              SIGN UP
            </Button>
          </form>

          <div className="relative text-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
            <span className="relative bg-white px-4 text-[10px] font-bold text-slate-400 uppercase">OR</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => navigate('/register-success')}
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
              onClick={() => navigate('/register-success')}
              className="py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 23 23">
                <path fill="#f35325" d="M1 1h10v10H1z" />
                <path fill="#81bc06" d="M12 1h10v10H12z" />
                <path fill="#05a6f0" d="M1 12h10v10H1z" />
                <path fill="#ffba08" d="M12 12h10v10H12z" />
              </svg>
              <span>Microsoft</span>
            </button>
          </div>

          <div className="text-center text-xs text-slate-500 pt-2">
            <span>Already have an account? </span>
            <Link to="/login-admin" className="font-bold text-purple-600 hover:underline">
              Sign in here
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
