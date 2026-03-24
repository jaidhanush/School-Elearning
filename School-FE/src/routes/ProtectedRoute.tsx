import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import type { Role } from "@/types";

const roleHome: Record<string, string> = {
  ADMIN: "/dashboard",
  TEACHER: "/my-courses",
  STUDENT: "/student-dashboard",
};

export function ProtectedRoute({ roles }: { roles?: Role[] }) {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  const userRole = user?.role?.toUpperCase() ?? "";
  if (roles && !roles.map((r) => r.toUpperCase()).includes(userRole)) {
    return <Navigate to={roleHome[userRole] ?? "/login"} replace />;
  }
  return <Outlet />;
}
