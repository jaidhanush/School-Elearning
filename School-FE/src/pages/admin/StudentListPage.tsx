import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import ApiService from "@/api/ApiService";

interface Student {
  studentId: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  gender: string;
  departmentId: number;
  departmentName: string;
  userEmail: string;
}

export default function StudentListPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ApiService.get("/api/students")
      .then((res) => {
        const data = Array.isArray(res.data)
          ? res.data
          : res.data?.content ?? res.data?.data ?? [];
        setStudents(data);
      })
      .catch(() => toast.error("Failed to load students"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 p-6 min-h-full bg-gradient-to-br from-[#FFFEF8] via-[#FFF7DA] to-[#FFE8AA]">
      <div className="rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-500 px-8 py-7 text-black shadow-lg">
        <p className="text-xs font-medium uppercase tracking-widest text-black/60 mb-1">Admin Panel</p>
        <h1 className="text-2xl font-bold">Student List</h1>
        <p className="text-sm text-black/70 mt-1">All registered students</p>
      </div>
      <div className="rounded-2xl bg-white shadow-md border border-yellow-100">
        <div className="flex flex-row items-center justify-between p-6 pb-4">
          <h2 className="text-base font-bold text-gray-800">Registered Students</h2>
          <span className="text-xs text-gray-500">{students.length} total</span>
        </div>
        <div className="px-6 pb-6">
          {loading ? <p className="text-sm text-gray-500">Loading...</p> : students.length === 0 ? <p className="text-sm text-gray-500">No students found.</p> : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-yellow-100 text-left text-gray-500">
                  <th className="pb-3 pr-4">#</th><th className="pb-3 pr-4">ID</th><th className="pb-3 pr-4">First Name</th><th className="pb-3 pr-4">Last Name</th><th className="pb-3 pr-4">Phone</th><th className="pb-3 pr-4">Gender</th><th className="pb-3 pr-4">Department</th><th className="pb-3">Email</th>
                </tr></thead>
                <tbody>
                  {students.map((s, i) => (
                    <tr key={s.studentId} className="border-b border-yellow-50 last:border-0 hover:bg-yellow-50 transition-colors">
                      <td className="py-3 pr-4 text-gray-500">{i + 1}</td>
                      <td className="py-3 pr-4 text-gray-500">{s.studentId}</td>
                      <td className="py-3 pr-4 font-medium text-gray-800">{s.firstName}</td>
                      <td className="py-3 pr-4 text-gray-600">{s.lastName}</td>
                      <td className="py-3 pr-4 text-gray-600">{s.phoneNumber}</td>
                      <td className="py-3 pr-4 text-gray-600">{s.gender}</td>
                      <td className="py-3 pr-4 text-gray-600">{s.departmentId} - {s.departmentName}</td>
                      <td className="py-3 text-gray-600">{s.userEmail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
