import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

// Layouts
import PublicLayout from "@/layouts/PublicLayout";
import AdminLayout from "@/layouts/AdminLayout";

// Public Pages
import HomePage from "@/pages/public/HomePage";
import TermsPage from "@/pages/public/TermsPage";
import PrivacyPage from "@/pages/public/PrivacyPage";
import AboutPage from "@/pages/public/AboutPage";
import PricingPage from "@/pages/public/PricingPage";
import FaqPage from "@/pages/public/FaqPage";
import ContactPage from "@/pages/public/ContactPage";

// Checkout Pages
import CheckoutPage from "@/pages/public/CheckoutPage";
import PaymentSuccessPage from "@/pages/public/PaymentSuccessPage";

// Onboarding Setup Pages
import CompanyOnboardingPlanPage from "@/pages/onboarding/CompanyOnboardingPlanPage";
import CompanySetupPage1 from "@/pages/onboarding/CompanySetupPage1";
import CompanySetupPage2 from "@/pages/onboarding/CompanySetupPage2";

// Auth Pages
import Login from "@/pages/auth/Login";
import LoginAdmin from "@/pages/auth/LoginAdmin";
import Register from "@/pages/auth/Register";
import RegisterAdmin from "@/pages/auth/RegisterAdmin";
import RegisterRequestSuccess from "@/pages/auth/RegisterRequestSuccess";
import ForgetPassword from "@/pages/auth/ForgetPassword";

// Dashboard Pages (Company Workplace)
import Dashboard from "@/pages/dashboard/Dashboard";
import UserManagement from "@/pages/users/UserManagement";
import Settings from "@/pages/settings/Settings";
import Api from "@/pages/api/Api";
import Channels from "@/pages/channels/Channels";
import Agents from "@/pages/agents/Agents";
import Notifications from "@/pages/notifications/Notifications";
import ChatBotPlayground from "@/pages/agents/ChatBotPlayground";
import LiveAgentConsole from "@/pages/agent/LiveAgentConsole";
import HostedChatWidget from "@/pages/public/HostedChatWidget";

// Dashboard Pages (Super Admin Workplace)
import SuperAdminDashboard from "@/pages/superadmin/SuperAdminDashboard";
import OrganizationManagement from "@/pages/superadmin/OrganizationManagement";
import SubscriptionPackages from "@/pages/superadmin/SubscriptionPackages";

import { useAuthStore } from "@/store/authStore";

// Protected Route component
const ProtectedRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Website Routes (Wrapped with PublicLayout) */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/contact" element={<ContactPage />} />
          
          {/* Checkout Flow */}
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/checkout/success" element={<PaymentSuccessPage />} />
        </Route>

        {/* Top-Level Direct Access ChatBot Routes */}
        <Route path="/chat" element={<ChatBotPlayground />} />
        <Route path="/chatbot" element={<ChatBotPlayground />} />
        <Route path="/chat/:companySlug/:agentSlug" element={<HostedChatWidget />} />

        {/* Company Onboarding Setup Screens */}
        <Route path="/onboarding/plan" element={<CompanyOnboardingPlanPage />} />
        <Route path="/onboarding/company-details" element={<CompanySetupPage1 />} />
        <Route path="/onboarding/channels" element={<CompanySetupPage2 />} />

        {/* Auth & Registration Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/login-admin" element={<LoginAdmin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register-admin" element={<RegisterAdmin />} />
        <Route path="/register-success" element={<RegisterRequestSuccess />} />
        <Route path="/forget-password" element={<ForgetPassword />} />

        {/* Protected Dashboard Routes (Company Workplace & Super Admin Workplace) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            {/* Company Workplace */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/agent/console" element={<LiveAgentConsole />} />
            <Route path="/live-agent" element={<LiveAgentConsole />} />
            <Route path="/chat" element={<ChatBotPlayground />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/api" element={<Api />} />
            <Route path="/channels" element={<Channels />} />
            <Route path="/agents" element={<Agents />} />
            <Route path="/notifications" element={<Notifications />} />

            {/* Super Admin Workplace */}
            <Route path="/admin/dashboard" element={<SuperAdminDashboard />} />
            <Route path="/admin/chat" element={<ChatBotPlayground />} />
            <Route path="/admin/organizations" element={<OrganizationManagement />} />
            <Route path="/admin/packages" element={<SubscriptionPackages />} />
            <Route path="/admin/api" element={<Api />} />
            <Route path="/admin/channels" element={<Channels />} />
            <Route path="/admin/agents" element={<Agents />} />
            <Route path="/admin/notifications" element={<Notifications />} />
            <Route path="/admin/settings" element={<Settings />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
