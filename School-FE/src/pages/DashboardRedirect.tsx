import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function DashboardRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role?.toUpperCase() === "ADMIN") return <Navigate to="/dashboard" replace />;
  if (user.role?.toUpperCase() === "TEACHER") return <Navigate to="/my-courses" replace />;
  return <Navigate to="/student-dashboard" replace />;
}
