import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Bot, ChevronRight } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Terms & Conditions', path: '/terms' },
    { name: 'Privacy', path: '/privacy' },
    { name: 'About', path: '/about' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-slate-950/85 border-b border-indigo-500/20 text-slate-100 transition-all duration-300">
      {/* Ambient Top Gradient Accent Line */}
      <div className="h-0.5 w-full bg-gradient-to-r from-cyan-400 via-indigo-500 via-purple-500 to-pink-500 animate-pulse-glow" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-400 via-indigo-500 to-pink-500 p-0.5 shadow-lg shadow-cyan-500/25 group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Bot className="w-6 h-6 text-cyan-400 group-hover:rotate-12 transition-transform duration-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black tracking-tight text-white leading-none">
              Omni<span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-pink-400 bg-clip-text text-transparent">AI</span>
            </span>
            <span className="text-[10px] font-extrabold text-cyan-400 tracking-widest uppercase mt-1">
              Omni Channel Agent
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Menu */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2 bg-slate-900/80 p-1.5 rounded-full border border-indigo-500/20 shadow-inner">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
                  active
                    ? 'bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/login"
            className="px-5 py-2.5 rounded-full text-xs font-bold text-slate-200 bg-slate-900/90 border border-indigo-500/30 hover:border-indigo-400 hover:bg-slate-800 shadow-sm transition-all flex items-center gap-1.5"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="px-5 py-2.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:opacity-95 shadow-md shadow-indigo-500/30 border border-indigo-400/30 transition-all flex items-center gap-1.5 hover:scale-[1.02]"
          >
            <span>Get Started</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950/95 backdrop-blur-xl border-b border-indigo-500/20 px-4 pt-3 pb-6 space-y-3 shadow-2xl">
          <div className="flex flex-col space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                  isActive(item.path)
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold'
                    : 'text-slate-300 hover:bg-slate-800/80'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-indigo-500/20 flex flex-col gap-2">
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center px-4 py-3 rounded-xl text-xs font-bold text-slate-200 bg-slate-900 border border-indigo-500/30 hover:bg-slate-800"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center px-4 py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 shadow-md"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
