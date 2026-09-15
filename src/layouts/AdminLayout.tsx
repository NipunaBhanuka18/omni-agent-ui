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
  HelpCircle,
  Building2,
  ShieldCheck,
  LogOut,
  MessageSquare,
  Menu,
  X,
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

  // Navigation Items matching Image 1 flowchart
  const companyNavItems = [
    { name: "Dash-Board", path: "/dashboard", icon: LayoutGrid, iconBg: "#FFDBCD" },
    { name: "Live ChatBot", path: "/chat", icon: MessageSquare, iconBg: "#C7CFFF" },
    { name: "Manage Customers", path: "/users", icon: Users, iconBg: "#C7CFFF" },
    { name: "API", path: "/api", icon: Code2, iconBg: "#C7CFFF" },
    { name: "Channels", path: "/channels", icon: SlidersHorizontal, iconBg: "#C7CFFF" },
    { name: "AI Agents", path: "/agents", icon: Bot, iconBg: "#C7CFFF" },
    { name: "Notifications", path: "/notifications", icon: Bell, iconBg: "#C7CFFF" },
    { name: "Settings", path: "/settings", icon: Settings, iconBg: "#D8FFE2" },
  ];

  const adminNavItems = [
    { name: "Super Admin Dashboard", path: "/admin/dashboard", icon: LayoutGrid, iconBg: "#FFDBCD" },
    { name: "Live ChatBot", path: "/admin/chat", icon: MessageSquare, iconBg: "#C7CFFF" },
    { name: "Organization Mgmt", path: "/admin/organizations", icon: Building2, iconBg: "#C7CFFF" },
    { name: "API Management", path: "/admin/api", icon: Code2, iconBg: "#C7CFFF" },
    { name: "Channels Management", path: "/admin/channels", icon: SlidersHorizontal, iconBg: "#C7CFFF" },
    { name: "AI Agent Management", path: "/admin/agents", icon: Bot, iconBg: "#C7CFFF" },
    { name: "Notifications", path: "/admin/notifications", icon: Bell, iconBg: "#C7CFFF" },
    { name: "Settings", path: "/admin/settings", icon: Settings, iconBg: "#D8FFE2" },
  ];

  const navItems = isAdminMode ? adminNavItems : companyNavItems;

  return (
    <div className="flex min-h-screen bg-slate-100 text-gray-800 font-sans relative">
      {/* Mobile Overlay */}
      {isMobileSidebarOpen && (
        <div
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-30 md:hidden"
        />
      )}

      {/* === SIDEBAR === */}
      <aside
        className={`w-[280px] bg-[#F5F8FF] text-slate-800 flex flex-col fixed h-full top-0 border-r border-slate-200 z-40 transition-transform duration-300 ${
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Logo Header */}
        <div className="pt-6 pb-4 px-6 border-b border-slate-200/80 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center shrink-0 shadow-md">
              <Bot className="w-6 h-6 text-cyan-400" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-bold text-indigo-600 tracking-tight leading-none">
                OmniAI
              </h1>
              <p className="text-[10px] font-semibold text-slate-700 tracking-wider uppercase mt-1">
                {isAdminMode ? "SUPER ADMIN PORTAL" : "COMPANY WORKSPACE"}
              </p>
            </div>
          </Link>
          <button
            onClick={() => setIsMobileSidebarOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Portal Switcher Button */}
        <div className="px-4 pt-4">
          <button
            onClick={() => {
              setIsMobileSidebarOpen(false);
              navigate(isAdminMode ? "/dashboard" : "/admin/dashboard");
            }}
            className="w-full py-2 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold border border-indigo-200 flex items-center justify-center gap-2 transition-colors"
          >
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            <span>Switch to {isAdminMode ? "Company Mode" : "Super Admin Mode"}</span>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 pt-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsMobileSidebarOpen(false)}
                className={`group flex items-center gap-3 h-11 w-full px-3 text-xs font-semibold transition-all duration-200 text-slate-700 rounded-xl ${
                  active
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                    : "hover:bg-slate-200/60"
                }`}
              >
                <div
                  className={`w-8 h-8 flex items-center justify-center rounded-lg shrink-0 transition-colors ${
                    active ? "bg-white/20 text-white" : "bg-white text-slate-700 shadow-xs"
                  }`}
                >
                  <Icon size={16} strokeWidth={2} />
                </div>
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-slate-200">
          <button
            onClick={handleLogout}
            className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* === MAIN CONTENT AREA === */}
      <div className="flex-1 md:ml-[280px] flex flex-col min-h-screen w-full min-w-0">
        {/* Top Navbar Header */}
        <header
          className="h-14 flex items-center justify-between px-4 sm:px-8 z-10 sticky top-0 border-b border-indigo-100"
          style={{
            background: "linear-gradient(90deg, #E0E7FF 0%, #F5F3FF 100%)",
          }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl bg-white/80 hover:bg-white text-slate-700 shadow-xs"
            >
              <Menu size={18} />
            </button>

            <div className="relative w-40 sm:w-80">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search..."
                className="w-full h-8 pl-9 pr-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 text-xs font-semibold text-slate-700">
            <button className="p-2 rounded-xl bg-white/80 hover:bg-white text-slate-600 shadow-xs">
              <Bell size={16} />
            </button>
            <div className="w-px h-6 bg-slate-300 mx-0.5 sm:mx-1" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-sm">
                {isAdminMode ? "SA" : "CA"}
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="font-bold text-slate-900 leading-tight">
                  {isAdminMode ? "Super Admin" : "Company Admin"}
                </span>
                <span className="text-[10px] text-slate-500 font-medium">
                  {isAdminMode ? "System Root" : "Acme Corp Workspace"}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-3 sm:p-6 md:p-8 overflow-y-auto bg-slate-50">
          <Outlet />
        </main>
      </div>

      {/* Floating ChatBot Assistant Widget */}
      <ChatBotWidget />
    </div>
  );
}
