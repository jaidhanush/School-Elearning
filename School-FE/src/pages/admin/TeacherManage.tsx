import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Plus, Trash2, Pencil, X, Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

interface Teacher {
  teacherId: number;
  name: string;
  gender: string;
  userId: number;
  userMail: string;
  departmentId: number;
  departmentName: string;
}

interface Department {
  departmentId: number;
  departmentName: string;
}

const defaultForm = {
  name: "",
  gender: "",
  departmentId: "",
  email: "",
  password: "",
};

export default function TeacherManage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<Teacher | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchTeachers = () => {
    setLoading(true);
    ApiService.get("/api/teachers")
      .then((res) => {
        const data = Array.isArray(res.data)
          ? res.data
          : res.data?.content ?? res.data?.data ?? [];
        setTeachers(data);
      })
      .catch((err) => { console.error("Teachers API error:", err); toast.error("Failed to load teachers"); })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTeachers();
    ApiService.get("/api/departments")
      .then((res) => {
        const data = Array.isArray(res.data)
          ? res.data
          : res.data?.content ?? res.data?.data ?? [];
        setDepartments(data);
      })
      .catch(() => toast.error("Failed to load departments"));
  }, []);

  const openAdd = () => {
    setEditTarget(null);
    setForm(defaultForm);
    setShowForm(true);
  };
  const openEdit = (t: Teacher) => {
    setEditTarget(t);
    setForm({
      name: t.name,
      gender: t.gender,
      departmentId: String(t.departmentId),
      email: t.userMail ?? "",
      password: "",
    });
    setShowForm(true);
  };
  const closeForm = () => {
    setShowForm(false);
    setEditTarget(null);
    setForm(defaultForm);
    setShowPassword(false);
    setFormError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.gender) return toast.error("Please select a gender");
    if (!form.departmentId) return toast.error("Please select a department");
    setSaving(true);
    setFormError(null);
    try {
      if (editTarget) {
        const payload = {
          name: form.name,
          gender: form.gender,
          departmentId: Number(form.departmentId),
        };
        // Changed from patch to put
        await ApiService.put(`/api/teachers/${editTarget.teacherId}`, payload);
        toast.success("Teacher updated successfully!");
      } else {
        const payload = {
          name: form.name,
          gender: form.gender,
          departmentId: Number(form.departmentId),
          user: { email: form.email, password: form.password },
        };
        await ApiService.post("/api/teachers/teacher", payload);
        toast.success("Teacher added successfully!");
      }
      closeForm();
      fetchTeachers();
    } catch (err: any) {
      const msg = ApiService.handleAxiosError(
        err,
        editTarget ? "Failed to update teacher" : "Failed to add teacher"
      );
      setFormError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await ApiService.delete(`/api/teachers/${id}`);
      toast.success("Teacher deleted");
      setTeachers((prev) => prev.filter((t) => t.teacherId !== id));
    } catch {
      toast.error("Failed to delete teacher");
    }
  };

  return (
    <div className="space-y-6 p-6 min-h-full bg-gradient-to-br from-[#FFFEF8] via-[#FFF7DA] to-[#FFE8AA]">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-500 px-8 py-7 text-black shadow-lg shadow-yellow-200">
        <p className="text-xs font-medium uppercase tracking-widest text-black/60 mb-1">Admin Panel</p>
        <h1 className="text-2xl font-bold">Teacher Management</h1>
        <p className="text-sm text-black/70 mt-1">Add, view, edit and delete teachers</p>
      </div>

      {/* Add Button */}
      <div className="flex justify-end">
        <button onClick={openAdd} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold hover:scale-105 transition">
          <Plus className="h-4 w-4" /> Add Teacher
        </button>
      </div>

      {/* Form Modal */}
      {showForm && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-md shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>
                {editTarget ? "Edit Teacher" : "Add New Teacher"}
              </CardTitle>
              <button onClick={closeForm}>
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {formError && (
                  <div className="rounded-xl bg-gradient-to-r from-yellow-50 to-orange-50 border border-orange-300 px-4 py-3 text-sm text-orange-700 font-medium">
                    ⚠️ {formError}
                  </div>
                )}
                <div className="space-y-1">
                  <Label>Name</Label>
                  <input
                    placeholder="Full name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    className="w-full rounded-md border border-input bg-amber-50 px-3 py-2 text-sm outline-none focus:border-orange-400 focus:bg-white transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <Label>Gender</Label>
                  <Select
                    value={form.gender}
                    onValueChange={(v) => setForm({ ...form, gender: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent className="z-[10000]" position="popper" sideOffset={4}>
                      <SelectItem value="MALE">Male</SelectItem>
                      <SelectItem value="FEMALE">Female</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label>Department <span className="text-red-500">*</span></Label>
                  <Select
                    value={form.departmentId}
                    onValueChange={(v) => setForm({ ...form, departmentId: v })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent className="z-[10000]">
                      {departments.map((d) => (
                        <SelectItem
                          key={d.departmentId}
                          value={String(d.departmentId)}
                        >
                          {d.departmentName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label>Email</Label>
                  <input
                    type="email"
                    placeholder="teacher@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required={!editTarget}
                    disabled={!!editTarget}
                    autoComplete="off"
                    className="w-full rounded-md border border-input bg-amber-50 px-3 py-2 text-sm outline-none focus:border-orange-400 focus:bg-white transition-colors disabled:opacity-60"
                  />
                </div>

                {!editTarget && (
                <div className="space-y-1">
                  <Label>Password</Label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      required
                      autoComplete="new-password"
                      className="w-full rounded-md border border-input bg-amber-50 px-3 py-2 pr-10 text-sm outline-none focus:border-orange-400 focus:bg-white transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button type="submit" className="flex-1" disabled={saving}>
                    {saving
                      ? "Saving..."
                      : editTarget
                      ? "Update Teacher"
                      : "Add Teacher"}
                  </Button>
                  <Button type="button" variant="outline" onClick={closeForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      , document.body)}

      {/* Teacher Table */}
      <div className="rounded-2xl border border-yellow-200 bg-white">
        <div className="flex flex-row items-center justify-between p-6 pb-4">
          <h2 className="text-base font-bold text-gray-800">All Teachers</h2>
          <span className="text-xs text-gray-500">{teachers.length} total</span>
        </div>
        <div className="px-6 pb-6">
          {loading ? (
            <p className="text-sm text-gray-500">Loading...</p>
          ) : teachers.length === 0 ? (
            <p className="text-sm text-gray-500">No teachers found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-yellow-200 text-left text-gray-500">
                    <th className="pb-3 pr-4">#</th>
                    <th className="pb-3 pr-4">ID</th>
                    <th className="pb-3 pr-4">Name</th>
                    <th className="pb-3 pr-4">Gender</th>
                    <th className="pb-3 pr-4">Department</th>
                    <th className="pb-3 pr-4">Email</th>
                    <th className="pb-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {teachers.map((t, i) => (
                    <tr key={t.teacherId} className="border-b border-yellow-100 last:border-0 hover:bg-yellow-50 transition-colors">
                      <td className="py-3 pr-4 text-gray-500">{i + 1}</td>
                      <td className="py-3 pr-4 text-gray-500">{t.teacherId}</td>
                      <td className="py-3 pr-4 font-medium text-gray-800">{t.name}</td>
                      <td className="py-3 pr-4 text-gray-600">{t.gender}</td>
                      <td className="py-3 pr-4 text-gray-600">{t.departmentId} - {t.departmentName}</td>
                      <td className="py-3 pr-4 text-gray-600">{t.userMail ?? "-"}</td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => openEdit(t)} className="inline-flex items-center gap-1 rounded-lg bg-yellow-100 px-3 py-1.5 text-xs font-medium text-orange-600 hover:bg-yellow-500/30 transition-colors">
                            <Pencil className="h-3 w-3" /> Edit
                          </button>
                          <button onClick={() => handleDelete(t.teacherId)} className="inline-flex items-center gap-1 rounded-lg bg-red-100 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-500/30 transition-colors">
                            <Trash2 className="h-3 w-3" /> Delete
                          </button>
                        </div>
                      </td>
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
