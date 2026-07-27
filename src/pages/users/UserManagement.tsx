// src/pages/users/UserManagement.tsx
import React from "react";
import { Users, Activity, Clock, ShieldCheck } from "lucide-react";

const userData = [
  {
    id: 1,
    name: "Amlia Silva",
    email: "amlia.silva@slt.lk",
    role: "Administrator",
    status: "ACTIVE",
    lastLogin: "2 hours ago",
  },
  {
    id: 2,
    name: "Kasun Perera",
    email: "kasun.perera@slt.lk",
    role: "Internal Employee",
    status: "ACTIVE",
    lastLogin: "Yesterday, 14:20",
  },
  {
    id: 3,
    name: "Nimal Mendis",
    email: "nimal.mendis@slt.lk",
    role: "External Customer",
    status: "SUSPENDED",
    lastLogin: "12 days ago",
  },
];

export default function UserManagement() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">User Management</h1>

      {/* Active Users Table Card */}
      <div className="bg-white rounded-[12px] border border-[#C2C6D4] shadow-[0px_1px_2px_0px_#0000000D] overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            Active Users
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {userData.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-sm font-bold text-slate-600">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {user.role}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.status === "ACTIVE"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {user.lastLogin}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Statistics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-[12px] border border-[#C2C6D4] shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-blue-50 rounded-lg">
              <Users className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Users</p>
              <p className="text-xl font-bold text-gray-800">1,248</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[12px] border border-[#C2C6D4] shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-green-50 rounded-lg">
              <Activity className="text-green-600" size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Online Now</p>
              <p className="text-xl font-bold text-gray-800">42</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[12px] border border-[#C2C6D4] shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-orange-50 rounded-lg">
              <Clock className="text-orange-600" size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Avg Approval</p>
              <p className="text-xl font-bold text-gray-800">14h</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[12px] border border-[#C2C6D4] shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-purple-50 rounded-lg">
              <ShieldCheck className="text-purple-600" size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Security</p>
              <p className="text-xl font-bold text-gray-800">Optimal</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
