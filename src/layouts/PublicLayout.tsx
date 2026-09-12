import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 relative overflow-x-hidden font-sans selection:bg-indigo-500 selection:text-white">
      {/* Background Organic Wave Gradient Orbs & Curves */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Top Right Vibrant Wave Glow */}
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-gradient-to-bl from-indigo-500/20 via-purple-500/15 to-transparent blur-3xl" />
        
        {/* Top Left Teal Wave Glow */}
        <div className="absolute top-20 -left-40 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-cyan-400/20 via-emerald-400/15 to-transparent blur-3xl" />
        
        {/* Bottom Right Purple Wave Glow */}
        <div className="absolute bottom-10 -right-20 w-[600px] h-[600px] rounded-full bg-gradient-to-tl from-purple-600/15 via-indigo-600/15 to-transparent blur-3xl" />

        {/* SVG Decorative Gradient Waves */}
        <svg
          className="absolute top-0 right-0 w-full h-[500px] opacity-40 pointer-events-none"
          viewBox="0 0 1440 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,160 C320,300 420,0 740,120 C1060,240 1200,80 1440,140 L1440,0 L0,0 Z"
            fill="url(#wave-gradient-1)"
          />
          <defs>
            <linearGradient id="wave-gradient-1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#818CF8" stopOpacity="0.25" />
              <stop offset="50%" stopColor="#C084FC" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.1" />
            </linearGradient>
          </defs>
        </svg>

        {/* SVG Bottom Decorative Wave */}
        <svg
          className="absolute bottom-0 left-0 w-full h-[400px] opacity-35 pointer-events-none"
          viewBox="0 0 1440 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,220 C400,100 800,320 1440,180 L1440,400 L0,400 Z"
            fill="url(#wave-gradient-2)"
          />
          <defs>
            <linearGradient id="wave-gradient-2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#67E8F9" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#A855F7" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.25" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Main Layout Content */}
      <Navbar />
      
      <main className="flex-grow relative z-10">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
