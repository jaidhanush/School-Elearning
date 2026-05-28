import { useState } from "react";
import { mockGrades } from "@/services/mockData";
import { toast } from "sonner";
import type { Grade } from "@/types";

export default function Grades() {
  const [grades, setGrades] = useState(mockGrades);
  const [editGrade, setEditGrade] = useState<Grade | null>(null);
  const [score, setScore] = useState("");
  const [grade, setGrade] = useState("");

  const handleSave = () => {
    if (!editGrade) return;
    setGrades((prev) => prev.map((g) => g.id === editGrade.id ? { ...g, grade, score: Number(score) } : g));
    toast.success("Grade updated");
    setEditGrade(null);
  };

  const inputClass = "w-full bg-white border border-yellow-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-yellow-400 transition";

  return (
    <div className="space-y-6 p-6 min-h-full bg-gradient-to-br from-[#FFFEF8] via-[#FFF7DA] to-[#FFE8AA]">

      <div className="rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-500 px-8 py-7 text-black shadow-lg shadow-yellow-200">
        <p className="text-xs font-medium uppercase tracking-widest text-black/60 mb-1">Teacher</p>
        <h1 className="text-2xl font-bold">Grades</h1>
        <p className="text-sm text-black/70 mt-1">Manage student grades</p>
      </div>

      <div className="rounded-2xl border border-yellow-200 bg-white">
        <div className="p-6 pb-4">
          <h2 className="text-base font-bold text-gray-800">Student Grades</h2>
        </div>
        <div className="px-6 pb-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-yellow-200 text-left text-gray-500">
                <th className="pb-3 pr-4">Student</th>
                <th className="pb-3 pr-4">Course</th>
                <th className="pb-3 pr-4">Grade</th>
                <th className="pb-3 pr-4">Score</th>
                <th className="pb-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {grades.map((g) => (
                <tr key={g.id} className="border-b border-yellow-100 last:border-0 hover:bg-yellow-50 transition-colors">
                  <td className="py-3 pr-4 font-medium text-gray-800">{g.studentName}</td>
                  <td className="py-3 pr-4 text-gray-600">{g.courseName}</td>
                  <td className="py-3 pr-4"><span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-orange-600">{g.grade}</span></td>
                  <td className="py-3 pr-4 text-gray-600">{g.score}</td>
                  <td className="py-3">
                    <button onClick={() => { setEditGrade(g); setScore(String(g.score)); setGrade(g.grade); }} className="inline-flex items-center gap-1 rounded-lg bg-yellow-100 px-3 py-1.5 text-xs font-medium text-orange-600 hover:bg-yellow-500/30 transition-colors">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editGrade && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="w-full max-w-sm rounded-2xl border border-yellow-200 bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Edit Grade — {editGrade.studentName}</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Grade</label>
                <input value={grade} onChange={(e) => setGrade(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Score</label>
                <input type="number" value={score} onChange={(e) => setScore(e.target.value)} className={inputClass} />
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={() => setEditGrade(null)} className="flex-1 py-2.5 rounded-xl text-sm font-medium text-gray-600 border border-yellow-200 hover:bg-white transition">Cancel</button>
              <button onClick={handleSave} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-black bg-gradient-to-r from-yellow-400 to-orange-500 hover:scale-[1.02] transition">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
