import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import ApiService from "@/api/ApiService";
import { toast } from "sonner";
import { User } from "lucide-react";

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
  const stored = localStorage.getItem("user");
  if (stored) { const parsed = JSON.parse(stored); const id = Number(parsed.id); if (id > 0) return id; }
  return Number(localStorage.getItem(`studentId_${email}`)) || 0;
}

export default function MyProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const studentId = getStudentId(user?.email);
    if (!studentId) { toast.error("Student ID not found."); setLoading(false); return; }
    ApiService.get(`/api/students/${studentId}`)
      .then((res) => setProfile(res.data))
      .catch(() => toast.error("Failed to load profile."))
      .finally(() => setLoading(false));
  }, [user?.email]);

  if (loading)
    return <div className="flex items-center justify-center h-40 text-gray-500">Loading profile...</div>;
  if (!profile)
    return <div className="flex items-center justify-center h-40 text-gray-500">Profile not found.</div>;

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
    <div className="space-y-6 p-6 min-h-full bg-gradient-to-br from-[#FFFEF8] via-[#FFF7DA] to-[#FFE8AA]">

      <div className="rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-500 px-8 py-7 text-black shadow-lg shadow-yellow-200 flex items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-black/20 flex items-center justify-center shrink-0">
          <User size={32} className="text-black/70" />
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-black/60 mb-1">Student</p>
          <h1 className="text-2xl font-bold">{profile.firstName} {profile.lastName}</h1>
          <p className="text-sm text-black/70">{profile.userEmail}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-yellow-200 bg-white p-6">
          <h2 className="text-base font-bold text-gray-800 mb-4">Personal Information</h2>
          <div className="space-y-3">
            {personalFields.map(({ label, value }) => value ? (
              <div key={label} className="flex justify-between py-2 border-b border-yellow-100 last:border-0">
                <span className="text-sm text-gray-500">{label}</span>
                <span className="text-sm font-medium text-gray-800 text-right max-w-[60%]">{value}</span>
              </div>
            ) : null)}
          </div>
        </div>

        <div className="rounded-2xl border border-yellow-200 bg-white p-6">
          <h2 className="text-base font-bold text-gray-800 mb-4">Academic Details</h2>
          <div className="space-y-3">
            {academicFields.map(({ label, value }) => value ? (
              <div key={label} className="flex justify-between py-2 border-b border-yellow-100 last:border-0">
                <span className="text-sm text-gray-500">{label}</span>
                <span className="text-sm font-medium text-gray-800 text-right">{value}</span>
              </div>
            ) : null)}
          </div>
        </div>
      </div>
    </div>
  );
}
