import React from 'react';
import { Bot, Cpu, Clock, ShieldCheck, Sparkles } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Title Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-xs font-bold text-indigo-700 mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Empowering Enterprises</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          About Omni Agent
        </h1>
        <p className="text-slate-600 text-sm sm:text-base mt-4 leading-relaxed font-normal">
          We're empowering companies to build their own future with specialized AI. Our platform provides the tools and infrastructure to design, deploy, and manage custom AI assistants tailored to your unique business challenges.
        </p>
      </div>

      {/* Our Mission Card */}
      <div className="bg-white/90 backdrop-blur-md p-8 sm:p-10 rounded-3xl border border-indigo-100 shadow-2xl shadow-indigo-500/10 mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-2xl bg-indigo-600 text-white shadow-md">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">Our Mission</h2>
            <span className="text-xs font-semibold text-indigo-600">Transforming Enterprise Intelligence</span>
          </div>
        </div>
        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
          To democratize artificial intelligence for enterprises by providing a powerful, self-service platform where any company can create and deploy highly specialized AI agents without complex development cycles. We believe every business deserves tailored intelligence. Our zero-exposure isolation approach ensures that your AI agents are built on your data, follow your rules, and help your team achieve more.
        </p>
      </div>

      {/* 3 Grid Pillars Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Smart Routing */}
        <div className="bg-slate-900 text-white p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col justify-between group hover:border-indigo-500/50 transition-all">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Smart Routing</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Intelligent direct routing to the right, specialized AI agent tailored to the specific user inquiry or channel source.
            </p>
          </div>
        </div>

        {/* Always-On Support */}
        <div className="bg-slate-900 text-white p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col justify-between group hover:border-purple-500/50 transition-all">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Always-On Support</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Global 24/7 coverage ensuring instant responses to customer needs, reducing wait times and workload.
            </p>
          </div>
        </div>

        {/* Privacy & Ethics */}
        <div className="bg-slate-900 text-white p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col justify-between group hover:border-cyan-500/50 transition-all">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Privacy & Ethics</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Built with a security-first architecture so that your company's data is private, sandbox-isolated, and protected.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
