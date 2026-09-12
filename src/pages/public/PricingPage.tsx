import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Zap, HelpCircle } from 'lucide-react';

export default function PricingPage() {
  const plans = [
    {
      name: 'Free Trial',
      subtitle: '7-day free trial to get started with custom agents.',
      price: 'Rs 0',
      period: '/ 7 days',
      channels: '1 Channel',
      badge: 'Trial',
      badgeBg: 'bg-slate-700 text-slate-200',
      features: [
        '1 AI Agent',
        'Web URL Knowledge Base',
        '1,000 Monthly Messages',
        'Digital Knowledge Base',
        'Basic Form Builder',
        'API Access',
        'WhatsApp, Messenger, Web',
        'Basic Channel Support',
        'Manage Customers',
      ],
    },
    {
      name: 'Starter',
      subtitle: '7-day plan for team testing with multiple agents.',
      price: 'Rs 190',
      period: '/ 7 days',
      channels: '3 Channels',
      badge: 'Popular',
      badgeBg: 'bg-indigo-600 text-white',
      featured: true,
      features: [
        '3 AI Agents',
        'Web URL Knowledge Data',
        '5,000 Monthly Messages',
        'Digital Knowledge Base',
        'Advanced Form Builder',
        'API Access',
        'OneDrive & SharePoint Knowledge',
        'Small Team Workspace Role',
        'Manage Customers',
      ],
    },
    {
      name: 'Business',
      subtitle: '30-day plan for established businesses.',
      price: 'Rs 4900',
      period: '/ 30 days',
      channels: '5 Channels',
      badge: 'Best Value',
      badgeBg: 'bg-purple-600 text-white',
      features: [
        '10 AI Agents',
        'Document Files & URL Knowledge',
        '50,000 Monthly Messages',
        'Advanced Form Builder',
        'Full API Access',
        'OneDrive & SharePoint Knowledge',
        'Customer Management Dashboard',
        'WhatsApp, Messenger, SMS, Web, Email',
        'Custom Workspace Branding',
        'AI Agent Analytics & Reports',
      ],
    },
    {
      name: 'Enterprise',
      subtitle: '30-day full access package for enterprise teams.',
      price: 'Rs 10490',
      period: '/ 30 days',
      channels: 'Unlimited',
      badge: 'Unlimited',
      badgeBg: 'bg-cyan-500 text-slate-900',
      features: [
        'Unlimited AI Agents',
        'Unlimited Knowledge Base',
        'Unlimited Monthly Messages',
        'Advanced Form Builder',
        'Enterprise API Access',
        'Database & Custom Integrations',
        'Customer Management Suite',
        'All Omnichannel Channels Supported',
        'Dedicated Support Manager',
        'Custom AI Agent Configuration',
      ],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Title Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Choose Your Workspace Plan
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm mt-3 leading-relaxed font-medium">
          Flexible pricing designed to empower any team to launch, scale, and automate customer support with Omni AI Agents.
        </p>
      </div>

      {/* 4 Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch mb-12">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`bg-slate-900 text-white rounded-3xl p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden transition-all duration-300 border ${
              plan.featured
                ? 'border-indigo-500 shadow-indigo-500/20 scale-[1.02] ring-2 ring-indigo-500/50'
                : 'border-slate-800 hover:border-slate-700'
            }`}
          >
            {/* Top Badge */}
            <div className="flex items-center justify-between mb-4">
              <span className={`text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full ${plan.badgeBg}`}>
                {plan.badge}
              </span>
              <span className="text-[11px] font-semibold text-slate-400">
                {plan.channels}
              </span>
            </div>

            {/* Plan Info */}
            <div>
              <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
              <p className="text-[11px] text-slate-400 mb-6 leading-tight min-h-[28px]">
                {plan.subtitle}
              </p>

              {/* Price Tag */}
              <div className="mb-6 pb-6 border-b border-slate-800">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-white">{plan.price}</span>
                  <span className="text-xs text-slate-400 font-medium">{plan.period}</span>
                </div>
              </div>

              {/* Features List */}
              <div className="space-y-2.5 mb-8">
                <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider block">
                  Features Included:
                </span>
                {plan.features.map((feat, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                    <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <span className="leading-tight">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action CTA Button */}
            <Link
              to="/register"
              className={`w-full py-3 rounded-2xl text-xs font-bold text-center transition-all ${
                plan.featured
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 text-white shadow-lg shadow-indigo-600/30'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
            >
              Get Started
            </Link>
          </div>
        ))}
      </div>

      {/* FAQ CTA Link Button */}
      <div className="flex justify-center">
        <Link
          to="/faq"
          className="px-8 py-3.5 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white text-xs font-bold shadow-xl hover:scale-105 transition-all flex items-center gap-2"
        >
          <HelpCircle className="w-4 h-4 text-cyan-300" />
          <span>Frequently Asked Questions</span>
        </Link>
      </div>
    </div>
  );
}
