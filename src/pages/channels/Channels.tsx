// src/pages/channels/Channels.tsx
import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { Settings2 } from "lucide-react";

const channels = [
  { id: 1, name: "WhatsApp", status: "Connected", color: "green" },
  { id: 2, name: "SMS Hub", status: "Connected", color: "purple" },
  { id: 3, name: "FB Messenger", status: "Disconnected", color: "blue" },
];

const logs = [
  { id: 1, action: "WhatsApp configuration updated", time: "1 hour ago" },
  { id: 2, action: "SMS Hub token refreshed", time: "3 hours ago" },
  { id: 3, action: "Messenger webhook setup failed", time: "Yesterday" },
];

const pieData = [
  { name: "WhatsApp", value: 45, color: "#25D366" },
  { name: "SMS", value: 30, color: "#7f1d1d" },
  { name: "Messenger", value: 25, color: "#0084FF" },
];

export default function Channels() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Channel Configuration
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Channels & Logs */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-[12px] border border-[#C2C6D4] shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {channels.map((chan) => (
                <div
                  key={chan.id}
                  className="border border-gray-100 rounded-lg p-4 flex flex-col"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-semibold text-gray-800">{chan.name}</h4>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-semibold ${chan.status === "Connected" ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-500"}`}
                    >
                      {chan.status}
                    </span>
                  </div>
                  <button className="mt-auto flex items-center justify-center gap-2 text-sm py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">
                    <Settings2 size={14} /> Configure
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-[12px] border border-[#C2C6D4] shadow-sm">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Activity Logs
            </h3>
            <div className="space-y-3">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="flex justify-between text-sm border-b border-gray-50 pb-2"
                >
                  <span className="text-gray-700">{log.action}</span>
                  <span className="text-gray-400">{log.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Pie Chart */}
        <div className="bg-white p-6 rounded-[12px] border border-[#C2C6D4] shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Channel Distribution
            </h3>
            <span className="text-xs font-bold text-gray-400">
              Total: 12.4k
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
