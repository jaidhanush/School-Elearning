import { useEffect, useState } from "react";
import { FileText, BookOpen, Clock, CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import ApiService from "@/api/ApiService";

interface DashboardStats { totalEnrollments: number; approvedEnrollments: number; pendingEnrollments: number; rejectedEnrollments: number; availableCourses: number; }

function getStudentId(email: string | undefined): number {
  if (!email) return 0;
  const stored = localStorage.getItem("user");
  if (stored) { const p = JSON.parse(stored); const id = Number(p.id); if (id > 0) return id; }
  return Number(localStorage.getItem(`studentId_${email}`)) || 0;
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({ totalEnrollments: 0, approvedEnrollments: 0, pendingEnrollments: 0, rejectedEnrollments: 0, availableCourses: 0 });
  const [loading, setLoading] = useState(true);
  const displayName = user?.name || user?.email?.split("@")[0] || "Student";

  useEffect(() => {
    const studentId = getStudentId(user?.email);
    if (!studentId) { setLoading(false); return; }
    Promise.all([
      ApiService.get(`/api/enrollments/student/${studentId}`),
      ApiService.get("/api/students/courses/available"),
    ]).then(([eRes, cRes]) => {
      const e = eRes.data || []; const c = cRes.data || [];
      setStats({ totalEnrollments: e.length, approvedEnrollments: e.filter((x: any) => x.status?.toUpperCase() === "APPROVED").length, pendingEnrollments: e.filter((x: any) => x.status?.toUpperCase() === "PENDING").length, rejectedEnrollments: e.filter((x: any) => x.status?.toUpperCase() === "REJECTED").length, availableCourses: c.length });
    }).catch(() => {}).finally(() => setLoading(false));
  }, [user?.email]);

  const statCards = [
    { label: "Total Enrollments", value: stats.totalEnrollments, icon: BookOpen, color: "from-sky-400 to-blue-500", onClick: () => navigate("/my-enrollments") },
    { label: "Approved", value: stats.approvedEnrollments, icon: CheckCircle, color: "from-green-400 to-emerald-500", onClick: () => navigate("/my-enrollments") },
    { label: "Pending", value: stats.pendingEnrollments, icon: Clock, color: "from-yellow-400 to-orange-500", onClick: () => navigate("/my-enrollments") },
    { label: "Available Courses", value: stats.availableCourses, icon: BookOpen, color: "from-purple-400 to-violet-500", onClick: () => navigate("/available-courses") },
  ];

  if (loading) return <div className="flex items-center justify-center h-full bg-gradient-to-br from-[#FFFEF8] via-[#FFF7DA] to-[#FFE8AA]"><p className="text-gray-500">Loading dashboard...</p></div>;

  return (
    <div className="flex gap-6 p-6 min-h-full bg-gradient-to-br from-[#FFFEF8] via-[#FFF7DA] to-[#FFE8AA]">
      <div className="flex-1 space-y-6 min-w-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Welcome back, {displayName} 👋</h1>
          <p className="text-sm mt-0.5 text-gray-500">Here's your enrollment overview</p>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {statCards.map((s) => (
            <button key={s.label} onClick={s.onClick} className="rounded-2xl p-5 bg-white shadow-md border border-yellow-100 hover:shadow-lg hover:-translate-y-0.5 transition-all text-left">
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${s.color} mb-4 shadow-sm`}>
                <s.icon className="h-5 w-5 text-white" />
              </div>
              <p className="text-xs mb-1 text-gray-500">{s.label}</p>
              <p className="text-2xl font-bold text-gray-800">{s.value}</p>
            </button>
          ))}
        </div>

        <div className="rounded-2xl bg-white shadow-md border border-yellow-100 p-6">
          <h2 className="text-base font-bold text-gray-800 mb-1">Quick Actions</h2>
          <p className="text-xs text-gray-500 mb-4">Navigate to your most used sections</p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { title: "Available Courses", desc: "Browse and enroll in courses", icon: BookOpen, color: "from-green-400 to-emerald-500", link: "/available-courses" },
              { title: "My Enrollments", desc: "Track your enrollment status", icon: FileText, color: "from-purple-400 to-violet-500", link: "/my-enrollments" },
            ].map((c) => (
              <button key={c.title} onClick={() => navigate(c.link)} className="flex flex-col items-start gap-3 rounded-xl border border-yellow-100 bg-yellow-50/50 p-4 hover:shadow-md hover:-translate-y-0.5 transition-all text-left">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${c.color}`}>
                  <c.icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{c.title}</p>
                  <p className="text-xs mt-0.5 text-gray-500">{c.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {stats.pendingEnrollments > 0 && (
          <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-5 flex items-center gap-3">
            <Clock className="h-5 w-5 text-yellow-600 shrink-0" />
            <div>
              <p className="font-semibold text-gray-800">You have {stats.pendingEnrollments} pending enrollment{stats.pendingEnrollments > 1 ? "s" : ""}</p>
              <p className="text-sm text-gray-500">Waiting for instructor approval</p>
            </div>
          </div>
        )}
      </div>

      <div className="w-72 shrink-0 space-y-5">
        <div className="rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 p-6 text-black shadow-lg">
          <h2 className="text-lg font-bold mb-1">Explore Courses</h2>
          <p className="text-xs text-black/70 mb-5">{stats.availableCourses} course{stats.availableCourses !== 1 ? "s" : ""} available</p>
          <button onClick={() => navigate("/available-courses")} className="w-full rounded-xl bg-black/15 py-2.5 text-sm font-semibold text-black hover:bg-black/25 transition flex items-center justify-center gap-1">
            <BookOpen className="h-4 w-4" /> Browse Courses
          </button>
        </div>

        <div className="rounded-2xl bg-white shadow-md border border-yellow-100 p-6">
          <h2 className="text-base font-bold mb-4 text-gray-800">Enrollment Summary</h2>
          <div className="space-y-3">
            {[
              { icon: <CheckCircle className="h-4 w-4 text-green-500" />, label: "Approved", value: stats.approvedEnrollments },
              { icon: <Clock className="h-4 w-4 text-yellow-500" />, label: "Pending", value: stats.pendingEnrollments },
              { icon: <XCircle className="h-4 w-4 text-red-500" />, label: "Rejected", value: stats.rejectedEnrollments },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-2 border-b border-yellow-50 last:border-0">
                <div className="flex items-center gap-2">{item.icon}<span className="text-sm text-gray-600">{item.label}</span></div>
                <span className="text-sm font-semibold text-gray-800">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
