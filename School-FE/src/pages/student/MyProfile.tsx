import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import ApiService from "@/api/ApiService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface StudentProfile {
  studentId: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  gender: string;
  departmentId: number;
  departmentName: string;
  userEmail: string;
}

function getStudentId(email: string | undefined): number {
  if (!email) return 0;
  // try user.id from stored user object
  const stored = localStorage.getItem("user");
  if (stored) {
    const parsed = JSON.parse(stored);
    const id = Number(parsed.id);
    if (id > 0) return id;
  }
  // fallback: keyed by email (saved at registration)
  return Number(localStorage.getItem(`studentId_${email}`)) || 0;
}

export default function MyProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const studentId = getStudentId(user?.email);

      if (!studentId) {
        toast.error("Student ID not found. Please re-register or contact admin.");
        setLoading(false);
        return;
      }

      try {
        const res = await ApiService.get(`/api/students/${studentId}`);
        setProfile(res.data);
      } catch {
        toast.error("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user?.email]);

  if (loading)
    return <div className="flex items-center justify-center h-40 text-muted-foreground">Loading profile...</div>;

  if (!profile)
    return <div className="flex items-center justify-center h-40 text-muted-foreground">Profile not found.</div>;

  const personalFields = [
    { label: "Full Name", value: `${profile.firstName} ${profile.lastName}` },
    { label: "Email", value: profile.userEmail },
    { label: "Phone", value: profile.phoneNumber },
    { label: "Gender", value: profile.gender },
  ];

  const academicFields = [
    { label: "Student ID", value: `STU-${String(profile.studentId).padStart(4, "0")}` },
    { label: "Department", value: profile.departmentName },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Profile</h1>
        <p className="text-muted-foreground">Your personal and academic information</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-lg">Personal Information</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            {personalFields.map(({ label, value }) =>
              value ? (
                <div key={label} className="flex justify-between">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium text-right max-w-[60%]">{value}</span>
                </div>
              ) : null
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-lg">Academic Details</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            {academicFields.map(({ label, value }) =>
              value ? (
                <div key={label} className="flex justify-between">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium text-right">{value}</span>
                </div>
              ) : null
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
