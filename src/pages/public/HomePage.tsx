import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Bot, MessageSquare, Mail, Smartphone, Globe, Shield, Sparkles, Zap, Layers, BarChart3 } from 'lucide-react';

export default function HomePage() {
  const channels = [
    { name: 'WhatsApp', color: 'bg-emerald-500', icon: Smartphone, label: 'WhatsApp Agent' },
    { name: 'Messenger', color: 'bg-blue-600', icon: MessageSquare, label: 'Messenger Agent' },
    { name: 'SMS', color: 'bg-purple-600', icon: Smartphone, label: 'SMS Agent' },
    { name: 'Web', color: 'bg-cyan-500', icon: Globe, label: 'Web Agent' },
    { name: 'Email', color: 'bg-pink-500', icon: Mail, label: 'Email Agent' },
  ];

  return (
    <div className="w-full pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Title & Text */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 shadow-sm text-xs font-bold text-indigo-700">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
              <span>The future of workspace automation</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.1]">
              Experience the Power of{' '}
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Omni AI Agents
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal max-w-2xl">
              Transform the way you connect with customers using our Omni Channel AI Agent platform. 
              Manage conversations across WhatsApp, Messenger, SMS, Web, and Email from a single workspace. 
              Create your own organization, deploy AI agents, automate customer support, and deliver fast, 
              consistent, and personalized experiences across every communication channel.
            </p>

            {/* CTA Glass Banner */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/80 backdrop-blur-md border border-indigo-100 shadow-xl shadow-indigo-500/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 max-w-xl">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block">
                  Omni Channel Support
                </span>
                <p className="text-slate-800 text-sm font-semibold mt-0.5">
                  Connect all customer channels with AI agents
                </p>
              </div>

              <Link
                to="/register"
                className="px-6 py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/25 flex items-center gap-2 shrink-0 transition-all hover:scale-105"
              >
                <span>Get Start</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Quick Channel Badges */}
            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
              <span className="font-semibold text-slate-700">Supported Channels:</span>
              {channels.map((ch) => (
                <span key={ch.name} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold text-[11px] flex items-center gap-1.5 border border-slate-200">
                  <span className={`w-2 h-2 rounded-full ${ch.color}`} />
                  {ch.name}
                </span>
              ))}
            </div>
          </div>

          {/* Right Column: Hero Visual Graphic */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            
            {/* Glowing Backdrop Circle */}
            <div className="w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-gradient-to-tr from-indigo-500/30 via-purple-500/20 to-cyan-400/30 blur-3xl absolute" />

            {/* Robot Central Glass Card */}
            <div className="relative z-10 w-full max-w-md bg-gradient-to-b from-white/90 to-indigo-50/70 backdrop-blur-xl border border-white/60 p-8 rounded-3xl shadow-2xl shadow-indigo-900/10 flex flex-col items-center text-center animate-float">
              
              {/* Robot Avatar Circle */}
              <div className="relative mb-6">
                <div className="w-32 h-32 rounded-3xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 p-1 shadow-xl shadow-indigo-500/30">
                  <div className="w-full h-full bg-slate-900 rounded-[22px] flex items-center justify-center relative overflow-hidden">
                    {/* Glowing effect inside */}
                    <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/20 to-transparent" />
                    <Bot className="w-16 h-16 text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
                  </div>
                </div>

                {/* Floating Orbiting Badges around Robot */}
                <div className="absolute -top-3 -right-3 px-3 py-1.5 rounded-full bg-emerald-500 text-white font-bold text-[10px] shadow-lg flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  ONLINE 24/7
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                Omni AI Assistant
              </h3>
              <p className="text-xs text-slate-500 mt-1 font-medium max-w-xs">
                Automating customer inquiries with contextual intelligence across multi-tenant workspaces.
              </p>

              {/* Orbiting Channel Pills */}
              <div className="grid grid-cols-2 gap-2.5 w-full mt-6">
                {channels.slice(0, 4).map((c) => (
                  <div key={c.name} className="flex items-center gap-2 p-2 rounded-xl bg-white/80 border border-indigo-100 shadow-sm text-left">
                    <div className={`p-1.5 rounded-lg ${c.color} text-white shrink-0`}>
                      <c.icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-semibold text-slate-700 truncate">{c.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Designed for Next-Gen Workspace Automation
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-2">
            Everything your enterprise needs to streamline customer interaction channels.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1 */}
          <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-indigo-100 shadow-xl shadow-indigo-500/5 hover:border-indigo-300 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Smart Channel Routing</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Intelligent agents route inquiries from WhatsApp, Messenger, SMS, and Email directly to specialized workflows.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-indigo-100 shadow-xl shadow-indigo-500/5 hover:border-indigo-300 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Multi-Tenant Management</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Isolate workspaces for different business units or companies with role-based access control and super admin overview.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-indigo-100 shadow-xl shadow-indigo-500/5 hover:border-indigo-300 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Enterprise Security</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Bank-grade security protocols ensuring proprietary corporate data stays completely private and secure.
            </p>
          </div>

        </div>
      </section>
    </div>
  );
}
