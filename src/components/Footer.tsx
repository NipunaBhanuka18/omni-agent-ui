import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full bg-slate-900/90 backdrop-blur-md text-slate-400 py-8 border-t border-indigo-900/40 relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium">
        
        {/* Brand & Copyright */}
        <div className="flex items-center gap-3">
          <span className="text-slate-200 font-bold tracking-tight">OmniAI</span>
          <span className="text-slate-600">|</span>
          <span>© 2026 Omni Agent. All rights reserved.</span>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-6">
          <Link to="/privacy" className="hover:text-indigo-400 transition-colors">
            Privacy Policy
          </Link>
          <Link to="/terms" className="hover:text-indigo-400 transition-colors">
            Terms of Service
          </Link>
          <Link to="/contact" className="hover:text-indigo-400 transition-colors">
            Support
          </Link>
        </div>
      </div>
    </footer>
  );
}
