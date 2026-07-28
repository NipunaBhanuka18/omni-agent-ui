import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import Login from "@/pages/auth/Login";
import LoginAdmin from "@/pages/auth/LoginAdmin";
import LoginAdminPortal from "@/pages/auth/LoginAdminPortal";
import ForgetPassword from "@/pages/auth/ForgetPassword";
import StartPage from "@/pages/auth/StartPage";
import AdminLayout from "@/layouts/AdminLayout";
import Dashboard from "@/pages/dashboard/Dashboard";
import UserManagement from "@/pages/users/UserManagement";
import Settings from "@/pages/settings/Settings";
import Api from "@/pages/api/Api";
import Channels from "@/pages/channels/Channels";
import Agents from "@/pages/agents/Agents";
import Notifications from "@/pages/notifications/Notifications";
import { useAuthStore } from "@/store/authStore";

// Protected Route component: Redirects unauthenticated users to /login
const ProtectedRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

// Public Route component: Redirects authenticated users away from auth pages to /dashboard
const PublicRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public/Guest Routes (Can only see if logged OUT) */}
        <Route element={<PublicRoute />}>
          <Route path="/" element={<StartPage />} />
          <Route path="/start" element={<StartPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/login-admin" element={<LoginAdmin />} />
          <Route path="/login-portal" element={<LoginAdminPortal />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
        </Route>

        {/* Protected Routes (Can only see if logged IN) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            {/* Existing Pages */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/settings" element={<Settings />} />

            {/* New Pages */}
            <Route path="/api" element={<Api />} />
            <Route path="/channels" element={<Channels />} />
            <Route path="/agents" element={<Agents />} />
            <Route path="/notifications" element={<Notifications />} />
          </Route>
        </Route>

        {/* Default route redirect based on auth status */}
        <Route
          path="*"
          element={
            <Navigate to={isAuthenticated ? "/dashboard" : "/"} replace />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
