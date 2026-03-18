import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import type { Role } from "@/types";

export function ProtectedRoute({ roles }: { roles?: Role[] }) {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (roles && user && !roles.map((r) => r.toUpperCase()).includes(user.role?.toUpperCase())) {
    const role = user.role?.toUpperCase();
    if (role === "Student") return <Navigate to="/student-dashboard" replace />;
    if (role === "TEACHER") return <Navigate to="/my-courses" replace />;
    return <Navigate to="/dashboard" replace />;
  }
  return <Outlet />;
}
