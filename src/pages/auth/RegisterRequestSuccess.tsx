import React from 'react';
import { Link } from 'react-router-dom';
import { Bot, CheckCircle2, Clock, Home, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function RegisterRequestSuccess() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-950 text-white font-sans relative overflow-hidden">
      
      {/* Background Gradient Orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-cyan-600/20 rounded-full blur-3xl" />
      </div>

      <Navbar />

      <main className="relative z-10 flex-grow flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-2xl w-full bg-slate-900/90 backdrop-blur-2xl p-8 sm:p-12 rounded-3xl border border-indigo-900/60 shadow-2xl shadow-indigo-950/80 text-center flex flex-col items-center">
          
          {/* Logo Badge */}
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 p-0.5 shadow-xl mb-6">
            <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
              <Bot className="w-7 h-7 text-cyan-400" />
            </div>
          </div>

          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-2 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            REQUEST SUBMITTED
          </span>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug mb-3">
            Your Registration Request Successfully Sent To Admin
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 font-medium mb-6">
            Wait for the Review Completion
          </p>

          {/* Review Estimate Box */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-950/70 border border-indigo-800 text-xs text-indigo-300 font-semibold mb-8">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Estimated Review Time: 24 to 48 Hours</span>
          </div>

          {/* Robot Central Illustration */}
          <div className="relative mb-8 p-6 rounded-3xl bg-slate-950/80 border border-indigo-900/40 w-full max-w-sm flex flex-col items-center">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 p-1 mb-3 animate-bounce">
              <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
                <Bot className="w-12 h-12 text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
              </div>
            </div>
            <p className="text-xs text-slate-400 font-normal">
              Our Super Admin team is reviewing your workspace parameters. Once verified, you will receive an activation email to log in.
            </p>
          </div>

          {/* Action Button */}
          <Link
            to="/"
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 hover:scale-105 transition-all flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
