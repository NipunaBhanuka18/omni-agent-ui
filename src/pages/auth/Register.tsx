import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Bot, Mail, Building2, Globe, User, Layers, Cpu, ArrowRight, Phone, Lock, MapPin, FileText, ChevronRight, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import ToastContainer, { type ToastMessage } from '@/components/Toast';

// ⭐ Defined OUTSIDE Register — prevents remounting on every keystroke
// ⭐ inputClass does NOT take errors as param to avoid recreating on every render
function inputClass(hasError: boolean) {
  // font-size: 16px via text-base prevents iOS/Android zoom on focus
  return `w-full pl-10 pr-4 py-2.5 rounded-xl border text-base font-medium text-slate-800 bg-white focus:outline-none focus:ring-2 transition-all placeholder:text-slate-300 ${
    hasError
      ? 'border-red-400 focus:ring-red-500/20'
      : 'border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-400'
  }`;
}

function Field({
  label, icon, required = false, error, children,
}: {
  label: string; icon: React.ReactNode; required?: boolean; error?: string; children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">{icon}</span>
        {children}
      </div>
      {error && <p className="text-[10px] text-red-500 font-semibold mt-1">{error}</p>}
    </div>
  );
}

export default function Register() {
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
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

  const [formData, setFormData] = useState({
    // Step 1 — Company Info
    companyName: '',
    companyEmail: '',
    phone: '',
    website: '',
    companyType: 'Technology',
    country: 'Sri Lanka',
    city: '',
    address: '',
    employeeCount: '',
    about: '',
    // Step 2 — Admin Account
    adminName: '',
    adminEmail: '',
    adminPhone: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const set = (key: string, val: string) =>
    setFormData((prev) => ({ ...prev, [key]: val }));

  const validateStep1 = () => {
    const e: { [k: string]: string } = {};
    if (!formData.companyName) e.companyName = 'Company name is required';
    if (!formData.companyEmail) e.companyEmail = 'Company email is required';
    if (!formData.phone) e.phone = 'Phone number is required';
    if (!formData.country) e.country = 'Country is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e: { [k: string]: string } = {};
    if (!formData.adminName) e.adminName = 'Admin name is required';
    if (!formData.adminEmail) e.adminEmail = 'Admin email is required';
    if (!formData.password) e.password = 'Password is required';
    else if (formData.password.length < 8) e.password = 'At least 8 characters';
    if (!formData.confirmPassword) e.confirmPassword = 'Please confirm password';
    else if (formData.password !== formData.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep1()) {
      setErrors({});
      setStep(2);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) return;
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:3001/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: formData.companyName,
          companyEmail: formData.companyEmail,
          phone: formData.phone,
          website: formData.website,
          companyType: formData.companyType,
          country: formData.country,
          city: formData.city,
          address: formData.address,
          employeeCount: formData.employeeCount,
          about: formData.about,
          adminName: formData.adminName,
          adminEmail: formData.adminEmail,
          adminPhone: formData.adminPhone,
          industry: formData.companyType,
          // password intentionally excluded
        }),
      });
      if (!res.ok) throw new Error('Server error');
      navigate('/register-success');
    } catch {
      addToast('Could not connect to server. Please make sure the backend is running.', 'error');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center p-4 sm:p-6 font-sans relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-700/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-700/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-700/10 rounded-full blur-3xl" />
      </div>

      {/* Main Card */}
      <div className="relative z-10 max-w-5xl w-full mx-auto bg-slate-900/80 backdrop-blur-2xl rounded-3xl border border-indigo-900/50 shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12">

        {/* Left Panel */}
        <div className="md:col-span-4 bg-gradient-to-b from-indigo-950 via-slate-950 to-indigo-950 p-8 flex flex-col justify-between border-r border-indigo-900/40">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 p-[2px] shadow-lg shadow-indigo-500/30">
              <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
                <Bot className="w-7 h-7 text-cyan-400" />
              </div>
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white tracking-tight">OmniAI Platform</h2>
              <p className="text-[11px] text-indigo-300 font-medium mt-1">SLT Digital Lab</p>
            </div>
          </div>

          <div className="space-y-3 mt-8">
            {[
              { icon: Building2, color: 'text-cyan-400', title: 'Own Workspace', desc: 'Your organization in one secure place.' },
              { icon: Layers, color: 'text-purple-400', title: 'Omni Channels', desc: 'WhatsApp, Messenger, Email & Web.' },
              { icon: Cpu, color: 'text-emerald-400', title: 'AI Agents', desc: 'Deploy smart agents for your customers.' },
            ].map(({ icon: Icon, color, title, desc }) => (
              <div key={title} className="bg-indigo-900/40 border border-indigo-700/40 p-3 rounded-2xl flex items-start gap-3">
                <Icon className={`w-4 h-4 ${color} shrink-0 mt-0.5`} />
                <div>
                  <h4 className="text-[11px] font-bold text-white">{title}</h4>
                  <p className="text-[10px] text-slate-400 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Step Indicator */}
          <div className="mt-8 space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Registration Steps</p>
            {[
              { n: 1, label: 'Company Details' },
              { n: 2, label: 'Admin Account' },
            ].map(({ n, label }) => {
              const done = step > n;
              const active = step === n;
              return (
                <div key={n} className={`flex items-center gap-3 p-2.5 rounded-xl transition-all ${active ? 'bg-indigo-600/20 border border-indigo-600/40' : 'opacity-50'}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${done ? 'bg-emerald-500 text-white' : active ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-400'}`}>
                    {done ? <CheckCircle2 className="w-3.5 h-3.5" /> : n}
                  </div>
                  <span className={`text-[11px] font-semibold ${active ? 'text-white' : 'text-slate-400'}`}>{label}</span>
                </div>
              );
            })}
          </div>

          <p className="text-[10px] text-slate-500 text-center mt-6">© 2026 OmniAI Platform</p>
        </div>

        {/* Right Panel */}
        <div className="md:col-span-8 bg-white flex flex-col">
          
          {/* Form Header */}
          <div className="px-8 pt-8 pb-4 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                  {step === 1 ? 'Register your company' : 'Create Admin Account'}
                </h2>
                <p className="text-[11px] text-slate-400 mt-0.5 font-normal">
                  {step === 1
                    ? 'Fill out the form below to create your company workspace'
                    : 'Set up the primary administrator account for your workspace'}
                </p>
              </div>
              <div className="text-[10px] font-bold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-xl">
                Step {step} / 2
              </div>
            </div>
          </div>

          {/* Step 1 — Company Info */}
          {step === 1 && (
            <form onSubmit={handleNext} className="px-8 py-6 flex-1 overflow-y-auto space-y-4">
              {/* Row 1 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Company Name" icon={<Building2 className="w-4 h-4 text-slate-400" />} required error={errors.companyName}>
                  <input
                    type="text"
                    placeholder="Acme Tech Solutions"
                    value={formData.companyName}
                    onChange={(e) => set('companyName', e.target.value)}
                    className={inputClass(!!errors.companyName)}
                  />
                </Field>
                <Field label="Company Email" icon={<Mail className="w-4 h-4 text-slate-400" />} required error={errors.companyEmail}>
                  <input
                    type="email"
                    placeholder="company@domain.com"
                    value={formData.companyEmail}
                    onChange={(e) => set('companyEmail', e.target.value)}
                    className={inputClass(!!errors.companyEmail)}
                  />
                </Field>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Phone Number" icon={<Phone className="w-4 h-4 text-slate-400" />} required error={errors.phone}>
                  <input
                    type="tel"
                    placeholder="+94 11 234 5678"
                    value={formData.phone}
                    onChange={(e) => set('phone', e.target.value)}
                    className={inputClass(!!errors.phone)}
                  />
                </Field>
                <Field label="Company Website" icon={<Globe className="w-4 h-4 text-slate-400" />}>
                  <input
                    type="url"
                    placeholder="https://acme.com"
                    value={formData.website}
                    onChange={(e) => set('website', e.target.value)}
                    className={inputClass(false)}
                  />
                </Field>
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                    Type of Company <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.companyType}
                    onChange={(e) => set('companyType', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-base font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
                  >
                    <option value="Technology">Technology</option>
                    <option value="Telecommunication">Telecommunication</option>
                    <option value="Finance & Banking">Finance & Banking</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Education">Education</option>
                    <option value="E-Commerce">E-Commerce</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Retail">Retail</option>
                    <option value="Government">Government</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                    No. of Employees
                  </label>
                  <select
                    value={formData.employeeCount}
                    onChange={(e) => set('employeeCount', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-base font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
                  >
                    <option value="">Select range</option>
                    <option value="1-10">1 – 10</option>
                    <option value="11-50">11 – 50</option>
                    <option value="51-200">51 – 200</option>
                    <option value="201-500">201 – 500</option>
                    <option value="501-1000">501 – 1,000</option>
                    <option value="1000+">1,000+</option>
                  </select>
                </div>
              </div>

              {/* Row 4 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.country}
                    onChange={(e) => set('country', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-base font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
                  >
                    <option>Sri Lanka</option>
                    <option>India</option>
                    <option>United States</option>
                    <option>United Kingdom</option>
                    <option>Australia</option>
                    <option>Singapore</option>
                    <option>Malaysia</option>
                    <option>UAE</option>
                    <option>Other</option>
                  </select>
                </div>
                <Field label="City / District" icon={<MapPin className="w-4 h-4 text-slate-400" />}>
                  <input
                    type="text"
                    placeholder="Colombo"
                    value={formData.city}
                    onChange={(e) => set('city', e.target.value)}
                    className={inputClass(false)}
                  />
                </Field>
              </div>

              {/* Row 5 */}
              <Field label="Company Address" icon={<MapPin className="w-4 h-4 text-slate-400" />}>
                <input
                  type="text"
                  placeholder="No. 10, Main Street, Colombo 03"
                  value={formData.address}
                  onChange={(e) => set('address', e.target.value)}
                  className={inputClass(false)}
                />
              </Field>

              {/* Row 6 — About */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                  About Your Company
                </label>
                <div className="relative">
                  <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <textarea
                    rows={3}
                    placeholder="Brief description of your company and what you do..."
                    value={formData.about}
                    onChange={(e) => set('about', e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-base font-medium text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all placeholder:text-slate-300 resize-none"
                  />
                </div>
                <span className="text-[10px] text-slate-400 block text-right mt-1">{formData.about.length} / 300</span>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all"
                >
                  Next — Admin Account
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <p className="text-center text-xs font-semibold text-slate-500">
                Already have a company?{' '}
                <Link to="/login" className="text-indigo-600 hover:underline font-bold">Sign in</Link>
              </p>
            </form>
          )}

          {/* Step 2 — Admin Account */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="px-8 py-6 flex-1 overflow-y-auto space-y-4">
              <div className="p-3 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center gap-3">
                <Building2 className="w-4 h-4 text-indigo-600 shrink-0" />
                <div>
                  <p className="text-[10px] font-bold text-indigo-700">{formData.companyName || 'Your Company'}</p>
                  <p className="text-[10px] text-indigo-400">{formData.companyEmail}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="ml-auto text-[10px] font-bold text-indigo-600 hover:underline"
                >
                  Edit
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Admin Full Name" icon={<User className="w-4 h-4 text-slate-400" />} required error={errors.adminName}>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={formData.adminName}
                    onChange={(e) => set('adminName', e.target.value)}
                    className={inputClass(!!errors.adminName)}
                  />
                </Field>
                <Field label="Admin Email" icon={<Mail className="w-4 h-4 text-slate-400" />} required error={errors.adminEmail}>
                  <input
                    type="email"
                    placeholder="admin@acme.com"
                    value={formData.adminEmail}
                    onChange={(e) => set('adminEmail', e.target.value)}
                    className={inputClass(!!errors.adminEmail)}
                  />
                </Field>
              </div>

              <Field label="Admin Phone Number" icon={<Phone className="w-4 h-4 text-slate-400" />}>
                <input
                  type="tel"
                  placeholder="+94 77 123 4567"
                  value={formData.adminPhone}
                  onChange={(e) => set('adminPhone', e.target.value)}
                  className={inputClass(false)}
                />
              </Field>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Min. 8 characters"
                      value={formData.password}
                      onChange={(e) => set('password', e.target.value)}
                      className={inputClass(!!errors.password) + ' pr-10'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-[10px] text-red-500 font-semibold mt-1">{errors.password}</p>}
                  {formData.password && (
                    <div className="flex gap-1 mt-1.5">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${
                          formData.password.length >= [4, 6, 8, 10][i]
                            ? ['bg-red-400','bg-amber-400','bg-lime-400','bg-emerald-500'][i]
                            : 'bg-slate-200'
                        }`} />
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      placeholder="Re-enter password"
                      value={formData.confirmPassword}
                      onChange={(e) => set('confirmPassword', e.target.value)}
                      className={inputClass(!!errors.confirmPassword) + ' pr-10'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-[10px] text-red-500 font-semibold mt-1">{errors.confirmPassword}</p>}
                  {formData.confirmPassword && formData.password === formData.confirmPassword && (
                    <p className="text-[10px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Passwords match
                    </p>
                  )}
                </div>
              </div>

              {/* Terms */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-[10px] text-slate-500 leading-relaxed">
                By creating a workspace you agree to our{' '}
                <Link to="/terms" className="text-indigo-600 font-bold hover:underline">Terms of Service</Link>
                {' '}and{' '}
                <Link to="/privacy" className="text-indigo-600 font-bold hover:underline">Privacy Policy</Link>.
                Your workspace will be reviewed and activated by a Super Admin.
              </div>

              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-6 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-all"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold text-xs shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating Workspace...
                    </span>
                  ) : (
                    <>
                      <ArrowRight className="w-4 h-4" />
                      CREATE WORKSPACE
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          <div className="px-8 pb-5 text-center text-[10px] text-slate-400 border-t border-slate-100 pt-3">
            Privacy Policy • Terms of Service • Support • © 2026 OmniAI Platform
          </div>
        </div>
      </div>

      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}
