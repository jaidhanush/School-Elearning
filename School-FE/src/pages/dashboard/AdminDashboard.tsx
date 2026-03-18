import { UserPlus, BookOpen, Building2, Users, GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const statCards = [
  {
    label: "Total Students",
    value: "2,847",
    change: "+12%",
    icon: GraduationCap,
    iconBg: "bg-sky-500",
    cardBg: "bg-sky-50",
  },
  {
    label: "Total Teachers",
    value: "156",
    change: "+12%",
    icon: Users,
    iconBg: "bg-green-500",
    cardBg: "bg-green-50",
  },
  {
    label: "Total Courses",
    value: "48",
    change: "+12%",
    icon: BookOpen,
    iconBg: "bg-purple-500",
    cardBg: "bg-purple-50",
  },
  {
    label: "Departments",
    value: "12",
    change: "+12%",
    icon: Building2,
    iconBg: "bg-orange-500",
    cardBg: "bg-orange-50",
  },
];

const recentUsers = [
  { name: "Prasath Kumar", email: "prasath@gmail.com", role: "Student", status: "Active" },
  { name: "Shyam Patel", email: "shyam@gmail.com", role: "Student", status: "Active" },
  { name: "Balaprakash Singh", email: "balaprakash@gmail.com", role: "Teacher", status: "Active" },
  { name: "Kumark", email: "kumark@gmail.com", role: "Student", status: "Active" },
];

const roleColor: Record<string, string> = {
  Student: "bg-blue-100 text-blue-600",
  Teacher: "bg-yellow-100 text-yellow-700",
  Admin: "bg-purple-100 text-purple-600",
};

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const displayName = user?.name || user?.email?.split("@")[0] || "Admin";

  return (
    <div className="flex gap-6 p-6 min-h-full bg-gray-50">

      {/* Main Content */}
      <div className="flex-1 space-y-6 min-w-0">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome back, {displayName} 👋
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">Here's what's happening in your courses today.</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-4 gap-4">
          {statCards.map((s) => (
            <div key={s.label} className={`rounded-2xl p-5 ${s.cardBg} border border-white shadow-sm`}>
              <div className="flex items-start justify-between mb-4">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${s.iconBg}`}>
                  <s.icon className="h-5 w-5 text-white" />
                </div>
                <span className="text-xs font-semibold text-green-600">{s.change}</span>
              </div>
              <p className="text-xs text-gray-500 mb-1">{s.label}</p>
              <p className="text-2xl font-bold text-gray-800">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Recent Users Table */}
        <div className="rounded-2xl bg-white shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-1">
            <div>
              <h2 className="text-base font-bold text-gray-800">Recent Users</h2>
              <p className="text-xs text-gray-400">Latest registrations and activities</p>
            </div>
            <button
              onClick={() => navigate("/admin/students")}
              className="text-sm font-medium text-sky-500 hover:underline"
            >
              View All
            </button>
          </div>

          <div className="mt-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-400 uppercase border-b border-gray-100">
                  <th className="pb-3 font-semibold tracking-wide">Name</th>
                  <th className="pb-3 font-semibold tracking-wide">Email</th>
                  <th className="pb-3 font-semibold tracking-wide">Role</th>
                  <th className="pb-3 font-semibold tracking-wide">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.map((u, i) => (
                  <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="py-3.5 font-medium text-gray-800">{u.name}</td>
                    <td className="py-3.5 text-gray-500">{u.email}</td>
                    <td className="py-3.5">
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${roleColor[u.role] ?? "bg-gray-100 text-gray-600"}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5">
                      <span className="flex items-center gap-1.5 text-xs font-medium text-green-600">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-500 inline-block" />
                        {u.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-72 shrink-0 space-y-5">

        {/* Add New User card */}
        <div className="rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 p-6 text-white shadow-sm">
          <h2 className="text-lg font-bold mb-1">Add New User</h2>
          <p className="text-xs text-blue-100 mb-5">Register students or teachers quickly</p>
          <button
            onClick={() => navigate("/admin/add-user")}
            className="w-full rounded-xl bg-white py-2.5 text-sm font-semibold text-blue-600 hover:bg-blue-50 transition flex items-center justify-center gap-1"
          >
            <UserPlus className="h-4 w-4" /> Add User
          </button>
        </div>

        {/* Quick Summary */}
        <div className="rounded-2xl bg-white shadow-sm border border-gray-100 p-6">
          <h2 className="text-base font-bold text-gray-800 mb-4">Quick Summary</h2>
          <div className="space-y-3">
            {[
              { label: "Pending Approvals", icon: "📋", value: "3" },
              { label: "New Enrollments", icon: "📚", value: "12" },
              { label: "Active Courses", icon: "🎓", value: "48" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-2">
                  <span className="text-base">{item.icon}</span>
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
