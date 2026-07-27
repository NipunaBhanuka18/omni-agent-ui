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
import AdminLayout from "@/layouts/AdminLayout"; // Importing your layout!
import Dashboard from "@/pages/dashboard/Dashboard"; // Importing your dashboard!
import { useAuthStore } from "@/store/authStore";
import {
  LayoutGrid,
  Users,
  Settings,
  LogOut,
  Bell,
  Search,
  HelpCircle,
} from "lucide-react";

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
          <Route path="/login" element={<Login />} />
          <Route path="/login-admin" element={<LoginAdmin />} />
          <Route path="/login-portal" element={<LoginAdminPortal />} />
        </Route>

        {/* Protected Routes (Can only see if logged IN) */}
        <Route element={<ProtectedRoute />}>
          {/* AdminLayout wraps ALL the admin pages */}
          <Route element={<AdminLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Placeholder routes for now so the sidebar links work! */}
            <Route
              path="/users"
              element={
                <div className="p-8 text-2xl font-bold">
                  User Management Page Coming Soon...
                </div>
              }
            />
            <Route
              path="/settings"
              element={
                <div className="p-8 text-2xl font-bold">
                  Settings Page Coming Soon...
                </div>
              }
            />
          </Route>
        </Route>

        {/* Default route redirect based on auth status */}
        <Route
          path="*"
          element={
            <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
