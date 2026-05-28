import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import ApiService from "@/api/ApiService";
import { Search, BookOpen } from "lucide-react";
import { toast } from "sonner";

interface AvailableCourse {
  courseId: number;
  courseCode: string;
  courseName: string;
  courseDesc: string;
  departmentId: number;
  departmentName: string;
  teacherId: number;
  teacherName: string;
}

function getStudentId(email: string | undefined): number {
  if (!email) return 0;
  const stored = localStorage.getItem("user");
  if (stored) { const parsed = JSON.parse(stored); const id = Number(parsed.id); if (id > 0) return id; }
  return Number(localStorage.getItem(`studentId_${email}`)) || 0;
}

export default function AvailableCourses() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<AvailableCourse[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState<number | null>(null);

  useEffect(() => {
    ApiService.get("/api/students/courses/available")
      .then((res) => setCourses(res.data))
      .catch(() => toast.error("Failed to load available courses"))
      .finally(() => setLoading(false));
  }, []);

  const handleEnroll = async (courseId: number) => {
    const studentId = getStudentId(user?.email);
    if (!studentId) { toast.error("Student ID not found. Please re-login."); return; }
    setEnrolling(courseId);
    try {
      await ApiService.post(`/api/enrollments/${studentId}/${courseId}`);
      toast.success("Enrollment request submitted successfully!");
      setCourses(courses.filter((c) => c.courseId !== courseId));
    } catch (err: any) {
      toast.error(ApiService.handleAxiosError(err, "Failed to enroll"));
    } finally {
      setEnrolling(null);
    }
  };

  const filtered = courses.filter(
    (c) => c.courseName.toLowerCase().includes(search.toLowerCase()) || c.courseCode.toLowerCase().includes(search.toLowerCase())
  );

  if (loading)
    return <div className="flex items-center justify-center h-40 text-gray-500">Loading courses...</div>;

  return (
    <div className="space-y-6 p-6 min-h-full bg-gradient-to-br from-[#FFFEF8] via-[#FFF7DA] to-[#FFE8AA]">

      <div className="rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-500 px-8 py-7 text-black shadow-lg shadow-yellow-200">
        <p className="text-xs font-medium uppercase tracking-widest text-black/60 mb-1">Student</p>
        <h1 className="text-2xl font-bold">Available Courses</h1>
        <p className="text-sm text-black/70 mt-1">Courses available for your department</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-orange-500" />
        <input
          placeholder="Search courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-yellow-200 text-gray-800 placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <BookOpen className="h-12 w-12 text-yellow-500/30 mx-auto mb-3" />
          <p className="text-gray-500">No courses found.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <div key={c.courseId} className="rounded-2xl border border-yellow-200 bg-white p-5 hover:bg-yellow-50 hover:border-yellow-400/40 transition-all flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-orange-500 bg-yellow-100 px-2 py-0.5 rounded-full">{c.courseCode}</span>
                <span className="text-xs text-gray-500">{c.departmentName}</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">{c.courseName}</h3>
                {c.teacherName && <p className="text-xs text-yellow-500 mt-0.5">👨🏫 {c.teacherName}</p>}
              </div>
              <p className="text-sm text-gray-500 flex-1">{c.courseDesc}</p>
              <button
                onClick={() => handleEnroll(c.courseId)}
                disabled={enrolling === c.courseId}
                className="w-full py-2 rounded-xl text-sm font-semibold text-black bg-gradient-to-r from-yellow-400 to-orange-500 hover:scale-[1.02] transition disabled:opacity-60"
              >
                {enrolling === c.courseId ? "Enrolling..." : "Enroll"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
