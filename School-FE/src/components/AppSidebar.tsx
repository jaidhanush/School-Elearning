import {
  LayoutDashboard,
  BookOpen,
  Building2,
  BookMarked,
  ListChecks,
  Award,
  CalendarCheck,
  ShoppingCart,
  FileText,
  LogOut,
  UserPlus,
  GraduationCap,
  Settings,
  ClipboardCheck,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

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
  const { dark } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const menu =
    user?.role?.toUpperCase() === "ADMIN"
      ? adminMenu
      : user?.role?.toUpperCase() === "TEACHER"
      ? teacherMenu
      : studentMenu;

  return (
    <div className={`flex h-screen w-56 shrink-0 flex-col border-r ${
      dark 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-100'
    }`}>
      {/* Logo */}
      <div className={`flex items-center gap-2.5 px-5 py-5 border-b ${
        dark ? 'border-gray-700' : 'border-gray-100'
      }`}>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500">
          <BookOpen className="h-5 w-5 text-white" />
        </div>
        <span className="text-lg font-extrabold text-sky-500 tracking-tight">EduHub</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {menu.map((item) => {
          const active = location.pathname === item.url;
          return (
            <button
              key={item.title}
              onClick={() => navigate(item.url)}
              className={`flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all
                ${active
                  ? "bg-sky-500 text-white"
                  : dark
                    ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                }`}
            >
              <item.icon className={`h-4 w-4 shrink-0 ${
                active 
                  ? "text-white" 
                  : dark 
                    ? "text-gray-400" 
                    : "text-gray-400"
              }`} />
              {item.title}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className={`border-t px-3 py-3 space-y-0.5 ${
        dark ? 'border-gray-700' : 'border-gray-100'
      }`}>
        <button className={`flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
          dark 
            ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
        }`}>
          <Settings className={`h-4 w-4 ${dark ? 'text-gray-400' : 'text-gray-400'}`} />
          Settings
        </button>
        <button
          onClick={logout}
          className={`flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
            dark 
              ? 'text-red-400 hover:bg-red-900/20' 
              : 'text-red-500 hover:bg-red-50'
          }`}
        >
          <LogOut className="h-4 w-4" />
          Log Out
        </button>
      </div>
    </div>
  );
}
