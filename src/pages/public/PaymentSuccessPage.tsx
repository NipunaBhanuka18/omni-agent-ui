import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Download, ArrowRight } from 'lucide-react';
import ToastContainer, { type ToastMessage } from '@/components/Toast';

export default function PaymentSuccessPage() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
  };
  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 font-sans">
      <div className="bg-white/95 backdrop-blur-2xl p-8 sm:p-12 rounded-3xl border border-indigo-100 shadow-2xl shadow-indigo-500/10 text-center flex flex-col items-center">
        
        {/* Success Icon */}
        <div className="w-20 h-20 rounded-full bg-emerald-100 border-4 border-emerald-50 text-emerald-600 flex items-center justify-center mb-6 shadow-xl shadow-emerald-500/20">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 mb-2">
          PAYMENT CONFIRMED
        </span>

        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
          Payment Successful
        </h1>

        <p className="text-xs sm:text-sm text-slate-500 font-medium mb-8 max-w-md">
          Thank you for your purchase! Your company workspace has been activated with full feature access.
        </p>

        {/* Receipt Table Details Box */}
        <div className="w-full max-w-lg bg-slate-50 rounded-2xl p-6 border border-slate-200 text-xs font-medium space-y-3 mb-8 text-left">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <span className="text-slate-500">Transaction ID</span>
            <span className="font-mono font-bold text-slate-900">TXN-9874561230</span>
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <span className="text-slate-500">Date & Time</span>
            <span className="font-semibold text-slate-800">Oct 20, 2026, 10:24 AM</span>
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <span className="text-slate-500">Plan Purchased</span>
            <span className="font-bold text-indigo-600">Business Plan - 30 days</span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-slate-900 font-bold">Total Amount Paid</span>
            <span className="text-lg font-black text-emerald-600">Rs 5,635.00</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-md">
          <button
            onClick={() => addToast('Downloading Receipt PDF...', 'info')}
            className="w-full sm:w-1/2 py-3.5 px-5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Download Receipt</span>
          </button>

          <Link
            to="/dashboard"
            className="w-full sm:w-1/2 py-3.5 px-5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
          >
            <span>Go To Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>

      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}
