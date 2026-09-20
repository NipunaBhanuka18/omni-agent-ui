// src/pages/dashboard/Dashboard.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Activity,
  UserPlus,
  TrendingUp,
  Calendar,
  Download,
  Sparkles,
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
  { name: "WhatsApp", value: 45, color: "#10b981" },
  { name: "Email", value: 30, color: "#6366f1" },
  { name: "Messenger", value: 15, color: "#3b82f6" },
  { name: "Other", value: 10, color: "#ec4899" },
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
  const navigate = useNavigate();
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
    <div className="h-full flex flex-col space-y-6">
      {/* Top Gradient Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white p-6 rounded-3xl border border-indigo-500/20 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-1 text-cyan-400">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Company Workspace Analytics</span>
          </div>
          <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-cyan-200">
            Analytics Overview
          </h1>
          <p className="text-xs text-slate-300 mt-1">Real-time user growth, active channels, and security metrics.</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {/* Connection Status Pill */}
          <div className="py-2 px-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 shadow-sm backdrop-blur-md">
            <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse"></span>
            Connection: Active & Optimal
          </div>

          {/* Date & Export Buttons */}
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 h-10 px-4 border border-indigo-500/30 bg-slate-900/80 rounded-xl text-xs font-bold text-slate-200 hover:bg-slate-800 transition-all cursor-pointer">
              <Calendar size={14} className="text-cyan-400" />
              Last 30 Days
            </button>
            <button className="flex items-center gap-2 h-10 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl text-xs font-bold text-white shadow-md transition-all cursor-pointer">
              <Download size={14} />
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
            <div className="bg-slate-900/80 backdrop-blur-md p-5 rounded-3xl border border-indigo-500/20 shadow-xl hover:border-indigo-400/40 transition-all">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-1">Total Users</p>
                  <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-pink-400">
                    {metrics.totalUsers || "1,429,203"}
                  </h2>
                </div>
                <div className="p-3 bg-indigo-500/10 rounded-2xl text-cyan-400 border border-indigo-500/20">
                  <Users size={20} />
                </div>
              </div>
              <p className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                <TrendingUp size={12} /> +12% Increase
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-slate-900/80 backdrop-blur-md p-5 rounded-3xl border border-indigo-500/20 shadow-xl hover:border-indigo-400/40 transition-all">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-1">
                    Active Connections
                  </p>
                  <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                    {metrics.activeConnections || "842,091"}
                  </h2>
                </div>
                <div className="p-3 bg-purple-500/10 rounded-2xl text-purple-400 border border-purple-500/20">
                  <Activity size={20} />
                </div>
              </div>
              <p className="text-xs text-slate-400 font-medium">Stable</p>
            </div>

            {/* Card 3 */}
            <div className="bg-slate-900/80 backdrop-blur-md p-5 rounded-3xl border border-indigo-500/20 shadow-xl hover:border-indigo-400/40 transition-all">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-1">Pending Reg.</p>
                  <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">1,244</h2>
                </div>
                <div className="p-3 bg-cyan-500/10 rounded-2xl text-cyan-400 border border-cyan-500/20">
                  <UserPlus size={20} />
                </div>
              </div>
              <p className="text-xs text-slate-400 font-medium">2.4h avg wait</p>
            </div>
          </div>

          {/* Recent Activity Log */}
          <div className="bg-slate-900/80 backdrop-blur-md p-6 rounded-3xl border border-indigo-500/20 shadow-xl flex flex-col flex-1 min-h-0">
            <h3 className="text-xs font-extrabold text-cyan-400 uppercase tracking-wider mb-4 shrink-0">
              Recent Activity Log
            </h3>
            <div className="space-y-4 overflow-y-auto pr-2 no-scrollbar">
              {activityLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between border-b border-indigo-500/10 pb-3 last:border-0 last:pb-0"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        log.status === "Success"
                          ? "bg-emerald-400 shadow-sm shadow-emerald-400/50"
                          : log.status === "Warning"
                            ? "bg-amber-400 shadow-sm shadow-amber-400/50"
                            : "bg-cyan-400 shadow-sm shadow-cyan-400/50"
                      }`}
                    ></span>
                    <p className="text-xs font-bold text-slate-200">
                      {log.action}
                    </p>
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold whitespace-nowrap ml-4">
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
          <div className="bg-slate-900/80 backdrop-blur-md p-6 rounded-3xl border border-indigo-500/20 shadow-xl shrink-0">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xs font-extrabold text-cyan-400 uppercase tracking-wider">
                Channel Distribution
              </h3>
              <span className="text-xs font-bold text-indigo-300">
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
                      backgroundColor: "#0f172a",
                      borderRadius: "12px",
                      border: "1px solid rgba(99, 102, 241, 0.3)",
                      color: "#f8fafc",
                      fontSize: "12px",
                      fontWeight: "bold",
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
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: chan.color }}
                  ></span>
                  <span className="text-slate-300 font-medium">{chan.name}</span>
                  <span className="text-white ml-auto font-black">
                    {chan.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* User Growth Trends Line Chart */}
          <div className="bg-slate-900/80 backdrop-blur-md p-6 rounded-3xl border border-indigo-500/20 shadow-xl flex flex-col flex-1 min-h-0">
            <h3 className="text-xs font-extrabold text-cyan-400 uppercase tracking-wider mb-4 shrink-0">
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
                    stroke="rgba(99, 102, 241, 0.15)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    stroke="#94a3b8"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis hide={true} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderRadius: "12px",
                      border: "1px solid rgba(99, 102, 241, 0.3)",
                      color: "#f8fafc",
                      fontSize: "12px",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "11px", fontWeight: "bold", color: "#cbd5e1" }} />
                  <Line
                    type="monotone"
                    dataKey="direct"
                    stroke="#38bdf8"
                    strokeWidth={3}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="partners"
                    stroke="#34d399"
                    strokeWidth={3}
                    strokeDasharray="5 3"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Channels Box */}
          <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 border border-emerald-500/30 rounded-3xl p-4 flex flex-col justify-center shrink-0 shadow-lg">
            <p className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider mb-2">
              Active Gateway Channels
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              <div
                onClick={() => navigate('/admin/channels?channel=whatsapp')}
                className="flex items-center gap-2 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-emerald-500/30 cursor-pointer hover:border-emerald-400 hover:shadow-md transition-all"
                title="Manage WhatsApp Gateway"
              >
                <img src={whatsappIcon} alt="WhatsApp" className="w-4 h-4" />
                <span className="text-xs font-bold text-emerald-300">
                  WhatsApp
                </span>
              </div>
              <div
                onClick={() => navigate('/admin/channels?channel=messenger')}
                className="flex items-center gap-2 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-blue-500/30 cursor-pointer hover:border-blue-400 hover:shadow-md transition-all"
                title="Manage Messenger Gateway"
              >
                <img src={messengerIcon} alt="Messenger" className="w-4 h-4" />
                <span className="text-xs font-bold text-blue-300">
                  Messenger
                </span>
              </div>
              <div
                onClick={() => navigate('/admin/channels?channel=sms')}
                className="flex items-center gap-2 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-purple-500/30 cursor-pointer hover:border-purple-400 hover:shadow-md transition-all"
                title="Manage SMS Gateway"
              >
                <img src={smsIcon} alt="SMS" className="w-4 h-4" />
                <span className="text-xs font-bold text-purple-300">SMS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
