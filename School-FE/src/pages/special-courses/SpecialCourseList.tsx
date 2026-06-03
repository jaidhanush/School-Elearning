import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Plus, Trash2, Pencil, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import ApiService from "@/api/ApiService";

interface SpecialCourse {
  specialCourseId: number;
  specialCourseCode: string;
  specialCourseName: string;
  specialCourseDesc: string;
  amount: number;
  departmentId: number;
  departmentName: string;
  teacherId: number | null;
  teacherName: string | null;
}

interface Department {
  departmentId: number;
  departmentName: string;
}

interface Teacher {
  teacherId: number;
  name: string;
  departmentId: number;
}

const defaultForm = { specialCourseCode: "", specialCourseName: "", specialCourseDesc: "", amount: "" };

export default function SpecialCourseList() {
  const [courses, setCourses] = useState<SpecialCourse[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<SpecialCourse | null>(null);
  const [departmentId, setDepartmentId] = useState("");
  const [form, setForm] = useState<{ specialCourseCode: string; specialCourseName: string; specialCourseDesc: string; amount: string }>(defaultForm);
  const [saving, setSaving] = useState(false);
  const [assigningCourseId, setAssigningCourseId] = useState<number | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchCourses = () => {
    setLoading(true);
    ApiService.get("/api/special-courses")
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data?.content ?? res.data?.data ?? [];
        setCourses(data);
      })
      .catch(() => toast.error("Failed to load special courses"))
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

  const openAdd = () => {
    setEditTarget(null);
    setForm(defaultForm);
    setDepartmentId("");
    setFormError(null);
    setShowForm(true);
  };

  const openEdit = (c: SpecialCourse) => {
    setEditTarget(c);
    setForm({ specialCourseCode: c.specialCourseCode, specialCourseName: c.specialCourseName, specialCourseDesc: c.specialCourseDesc, amount: String(c.amount) });
    setDepartmentId(String(c.departmentId));
    setFormError(null);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditTarget(null);
    setForm(defaultForm);
    setDepartmentId("");
    setFormError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!departmentId) return toast.error("Please select a department");
    setSaving(true);
    setFormError(null);
    try {
      const payload = { ...form, amount: Number(form.amount) };
      if (editTarget) {
        await ApiService.put(`/api/special-courses/course/${editTarget.specialCourseId}`, payload);
        toast.success("Special course updated successfully!");
      } else {
        await ApiService.post(`/api/special-courses/course/${departmentId}`, payload);
        toast.success("Special course created successfully!");
      }
      closeForm();
      fetchCourses();
    } catch (err: any) {
      const msg = ApiService.handleAxiosError(err, editTarget ? "Failed to update course" : "Failed to create course");
      setFormError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await ApiService.delete(`/api/special-courses/course/${id}`);
      toast.success("Special course deleted");
      setCourses((prev) => prev.filter((c) => c.specialCourseId !== id));
    } catch (err: any) {
      const msg = ApiService.handleAxiosError(err, "Failed to delete special course");
      toast.error(msg);
    }
  };

  const handleAssignTeacher = async (courseId: number, teacherId: string) => {
    if (!teacherId) return;
    setAssigningCourseId(courseId);
    try {
      const res = await ApiService.put(`/api/special-courses/course/${courseId}/${teacherId}`, {});
      toast.success("Teacher assigned successfully!");
      setCourses((prev) =>
        prev.map((c) =>
          c.specialCourseId === courseId
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
    <div className="space-y-6 p-6 min-h-full bg-gradient-to-br from-[#FFFEF8] via-[#FFF7DA] to-[#FFE8AA]">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-500 px-8 py-7 text-black shadow-lg shadow-yellow-200">
        <p className="text-xs font-medium uppercase tracking-widest text-black/60 mb-1">Admin Panel</p>
        <h1 className="text-2xl font-bold">Special Course Management</h1>
        <p className="text-sm text-black/70 mt-1">Add, view, edit and delete special courses</p>
      </div>

      {/* Add Button */}
      <div className="flex justify-end">
        <button onClick={openAdd} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold hover:scale-105 transition">
          <Plus className="h-4 w-4" /> Add Special Course
        </button>
      </div>

      {/* Form Modal */}
      {showForm && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-md shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{editTarget ? "Edit Special Course" : "Add New Special Course"}</CardTitle>
              <button onClick={closeForm}><X className="h-5 w-5 text-muted-foreground" /></button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {formError && (
                  <div className="rounded-xl bg-gradient-to-r from-yellow-50 to-orange-50 border border-orange-300 px-4 py-3 text-sm text-orange-700 font-medium">
                    ⚠️ {formError}
                  </div>
                )}

                <div className="space-y-1">
                  <Label>Department <span className="text-red-500">*</span></Label>
                  <Select value={departmentId} onValueChange={setDepartmentId} disabled={!!editTarget}>
                    <SelectTrigger className="bg-amber-50">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent className="z-[10000]" position="popper" sideOffset={4}>
                      {departments.map((d) => (
                        <SelectItem key={d.departmentId} value={String(d.departmentId)}>
                          {d.departmentName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label>Course Code</Label>
                  <input
                    placeholder="e.g. SC101"
                    value={form.specialCourseCode}
                    onChange={(e) => setForm({ ...form, specialCourseCode: e.target.value })}
                    required
                    className="w-full rounded-md border border-input bg-amber-50 px-3 py-2 text-sm outline-none focus:border-orange-400 focus:bg-white transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <Label>Course Name</Label>
                  <input
                    placeholder="e.g. Advanced Robotics"
                    value={form.specialCourseName}
                    onChange={(e) => setForm({ ...form, specialCourseName: e.target.value })}
                    required
                    className="w-full rounded-md border border-input bg-amber-50 px-3 py-2 text-sm outline-none focus:border-orange-400 focus:bg-white transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <Label>Description</Label>
                  <textarea
                    placeholder="Course description..."
                    value={form.specialCourseDesc}
                    onChange={(e) => setForm({ ...form, specialCourseDesc: e.target.value })}
                    required
                    rows={3}
                    className="w-full rounded-md border border-input bg-amber-50 px-3 py-2 text-sm outline-none focus:border-orange-400 focus:bg-white transition-colors resize-none"
                  />
                </div>

                <div className="space-y-1">
                  <Label>Amount (₹)</Label>
                  <input
                    type="number"
                    placeholder="e.g. 500"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    required
                    min="0"
                    className="w-full rounded-md border border-input bg-amber-50 px-3 py-2 text-sm outline-none focus:border-orange-400 focus:bg-white transition-colors"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <Button type="submit" className="flex-1" disabled={saving}>
                    {saving ? "Saving..." : editTarget ? "Update Course" : "Add Course"}
                  </Button>
                  <Button type="button" variant="outline" onClick={closeForm}>Cancel</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      , document.body)}

      {/* Table */}
      <div className="rounded-2xl border border-yellow-200 bg-white">
        <div className="flex flex-row items-center justify-between p-6 pb-4">
          <h2 className="text-base font-bold text-gray-800">All Special Courses</h2>
          <span className="text-xs text-gray-500">{courses.length} total</span>
        </div>
        <div className="px-6 pb-6">
          {loading ? (
            <p className="text-sm text-gray-500">Loading...</p>
          ) : courses.length === 0 ? (
            <p className="text-sm text-gray-500">No special courses found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-yellow-200 text-left text-gray-500">
                    <th className="pb-3 pr-4">#</th>
                    <th className="pb-3 pr-4">ID</th>
                    <th className="pb-3 pr-4">Code</th>
                    <th className="pb-3 pr-4">Course Name</th>
                    <th className="pb-3 pr-4">Description</th>
                    <th className="pb-3 pr-4">Amount</th>
                    <th className="pb-3 pr-4">Department</th>
                    <th className="pb-3 pr-4">Teacher</th>
                    <th className="pb-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((c, i) => {
                    const deptTeachers = teachers.filter((t) => t.departmentId === c.departmentId);
                    const current = deptTeachers.find((t) => t.teacherId === c.teacherId);
                    return (
                      <tr key={c.specialCourseId} className="border-b border-yellow-100 last:border-0 hover:bg-yellow-50 transition-colors">
                        <td className="py-3 pr-4 text-gray-500">{i + 1}</td>
                        <td className="py-3 pr-4 text-gray-500">{c.specialCourseId}</td>
                        <td className="py-3 pr-4 font-medium text-gray-800">{c.specialCourseCode}</td>
                        <td className="py-3 pr-4 text-gray-600">{c.specialCourseName}</td>
                        <td className="py-3 pr-4 max-w-[180px] truncate text-gray-600">{c.specialCourseDesc}</td>
                        <td className="py-3 pr-4 text-gray-600">₹{c.amount}</td>
                        <td className="py-3 pr-4 text-gray-600">{c.departmentId} - {c.departmentName}</td>
                        <td className="py-3 pr-4">
                          <Select
                            value={current ? String(current.teacherId) : ""}
                            onValueChange={(v) => handleAssignTeacher(c.courseId, v)}
                            disabled={assigningCourseId === c.courseId}
                          >
                            <SelectTrigger className="h-8 w-44 text-xs bg-white border-yellow-200 text-gray-600">
                              <SelectValue placeholder="Assign teacher" />
                            </SelectTrigger>
                            <SelectContent>
                              {deptTeachers.map((t) => (
                                <SelectItem key={t.teacherId} value={String(t.teacherId)}>
                                  {t.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <button onClick={() => openEdit(c)} className="inline-flex items-center gap-1 rounded-lg bg-yellow-100 px-3 py-1.5 text-xs font-medium text-orange-600 hover:bg-yellow-500/30 transition-colors">
                              <Pencil className="h-3 w-3" /> Edit
                            </button>
                            <button onClick={() => handleDelete(c.specialCourseId)} className="inline-flex items-center gap-1 rounded-lg bg-red-100 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-500/30 transition-colors">
                              <Trash2 className="h-3 w-3" /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
