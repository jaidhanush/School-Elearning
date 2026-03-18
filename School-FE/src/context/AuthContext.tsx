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

/* -----------------------------
   Helper: Extract role from JWT
------------------------------*/
function getRoleFromToken(token: string | null): string | null {
  try {
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role || null;
  } catch (e) {
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
  /* -----------------------------
     Load from localStorage
  ------------------------------*/
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token")
  );

  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");

    if (savedUser) return JSON.parse(savedUser);

    // ✅ fallback: build user from token if exists
    const roleFromToken = getRoleFromToken(savedToken);
    if (savedToken && roleFromToken) {
      return {
        email: "",
        role: roleFromToken,
        name: "",
      } as User;
    }

    return null;
  });

  /* -----------------------------
     LOGIN
  ------------------------------*/
  const login = useCallback(
    async (email: string, password: string): Promise<string> => {
      const res = await ApiService.post("/api/users/login", {
        email,
        password,
      });

      console.log("LOGIN FULL RESPONSE:", JSON.stringify(res.data));

      // ✅ token extraction
      const authToken =
        res.data.accessToken || res.data.token || res.data.jwtToken;

      if (!authToken) {
        throw new Error("Token not received from server");
      }

      // ✅ role extraction (priority: backend → token fallback)
      let role = (res.data.role || "").toUpperCase();

      if (!role) {
        role = getRoleFromToken(authToken) || "";
      }

      // ✅ user object
      const userData: User = {
        email: res.data.email || email,
        role: role as Role,
        name: res.data.name || email,
      };

      // ✅ store
      localStorage.setItem("token", authToken);
      localStorage.setItem("user", JSON.stringify(userData));

      setToken(authToken);
      setUser(userData);

      toast.success(`Welcome back, ${userData.email}!`);

      return role;
    },
    []
  );

  /* -----------------------------
     REGISTER
  ------------------------------*/
  const register = useCallback(
    async (payload: object, role: "ADMIN" | "STUDENT") => {
      const endpoint =
        role === "ADMIN" ? "/api/users/register" : "/api/students/register";

      const res = await ApiService.post(endpoint, payload);

      const authToken =
        res.data.accessToken || res.data.token || res.data.jwtToken;

      let roleValue = (res.data.role || "").toUpperCase();

      if (!roleValue) {
        roleValue = getRoleFromToken(authToken) || "";
      }

      const userData: User = {
        email: res.data.email || "",
        role: roleValue as Role,
        name: res.data.name || "",
      };

      localStorage.setItem("token", authToken);
      localStorage.setItem("user", JSON.stringify(userData));

      setToken(authToken);
      setUser(userData);

      toast.success("Registration successful!");
    },
    []
  );

  /* -----------------------------
     LOGOUT
  ------------------------------*/
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    toast.info("Logged out successfully");
  }, []);

  /* -----------------------------
     ROLE CHECK
  ------------------------------*/
  const hasRole = useCallback(
    (role: Role | Role[]) => {
      if (!user) return false;
      return Array.isArray(role)
        ? role.includes(user.role)
        : user.role === role;
    },
    [user]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* -----------------------------
   HOOK
------------------------------*/
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
