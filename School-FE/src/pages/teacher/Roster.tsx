import { mockEnrollments } from "@/services/mockData";

const roster = mockEnrollments.filter((e) => e.status === "APPROVED" && [1, 2].includes(e.courseId));

export default function Roster() {
  return (
    <div className="space-y-6 p-6 min-h-full bg-gradient-to-br from-[#FFFEF8] via-[#FFF7DA] to-[#FFE8AA]">

      <div className="rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-500 px-8 py-7 text-black shadow-lg shadow-yellow-200">
        <p className="text-xs font-medium uppercase tracking-widest text-black/60 mb-1">Teacher</p>
        <h1 className="text-2xl font-bold">Student Roster</h1>
        <p className="text-sm text-black/70 mt-1">Students enrolled in your courses</p>
      </div>

      <div className="rounded-2xl border border-yellow-200 bg-white">
        <div className="p-6 pb-4">
          <h2 className="text-base font-bold text-gray-800">Enrolled Students</h2>
        </div>
        <div className="px-6 pb-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-yellow-200 text-left text-gray-500">
                <th className="pb-3 pr-4">Student</th>
                <th className="pb-3 pr-4">Course</th>
                <th className="pb-3 pr-4">Code</th>
                <th className="pb-3 pr-4">Enrolled Date</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {roster.map((r, i) => (
                <tr key={i} className="border-b border-yellow-100 last:border-0 hover:bg-yellow-50 transition-colors">
                  <td className="py-3 pr-4 font-medium text-gray-800">{r.studentName}</td>
                  <td className="py-3 pr-4 text-gray-600">{r.courseName}</td>
                  <td className="py-3 pr-4"><span className="text-xs font-mono text-orange-500 bg-yellow-100 px-2 py-0.5 rounded-full">{r.courseCode}</span></td>
                  <td className="py-3 pr-4 text-gray-500">{r.enrolledAt}</td>
                  <td className="py-3"><span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">{r.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
