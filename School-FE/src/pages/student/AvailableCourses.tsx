import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import ApiService from "@/api/ApiService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
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
  if (stored) {
    const parsed = JSON.parse(stored);
    const id = Number(parsed.id);
    if (id > 0) return id;
  }
  return Number(localStorage.getItem(`studentId_${email}`)) || 0;
}

export default function AvailableCourses() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<AvailableCourse[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState<number | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await ApiService.get("/api/students/courses/available");
        setCourses(res.data);
      } catch {
        toast.error("Failed to load available courses");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleEnroll = async (courseId: number) => {
    const studentId = getStudentId(user?.email);
    if (!studentId) {
      toast.error("Student ID not found. Please re-login.");
      return;
    }

    setEnrolling(courseId);
    try {
      await ApiService.post(`/api/enrollments/${studentId}/${courseId}`);
      toast.success("Enrollment request submitted successfully!");
      // Remove enrolled course from available list
      setCourses(courses.filter(c => c.courseId !== courseId));
    } catch (err: any) {
      const msg = ApiService.handleAxiosError(err, "Failed to enroll");
      toast.error(msg);
    } finally {
      setEnrolling(null);
    }
  };

  const filtered = courses.filter(
    (c) =>
      c.courseName.toLowerCase().includes(search.toLowerCase()) ||
      c.courseCode.toLowerCase().includes(search.toLowerCase())
  );

  if (loading)
    return <div className="flex items-center justify-center h-40 text-muted-foreground">Loading courses...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Available Courses</h1>
        <p className="text-muted-foreground">Courses available for your department</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-muted-foreground text-sm">No courses found.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <Card key={c.courseId}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-primary">{c.courseCode}</span>
                  <span className="text-xs text-muted-foreground">{c.departmentName}</span>
                </div>
                <CardTitle className="text-base">{c.courseName}</CardTitle>
                <p className="text-xs text-muted-foreground">{c.teacherName}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">{c.courseDesc}</p>
                <Button 
                  className="w-full" 
                  size="sm"
                  onClick={() => handleEnroll(c.courseId)}
                  disabled={enrolling === c.courseId}
                >
                  {enrolling === c.courseId ? "Enrolling..." : "Enroll"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
