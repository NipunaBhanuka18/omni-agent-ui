import { Link } from 'react-router-dom';
import { ArrowRight, Bot, MessageSquare, Mail, Smartphone, Globe, Shield, Sparkles, Zap, Layers } from 'lucide-react';

export default function HomePage() {
  const channels = [
    { name: 'WhatsApp', color: 'bg-emerald-500', icon: Smartphone, label: 'WhatsApp Agent' },
    { name: 'Messenger', color: 'bg-blue-500', icon: MessageSquare, label: 'Messenger Agent' },
    { name: 'SMS', color: 'bg-purple-500', icon: Smartphone, label: 'SMS Agent' },
    { name: 'Web', color: 'bg-cyan-400', icon: Globe, label: 'Web Agent' },
    { name: 'Email', color: 'bg-pink-500', icon: Mail, label: 'Email Agent' },
  ];

  return (
    <div className="w-full pb-24 font-sans relative overflow-hidden">
      {/* Ambient Gradient Mesh Background Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-[120px] pointer-events-none animate-pulse-glow" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-[120px] pointer-events-none animate-pulse-glow" style={{ animationDelay: '2s' }} />

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Title & Text */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Pill Badge with Gradient Border & Glow */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-indigo-500/40 shadow-[0_0_15px_rgba(99,102,241,0.2)] text-xs font-black backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 via-purple-300 to-pink-400 bg-clip-text text-transparent uppercase tracking-wider">
                The future of workspace automation
              </span>
            </div>

            {/* Main Headline with Stunning Multi-Color Gradient */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
              Experience the Power of{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 via-purple-300 to-pink-400 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(99,102,241,0.3)]">
                Omni AI Agents
              </span>
            </h1>

            {/* Subtext with Legible Slate-300 Text */}
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-medium max-w-2xl">
              Transform customer engagement with our{' '}
              <span className="font-bold bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                Omni Channel AI Platform
              </span>.
              Manage conversations across WhatsApp, Messenger, SMS, Web, and Email seamlessly from a unified intelligent workspace.
            </p>

            {/* CTA Dark Glass Banner */}
            <div className="p-5 rounded-3xl bg-slate-900/85 backdrop-blur-2xl border border-indigo-500/30 shadow-[0_15px_40px_rgba(0,0,0,0.6)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 max-w-xl hover:border-cyan-400/50 hover:shadow-[0_0_30px_rgba(56,189,248,0.2)] transition-all duration-300">
              <div>
                <span className="text-xs font-black uppercase tracking-wider bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent block">
                  Omni Channel Support
                </span>
                <p className="text-white text-sm font-bold mt-0.5">
                  Connect all customer channels with AI agents
                </p>
              </div>

              <Link
                to="/register"
                className="px-6 py-3.5 rounded-2xl text-xs font-black text-slate-950 bg-gradient-to-r from-cyan-400 via-indigo-300 via-purple-300 to-pink-400 hover:from-cyan-300 hover:to-pink-300 shadow-[0_0_20px_rgba(56,189,248,0.4)] flex items-center gap-2 shrink-0 transition-all hover:scale-105 cursor-pointer"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Quick Channel Badges */}
            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs font-medium text-slate-400">
              <span className="font-extrabold text-slate-200">Supported Channels:</span>
              {channels.map((ch) => (
                <span key={ch.name} className="px-3 py-1.5 rounded-xl bg-slate-900/90 text-slate-200 font-bold text-xs flex items-center gap-2 border border-indigo-500/20 shadow-sm hover:border-cyan-400/40 hover:text-cyan-300 transition-colors">
                  <span className={`w-2 h-2 rounded-full ${ch.color}`} />
                  {ch.name}
                </span>
              ))}
            </div>
          </div>

          {/* Right Column: Hero Visual Graphic */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            
            {/* Dual Glowing Backdrop Orbs */}
            <div className="w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-gradient-to-tr from-cyan-400/30 via-indigo-500/30 to-pink-500/30 blur-3xl absolute animate-pulse-glow" />
            <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-gradient-to-bl from-purple-500/20 to-cyan-500/20 blur-2xl absolute animate-pulse-glow" style={{ animationDelay: '1.5s' }} />

            {/* Robot Central Dark Glass Card */}
            <div className="relative z-10 w-full max-w-md bg-slate-900/90 backdrop-blur-2xl border border-indigo-500/35 p-8 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col items-center text-center animate-float hover:border-cyan-400/40 transition-all">
              
              {/* Robot Avatar Circle */}
              <div className="relative mb-6">
                <div className="w-32 h-32 rounded-3xl bg-gradient-to-tr from-cyan-400 via-indigo-500 via-purple-500 to-pink-500 p-1 shadow-[0_0_30px_rgba(56,189,248,0.4)]">
                  <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/30 to-transparent" />
                    <Bot className="w-16 h-16 text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.9)]" />
                  </div>
                </div>

                {/* Floating Orbiting Badge */}
                <div className="absolute -top-3 -right-3 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-black text-[10px] shadow-lg flex items-center gap-1.5 backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shadow-sm shadow-emerald-400/50" />
                  ONLINE 24/7
                </div>
              </div>

              <h3 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 via-purple-300 to-pink-400 tracking-tight">
                Omni AI Assistant
              </h3>
              <p className="text-xs text-slate-300 mt-1 font-medium max-w-xs leading-relaxed">
                Automating customer inquiries with contextual intelligence across multi-tenant workspaces.
              </p>

              {/* Orbiting Channel Pills */}
              <div className="grid grid-cols-2 gap-2.5 w-full mt-6">
                {channels.slice(0, 4).map((c) => (
                  <div key={c.name} className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-slate-950/80 border border-indigo-500/20 text-left hover:border-cyan-400/40 transition-colors">
                    <div className={`p-1.5 rounded-xl ${c.color} text-white shrink-0 shadow-xs`}>
                      <c.icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-slate-200 truncate">{c.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Designed for <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">Next-Gen</span> Workspace Automation
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm font-medium mt-2">
            Everything your enterprise needs to streamline customer interaction channels.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1 */}
          <div className="bg-slate-900/80 backdrop-blur-xl p-7 rounded-3xl border border-indigo-500/20 shadow-xl shadow-indigo-950/50 hover:border-cyan-400/50 hover:shadow-[0_0_25px_rgba(56,189,248,0.2)] transition-all duration-300 group">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-400 via-indigo-500 to-purple-600 text-white flex items-center justify-center mb-5 shadow-lg shadow-cyan-500/25 group-hover:scale-110 transition-transform">
              <Zap className="w-7 h-7 text-cyan-300" />
            </div>
            <h3 className="text-lg font-black text-white mb-2 group-hover:text-cyan-300 transition-colors">Smart Channel Routing</h3>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              Intelligent agents route inquiries from WhatsApp, Messenger, SMS, and Email directly to specialized workflows.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-slate-900/80 backdrop-blur-xl p-7 rounded-3xl border border-indigo-500/20 shadow-xl shadow-indigo-950/50 hover:border-purple-400/50 hover:shadow-[0_0_25px_rgba(168,85,247,0.2)] transition-all duration-300 group">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-500 via-pink-500 to-rose-500 text-white flex items-center justify-center mb-5 shadow-lg shadow-purple-500/25 group-hover:scale-110 transition-transform">
              <Layers className="w-7 h-7 text-purple-200" />
            </div>
            <h3 className="text-lg font-black text-white mb-2 group-hover:text-purple-300 transition-colors">Multi-Tenant Management</h3>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              Isolate workspaces for different business units or companies with role-based access control and super admin overview.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-slate-900/80 backdrop-blur-xl p-7 rounded-3xl border border-indigo-500/20 shadow-xl shadow-indigo-950/50 hover:border-emerald-400/50 hover:shadow-[0_0_25px_rgba(52,211,153,0.2)] transition-all duration-300 group">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-400 via-teal-500 to-cyan-500 text-white flex items-center justify-center mb-5 shadow-lg shadow-emerald-500/25 group-hover:scale-110 transition-transform">
              <Shield className="w-7 h-7 text-emerald-200" />
            </div>
            <h3 className="text-lg font-black text-white mb-2 group-hover:text-emerald-300 transition-colors">Enterprise Security</h3>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              Bank-grade security protocols ensuring proprietary corporate data stays completely private and secure.
            </p>
          </div>

        </div>
      </section>
    </div>
  );
}
