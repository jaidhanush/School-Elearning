import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import ApiService from "@/api/ApiService";
import { CheckCircle, XCircle, Clock, FileText } from "lucide-react";

interface Enrollment {
  enrollmentId: number;
  courseId: number;
  courseName: string;
  studentId: number;
  studentName: string;
  enrollmentDate: string;
  status: string;
}

function getStudentId(email: string | undefined): number {
  if (!email) return 0;
  const stored = localStorage.getItem("user");
  if (stored) { const parsed = JSON.parse(stored); const id = Number(parsed.id); if (id > 0) return id; }
  return Number(localStorage.getItem(`studentId_${email}`)) || 0;
}

export default function MyEnrollments() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const studentId = getStudentId(user?.email);
    if (!studentId) { setLoading(false); return; }
    ApiService.get(`/api/enrollments/student/${studentId}`)
      .then((res) => setEnrollments(res.data || []))
      .catch(() => setEnrollments([]))
      .finally(() => setLoading(false));
  }, [user?.email]);

  const getStatusConfig = (status: string) => {
    switch (status?.toUpperCase()) {
      case "APPROVED": case "ACTIVE":
        return { border: "border-green-500/30 bg-green-500/10", badge: "bg-green-100 text-green-600", icon: <CheckCircle className="h-5 w-5 text-green-600 shrink-0" />, text: "Approved" };
      case "PENDING":
        return { border: "border-yellow-500/30 bg-yellow-500/10", badge: "bg-yellow-100 text-orange-500", icon: <Clock className="h-5 w-5 text-orange-500 shrink-0" />, text: "Pending Approval" };
      case "REJECTED":
        return { border: "border-red-500/30 bg-red-500/10", badge: "bg-red-100 text-red-600", icon: <XCircle className="h-5 w-5 text-red-600 shrink-0" />, text: "Rejected" };
      default:
        return { border: "border-yellow-200 bg-white", badge: "bg-yellow-50 text-gray-500", icon: null, text: status };
    }
  };

  if (loading)
    return <div className="flex items-center justify-center h-40 text-gray-500">Loading enrollments...</div>;

  return (
    <div className="space-y-6 p-6 min-h-full bg-gradient-to-br from-[#FFFEF8] via-[#FFF7DA] to-[#FFE8AA]">

      <div className="rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-500 px-8 py-7 text-black shadow-lg shadow-yellow-200">
        <p className="text-xs font-medium uppercase tracking-widest text-black/60 mb-1">Student</p>
        <h1 className="text-2xl font-bold">My Enrollments</h1>
        <p className="text-sm text-black/70 mt-1">Track your enrollment history and status</p>
      </div>

      {enrollments.length === 0 ? (
        <div className="rounded-2xl border border-yellow-200 bg-white flex flex-col items-center justify-center h-40 gap-2">
          <FileText className="h-8 w-8 text-yellow-500/30" />
          <p className="text-gray-500">No enrollments found. Enroll in courses to see them here.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {enrollments.map((e) => {
            const s = getStatusConfig(e.status);
            return (
              <div key={e.enrollmentId} className={`rounded-2xl border-2 ${s.border} p-5 flex items-start gap-3`}>
                {s.icon}
                <div>
                  <h3 className="font-semibold text-gray-800 text-lg">{e.courseName}</h3>
                  <p className="text-xs text-gray-500 mt-1">Enrolled on {new Date(e.enrollmentDate).toLocaleDateString()}</p>
                  <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${s.badge}`}>{s.text}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
