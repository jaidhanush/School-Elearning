import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import ApiService from "@/api/ApiService";
import { KeyRound, Mail, Lock, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const { user } = useAuth();
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState(user?.email || "");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const inputClass = "w-full bg-white border border-yellow-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-yellow-400 transition";

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { toast.error("Please enter your email"); return; }
    setLoading(true);
    try {
      await ApiService.post("/api/users/forgetpassword", { email }, { timeout: 30000 });
      toast.success("OTP sent to your email!");
      setStep("otp");
    } catch (err: any) {
      if (err.code === "ECONNABORTED" || err.message?.includes("timeout")) {
        toast.success("OTP sent! Check your email.");
        setStep("otp");
      } else {
        toast.error(ApiService.handleAxiosError(err, "Failed to send OTP"));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) { toast.error("Please enter OTP"); return; }
    if (!newPassword) { toast.error("Please enter new password"); return; }
    if (newPassword !== confirmPassword) { toast.error("Passwords do not match"); return; }
    if (newPassword.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    setLoading(true);
    try {
      const res = await ApiService.post("/api/users/forget-reset", { email, otp, newPassword }, { timeout: 30000 });
      toast.success(res.data?.msg || res.data?.message || "Password changed successfully!");
      setStep("email"); setOtp(""); setNewPassword(""); setConfirmPassword("");
    } catch (err: any) {
      toast.error(ApiService.handleAxiosError(err, "Failed to reset password"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full p-6 bg-gradient-to-br from-[#FFFEF8] via-[#FFF7DA] to-[#FFE8AA]">
      <div className="max-w-2xl mx-auto space-y-6">

        <div className="rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-500 px-8 py-7 text-black shadow-lg shadow-yellow-200">
          <p className="text-xs font-medium uppercase tracking-widest text-black/60 mb-1">Account</p>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-sm text-black/70 mt-1">Manage your account settings and preferences</p>
        </div>

        {/* Change Password Card */}
        <div className="rounded-2xl border border-yellow-200 bg-white p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500">
              <KeyRound className="h-5 w-5 text-black" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-800">Change Password</h2>
              <p className="text-xs text-gray-500">Update your password using OTP verification</p>
            </div>
          </div>

          {step === "email" ? (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Email Address</label>
                <div className="flex items-center border border-yellow-200 rounded-lg bg-white px-3 focus-within:ring-2 focus-within:ring-yellow-400 transition">
                  <Mail className="h-4 w-4 text-orange-500 shrink-0" />
                  <input type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading} className="w-full bg-transparent px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-500 outline-none" />
                </div>
                <p className="text-xs text-gray-500 mt-1">We'll send an OTP to this email address</p>
              </div>
              <button type="submit" disabled={loading} className="w-full py-2.5 rounded-xl text-sm font-semibold text-black bg-gradient-to-r from-yellow-400 to-orange-500 hover:scale-[1.02] transition disabled:opacity-60">
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">OTP Code</label>
                <input type="text" placeholder="Enter 6-digit OTP" value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6} required disabled={loading} className={inputClass} />
                <p className="text-xs text-gray-500 mt-1">Check your email for the OTP code</p>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">New Password</label>
                <div className="flex items-center border border-yellow-200 rounded-lg bg-white px-3 focus-within:ring-2 focus-within:ring-yellow-400 transition">
                  <Lock className="h-4 w-4 text-orange-500 shrink-0" />
                  <input type="password" placeholder="Enter new password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required disabled={loading} className="w-full bg-transparent px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Confirm New Password</label>
                <div className="flex items-center border border-yellow-200 rounded-lg bg-white px-3 focus-within:ring-2 focus-within:ring-yellow-400 transition">
                  <Lock className="h-4 w-4 text-orange-500 shrink-0" />
                  <input type="password" placeholder="Confirm new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required disabled={loading} className="w-full bg-transparent px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-500 outline-none" />
                </div>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => { setStep("email"); setOtp(""); setNewPassword(""); setConfirmPassword(""); }} disabled={loading} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 border border-yellow-200 hover:bg-white transition">
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
                <button type="submit" disabled={loading} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-black bg-gradient-to-r from-yellow-400 to-orange-500 hover:scale-[1.02] transition disabled:opacity-60">
                  {loading ? "Changing Password..." : "Change Password"}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Info Card */}
        <div className="rounded-2xl border border-yellow-200 bg-yellow-500/10 p-6">
          <div className="flex gap-3">
            <span className="text-xl">ℹ️</span>
            <div>
              <p className="text-sm font-medium text-orange-600 mb-2">Password Change Process</p>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>1. Enter your email address</li>
                <li>2. Check your email for the OTP code</li>
                <li>3. Enter the OTP and your new password</li>
                <li>4. Your password will be updated</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
