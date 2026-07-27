// src/pages/dashboard/Dashboard.tsx
import React from "react";
import { Users, Activity, UserPlus, TrendingUp } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// Mock Data for the Line Chart (Jan to Nov)
const growthData = [
  { month: "Jan", direct: 3200, partners: 2400 },
  { month: "Feb", direct: 3000, partners: 2200 },
  { month: "Mar", direct: 4500, partners: 2600 },
  { month: "Apr", direct: 4000, partners: 2800 },
  { month: "May", direct: 5500, partners: 3200 },
  { month: "Jun", direct: 4800, partners: 3000 },
  { month: "Jul", direct: 6500, partners: 3800 },
  { month: "Aug", direct: 6200, partners: 3600 },
  { month: "Sep", direct: 7500, partners: 4200 },
  { month: "Oct", direct: 7000, partners: 4000 },
  { month: "Nov", direct: 8200, partners: 4800 },
];

// Mock Data for the Activity Log (Matching your screenshot)
const activityLogs = [
  {
    id: 1,
    action: "Security Audit Passed",
    time: "2 mins ago",
    status: "Success",
  },
  {
    id: 2,
    action: "New Enterprise Channel Connected",
    time: "15 mins ago",
    status: "Info",
  },
  {
    id: 3,
    action: "System backup completed",
    time: "1 hour ago",
    status: "Success",
  },
  {
    id: 4,
    action: "API Rate Limit exceeded for User Service",
    time: "2 hours ago",
    status: "Warning",
  },
  {
    id: 5,
    action: "New user registered via Azure AD",
    time: "3 hours ago",
    status: "Info",
  },
];

export default function Dashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Analytics Overview
      </h1>

      {/* Stat Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Card 1: Total Users */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Users</p>
              <h2 className="text-3xl font-bold text-gray-800">1,429,203</h2>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg">
              <Users className="text-blue-600" size={24} />
            </div>
          </div>
          <p className="text-sm text-green-600 font-medium flex items-center gap-1">
            <TrendingUp size={14} />
            +12% Increase
          </p>
        </div>

        {/* Card 2: Active Connections */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Active Connections</p>
              <h2 className="text-3xl font-bold text-gray-800">842,091</h2>
            </div>
            <div className="p-2 bg-purple-50 rounded-lg">
              <Activity className="text-purple-600" size={24} />
            </div>
          </div>
          <p className="text-sm text-gray-500 font-medium">Stable</p>
        </div>

        {/* Card 3: Pending Registrations */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">
                Pending Registrations
              </p>
              <h2 className="text-3xl font-bold text-gray-800">1,244</h2>
            </div>
            <div className="p-2 bg-orange-50 rounded-lg">
              <UserPlus className="text-orange-600" size={24} />
            </div>
          </div>
          <p className="text-sm text-gray-500 font-medium">
            2.4h avg wait time
          </p>
        </div>
      </div>

      {/* Charts & Activity Row (Using Flexbox for exact 37px gap) */}
      <div className="flex flex-col lg:flex-row gap-[37px] mb-8">
        {/* Recent Activity Log */}
        <div className="w-full lg:w-[614px] h-[383px] bg-[#FFFFFF] rounded-[12px] border border-[#C2C6D4] shadow-[0px_1px_2px_0px_#0000000D] p-6 overflow-y-auto">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Recent Activity Log
          </h3>
          <div className="space-y-4">
            {activityLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0 last:pb-0"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      log.status === "Success"
                        ? "bg-green-500"
                        : log.status === "Warning"
                          ? "bg-yellow-500"
                          : "bg-blue-500"
                    }`}
                  ></span>
                  <p className="text-sm font-medium text-gray-800">
                    {log.action}
                  </p>
                </div>
                <p className="text-xs text-gray-400 whitespace-nowrap ml-4">
                  {log.time}
                </p>
              </div>
            ))}
          </div>
        </div>
        {/* User Growth Trends */}
        <div className="w-full lg:w-[553px] h-[300px] bg-[#FFFFFF] rounded-[12px] border border-[#C2C6D4] shadow-[0px_1px_2px_0px_#0000000D] pt-[20px] pr-[24px] pb-[20px] pl-[24px]">
          {/* Heading updated with exact font size, weight, tracking, and color */}
          <h3
            className="text-[14px] font-semibold uppercase tracking-[0.7px] leading-[16px] mb-4"
            style={{ color: "#181C20", fontFamily: "Inter, sans-serif" }}
          >
            User Growth Trends
          </h3>

          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={growthData}
                margin={{ top: 5, right: 16, bottom: 5, left: 16 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f0f0f0"
                  vertical={false}
                />
                {/* XAxis updated to match spacing and hidden ticks */}
                <XAxis
                  dataKey="month"
                  stroke="#9ca3af"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />
                {/* YAxis is hidden in the Figma design */}
                <YAxis hide={true} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                    fontSize: "12px",
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }}
                />

                {/* Direct (Blue) Line - Solid, 4px width, #0077FF */}
                <Line
                  type="monotone"
                  dataKey="direct"
                  stroke="#0077FF"
                  strokeWidth={4}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
                {/* Partners (Green) Line - Dashed (8 4), 4px width, #02FF85 */}
                <Line
                  type="monotone"
                  dataKey="partners"
                  stroke="#02FF85"
                  strokeWidth={4}
                  strokeDasharray="8 4"
                  dot={false}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
