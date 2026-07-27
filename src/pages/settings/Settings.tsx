// src/pages/settings/Settings.tsx
import React, { useState } from "react";
import { User, Monitor, ShieldCheck, Link2, Bot, Save, X } from "lucide-react";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("AI Agents");
  const sidebarTabs = ["General", "AI Agents", "Security", "Billing"];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Settings</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Sub-Navigation */}
        <div className="w-full lg:w-56 shrink-0">
          <nav className="flex flex-row lg:flex-col gap-2 overflow-x-auto">
            {sidebarTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                {tab === "General" && <User size={18} />}
                {tab === "AI Agents" && <Bot size={18} />}
                {tab === "Security" && <ShieldCheck size={18} />}
                {tab === "Billing" && <Monitor size={18} />}
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 space-y-8">
          {/* Personal Information */}
          <div className="bg-white p-6 rounded-[12px] border border-[#C2C6D4] shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  defaultValue="Isuru"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  defaultValue="Lakmal"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  defaultValue="isuru.lakmal@slt.lk"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Display Preferences */}
          <div className="bg-white p-6 rounded-[12px] border border-[#C2C6D4] shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Display Preferences
            </h3>
            <div className="flex gap-4">
              <label className="flex-1 flex items-center gap-3 p-4 border-2 border-blue-500 bg-blue-50 rounded-lg cursor-pointer">
                <input
                  type="radio"
                  name="theme"
                  defaultChecked
                  className="text-blue-600"
                />
                <Monitor size={20} className="text-blue-600" />
                <span className="text-sm font-medium text-gray-800">
                  Light Mode
                </span>
              </label>
              <label className="flex-1 flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input type="radio" name="theme" className="text-blue-600" />
                <Monitor size={20} className="text-gray-400" />
                <span className="text-sm font-medium text-gray-500">
                  Dark Mode
                </span>
              </label>
            </div>
          </div>

          {/* Connected Accounts */}
          <div className="bg-white p-6 rounded-[12px] border border-[#C2C6D4] shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Connected Accounts
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center text-red-600 font-bold">
                    G
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Google</p>
                    <p className="text-xs text-gray-400">
                      Connected as isuru.lakmal@gmail.com
                    </p>
                  </div>
                </div>
                <button className="text-sm font-medium text-red-500 hover:text-red-600">
                  Disconnect
                </button>
              </div>
              <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 font-bold">
                    M
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      Microsoft Azure
                    </p>
                    <p className="text-xs text-gray-400">
                      Connected as isuru.lakmal@slt.lk
                    </p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
                  ACTIVE
                </span>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-3">
            <button className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
              <X size={16} /> Discard
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium text-white shadow-sm">
              <Save size={16} /> Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
