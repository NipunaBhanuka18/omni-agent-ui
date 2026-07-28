import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/Button';

export default function StartPage() {
  const [step, setStep] = useState<number>(1);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex flex-col justify-between items-center font-sans relative overflow-x-hidden selection:bg-blue-500 selection:text-white">
      {/* STEP 1 SCREEN */}
      {step === 1 && (
        <div className="fixed inset-0 min-h-screen w-full bg-gradient-to-tr from-purple-900 via-indigo-900 to-emerald-700 flex flex-col justify-between items-center p-4 sm:p-8 md:p-10 overflow-y-auto">
          {/* Bright Mesh Gradient Glows */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-400/30 via-indigo-600/30 to-purple-900/60 pointer-events-none" />
          <div className="absolute top-10 left-1/4 w-96 h-96 bg-cyan-400/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-emerald-400/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Floating Background Network Grid & Lines */}
          <svg className="absolute inset-0 w-full h-full opacity-25 pointer-events-none z-0" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="bright-network-grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#bright-network-grid)" />
          </svg>

          {/* Floating Channel Icons (Top Left WhatsApp & Top Right Messenger) */}
          <div className="absolute top-12 left-8 md:left-24 z-0 pointer-events-none">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
              alt="WhatsApp"
              className="w-16 h-16 md:w-24 md:h-24 opacity-90 drop-shadow-[0_0_30px_rgba(34,197,94,0.7)] animate-pulse"
            />
          </div>
          <div className="absolute top-12 right-8 md:right-24 z-0 pointer-events-none">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/6/6c/Facebook_Messenger_logo_2020.svg"
              alt="Messenger"
              className="w-16 h-16 md:w-24 md:h-24 opacity-90 drop-shadow-[0_0_30px_rgba(168,85,247,0.7)] animate-pulse"
            />
          </div>

          {/* Main Title & Description Header */}
          <div className="relative z-10 text-center max-w-3xl mx-auto my-auto pt-6 pb-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-md">
              Omni Channel AI Agent
            </h1>
            <p className="text-slate-100 text-sm sm:text-base font-semibold mt-3 leading-relaxed drop-shadow-xs">
              One Platform. Every Channel. Smarter Customer Service.
            </p>
            <p className="text-slate-200 text-xs sm:text-sm font-normal mt-1.5 max-w-2xl mx-auto leading-relaxed">
              Delivering secure, AI-powered SLT customer support across Web, WhatsApp, SMS, and Facebook Messenger from one centralized platform
            </p>
          </div>

          {/* 3 Frosted Glassmorphism Cards */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full mx-auto my-auto py-4">
            {/* Card 1: AI-Powered Customer Assistant */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 sm:p-8 flex flex-col items-center text-center shadow-xl hover:bg-white/15 transition-all duration-300 group">
              <img
                src="/icons/ai-bot.png"
                onError={(e) => {
                  e.currentTarget.src = "https://cdn-icons-png.flaticon.com/512/4712/4712035.png";
                }}
                alt="AI-Powered Customer Assistant"
                className="w-20 h-20 mb-4 object-contain filter drop-shadow-[0_10px_15px_rgba(0,0,0,0.3)] group-hover:scale-105 transition-transform"
              />
              <h3 className="text-base font-bold text-white tracking-wide mb-2 leading-tight">
                AI-Powered Customer Assistant
              </h3>
              <p className="text-xs text-slate-100 leading-relaxed font-normal">
                Provide intelligent, real-time assistance to customer service agents by understanding requests, suggesting solutions, and automating repetitive tasks.
              </p>
            </div>

            {/* Card 2: Multi-Channel Communication */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 sm:p-8 flex flex-col items-center text-center shadow-xl hover:bg-white/15 transition-all duration-300 group">
              <img
                src="/icons/multi-channel.png"
                onError={(e) => {
                  e.currentTarget.src = "https://cdn-icons-png.flaticon.com/512/8943/8943377.png";
                }}
                alt="Multi-Channel Communication"
                className="w-20 h-20 mb-4 object-contain filter drop-shadow-[0_10px_15px_rgba(0,0,0,0.3)] group-hover:scale-105 transition-transform"
              />
              <h3 className="text-base font-bold text-white tracking-wide mb-2 leading-tight">
                Multi-Channel Communication
              </h3>
              <p className="text-xs text-slate-100 leading-relaxed font-normal">
                Manage customer interactions seamlessly across Web, WhatsApp, SMS, and Facebook Messenger from one unified platform.
              </p>
            </div>

            {/* Card 3: Usage & Balance Insights */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 sm:p-8 flex flex-col items-center text-center shadow-xl hover:bg-white/15 transition-all duration-300 group">
              <img
                src="/icons/usage-insights.png"
                onError={(e) => {
                  e.currentTarget.src = "https://cdn-icons-png.flaticon.com/512/8943/8943374.png";
                }}
                alt="Usage & Balance Insights"
                className="w-20 h-20 mb-4 object-contain filter drop-shadow-[0_10px_15px_rgba(0,0,0,0.3)] group-hover:scale-105 transition-transform"
              />
              <h3 className="text-base font-bold text-white tracking-wide mb-2 leading-tight">
                Usage & Balance Insights
              </h3>
              <p className="text-xs text-slate-100 leading-relaxed font-normal">
                Monitor data usage, account balances, and service consumption with real-time information and visual summaries.
              </p>
            </div>
          </div>

          {/* Primary Action Button (Get Start -> setStep(2)) */}
          <div className="relative z-10 my-auto pt-4 pb-6">
            <Button
              variant="primary"
              size="lg"
              onClick={() => setStep(2)}
              className="rounded-full px-10 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/40 flex items-center gap-2 hover:scale-105 transition-all"
            >
              <span>Get Start -&gt;</span>
            </Button>
          </div>

          {/* Footer Links */}
          <div className="relative z-10 flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-slate-200 pt-4">
            <a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#support" className="hover:text-white transition-colors">Support</a>
            <span>© 2026 OmniAI Corp.</span>
          </div>
        </div>
      )}

      {/* STEP 2 SCREEN */}
      {step === 2 && (
        <div className="fixed inset-0 min-h-screen w-full bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 flex flex-col justify-between items-center p-4 sm:p-8 md:p-10 overflow-y-auto">
          {/* Futuristic Geometric Beams Background Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent pointer-events-none" />
          <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="geometric-lines-step2" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 60 M 0 0 L 60 60" fill="none" stroke="rgba(59, 130, 246, 0.15)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#geometric-lines-step2)" />
          </svg>

          {/* Header Title */}
          <div className="relative z-10 text-center max-w-3xl mx-auto pt-8 pb-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-lg">
              Omni Channel AI Agent
            </h1>
          </div>

          {/* 2 White Translucent Cards Container */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full mx-auto my-auto py-6">
            {/* Card 1: Internal Employee */}
            <div className="bg-blue-50/95 backdrop-blur-xl border border-blue-100/60 rounded-3xl p-8 flex flex-col items-center text-center shadow-2xl shadow-blue-950/60 hover:scale-[1.02] transition-all duration-300">
              <img
                src="/icons/internal-employee.png"
                onError={(e) => {
                  e.currentTarget.src = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
                }}
                alt="Internal Employee"
                className="w-20 h-20 mb-6 object-contain filter drop-shadow-[0_10px_15px_rgba(0,0,0,0.15)]"
              />

              <h2 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">
                Internal Employee
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 mb-8 leading-relaxed max-w-xs">
                If You are Our Internal SLT Customer Choose this and continue your Journey
              </p>

              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={() => navigate('/login')}
                className="rounded-xl py-3.5 font-bold text-sm bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 flex items-center justify-center gap-2"
              >
                <span>Continue</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Button>
            </div>

            {/* Card 2: External Customer */}
            <div className="bg-blue-50/95 backdrop-blur-xl border border-blue-100/60 rounded-3xl p-8 flex flex-col items-center text-center shadow-2xl shadow-blue-950/60 hover:scale-[1.02] transition-all duration-300">
              <img
                src="/icons/external-customer.png"
                onError={(e) => {
                  e.currentTarget.src = "https://cdn-icons-png.flaticon.com/512/1256/1256650.png";
                }}
                alt="External Customer"
                className="w-20 h-20 mb-6 object-contain filter drop-shadow-[0_10px_15px_rgba(0,0,0,0.15)]"
              />

              <h2 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">
                External Customer
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 mb-8 leading-relaxed max-w-xs">
                If You Are Our External Customer Choose This and Continue Your Journey
              </p>

              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={() => navigate('/login')}
                className="rounded-xl py-3.5 font-bold text-sm bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 flex items-center justify-center gap-2"
              >
                <span>Continue</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Button>
            </div>
          </div>

          {/* Bottom Center Sign In Button */}
          <div className="relative z-10 my-auto pt-4 pb-6">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/login')}
              className="rounded-full px-12 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-xl shadow-blue-600/30 hover:scale-105 transition-all"
            >
              Sign in
            </Button>
          </div>

          {/* Footer Links */}
          <div className="relative z-10 flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-slate-300 pt-4">
            <a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#support" className="hover:text-white transition-colors">Support</a>
            <span>© 2026 OmniAI Corp.</span>
          </div>
        </div>
      )}
    </div>
  );
}
