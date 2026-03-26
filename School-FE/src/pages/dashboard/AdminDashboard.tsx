import { useEffect, useState } from "react";
import { UserPlus, BookOpen, Building2, Users, GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import ApiService from "@/api/ApiService";

interface Student {
  studentId: number;
  firstName: string;
  lastName: string;
  userEmail: string;
}

interface Teacher {
  teacherId: number;
  name: string;
  userMail: string;
}

interface RecentUser {
  name: string;
  email: string;
  role: "Student" | "Teacher";
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const { dark } = useTheme();
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
      const students: Student[] = Array.isArray(studRes.data) ? studRes.data : studRes.data?.content ?? studRes.data?.data ?? [];
      const teachers: Teacher[] = Array.isArray(teachRes.data) ? teachRes.data : teachRes.data?.content ?? teachRes.data?.data ?? [];
      const courses = Array.isArray(courseRes.data) ? courseRes.data : courseRes.data?.content ?? courseRes.data?.data ?? [];
      const departments = Array.isArray(deptRes.data) ? deptRes.data : deptRes.data?.content ?? deptRes.data?.data ?? [];

      setCounts({
        students: students.length,
        teachers: teachers.length,
        courses: courses.length,
        departments: departments.length,
      });

      const recentStudents: RecentUser[] = students.slice(-5).reverse().map((s) => ({
        name: `${s.firstName} ${s.lastName}`,
        email: s.userEmail,
        role: "Student",
      }));
      const recentTeachers: RecentUser[] = teachers.slice(-3).reverse().map((t) => ({
        name: t.name,
        email: t.userMail,
        role: "Teacher",
      }));

      setRecentUsers([...recentStudents, ...recentTeachers].slice(0, 6));
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const statCards = [
    { 
      label: "Total Students", 
      value: counts.students, 
      icon: GraduationCap, 
      iconBg: "bg-sky-500", 
      cardBg: dark ? "bg-sky-900/30" : "bg-sky-50", 
      path: "/admin/students" 
    },
    { 
      label: "Total Teachers", 
      value: counts.teachers, 
      icon: Users, 
      iconBg: "bg-green-500", 
      cardBg: dark ? "bg-green-900/30" : "bg-green-50", 
      path: "/admin/teachers" 
    },
    { 
      label: "Total Courses", 
      value: counts.courses, 
      icon: BookOpen, 
      iconBg: "bg-purple-500", 
      cardBg: dark ? "bg-purple-900/30" : "bg-purple-50", 
      path: "/courses" 
    },
    { 
      label: "Departments", 
      value: counts.departments, 
      icon: Building2, 
      iconBg: "bg-orange-500", 
      cardBg: dark ? "bg-orange-900/30" : "bg-orange-50", 
      path: "/departments" 
    },
  ];

  const getRoleColor = (role: string) => {
    if (dark) {
      return role === "Student" 
        ? "bg-blue-900/50 text-blue-300" 
        : "bg-yellow-900/50 text-yellow-300";
    }
    return role === "Student" 
      ? "bg-blue-100 text-blue-600" 
      : "bg-yellow-100 text-yellow-700";
  };

  return (
    <div className={`flex gap-6 p-6 min-h-full ${dark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="flex-1 space-y-6 min-w-0">

        {/* Header */}
        <div>
          <h1 className={`text-2xl font-bold ${dark ? 'text-gray-100' : 'text-gray-800'}`}>
            Welcome back, {displayName} 👋
          </h1>
          <p className={`text-sm mt-0.5 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
            Here's what's happening in your courses today.
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-4 gap-4">
          {statCards.map((s) => (
            <div
              key={s.label}
              onClick={() => navigate(s.path)}
              className={`rounded-2xl p-5 ${s.cardBg} border shadow-sm cursor-pointer hover:shadow-md transition ${
                dark ? 'border-gray-700' : 'border-white'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${s.iconBg}`}>
                  <s.icon className="h-5 w-5 text-white" />
                </div>
              </div>
              <p className={`text-xs mb-1 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{s.label}</p>
              <p className={`text-2xl font-bold ${dark ? 'text-gray-100' : 'text-gray-800'}`}>
                {loading ? "..." : s.value}
              </p>
            </div>
          ))}
        </div>

        {/* Recent Users Table */}
        <div className={`rounded-2xl shadow-sm border p-6 ${
          dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
        }`}>
          <div className="flex items-center justify-between mb-1">
            <div>
              <h2 className={`text-base font-bold ${dark ? 'text-gray-100' : 'text-gray-800'}`}>Recent Users</h2>
              <p className={`text-xs ${dark ? 'text-gray-500' : 'text-gray-400'}`}>Latest registrations and activities</p>
            </div>
            <button 
              onClick={() => navigate("/admin/students")} 
              className="text-sm font-medium text-sky-500 hover:underline"
            >
              View All
            </button>
          </div>

          <div className="mt-4">
            {loading ? (
              <p className={`text-sm ${dark ? 'text-gray-500' : 'text-gray-400'}`}>Loading...</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className={`text-left text-xs uppercase border-b ${
                    dark ? 'text-gray-500 border-gray-700' : 'text-gray-400 border-gray-100'
                  }`}>
                    <th className="pb-3 font-semibold tracking-wide">Name</th>
                    <th className="pb-3 font-semibold tracking-wide">Email</th>
                    <th className="pb-3 font-semibold tracking-wide">Role</th>
                    <th className="pb-3 font-semibold tracking-wide">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.map((u, i) => (
                    <tr 
                      key={i} 
                      className={`border-b last:border-0 transition-colors ${
                        dark 
                          ? 'border-gray-700 hover:bg-gray-700/50' 
                          : 'border-gray-50 hover:bg-gray-50'
                      }`}
                    >
                      <td className={`py-3.5 font-medium ${dark ? 'text-gray-200' : 'text-gray-800'}`}>{u.name}</td>
                      <td className={`py-3.5 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{u.email}</td>
                      <td className="py-3.5">
                        <span className={`rounded-full px-3 py-1 text-xs font-medium ${getRoleColor(u.role)}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3.5">
                        <span className="flex items-center gap-1.5 text-xs font-medium text-green-600">
                          <span className="h-1.5 w-1.5 rounded-full bg-green-500 inline-block" />
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-72 shrink-0 space-y-5">

        <div className="rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 p-6 text-white shadow-sm">
          <h2 className="text-lg font-bold mb-1">Add New User</h2>
          <p className="text-xs text-blue-100 mb-5">Register students or teachers quickly</p>
          <button
            onClick={() => navigate("/register")}
            className="w-full rounded-xl bg-white py-2.5 text-sm font-semibold text-blue-600 hover:bg-blue-50 transition flex items-center justify-center gap-1"
          >
            <UserPlus className="h-4 w-4" /> Add User
          </button>
        </div>

        <div className={`rounded-2xl shadow-sm border p-6 ${
          dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
        }`}>
          <h2 className={`text-base font-bold mb-4 ${dark ? 'text-gray-100' : 'text-gray-800'}`}>Quick Summary</h2>
          <div className="space-y-3">
            {[
              { label: "Total Students", icon: "🎓", value: loading ? "..." : counts.students },
              { label: "Total Teachers", icon: "👨🏫", value: loading ? "..." : counts.teachers },
              { label: "Total Courses", icon: "📚", value: loading ? "..." : counts.courses },
              { label: "Departments", icon: "🏫", value: loading ? "..." : counts.departments },
            ].map((item) => (
              <div 
                key={item.label} 
                className={`flex items-center justify-between py-2 border-b last:border-0 ${
                  dark ? 'border-gray-700' : 'border-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{item.icon}</span>
                  <span className={`text-sm ${dark ? 'text-gray-300' : 'text-gray-600'}`}>{item.label}</span>
                </div>
                <span className={`text-sm font-semibold ${dark ? 'text-gray-100' : 'text-gray-800'}`}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
