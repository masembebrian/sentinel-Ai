import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import { MODULES } from "./modules/registry";
import { AppShell } from "./components/layout/AppShell";
import { AuthProvider, useAuthContext } from "./components/auth/AuthContext";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ModuleStubPage } from "./pages/ModuleStubPage";
import { NotFoundPage } from "./pages/NotFoundPage";

/**
 * Route guard: unauthenticated users are redirected to /login;
 * authenticated users on /login are redirected to /dashboard.
 */
function ProtectedRoute() {
  const { user, loading } = useAuthContext();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mx-auto mb-4 size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="font-mono text-sm text-muted">Establishing secure channel&hellip;</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

/**
 * Redirect authenticated users away from /login.
 */
function PublicRoute() {
  const { user, loading } = useAuthContext();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="mx-auto size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<LoginPage />} />
            </Route>
            <Route element={<ProtectedRoute />}>
              <Route element={<AppShell />}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                {MODULES.filter((m) => m.route !== "/dashboard").map((m) => (
                  <Route
                    key={m.id}
                    path={m.route}
                    element={<ModuleStubPage module={m} />}
                  />
                ))}
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </MotionConfig>
  );
}