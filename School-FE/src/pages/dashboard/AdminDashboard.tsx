import { useEffect, useState } from "react";
import { UserPlus, BookOpen, Building2, Users, GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import ApiService from "@/api/ApiService";

interface Student { studentId: number; firstName: string; lastName: string; userEmail: string; }
interface Teacher { teacherId: number; name: string; userMail: string; }
interface RecentUser { name: string; email: string; role: "Student" | "Teacher"; }

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const displayName = user?.email || "Admin";
  const [counts, setCounts] = useState({ students: 0, teachers: 0, courses: 0, departments: 0 });
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      ApiService.get("/api/students"),
      ApiService.get("/api/teachers"),
      ApiService.get("/api/courses/course"),
      ApiService.get("/api/departments"),
    ]).then(([studRes, teachRes, courseRes, deptRes]) => {
      const students: Student[] = Array.isArray(studRes.data) ? studRes.data : studRes.data?.content ?? [];
      const teachers: Teacher[] = Array.isArray(teachRes.data) ? teachRes.data : teachRes.data?.content ?? [];
      const courses = Array.isArray(courseRes.data) ? courseRes.data : courseRes.data?.content ?? [];
      const departments = Array.isArray(deptRes.data) ? deptRes.data : deptRes.data?.content ?? [];
      setCounts({ students: students.length, teachers: teachers.length, courses: courses.length, departments: departments.length });
      setRecentUsers([
        ...students.slice(-5).reverse().map((s) => ({ name: `${s.firstName} ${s.lastName}`, email: s.userEmail, role: "Student" as const })),
        ...teachers.slice(-3).reverse().map((t) => ({ name: t.name, email: t.userMail, role: "Teacher" as const })),
      ].slice(0, 6));
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const statCards = [
    { label: "Total Students", value: counts.students, icon: GraduationCap, color: "from-sky-400 to-blue-500", path: "/admin/students" },
    { label: "Total Teachers", value: counts.teachers, icon: Users, color: "from-green-400 to-emerald-500", path: "/admin/teachers" },
    { label: "Total Courses", value: counts.courses, icon: BookOpen, color: "from-purple-400 to-violet-500", path: "/courses" },
    { label: "Departments", value: counts.departments, icon: Building2, color: "from-yellow-400 to-orange-500", path: "/departments" },
  ];

  return (
    <div className="flex gap-6 p-6 min-h-full bg-gradient-to-br from-[#FFFEF8] via-[#FFF7DA] to-[#FFE8AA]">
      <div className="flex-1 space-y-6 min-w-0">

        <div>
          <h1 className="text-2xl font-bold text-gray-800">Welcome back, {displayName} 👋</h1>
          <p className="text-sm mt-0.5 text-gray-500">Here's what's happening in your courses today.</p>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {statCards.map((s) => (
            <div key={s.label} onClick={() => navigate(s.path)}
              className="rounded-2xl p-5 bg-white shadow-md border border-yellow-100 cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all">
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${s.color} mb-4 shadow-sm`}>
                <s.icon className="h-5 w-5 text-white" />
              </div>
              <p className="text-xs mb-1 text-gray-500">{s.label}</p>
              <p className="text-2xl font-bold text-gray-800">{loading ? "..." : s.value}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl bg-white shadow-md border border-yellow-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-gray-800">Recent Users</h2>
              <p className="text-xs text-gray-500">Latest registrations and activities</p>
            </div>
            <button onClick={() => navigate("/admin/students")} className="text-sm font-medium text-orange-500 hover:underline">View All</button>
          </div>
          {loading ? <p className="text-sm text-gray-500">Loading...</p> : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase border-b border-yellow-100 text-gray-500">
                  <th className="pb-3 font-semibold">Name</th>
                  <th className="pb-3 font-semibold">Email</th>
                  <th className="pb-3 font-semibold">Role</th>
                  <th className="pb-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.map((u, i) => (
                  <tr key={i} className="border-b border-yellow-50 last:border-0 hover:bg-yellow-50 transition-colors">
                    <td className="py-3 font-medium text-gray-800">{u.name}</td>
                    <td className="py-3 text-gray-500">{u.email}</td>
                    <td className="py-3">
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${u.role === "Student" ? "bg-yellow-100 text-yellow-700" : "bg-orange-100 text-orange-700"}`}>{u.role}</span>
                    </td>
                    <td className="py-3">
                      <span className="flex items-center gap-1.5 text-xs font-medium text-green-600">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-500 inline-block" />Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="w-72 shrink-0 space-y-5">
        <div className="rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 p-6 text-black shadow-lg">
          <h2 className="text-lg font-bold mb-1">Add New User</h2>
          <p className="text-xs text-black/70 mb-5">Register students or teachers quickly</p>
          <button onClick={() => navigate("/register")} className="w-full rounded-xl bg-black/15 py-2.5 text-sm font-semibold text-black hover:bg-black/25 transition flex items-center justify-center gap-1">
            <UserPlus className="h-4 w-4" /> Add User
          </button>
        </div>

        <div className="rounded-2xl bg-white shadow-md border border-yellow-100 p-6">
          <h2 className="text-base font-bold mb-4 text-gray-800">Quick Summary</h2>
          <div className="space-y-3">
            {[
              { label: "Total Students", icon: "🎓", value: loading ? "..." : counts.students },
              { label: "Total Teachers", icon: "👨🏫", value: loading ? "..." : counts.teachers },
              { label: "Total Courses", icon: "📚", value: loading ? "..." : counts.courses },
              { label: "Departments", icon: "🏫", value: loading ? "..." : counts.departments },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-2 border-b border-yellow-50 last:border-0">
                <div className="flex items-center gap-2">
                  <span>{item.icon}</span>
                  <span className="text-sm text-gray-600">{item.label}</span>
                </div>
                <span className="text-sm font-semibold text-gray-800">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
