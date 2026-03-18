import { Users, GraduationCap, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const cards = [
  {
    title: "Add Teacher",
    desc: "Register a new teacher and assign department",
    icon: Users,
    link: "/admin/teachers",
    gradient: "from-blue-600 to-blue-400",
    shadow: "shadow-blue-200",
  },
  {
    title: "Student List",
    desc: "View all registered students",
    icon: GraduationCap,
    link: "/admin/students",
    gradient: "from-emerald-600 to-emerald-400",
    shadow: "shadow-emerald-200",
  },
];

export default function AddUserPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8 p-2">
      <div className="rounded-2xl bg-gradient-to-r from-slate-800 to-slate-700 px-8 py-8 text-white shadow-lg">
        <p className="text-sm font-medium text-slate-400 uppercase tracking-widest mb-1">Admin Panel</p>
        <h1 className="text-3xl font-bold">Add User</h1>
        <p className="mt-1 text-slate-300 text-sm">Manage teachers and view students</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {cards.map((c) => (
          <button
            key={c.title}
            onClick={() => navigate(c.link)}
            className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${c.gradient} ${c.shadow} shadow-lg p-8 text-left text-white transition-all duration-200 hover:scale-[1.03] hover:shadow-xl`}
          >
            <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/10" />
            <div className="absolute -right-2 -bottom-8 h-20 w-20 rounded-full bg-white/10" />
            <div className="relative mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-white/20">
              <c.icon className="h-7 w-7 text-white" />
            </div>
            <h3 className="relative text-xl font-bold">{c.title}</h3>
            <p className="relative mt-1 text-sm text-white/75">{c.desc}</p>
            <div className="relative mt-6 flex items-center gap-1 text-xs font-semibold text-white/80 group-hover:text-white transition-colors">
              Open <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
