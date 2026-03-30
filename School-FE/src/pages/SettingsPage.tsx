import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import ApiService from "@/api/ApiService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KeyRound, Mail, Lock, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const { user } = useAuth();
  const { dark } = useTheme();
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState(user?.email || "");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    setLoading(true);
    try {
      const response = await ApiService.post("/api/users/forgetpassword", { email }, { timeout: 30000 });
      console.log("OTP Response:", response);
      toast.success("OTP sent to your email!");
      setStep("otp");
    } catch (err: any) {
      console.error("OTP Error:", err);
      // If timeout but you received OTP, still move to next step
      if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
        toast.success("OTP sent! Check your email.");
        setStep("otp");
      } else {
        const msg = ApiService.handleAxiosError(err, "Failed to send OTP");
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp) {
      toast.error("Please enter OTP");
      return;
    }

    if (!newPassword) {
      toast.error("Please enter new password");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const response = await ApiService.post("/api/users/forget-reset", {
        email,
        otp,
        newPassword,
      }, { timeout: 30000 });
      console.log("Reset Response:", response);
      const successMsg = response.data?.msg || response.data?.message || "Password changed successfully!";
      toast.success(successMsg);
      // Reset form
      setStep("email");
      setOtp("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      console.error("Reset Error:", err);
      console.error("Error Response:", err.response?.data);
      const msg = ApiService.handleAxiosError(err, "Failed to reset password");
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setStep("email");
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className={`min-h-full p-6 ${dark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className={`text-2xl font-bold ${dark ? 'text-gray-100' : 'text-gray-800'}`}>
            Settings
          </h1>
          <p className={`text-sm mt-0.5 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
            Manage your account settings and preferences
          </p>
        </div>

        {/* Change Password Card */}
        <Card className={dark ? 'bg-gray-800 border-gray-700' : ''}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500">
                <KeyRound className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className={dark ? 'text-gray-100' : ''}>Change Password</CardTitle>
                <p className={`text-sm ${dark ? 'text-gray-400' : 'text-muted-foreground'}`}>
                  Update your password using OTP verification
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {step === "email" ? (
              <form onSubmit={handleSendOTP} className="space-y-4">
                <div className="space-y-2">
                  <Label className={dark ? 'text-gray-300' : ''}>Email Address</Label>
                  <div className="relative">
                    <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${dark ? 'text-gray-500' : 'text-gray-400'}`} />
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`pl-10 ${dark ? 'bg-gray-700 border-gray-600 text-gray-100' : ''}`}
                      required
                      disabled={loading}
                    />
                  </div>
                  <p className={`text-xs ${dark ? 'text-gray-500' : 'text-muted-foreground'}`}>
                    We'll send an OTP to this email address
                  </p>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Sending OTP..." : "Send OTP"}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label className={dark ? 'text-gray-300' : ''}>OTP Code</Label>
                  <Input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className={dark ? 'bg-gray-700 border-gray-600 text-gray-100' : ''}
                    maxLength={6}
                    required
                    disabled={loading}
                  />
                  <p className={`text-xs ${dark ? 'text-gray-500' : 'text-muted-foreground'}`}>
                    Check your email for the OTP code
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className={dark ? 'text-gray-300' : ''}>New Password</Label>
                  <div className="relative">
                    <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${dark ? 'text-gray-500' : 'text-gray-400'}`} />
                    <Input
                      type="password"
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className={`pl-10 ${dark ? 'bg-gray-700 border-gray-600 text-gray-100' : ''}`}
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className={dark ? 'text-gray-300' : ''}>Confirm New Password</Label>
                  <div className="relative">
                    <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${dark ? 'text-gray-500' : 'text-gray-400'}`} />
                    <Input
                      type="password"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`pl-10 ${dark ? 'bg-gray-700 border-gray-600 text-gray-100' : ''}`}
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    disabled={loading}
                    className="gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </Button>
                  <Button type="submit" className="flex-1" disabled={loading}>
                    {loading ? "Changing Password..." : "Change Password"}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className={`border-blue-200 ${dark ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50'}`}>
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <div className="text-blue-600 text-xl">ℹ️</div>
              <div className="space-y-1">
                <p className={`text-sm font-medium ${dark ? 'text-blue-300' : 'text-blue-900'}`}>
                  Password Change Process
                </p>
                <ul className={`text-xs space-y-1 ${dark ? 'text-blue-400' : 'text-blue-700'}`}>
                  <li>1. Enter your email address</li>
                  <li>2. Check your email for the OTP code</li>
                  <li>3. Enter the OTP and your new password</li>
                  <li>4. Your password will be updated</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
