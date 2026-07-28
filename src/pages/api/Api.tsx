// src/pages/api/Api.tsx
import React from "react";
import { Plus, Activity, AlertTriangle } from "lucide-react";

const apiData = [
  {
    id: 1,
    endpoint: "Billing Services",
    status: "Active",
    latency: "42ms",
    throughput: "1.2k/s",
    error: "0.02%",
  },
  {
    id: 2,
    endpoint: "UserSync Gateway",
    status: "Active",
    latency: "88ms",
    throughput: "800/s",
    error: "0.00%",
  },
  {
    id: 3,
    endpoint: "Network Monitoring",
    status: "Critical",
    latency: "412ms",
    throughput: "300/s",
    error: "4.50%",
  },
  {
    id: 4,
    endpoint: "AI Agent Orchestrator",
    status: "Active",
    latency: "120ms",
    throughput: "450/s",
    error: "0.10%",
  },
];

export default function Api() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            API Control Panel
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Real-time infrastructure health and user growth metrics for SLT
            Global
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="h-[28px] rounded-full py-[6px] px-[12px] flex items-center gap-[8px] text-xs font-semibold text-green-900 bg-[#83FC8E]">
            <span className="w-2 h-2 bg-green-700 rounded-full"></span>{" "}
            Connection: Active
          </div>
          <button className="flex items-center gap-2 h-[42px] px-4 bg-blue-600 rounded-lg text-sm text-white hover:bg-blue-700">
            <Plus size={16} /> Register New API
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[12px] border border-[#C2C6D4] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">
            API Gateway Management
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Endpoint
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Latency
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Throughput
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Error Rate
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {apiData.map((api) => (
                <tr key={api.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-800 flex items-center gap-2">
                    {api.status === "Critical" ? (
                      <AlertTriangle size={16} className="text-red-500" />
                    ) : (
                      <Activity size={16} className="text-green-500" />
                    )}
                    {api.endpoint}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${api.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                    >
                      {api.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {api.latency}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {api.throughput}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {api.error}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
