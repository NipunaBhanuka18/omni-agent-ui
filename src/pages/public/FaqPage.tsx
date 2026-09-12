import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ShieldCheck, RefreshCw, CreditCard, Layers } from 'lucide-react';

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'What is included in each subscription package?',
      answer: 'Starter is designed for a single agent with website knowledge only. Business adds documents, OneDrive, and Form Builder for growing teams. Enterprise unlocks unlimited agents, knowledge bases, reminders, minutes, and Endpoints Tools for large organizations.',
      icon: Layers,
    },
    {
      question: 'Can I upgrade my workspace later?',
      answer: 'Yes. Sign in to your dashboard and choose a higher tier from the billing section. Upgrades are applied to your workspace immediately after confirmation.',
      icon: RefreshCw,
    },
    {
      question: 'What is your refund policy?',
      answer: 'If you cancel your subscription at any time, you will receive a refund of 40% of the amount you paid. Refunds will be processed to your original payment method within 5-7 business days.',
      icon: CreditCard,
    },
    {
      question: 'Is my corporate data secure?',
      answer: 'Absolutely. Security is our top priority. We use strict tenant-isolation architecture so that your company\'s documents, conversations, and custom LLMs are completely private and never shared, pooled, or used for training other public models.',
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-xs font-bold text-indigo-700 mb-3">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Support & Help</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-2 font-normal">
          Find quick answers to common questions about Omni Agent workspace setup, security, and billing.
        </p>
      </div>

      {/* Grid of FAQ cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="bg-white/90 backdrop-blur-md rounded-3xl p-6 border border-indigo-100 shadow-xl shadow-indigo-500/5 transition-all cursor-pointer hover:border-indigo-300"
              onClick={() => setOpenIndex(isOpen ? null : idx)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-600 shrink-0">
                    <faq.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    {faq.question}
                  </h3>
                </div>
                <div className={`p-1 rounded-full text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-indigo-600' : ''}`}>
                  <ChevronDown className="w-5 h-5" />
                </div>
              </div>

              {isOpen && (
                <div className="mt-4 pt-4 border-t border-slate-100 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
