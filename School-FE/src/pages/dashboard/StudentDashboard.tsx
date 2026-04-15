import { useEffect, useState } from "react";
import { FileText, BookOpen, Clock, CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import ApiService from "@/api/ApiService";
import { Card, CardContent } from "@/components/ui/card";

interface DashboardStats {
  totalEnrollments: number;
  approvedEnrollments: number;
  pendingEnrollments: number;
  rejectedEnrollments: number;
  availableCourses: number;
}

function getStudentId(email: string | undefined): number {
  if (!email) return 0;
  const stored = localStorage.getItem("user");
  if (stored) {
    const parsed = JSON.parse(stored);
    const id = Number(parsed.id);
    if (id > 0) return id;
  }
  return Number(localStorage.getItem(`studentId_${email}`)) || 0;
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const { dark } = useTheme();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalEnrollments: 0,
    approvedEnrollments: 0,
    pendingEnrollments: 0,
    rejectedEnrollments: 0,
    availableCourses: 0,
  });
  const [loading, setLoading] = useState(true);

  const displayName = user?.name || user?.email?.split("@")[0] || "Student";

  useEffect(() => {
    const fetchDashboardData = async () => {
      const studentId = getStudentId(user?.email);
      if (!studentId) {
        setLoading(false);
        return;
      }

      try {
        const enrollmentsRes = await ApiService.get(`/api/enrollments/student/${studentId}`);
        const enrollments = enrollmentsRes.data || [];

        const coursesRes = await ApiService.get("/api/students/courses/available");
        const courses = coursesRes.data || [];

        setStats({
          totalEnrollments: enrollments.length,
          approvedEnrollments: enrollments.filter((e: any) => e.status?.toUpperCase() === "APPROVED").length,
          pendingEnrollments: enrollments.filter((e: any) => e.status?.toUpperCase() === "PENDING").length,
          rejectedEnrollments: enrollments.filter((e: any) => e.status?.toUpperCase() === "REJECTED").length,
          availableCourses: courses.length,
        });
      } catch {
        // Silent fail
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user?.email]);

  const statCards = [
    { 
      label: "Total Enrollments", 
      value: stats.totalEnrollments, 
      icon: BookOpen, 
      iconBg: "bg-sky-500", 
      cardBg: dark ? "bg-sky-900/30" : "bg-sky-50",
      onClick: () => navigate("/my-enrollments")
    },
    { 
      label: "Approved", 
      value: stats.approvedEnrollments, 
      icon: CheckCircle, 
      iconBg: "bg-green-500", 
      cardBg: dark ? "bg-green-900/30" : "bg-green-50",
      onClick: () => navigate("/my-enrollments")
    },
    { 
      label: "Pending", 
      value: stats.pendingEnrollments, 
      icon: Clock, 
      iconBg: "bg-yellow-500", 
      cardBg: dark ? "bg-yellow-900/30" : "bg-yellow-50",
      onClick: () => navigate("/my-enrollments")
    },
    { 
      label: "Available Courses", 
      value: stats.availableCourses, 
      icon: BookOpen, 
      iconBg: "bg-purple-500", 
      cardBg: dark ? "bg-purple-900/30" : "bg-purple-50",
      onClick: () => navigate("/available-courses")
    },
  ];

  const quickLinks = [
    { 
      title: "Available Courses", 
      desc: "Browse and enroll in courses for your department", 
      icon: BookOpen, 
      link: "/available-courses", 
      iconBg: "bg-green-500" 
    },
    { 
      title: "My Enrollments", 
      desc: "Track your course enrollment status", 
      icon: FileText, 
      link: "/my-enrollments", 
      iconBg: "bg-purple-500" 
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className={dark ? "text-gray-400" : "text-muted-foreground"}>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className={`flex gap-6 p-6 min-h-full ${dark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Main Content */}
      <div className="flex-1 space-y-6 min-w-0">
        {/* Header */}
        <div>
          <h1 className={`text-2xl font-bold ${dark ? 'text-gray-100' : 'text-gray-800'}`}>
            Welcome back, {displayName} 👋
          </h1>
          <p className={`text-sm mt-0.5 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>Here's your enrollment overview</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-4 gap-4">
          {statCards.map((s) => (
            <button
              key={s.label}
              onClick={s.onClick}
              className={`rounded-2xl p-5 ${s.cardBg} border shadow-sm hover:shadow-md transition-all text-left ${
                dark ? 'border-gray-700' : 'border-white'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${s.iconBg}`}>
                  <s.icon className="h-5 w-5 text-white" />
                </div>
              </div>
              <p className={`text-xs mb-1 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{s.label}</p>
              <p className={`text-2xl font-bold ${dark ? 'text-gray-100' : 'text-gray-800'}`}>{s.value}</p>
            </button>
          ))}
        </div>

        {/* Quick Links */}
        <div className={`rounded-2xl shadow-sm border p-6 ${
          dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
        }`}>
          <div className="mb-4">
            <h2 className={`text-base font-bold ${dark ? 'text-gray-100' : 'text-gray-800'}`}>Quick Actions</h2>
            <p className={`text-xs ${dark ? 'text-gray-500' : 'text-gray-400'}`}>Navigate to your most used sections</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {quickLinks.map((c) => (
              <button
                key={c.title}
                onClick={() => navigate(c.link)}
                className={`flex flex-col items-start gap-3 rounded-xl border p-4 hover:shadow-md hover:-translate-y-0.5 transition-all text-left ${
                  dark ? 'border-gray-700 hover:bg-gray-700/50' : 'border-gray-100'
                }`}
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${c.iconBg}`}>
                  <c.icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className={`text-sm font-semibold ${dark ? 'text-gray-100' : 'text-gray-800'}`}>{c.title}</p>
                  <p className={`text-xs mt-0.5 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>{c.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Enrollment Status Summary */}
        {stats.pendingEnrollments > 0 && (
          <Card className={dark ? "bg-yellow-900/30 border-yellow-800" : "bg-yellow-50 border-yellow-200"}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className={`font-semibold ${dark ? 'text-gray-100' : 'text-gray-800'}`}>
                    You have {stats.pendingEnrollments} pending enrollment{stats.pendingEnrollments > 1 ? 's' : ''}
                  </p>
                  <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-600'}`}>Waiting for instructor approval</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Right Panel */}
      <div className="w-72 shrink-0 space-y-5">
        {/* Browse Courses card */}
        <div className="rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 p-6 text-white shadow-sm">
          <h2 className="text-lg font-bold mb-1">Explore Courses</h2>
          <p className="text-xs text-blue-100 mb-5">
            {stats.availableCourses} course{stats.availableCourses !== 1 ? 's' : ''} available for enrollment
          </p>
          <button
            onClick={() => navigate("/available-courses")}
            className="w-full rounded-xl bg-white py-2.5 text-sm font-semibold text-blue-600 hover:bg-blue-50 transition flex items-center justify-center gap-1"
          >
            <BookOpen className="h-4 w-4" /> Browse Courses
          </button>
        </div>

        {/* Quick Summary */}
        <div className={`rounded-2xl shadow-sm border p-6 ${
          dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
        }`}>
          <h2 className={`text-base font-bold mb-4 ${dark ? 'text-gray-100' : 'text-gray-800'}`}>Enrollment Summary</h2>
          <div className="space-y-3">
            <div className={`flex items-center justify-between py-2 border-b ${dark ? 'border-gray-700' : 'border-gray-50'}`}>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className={`text-sm ${dark ? 'text-gray-300' : 'text-gray-600'}`}>Approved</span>
              </div>
              <span className={`text-sm font-semibold ${dark ? 'text-gray-100' : 'text-gray-800'}`}>{stats.approvedEnrollments}</span>
            </div>
            <div className={`flex items-center justify-between py-2 border-b ${dark ? 'border-gray-700' : 'border-gray-50'}`}>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-yellow-600" />
                <span className={`text-sm ${dark ? 'text-gray-300' : 'text-gray-600'}`}>Pending</span>
              </div>
              <span className={`text-sm font-semibold ${dark ? 'text-gray-100' : 'text-gray-800'}`}>{stats.pendingEnrollments}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-600" />
                <span className={`text-sm ${dark ? 'text-gray-300' : 'text-gray-600'}`}>Rejected</span>
              </div>
              <span className={`text-sm font-semibold ${dark ? 'text-gray-100' : 'text-gray-800'}`}>{stats.rejectedEnrollments}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
