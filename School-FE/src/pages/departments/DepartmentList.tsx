import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, X } from "lucide-react";
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

interface Department {
  departmentId: number;
  departmentName: string;
  description: string;
  headOfDepartment: string | null;
  email: string;
}

interface Teacher {
  teacherId: number;
  name: string;
  departmentId: number;
}

const defaultForm = { departmentName: "", description: "", email: "" };

export default function DepartmentList() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<Department | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);
  const [assigningDeptId, setAssigningDeptId] = useState<number | null>(null);

  const fetchDepartments = () => {
    setLoading(true);
    ApiService.get("/api/departments")
      .then((res) => setDepartments(res.data))
      .catch(() => toast.error("Failed to load departments"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDepartments();
    ApiService.get("/api/teachers")
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data?.content ?? res.data?.data ?? [];
        setTeachers(data);
      })
      .catch(() => toast.error("Failed to load teachers"));
  }, []);

  const openAdd = () => { setEditTarget(null); setForm(defaultForm); setShowForm(true); };
  const openEdit = (d: Department) => {
    setEditTarget(d);
    setForm({ departmentName: d.departmentName, description: d.description, email: d.email });
    setShowForm(true);
  };
  const closeForm = () => { setShowForm(false); setEditTarget(null); setForm(defaultForm); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editTarget) {
        await ApiService.put(`/api/departments/${editTarget.departmentId}`, form);
        toast.success("Department updated successfully!");
      } else {
        await ApiService.post("/api/departments", form);
        toast.success("Department created successfully!");
      }
      closeForm();
      fetchDepartments();
    } catch {
      toast.error(editTarget ? "Failed to update department" : "Failed to create department");
    } finally {
      setSaving(false);
    }
  };

  const handleAssignHOD = async (deptId: number, teacherId: string) => {
    if (!teacherId) return;
    setAssigningDeptId(deptId);
    try {
      await ApiService.put(`/api/departments/hod/${deptId}/${teacherId}`, {});
      const teacher = teachers.find((t) => String(t.teacherId) === teacherId);
      toast.success("HOD assigned successfully!");
      setDepartments((prev) =>
        prev.map((d) =>
          d.departmentId === deptId
            ? { ...d, headOfDepartment: teacher?.name ?? null }
            : d
        )
      );
    } catch {
      toast.error("Failed to assign HOD");
    } finally {
      setAssigningDeptId(null);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await ApiService.delete(`/api/departments/${id}`);
      toast.success("Department deleted");
      setDepartments((prev) => prev.filter((d) => d.departmentId !== id));
    } catch {
      toast.error("Failed to delete department");
    }
  };

  return (
    <div className="space-y-6 p-6 min-h-full bg-gradient-to-br from-[#FFFEF8] via-[#FFF7DA] to-[#FFE8AA]">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-500 px-8 py-7 text-black shadow-lg shadow-yellow-200">
        <p className="text-xs font-medium uppercase tracking-widest text-black/60 mb-1">Admin Panel</p>
        <h1 className="text-2xl font-bold">Departments</h1>
        <p className="text-sm text-black/70 mt-1">Manage university departments</p>
      </div>

      {/* Add Button */}
      <div className="flex justify-end">
        <button onClick={openAdd} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold hover:scale-105 transition">
          <Plus className="h-4 w-4" /> Add Department
        </button>
      </div>

      {/* Add Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-md shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{editTarget ? "Edit Department" : "Add New Department"}</CardTitle>
              <button onClick={closeForm}>
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <Label>Department Name</Label>
                  <Input
                    placeholder="e.g. Computer Science"
                    value={form.departmentName}
                    onChange={(e) => setForm({ ...form, departmentName: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label>Description</Label>
                  <Input
                    placeholder="Brief description"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    placeholder="dept@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <Button type="submit" className="flex-1" disabled={saving}>
                    {saving ? "Saving..." : editTarget ? "Update Department" : "Create Department"}
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

      {/* Department Table */}
      <div className="rounded-2xl border border-yellow-200 bg-white">
        <div className="flex flex-row items-center justify-between p-6 pb-4">
          <h2 className="text-base font-bold text-gray-800">All Departments</h2>
          <span className="text-xs text-gray-500">{departments.length} total</span>
        </div>
        <div className="px-6 pb-6">
          {loading ? (
            <p className="text-sm text-gray-500">Loading...</p>
          ) : departments.length === 0 ? (
            <p className="text-sm text-gray-500">No departments found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-yellow-200 text-left text-gray-500">
                    <th className="pb-3 pr-4">#</th>
                    <th className="pb-3 pr-4">ID</th>
                    <th className="pb-3 pr-4">Department Name</th>
                    <th className="pb-3 pr-4">Description</th>
                    <th className="pb-3 pr-4">Head of Dept</th>
                    <th className="pb-3 pr-4">Email</th>
                    <th className="pb-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {departments.map((d, i) => (
                    <tr key={d.departmentId} className="border-b border-yellow-100 last:border-0 hover:bg-yellow-50 transition-colors">
                      <td className="py-3 pr-4 text-gray-500">{i + 1}</td>
                      <td className="py-3 pr-4 text-gray-500">{d.departmentId}</td>
                      <td className="py-3 pr-4 font-medium text-gray-800">{d.departmentName}</td>
                      <td className="py-3 pr-4 text-gray-600">{d.description}</td>
                      <td className="py-3 pr-4 text-gray-600">
                        {(() => {
                          const deptTeachers = teachers.filter((t) => t.departmentId === d.departmentId);
                          const currentHod = deptTeachers.find((t) => t.name === d.headOfDepartment);
                          return (
                            <Select
                              value={currentHod ? String(currentHod.teacherId) : ""}
                              onValueChange={(v) => handleAssignHOD(d.departmentId, v)}
                              disabled={assigningDeptId === d.departmentId}
                            >
                              <SelectTrigger className="h-8 w-44 text-xs bg-white border-yellow-200 text-gray-600">
                                <SelectValue placeholder="Assign HOD" />
                              </SelectTrigger>
                              <SelectContent>
                                {deptTeachers.map((t) => (
                                  <SelectItem key={t.teacherId} value={String(t.teacherId)}>
                                    {t.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          );
                        })()}
                      </td>
                      <td className="py-3 pr-4 text-gray-600">{d.email}</td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => openEdit(d)} className="inline-flex items-center gap-1 rounded-lg bg-yellow-100 px-3 py-1.5 text-xs font-medium text-orange-600 hover:bg-yellow-500/30 transition-colors">
                            <Pencil className="h-3 w-3" /> Edit
                          </button>
                          <button onClick={() => handleDelete(d.departmentId)} className="inline-flex items-center gap-1 rounded-lg bg-red-100 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-500/30 transition-colors">
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
