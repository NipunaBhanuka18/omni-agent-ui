import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Check, ArrowRight, X } from 'lucide-react';
import Button from '@/components/Button';

export default function CompanyOnboardingPlanPage() {
  const navigate = useNavigate();

  const plans = [
    {
      name: 'Free Trial',
      subtitle: '7-day free trial to get started.',
      price: 'Rs 0',
      period: '/ 7 days',
      features: ['1 AI Agent', 'Web URL Knowledge Base', '1,000 Messages', 'API Access', 'Manage Customers'],
      actionText: 'Select Free Trial',
      actionPath: '/onboarding/company-details',
    },
    {
      name: 'Starter',
      subtitle: '7-day plan for small teams.',
      price: 'Rs 190',
      period: '/ 7 days',
      features: ['3 AI Agents', 'Web URL Knowledge Data', '5,000 Messages', 'API Access', 'Small Team Role'],
      actionText: 'Select Starter',
      actionPath: '/checkout',
    },
    {
      name: 'Business',
      subtitle: '30-day plan for growing companies.',
      price: 'Rs 4900',
      period: '/ 30 days',
      featured: true,
      badge: 'Most Popular',
      features: ['10 AI Agents', 'Document & URL Knowledge', '50,000 Messages', 'All 5 Channels', 'Custom Branding'],
      actionText: 'Select Business',
      actionPath: '/checkout',
    },
    {
      name: 'Enterprise',
      subtitle: '30-day full access package.',
      price: 'Rs 10490',
      period: '/ 30 days',
      features: ['Unlimited AI Agents', 'Unlimited Knowledge Base', 'Unlimited Messages', 'Enterprise API Access', '24/7 Dedicated Support'],
      actionText: 'Select Enterprise',
      actionPath: '/checkout',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative">
      {/* Dynamic Background Glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-cyan-600/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl w-full bg-white rounded-3xl shadow-2xl p-8 sm:p-10 border border-slate-200">
        
        {/* Modal Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 relative">
          <button
            onClick={() => navigate('/onboarding/company-details')}
            className="absolute -top-2 -right-2 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500"
          >
            <X className="w-5 h-5" />
          </button>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Choose Your Plan To Start Journey
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 font-normal">
            Choose Your Plan and Start Your Journey. Our plans offer valuable benefits, flexible packages, and useful services. Get everything you need in one place.
          </p>
        </div>

        {/* 4 Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`bg-slate-900 text-white rounded-3xl p-6 flex flex-col justify-between relative shadow-xl ${
                p.featured ? 'border-2 border-indigo-500 ring-4 ring-indigo-500/20 scale-[1.02]' : 'border border-slate-800'
              }`}
            >
              {p.badge && (
                <span className="absolute -top-3 right-6 px-3 py-1 rounded-full bg-indigo-600 text-white font-extrabold text-[9px] uppercase tracking-widest shadow-md">
                  {p.badge}
                </span>
              )}

              <div>
                <h3 className="text-lg font-bold text-white mb-1">{p.name}</h3>
                <p className="text-[11px] text-slate-400 mb-4">{p.subtitle}</p>

                <div className="mb-4 pb-4 border-b border-slate-800">
                  <span className="text-2xl font-black text-white">{p.price}</span>
                  <span className="text-xs text-slate-400 font-medium">{p.period}</span>
                </div>

                <div className="space-y-2 mb-6 text-xs text-slate-300">
                  {p.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => navigate(p.actionPath)}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all ${
                  p.featured
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 text-white shadow-md'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                }`}
              >
                {p.actionText}
              </button>
            </div>
          ))}
        </div>

        {/* Bottom Action: Skip and Stay Free Trial */}
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate('/onboarding/company-details')}
            className="rounded-full px-8 py-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs border border-indigo-200 shadow-md flex items-center gap-2"
          >
            <span>SKIP AND STAY FREE TRIAL</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

      </div>
    </div>
  );
}
