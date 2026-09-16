import React, { useState } from 'react';
import { Mail, Clock, Calendar, Send, CheckCircle2 } from 'lucide-react';
import InputField from '@/components/InputField';
import Button from '@/components/Button';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: 'General Inquiry',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ fullName: '', email: '', subject: 'General Inquiry', message: '' });
    }, 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Title Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-xs font-bold text-indigo-700 mb-3">
          <span>• WE'RE HERE TO HELP •</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Get in <span className="text-indigo-600">Touch</span>
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm mt-3 leading-relaxed font-normal">
          Have questions about building custom AI agents or need help with your company workspace? 
          Our team of specialists is ready to assist you on your automation journey.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Contact Info Cards Column */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Card 1: Write Us */}
          <div className="bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-indigo-100 shadow-xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Write Us</span>
              <p className="text-sm font-bold text-slate-900 mt-0.5">support@slt.lk</p>
            </div>
          </div>

          {/* Card 2: Response Time */}
          <div className="bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-indigo-100 shadow-xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Response Time</span>
              <p className="text-sm font-bold text-slate-900 mt-0.5">Within 24 hours</p>
            </div>
          </div>

          {/* Card 3: Support Hours */}
          <div className="bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-indigo-100 shadow-xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Support Hours</span>
              <p className="text-sm font-bold text-slate-900 mt-0.5">Mon - Fri, 8:30AM - 5:00PM</p>
            </div>
          </div>

        </div>

        {/* Right Message Form Column */}
        <div className="lg:col-span-8 bg-white/95 backdrop-blur-xl p-8 sm:p-10 rounded-3xl border border-indigo-100 shadow-2xl shadow-indigo-500/10">
          <div className="mb-6">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Send Us a Message</h2>
            <p className="text-xs text-slate-500 mt-1 font-normal">
              Fill in the details below and we'll get back to you as soon as possible.
            </p>
          </div>

          {submitted ? (
            <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="text-lg font-bold text-emerald-900">Message Sent Successfully!</h3>
              <p className="text-xs text-emerald-700 max-w-md mx-auto">
                Thank you for contacting Omni AI Support. Our team will review your inquiry and respond within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Full Name *"
                  placeholder="John Smith"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
                <InputField
                  label="Email Address *"
                  type="email"
                  placeholder="jane@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Subject *
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Technical Support">Technical Support</option>
                  <option value="Enterprise Workspace">Enterprise Workspace Request</option>
                  <option value="Custom Agent AI Integration">Custom Agent AI Integration</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Message *
                </label>
                <textarea
                  rows={4}
                  placeholder="Tell us more about your question or request..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
                  required
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="rounded-xl px-8 py-3.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <span>Send Message</span>
                <Send className="w-4 h-4" />
              </Button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
