import {
  LayoutDashboard, BookOpen, Building2, BookMarked, ListChecks,
  Award, CalendarCheck, ShoppingCart, FileText, LogOut, UserPlus,
  GraduationCap, Settings, ClipboardCheck,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const adminMenu = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Teachers", url: "/admin/teachers", icon: UserPlus },
  { title: "Students", url: "/admin/students", icon: GraduationCap },
  { title: "Courses", url: "/courses", icon: BookOpen },
  { title: "Department", url: "/departments", icon: Building2 },
  { title: "Enrollments", url: "/enrollments", icon: ClipboardCheck },
];

const teacherMenu = [
  { title: "My Courses", url: "/my-courses", icon: BookMarked },
  { title: "Roster", url: "/roster", icon: ListChecks },
  { title: "Grades", url: "/grades", icon: Award },
  { title: "Attendance", url: "/attendance", icon: CalendarCheck },
];

const studentMenu = [
  { title: "Dashboard", url: "/student-dashboard", icon: LayoutDashboard },
  { title: "Available Courses", url: "/available-courses", icon: ShoppingCart },
  { title: "My Enrollments", url: "/my-enrollments", icon: FileText },
];

export function AppSidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const menu =
    user?.role?.toUpperCase() === "ADMIN" ? adminMenu
    : user?.role?.toUpperCase() === "TEACHER" ? teacherMenu
    : studentMenu;

  return (
    <div className="flex h-screen w-56 shrink-0 flex-col border-r border-yellow-200 bg-white shadow-sm">

      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-yellow-100">
        <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-gradient-to-br from-yellow-300 via-amber-400 to-orange-400 shadow-lg">
          <BookOpen className="h-5 w-5 text-black" />
        </div>
        <span className="text-lg font-extrabold tracking-tight">
          <span className="bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">Edu</span>
          <span className="text-gray-800">Portal</span>
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {menu.map((item) => {
          const active = location.pathname === item.url;
          return (
            <button
              key={item.title}
              onClick={() => navigate(item.url)}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all
                ${active
                  ? "bg-gradient-to-r from-yellow-400 to-orange-400 text-black shadow-md"
                  : "text-gray-600 hover:bg-yellow-50 hover:text-gray-900"
                }`}
            >
              <item.icon className={`h-4 w-4 shrink-0 ${active ? "text-black" : "text-gray-400"}`} />
              {item.title}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-yellow-100 px-3 py-3 space-y-0.5">
        <button
          onClick={() => navigate("/settings")}
          className={`flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
            location.pathname === "/settings"
              ? "bg-gradient-to-r from-yellow-400 to-orange-400 text-black shadow-md"
              : "text-gray-600 hover:bg-yellow-50 hover:text-gray-900"
          }`}
        >
          <Settings className={`h-4 w-4 ${location.pathname === "/settings" ? "text-black" : "text-gray-400"}`} />
          Settings
        </button>
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 transition-all"
        >
          <LogOut className="h-4 w-4" />
          Log Out
        </button>
      </div>
    </div>
  );
}
