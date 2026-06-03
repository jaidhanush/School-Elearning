import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Mail, Lock, User, Phone, X, ChevronDown, Check, Eye, EyeOff } from "lucide-react";
import LandingPage from "@/pages/LandingPage";
import ApiService from "@/api/ApiService";

interface Department {
  departmentId: number;
  departmentName: string;
}

interface DropdownProps {
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  options: { value: string; label: string }[];
  icon?: React.ReactNode;
}

function CustomDropdown({ value, onChange, placeholder, options, icon }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center gap-2.5 rounded-xl border-2 px-3 py-2.5 text-sm font-medium transition-all text-left ${
          open
            ? "border-orange-400 bg-white shadow-md"
            : "border-amber-200 bg-amber-50 hover:border-orange-300 hover:bg-white"
        }`}
      >
        {icon && <span className="text-orange-400 shrink-0">{icon}</span>}
        <span className={`flex-1 ${selected ? "text-gray-800" : "text-amber-400"}`}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          size={15}
          className={`text-orange-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute z-50 mt-1.5 w-full rounded-2xl border border-orange-100 bg-white shadow-xl overflow-hidden">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium transition-colors text-left ${
                value === opt.value
                  ? "bg-gradient-to-r from-yellow-50 to-orange-50 text-orange-600"
                  : "text-gray-700 hover:bg-amber-50"
              }`}
            >
              {opt.label}
              {value === opt.value && <Check size={14} className="text-orange-500" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    ApiService.get("/api/departments")
      .then((res) => {
        const data = Array.isArray(res.data)
          ? res.data
          : res.data?.content ?? res.data?.data ?? [];
        setDepartments(data);
      })
      .catch(() => toast.error("Failed to load departments"));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFormError(null);
    try {
      const payload = {
        firstName, lastName, phoneNumber, gender,
        departmentId: departmentId ? Number(departmentId) : null,
        user: { email, password },
      };
      await register(payload, "STUDENT");
      navigate("/student-dashboard");
    } catch (err: any) {
      const msg = ApiService.handleAxiosError(err, "Registration failed");
      setFormError(msg);
    } finally {
      setLoading(false);
    }
  };

  const inputWrap = "flex items-center gap-2 rounded-xl border-2 border-amber-200 bg-amber-50 px-3 py-2.5 focus-within:border-orange-400 focus-within:bg-white focus-within:shadow-md transition-all";
  const inputCls  = "w-full bg-transparent text-sm font-medium text-gray-800 outline-none placeholder:text-amber-400";
  const iconCls   = "shrink-0 text-orange-400";
  const labelCls  = "block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5";

  const genderOptions = [
    { value: "MALE", label: "👨 Male" },
    { value: "FEMALE", label: "👩 Female" },
    { value: "OTHER", label: "🧑 Other" },
  ];

  const deptOptions = departments.map((d) => ({
    value: String(d.departmentId),
    label: d.departmentName,
  }));

  return (
    <div className="relative min-h-screen w-screen overflow-y-auto">
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
        <LandingPage />
      </div>
      <div className="absolute inset-0 bg-black/25" />

      <div className="relative z-50 flex min-h-screen w-full items-center justify-center px-4 py-6">
        <div
          className="w-full max-w-[480px] rounded-3xl overflow-hidden shadow-2xl border border-orange-200 flex flex-col"
          style={{ maxHeight: "92vh" }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 px-7 py-6 shrink-0">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-black text-black">Create Account</h1>
                <p className="text-black/65 text-sm mt-1">Join and start your learning journey</p>
              </div>
              <button
                onClick={() => navigate(-1)}
                className="w-9 h-9 rounded-full bg-black/15 hover:bg-black/25 flex items-center justify-center transition"
              >
                <X size={16} className="text-black" />
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="bg-gradient-to-b from-[#FFFEF8] to-[#FFF7DA] px-7 py-5 overflow-y-auto flex-1">
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* First + Last Name */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>First Name</label>
                  <div className={inputWrap}>
                    <User size={15} className={iconCls} />
                    <input value={firstName} onChange={(e) => setFirstName(e.target.value)} required placeholder="John" className={inputCls} />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Last Name</label>
                  <div className={inputWrap}>
                    <User size={15} className={iconCls} />
                    <input value={lastName} onChange={(e) => setLastName(e.target.value)} required placeholder="Doe" className={inputCls} />
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className={labelCls}>Phone Number</label>
                <div className={inputWrap}>
                  <Phone size={15} className={iconCls} />
                  <input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required placeholder="8449984265" className={inputCls} />
                </div>
              </div>

              {/* Gender */}
              <div>
                <label className={labelCls}>Gender</label>
                <CustomDropdown
                  value={gender}
                  onChange={setGender}
                  placeholder="Select your gender"
                  options={genderOptions}
                />
              </div>

              {/* Department */}
              <div>
                <label className={labelCls}>Department</label>
                <CustomDropdown
                  value={departmentId}
                  onChange={setDepartmentId}
                  placeholder="Select your department"
                  options={deptOptions}
                />
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3 py-1">
                <div className="flex-1 h-px bg-amber-200" />
                <span className="text-xs text-amber-500 font-semibold">Account Details</span>
                <div className="flex-1 h-px bg-amber-200" />
              </div>

              {/* Email */}
              <div>
                <label className={labelCls}>Email Address</label>
                <div className={inputWrap}>
                  <Mail size={15} className={iconCls} />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" className={inputCls} autoComplete="off" />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className={labelCls}>Password</label>
                <div className={inputWrap}>
                  <Lock size={15} className={iconCls} />
                  <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Min. 6 characters" className={inputCls} autoComplete="new-password" />
                  <button type="button" onClick={() => setShowPassword((p) => !p)} className="shrink-0 text-orange-400 hover:text-orange-600">
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Error Banner */}
              {formError && (
                <div className="rounded-xl bg-gradient-to-r from-yellow-50 to-orange-50 border border-orange-300 px-4 py-3 text-sm text-orange-700 font-medium">
                  ⚠️ {formError}
                </div>
              )}

              <button
                disabled={loading}
                className="w-full py-3 rounded-2xl text-sm font-bold text-black bg-gradient-to-r from-yellow-400 to-orange-500 hover:shadow-lg hover:shadow-orange-200 hover:scale-[1.02] transition-all disabled:opacity-60"
              >
                {loading ? "Creating Account..." : "🎓 Register Now"}
              </button>

            </form>

            <p className="mt-4 text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link to="/login" className="font-bold text-orange-500 hover:underline">Sign In</Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
