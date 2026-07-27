// src/layouts/AdminLayout.tsx
import React from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutGrid,
  Users,
  Settings,
  LogOut,
  Bell,
  Search,
  HelpCircle,
} from "lucide-react";
import { useAuthStore } from "../store/authStore";
import logo from "../assets/omni-vista-logo.svg";
import shield from "../assets/shield.svg";

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutGrid,
      iconBg: "#FFDBCD",
      iconSize: 18,
    },
    {
      name: "User Management",
      path: "/users",
      icon: Users,
      iconBg: "#C7CFFF",
      iconSize: 18,
    },
    {
      name: "Settings",
      path: "/settings",
      icon: Settings,
      iconBg: "#D8FFE2",
      iconSize: 20,
    },
  ];

  return (
    <div className="flex h-screen bg-slate-100 text-gray-800">
      {/* === SIDEBAR === */}
      <aside className="w-[308px] bg-[#F5F8FF] text-slate-800 flex flex-col fixed h-full top-0 border-r border-slate-200">
        {/* Logo Header */}
        <div className="pt-[55px] pb-6 pl-[18px]">
          <div className="flex items-center gap-4">
            {/* The dark background rectangle */}
            <div className="w-[65px] h-[65px] bg-black rounded-[20px] flex items-center justify-center shrink-0">
              <img
                src={logo}
                alt="Omni Vista"
                className="w-[72px] h-[72px] object-contain"
              />
            </div>

            {/* Grouping the Title and Subtitle together */}
            <div className="flex flex-col">
              <h1
                className="text-[20px] font-bold tracking-[0.24px] leading-[16px]"
                style={{ color: "#004CFF", fontFamily: "Inter, sans-serif" }}
              >
                Omni vista
              </h1>
              <p
                className="text-[10px] font-bold tracking-[0.24px] leading-[16px] mt-1"
                style={{ color: "#000000", fontFamily: "Inter, sans-serif" }}
              >
                Combination of ai channels
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-2 pt-8 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-4 h-[45px] w-[289px] pl-[0px] text-sm font-medium transition-all duration-300 ease-out text-[#434655] rounded-tl-[8px] rounded-tr-[40px] rounded-br-[40px] rounded-bl-[8px] border-2 ${
                  active
                    ? "border-blue-600"
                    : "border-transparent hover:bg-slate-200/60"
                }`}
              >
                {/* The Pastel Icon Container */}
                <div
                  className="w-[46px] h-[45px] flex items-center justify-center rounded-tl-[8px] rounded-tr-[40px] rounded-br-[40px] rounded-bl-[8px] shrink-0"
                  style={{ backgroundColor: item.iconBg }}
                >
                  <Icon
                    size={item.iconSize}
                    strokeWidth={2}
                    className="text-[#434655]"
                  />
                </div>
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button at the bottom */}
        <div className="p-4">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors shadow-lg shadow-blue-600/20"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* === MAIN CONTENT AREA === */}
      <div className="flex-1 ml-[308px] flex flex-col">
        {/* Top Navbar */}
        <header
          className="h-[52px] flex items-center justify-between px-8 z-10"
          style={{
            background: "linear-gradient(90deg, #C2FFEA 0%, #DEE8FF 100%)",
          }}
        >
          {/* Left side: Logo Box and Search Bar */}
          <div className="flex items-center gap-4">
            {/* Small Black Logo Box from your Figma details */}
            <div className="w-[35px] h-[35px] bg-black rounded-[20px] flex items-center justify-center shrink-0">
              <img
                src={logo}
                alt="Omni Vista"
                className="w-[24px] h-[24px] object-contain"
              />
            </div>

            {/* Search Bar */}
            <div className="relative w-[448px]">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]"
                size={16}
                strokeWidth={2}
              />
              <input
                type="text"
                placeholder="Search..."
                className="w-full h-[33px] pl-8 pr-4 py-[6px] bg-white border border-[#EEEEEE] rounded-[8px] text-[16px] text-[#6B7280] focus:outline-none focus:ring-1 focus:ring-blue-500"
                style={{ fontFamily: "Inter, sans-serif", lineHeight: "100%" }}
              />
            </div>
          </div>

          {/* Right side: Icons, Divider, and Shield */}
          <div className="flex items-center gap-4">
            {/* Bell Icon */}
            <button className="text-[#434655] hover:opacity-80 transition-opacity">
              <Bell size={20} strokeWidth={2} className="w-[16px] h-[20px]" />
            </button>

            {/* Question Mark Icon */}
            <button className="text-[#434655] hover:opacity-80 transition-opacity pl-4">
              <HelpCircle
                size={20}
                strokeWidth={2}
                className="w-[36px] h-[20px]"
              />
            </button>

            {/* Vertical Divider */}
            <div className="w-px h-[32px] bg-[#C3C6D7] mx-2"></div>

            {/* Shield Image */}
            <img
              src={shield}
              alt="Security Shield"
              className="w-[28px] h-[28px] object-contain"
            />
          </div>
        </header>
        {/* Page Content (Dashboard renders here) */}
        <main className="flex-1 p-8 overflow-y-auto bg-slate-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
