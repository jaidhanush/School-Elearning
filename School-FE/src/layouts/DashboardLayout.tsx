import { Outlet } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { useAuth } from "@/context/AuthContext";
import { Bell, Search, Moon, X } from "lucide-react";
import { useState } from "react";
import { ThemeProvider } from "@/context/ThemeContext";

function Layout() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const initials = user?.email?.slice(0, 2).toUpperCase() ?? "U";
  const displayName = user?.name || user?.email?.split("@")[0] || "User";
  const role = user?.role ?? "USER";

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50">
      <AppSidebar />

      <div className="flex flex-1 flex-col overflow-hidden">

        {/* Top Navbar */}
        <header className="flex h-16 shrink-0 items-center gap-4 border-b border-gray-100 bg-white px-6">

          {/* Search */}
          <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 w-64">
            {search ? (
              <button onClick={() => setSearch("")}>
                <X className="h-4 w-4 text-gray-400" />
              </button>
            ) : (
              <Search className="h-4 w-4 text-gray-400 shrink-0" />
            )}
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400 text-gray-600"
            />
          </div>

          <div className="flex-1" />

          {/* Moon icon */}
          <button className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-100 transition">
            <Moon className="h-5 w-5 text-gray-500" />
          </button>

          {/* Divider */}
          <div className="h-6 w-px bg-gray-200" />

          {/* Bell */}
          <button className="relative flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-100 transition">
            <Bell className="h-5 w-5 text-gray-500" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
          </button>

          {/* Divider */}
          <div className="h-6 w-px bg-gray-200" />

          {/* User avatar + name */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-500 text-xs font-bold text-white">
              {initials}
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-gray-800">{displayName}</p>
              <p className="text-xs text-gray-400 uppercase">{role}</p>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export function DashboardLayout() {
  return (
    <ThemeProvider>
      <Layout />
    </ThemeProvider>
  );
}
