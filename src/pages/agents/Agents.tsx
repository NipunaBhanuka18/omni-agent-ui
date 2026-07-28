// src/pages/agents/Agents.tsx
import React from "react";
import { Bot, ShieldCheck, FileText, Cpu } from "lucide-react";

export default function Agents() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">AI Agent</h1>
        <p className="text-sm text-gray-500 mt-1">
          Real-time infrastructure health and user growth metrics for SLT Global
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Agent Fleet & Logs */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-[12px] border border-[#C2C6D4] shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              AI Agent Fleet
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Agent 1 */}
              <div className="border border-gray-100 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Bot className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">
                      Nexus-1 Support Bot
                    </h4>
                    <span className="text-xs text-green-600 font-medium">
                      ● Online
                    </span>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Response Accuracy</span>
                    <span className="font-medium text-gray-800">98.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Active Chats</span>
                    <span className="font-medium text-gray-800">142</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Avg Latency</span>
                    <span className="font-medium text-gray-800">0.8s</span>
                  </div>
                </div>
              </div>
              {/* Agent 2 */}
              <div className="border border-gray-100 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-red-50 rounded-lg">
                    <ShieldCheck className="text-red-600" size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">Sentinel Guard</h4>
                    <span className="text-xs text-green-600 font-medium">
                      ● Online
                    </span>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Threat Detection</span>
                    <span className="font-medium text-gray-800">99.0%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Incidents Handled</span>
                    <span className="font-medium text-gray-800">5203</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">True Positives</span>
                    <span className="font-medium text-gray-800">100%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[12px] border border-[#C2C6D4] shadow-sm">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
              System Logs
            </h3>
            <div className="space-y-2 text-sm font-mono text-gray-600 bg-gray-50 p-4 rounded-lg">
              <p>[10:42:01] Nexus-1 processed ticket #4821</p>
              <p>[10:41:15] Sentinel Guard blocked IP 192.168.1.1</p>
              <p>[10:40:02] System heartbeat OK</p>
            </div>
          </div>
        </div>

        {/* Right: Knowledge Base */}
        <div className="bg-white p-6 rounded-[12px] border border-[#C2C6D4] shadow-sm h-fit">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Knowledge Base
          </h3>
          <div className="space-y-3">
            {[
              "SLT Billing Manual.pdf",
              "Network Configs.docx",
              "FAQ v2.pdf",
              "Agent Protocols.txt",
            ].map((file) => (
              <div
                key={file}
                className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <FileText size={20} className="text-gray-400" />
                <span className="text-sm font-medium text-gray-700">
                  {file}
                </span>
              </div>
            ))}
          </div>
          <button className="mt-4 w-full flex items-center justify-center gap-2 py-2 border border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:bg-gray-50">
            <Cpu size={16} /> Upload New Data
          </button>
        </div>
      </div>
    </div>
  );
}
