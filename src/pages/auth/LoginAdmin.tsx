import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '@/components/InputField';
import Button from '@/components/Button';
import { useAuthStore } from '@/store/authStore';

// TypeScript interface for the form state (email and password)
export interface LoginFormState {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface FormErrors {
  email?: string;
  password?: string;
}

export default function LoginAdmin() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const [formData, setFormData] = useState<LoginFormState>({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof LoginFormState) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error on user edit
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: FormErrors = {};

    if (!formData.email) {
      newErrors.email = 'Business email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    login({ name: 'Admin', role: 'admin' }, 'mock-jwt-token-123');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-100/80 flex flex-col items-center justify-center p-4 sm:p-6 md:p-10 font-sans">
      {/* Outer Card Container */}
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden flex flex-col md:flex-row min-h-[640px]">
        
        {/* Left Form Section */}
        <div className="w-full md:w-1/2 p-8 sm:p-10 md:p-12 flex flex-col justify-between">
          <div>
            {/* Header / Brand Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-900 to-indigo-950 flex items-center justify-center shadow-md shadow-indigo-900/20 p-2 border border-slate-800">
                <svg className="w-full h-full text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-none flex items-center gap-1">
                  Omni<span className="text-blue-600">AI</span>
                </h1>
                <p className="text-[11px] font-medium text-slate-400 tracking-wider uppercase mt-0.5">
                  Nexus Intelligence System
                </p>
              </div>
            </div>

            {/* Title & Description */}
            <div className="mt-8 mb-6">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Welcome back Admin
              </h2>
              <p className="text-sm text-slate-500 mt-1.5 font-normal">
                Enter your credentials to access your enterprise dashboard.
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Business Email Input */}
              <InputField
                label="Business Email"
                type="email"
                placeholder="name@company.com"
                value={formData.email}
                onChange={handleInputChange('email')}
                error={errors.email}
                icon={
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                }
              />

              {/* Password Input */}
              <InputField
                label="Password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange('password')}
                error={errors.password}
                labelRight={
                  <a
                    href="#forgot-password"
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                  >
                    Forgot password?
                  </a>
                }
                icon={
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                }
              />

              {/* Keep me Logged in option */}
              <div className="flex items-center gap-2 pt-1 pb-2">
                <input
                  id="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleInputChange('rememberMe')}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20 cursor-pointer"
                />
                <label htmlFor="rememberMe" className="text-xs font-medium text-slate-600 cursor-pointer select-none">
                  Keep me Logged in
                </label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={isLoading}
                className="py-3.5 font-bold tracking-wider uppercase text-sm rounded-xl"
              >
                LOGIN
              </Button>
            </form>

            {/* Sign up Link */}
            <p className="text-center text-xs font-medium text-slate-500 mt-5">
              Don't have an account?{' '}
              <a href="#signup" className="text-blue-600 font-bold hover:underline">
                Signing here
              </a>
            </p>

            {/* Divider */}
            <div className="relative flex items-center justify-center my-6">
              <div className="border-t border-slate-200 w-full" />
              <span className="bg-white px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-widest shrink-0">
                OR CONTINUE WITH
              </span>
            </div>

            {/* Social Login Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                size="md"
                fullWidth
                onClick={() => alert('Sign in with Google')}
                className="flex items-center justify-center gap-2 font-medium text-xs text-slate-700 bg-white border-slate-200 hover:bg-slate-50 py-2.5 rounded-xl shadow-xs"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                Google
              </Button>

              <Button
                variant="outline"
                size="md"
                fullWidth
                onClick={() => alert('Sign in with Microsoft')}
                className="flex items-center justify-center gap-2 font-medium text-xs text-slate-700 bg-white border-slate-200 hover:bg-slate-50 py-2.5 rounded-xl shadow-xs"
              >
                <svg className="w-4 h-4" viewBox="0 0 23 23">
                  <path fill="#f35325" d="M1 1h10v10H1z" />
                  <path fill="#81bc06" d="M12 1h10v10H12z" />
                  <path fill="#05a6f0" d="M1 12h10v10H1z" />
                  <path fill="#ffba08" d="M12 12h10v10H12z" />
                </svg>
                Microsoft
              </Button>
            </div>
          </div>
        </div>

        {/* Right Hero Visual Section */}
        <div className="w-full md:w-1/2 bg-slate-950 relative flex flex-col justify-between p-8 sm:p-10 overflow-hidden min-h-[500px] md:min-h-full">
          {/* Background Gradients & Glows */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/80 via-slate-950 to-blue-950/90 z-0" />
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-blue-600/20 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-purple-600/20 blur-3xl pointer-events-none" />
          
          {/* Subtle Grid Pattern Overlay */}
          <div
            className="absolute inset-0 z-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.2) 1px, transparent 0)`,
              backgroundSize: '24px 24px',
            }}
          />

          {/* Node Badges Header */}
          <div className="relative z-10 hidden sm:flex items-center justify-between text-[11px] font-bold text-cyan-300 uppercase tracking-widest px-2 pt-2 opacity-80">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              VIDEO
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              CHAT
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              EMAIL
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
              VOICE
            </span>
          </div>

          {/* Glassmorphism Feature Cards */}
          <div className="relative z-10 my-auto space-y-4 max-w-md mx-auto w-full pt-6">
            {/* Card 1: Lightning Fast Inference */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-2xl transition-all duration-300 hover:border-purple-500/30 group">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-base text-white tracking-wide">
                    Lightning Fast Inference
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed font-normal">
                    OmniAI processes multi-channel communications with sub-millisecond latency for real-time enterprise operations.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2: Enterprise Security */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-2xl transition-all duration-300 hover:border-blue-500/30 group">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-base text-white tracking-wide">
                    Enterprise Security
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed font-normal">
                    SAML SSO, SOC2 compliance, and end-to-end encryption for your most sensitive customer data flows.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Social Proof Footer */}
          <div className="relative z-10 flex items-center gap-3 pt-6 border-t border-white/10">
            <div className="flex -space-x-2 overflow-hidden">
              <img
                className="inline-block h-7 w-7 rounded-full ring-2 ring-slate-900 object-cover"
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100"
                alt="User"
              />
              <img
                className="inline-block h-7 w-7 rounded-full ring-2 ring-slate-900 object-cover"
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100"
                alt="User"
              />
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-800 ring-2 ring-slate-900 text-[10px] font-bold text-slate-200">
                +12k
              </span>
            </div>
            <p className="text-xs font-medium text-slate-300">
              Trusted by leading global organizations
            </p>
          </div>
        </div>

      </div>

      {/* Footer Links */}
      <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-xs font-medium text-slate-500">
        <a href="#privacy" className="hover:text-slate-700 transition-colors">
          Privacy Policy
        </a>
        <a href="#terms" className="hover:text-slate-700 transition-colors">
          Terms of Service
        </a>
        <a href="#support" className="hover:text-slate-700 transition-colors">
          Support
        </a>
        <span>© 2026 OmniAI Corp.</span>
      </div>
    </div>
  );
}
