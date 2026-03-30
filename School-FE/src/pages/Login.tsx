import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Mail, Lock, X, Eye, EyeOff } from "lucide-react";
import LandingPage from "@/pages/LandingPage";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const role = await login(email, password);
      if (role === "STUDENT") navigate("/student-dashboard");
      else if (role === "TEACHER") navigate("/my-courses");
      else navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Landing page as background */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        <LandingPage />
      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Modal centered */}
      <div className="relative flex h-full w-full items-center justify-center">
        <div className="w-[420px] rounded-2xl overflow-hidden shadow-2xl bg-white/10 backdrop-blur-md border border-white/20">

          {/* Gradient header */}
          <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 px-8 pt-8 pb-8">
            <button
              onClick={() => navigate(-1)}
              className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition"
            >
              <X size={14} className="text-white" />
            </button>
            <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
            <p className="text-sm text-blue-100 mt-1">Sign in to continue your learning journey</p>
          </div>

          {/* Form body */}
          <div className="px-8 py-7 bg-white">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50 px-3 focus-within:ring-2 focus-within:ring-blue-400 transition">
                  <Mail size={16} className="text-blue-500 shrink-0" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-transparent px-3 py-3 text-sm text-gray-700 outline-none placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50 px-3 focus-within:ring-2 focus-within:ring-blue-400 transition">
                  <Lock size={16} className="text-blue-500 shrink-0" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-transparent px-3 py-3 text-sm text-gray-700 outline-none placeholder:text-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600 transition"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Remember me + Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  Remember me
                </label>
                <span className="text-sm font-medium text-blue-600 cursor-pointer hover:underline">
                  Forgot password?
                </span>
              </div>

              {/* Sign In button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-teal-500 hover:opacity-90 transition disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <p className="mt-5 text-center text-sm text-gray-500">
              Don't have an account?{" "}
              <Link to="/register" className="font-semibold text-blue-600 hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
