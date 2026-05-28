import { useState } from "react";
import { mockAttendance, mockCourses } from "@/services/mockData";
import type { AttendanceRecord } from "@/types";

export default function Attendance() {
  const teacherCourses = mockCourses.filter((c) => c.teacherId === 1);
  const [selectedCourse, setSelectedCourse] = useState(String(teacherCourses[0]?.id ?? ""));
  const filtered = mockAttendance.filter((a) => a.courseId === Number(selectedCourse));

  const statusStyle = (status: string) => {
    switch (status?.toUpperCase()) {
      case "PRESENT": return "bg-green-100 text-green-600";
      case "ABSENT": return "bg-red-100 text-red-600";
      default: return "bg-yellow-100 text-orange-500";
    }
  };

  return (
    <div className="space-y-6 p-6 min-h-full bg-gradient-to-br from-[#FFFEF8] via-[#FFF7DA] to-[#FFE8AA]">

      <div className="rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-500 px-8 py-7 text-black shadow-lg shadow-yellow-200">
        <p className="text-xs font-medium uppercase tracking-widest text-black/60 mb-1">Teacher</p>
        <h1 className="text-2xl font-bold">Attendance</h1>
        <p className="text-sm text-black/70 mt-1">Track student attendance by course</p>
      </div>

      <select
        value={selectedCourse}
        onChange={(e) => setSelectedCourse(e.target.value)}
        className="w-64 bg-white border border-yellow-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-yellow-400 transition"
      >
        {teacherCourses.map((c) => (
          <option key={c.id} value={String(c.id)} className="bg-white">{c.code} — {c.name}</option>
        ))}
      </select>

      <div className="rounded-2xl border border-yellow-200 bg-white">
        <div className="p-6 pb-4">
          <h2 className="text-base font-bold text-gray-800">Attendance Records</h2>
        </div>
        <div className="px-6 pb-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-yellow-200 text-left text-gray-500">
                <th className="pb-3 pr-4">Student</th>
                <th className="pb-3 pr-4">Date</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r: AttendanceRecord, i) => (
                <tr key={i} className="border-b border-yellow-100 last:border-0 hover:bg-yellow-50 transition-colors">
                  <td className="py-3 pr-4 font-medium text-gray-800">{r.studentName}</td>
                  <td className="py-3 pr-4 text-gray-500">{r.date}</td>
                  <td className="py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyle(r.status)}`}>{r.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
