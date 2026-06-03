import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { User, Role } from "@/types";
import ApiService from "@/api/ApiService";
import { toast } from "sonner";

function getRoleFromToken(token: string | null): string | null {
  try {
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1]));
    const raw = payload.role || payload.roles?.[0] || payload.authorities?.[0]?.authority || payload.authorities?.[0] || null;
    return raw ? String(raw).toUpperCase().replace(/^ROLE_/, "") : null;
  } catch {
    return null;
  }
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<string>;
  register: (payload: object, role: "ADMIN" | "STUDENT") => Promise<void>;
  logout: () => void;
  hasRole: (role: Role | Role[]) => boolean;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token")
  );

  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) return JSON.parse(savedUser);
    const savedToken = localStorage.getItem("token");
    const roleFromToken = getRoleFromToken(savedToken);
    if (savedToken && roleFromToken) {
      return { email: "", role: roleFromToken, name: "" } as User;
    }
    return null;
  });

  /* LOGIN */
  const login = useCallback(
    async (email: string, password: string): Promise<string> => {
      const res = await ApiService.post("/api/users/login", { email, password });

      const authToken = res.data.accessToken || res.data.token || res.data.jwtToken;
      if (!authToken) throw new Error("Token not received from server");

      let role = (res.data.role || "").toUpperCase();
      if (!role) role = getRoleFromToken(authToken) || "";
      role = role.replace(/^ROLE_/, "");

      // set token in localStorage first so next API call is authenticated
      localStorage.setItem("token", authToken);

      // try to get studentId from login response first
      let resolvedId: number = res.data.studentId || res.data.userId || res.data.id || 0;

      // if no ID in login response, fetch studentId from /api/students/me
      if (!resolvedId && role === "STUDENT") {
        try {
          const meRes = await ApiService.get("/api/students/me");
          if (meRes.data?.studentId) {
            resolvedId = meRes.data.studentId;
          }
        } catch {
          resolvedId = Number(localStorage.getItem(`studentId_${email}`)) || 0;
        }
      }

      const userData: User = {
        id: resolvedId,
        email: res.data.email || email,
        role: role as Role,
        name: res.data.name || email,
      };

      localStorage.setItem("user", JSON.stringify(userData));
      setToken(authToken);
      setUser(userData);

      toast.success(`Welcome back, ${userData.email}!`);
      return role;
    },
    []
  );

  /* REGISTER */
  const register = useCallback(
    async (payload: object, role: "ADMIN" | "STUDENT") => {
      const endpoint = role === "ADMIN" ? "/api/users/register" : "/api/students/register";
      const res = await ApiService.post(endpoint, payload);

      const authToken = res.data.accessToken || res.data.token || res.data.jwtToken;

      let roleValue = (res.data.role || "").toUpperCase();
      if (!roleValue) roleValue = getRoleFromToken(authToken) || "";
      roleValue = roleValue.replace(/^ROLE_/, "");

      let resolvedId = res.data.studentId || res.data.userId || res.data.id || 0;

      // if not in register response, fetch from /api/students/me
      if (!resolvedId && roleValue === "STUDENT") {
        try {
          const meRes = await ApiService.get("/api/students/me");
          if (meRes.data?.studentId) resolvedId = meRes.data.studentId;
        } catch {}
      }

      const userData: User = {
        id: resolvedId,
        email: res.data.email || "",
        role: roleValue as Role,
        name: res.data.name || "",
      };

      if (resolvedId) localStorage.setItem(`studentId_${userData.email}`, String(resolvedId));

      localStorage.setItem("token", authToken);
      localStorage.setItem("user", JSON.stringify(userData));
      setToken(authToken);
      setUser(userData);

      toast.success("Registration successful!");
    },
    []
  );

  /* LOGOUT */
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    toast.info("Logged out successfully");
  }, []);

  /* ROLE CHECK */
  const hasRole = useCallback(
    (role: Role | Role[]) => {
      if (!user) return false;
      return Array.isArray(role) ? role.includes(user.role) : user.role === role;
    },
    [user]
  );

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated: !!user && !!token, login, register, logout, hasRole }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
