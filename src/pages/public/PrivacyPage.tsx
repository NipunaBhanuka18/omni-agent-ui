import React, { useState } from 'react';
import { Shield, Eye, Cookie, Share2 } from 'lucide-react';

export default function PrivacyPage() {
  const [activeSection, setActiveSection] = useState('collect');

  const sections = [
    { id: 'collect', label: 'Data We Collect', icon: Shield },
    { id: 'usage', label: 'How We Use Your Data', icon: Eye },
    { id: 'cookies', label: 'Cookies and Analytics', icon: Cookie },
    { id: 'sharing', label: 'Data Sharing & Disclosure', icon: Share2 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-2 font-medium">
          Last Updated: June 30, 2026 | Learn how we protect and handle your organization's data.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Sidebar */}
        <div className="lg:col-span-4 bg-slate-900 text-white p-6 rounded-3xl shadow-xl border border-slate-800 sticky top-28">
          <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-4 pb-3 border-b border-slate-800">
            Content Navigation
          </h3>

          <nav className="space-y-2">
            {sections.map((item) => {
              const active = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold transition-all text-left ${
                    active
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <item.icon className={`w-4 h-4 ${active ? 'text-cyan-300' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Content */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Data We Collect Card */}
          <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl border border-indigo-100 shadow-xl">
            <h2 className="text-xl font-extrabold text-indigo-600 mb-3">
              Data We Collect
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mb-6 font-normal">
              To provide a secure and customized experience, Omni Agent operates on a principle of data minimalism. 
              We only collect the specific telemetry and information data required to maintain agent performance and functional integrity.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800">
                <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider mb-2">
                  • Identity & Contact
                </h4>
                <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                  <li>Company registration credentials</li>
                  <li>Work email & admin names</li>
                  <li>Authentication tokens (SSO/JWT)</li>
                </ul>
              </div>

              <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800">
                <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-2">
                  • Agent Dynamics
                </h4>
                <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                  <li>Knowledge Base indexing documents</li>
                  <li>API Endpoint route configuration</li>
                  <li>Action execution logs</li>
                </ul>
              </div>
            </div>

            {/* Privacy Graphic Banner */}
            <div className="mt-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white text-center relative overflow-hidden shadow-xl border border-indigo-900/50">
              <div className="relative z-10">
                <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
                  PRIVACY & ETHICS GUARANTEE
                </span>
                <h3 className="text-lg font-black mt-1">100% Isolated Tenant Architecture</h3>
                <p className="text-xs text-slate-300 mt-1 max-w-lg mx-auto">
                  Your custom AI agents operate exclusively within your dedicated workspace sandbox. Data is never shared or used to train external public models.
                </p>
              </div>
            </div>
          </div>

          {/* How We Use Your Data Card */}
          <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl border border-indigo-100 shadow-xl">
            <h2 className="text-xl font-extrabold text-indigo-600 mb-3">
              How We Use Your Data
            </h2>
            <div className="space-y-3 text-xs sm:text-sm text-slate-600 font-normal">
              <p>
                • <strong>Provide AI Agent Functionality:</strong> Processing user queries through channel endpoints (WhatsApp, Messenger, Web).
              </p>
              <p>
                • <strong>Analytics & Monitoring:</strong> Tracking response accuracy, latency, and usage metrics across tenants.
              </p>
              <p>
                • <strong>Security Verification:</strong> Verifying administrative actions and preventing unauthorized tenant breaches.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
