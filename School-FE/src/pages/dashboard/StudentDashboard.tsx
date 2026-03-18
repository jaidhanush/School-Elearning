import { User, FileText, BookOpen, GraduationCap, Clock, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const statCards = [
  { label: "Enrolled Courses", value: "6", change: "+2", icon: BookOpen, iconBg: "bg-sky-500", cardBg: "bg-sky-50" },
  { label: "Completed", value: "3", change: "+1", icon: CheckCircle, iconBg: "bg-green-500", cardBg: "bg-green-50" },
  { label: "In Progress", value: "3", change: "", icon: Clock, iconBg: "bg-purple-500", cardBg: "bg-purple-50" },
  { label: "Certificates", value: "2", change: "+1", icon: GraduationCap, iconBg: "bg-orange-500", cardBg: "bg-orange-50" },
];

const quickLinks = [
  { title: "My Profile", desc: "View and update your personal details", icon: User, link: "/my-profile", iconBg: "bg-sky-500" },
  { title: "Available Courses", desc: "Browse and enroll in available courses", icon: BookOpen, link: "/available-courses", iconBg: "bg-green-500" },
  { title: "My Enrollments", desc: "Track your course enrollment status", icon: FileText, link: "/my-enrollments", iconBg: "bg-purple-500" },
];

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const displayName = user?.name || user?.email?.split("@")[0] || "Student";

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
                {s.change && (
                  <span className="text-xs font-semibold text-green-600">{s.change}</span>
                )}
              </div>
              <p className="text-xs text-gray-500 mb-1">{s.label}</p>
              <p className="text-2xl font-bold text-gray-800">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Quick Links */}
        <div className="rounded-2xl bg-white shadow-sm border border-gray-100 p-6">
          <div className="mb-4">
            <h2 className="text-base font-bold text-gray-800">Quick Actions</h2>
            <p className="text-xs text-gray-400">Navigate to your most used sections</p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {quickLinks.map((c) => (
              <button
                key={c.title}
                onClick={() => navigate(c.link)}
                className="flex flex-col items-start gap-3 rounded-xl border border-gray-100 p-4 hover:shadow-md hover:-translate-y-0.5 transition-all text-left"
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${c.iconBg}`}>
                  <c.icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{c.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{c.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-72 shrink-0 space-y-5">

        {/* Browse Courses card */}
        <div className="rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 p-6 text-white shadow-sm">
          <h2 className="text-lg font-bold mb-1">Explore Courses</h2>
          <p className="text-xs text-blue-100 mb-5">Find and enroll in new courses today</p>
          <button
            onClick={() => navigate("/available-courses")}
            className="w-full rounded-xl bg-white py-2.5 text-sm font-semibold text-blue-600 hover:bg-blue-50 transition flex items-center justify-center gap-1"
          >
            <BookOpen className="h-4 w-4" /> Browse Courses
          </button>
        </div>

        {/* Quick Summary */}
        <div className="rounded-2xl bg-white shadow-sm border border-gray-100 p-6">
          <h2 className="text-base font-bold text-gray-800 mb-4">Quick Summary</h2>
          <div className="space-y-3">
            {[
              { label: "Pending Enrollments", icon: "📋", value: "1" },
              { label: "Upcoming Classes", icon: "📚", value: "4" },
              { label: "Assignments Due", icon: "🎓", value: "2" },
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
