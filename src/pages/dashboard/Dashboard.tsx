// src/pages/dashboard/Dashboard.tsx
import React from "react";
import {
  Users,
  Activity,
  UserPlus,
  TrendingUp,
  Calendar,
  Download,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Fixed paths to go up two folders
import whatsappIcon from "../../assets/whatsapp.svg";
import messengerIcon from "../../assets/messenger.svg";
import smsIcon from "../../assets/sms.svg";

// Mock Data for the Line Chart
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

// Mock Data for the Pie Chart
const channelData = [
  { name: "WhatsApp", value: 45, color: "#25D366" },
  { name: "Email", value: 30, color: "#4285F4" },
  { name: "Messenger", value: 15, color: "#0084FF" },
  { name: "Other", value: 10, color: "#FFBB28" },
];

// Mock Data for the Activity Log
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

import { apiClient } from "@/api/apiClient";

export default function Dashboard() {
  const [metrics, setMetrics] = React.useState<any>({
    totalUsers: "1,429,203",
    activeConnections: "842,091",
    csatScore: "4.8 / 5.0",
    missedHandoffs: "2",
  });

  React.useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await apiClient.get('/tenants/metrics');
        if (data && data.metrics) {
          setMetrics(data.metrics);
        }
      } catch (e) {
        // use default mock metrics
      }
    };
    fetchMetrics();
  }, []);

  return (
    <div className="h-full flex flex-col">
      {/* Top Header & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 shrink-0">
        <h1 className="text-2xl font-bold text-gray-800">Analytics Overview</h1>

        <div className="flex flex-wrap items-center gap-4">
          {/* Connection Status Pill */}
          <div
            className="h-[28px] rounded-full py-[6px] px-[12px] flex items-center gap-[8px] text-xs font-semibold text-green-900"
            style={{ backgroundColor: "#83FC8E" }}
          >
            <span className="w-2 h-2 bg-green-700 rounded-full"></span>
            Connection: Active & Optimal
          </div>

          {/* Date & Export Buttons */}
          <div className="flex items-center gap-[12px]">
            <button className="flex items-center gap-2 h-[42px] px-4 border border-gray-200 bg-white rounded-lg text-sm text-gray-600 hover:bg-gray-50">
              <Calendar size={16} className="text-gray-400" />
              Last 30 Days
            </button>
            <button className="flex items-center gap-2 h-[42px] px-4 bg-blue-600 rounded-lg text-sm text-white hover:bg-blue-700">
              <Download size={16} />
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Left Column (Stat Cards + Activity Log) */}
        <div className="lg:col-span-2 flex flex-col gap-6 min-h-0">
          {/* Stat Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 shrink-0">
            {/* Card 1 */}
            <div className="bg-white p-5 rounded-[12px] border border-[#C2C6D4] shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Total Users</p>
                  <h2 className="text-2xl font-bold text-gray-800">
                    1,429,203
                  </h2>
                </div>
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Users className="text-blue-600" size={20} />
                </div>
              </div>
              <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                <TrendingUp size={12} /> +12% Increase
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-5 rounded-[12px] border border-[#C2C6D4] shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">
                    Active Connections
                  </p>
                  <h2 className="text-2xl font-bold text-gray-800">842,091</h2>
                </div>
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Activity className="text-purple-600" size={20} />
                </div>
              </div>
              <p className="text-xs text-gray-500 font-medium">Stable</p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-5 rounded-[12px] border border-[#C2C6D4] shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Pending Reg.</p>
                  <h2 className="text-2xl font-bold text-gray-800">1,244</h2>
                </div>
                <div className="p-2 bg-orange-50 rounded-lg">
                  <UserPlus className="text-orange-600" size={20} />
                </div>
              </div>
              <p className="text-xs text-gray-500 font-medium">2.4h avg wait</p>
            </div>
          </div>

          {/* Recent Activity Log (Takes remaining vertical space) */}
          <div className="bg-white p-6 rounded-[12px] border border-[#C2C6D4] shadow-sm flex flex-col flex-1 min-h-0">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 shrink-0">
              Recent Activity Log
            </h3>
            <div className="space-y-4 overflow-y-auto pr-2">
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
        </div>

        {/* Right Column (Pie Chart + Line Chart + Channels) */}
        <div className="flex flex-col gap-6 min-h-0">
          {/* Channel Distribution Pie Chart */}
          <div className="bg-white p-6 rounded-[12px] border border-[#C2C6D4] shadow-sm shrink-0">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                Channel Distribution
              </h3>
              <span className="text-xs font-bold text-gray-400">
                Total: 12.4k
              </span>
            </div>
            <div className="h-[140px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={channelData}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={50}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {channelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #e5e7eb",
                      fontSize: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Custom Legend */}
            <div className="grid grid-cols-2 gap-2 mt-2">
              {channelData.map((chan) => (
                <div
                  key={chan.name}
                  className="flex items-center gap-2 text-xs"
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: chan.color }}
                  ></span>
                  <span className="text-gray-600">{chan.name}</span>
                  <span className="text-gray-400 ml-auto font-medium">
                    {chan.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* User Growth Trends Line Chart (Takes remaining vertical space) */}
          <div className="bg-white p-6 rounded-[12px] border border-[#C2C6D4] shadow-sm flex flex-col flex-1 min-h-0">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 shrink-0">
              User Growth Trends
            </h3>
            <div className="flex-1 w-full min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={growthData}
                  margin={{ top: 5, right: 10, bottom: 5, left: -20 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f0f0f0"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    stroke="#9ca3af"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis hide={true} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #e5e7eb",
                      fontSize: "12px",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "11px" }} />
                  <Line
                    type="monotone"
                    dataKey="direct"
                    stroke="#0077FF"
                    strokeWidth={3}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="partners"
                    stroke="#02FF85"
                    strokeWidth={3}
                    strokeDasharray="5 3"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Channels Box with Green Border */}
          <div
            className="border rounded-lg p-3 flex flex-col justify-center bg-white shrink-0"
            style={{ borderColor: "#34A853", borderWidth: "1px" }}
          >
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Active Channels
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 bg-green-50 px-2 py-1 rounded-md">
                <img src={whatsappIcon} alt="WhatsApp" className="w-4 h-4" />
                <span className="text-xs font-medium text-green-700">
                  WhatsApp
                </span>
              </div>
              <div className="flex items-center gap-1.5 bg-blue-50 px-2 py-1 rounded-md">
                <img src={messengerIcon} alt="Messenger" className="w-4 h-4" />
                <span className="text-xs font-medium text-blue-700">
                  Messenger
                </span>
              </div>
              <div className="flex items-center gap-1.5 bg-purple-50 px-2 py-1 rounded-md">
                <img src={smsIcon} alt="SMS" className="w-4 h-4" />
                <span className="text-xs font-medium text-purple-700">SMS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
