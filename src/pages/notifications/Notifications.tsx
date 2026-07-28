// src/pages/notifications/Notifications.tsx
import React from "react";
import { User, Users, ArrowRight } from "lucide-react";

export default function Notifications() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Notification Management System
        </h1>
        <p className="text-gray-500">
          Please select a customer category to continue
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        {/* Internal Employee */}
        <div className="bg-white p-8 rounded-[16px] border border-[#C2C6D4] shadow-sm flex flex-col items-center text-center hover:border-blue-500 transition-colors cursor-pointer">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
            <User size={32} className="text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Internal Employee
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            Send notifications to SLT staff, administrators, and internal
            stakeholders.
          </p>
          <button className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
            Continue <ArrowRight size={16} />
          </button>
        </div>

        {/* External Customer */}
        <div className="bg-white p-8 rounded-[16px] border border-[#C2C6D4] shadow-sm flex flex-col items-center text-center hover:border-green-500 transition-colors cursor-pointer">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
            <Users size={32} className="text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            External Customer
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            Send notifications to SLT customers regarding billing, outages, and
            services.
          </p>
          <button className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700">
            Continue <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
