import { Outlet } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { useAuth } from "@/context/AuthContext";
import { Bell, Search, X } from "lucide-react";
import { useState } from "react";
import { ThemeProvider } from "@/context/ThemeContext";

function Layout() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const initials = user?.email?.slice(0, 2).toUpperCase() ?? "U";
  const displayName = user?.name || user?.email?.split("@")[0] || "User";
  const role = user?.role ?? "USER";

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gradient-to-br from-[#FFFEF8] via-[#FFF7DA] to-[#FFE8AA]">
      <AppSidebar />

      <div className="flex flex-1 flex-col overflow-hidden">

        {/* Top Navbar */}
        <header className="flex h-16 shrink-0 items-center gap-4 border-b border-yellow-200 px-6 bg-white/60 backdrop-blur-xl">

          {/* Search */}
          <div className="flex items-center gap-2 rounded-full border border-yellow-200 bg-white px-4 py-2 w-64 shadow-sm">
            {search ? (
              <button onClick={() => setSearch("")}>
                <X className="h-4 w-4 text-gray-400" />
              </button>
            ) : (
              <Search className="h-4 w-4 shrink-0 text-gray-400" />
            )}
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400 text-gray-700"
            />
          </div>

          <div className="flex-1" />

          {/* Bell */}
          <button className="relative flex h-9 w-9 items-center justify-center rounded-full hover:bg-yellow-100 transition">
            <Bell className="h-5 w-5 text-gray-500" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-orange-500" />
          </button>

          {/* Divider */}
          <div className="h-6 w-px bg-yellow-200" />

          {/* User avatar + name */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 text-xs font-bold text-black shadow-md">
              {initials}
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-gray-800">{displayName}</p>
              <p className="text-xs uppercase text-orange-500 font-medium">{role}</p>
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
