import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '@/components/InputField';
import Button from '@/components/Button';
import ToastContainer, { type ToastMessage } from '@/components/Toast';

export default function ForgetPassword() {
  const [step, setStep] = useState<number>(1);
  const [email, setEmail] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');

  // Toasts state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
  };
  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const navigate = useNavigate();

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setEmailError('Please enter your business email address');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    setEmailError('');
    setStep(2);
  };

  const handleStep3Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) {
      setPasswordError('Please enter a new password');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    setPasswordError('');
    addToast('Password reset successfully! Redirecting to login...', 'success');
    setTimeout(() => {
      navigate('/login');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-100/80 flex flex-col items-center justify-center p-4 sm:p-6 md:p-10 font-sans relative">
      {/* Outer Card Container */}
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden flex flex-col md:flex-row min-h-[640px] relative">
        
        {/* Left Form Section */}
        <div className="w-full md:w-1/2 p-8 sm:p-10 md:p-12 flex flex-col justify-between z-10">
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

            {/* STEP 1: Enter Email to Reset Password */}
            {step === 1 && (
              <div className="mt-8">
                {/* Title & Description */}
                <div className="mb-6">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Reset Password
                  </h2>
                  <p className="text-sm text-slate-500 mt-1.5 font-normal">
                    Enter your email account to reset your password
                  </p>
                </div>

                <form onSubmit={handleStep1Submit} className="space-y-5">
                  <InputField
                    label="Business Email"
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError('');
                    }}
                    error={emailError}
                    icon={
                      <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    }
                  />

                  <div className="space-y-3 pt-2">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      fullWidth
                      className="py-3.5 font-bold tracking-wide text-sm rounded-xl bg-blue-600 hover:bg-blue-700"
                    >
                      Reset Password
                    </Button>

                    <p className="text-center text-xs text-slate-500 font-normal py-1">
                      check your email is correct and press reset password button
                    </p>

                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      fullWidth
                      onClick={() => navigate('/login')}
                      className="py-3 font-semibold text-sm rounded-xl border-blue-500 text-blue-600 hover:bg-blue-50"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* STEP 2: Base content under Modal (dimmed view) */}
            {step === 2 && (
              <div className="mt-8 opacity-40 pointer-events-none">
                <div className="mb-6">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Reset Password
                  </h2>
                  <p className="text-sm text-slate-500 mt-1.5 font-normal">
                    Enter your email account to reset your password
                  </p>
                </div>
                <div className="space-y-5">
                  <InputField
                    label="Business Email"
                    type="email"
                    placeholder="name@company.com"
                    value={email || 'name@company.com'}
                    disabled
                    icon={
                      <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    }
                  />
                  <Button variant="primary" size="lg" fullWidth disabled className="py-3.5 font-bold">
                    Reset Password
                  </Button>
                  <p className="text-center text-xs text-slate-500 py-1">
                    check your email is correct and press reset password button
                  </p>
                </div>
              </div>
            )}

            {/* STEP 3: Set New Password Form */}
            {step === 3 && (
              <div className="mt-8">
                <div className="mb-6">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Set New Password
                  </h2>
                  <p className="text-sm text-slate-500 mt-1.5 font-normal">
                    Your identity is verified. Create your new password below.
                  </p>
                </div>

                <form onSubmit={handleStep3Submit} className="space-y-4">
                  <InputField
                    label="New Password"
                    type="password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      if (passwordError) setPasswordError('');
                    }}
                    error={passwordError}
                    icon={
                      <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    }
                  />

                  <InputField
                    label="Confirm Password"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (passwordError) setPasswordError('');
                    }}
                    icon={
                      <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    }
                  />

                  <div className="space-y-3 pt-3">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      fullWidth
                      className="py-3.5 font-bold tracking-wide text-sm rounded-xl bg-blue-600 hover:bg-blue-700"
                    >
                      Submit & Save Password
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      fullWidth
                      onClick={() => navigate('/login')}
                      className="py-3 font-semibold text-sm rounded-xl border-slate-300 text-slate-700 hover:bg-slate-50"
                    >
                      Back to Login
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Right Visual Section with AI Humanoid Robot */}
        <div className={`w-full md:w-1/2 bg-slate-950 relative flex flex-col justify-between p-8 sm:p-10 overflow-hidden min-h-[500px] md:min-h-full ${step === 2 ? 'opacity-40 pointer-events-none' : ''}`}>
          {/* Background Gradients & Glows */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/90 via-slate-950 to-blue-950/90 z-0" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-blue-600/20 blur-3xl pointer-events-none" />

          {/* Holographic AI Robot Image Representation */}
          <div className="relative z-10 my-auto flex flex-col items-center justify-center">
            <div className="relative w-full max-w-sm aspect-square flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800"
                alt="OmniAI Assistant Robot"
                className="w-full h-full object-cover rounded-2xl opacity-80 mix-blend-luminosity border border-cyan-500/20 shadow-2xl shadow-cyan-500/10"
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
            </div>
          </div>
        </div>

        {/* STEP 2 MODAL OVERLAY ("Check your email") */}
        {step === 2 && (
          <div className="absolute inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 sm:p-10 max-w-md w-full shadow-2xl border border-slate-100 flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-200">
              {/* Blue Circular Icon Badge */}
              <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 mb-5">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>

              {/* Title & Description */}
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-2">
                Check your email
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-xs leading-relaxed mb-6 font-normal">
                We have send password recovery instruction to your email
              </p>

              {/* Action Buttons */}
              <div className="w-full space-y-3">
                <Button
                  type="button"
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={() => setStep(3)}
                  className="py-3 font-bold text-sm rounded-xl bg-blue-600 hover:bg-blue-700"
                >
                  Next: Set New Password
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  fullWidth
                  onClick={() => setStep(1)}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  Back to email step
                </Button>
              </div>
            </div>
          </div>
        )}

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
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}
