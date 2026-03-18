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
      .then((res) => setStudents(res.data))
      .catch(() => toast.error("Failed to load students"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 p-2">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-700 to-emerald-500 px-8 py-7 text-white shadow-lg">
        <p className="text-xs font-medium uppercase tracking-widest text-emerald-200 mb-1">Admin Panel</p>
        <h1 className="text-2xl font-bold">Student List</h1>
        <p className="text-sm text-emerald-100 mt-1">All registered students</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Registered Students</CardTitle>
          <span className="text-xs text-muted-foreground">{students.length} total</span>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : students.length === 0 ? (
            <p className="text-sm text-muted-foreground">No students found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-3 pr-4">#</th>
                    <th className="pb-3 pr-4">First Name</th>
                    <th className="pb-3 pr-4">Last Name</th>
                    <th className="pb-3 pr-4">Phone</th>
                    <th className="pb-3 pr-4">Gender</th>
                    <th className="pb-3 pr-4">Department</th>
                    <th className="pb-3">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s, i) => (
                    <tr key={s.studentId} className="border-b last:border-0 hover:bg-muted/40 transition-colors">
                      <td className="py-3 pr-4 text-muted-foreground">{i + 1}</td>
                      <td className="py-3 pr-4 font-medium">{s.firstName}</td>
                      <td className="py-3 pr-4">{s.lastName}</td>
                      <td className="py-3 pr-4">{s.phoneNumber}</td>
                      <td className="py-3 pr-4">{s.gender}</td>
                      <td className="py-3 pr-4">{s.departmentName ?? s.departmentId}</td>
                      <td className="py-3">{s.userEmail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
