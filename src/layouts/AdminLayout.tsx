import React, { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutGrid,
  Code2,
  SlidersHorizontal,
  Bot,
  Settings,
  Users,
  Bell,
  Search,
  Building2,
  ShieldCheck,
  LogOut,
  MessageSquare,
  Menu,
  X,
  Sparkles,
} from "lucide-react";
import { useAuthStore } from "../store/authStore";
import ChatBotWidget from "../components/ChatBotWidget";

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const isAdminMode = location.pathname.startsWith("/admin");

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const companyNavItems = [
    { name: "Dash-Board", path: "/dashboard", icon: LayoutGrid },
    { name: "Live ChatBot", path: "/chat", icon: MessageSquare },
    { name: "Manage Customers", path: "/users", icon: Users },
    { name: "API", path: "/api", icon: Code2 },
    { name: "Channels", path: "/channels", icon: SlidersHorizontal },
    { name: "AI Agents", path: "/agents", icon: Bot },
    { name: "Notifications", path: "/notifications", icon: Bell },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  const adminNavItems = [
    { name: "Super Admin Dashboard", path: "/admin/dashboard", icon: LayoutGrid },
    { name: "Live ChatBot", path: "/admin/chat", icon: MessageSquare },
    { name: "Organization Mgmt", path: "/admin/organizations", icon: Building2 },
    { name: "API Management", path: "/admin/api", icon: Code2 },
    { name: "Channels Management", path: "/admin/channels", icon: SlidersHorizontal },
    { name: "AI Agent Management", path: "/admin/agents", icon: Bot },
    { name: "Notifications", path: "/admin/notifications", icon: Bell },
    { name: "Settings", path: "/admin/settings", icon: Settings },
  ];

  const navItems = isAdminMode ? adminNavItems : companyNavItems;

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans relative">
      {/* Mobile Overlay */}
      {isMobileSidebarOpen && (
        <div
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-30 md:hidden"
        />
      )}

      {/* === SIDEBAR (Gradient Dark Theme) === */}
      <aside
        className={`w-[280px] bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 text-slate-100 flex flex-col fixed h-full top-0 border-r border-indigo-500/20 z-40 transition-transform duration-300 shadow-2xl ${
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Logo Header */}
        <div className="pt-6 pb-5 px-6 border-b border-indigo-500/20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/30 ring-2 ring-indigo-400/30">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-pink-400 tracking-tight leading-none">
                OmniAI
              </h1>
              <p className="text-[9px] font-extrabold text-cyan-400/90 tracking-widest uppercase mt-1 flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" />
                {isAdminMode ? "SUPER ADMIN PORTAL" : "COMPANY WORKSPACE"}
              </p>
            </div>
          </Link>
          <button
            onClick={() => setIsMobileSidebarOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Portal Switcher Button */}
        <div className="px-4 pt-5">
          <button
            onClick={() => {
              setIsMobileSidebarOpen(false);
              navigate(isAdminMode ? "/dashboard" : "/admin/dashboard");
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 hover:from-indigo-500/20 hover:via-purple-500/20 hover:to-pink-500/20 text-indigo-200 text-xs font-bold border border-indigo-500/30 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm hover:border-indigo-400"
          >
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Switch to {isAdminMode ? "Company Mode" : "Super Admin Mode"}</span>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 pt-6 space-y-2 overflow-y-auto no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsMobileSidebarOpen(false)}
                className={`group flex items-center gap-3 h-11 w-full px-3 text-xs font-bold transition-all duration-200 rounded-xl cursor-pointer ${
                  active
                    ? "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-lg shadow-indigo-500/30 border border-white/20 scale-[1.02]"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <div
                  className={`w-8 h-8 flex items-center justify-center rounded-lg shrink-0 transition-all ${
                    active
                      ? "bg-white/20 text-white"
                      : "bg-slate-800/80 text-cyan-400 group-hover:bg-indigo-600 group-hover:text-white"
                  }`}
                >
                  <Icon size={16} strokeWidth={2} />
                </div>
                <span className="truncate tracking-wide">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-indigo-500/20">
          <button
            onClick={handleLogout}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-black text-xs shadow-lg shadow-rose-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* === MAIN CONTENT AREA === */}
      <div className="flex-1 md:ml-[280px] flex flex-col min-h-screen w-full min-w-0 bg-gradient-mesh">
        {/* Top Navbar Header (Gradient Dark Backdrop) */}
        <header className="h-16 flex items-center justify-between px-4 sm:px-8 z-10 sticky top-0 bg-slate-950/80 backdrop-blur-xl border-b border-indigo-500/20 text-white shadow-md">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700"
            >
              <Menu size={18} />
            </button>

            <div className="relative w-40 sm:w-80">
              <Search
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search resources, agents, companies..."
                className="w-full h-9 pl-10 pr-4 bg-slate-900/80 border border-indigo-500/30 rounded-xl text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-5 text-xs font-semibold">
            <button className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-cyan-400 border border-indigo-500/30 transition-all cursor-pointer">
              <Bell size={16} />
            </button>
            <div className="w-px h-6 bg-indigo-500/30 mx-0.5 sm:mx-1" />
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 text-white font-black flex items-center justify-center text-xs shadow-md ring-2 ring-indigo-400/30">
                {isAdminMode ? "SA" : "CA"}
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="font-black text-slate-100 leading-tight">
                  {isAdminMode ? "Super Admin" : "Company Admin"}
                </span>
                <span className="text-[10px] text-cyan-400 font-extrabold tracking-wider">
                  {isAdminMode ? "System Root" : "Acme Corp Workspace"}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content Container */}
        <main className="flex-1 p-3 sm:p-6 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Floating ChatBot Assistant Widget */}
      <ChatBotWidget />
    </div>
  );
}
