import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Mail, Lock, User, Phone, X } from "lucide-react";
import LandingPage from "@/pages/LandingPage";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState<"ADMIN" | "STUDENT" | "">("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload =
        role === "ADMIN"
          ? { email, password }
          : {
              firstName,
              lastName,
              phoneNumber,
              gender,
              user: { email, password },
            };
      await register(payload, role as "ADMIN" | "STUDENT");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full bg-transparent px-3 py-3 text-sm text-gray-700 outline-none placeholder:text-gray-400";
  const fieldWrap =
    "flex items-center border border-gray-200 rounded-lg bg-gray-50 px-3 focus-within:ring-2 focus-within:ring-blue-400 transition";
  const selectClass =
    "w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-3 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-400 transition";

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
        <div className="w-[460px] max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl bg-white/10 backdrop-blur-md border border-white/20 flex flex-col">

          {/* Gradient header */}
          <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 px-8 pt-8 pb-8 shrink-0">
            <button
              onClick={() => navigate(-1)}
              className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition"
            >
              <X size={14} className="text-white" />
            </button>
            <h1 className="text-2xl font-bold text-white">Create Account</h1>
            <p className="text-sm text-blue-100 mt-1">Join and start your learning journey</p>
          </div>

          {/* Form body */}
          <div className="px-8 py-7 bg-white overflow-y-auto">
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as "ADMIN" | "STUDENT")}
                  required
                  className={selectClass}
                >
                  <option value="" disabled>Select role</option>
                  <option value="STUDENT">Student</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>

              {role !== "" && (
                <>
                  {role === "STUDENT" && (
                    <>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                          <div className={fieldWrap}>
                            <User size={16} className="text-blue-500 shrink-0" />
                            <input type="text" placeholder="John" value={firstName}
                              onChange={(e) => setFirstName(e.target.value)} required className={inputClass} />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                          <div className={fieldWrap}>
                            <User size={16} className="text-blue-500 shrink-0" />
                            <input type="text" placeholder="Doe" value={lastName}
                              onChange={(e) => setLastName(e.target.value)} required className={inputClass} />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <div className={fieldWrap}>
                          <Phone size={16} className="text-blue-500 shrink-0" />
                          <input type="text" placeholder="8449984265" value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)} required className={inputClass} />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                        <select value={gender} onChange={(e) => setGender(e.target.value)} required className={selectClass}>
                          <option value="" disabled>Select gender</option>
                          <option value="MALE">Male</option>
                          <option value="FEMALE">Female</option>
                          <option value="OTHER">Other</option>
                        </select>
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <div className={fieldWrap}>
                      <Mail size={16} className="text-blue-500 shrink-0" />
                      <input type="email" placeholder="you@example.com" value={email}
                        onChange={(e) => setEmail(e.target.value)} required className={inputClass} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <div className={fieldWrap}>
                      <Lock size={16} className="text-blue-500 shrink-0" />
                      <input type="password" placeholder="••••••••" value={password}
                        onChange={(e) => setPassword(e.target.value)} required className={inputClass} />
                    </div>
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={loading || role === ""}
                className="w-full py-3 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-teal-500 hover:opacity-90 transition disabled:opacity-60"
              >
                {loading ? "Creating Account..." : "Register"}
              </button>
            </form>

            <p className="mt-5 text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-blue-600 hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
