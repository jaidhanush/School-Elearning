import { useEffect, useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import ApiService from "@/api/ApiService";

interface Course {
  courseId: number;
  courseCode: string;
  courseName: string;
  courseDesc: string;
  departmentId: number;
  departmentName: string;
  teacherId: number;
  teacherName: string;
}

interface Department {
  departmentId: number;
  departmentName: string;
}

interface Teacher {
  teacherId: number;
  name: string;
}

const defaultForm = { courseCode: "", courseName: "", courseDesc: "" };

export default function CourseList() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [departmentId, setDepartmentId] = useState("");
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);
  const [assigningCourseId, setAssigningCourseId] = useState<number | null>(null);

  const fetchCourses = () => {
    setLoading(true);
    ApiService.get("/api/courses/course")
      .then((res) => {
        const data = Array.isArray(res.data)
          ? res.data
          : res.data?.content ?? res.data?.data ?? [];
        setCourses(data);
      })
      .catch(() => toast.error("Failed to load courses"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCourses();
    ApiService.get("/api/departments")
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data?.content ?? res.data?.data ?? [];
        setDepartments(data);
      })
      .catch(() => toast.error("Failed to load departments"));
    ApiService.get("/api/teachers")
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data?.content ?? res.data?.data ?? [];
        setTeachers(data);
      })
      .catch(() => toast.error("Failed to load teachers"));
  }, []);

  const closeForm = () => {
    setShowForm(false);
    setDepartmentId("");
    setForm(defaultForm);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!departmentId) return toast.error("Please select a department");
    setSaving(true);
    try {
      await ApiService.post(`/api/courses/course/${departmentId}`, form);
      toast.success("Course created successfully!");
      closeForm();
      fetchCourses();
    } catch {
      toast.error("Failed to create course");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await ApiService.delete(`/api/courses/course/${id}`);
      toast.success("Course deleted");
      setCourses((prev) => prev.filter((c) => c.courseId !== id));
    } catch {
      toast.error("Failed to delete course");
    }
  };

  const handleAssignTeacher = async (courseId: number, teacherId: string) => {
    if (!teacherId) return;
    setAssigningCourseId(courseId);
    try {
      const res = await ApiService.put(`/api/courses/course/${courseId}/${teacherId}`, {});
      toast.success("Teacher assigned successfully!");
      setCourses((prev) =>
        prev.map((c) =>
          c.courseId === courseId
            ? { ...c, teacherId: res.data.teacherId, teacherName: res.data.teacherName }
            : c
        )
      );
    } catch {
      toast.error("Failed to assign teacher");
    } finally {
      setAssigningCourseId(null);
    }
  };

  return (
    <div className="space-y-6 p-2">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-violet-700 to-violet-500 px-8 py-7 text-white shadow-lg">
        <p className="text-xs font-medium uppercase tracking-widest text-violet-200 mb-1">
          Admin Panel
        </p>
        <h1 className="text-2xl font-bold">Course Management</h1>
        <p className="text-sm text-violet-100 mt-1">
          Add, view and delete courses
        </p>
      </div>

      {/* Add Button */}
      <div className="flex justify-end">
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="h-4 w-4" /> Add Course
        </Button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-md shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Add New Course</CardTitle>
              <button onClick={closeForm}>
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <Label>Department <span className="text-red-500">*</span></Label>
                  <Select value={departmentId} onValueChange={setDepartmentId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((d) => (
                        <SelectItem key={d.departmentId} value={String(d.departmentId)}>
                          {d.departmentId} - {d.departmentName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label>Course Code</Label>
                  <Input
                    placeholder="e.g. CS101"
                    value={form.courseCode}
                    onChange={(e) => setForm({ ...form, courseCode: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label>Course Name</Label>
                  <Input
                    placeholder="e.g. Introduction to CS"
                    value={form.courseName}
                    onChange={(e) => setForm({ ...form, courseName: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Course description..."
                    value={form.courseDesc}
                    onChange={(e) => setForm({ ...form, courseDesc: e.target.value })}
                    required
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <Button type="submit" className="flex-1" disabled={saving}>
                    {saving ? "Saving..." : "Add Course"}
                  </Button>
                  <Button type="button" variant="outline" onClick={closeForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Course Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">All Courses</CardTitle>
          <span className="text-xs text-muted-foreground">{courses.length} total</span>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : courses.length === 0 ? (
            <p className="text-sm text-muted-foreground">No courses found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-3 pr-4">#</th>
                    <th className="pb-3 pr-4">ID</th>
                    <th className="pb-3 pr-4">Code</th>
                    <th className="pb-3 pr-4">Course Name</th>
                    <th className="pb-3 pr-4">Description</th>
                    <th className="pb-3 pr-4">Department</th>
                    <th className="pb-3 pr-4">Teacher</th>
                    <th className="pb-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((c, i) => (
                    <tr key={c.courseId} className="border-b last:border-0 hover:bg-muted/40 transition-colors">
                      <td className="py-3 pr-4 text-muted-foreground">{i + 1}</td>
                      <td className="py-3 pr-4 text-muted-foreground">{c.courseId}</td>
                      <td className="py-3 pr-4 font-medium">{c.courseCode}</td>
                      <td className="py-3 pr-4">{c.courseName}</td>
                      <td className="py-3 pr-4 max-w-[200px] truncate">{c.courseDesc}</td>
                      <td className="py-3 pr-4">{c.departmentId} - {c.departmentName}</td>
                      <td className="py-3 pr-4">
                        <Select
                          value={c.teacherId ? String(c.teacherId) : ""}
                          onValueChange={(v) => handleAssignTeacher(c.courseId, v)}
                          disabled={assigningCourseId === c.courseId}
                        >
                          <SelectTrigger className="h-8 w-44 text-xs">
                            <SelectValue placeholder="Assign teacher" />
                          </SelectTrigger>
                          <SelectContent>
                            {teachers.map((t) => (
                              <SelectItem key={t.teacherId} value={String(t.teacherId)}>
                                {t.teacherId} - {t.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="py-3">
                        <button
                          onClick={() => handleDelete(c.courseId)}
                          className="inline-flex items-center gap-1 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 transition-colors"
                        >
                          <Trash2 className="h-3 w-3" /> Delete
                        </button>
                      </td>
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
