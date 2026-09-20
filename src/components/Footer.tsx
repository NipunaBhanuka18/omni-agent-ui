import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full bg-slate-950/90 backdrop-blur-xl text-slate-400 py-8 border-t border-indigo-500/20 relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium">
        
        {/* Brand & Copyright */}
        <div className="flex items-center gap-3">
          <span className="text-white font-extrabold tracking-tight">
            Omni<span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-pink-400 bg-clip-text text-transparent">AI</span>
          </span>
          <span className="text-slate-700">|</span>
          <span className="text-slate-400">© 2026 Omni Agent. All rights reserved.</span>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-6">
          <Link to="/privacy" className="hover:text-cyan-400 transition-colors">
            Privacy Policy
          </Link>
          <Link to="/terms" className="hover:text-cyan-400 transition-colors">
            Terms of Service
          </Link>
          <Link to="/contact" className="hover:text-cyan-400 transition-colors">
            Support
          </Link>
        </div>
      </div>
    </footer>
  );
}
