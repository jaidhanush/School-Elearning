import { mockCourses } from "@/services/mockData";
import { BookOpen, Users, Clock } from "lucide-react";

export default function MyCourses() {
  const courses = mockCourses.filter((c) => c.teacherId === 1);

  return (
    <div className="space-y-6 p-6 min-h-full bg-gradient-to-br from-[#FFFEF8] via-[#FFF7DA] to-[#FFE8AA]">

      <div className="rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-500 px-8 py-7 text-black shadow-lg shadow-yellow-200">
        <p className="text-xs font-medium uppercase tracking-widest text-black/60 mb-1">Teacher</p>
        <h1 className="text-2xl font-bold">My Courses</h1>
        <p className="text-sm text-black/70 mt-1">Courses you are currently teaching</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((c) => (
          <div key={c.id} className="rounded-2xl border border-yellow-200 bg-white p-5 hover:bg-yellow-50 hover:border-yellow-400/40 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-orange-500 bg-yellow-100 px-2 py-0.5 rounded-full">{c.code}</span>
              <span className="text-xs text-gray-500">{c.credits} credits</span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-3">{c.name}</h3>
            <div className="space-y-2 text-sm text-gray-500">
              <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-yellow-500" />{c.schedule}</div>
              <div className="flex items-center gap-2"><Users className="h-4 w-4 text-yellow-500" />{c.enrolled}/{c.capacity} students</div>
            </div>
            <div className="mt-3 h-1.5 rounded-full bg-yellow-50">
              <div className="h-1.5 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500" style={{ width: `${(c.enrolled / c.capacity) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
